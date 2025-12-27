"""
Users Module - Pydantic Schemas (DTOs)

Các Data Transfer Objects để validate request/response.
Theo thiết kế v2.2, bảng users chỉ quản lý Auth - các thông tin cá nhân
như phone, address, dob được lưu trong bảng customers hoặc staff.
"""

import uuid
from datetime import datetime
from sqlmodel import SQLModel

from pydantic import ConfigDict
from src.modules.users.constants import UserRole

class UserBase(SQLModel):
    email: str
    full_name: str | None = None
    avatar_url: str | None = None
    role: UserRole = UserRole.CUSTOMER

class UserRead(UserBase):
    id: uuid.UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserUpdate(SQLModel):
    full_name: str | None = None
    avatar_url: str | None = None


class UserFilter(SQLModel):
    role: UserRole | None = None
    search: str | None = None
    page: int = 1
    limit: int = 10

class UserListResponse(SQLModel):
    data: list[UserRead]
    total: int
    page: int
    limit: int
    total_pages: int
