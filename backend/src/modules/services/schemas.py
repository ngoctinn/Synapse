"""
Services Module - Pydantic Schemas (DTOs)

Tuân thủ Pydantic V2 với model_config = ConfigDict(...).
"""

import uuid
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field


# ============================================================================
# SERVICE CATEGORIES
# ============================================================================

class ServiceCategoryBase(BaseModel):
    """Schema cơ sở cho ServiceCategory."""
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = None
    sort_order: int = Field(default=0)


class ServiceCategoryCreate(ServiceCategoryBase):
    """Schema tạo mới ServiceCategory."""
    pass


class ServiceCategoryUpdate(BaseModel):
    """Schema cập nhật ServiceCategory."""
    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = None
    sort_order: int | None = None


class ServiceCategoryRead(ServiceCategoryBase):
    """Schema đọc ServiceCategory."""
    id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# SKILLS
# ============================================================================

class SkillBase(BaseModel):
    """Schema cơ sở cho Skill."""
    name: str
    code: str
    description: str | None = None


class SkillCreate(SkillBase):
    """Schema tạo mới Skill."""
    pass


class SkillUpdate(BaseModel):
    """Schema cập nhật Skill."""
    name: str | None = None
    code: str | None = None
    description: str | None = None


class SkillRead(SkillBase):
    """Schema đọc Skill."""
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


class SkillRequirement(BaseModel):
    """Schema cho yêu cầu kỹ năng của dịch vụ."""
    skill_id: uuid.UUID


# ============================================================================
# SERVICES
# ============================================================================

class ServiceBase(BaseModel):
    """Schema cơ sở cho Service."""
    name: str
    duration: int = Field(..., gt=0, description="Thời lượng (phút)")
    buffer_time: int = Field(default=15, ge=0, description="Thời gian nghỉ (phút)")
    price: Decimal = Field(default=Decimal("0"), ge=0)
    description: str | None = None
    image_url: str | None = None
    is_active: bool = True


class ServiceCreate(ServiceBase):
    """Schema tạo mới Service."""
    category_id: uuid.UUID | None = None
    skill_ids: list[uuid.UUID] = []
    new_skills: list[str] | None = None


class ServiceUpdate(BaseModel):
    """Schema cập nhật Service."""
    name: str | None = None
    category_id: uuid.UUID | None = None
    duration: int | None = Field(None, gt=0)
    buffer_time: int | None = Field(None, ge=0)
    price: Decimal | None = Field(None, ge=0)
    description: str | None = None
    image_url: str | None = None
    is_active: bool | None = None
    skill_ids: list[uuid.UUID] | None = None
    new_skills: list[str] | None = None


class ServiceRead(ServiceBase):
    """Schema đọc Service."""
    id: uuid.UUID
    category_id: uuid.UUID | None = None
    category: ServiceCategoryRead | None = None
    skills: list[SkillRead] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ServicePaginationResponse(BaseModel):
    """Schema phân trang danh sách Services."""
    data: list[ServiceRead]
    total: int
    page: int
    limit: int

