"""
Operating Hours Module - Pydantic Schemas (DTOs)

Request/Response schemas cho API endpoints.
"""

import uuid
from datetime import time, date
from pydantic import BaseModel, ConfigDict, Field

from .models import ExceptionDateType


# ============================================================================
# REGULAR OPERATING HOURS SCHEMAS
# ============================================================================

class OperatingHourPeriod(BaseModel):
    """Một ca hoạt động trong ngày."""
    period_number: int = Field(ge=1, description="Số thứ tự ca")
    open_time: time
    close_time: time
    is_closed: bool = False

    model_config = ConfigDict(from_attributes=True)


class DayOperatingHours(BaseModel):
    """Giờ hoạt động của một ngày cụ thể."""
    day_of_week: int = Field(ge=1, le=7, description="1=Thứ 2, 7=Chủ nhật")
    day_name: str = Field(description="Tên ngày tiếng Việt")
    periods: list[OperatingHourPeriod] = Field(default_factory=list)
    is_closed: bool = False

    model_config = ConfigDict(from_attributes=True)


class WeekOperatingHoursRead(BaseModel):
    """Response chứa giờ hoạt động cả tuần."""
    days: list[DayOperatingHours]

    model_config = ConfigDict(from_attributes=True)


class OperatingHourUpdate(BaseModel):
    """Request cập nhật giờ hoạt động một ngày."""
    day_of_week: int = Field(ge=1, le=7)
    periods: list[OperatingHourPeriod]
    is_closed: bool = False


class WeekOperatingHoursUpdate(BaseModel):
    """Request cập nhật giờ hoạt động cả tuần."""
    days: list[OperatingHourUpdate]


# ============================================================================
# EXCEPTION DATES SCHEMAS
# ============================================================================

class ExceptionDateBase(BaseModel):
    """Base schema cho exception date."""
    exception_date: date
    type: ExceptionDateType = ExceptionDateType.CUSTOM
    open_time: time | None = None
    close_time: time | None = None
    is_closed: bool = True
    reason: str | None = None


class ExceptionDateCreate(ExceptionDateBase):
    """Request tạo ngày ngoại lệ."""
    pass


class ExceptionDateUpdate(BaseModel):
    """Request cập nhật ngày ngoại lệ (partial)."""
    type: ExceptionDateType | None = None
    open_time: time | None = None
    close_time: time | None = None
    is_closed: bool | None = None
    reason: str | None = None


class ExceptionDateRead(ExceptionDateBase):
    """Response chi tiết ngày ngoại lệ."""
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


class ExceptionDateListResponse(BaseModel):
    """Response danh sách ngày ngoại lệ."""
    items: list[ExceptionDateRead]
    total: int
