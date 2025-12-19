"""
Bookings Module - Pydantic Schemas (DTOs)

Tuân thủ Pydantic V2 với model_config = ConfigDict(...).
"""

import uuid
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field, field_validator

from .models import BookingStatus


# ============================================================================
# BOOKING ITEMS
# ============================================================================

class BookingItemBase(BaseModel):
    """Schema cơ sở cho BookingItem."""
    service_id: uuid.UUID
    start_time: datetime
    end_time: datetime

    @field_validator("end_time", mode="after")
    @classmethod
    def validate_time_range(cls, v: datetime, info) -> datetime:
        start = info.data.get("start_time")
        if start and v <= start:
            raise ValueError("Thời gian kết thúc phải sau thời gian bắt đầu")
        return v


class BookingItemCreate(BookingItemBase):
    """Schema tạo BookingItem."""
    staff_id: uuid.UUID | None = None
    resource_id: uuid.UUID | None = None
    treatment_id: uuid.UUID | None = None


class BookingItemUpdate(BaseModel):
    """Schema cập nhật BookingItem."""
    staff_id: uuid.UUID | None = None
    resource_id: uuid.UUID | None = None
    treatment_id: uuid.UUID | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None


class BookingItemRead(BaseModel):
    """Schema đọc BookingItem."""
    id: uuid.UUID
    booking_id: uuid.UUID
    service_id: uuid.UUID | None
    staff_id: uuid.UUID | None
    resource_id: uuid.UUID | None
    treatment_id: uuid.UUID | None
    service_name_snapshot: str | None
    start_time: datetime
    end_time: datetime
    original_price: Decimal
    duration_minutes: int | None = None

    # Thông tin bổ sung
    staff_name: str | None = None
    resource_name: str | None = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# BOOKINGS
# ============================================================================

class BookingBase(BaseModel):
    """Schema cơ sở cho Booking."""
    customer_id: uuid.UUID | None = None
    notes: str | None = None


class BookingCreate(BookingBase):
    """Schema tạo Booking mới."""
    items: list[BookingItemCreate] = Field(..., min_length=1)


class BookingUpdate(BaseModel):
    """Schema cập nhật Booking."""
    notes: str | None = None
    customer_id: uuid.UUID | None = None


class BookingRead(BaseModel):
    """Schema đọc Booking."""
    id: uuid.UUID
    customer_id: uuid.UUID | None
    created_by: uuid.UUID | None
    start_time: datetime
    end_time: datetime
    status: BookingStatus
    notes: str | None
    cancel_reason: str | None
    check_in_time: datetime | None
    total_price: Decimal
    created_at: datetime
    updated_at: datetime
    items: list[BookingItemRead] = []

    # Thông tin bổ sung
    customer_name: str | None = None
    creator_name: str | None = None

    model_config = ConfigDict(from_attributes=True)


class BookingListItem(BaseModel):
    """Schema cho danh sách Booking (không include items)."""
    id: uuid.UUID
    customer_id: uuid.UUID | None
    start_time: datetime
    end_time: datetime
    status: BookingStatus
    total_price: Decimal
    items_count: int = 0
    customer_name: str | None = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# STATUS TRANSITIONS
# ============================================================================

class BookingConfirm(BaseModel):
    """Schema xác nhận booking."""
    pass  # Không cần thêm data


class BookingCheckIn(BaseModel):
    """Schema check-in."""
    check_in_time: datetime | None = None  # Nếu None thì dùng NOW()


class BookingComplete(BaseModel):
    """Schema hoàn thành booking."""
    actual_end_time: datetime | None = None


class BookingCancel(BaseModel):
    """Schema hủy booking."""
    cancel_reason: str = Field(..., min_length=1, max_length=500)


class BookingNoShow(BaseModel):
    """Schema đánh dấu khách không đến."""
    pass


# ============================================================================
# CONFLICT CHECK
# ============================================================================

class ConflictCheckRequest(BaseModel):
    """Request kiểm tra xung đột."""
    staff_id: uuid.UUID | None = None
    resource_id: uuid.UUID | None = None
    start_time: datetime
    end_time: datetime
    exclude_item_id: uuid.UUID | None = None
    check_schedule: bool = False


class ConflictCheckResponse(BaseModel):
    """Response kiểm tra xung đột."""
    has_conflict: bool
    conflicts: list[dict] = []


# ============================================================================
# AVAILABILITY
# ============================================================================

class StaffSlot(BaseModel):
    """Slot thời gian của KTV."""
    start_time: datetime
    end_time: datetime
    is_booked: bool
    booking_id: uuid.UUID | None = None
    service_name: str | None = None


class ResourceSlot(BaseModel):
    """Slot thời gian của Phòng."""
    start_time: datetime
    end_time: datetime
    is_booked: bool
    booking_id: uuid.UUID | None = None
