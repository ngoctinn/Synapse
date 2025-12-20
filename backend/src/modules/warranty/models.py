"""
Warranty Module - Database Models
"""

import uuid
from datetime import datetime
from enum import Enum
from typing import List, Optional
from sqlmodel import SQLModel, Field, Column, ARRAY, String

class WarrantyStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    RESOLVED = "RESOLVED"

class WarrantyTicket(SQLModel, table=True):
    __tablename__ = "warranty_tickets"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    booking_id: uuid.UUID | None = Field(default=None, foreign_key="bookings.id")
    customer_id: uuid.UUID = Field(foreign_key="customers.id")

    description: str
    images: List[str] | None = Field(default=None, sa_column=Column(ARRAY(String)))

    status: WarrantyStatus = Field(default=WarrantyStatus.PENDING)
    resolution_notes: str | None = None
    resolved_by: uuid.UUID | None = Field(default=None, foreign_key="users.id")

    created_at: datetime = Field(default_factory=datetime.now)
    resolved_at: datetime | None = None
