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
from .slot_finder import SlotFinder


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
        query = text("""
            SELECT bi.id, bi.start_time
            FROM booking_items bi
            WHERE bi.booking_id = :booking_id
              AND bi.staff_id IS NULL
        """)
        result = await self.session.execute(query, {"booking_id": str(booking_id)})
        rows = result.fetchall()

        if not rows:
            return SchedulingSolution(
                status=SolveStatus.FEASIBLE,
                message="Không có dịch vụ cần gán"
            )

        target_date = rows[0][1].date()
        item_ids = [uuid.UUID(str(row[0])) for row in rows]

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
        if not start_date:
            start_date = date.today()
        if not end_date:
            end_date = start_date

        conflicts = []

        if staff_id:
            query = text("""
                SELECT
                    bi.id, bi.booking_id, bi.start_time, bi.end_time,
                    s.name as service_name
                FROM booking_items bi
                JOIN services s ON bi.service_id = s.id
                WHERE bi.staff_id = :staff_id
                  AND date(bi.start_time) >= :start_date
                  AND date(bi.end_time) <= :end_date
                  AND bi.status NOT IN ('CANCELLED', 'COMPLETED')
            """)
            result = await self.session.execute(query, {
                "staff_id": str(staff_id),
                "start_date": start_date,
                "end_date": end_date
            })
            rows = result.fetchall()

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
        if not request.conflict_booking_item_ids:
            return RescheduleResult(
                success_count=0,
                failed_count=0,
                data=SchedulingSolution(status=SolveStatus.FEASIBLE),
                failed_items=[]
            )

        first_id = request.conflict_booking_item_ids[0]
        query = text("SELECT start_time FROM booking_items WHERE id = :id")
        result = await self.session.execute(query, {"id": str(first_id)})
        row = result.first()

        if not row:
            return RescheduleResult(
                success_count=0,
                failed_count=len(request.conflict_booking_item_ids),
                data=SchedulingSolution(status=SolveStatus.ERROR, message="Không tìm thấy item"),
                failed_items=request.conflict_booking_item_ids
            )

        target_date = row[0].date()

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

        solver = SpaSolver(problem)
        finder = SlotFinder(problem, solver)

        search_start = request.time_window.start if request.time_window else time(8, 0)
        search_end = request.time_window.end if request.time_window else time(21, 0)
        required_skill_ids = [s.id for s in service.skills]
        required_resource_group_id = (
            service.resource_requirements[0].group_id
            if service.resource_requirements else None
        )

        available_options = finder.find_slots(
            duration=service.duration,
            required_skill_ids=required_skill_ids,
            required_resource_group_id=required_resource_group_id,
            preferred_staff_id=request.preferred_staff_id,
            search_start=search_start,
            search_end=search_end
        )

        available_options.sort(key=lambda x: x.score, reverse=True)
        top_options = available_options[:20]

        return SlotSuggestionResponse(
            available_slots=top_options,
            total_found=len(available_options),
            message="Tìm kiếm thành công" if top_options else "Không tìm thấy khung giờ phù hợp"
        )
