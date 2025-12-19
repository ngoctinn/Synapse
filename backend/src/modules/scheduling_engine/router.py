"""
Scheduling Module - API Endpoints

Hệ thống lập lịch thông minh (Optimization Solver).
Sử dụng trí tuệ nhân tạo (OR-Tools) để tự động hóa việc phân bổ Kỹ thuật viên và Phòng cho các dịch vụ khách hàng
nhằm tối ưu hóa hiệu suất và sự công bằng.
"""

import uuid
from datetime import date
from fastapi import APIRouter, Depends

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

router = APIRouter(prefix="/scheduling", tags=["Scheduling Engine"])


@router.post("/solve", response_model=SchedulingSolution)
async def solve_scheduling(
    request: SolveRequest,
    session: AsyncSession = Depends(get_db_session)
) -> SchedulingSolution:
    """
    **Tự động giải bài toán lập lịch tối ưu.**

    Tự động gán Kỹ thuật viên và Phòng cho các dịch vụ chưa có người phụ trách bằng thuật toán Constraint Programming (CP-SAT).

    ### Logic Flow:
    1. **Data Extraction**: Thu thập dữ liệu về các lượt đặt trước (`BookingItems`), lịch làm việc của nhân viên (`StaffSchedule`) và danh sách kỹ năng.
    2. **Model Building**: Định nghĩa các biến quyết định (Interval variables) và các ràng buộc (Hard Constraints):
        - KTV phải có kỹ năng phù hợp với dịch vụ.
        - KTV và Phòng không thể làm 2 việc cùng lúc (No overlap).
        - Công việc phải nằm trong khung giờ làm việc của nhân viên.
    3. **Optimization**: Tối ưu hóa hàm mục tiêu (Objective Function):
        - Giảm thiểu tổng thời gian chờ của khách.
        - Tối ưu hóa hiệu suất sử dụng phòng.
        - Đảm bảo sự công bằng về khối lượng công việc giữa các nhân viên.
    4. **Result**: Trả về danh sách các đề xuất phân công tối ưu.

    ### Tham số đầu vào:
    - **target_date**: Ngày cần lập lịch.
    - **time_limit_seconds**: Giới hạn thời gian chạy của Solver (mặc định 30s).
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
            message="No booking items to assign"
        )

    if not problem.available_staff:
        return SchedulingSolution(
            status=SolveStatus.INFEASIBLE,
            message="No staff available on this date"
        )

    # 2. Giải bài toán
    solver = SpaSolver(problem)
    solution = solver.solve(time_limit_seconds=request.time_limit_seconds)

    return solution


@router.post("/evaluate", response_model=SolutionMetrics)
async def evaluate_schedule(
    request: EvaluateRequest,
    session: AsyncSession = Depends(get_db_session)
) -> SolutionMetrics:
    """
    **Đánh giá chất lượng lịch làm việc hiện tại.**

    Phân tích và tính toán các chỉ số hiệu quả của bảng điều phối hiện tại đang được sắp xếp thủ công hoặc tự động.

    ### Các chỉ số thu thập:
    - **Utilization**: Tỷ lệ thời gian làm việc thực tế so với thời gian rảnh.
    - **Fairness Index**: Chỉ số đo lường sự cân bằng trong việc phân bổ ca giữa các nhân viên.
    - **Staff/Resource distribution**: Biểu đồ phân bổ tải trọng.
    """
    evaluator = ScheduleEvaluator(session)
    return await evaluator.evaluate_current_schedule(request.target_date)


@router.post("/compare", response_model=CompareResponse)
async def compare_schedules(
    target_date: date,
    session: AsyncSession = Depends(get_db_session)
) -> CompareResponse:
    """
    **So sánh Lịch thủ công vs Lịch do AI đề xuất.**

    Giúp quản lý thấy được giá trị của việc sử dụng AI trong việc cải thiện hiệu suất vận hành.

    ### Logic Flow:
    1. Đo lường hiệu quả của lịch đang chạy (Manual).
    2. Mô phỏng việc lập lịch lại bằng Solver (AI).
    3. Tính toán phần trăm cải thiện (Improvement %) trên các tiêu chí (Fairness, Waiting time, Utilization).
    """
    evaluator = ScheduleEvaluator(session)

    # 1. Đánh giá lịch hiện tại
    manual_metrics = await evaluator.evaluate_current_schedule(target_date)

    # 2. Giải bài toán để lấy lịch tối ưu
    extractor = DataExtractor(session)
    problem = await extractor.extract_problem(target_date=target_date)

    if not problem.unassigned_items:
        return CompareResponse(
            manual_metrics=manual_metrics,
            optimized_metrics=manual_metrics,
            improvement_summary={"note": "No unassigned items to optimize"}
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
            improvement_summary={"error": "Optimization solver failed"}
        )


@router.get("/suggestions/{booking_id}", response_model=SchedulingSolution)
async def get_suggestions(
    booking_id: uuid.UUID,
    session: AsyncSession = Depends(get_db_session)
) -> SchedulingSolution:
    """
    **Gợi ý phân công nhanh cho một Lịch hẹn.**

    Sử dụng Solver để tìm ra KTV và Phòng "tốt nhất" còn trống cho các dịch vụ trong một Booking cụ thể.
    Dùng để hỗ trợ lễ tân khi khách gọi điện đặt lịch.
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
            message="No services to assign for this booking"
        )

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
            message="No unassigned items"
        )

    solver = SpaSolver(problem)
    return solver.solve(time_limit_seconds=10)


@router.get("/health")
async def check_ortools():
    """
    **Kiểm tra sức khỏe hệ thống giải toán.**

    Xác nhận thư viện Google OR-Tools được cài đặt đúng và có thể thực thi các phép toán cơ bản.
    """
    try:
        from ortools.sat.python import cp_model
        model = cp_model.CpModel()
        x = model.NewIntVar(0, 10, 'x')
        model.Add(x >= 5)
        model.Minimize(x)
        solver = cp_model.CpSolver()
        status = solver.Solve(model)

        return {
            "status": "ok",
            "test_status": "OPTIMAL" if status == cp_model.OPTIMAL else "FAILED"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
