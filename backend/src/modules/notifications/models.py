"""
Notifications Module - Database Models
"""

import uuid
from datetime import datetime
from sqlmodel import SQLModel, Field

class NotificationTemplate(SQLModel, table=True):
    __tablename__ = "notification_templates"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    code: str = Field(unique=True, index=True) # e.g., 'BOOKING_CONFIRMATION'
    name: str
    subject_template: str
    body_template: str # HTML content with {{ strict variables }} potentially
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
