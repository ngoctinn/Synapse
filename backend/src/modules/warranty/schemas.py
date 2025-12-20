"""
Warranty Module - Pydantic Schemas
"""

import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from .models import WarrantyStatus

class WarrantyTicketBase(BaseModel):
    booking_id: uuid.UUID | None = None
    customer_id: uuid.UUID
    description: str
    images: list[str] | None = None

class WarrantyTicketCreate(WarrantyTicketBase):
    pass

class WarrantyTicketUpdate(BaseModel):
    status: WarrantyStatus | None = None
    resolution_notes: str | None = None
    resolved_by: uuid.UUID | None = None

class WarrantyTicketRead(WarrantyTicketBase):
    id: uuid.UUID
    status: WarrantyStatus
    resolution_notes: str | None
    created_at: datetime
    resolved_at: datetime | None

    model_config = ConfigDict(from_attributes=True)

class WarrantyListResponse(BaseModel):
    items: list[WarrantyTicketRead]
    total: int
