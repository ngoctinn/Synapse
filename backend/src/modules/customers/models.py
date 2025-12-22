"""
Customers Module - Database Models

Định nghĩa cấu trúc bảng khách hàng trong hệ thống.
"""

from datetime import date, datetime, timezone
import uuid
from sqlmodel import SQLModel, Field, DateTime
from typing import TYPE_CHECKING

from sqlalchemy import Enum as SAEnum
from .constants import Gender, MembershipTier

if TYPE_CHECKING:
    pass

class Customer(SQLModel, table=True):
    __tablename__ = "customers"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    phone_number: str = Field(unique=True, index=True, max_length=50) # Định danh chính (UNIQUE)
    full_name: str = Field(max_length=255)
    email: str | None = Field(default=None, max_length=255)

    # Link to App Account (Optional)
    # References users(id). 1-1 Relationship.
    user_id: uuid.UUID | None = Field(default=None, foreign_key="users.id", unique=True)

    # CRM Fields
    loyalty_points: int = Field(default=0, ge=0)
    membership_tier: MembershipTier = Field(
        default=MembershipTier.SILVER,
        sa_type=SAEnum(MembershipTier, name="membership_tier")
    )
    gender: Gender | None = Field(
        default=None,
        sa_type=SAEnum(Gender, name="gender")
    )
    date_of_birth: date | None = None
    address: str | None = None
    allergies: str | None = None
    medical_notes: str | None = None

    # Preferences
    preferred_staff_id: uuid.UUID | None = Field(default=None, foreign_key="staff.user_id")

    # Timestamps
    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )
    deleted_at: datetime | None = Field(default=None, sa_type=DateTime(timezone=True))
