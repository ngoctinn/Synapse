"""
Scheduling Engine Module - Public API

🎓 Module tối ưu hóa lập lịch sử dụng OR-Tools CP-SAT

Đây là đóng góp học thuật chính của dự án - giải bài toán RCPSP
cho nghiệp vụ Spa.
"""

# Core Models & Problem/Solution Structures
from .models import (
    # Problem Definition
    SchedulingProblem,
    BookingItemData,
    StaffData,
    StaffScheduleData,
    ResourceData,
    ExistingAssignment,
    # Solution
    SchedulingSolution,
    Assignment,
    SolutionMetrics,
    SolveStatus,
    # API Schemas - Core
    SolveRequest,
    EvaluateRequest,
    CompareResponse,
    # API Schemas - Conflict & Reschedule
    ConflictType,
    ConflictInfo,
    ConflictCheckResponse,
    RescheduleRequest,
    RescheduleResult,
    # API Schemas - Smart Slot Finding
    TimeWindow,
    SlotSearchRequest,
    SlotSuggestionResponse,
    SlotOption,
    StaffSuggestionInfo,
    ResourceSuggestionInfo,
)

# Core Components
from .data_extractor import DataExtractor
from .solver import SpaSolver
from .evaluator import ScheduleEvaluator
from .slot_finder import SlotFinder

# Service
from .service import SchedulingService

# Router
from .router import router

__all__ = [
    # Problem Models
    "SchedulingProblem",
    "BookingItemData",
    "StaffData",
    "StaffScheduleData",
    "ResourceData",
    "ExistingAssignment",
    # Solution Models
    "SchedulingSolution",
    "Assignment",
    "SolutionMetrics",
    "SolveStatus",
    # API Schemas - Core
    "SolveRequest",
    "EvaluateRequest",
    "CompareResponse",
    # API Schemas - Conflict & Reschedule
    "ConflictType",
    "ConflictInfo",
    "ConflictCheckResponse",
    "RescheduleRequest",
    "RescheduleResult",
    # API Schemas - Smart Slot Finding
    "TimeWindow",
    "SlotSearchRequest",
    "SlotSuggestionResponse",
    "SlotOption",
    "StaffSuggestionInfo",
    "ResourceSuggestionInfo",
    # Components
    "DataExtractor",
    "SpaSolver",
    "ScheduleEvaluator",
    "SlotFinder",
    # Service
    "SchedulingService",
    # Router
    "router",
]
