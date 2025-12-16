"""
Resources Module - Pydantic Schemas (DTOs)

Định nghĩa các Data Transfer Objects cho API Endpoints.
Tuân thủ Pydantic V2 với model_config = ConfigDict(...).
"""

import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from .models import ResourceType, ResourceStatus


# ============================================================================
# RESOURCE GROUP SCHEMAS
# ============================================================================

class ResourceGroupBase(BaseModel):
    """Schema cơ sở cho ResourceGroup."""
    name: str = Field(..., min_length=1, max_length=100, description="Tên nhóm tài nguyên")
    type: ResourceType = Field(..., description="Loại: ROOM hoặc EQUIPMENT")
    description: str | None = Field(None, description="Mô tả")


class ResourceGroupCreate(ResourceGroupBase):
    """Schema tạo mới ResourceGroup."""
    pass


class ResourceGroupUpdate(BaseModel):
    """Schema cập nhật ResourceGroup (tất cả fields optional)."""
    name: str | None = Field(None, min_length=1, max_length=100)
    type: ResourceType | None = None
    description: str | None = None


class ResourceGroupRead(ResourceGroupBase):
    """Schema đọc ResourceGroup."""
    id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ResourceGroupWithResources(ResourceGroupRead):
    """Schema ResourceGroup kèm danh sách resources."""
    resources: list["ResourceRead"] = []


# ============================================================================
# RESOURCE SCHEMAS
# ============================================================================

class ResourceBase(BaseModel):
    """Schema cơ sở cho Resource."""
    name: str = Field(..., min_length=1, max_length=100, description="Tên tài nguyên")
    code: str | None = Field(None, max_length=50, description="Mã định danh (unique)")
    status: ResourceStatus = Field(ResourceStatus.ACTIVE, description="Trạng thái")
    capacity: int = Field(1, ge=1, description="Sức chứa")
    setup_time_minutes: int = Field(0, ge=0, description="Thời gian chuẩn bị (phút)")
    description: str | None = None
    image_url: str | None = None


class ResourceCreate(ResourceBase):
    """Schema tạo mới Resource."""
    group_id: uuid.UUID | None = Field(None, description="ID nhóm tài nguyên")


class ResourceUpdate(BaseModel):
    """Schema cập nhật Resource (tất cả fields optional)."""
    name: str | None = Field(None, min_length=1, max_length=100)
    code: str | None = None
    group_id: uuid.UUID | None = None
    status: ResourceStatus | None = None
    capacity: int | None = Field(None, ge=1)
    setup_time_minutes: int | None = Field(None, ge=0)
    description: str | None = None
    image_url: str | None = None


class ResourceRead(ResourceBase):
    """Schema đọc Resource."""
    id: uuid.UUID
    group_id: uuid.UUID | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ResourceWithGroup(ResourceRead):
    """Schema Resource kèm thông tin group."""
    group: ResourceGroupRead | None = None


# ============================================================================
# SERVICE RESOURCE REQUIREMENT SCHEMAS
# ============================================================================

class ServiceResourceRequirementCreate(BaseModel):
    """Schema tạo yêu cầu tài nguyên cho dịch vụ."""
    group_id: uuid.UUID = Field(..., description="ID nhóm tài nguyên")
    quantity: int = Field(1, ge=1, description="Số lượng cần")


class ServiceResourceRequirementRead(BaseModel):
    """Schema đọc yêu cầu tài nguyên."""
    service_id: uuid.UUID
    group_id: uuid.UUID
    quantity: int
    group: ResourceGroupRead | None = None

    model_config = ConfigDict(from_attributes=True)


# Resolve forward reference
ResourceGroupWithResources.model_rebuild()
