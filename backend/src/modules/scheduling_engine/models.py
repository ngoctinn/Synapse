"""
Scheduling Module - Data Structures

Định nghĩa các cấu trúc dữ liệu cho bài toán lập lịch tối ưu.
"""

import uuid
from datetime import datetime, date, time
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict


class SolveStatus(str, Enum):
    """Trạng thái kết quả giải."""
    OPTIMAL = "OPTIMAL"        # Tìm được nghiệm tối ưu
    FEASIBLE = "FEASIBLE"      # Tìm được nghiệm khả thi (chưa chắc tối ưu)
    INFEASIBLE = "INFEASIBLE"  # Không có nghiệm khả thi
    TIMEOUT = "TIMEOUT"        # Hết thời gian
    ERROR = "ERROR"            # Lỗi


# ============================================================================
# DATA STRUCTURES FOR PROBLEM INSTANCE
# ============================================================================

class BookingItemData(BaseModel):
    """Dữ liệu booking item cần được gán."""
    id: uuid.UUID
    booking_id: uuid.UUID
    service_id: uuid.UUID
    service_name: str
    start_time: datetime
    end_time: datetime
    duration_minutes: int
    required_skill_ids: list[uuid.UUID] = []
    required_resource_group_ids: list[uuid.UUID] = []
    # Sở thích (ràng buộc mềm)
    preferred_staff_id: uuid.UUID | None = None

    model_config = ConfigDict(from_attributes=True)


class StaffData(BaseModel):
    """Dữ liệu KTV."""
    id: uuid.UUID
    name: str
    skill_ids: list[uuid.UUID] = []

    model_config = ConfigDict(from_attributes=True)


class StaffScheduleData(BaseModel):
    """Dữ liệu ca làm việc của KTV."""
    staff_id: uuid.UUID
    work_date: date
    start_time: time
    end_time: time
    shift_name: str

    model_config = ConfigDict(from_attributes=True)


class ResourceData(BaseModel):
    """Dữ liệu phòng/máy."""
    id: uuid.UUID
    name: str
    group_id: uuid.UUID
    group_name: str

    model_config = ConfigDict(from_attributes=True)


class ExistingAssignment(BaseModel):
    """Lịch đã được gán (để tránh overlap)."""
    staff_id: uuid.UUID | None = None
    resource_id: uuid.UUID | None = None
    start_time: datetime
    end_time: datetime

    model_config = ConfigDict(from_attributes=True)


class SchedulingProblem(BaseModel):
    """Bài toán lập lịch đã được trích xuất từ DB."""
    # Items cần gán
    unassigned_items: list[BookingItemData]

    # Tài nguyên khả dụng
    available_staff: list[StaffData]
    available_resources: list[ResourceData]

    # Ca làm việc
    staff_schedules: list[StaffScheduleData]

    # Lịch đã gán (để tránh conflict)
    existing_assignments: list[ExistingAssignment] = []

    # Constraint: working date
    target_date: date

    # Time horizon (minutes from start of day)
    horizon_start: int = 0  # 00:00
    horizon_end: int = 1440  # 24:00

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# DATA STRUCTURES FOR SOLUTION
# ============================================================================

class Assignment(BaseModel):
    """Một phân công trong solution."""
    item_id: uuid.UUID
    staff_id: uuid.UUID
    resource_id: uuid.UUID | None = None
    start_time: datetime
    end_time: datetime
    # Metadata
    staff_name: str | None = None
    resource_name: str | None = None

    model_config = ConfigDict(from_attributes=True)


class SolutionMetrics(BaseModel):
    """Các chỉ số đánh giá solution."""
    # Utilization (0-1)
    staff_utilization: float = Field(description="Tỷ lệ sử dụng KTV")
    resource_utilization: float = Field(description="Tỷ lệ sử dụng Phòng")

    # Fairness (0-1, 1 = công bằng hoàn hảo)
    jain_fairness_index: float = Field(description="Chỉ số công bằng Jain")

    # Preference satisfaction (0-1)
    preference_satisfaction: float = Field(description="Tỷ lệ đáp ứng sở thích")

    # Load distribution
    max_staff_load_minutes: int = Field(description="KTV làm nhiều nhất (phút)")
    min_staff_load_minutes: int = Field(description="KTV làm ít nhất (phút)")
    avg_staff_load_minutes: float = Field(description="Trung bình (phút)")

    # Gap analysis
    total_idle_minutes: int = Field(description="Tổng thời gian rảnh")

    model_config = ConfigDict(from_attributes=True)


class SchedulingSolution(BaseModel):
    """Kết quả giải bài toán."""
    status: SolveStatus
    assignments: list[Assignment] = []
    objective_value: float | None = None
    solve_time_ms: int = 0
    metrics: SolutionMetrics | None = None
    message: str | None = None

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# API REQUEST/RESPONSE SCHEMAS
# ============================================================================

class SolveRequest(BaseModel):
    """Request giải bài toán."""
    booking_item_ids: list[uuid.UUID] | None = Field(
        None,
        description="Danh sách item cần gán. Nếu None = tất cả unassigned"
    )
    target_date: date | None = Field(
        None,
        description="Ngày mục tiêu. Nếu None = hôm nay"
    )
    time_limit_seconds: int = Field(
        default=30,
        description="Giới hạn thời gian giải (giây)"
    )
    # Weights for objective function
    weight_preference: float = Field(default=1.0, description="Trọng số sở thích")
    weight_utilization: float = Field(default=1.0, description="Trọng số utilization")
    weight_fairness: float = Field(default=1.0, description="Trọng số công bằng")

    model_config = ConfigDict(from_attributes=True)


class EvaluateRequest(BaseModel):
    """Request đánh giá lịch hiện tại."""
    target_date: date
    model_config = ConfigDict(from_attributes=True)


class CompareResponse(BaseModel):
    """Response so sánh Manual vs Optimized."""
    manual_metrics: SolutionMetrics
    optimized_metrics: SolutionMetrics
    improvement_summary: dict
    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# NEW: RESCHEDULE & CONFLICT SCHEMAS
# ============================================================================

class ConflictType(str, Enum):
    STAFF_UNAVAILABLE = "STAFF_UNAVAILABLE" # NV nghỉ/bận
    RESOURCE_UNAVAILABLE = "RESOURCE_UNAVAILABLE" # Phòng hỏng
    DOUBLE_BOOKING = "DOUBLE_BOOKING" # Trùng lịch


class ConflictInfo(BaseModel):
    """Thông tin về xung đột lịch."""
    booking_item_id: uuid.UUID
    booking_id: uuid.UUID
    type: ConflictType
    description: str
    affected_staff_id: uuid.UUID | None = None
    affected_resource_id: uuid.UUID | None = None
    start_time: datetime
    end_time: datetime

    model_config = ConfigDict(from_attributes=True)


class ConflictCheckResponse(BaseModel):
    """Kết quả kiểm tra xung đột."""
    has_conflicts: bool
    conflicts: list[ConflictInfo]
    total_conflicts: int

    model_config = ConfigDict(from_attributes=True)


class RescheduleRequest(BaseModel):
    """Request tái lập lịch tự động."""
    conflict_booking_item_ids: list[uuid.UUID]
    allow_change_staff: bool = True
    allow_change_resource: bool = True
    # Future: allow_move_time: bool = False

    model_config = ConfigDict(from_attributes=True)


class RescheduleResult(BaseModel):
    """Kết quả tái lập lịch."""
    success_count: int
    failed_count: int
    data: SchedulingSolution # Assignments mới
    failed_items: list[uuid.UUID] # Items không tìm được slot

    model_config = ConfigDict(from_attributes=True)
