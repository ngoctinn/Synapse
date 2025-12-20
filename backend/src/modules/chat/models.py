"""
Chat Module - Database Models
"""

import uuid
from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field

class ChatSessionStatus(str, Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"

class ChatSession(SQLModel, table=True):
    __tablename__ = "chat_sessions"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    customer_id: uuid.UUID = Field(foreign_key="customers.id")
    staff_id: uuid.UUID | None = Field(default=None, foreign_key="staff.user_id")

    status: ChatSessionStatus = Field(default=ChatSessionStatus.OPEN)

    created_at: datetime = Field(default_factory=datetime.now)
    closed_at: datetime | None = None

class ChatMessage(SQLModel, table=True):
    __tablename__ = "chat_messages"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    session_id: uuid.UUID = Field(foreign_key="chat_sessions.id")
    sender_id: uuid.UUID = Field(foreign_key="users.id")

    content: str
    is_read: bool = Field(default=False)

    created_at: datetime = Field(default_factory=datetime.now)
