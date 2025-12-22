from datetime import date, datetime
import uuid
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from .constants import Gender, MembershipTier

class CustomerBase(BaseModel):
    phone_number: str = Field(..., max_length=50)
    full_name: str = Field(..., max_length=255)
    email: EmailStr | None = None
    gender: Gender | None = None
    date_of_birth: date | None = None
    address: str | None = None
    allergies: str | None = None
    medical_notes: str | None = None
    preferred_staff_id: uuid.UUID | None = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    full_name: str | None = Field(None, max_length=255)
    email: EmailStr | None = None
    phone_number: str | None = Field(None, max_length=50) # Allow updating phone
    gender: Gender | None = None
    date_of_birth: date | None = None
    address: str | None = None
    allergies: str | None = None
    medical_notes: str | None = None
    preferred_staff_id: uuid.UUID | None = None

class CustomerRead(CustomerBase):
    id: uuid.UUID
    user_id: uuid.UUID | None
    loyalty_points: int
    membership_tier: MembershipTier
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CustomerFilter(BaseModel):
    search: str | None = None # search by name, email, phone
    membership_tier: MembershipTier | None = None

class CustomerListResponse(BaseModel):
    data: list[CustomerRead]
    total: int
    page: int
    limit: int
