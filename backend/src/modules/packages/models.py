"""
Packages Module - Database Models
Định nghĩa các Entity liên quan đến Gói dịch vụ (Combo)
"""

import uuid
from datetime import datetime, timezone
from decimal import Decimal
from sqlmodel import SQLModel, Field, Relationship, DateTime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.modules.services.models import Service

class PackageService(SQLModel, table=True):
    """
    Bảng trung gian: Gói ↔ Dịch vụ (N-N).
    Định nghĩa một gói gồm bao nhiêu buổi của dịch vụ nào.
    """
    __tablename__ = "package_services"

    package_id: uuid.UUID = Field(
        primary_key=True,
        foreign_key="service_packages.id",
        ondelete="CASCADE"
    )
    service_id: uuid.UUID = Field(
        primary_key=True,
        foreign_key="services.id",
        ondelete="CASCADE"
    )
    quantity: int = Field(default=1, ge=1)

    package: "ServicePackage" = Relationship(back_populates="services")
    service: "Service" = Relationship()

    @property
    def service_name(self) -> str | None:
        return self.service.name if self.service else None

class ServicePackage(SQLModel, table=True):
    """
    Định nghĩa Gói dịch vụ (Combo) - Sản phẩm bán lẻ.
    """
    __tablename__ = "service_packages"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    description: str | None = None
    price: Decimal = Field(default=0, max_digits=12, decimal_places=2)
    validity_days: int | None = Field(default=None, ge=1)
    is_active: bool = Field(default=True)

    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    services: list[PackageService] = Relationship(back_populates="package")
