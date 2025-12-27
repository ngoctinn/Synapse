"""
Schedules Module - Database Models

Định nghĩa các Entity liên quan đến Lịch làm việc:
- Shift: Ca làm việc cố định (Ca sáng, Ca chiều...)
- StaffSchedule: Phân công KTV vào ca theo ngày cụ thể
"""

import uuid
from datetime import datetime, time, date, timezone
from enum import Enum
from sqlalchemy import Time, Date, Enum as SAEnum
from sqlmodel import SQLModel, Field, Relationship, DateTime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.modules.staff.models import Staff


class ScheduleStatus(str, Enum):
    """Trạng thái lịch làm việc."""
    DRAFT = "DRAFT"          # Bản nháp, chưa công bố
    PUBLISHED = "PUBLISHED"  # Đã công bố, KTV có thể thấy


class Shift(SQLModel, table=True):
    """
    Định nghĩa ca làm việc.

    VD: Ca sáng (08:00-12:00), Ca chiều (13:00-17:00)...
    Đây là dữ liệu master, ít thay đổi.
    """
    __tablename__ = "shifts"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=100)
    start_time: time = Field(sa_type=Time())
    end_time: time = Field(sa_type=Time())
    color_code: str | None = Field(default=None, max_length=7)
    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    schedules: list["StaffSchedule"] = Relationship(back_populates="shift")

    @property
    def duration_hours(self) -> float:
        """Tính thời lượng ca (giờ)."""
        start_minutes = self.start_time.hour * 60 + self.start_time.minute
        end_minutes = self.end_time.hour * 60 + self.end_time.minute
        return (end_minutes - start_minutes) / 60


class StaffSchedule(SQLModel, table=True):
    """
    Phân công lịch làm việc cho KTV.

    Mỗi bản ghi = 1 KTV làm 1 ca trong 1 ngày cụ thể.
    """
    __tablename__ = "staff_schedules"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    staff_id: uuid.UUID = Field(
        foreign_key="staff.user_id",
        ondelete="CASCADE"
    )
    shift_id: uuid.UUID = Field(
        foreign_key="shifts.id",
        ondelete="CASCADE"
    )
    work_date: date = Field(sa_type=Date())
    status: ScheduleStatus = Field(
        default=ScheduleStatus.DRAFT,
        sa_type=SAEnum(ScheduleStatus, name="schedule_status")
    )
    notes: str | None = None
    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    shift: Shift = Relationship(back_populates="schedules")
    staff: "Staff" = Relationship(back_populates="schedules")
