"""
Schedules Module - Public API

File này đóng vai trò là Gatekeeper theo Backend Rules.
Chỉ export những gì cần thiết cho các module khác.
"""

# Models
from .models import Shift, StaffSchedule, ScheduleStatus

# Schemas
from .schemas import (
    ShiftCreate,
    ShiftUpdate,
    ShiftRead,
    StaffScheduleCreate,
    StaffScheduleBulkCreate,
    StaffScheduleUpdate,
    StaffScheduleRead,
    StaffAvailability,
    TimeSlot,
)

# Services
from .service import ShiftService, StaffScheduleService

# Router
from .router import router

__all__ = [
    # Models
    "Shift",
    "StaffSchedule",
    "ScheduleStatus",
    # Schemas
    "ShiftCreate",
    "ShiftUpdate",
    "ShiftRead",
    "StaffScheduleCreate",
    "StaffScheduleBulkCreate",
    "StaffScheduleUpdate",
    "StaffScheduleRead",
    "StaffAvailability",
    "TimeSlot",
    # Services
    "ShiftService",
    "StaffScheduleService",
    # Router
    "router",
]
