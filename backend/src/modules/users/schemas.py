import uuid
from datetime import date, datetime
from sqlmodel import SQLModel

from pydantic import ConfigDict

class UserBase(SQLModel):
    email: str
    full_name: str | None = None
    avatar_url: str | None = None
    phone_number: str | None = None
    address: str | None = None
    date_of_birth: date | None = None
    role: str = "customer"

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
