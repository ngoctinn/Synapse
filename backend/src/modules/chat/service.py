"""
Chat Module - Service
"""

import uuid
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends

from src.common.database import get_db_session
from .models import ChatSession, ChatMessage, ChatSessionStatus
from .schemas import ChatMessageRead, ChatSessionRead, ChatHistoryResponse

class ChatService:
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_or_create_session(self, customer_id: uuid.UUID) -> ChatSessionRead:
        # Tìm session OPEN
        query = select(ChatSession).where(
            ChatSession.customer_id == customer_id,
            ChatSession.status == ChatSessionStatus.OPEN
        )
        result = await self.session.exec(query)
        session = result.first()

        if not session:
            # Tạo mới
            session = ChatSession(customer_id=customer_id)
            self.session.add(session)
            await self.session.commit()
            await self.session.refresh(session)

        return ChatSessionRead.model_validate(session)

    async def send_message(self, session_id: uuid.UUID, sender_id: uuid.UUID, content: str) -> ChatMessageRead:
        msg = ChatMessage(
            session_id=session_id,
            sender_id=sender_id,
            content=content
        )
        self.session.add(msg)
        await self.session.commit()
        await self.session.refresh(msg)
        return ChatMessageRead.model_validate(msg)

    async def get_history(self, session_id: uuid.UUID) -> ChatHistoryResponse:
        query = select(ChatMessage).where(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at)
        result = await self.session.exec(query)
        msgs = result.all()

        return ChatHistoryResponse(
            items=[ChatMessageRead.model_validate(m) for m in msgs],
            total=len(msgs)
        )
