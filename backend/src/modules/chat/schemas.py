"""
Chat Module - Pydantic Schemas
"""

import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from .models import ChatSessionStatus

class ChatSessionRead(BaseModel):
    id: uuid.UUID
    customer_id: uuid.UUID
    staff_id: uuid.UUID | None
    status: ChatSessionStatus
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ChatMessageCreate(BaseModel):
    content: str

class ChatMessageRead(BaseModel):
    id: uuid.UUID
    sender_id: uuid.UUID
    content: str
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ChatHistoryResponse(BaseModel):
    items: list[ChatMessageRead]
    total: int
