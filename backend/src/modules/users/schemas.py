import uuid
from datetime import date, datetime
from sqlmodel import SQLModel

from pydantic import ConfigDict
from src.modules.users.constants import UserRole

class UserBase(SQLModel):
    email: str
    full_name: str | None = None
    avatar_url: str | None = None
    phone_number: str | None = None
    address: str | None = None
    date_of_birth: date | None = None
    role: UserRole = UserRole.CUSTOMER

class UserRead(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserUpdate(SQLModel):
    full_name: str | None = None
    avatar_url: str | None = None
    phone_number: str | None = None
    address: str | None = None
    date_of_birth: date | None = None

class UpdateSkillsRequest(SQLModel):
    skill_ids: list[uuid.UUID]

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
