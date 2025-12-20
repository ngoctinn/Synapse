"""
Notifications Module - Pydantic Schemas
"""

import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, EmailStr

# --- Templates ---
class NotificationTemplateBase(BaseModel):
    code: str
    name: str
    subject_template: str
    body_template: str
    is_active: bool = True

class NotificationTemplateCreate(NotificationTemplateBase):
    pass

class NotificationTemplateUpdate(BaseModel):
    name: str | None = None
    subject_template: str | None = None
    body_template: str | None = None
    is_active: bool | None = None

class NotificationTemplateRead(NotificationTemplateBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Sending ---
class EmailSendRequest(BaseModel):
    to_email: EmailStr
    template_code: str
    context: dict[str, str | int | float] = Field(default_factory=dict)

class EmailSendResponse(BaseModel):
    success: bool
    message: str
