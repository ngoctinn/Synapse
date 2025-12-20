"""
Operating Hours Module - Database Models

Định nghĩa các Entity cho quản lý giờ hoạt động Spa.
"""

import uuid
from datetime import time, date
from enum import Enum
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Time


class ExceptionDateType(str, Enum):
    """Loại ngày ngoại lệ."""
    HOLIDAY = "HOLIDAY"
    MAINTENANCE = "MAINTENANCE"
    CUSTOM = "CUSTOM"


class RegularOperatingHours(SQLModel, table=True):
    """
    Giờ hoạt động thường xuyên theo ngày trong tuần.

    Mỗi ngày có thể có nhiều period (VD: Sáng 8-12, Chiều 14-20).
    """
    __tablename__ = "regular_operating_hours"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    day_of_week: int = Field(ge=1, le=7, description="1=Thứ 2, 7=Chủ nhật")
    period_number: int = Field(default=1, ge=1, description="Số thứ tự ca trong ngày")
    open_time: time = Field(sa_column=Column(Time, nullable=False))
    close_time: time = Field(sa_column=Column(Time, nullable=False))
    is_closed: bool = Field(default=False, description="True nếu ngày đó nghỉ")


class ExceptionDate(SQLModel, table=True):
    """
    Ngày nghỉ lễ, bảo trì hoặc giờ hoạt động đặc biệt.

    Khi có exception_date, hệ thống sẽ ưu tiên sử dụng giờ này thay vì regular_operating_hours.
    """
    __tablename__ = "exception_dates"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    exception_date: date = Field(index=True, description="Ngày áp dụng ngoại lệ")
    type: ExceptionDateType = Field(default=ExceptionDateType.CUSTOM)
    open_time: time | None = Field(default=None, sa_column=Column(Time, nullable=True))
    close_time: time | None = Field(default=None, sa_column=Column(Time, nullable=True))
    is_closed: bool = Field(default=True, description="True nếu nghỉ cả ngày")
    reason: str | None = Field(default=None, max_length=255)
