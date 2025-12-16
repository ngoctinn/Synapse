"""
Resources Module - Database Models

Định nghĩa các Entity liên quan đến Tài nguyên (Resources):
- ResourceGroup: Nhóm tài nguyên logic (Phòng đơn, Máy Laser...)
- Resource: Tài nguyên vật lý cụ thể (Phòng VIP 1, Máy 01...)
- ServiceResourceRequirement: Bảng trung gian Service ↔ ResourceGroup
"""

import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy import DateTime
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.modules.services.models import Service


class ResourceType(str, Enum):
    """Loại nhóm tài nguyên."""
    ROOM = "ROOM"
    EQUIPMENT = "EQUIPMENT"


class ResourceStatus(str, Enum):
    """Trạng thái tài nguyên."""
    ACTIVE = "ACTIVE"
    MAINTENANCE = "MAINTENANCE"
    INACTIVE = "INACTIVE"


class ServiceResourceRequirement(SQLModel, table=True):
    """
    Bảng trung gian: Service ↔ ResourceGroup (N-N)

    Định nghĩa dịch vụ cần bao nhiêu tài nguyên thuộc nhóm nào.
    VD: Massage Body cần 1 Phòng đơn.
    """
    __tablename__ = "service_resource_requirements"

    service_id: uuid.UUID = Field(
        foreign_key="services.id",
        primary_key=True,
        ondelete="CASCADE"
    )
    group_id: uuid.UUID = Field(
        foreign_key="resource_groups.id",
        primary_key=True,
        ondelete="CASCADE"
    )
    quantity: int = Field(default=1, ge=1)

    # Relationships
    service: "Service" = Relationship(back_populates="resource_requirements")
    group: "ResourceGroup" = Relationship(back_populates="service_links")


class ResourceGroup(SQLModel, table=True):
    """
    Nhóm tài nguyên logic.

    VD: "Phòng đơn", "Phòng VIP", "Máy Laser", "Giường Massage"
    Dùng để định nghĩa YÊU CẦU tài nguyên cho dịch vụ.
    """
    __tablename__ = "resource_groups"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=100)
    type: ResourceType
    description: str | None = None
    deleted_at: datetime | None = None
    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    resources: list["Resource"] = Relationship(back_populates="group")
    service_links: list[ServiceResourceRequirement] = Relationship(
        back_populates="group"
    )


class Resource(SQLModel, table=True):
    """
    Tài nguyên vật lý cụ thể.

    VD: "Phòng VIP 1", "Phòng 02", "Máy Laser 01"
    Đây là những thực thể thực sự được đặt lịch.
    """
    __tablename__ = "resources"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    group_id: uuid.UUID | None = Field(
        default=None,
        foreign_key="resource_groups.id",
        ondelete="SET NULL"
    )
    name: str = Field(max_length=100)
    code: str | None = Field(default=None, max_length=50, unique=True)
    status: ResourceStatus = Field(default=ResourceStatus.ACTIVE)
    capacity: int = Field(default=1, ge=1)
    setup_time_minutes: int = Field(default=0, ge=0)
    description: str | None = None
    image_url: str | None = None
    deleted_at: datetime | None = None
    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    group: ResourceGroup | None = Relationship(back_populates="resources")
