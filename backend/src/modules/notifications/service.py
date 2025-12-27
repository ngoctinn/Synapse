"""
Notifications Module - Service
"""

import uuid
import logging
from datetime import datetime
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends, HTTPException

from src.common.database import get_db_session
from .models import NotificationTemplate
from .schemas import (
    NotificationTemplateCreate,
    NotificationTemplateUpdate,
    NotificationTemplateRead,
    EmailSendRequest,
    EmailSendResponse
)

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    # --- Templates CRUD ---
    async def list_templates(self) -> list[NotificationTemplateRead]:
        result = await self.session.exec(select(NotificationTemplate))
        return [NotificationTemplateRead.model_validate(t) for t in result.all()]

    async def create_template(self, data: NotificationTemplateCreate) -> NotificationTemplateRead:
        tmpl = NotificationTemplate.model_validate(data)
        self.session.add(tmpl)
        await self.session.commit()
        await self.session.refresh(tmpl)
        return NotificationTemplateRead.model_validate(tmpl)

    async def update_template(self, id: uuid.UUID, data: NotificationTemplateUpdate) -> NotificationTemplateRead:
        tmpl = await self.session.get(NotificationTemplate, id)
        if not tmpl:
            raise HTTPException(status_code=404, detail="Template not found")

        values = data.model_dump(exclude_unset=True)
        for k, v in values.items():
            setattr(tmpl, k, v)

        tmpl.updated_at = datetime.now()
        self.session.add(tmpl)
        await self.session.commit()
        await self.session.refresh(tmpl)
        return NotificationTemplateRead.model_validate(tmpl)

    # --- Email Logic ---
    async def send_email(self, req: EmailSendRequest) -> EmailSendResponse:
        # 1. Get Template
        query = select(NotificationTemplate).where(NotificationTemplate.code == req.template_code)
        result = await self.session.exec(query)
        tmpl = result.first()

        if not tmpl:
             return EmailSendResponse(success=False, message=f"Template '{req.template_code}' not found")

        if not tmpl.is_active:
             return EmailSendResponse(success=False, message=f"Template '{req.template_code}' is inactive")

        # 2. Render content (Basic format string)
        # Note: In production, use Jinja2. Here we use str.format() for simplicity
        try:
            subject = tmpl.subject_template.format(**req.context)
            body = tmpl.body_template.format(**req.context)
        except KeyError as e:
            return EmailSendResponse(success=False, message=f"Missing context variable: {e}")

        # 3. Send (Mock)
        # TODO: Implement actual SMTP or SES/SendGrid integration
        logger.info(f"======== SENDING EMAIL TO {req.to_email} ========")
        logger.info(f"Subject: {subject}")
        logger.info(f"Body: {body}")
        logger.info("=================================================")

        return EmailSendResponse(success=True, message="Email sent (Mocked - check logs)")
