"""
Operating Hours Module - Public API

Quản lý giờ hoạt động Spa và các ngày nghỉ lễ/đặc biệt.
Sử dụng cho C1 (Cấu hình giờ hoạt động) và C2 (Quản lý ngày nghỉ lễ).
"""

from .router import router
from .service import OperatingHoursService, ExceptionDateService
from .schemas import (
    WeekOperatingHoursRead,
    DayOperatingHours,
    ExceptionDateRead,
    ExceptionDateListResponse,
)
from .models import RegularOperatingHours, ExceptionDate, ExceptionDateType
from .exceptions import (
    ExceptionDateNotFound,
    DuplicateExceptionDate,
    InvalidOperatingHours,
)


__all__ = [
    # Router
    "router",

    # Services
    "OperatingHoursService",
    "ExceptionDateService",

    # Schemas
    "WeekOperatingHoursRead",
    "DayOperatingHours",
    "ExceptionDateRead",
    "ExceptionDateListResponse",

    # Models
    "RegularOperatingHours",
    "ExceptionDate",
    "ExceptionDateType",

    # Exceptions
    "ExceptionDateNotFound",
    "DuplicateExceptionDate",
    "InvalidOperatingHours",
]
