"""
Chat Module - Router
"""

import uuid
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect

from .service import ChatService
from .schemas import ChatSessionRead, ChatMessageCreate, ChatMessageRead, ChatHistoryResponse

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/sessions", response_model=ChatSessionRead)
async def start_chat(
    customer_id: uuid.UUID,
    service: ChatService = Depends()
):
    """Bắt đầu hoặc lấy phiên chat hiện tại."""
    return await service.get_or_create_session(customer_id)

@router.get("/sessions/{session_id}/messages", response_model=ChatHistoryResponse)
async def get_chat_history(
    session_id: uuid.UUID,
    service: ChatService = Depends()
):
    """Lấy lịch sử tin nhắn."""
    return await service.get_history(session_id)

@router.post("/sessions/{session_id}/messages", response_model=ChatMessageRead)
async def send_message_http(
    session_id: uuid.UUID,
    sender_id: uuid.UUID, # Info: Thực tế sẽ lấy từ Token claims
    data: ChatMessageCreate,
    service: ChatService = Depends()
):
    """Gửi tin nhắn (HTTP Fallback)."""
    return await service.send_message(session_id, sender_id, data.content)

@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: uuid.UUID):
    """WebSocket Endpoint (Placeholder)."""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Echo: {data}")
            # TODO: Integrate with ChatService and PubSub
    except WebSocketDisconnect:
        pass
