"""
Notifications Module - Public API
"""

from .router import router
from .service import NotificationService
from .models import NotificationTemplate
from .schemas import EmailSendRequest, EmailSendResponse

__all__ = [
    "router",
    "NotificationService",
    "NotificationTemplate",
    "EmailSendRequest",
    "EmailSendResponse"
]
