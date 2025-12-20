"""
Waitlist Module - Database Models
"""

import uuid
from datetime import date, time, datetime
from typing import Optional
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship

class WaitlistStatus(str, Enum):
    PENDING = "PENDING"
    NOTIFIED = "NOTIFIED"
    BOOKED = "BOOKED"
    EXPIRED = "EXPIRED"
    CANCELLED = "CANCELLED"

class WaitlistEntry(SQLModel, table=True):
    __tablename__ = "waitlist_entries"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    customer_id: uuid.UUID = Field(foreign_key="customers.id")
    service_id: uuid.UUID = Field(foreign_key="services.id")

    preferred_date: date = Field(nullable=False)
    preferred_time_range_start: time | None = None
    preferred_time_range_end: time | None = None

    notes: str | None = None
    status: WaitlistStatus = Field(default=WaitlistStatus.PENDING)

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
