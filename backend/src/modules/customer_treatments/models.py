"""
Customer Treatments Module - Database Models

Quản lý các gói liệu trình khách hàng đã mua.
"""

import uuid
from datetime import date, datetime, timezone
from enum import Enum
from sqlmodel import SQLModel, Field, DateTime

class TreatmentStatus(str, Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    EXPIRED = "EXPIRED"

class CustomerTreatment(SQLModel, table=True):
    __tablename__ = "customer_treatments"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    # Customer ownership
    customer_id: uuid.UUID = Field(foreign_key="customers.id", index=True, nullable=False)

    # Optional link to Service definition (to know what service this is for)
    service_id: uuid.UUID | None = Field(default=None, foreign_key="services.id", ondelete="SET NULL")

    # Snapshot fields (in case service is deleted or changed)
    name: str = Field(max_length=255, nullable=False)

    # Control fields
    total_sessions: int = Field(ge=1, nullable=False)
    used_sessions: int = Field(default=0, ge=0)
    expiry_date: date | None = Field(default=None)

    status: TreatmentStatus = Field(default=TreatmentStatus.ACTIVE)

    # Timestamps
    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationships needed?
    # customer: "Customer" = Relationship(...)
    # But we follow VSA, so we usually avoid loading full objects unless necessary.
    # We will import types only if needed for relationship loading.
