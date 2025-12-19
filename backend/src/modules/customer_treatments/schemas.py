"""
Customer Treatments Module - Pydantic Schemas
"""

import uuid
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field
from .models import TreatmentStatus

# Base Schema
class CustomerTreatmentBase(BaseModel):
    name: str
    total_sessions: int = Field(gt=0)
    expiry_date: date | None = None
    service_id: uuid.UUID | None = None

# Create Schema
class CustomerTreatmentCreate(CustomerTreatmentBase):
    customer_id: uuid.UUID

# Update Schema
class CustomerTreatmentUpdate(BaseModel):
    name: str | None = None
    total_sessions: int | None = Field(default=None, gt=0)
    expiry_date: date | None = None
    status: TreatmentStatus | None = None

# Read Schema
class CustomerTreatmentRead(CustomerTreatmentBase):
    id: uuid.UUID
    customer_id: uuid.UUID
    used_sessions: int
    status: TreatmentStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CustomerTreatmentListResponse(BaseModel):
    data: list[CustomerTreatmentRead]
    total: int
    page: int
    limit: int
