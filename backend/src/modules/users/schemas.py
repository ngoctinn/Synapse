import uuid
from datetime import datetime
from sqlmodel import SQLModel

class UserBase(SQLModel):
    email: str
    full_name: str | None = None
    avatar_url: str | None = None
    phone_number: str | None = None
    role: str = "customer"

class UserRead(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

class UserUpdate(SQLModel):
    full_name: str | None = None
    avatar_url: str | None = None
    phone_number: str | None = None
