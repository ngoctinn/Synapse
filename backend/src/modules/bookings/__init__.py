"""
Bookings Module - Public API

🔥 MODULE QUAN TRỌNG NHẤT CỦA HỆ THỐNG

File này đóng vai trò là Gatekeeper theo Backend Rules.
"""

# Models
from .models import Booking, BookingItem, BookingStatus

# Schemas
from .schemas import (
    BookingCreate,
    BookingUpdate,
    BookingRead,
    BookingListItem,
    BookingItemCreate,
    BookingItemUpdate,
    BookingItemRead,
    BookingCancel,
    ConflictCheckRequest,
    ConflictCheckResponse,
)

# Services
from .service import BookingService
from .conflict_checker import ConflictChecker, ConflictResult

# Router
from .router import router

__all__ = [
    # Models
    "Booking",
    "BookingItem",
    "BookingStatus",
    # Schemas
    "BookingCreate",
    "BookingUpdate",
    "BookingRead",
    "BookingListItem",
    "BookingItemCreate",
    "BookingItemUpdate",
    "BookingItemRead",
    "BookingCancel",
    "ConflictCheckRequest",
    "ConflictCheckResponse",
    # Services
    "BookingService",
    "ConflictChecker",
    "ConflictResult",
    # Router
    "router",
]
