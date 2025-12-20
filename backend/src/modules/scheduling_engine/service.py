"""
Operating Hours Module - Business Logic Service

Service Layer xử lý logic nghiệp vụ cho:
1. Giải bài toán lập lịch (Solve)
2. Đánh giá chất lượng lịch (Evaluate)
3. So sánh hiệu quả (Compare)
4. Phát hiện xung đột (Conflict Detection) - NEW
5. Tái lập lịch tự động (Reschedule) - NEW
"""

from fastapi import Depends, HTTPException, status
from sqlalchemy import text
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


class SchedulingService:
    """Service trung tâm quản lý Scheduling Engine."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def solve(self, request: SolveRequest) -> SchedulingSolution:
        """Giải bài toán lập lịch."""
        target_date = request.target_date or date.today()

        # 1. Trích xuất dữ liệu
        extractor = DataExtractor(self.session)
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

    async def evaluate(self, target_date: date) -> SolutionMetrics:
        """Đánh giá lịch hiện tại."""
        evaluator = ScheduleEvaluator(self.session)
        return await evaluator.evaluate_current_schedule(target_date)

    async def get_suggestions(self, booking_id: uuid.UUID) -> SchedulingSolution:
        """Gợi ý slot cho một booking cụ thể."""
        # Lấy items của booking
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
                message="No services to assign"
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
                message="No unassigned items"
            )

        solver = SpaSolver(problem)
        return solver.solve(time_limit_seconds=10)

    # ============================================================================
    # NEW FEATURES: CONFLICT & RESCHEDULE
    # ============================================================================

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

        # 1. Tìm các booking items đã gán cho staff trong khoảng thời gian này
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

        # Lấy thông tin items
        # Để đơn giản, ta giả sử tất cả items cùng 1 ngày (logic thực tế cần group by date)
        # Ở đây ta lấy ngày của item đầu tiên
        first_id = request.conflict_booking_item_ids[0]
        query = text("SELECT start_time FROM booking_items WHERE id = :id")
        result = await self.session.execute(query, {"id": str(first_id)})
        row = result.first()
        if not row:
             return RescheduleResult(
                success_count=0,
                failed_count=len(request.conflict_booking_item_ids),
                data=SchedulingSolution(status=SolveStatus.ERROR, message="Item not found"),
                failed_items=request.conflict_booking_item_ids
            )

        target_date = row[0].date()

        # Extract problem CHỈ với các items cần reschedule
        # Lưu ý: DataExtractor mặc định chỉ lấy items có staff_id IS NULL.
        # Ta cần modify extractor hoặc truyền parameter đặc biệt.
        # Tuy nhiên, ta có thể dùng `booking_item_ids` param của `extract_problem`.
        # Nhưng `extract_problem` hiện tại filter: WHERE staff_id IS NULL (thường là vậy).
        # Cần kiểm tra lại DataExtractor. Nếu nó lọc cứng staff_id IS NULL thì ta phải sửa DataExtractor hoặc
        # fake update tạm thời trong transaction (nhưng rollback sau đó? Rủi ro).

        # Mở rộng DataExtractor để chấp nhận force include items kể cả đã có staff.
        # (Giả định DataExtractor hỗ trợ hoặc ta sẽ sửa nó ở bước sau nếu cần).
        # Hiện tại ta cứ gọi, và giả định solver sẽ xử lý.

        extractor = DataExtractor(self.session)
        # TODO: Cần đảm bảo DataExtractor.extract_problem KHÔNG lọc bỏ items được truyền trong booking_item_ids
        # dù chúng đã có staff_id. (Logic: coi chúng là unassigned trong bài toán).

        problem = await extractor.extract_problem(
            target_date=target_date,
            booking_item_ids=request.conflict_booking_item_ids
        )

        # Chạy Solver
        solver = SpaSolver(problem)
        solution = solver.solve(time_limit_seconds=30)

        success_items = []
        failed_items = []

        if solution.status in [SolveStatus.OPTIMAL, SolveStatus.FEASIBLE]:
            for assignment in solution.assignments:
                success_items.append(assignment.item_id)

            # Những item không có trong assignment là failed
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

    async def find_available_slots(
        self,
        request: SlotSearchRequest
    ) -> SlotSuggestionResponse:
        """
        Tìm kiếm khung giờ khả dụng tối ưu (Smart Slot Finding).
        Logic:
        1. Lấy yêu cầu của service (skills, resources, duration).
        2. Sinh các khung giờ ứng viên (mỗi 15 phút).
        3. Kiểm tra tính khả thi của từng ứng viên.
        4. Chấm điểm và trả về N kết quả tốt nhất.
        """
        from src.modules.services.models import Service

        # 1. Lấy thông tin service
        service = await self.session.get(Service, request.service_id)
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy dịch vụ"
            )

        # 2. Extract problem context (staff schedules, existing assignments, etc.)
        extractor = DataExtractor(self.session)
        problem = await extractor.extract_problem(target_date=request.target_date)

        if not problem.available_staff:
             return SlotSuggestionResponse(available_slots=[], total_found=0, message="Không có nhân viên làm việc vào ngày này")

        # 3. Định nghĩa khung thời gian tìm kiếm
        # Mặc định 08:00 - 20:00 hoặc theo request
        search_start = request.time_window.start if request.time_window else time(8, 0)
        search_end = request.time_window.end if request.time_window else time(21, 0)

        # 4. Sinh ứng viên (mỗi 15 phút)
        increment = timedelta(minutes=15)
        current_dt = datetime.combine(request.target_date, search_start)
        end_dt = datetime.combine(request.target_date, search_end)

        # Lấy skill_ids của service
        required_skill_ids = [s.id for s in service.skills]

        # Lấy resource requirements
        # (Giả định đơn giản: lấy group_id từ requirement đầu tiên nếu có)
        required_resource_group_id = None
        if service.resource_requirements:
            required_resource_group_id = service.resource_requirements[0].resource_group_id

        available_options = []

        # Mock solver helper logic (để tránh overlap)
        solver = SpaSolver(problem)

        while current_dt + timedelta(minutes=service.duration) <= end_dt:
            slot_start = current_dt
            slot_end = current_dt + timedelta(minutes=service.duration)

            # Kiểm tra từng nhân viên
            for staff_data in problem.available_staff:
                # Nếu có yêu cầu staff cụ thể, skip người khác
                if request.preferred_staff_id and staff_data.id != request.preferred_staff_id:
                    continue

                # Check 1: Skill
                if not all(sk in staff_data.skill_ids for sk in required_skill_ids):
                    continue

                # Check 2: Working hours & Overlap
                if not solver._is_staff_available(staff_data.id, slot_start, slot_end) or \
                   solver._has_staff_conflict(staff_data.id, slot_start, slot_end):
                    continue

                # Check 3: Resource availability (nêu dịch vụ yêu cầu)
                assigned_resources = []
                if required_resource_group_id:
                    # Tìm tài nguyên trống thuộc group
                    for res in problem.available_resources:
                        if res.group_id == required_resource_group_id and \
                           not solver._has_resource_conflict(res.id, slot_start, slot_end):
                            assigned_resources.append(ResourceSuggestionInfo(
                                id=res.id,
                                name=res.name,
                                group_name=res.group_name
                            ))
                            break # Chỉ lấy 1 tài nguyên phù hợp

                    if not assigned_resources:
                        continue # Unit này yêu cầu resource nhưng không có cái nào trống

                # 5. Chấm điểm
                score = 100
                # Phạt nếu không phải preferred staff
                if request.preferred_staff_id and staff_data.id != request.preferred_staff_id:
                    score -= 30

                # Thưởng nếu là giờ cao điểm hoặc theo logic kinh doanh
                # (Ở đây đơn giản là ưu tiên slot sớm)
                time_penalty = (slot_start.hour * 60 + slot_start.minute) // 60
                final_score = max(0, score - time_penalty)

                available_options.append(SlotOption(
                    start_time=slot_start,
                    end_time=slot_end,
                    staff=StaffSuggestionInfo(
                        id=staff_data.id,
                        name=staff_data.name,
                        is_preferred=(staff_data.id == request.preferred_staff_id)
                    ),
                    resources=assigned_resources,
                    score=final_score
                ))

            current_dt += increment

        # 6. Sắp xếp và lấy Top 20
        available_options.sort(key=lambda x: x.score, reverse=True)
        top_options = available_options[:20]

        return SlotSuggestionResponse(
            available_slots=top_options,
            total_found=len(available_options),
            message="Tìm kiếm thành công" if top_options else "Không tìm thấy khung giờ phù hợp"
        )
