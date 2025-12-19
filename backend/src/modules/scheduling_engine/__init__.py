"""
Scheduling Engine Module - Public API

🎓 Module tối ưu hóa lập lịch sử dụng OR-Tools CP-SAT

Đây là đóng góp học thuật chính của dự án - giải bài toán RCPSP
cho nghiệp vụ Spa.
"""

# Models & Schemas
from .models import (
    SchedulingProblem,
    SchedulingSolution,
    Assignment,
    SolutionMetrics,
    SolveStatus,
    SolveRequest,
    EvaluateRequest,
    CompareResponse,
)

# Core components
from .data_extractor import DataExtractor
from .solver import SpaSolver
from .evaluator import ScheduleEvaluator

# Router
from .router import router

__all__ = [
    # Models
    "SchedulingProblem",
    "SchedulingSolution",
    "Assignment",
    "SolutionMetrics",
    "SolveStatus",
    "SolveRequest",
    "EvaluateRequest",
    "CompareResponse",
    # Components
    "DataExtractor",
    "SpaSolver",
    "ScheduleEvaluator",
    # Router
    "router",
]
