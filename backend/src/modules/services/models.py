"""
Services Module - Database Models

Định nghĩa các Entity liên quan đến Dịch vụ:
- ServiceCategory: Danh mục dịch vụ
- Skill: Kỹ năng chuyên môn
- ServiceSkill: Bảng trung gian Service ↔ Skill (N-N)
- Service: Dịch vụ Spa
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import ForeignKey, DateTime
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.modules.resources.models import ServiceResourceRequirement


# 0. Bảng Danh mục Dịch vụ
class ServiceCategory(SQLModel, table=True):
    """
    Danh mục phân loại dịch vụ Spa.
    VD: Massage, Skincare, Tẩy da chết, Chăm sóc móng...
    """
    __tablename__ = "service_categories"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=100, unique=True)
    description: str | None = None
    sort_order: int = Field(default=0)
    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationship: Một Category có nhiều Services
    services: list["Service"] = Relationship(back_populates="category")


# 1. Bảng Trung gian: Dịch vụ cần Kỹ năng gì
class ServiceSkill(SQLModel, table=True):
    """
    Bảng trung gian: Service ↔ Skill (N-N).
    Định nghĩa dịch vụ cần kỹ năng gì với mức tối thiểu bao nhiêu.
    """
    __tablename__ = "service_skills"

    service_id: uuid.UUID = Field(
        primary_key=True,
        sa_column_args=[ForeignKey("services.id", ondelete="CASCADE")]
    )
    skill_id: uuid.UUID = Field(
        primary_key=True,
        sa_column_args=[ForeignKey("skills.id", ondelete="CASCADE")]
    )
    # Mức kỹ năng tối thiểu yêu cầu (1=Cơ bản, 2=Thành thạo, 3=Chuyên gia)
    min_proficiency_level: int = Field(default=1, ge=1, le=3)

    service: "Service" = Relationship(back_populates="skill_links")
    skill: "Skill" = Relationship(back_populates="service_links")


# 2. Bảng Kỹ năng (Atomic)
class Skill(SQLModel, table=True):
    """
    Danh mục kỹ năng chuyên môn.
    VD: Massage Body, Facial Care, Waxing...
    """
    __tablename__ = "skills"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    code: str = Field(unique=True, index=True)
    description: str | None = None

    # Quan hệ Many-to-Many với Service
    service_links: list[ServiceSkill] = Relationship(back_populates="skill")
    services: list["Service"] = Relationship(
        back_populates="skills",
        link_model=ServiceSkill,
        sa_relationship_kwargs={"viewonly": True}
    )


# 3. Bảng Dịch vụ (Product)
class Service(SQLModel, table=True):
    """
    Dịch vụ Spa - Sản phẩm chính của hệ thống.
    """
    __tablename__ = "services"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    category_id: uuid.UUID | None = Field(
        default=None,
        foreign_key="service_categories.id",
        ondelete="SET NULL"
    )
    name: str = Field(index=True)
    duration: int  # Phút (VD: 60)
    buffer_time: int = Field(default=15)  # Phút nghỉ giữa các ca
    price: float = Field(default=0.0)
    description: str | None = None
    image_url: str | None = None
    is_active: bool = Field(default=True)
    deleted_at: datetime | None = None  # Soft Delete

    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    category: ServiceCategory | None = Relationship(back_populates="services")
    skill_links: list[ServiceSkill] = Relationship(back_populates="service")
    skills: list[Skill] = Relationship(
        back_populates="services",
        link_model=ServiceSkill,
        sa_relationship_kwargs={"viewonly": True}
    )
    # Yêu cầu tài nguyên (forward reference để tránh circular import)
    resource_requirements: list["ServiceResourceRequirement"] = Relationship(
        back_populates="service"
    )
