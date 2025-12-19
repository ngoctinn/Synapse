"""
Bookings Module - Database Models

🔥 ĐÂY LÀ MODULE QUAN TRỌNG NHẤT CỦA HỆ THỐNG

Định nghĩa:
- Booking: Lịch hẹn tổng của khách
- BookingItem: Chi tiết từng dịch vụ (Activity trong mô hình RCPSP)
- BookingStatus: Trạng thái lifecycle của booking
"""

import uuid
from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum
from sqlalchemy import DateTime, DECIMAL, Enum as SAEnum
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.modules.customers.models import Customer
    from src.modules.users.models import User
    from src.modules.services.models import Service
    from src.modules.staff.models import Staff
    from src.modules.resources.models import Resource
    from src.modules.customer_treatments.models import CustomerTreatment


class BookingStatus(str, Enum):
    """Trạng thái lifecycle của booking."""
    PENDING = "PENDING"          # Chờ xác nhận
    CONFIRMED = "CONFIRMED"      # Đã xác nhận
    IN_PROGRESS = "IN_PROGRESS"  # Đang thực hiện
    COMPLETED = "COMPLETED"      # Hoàn thành
    CANCELLED = "CANCELLED"      # Đã hủy
    NO_SHOW = "NO_SHOW"          # Khách không đến


class BookingItem(SQLModel, table=True):
    """
    Chi tiết từng dịch vụ trong lịch hẹn.

    ⚡ ĐÂY LÀ ACTIVITY TRONG MÔ HÌNH RCPSP:
    - start_time, end_time: Processing time
    - staff_id: Resource (con người)
    - resource_id: Resource (vật lý - phòng/máy)
    """
    __tablename__ = "booking_items"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    booking_id: uuid.UUID = Field(
        foreign_key="bookings.id",
        ondelete="CASCADE"
    )
    service_id: uuid.UUID | None = Field(
        default=None,
        foreign_key="services.id",
        ondelete="SET NULL"
    )
    staff_id: uuid.UUID | None = Field(
        default=None,
        foreign_key="staff.user_id",
        ondelete="SET NULL"
    )
    resource_id: uuid.UUID | None = Field(
        default=None,
        foreign_key="resources.id",
        ondelete="SET NULL"
    )
    treatment_id: uuid.UUID | None = Field(
        default=None,
        foreign_key="customer_treatments.id",
        ondelete="SET NULL"
    )
    service_name_snapshot: str | None = Field(default=None, max_length=255)
    start_time: datetime = Field(sa_type=DateTime(timezone=True))
    end_time: datetime = Field(sa_type=DateTime(timezone=True))
    original_price: Decimal = Field(
        default=Decimal("0"),
        sa_type=DECIMAL(12, 2)
    )
    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    booking: "Booking" = Relationship(back_populates="items")
    service: "Service" = Relationship()
    staff: "Staff" = Relationship()
    resource: "Resource" = Relationship()
    treatment: "CustomerTreatment" = Relationship()

    @property
    def duration_minutes(self) -> int:
        """Thời lượng dịch vụ (phút)."""
        delta = self.end_time - self.start_time
        return int(delta.total_seconds() / 60)


class Booking(SQLModel, table=True):
    """
    Lịch hẹn của khách hàng.

    Một Booking có thể chứa nhiều BookingItems (nhiều dịch vụ).
    """
    __tablename__ = "bookings"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    customer_id: uuid.UUID | None = Field(
        default=None,
        foreign_key="customers.id",
        ondelete="SET NULL"
    )
    created_by: uuid.UUID | None = Field(
        default=None,
        foreign_key="users.id",
        ondelete="SET NULL"
    )
    start_time: datetime = Field(sa_type=DateTime(timezone=True))
    end_time: datetime = Field(sa_type=DateTime(timezone=True))
    status: BookingStatus = Field(
        default=BookingStatus.PENDING,
        sa_type=SAEnum(BookingStatus, name="booking_status")
    )
    notes: str | None = None
    cancel_reason: str | None = None
    check_in_time: datetime | None = Field(
        default=None,
        sa_type=DateTime(timezone=True)
    )
    actual_start_time: datetime | None = Field(
        default=None,
        sa_type=DateTime(timezone=True)
    )
    actual_end_time: datetime | None = Field(
        default=None,
        sa_type=DateTime(timezone=True)
    )
    total_price: Decimal = Field(
        default=Decimal("0"),
        sa_type=DECIMAL(12, 2)
    )
    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    items: list[BookingItem] = Relationship(back_populates="booking")
    customer: "Customer" = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Booking.customer_id]"
        }
    )
    creator: "User" = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Booking.created_by]"
        }
    )

    def recalculate_total(self) -> None:
        """Tính lại tổng giá từ items."""
        self.total_price = sum(item.original_price for item in self.items)

    def recalculate_time_range(self) -> None:
        """Tính lại start/end time từ items."""
        if self.items:
            self.start_time = min(item.start_time for item in self.items)
            self.end_time = max(item.end_time for item in self.items)
