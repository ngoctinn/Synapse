"""
Settings Module - Database Models
"""
import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlmodel import SQLModel, Field, DateTime

class SettingType(str, Enum):
    """Loại dữ liệu của setting."""
    STRING = "STRING"
    NUMBER = "NUMBER"
    BOOLEAN = "BOOLEAN"
    JSON = "JSON"

class SystemSetting(SQLModel, table=True):
    """
    Cấu hình hệ thống động (Key-Value).
    VD:
    - ALLOW_BOOKING_CANCEL_BEFORE_HOURS = 24
    - REMINDER_EMAIL_BEFORE_HOURS = 2
    """
    __tablename__ = "system_settings"

    key: str = Field(primary_key=True, max_length=100, description="Mã cấu hình (UPPER_CASE)")
    value: str = Field(description="Giá trị (lưu dưới dạng string)")
    type: SettingType = Field(default=SettingType.STRING)
    description: str | None = None
    group: str = Field(default="GENERAL", max_length=50, description="Nhóm cấu hình: BOOKING, NOTIFICATION...")
    is_public: bool = Field(default=False, description="True nếu FE có thể đọc không cần Auth")

    updated_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_by: uuid.UUID | None = Field(default=None)
