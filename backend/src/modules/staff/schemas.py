"""
Staff Module - Pydantic Schemas (DTOs)

Định nghĩa các Data Transfer Objects để validate
Request/Response giữa Client và Server.
"""

import uuid
from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from src.modules.users.constants import UserRole

# ===== BASE SCHEMAS =====

class SkillRead(BaseModel):
    """Schema đọc thông tin Skill (tái sử dụng từ services)"""
    id: uuid.UUID
    name: str
    code: str

    model_config = ConfigDict(from_attributes=True)


class UserRead(BaseModel):
    """Schema đọc thông tin User cơ bản (nested trong StaffRead)"""
    id: uuid.UUID
    email: str
    full_name: str | None = None
    avatar_url: str | None = None
    role: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


# ===== STAFF SCHEMAS =====

class StaffBase(BaseModel):
    """Base schema chứa các trường chung"""
    bio: str | None = None
    title: str
    color_code: str = "#3B82F6"
    commission_rate: Decimal = Field(default=Decimal("0"), ge=0, le=100)

    @field_validator("color_code")
    @classmethod
    def validate_color(cls, v: str) -> str:
        if not v.startswith("#"):
            raise ValueError("Mã màu phải bắt đầu bằng #")
        if len(v) != 7:
            raise ValueError("Mã màu phải có định dạng #RRGGBB")
        return v


class StaffInvite(BaseModel):
    """
    Schema để mời nhân viên mới
    Tạo cả User (qua Supabase) và Staff profile
    """
    email: EmailStr
    role: UserRole
    full_name: str
    title: str
    bio: str | None = None

    @field_validator("role")
    @classmethod
    def role_must_be_staff(cls, v: UserRole) -> UserRole:
        if v == UserRole.CUSTOMER:
            raise ValueError("Không thể mời khách hàng làm nhân viên")
        return v


class StaffCreate(StaffBase):
    """
    Schema để tạo Staff profile cho User đã tồn tại
    (Dùng khi User đã được tạo từ Supabase)
    """
    user_id: uuid.UUID
    hired_at: date


class StaffRead(StaffBase):
    """Schema trả về thông tin Staff (kèm User và Skills)"""
    user_id: uuid.UUID
    hired_at: date
    created_at: datetime

    # Nested relationships
    user: UserRead
    skills: list[SkillRead] = []

    model_config = ConfigDict(from_attributes=True)


class StaffUpdate(BaseModel):
    """Schema cập nhật thông tin Staff (partial update)"""
    bio: str | None = None
    title: str | None = None
    color_code: str | None = None
    commission_rate: Decimal | None = Field(default=None, ge=0, le=100)

    @field_validator("color_code")
    @classmethod
    def validate_color(cls, v: str | None) -> str | None:
        if v is not None and not v.startswith("#"):
            raise ValueError("Mã màu phải bắt đầu bằng #")
        return v


class StaffSkillsUpdate(BaseModel):
    """Schema để cập nhật kỹ năng của Staff"""
    skill_ids: list[uuid.UUID]

    @field_validator("skill_ids")
    @classmethod
    def validate_skills_not_empty(cls, v: list[uuid.UUID]) -> list[uuid.UUID]:
        if not v:
            raise ValueError("Danh sách kỹ năng không được rỗng")
        return v


class StaffListResponse(BaseModel):
    """Schema response cho danh sách Staff (với pagination)"""
    data: list[StaffRead]
    total: int
    page: int
    limit: int
