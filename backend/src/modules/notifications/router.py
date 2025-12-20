"""
Notifications Module - Router
"""

import uuid
from fastapi import APIRouter, Depends, status

from .service import NotificationService
from .schemas import (
    NotificationTemplateCreate,
    NotificationTemplateUpdate,
    NotificationTemplateRead,
    EmailSendRequest,
    EmailSendResponse
)

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/templates", response_model=list[NotificationTemplateRead])
async def list_templates(service: NotificationService = Depends()):
    return await service.list_templates()

@router.post("/templates", response_model=NotificationTemplateRead, status_code=status.HTTP_201_CREATED)
async def create_template(
    data: NotificationTemplateCreate,
    service: NotificationService = Depends()
):
    return await service.create_template(data)

@router.put("/templates/{id}", response_model=NotificationTemplateRead)
async def update_template(
    id: uuid.UUID,
    data: NotificationTemplateUpdate,
    service: NotificationService = Depends()
):
    return await service.update_template(id, data)

@router.post("/send-email", response_model=EmailSendResponse)
async def send_test_email(
    req: EmailSendRequest,
    service: NotificationService = Depends()
):
    """Test gửi email (Mock)."""
    return await service.send_email(req)
