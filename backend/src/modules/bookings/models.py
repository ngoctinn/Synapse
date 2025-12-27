"""
Bookings Module - Database Models
"""

import uuid
from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum
from sqlalchemy import Enum as SAEnum
from sqlmodel import SQLModel, Field, Relationship, DateTime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.modules.customers import Customer
    from src.modules.users import User
    from src.modules.services import Service
    from src.modules.staff import Staff
    from src.modules.resources import Resource
    from src.modules.customer_treatments import CustomerTreatment


class BookingStatus(str, Enum):
    """Trạng thái lifecycle của booking."""
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    NO_SHOW = "NO_SHOW"


class NoteType(str, Enum):
    """Loại ghi chú chuyên môn."""
    PROFESSIONAL = "PROFESSIONAL"  # Ghi chú chuyên môn (da, tóc, phản ứng)
    GENERAL = "GENERAL"  # Ghi chú chung


class BookingItemResource(SQLModel, table=True):
    """
    Bảng trung gian: BookingItem ↔ Resource (N-N)

    1 BookingItem có thể chiếm N Resources (VD: 1 Giường + 1 Máy)
    """
    __tablename__ = "booking_item_resources"

    booking_item_id: uuid.UUID = Field(
        foreign_key="booking_items.id",
        primary_key=True,
        ondelete="CASCADE"
    )
    resource_id: uuid.UUID = Field(
        foreign_key="resources.id",
        primary_key=True,
        ondelete="CASCADE"
    )


class BookingItem(SQLModel, table=True):
    """
    Chi tiết từng dịch vụ trong lịch hẹn.
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
    # Removed single resource_id, moved to BookingItemResource
    treatment_id: uuid.UUID | None = Field(
        default=None,
        foreign_key="customer_treatments.id",
        ondelete="SET NULL"
    )
    service_name_snapshot: str | None = Field(default=None, max_length=255)
    start_time: datetime = Field(sa_type=DateTime(timezone=True))
    end_time: datetime = Field(sa_type=DateTime(timezone=True))
    original_price: Decimal = Field(
        default=0,
        max_digits=12, decimal_places=2
    )
    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    booking: "Booking" = Relationship(back_populates="items")
    service: "Service" = Relationship()
    staff: "Staff" = Relationship()
    treatment: "CustomerTreatment" = Relationship()

    # New Relationship: Resources assigned to this item
    resources: list["Resource"] = Relationship(link_model=BookingItemResource)

    @property
    def resource_ids(self) -> list[uuid.UUID]:
        """Helper for Pydantic schema mapping."""
        return [r.id for r in self.resources]

    @property
    def duration_minutes(self) -> int:
        delta = self.end_time - self.start_time
        return int(delta.total_seconds() / 60)


class Booking(SQLModel, table=True):
    """
    Lịch hẹn của khách hàng.
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
        default=BookingStatus.CONFIRMED,
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
        default=0,
        max_digits=12, decimal_places=2
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
    treatment_notes: list["TreatmentNote"] = Relationship(back_populates="booking")
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
        self.total_price = sum(item.original_price for item in self.items)

    def recalculate_time_range(self) -> None:
        if self.items:
            self.start_time = min(item.start_time for item in self.items)
            self.end_time = max(item.end_time for item in self.items)


# ============================================================================
# TREATMENT NOTES (Ghi chú chuyên môn)
# ============================================================================

class TreatmentNote(SQLModel, table=True):
    """
    Ghi chú chuyên môn sau buổi hẹn.

    KTV ghi lại tình trạng da/tóc, phản ứng của khách sau dịch vụ
    để phục vụ tốt hơn cho các lần tiếp theo.
    """
    __tablename__ = "treatment_notes"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    booking_id: uuid.UUID = Field(
        foreign_key="bookings.id",
        ondelete="CASCADE"
    )
    staff_id: uuid.UUID = Field(
        foreign_key="users.id",
        ondelete="CASCADE"
    )

    content: str = Field(max_length=1000)
    note_type: NoteType = Field(
        default=NoteType.PROFESSIONAL,
        sa_type=SAEnum(NoteType, name="note_type")
    )

    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    booking: "Booking" = Relationship(back_populates="treatment_notes")
    staff: "User" = Relationship()
