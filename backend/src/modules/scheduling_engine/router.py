"""
Scheduling Module - API Endpoints

Hệ thống lập lịch thông minh (Optimization Solver).
Sử dụng trí tuệ nhân tạo (OR-Tools) để tự động hóa việc phân bổ Kỹ thuật viên và Phòng.
"""

import uuid
from datetime import date
from fastapi import APIRouter, Depends, Query

from .models import (
    SchedulingSolution,
    SolutionMetrics,
    SolveRequest,
    EvaluateRequest,
    CompareResponse,
    ConflictCheckResponse,
    RescheduleRequest,
    RescheduleResult,
    SlotSearchRequest,
    SlotSuggestionResponse
)
from .service import SchedulingService

router = APIRouter(prefix="/scheduling", tags=["Scheduling Engine"])


@router.post("/solve", response_model=SchedulingSolution)
async def solve_scheduling(
    request: SolveRequest,
    service: SchedulingService = Depends()
) -> SchedulingSolution:
    """Tự động giải bài toán lập lịch tối ưu."""
    return await service.solve(request)


@router.post("/evaluate", response_model=SolutionMetrics)
async def evaluate_schedule(
    request: EvaluateRequest,
    service: SchedulingService = Depends()
) -> SolutionMetrics:
    """Đánh giá chất lượng lịch làm việc hiện tại."""
    return await service.evaluate(request.target_date)


@router.post("/compare", response_model=CompareResponse)
async def compare_schedules(
    target_date: date,
    service: SchedulingService = Depends()
) -> CompareResponse:
    """So sánh Lịch thủ công vs Lịch do AI đề xuất."""
    # Logic compare cần manual + optimized, service hiện tại tách rời.
    # Ta tái sử dụng logic cũ nhưng chuyển vào service hoặc gọi 2 hàm service.

    # 1. Evaluate Manual
    manual = await service.evaluate(target_date)

    # 2. Solve Optimized
    optimized_sol = await service.solve(SolveRequest(target_date=target_date))

    if optimized_sol.metrics:
        # TODO: Implement Detail Comparison Logic in Service or Utility
        # For now return direct metrics
        return CompareResponse(
            manual_metrics=manual,
            optimized_metrics=optimized_sol.metrics,
            improvement_summary={"status": "computed"}
        )
    else:
        return CompareResponse(
             manual_metrics=manual,
            optimized_metrics=manual,
            improvement_summary={"error": "Optimization failed"}
        )


@router.get("/suggestions/{booking_id}", response_model=SchedulingSolution)
async def get_suggestions(
    booking_id: uuid.UUID,
    service: SchedulingService = Depends()
) -> SchedulingSolution:
    """Gợi ý phân công nhanh cho một Lịch hẹn."""
    return await service.get_suggestions(booking_id)


# ============================================================================
# NEW ENDPOINTS (PHASE 2)
# ============================================================================

@router.get("/conflicts", response_model=ConflictCheckResponse)
async def check_conflicts(
    staff_id: uuid.UUID | None = Query(None, description="ID nhân viên (nếu kiểm tra nghỉ phép)"),
    start_date: date | None = Query(None),
    end_date: date | None = Query(None),
    service: SchedulingService = Depends()
) -> ConflictCheckResponse:
    """
    **Kiểm tra xung đột lịch.**

    Dùng khi:
    - Nhân viên xin nghỉ phép (check xem có dính booking nào không).
    - Bảo trì phòng (check booking dính phòng).
    """
    return await service.check_conflicts(staff_id, start_date, end_date)


@router.post("/reschedule", response_model=RescheduleResult)
async def auto_reschedule(
    request: RescheduleRequest,
    service: SchedulingService = Depends()
) -> RescheduleResult:
    """
    **Tự động tái lập lịch (Tìm người thay thế).**

    Khi có xung đột (VD: NV nghỉ), API này sẽ cố gắng tìm KTV khác phù hợp
    cho các booking bị ảnh hưởng (cùng giờ, đủ kỹ năng).

    Trả về danh sách assignments mới nếu thành công.
    """
    result = await service.reschedule(request)
    if result.failed_count > 0 and result.success_count == 0:
        # Nếu fail hết thì báo lỗi 400 hoặc trả về result tùy policy FE
        # Ở đây ta trả về result để FE hiển thị items nào fail
        pass
    return result


@router.post("/find-slots", response_model=SlotSuggestionResponse)
async def find_available_slots(
    request: SlotSearchRequest,
    service: SchedulingService = Depends()
) -> SlotSuggestionResponse:
    """
    **Tìm kiếm khung giờ khả dụng thông minh (Smart Slot Finding).**

    Dùng khi khách hàng muốn đặt lịch:
    - AI sẽ tính toán và gợi ý các khung giờ tốt nhất (tối đa 20 gợi ý).
    - Ưu tiên nhân viên yêu thích (nếu có).
    - Đảm bảo đủ tài nguyên (phòng/máy) và nhân viên có kỹ năng phù hợp.
    """
    return await service.find_available_slots(request)


@router.get("/health")
async def check_ortools():
    """Kiểm tra sức khỏe hệ thống OR-Tools."""
    try:
        from ortools.sat.python import cp_model
        model = cp_model.CpModel()
        x = model.NewIntVar(0, 10, 'x')
        model.Add(x >= 5)
        model.Minimize(x)
        solver = cp_model.CpSolver()
        status = solver.Solve(model)
        return {"status": "ok", "test_status": "OPTIMAL" if status == cp_model.OPTIMAL else "FAILED"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
