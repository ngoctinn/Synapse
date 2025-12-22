"""
Scheduling Engine Module - Business Logic Service

Service Layer xử lý logic nghiệp vụ cho:
1. Giải bài toán lập lịch (Solve)
2. Đánh giá chất lượng lịch (Evaluate)
3. So sánh hiệu quả (Compare)
4. Phát hiện xung đột (Conflict Detection)
5. Tái lập lịch tự động (Reschedule)
6. Tìm kiếm khung giờ thông minh (Smart Slot Finding)
"""

from fastapi import Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import selectinload
from sqlmodel import select
from datetime import time, timedelta, datetime, date
from sqlmodel.ext.asyncio.session import AsyncSession
import uuid

from src.common.database import get_db_session
from .models import (
    SolveRequest,
    SchedulingSolution,
    SolutionMetrics,
    SolveStatus,
    ConflictCheckResponse,
    ConflictInfo,
    ConflictType,
    RescheduleRequest,
    RescheduleResult,
    SlotSearchRequest,
    SlotSuggestionResponse,
    SlotOption,
    StaffSuggestionInfo,
    ResourceSuggestionInfo
)
from .data_extractor import DataExtractor
from .solver import SpaSolver
from .evaluator import ScheduleEvaluator
from .flexible_solver import FlexibleTimeSolver


class SchedulingService:
    """Service trung tâm quản lý Scheduling Engine."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    # =========================================================================
    # CORE SCHEDULING OPERATIONS
    # =========================================================================

    async def solve(self, request: SolveRequest) -> SchedulingSolution:
        """Giải bài toán lập lịch."""
        target_date = request.target_date or date.today()

        extractor = DataExtractor(self.session)
        problem = await extractor.extract_problem(
            target_date=target_date,
            booking_item_ids=request.booking_item_ids
        )

        if not problem.unassigned_items:
            return SchedulingSolution(
                status=SolveStatus.FEASIBLE,
                message="Không có booking items cần gán"
            )

        if not problem.available_staff:
            return SchedulingSolution(
                status=SolveStatus.INFEASIBLE,
                message="Không có nhân viên khả dụng trong ngày này"
            )

        solver = SpaSolver(problem)
        solution = solver.solve(time_limit_seconds=request.time_limit_seconds)
        return solution

    async def evaluate(self, target_date: date) -> SolutionMetrics:
        """Đánh giá lịch hiện tại."""
        evaluator = ScheduleEvaluator(self.session)
        return await evaluator.evaluate_current_schedule(target_date)

    async def get_suggestions(self, booking_id: uuid.UUID) -> SchedulingSolution:
        """Gợi ý slot cho một booking cụ thể."""
        from src.modules.bookings.models import BookingItem

        query = select(BookingItem.id, BookingItem.start_time).where(
            BookingItem.booking_id == booking_id,
            BookingItem.staff_id == None
        )
        result = await self.session.exec(query)
        rows = result.all()

        if not rows:
            return SchedulingSolution(
                status=SolveStatus.FEASIBLE,
                message="Không có dịch vụ cần gán"
            )

        target_date = rows[0][1].date()
        item_ids = [row[0] for row in rows]

        extractor = DataExtractor(self.session)
        problem = await extractor.extract_problem(
            target_date=target_date,
            booking_item_ids=item_ids
        )

        if not problem.unassigned_items:
            return SchedulingSolution(
                status=SolveStatus.FEASIBLE,
                message="Không có items chưa gán"
            )

        solver = SpaSolver(problem)
        return solver.solve(time_limit_seconds=10)

    # =========================================================================
    # CONFLICT DETECTION & RESCHEDULING
    # =========================================================================

    async def check_conflicts(
        self,
        staff_id: uuid.UUID | None = None,
        start_date: date | None = None,
        end_date: date | None = None
    ) -> ConflictCheckResponse:
        """
        Kiểm tra xung đột lịch.
        Use case: Khi nhân viên xin nghỉ, kiểm tra có booking nào bị ảnh hưởng không.
        """
        # Import lazy
        from src.modules.bookings.models import BookingItem, BookingStatus
        from src.modules.services.models import Service
        from sqlmodel import col, func, and_

        if not start_date:
            start_date = date.today()
        if not end_date:
            end_date = start_date

        conflicts = []

        if staff_id:
            # SQLModel Select replacement
            query = (
                select(
                    BookingItem.id,
                    BookingItem.booking_id,
                    BookingItem.start_time,
                    BookingItem.end_time,
                    Service.name
                )
                .join(Service, BookingItem.service_id == Service.id)
                .where(
                    BookingItem.staff_id == staff_id,
                    func.date(BookingItem.start_time) >= start_date,
                    func.date(BookingItem.end_time) <= end_date,
                    col(BookingItem.status).notin([BookingStatus.CANCELLED, BookingStatus.COMPLETED])
                )
            )

            result = await self.session.exec(query)
            rows = result.all()

            for row in rows:
                conflicts.append(ConflictInfo(
                    booking_item_id=row[0],
                    booking_id=row[1],
                    type=ConflictType.STAFF_UNAVAILABLE,
                    description=f"Nhân viên bận/nghỉ nhưng có lịch: {row[4]}",
                    affected_staff_id=staff_id,
                    start_time=row[2],
                    end_time=row[3]
                ))

        return ConflictCheckResponse(
            has_conflicts=len(conflicts) > 0,
            conflicts=conflicts,
            total_conflicts=len(conflicts)
        )

    async def reschedule(self, request: RescheduleRequest) -> RescheduleResult:
        """
        Tự động tái lập lịch.
        Logic:
        1. Lấy danh sách items bị conflict.
        2. Coi chúng là 'unassigned' (cần null staff_id/resource_id tạm thời trong logic solver).
        3. Chạy Solver để tìm staff/resource thay thế (giữ nguyên giờ).
        """
        from src.modules.bookings.models import BookingItem

        if not request.conflict_booking_item_ids:
            return RescheduleResult(
                success_count=0,
                failed_count=0,
                data=SchedulingSolution(status=SolveStatus.FEASIBLE),
                failed_items=[]
            )

        first_id = request.conflict_booking_item_ids[0]
        # SQLModel Select replacement
        item = await self.session.get(BookingItem, first_id)

        if not item:
            return RescheduleResult(
                success_count=0,
                failed_count=len(request.conflict_booking_item_ids),
                data=SchedulingSolution(status=SolveStatus.ERROR, message="Không tìm thấy item"),
                failed_items=request.conflict_booking_item_ids
            )

        target_date = item.start_time.date()

        extractor = DataExtractor(self.session)
        problem = await extractor.extract_problem(
            target_date=target_date,
            booking_item_ids=request.conflict_booking_item_ids
        )

        solver = SpaSolver(problem)
        solution = solver.solve(time_limit_seconds=30)

        success_items = []
        failed_items = []

        if solution.status in [SolveStatus.OPTIMAL, SolveStatus.FEASIBLE]:
            for assignment in solution.assignments:
                success_items.append(assignment.item_id)

            for item_id in request.conflict_booking_item_ids:
                if item_id not in success_items:
                    failed_items.append(item_id)
        else:
            failed_items = request.conflict_booking_item_ids

        return RescheduleResult(
            success_count=len(success_items),
            failed_count=len(failed_items),
            data=solution,
            failed_items=failed_items
        )

    # =========================================================================
    # SMART SLOT FINDING
    # =========================================================================

    async def find_available_slots(
        self,
        request: SlotSearchRequest
    ) -> SlotSuggestionResponse:
        """Tìm kiếm khung giờ khả dụng tối ưu (Smart Slot Finding)."""
        from src.modules.services.models import Service

        # Eagerly load relationships để tránh lazy loading error trong async context
        query_service = select(Service).where(Service.id == request.service_id).options(
            selectinload(Service.skills),
            selectinload(Service.resource_requirements)
        )
        result_service = await self.session.exec(query_service)
        service = result_service.first()

        if not service:
            raise HTTPException(status_code=404, detail="Không tìm thấy dịch vụ")

        extractor = DataExtractor(self.session)
        problem = await extractor.extract_problem(target_date=request.target_date)

        if not problem.available_staff:
            return SlotSuggestionResponse(
                available_slots=[],
                total_found=0,
                message="Không có nhân viên làm việc vào ngày này"
            )

        # ====================================================================
        # H07: Lấy giờ hoạt động từ Database (thay vì hardcode)
        # ====================================================================
        from src.modules.operating_hours.service import OperatingHoursService

        hours_service = OperatingHoursService(self.session)
        day_hours = await hours_service.get_hours_for_date(request.target_date)

        # Nếu Spa đóng cửa ngày này → không có slot
        if day_hours is None or day_hours.is_closed or not day_hours.periods:
            return SlotSuggestionResponse(
                available_slots=[],
                total_found=0,
                message="Spa đóng cửa vào ngày này"
            )

        # Lấy giờ mở/đóng cửa từ database
        # Ưu tiên time_window từ request nếu có, fallback về operating hours
        if request.time_window:
            search_start = request.time_window.start
            search_end = request.time_window.end
        else:
            # Lấy từ periods (có thể có nhiều period, lấy min open - max close)
            search_start = min(p.open_time for p in day_hours.periods if not p.is_closed)
            search_end = max(p.close_time for p in day_hours.periods if not p.is_closed)

        # ====================================================================
        # Sử dụng FlexibleTimeSolver (OR-Tools CP-SAT)
        # ====================================================================
        solver = FlexibleTimeSolver(problem)

        required_skill_ids = [s.id for s in service.skills]

        # Hỗ trợ multi-resource
        required_resource_group_ids = [
            req.group_id for req in service.resource_requirements
        ] if service.resource_requirements else []

        available_options = solver.find_optimal_slots(
            duration_minutes=service.duration,
            required_skill_ids=required_skill_ids,
            required_resource_group_ids=required_resource_group_ids,
            preferred_staff_id=request.preferred_staff_id,
            search_start=search_start,
            search_end=search_end,
            top_k=5
        )

        return SlotSuggestionResponse(
            available_slots=available_options,
            total_found=len(available_options),
            message="Tìm kiếm thành công" if available_options else "Không tìm thấy khung giờ phù hợp"
        )
