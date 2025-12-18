"""
Staff Module - Public API

Đây là gateway của module staff. Các module khác chỉ được phép
import những gì được export ở đây (Gatekeeper Pattern).
"""

from .models import Staff, StaffSkill
from .service import StaffService
from .router import router
from .schemas import (
    StaffRead,
    StaffCreate,
    StaffUpdate,
    StaffListResponse,
    StaffInvite,
    StaffSkillsUpdate
)

__all__ = [
    # Models
    "Staff",
    "StaffSkill",
    # Service
    "StaffService",
    # Router
    "router",
    # Schemas
    "StaffRead",
    "StaffCreate",
    "StaffUpdate",
    "StaffListResponse",
    "StaffInvite",
    "StaffSkillsUpdate"
]
