"""
Users Module - Database Models

Định nghĩa cấu trúc bảng người dùng trong hệ thống.
"""

from datetime import date, datetime, timezone
import uuid
from sqlmodel import SQLModel, Field, Relationship, DateTime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Enum as SAEnum
from src.modules.users.constants import UserRole

if TYPE_CHECKING:
    from src.modules.staff.models import Staff

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(primary_key=True)
    email: str = Field(index=True, unique=True)
    full_name: str | None = None
    avatar_url: str | None = None
    phone_number: str | None = None
    address: str | None = None
    date_of_birth: date | None = None
    role: UserRole = Field(
        default=UserRole.CUSTOMER,
        sa_type=SAEnum(UserRole, name="user_role")
    )
    is_active: bool = Field(default=True)  # Vô hiệu hóa tài khoản

    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationship với Staff (1-1, optional)
    # Chỉ User có role != "customer" mới có staff_profile
    staff_profile: Optional["Staff"] = Relationship(back_populates="user")
