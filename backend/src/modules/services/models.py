import uuid
from datetime import datetime, timezone
from sqlalchemy import ForeignKey
from sqlmodel import SQLModel, Field, Relationship

# 1. Bảng Trung gian: Dịch vụ cần Kỹ năng gì
class ServiceSkill(SQLModel, table=True):
    __tablename__ = "service_skills"

    service_id: uuid.UUID = Field(
        primary_key=True,
        sa_column_args=[ForeignKey("services.id", ondelete="CASCADE")]
    )
    skill_id: uuid.UUID = Field(
        primary_key=True,
        sa_column_args=[ForeignKey("skills.id", ondelete="CASCADE")]
    )

    service: "Service" = Relationship(back_populates="skill_links")
    skill: "Skill" = Relationship(back_populates="service_links")

# 2. Bảng Kỹ năng (Atomic)
class Skill(SQLModel, table=True):
    __tablename__ = "skills"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True) # VD: Massage Body
    code: str = Field(unique=True, index=True) # VD: SK_MASSAGE_BODY
    description: str | None = None

    # Quan hệ Many-to-Many với Service
    service_links: list[ServiceSkill] = Relationship(back_populates="skill")
    services: list["Service"] = Relationship(back_populates="skills", link_model=ServiceSkill)

# 3. Bảng Dịch vụ (Product)
class Service(SQLModel, table=True):
    __tablename__ = "services"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    duration: int # Phút (VD: 60)
    buffer_time: int = Field(default=15) # Phút (VD: 15)
    price: float = Field(default=0.0)
    image_url: str | None = None
    is_active: bool = Field(default=True)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None))

    # Quan hệ Many-to-Many với Skill
    skill_links: list[ServiceSkill] = Relationship(back_populates="service")
    skills: list[Skill] = Relationship(back_populates="services", link_model=ServiceSkill)
