"""
Schedules Module - Pydantic Schemas (DTOs)

Tuân thủ Pydantic V2 với model_config = ConfigDict(...).
"""

import uuid
from datetime import datetime, time, date
from pydantic import BaseModel, ConfigDict, Field, field_validator

from .models import ScheduleStatus


# ============================================================================
# SHIFTS
# ============================================================================

class ShiftBase(BaseModel):
    """Schema cơ sở cho Shift."""
    name: str = Field(..., min_length=1, max_length=100, description="Tên ca")
    start_time: time = Field(..., description="Giờ bắt đầu (HH:MM)")
    end_time: time = Field(..., description="Giờ kết thúc (HH:MM)")
    color_code: str | None = Field(None, max_length=7, description="Mã màu (#RRGGBB)")

    @field_validator("color_code", mode="before")
    @classmethod
    def validate_color_code(cls, v: str | None) -> str | None:
        if v is None:
            return None
        if not v.startswith("#") or len(v) != 7:
            raise ValueError("Mã màu phải có format #RRGGBB")
        return v.upper()


class ShiftCreate(ShiftBase):
    """Schema tạo mới Shift."""
    pass


class ShiftUpdate(BaseModel):
    """Schema cập nhật Shift."""
    name: str | None = Field(None, min_length=1, max_length=100)
    start_time: time | None = None
    end_time: time | None = None
    color_code: str | None = None


class ShiftRead(ShiftBase):
    """Schema đọc Shift."""
    id: uuid.UUID
    created_at: datetime
    duration_hours: float | None = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# STAFF SCHEDULES
# ============================================================================

class StaffScheduleBase(BaseModel):
    """Schema cơ sở cho StaffSchedule."""
    staff_id: uuid.UUID
    shift_id: uuid.UUID
    work_date: date
    notes: str | None = None


class StaffScheduleCreate(StaffScheduleBase):
    """Schema tạo mới StaffSchedule."""
    status: ScheduleStatus = ScheduleStatus.DRAFT


class StaffScheduleBulkCreate(BaseModel):
    """Schema tạo nhiều lịch cùng lúc."""
    staff_ids: list[uuid.UUID] = Field(..., min_length=1)
    shift_id: uuid.UUID
    work_dates: list[date] = Field(..., min_length=1)
    status: ScheduleStatus = ScheduleStatus.DRAFT


class StaffScheduleUpdate(BaseModel):
    """Schema cập nhật StaffSchedule."""
    shift_id: uuid.UUID | None = None
    work_date: date | None = None
    status: ScheduleStatus | None = None
    notes: str | None = None


class StaffScheduleRead(StaffScheduleBase):
    """Schema đọc StaffSchedule."""
    id: uuid.UUID
    status: ScheduleStatus
    created_at: datetime
    shift: ShiftRead | None = None

    model_config = ConfigDict(from_attributes=True)


class StaffScheduleWithStaff(StaffScheduleRead):
    """Schema StaffSchedule kèm thông tin staff."""
    staff_name: str | None = None


# ============================================================================
# AVAILABILITY QUERY
# ============================================================================

class TimeSlot(BaseModel):
    """Khung giờ làm việc."""
    start_time: time
    end_time: time
    shift_name: str
    shift_id: uuid.UUID


class StaffAvailability(BaseModel):
    """Kết quả truy vấn khả dụng của KTV."""
    staff_id: uuid.UUID
    work_date: date
    time_slots: list[TimeSlot] = []
    total_hours: float = 0.0


class DateAvailability(BaseModel):
    """Tất cả KTV làm việc trong ngày."""
    work_date: date
    schedules: list[StaffScheduleWithStaff] = []
