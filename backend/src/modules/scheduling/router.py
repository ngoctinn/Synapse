"""
Scheduling Module - API Endpoints

🎓 API cho bài toán lập lịch tối ưu - Đóng góp học thuật
"""

import uuid
from datetime import date, datetime, timezone
from fastapi import APIRouter, Depends, status, HTTPException

from sqlmodel.ext.asyncio.session import AsyncSession
from src.common.database import get_db_session

from .models import (
    SchedulingSolution,
    SolutionMetrics,
    SolveRequest,
    EvaluateRequest,
    CompareResponse,
    SolveStatus,
)
from .data_extractor import DataExtractor
from .solver import SpaSolver
from .evaluator import ScheduleEvaluator

router = APIRouter(prefix="/scheduling", tags=["Lập Lịch Tối Ưu"])


@router.post(
    "/solve",
    response_model=SchedulingSolution,
    summary="Giải bài toán lập lịch"
)
async def solve_scheduling(
    request: SolveRequest,
    session: AsyncSession = Depends(get_db_session)
) -> SchedulingSolution:
    """
    🎓 **API CHÍNH: Giải bài toán lập lịch tối ưu**

    Sử dụng Google OR-Tools CP-SAT để tìm phân công tối ưu cho các booking items.

    **Input:**
    - `booking_item_ids`: Danh sách item cần gán (None = tất cả unassigned)
    - `target_date`: Ngày mục tiêu (None = hôm nay)
    - `time_limit_seconds`: Giới hạn thời gian giải
    - `weight_*`: Trọng số cho các thành phần hàm mục tiêu

    **Output:**
    - `status`: OPTIMAL, FEASIBLE, INFEASIBLE, TIMEOUT
    - `assignments`: Danh sách phân công (item → staff + resource)
    - `metrics`: Các chỉ số đánh giá (utilization, fairness, etc.)

    **Ứng dụng:**
    - Gợi ý phân công KTV và Phòng
    - Demo so sánh với phân công thủ công
    """
    target_date = request.target_date or date.today()

    # 1. Trích xuất dữ liệu
    extractor = DataExtractor(session)
    problem = await extractor.extract_problem(
        target_date=target_date,
        booking_item_ids=request.booking_item_ids
    )

    if not problem.unassigned_items:
        return SchedulingSolution(
            status=SolveStatus.FEASIBLE,
            message="Không có booking items nào cần gán"
        )

    if not problem.available_staff:
        return SchedulingSolution(
            status=SolveStatus.INFEASIBLE,
            message="Không có KTV nào làm việc trong ngày này"
        )

    # 2. Giải bài toán
    solver = SpaSolver(problem)
    solution = solver.solve(time_limit_seconds=request.time_limit_seconds)

    return solution


@router.post(
    "/evaluate",
    response_model=SolutionMetrics,
    summary="Đánh giá lịch hiện tại"
)
async def evaluate_schedule(
    request: EvaluateRequest,
    session: AsyncSession = Depends(get_db_session)
) -> SolutionMetrics:
    """
    Đánh giá chất lượng lịch hiện tại (đã gán thủ công).

    **Output:**
    - `staff_utilization`: Tỷ lệ sử dụng KTV (0-1)
    - `resource_utilization`: Tỷ lệ sử dụng Phòng (0-1)
    - `jain_fairness_index`: Chỉ số công bằng Jain (0-1, 1 = hoàn hảo)
    - `max/min/avg_staff_load_minutes`: Phân bố workload
    """
    evaluator = ScheduleEvaluator(session)
    return await evaluator.evaluate_current_schedule(request.target_date)


@router.post(
    "/compare",
    response_model=CompareResponse,
    summary="So sánh Manual vs Optimized"
)
async def compare_schedules(
    target_date: date,
    session: AsyncSession = Depends(get_db_session)
) -> CompareResponse:
    """
    🎓 **So sánh lịch thủ công với lịch tối ưu**

    Đây là API quan trọng cho khóa luận - cung cấp số liệu so sánh.

    **Output:**
    - `manual_metrics`: Chỉ số của lịch hiện tại
    - `optimized_metrics`: Chỉ số của lịch tối ưu
    - `improvement_summary`: % cải thiện của từng chỉ số
    """
    evaluator = ScheduleEvaluator(session)

    # 1. Đánh giá lịch hiện tại
    manual_metrics = await evaluator.evaluate_current_schedule(target_date)

    # 2. Giải bài toán để lấy lịch tối ưu
    extractor = DataExtractor(session)
    problem = await extractor.extract_problem(target_date=target_date)

    if not problem.unassigned_items:
        # Không có items để so sánh, trả về metrics giống nhau
        return CompareResponse(
            manual_metrics=manual_metrics,
            optimized_metrics=manual_metrics,
            improvement_summary={"note": "Không có booking items chưa gán để tối ưu"}
        )

    solver = SpaSolver(problem)
    solution = solver.solve(time_limit_seconds=30)

    if solution.metrics:
        # 3. So sánh
        return await evaluator.compare_schedules(manual_metrics, solution.metrics)
    else:
        return CompareResponse(
            manual_metrics=manual_metrics,
            optimized_metrics=manual_metrics,
            improvement_summary={"error": "Không giải được bài toán tối ưu"}
        )


@router.get(
    "/suggestions/{booking_id}",
    response_model=SchedulingSolution,
    summary="Gợi ý phân công cho booking"
)
async def get_suggestions(
    booking_id: uuid.UUID,
    session: AsyncSession = Depends(get_db_session)
) -> SchedulingSolution:
    """
    Gợi ý KTV và Phòng tối ưu cho một booking cụ thể.

    **Use case:** Lễ tân đang xử lý booking, muốn biết nên gán cho ai.
    """
    from sqlalchemy import text

    # Lấy các items của booking này
    query = text("""
        SELECT bi.id, bi.start_time
        FROM booking_items bi
        WHERE bi.booking_id = :booking_id
          AND bi.staff_id IS NULL
    """)
    result = await session.execute(query, {"booking_id": str(booking_id)})
    rows = result.fetchall()

    if not rows:
        return SchedulingSolution(
            status=SolveStatus.FEASIBLE,
            message="Không có dịch vụ nào cần gán trong booking này"
        )

    # Lấy ngày từ item đầu tiên
    target_date = rows[0][1].date()
    item_ids = [uuid.UUID(str(row[0])) for row in rows]

    # Giải bài toán
    extractor = DataExtractor(session)
    problem = await extractor.extract_problem(
        target_date=target_date,
        booking_item_ids=item_ids
    )

    if not problem.unassigned_items:
        return SchedulingSolution(
            status=SolveStatus.FEASIBLE,
            message="Không có dịch vụ nào cần gán"
        )

    solver = SpaSolver(problem)
    return solver.solve(time_limit_seconds=10)


@router.get(
    "/health",
    summary="Kiểm tra OR-Tools"
)
async def check_ortools():
    """Kiểm tra OR-Tools đã được cài đặt đúng chưa."""
    try:
        from ortools.sat.python import cp_model

        # Simple test
        model = cp_model.CpModel()
        x = model.NewIntVar(0, 10, 'x')
        model.Add(x >= 5)
        model.Minimize(x)

        solver = cp_model.CpSolver()
        status = solver.Solve(model)

        return {
            "or_tools_version": "9.14",
            "test_status": "OPTIMAL" if status == cp_model.OPTIMAL else "FAILED",
            "test_result": solver.Value(x) if status == cp_model.OPTIMAL else None,
            "message": "OR-Tools hoạt động bình thường"
        }
    except Exception as e:
        return {
            "or_tools_version": "unknown",
            "test_status": "ERROR",
            "message": str(e)
        }
