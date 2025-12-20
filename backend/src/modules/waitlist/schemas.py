"""
Waitlist Module - Pydantic Schemas
"""

import uuid
from datetime import date, time, datetime
from pydantic import BaseModel, ConfigDict, Field
from .models import WaitlistStatus

class WaitlistEntryBase(BaseModel):
    customer_id: uuid.UUID
    service_id: uuid.UUID
    preferred_date: date
    preferred_time_range_start: time | None = None
    preferred_time_range_end: time | None = None
    notes: str | None = None

class WaitlistEntryCreate(WaitlistEntryBase):
    pass

class WaitlistEntryUpdate(BaseModel):
    status: WaitlistStatus | None = None
    notes: str | None = None
    preferred_date: date | None = None
    preferred_time_range_start: time | None = None
    preferred_time_range_end: time | None = None

class WaitlistEntryRead(WaitlistEntryBase):
    id: uuid.UUID
    status: WaitlistStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class WaitlistEntryListResponse(BaseModel):
    items: list[WaitlistEntryRead]
    total: int
