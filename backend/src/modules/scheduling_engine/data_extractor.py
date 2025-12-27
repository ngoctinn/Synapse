"""
Scheduling Module - Data Extractor

Trích xuất dữ liệu từ Database → SchedulingProblem instance.
"""

import uuid
from datetime import datetime, date, time, timezone
from sqlalchemy import text, bindparam
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from src.modules.users.models import User
from src.modules.staff.models import Staff
from typing import TYPE_CHECKING
from .models import (
    SchedulingProblem,
    BookingItemData,
    StaffData,
    StaffScheduleData,
    ResourceData,
    ExistingAssignment,
)

if TYPE_CHECKING:
    from .models import ResourceRequirementData


class DataExtractor:
    """Trích xuất dữ liệu từ DB để tạo SchedulingProblem."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def extract_problem(
        self,
        target_date: date,
        booking_item_ids: list[uuid.UUID] | None = None
    ) -> SchedulingProblem:
        """
        Trích xuất toàn bộ dữ liệu cần thiết cho bài toán lập lịch.

        Args:
            target_date: Ngày mục tiêu
            booking_item_ids: Danh sách item cần gán (None = tất cả unassigned)

        Returns:
            SchedulingProblem instance
        """
        # 1. Lấy booking items chưa gán
        unassigned_items = await self._get_unassigned_items(target_date, booking_item_ids)

        # 2. Lấy danh sách KTV có ca làm việc trong ngày
        staff_schedules = await self._get_staff_schedules(target_date)
        available_staff = await self._get_staff_with_skills(
            [s.staff_id for s in staff_schedules]
        )

        # 3. Lấy danh sách resources khả dụng
        available_resources = await self._get_available_resources()

        # 4. Lấy các lịch đã gán (để tránh conflict), loại trừ items đang xử lý
        existing_assignments = await self._get_existing_assignments(
            target_date,
            exclude_item_ids=booking_item_ids
        )

        return SchedulingProblem(
            unassigned_items=unassigned_items,
            available_staff=available_staff,
            available_resources=available_resources,
            staff_schedules=staff_schedules,
            existing_assignments=existing_assignments,
            target_date=target_date
        )

    async def _get_unassigned_items(
        self,
        target_date: date,
        item_ids: list[uuid.UUID] | None = None
    ) -> list[BookingItemData]:
        """Lấy các booking items chưa được gán staff."""
        # Lazy imports
        from src.modules.bookings.models import BookingItem, Booking, BookingStatus
        from sqlalchemy.orm import selectinload
        from sqlmodel import col

        start_of_day = datetime.combine(target_date, time.min, tzinfo=timezone.utc)
        end_of_day = datetime.combine(target_date, time.max, tzinfo=timezone.utc)

        query = (
            select(BookingItem)
            .join(Booking, BookingItem.booking_id == Booking.id)
            .where(
                BookingItem.start_time >= start_of_day,
                BookingItem.start_time < end_of_day,
                col(Booking.status).notin_([BookingStatus.CANCELLED, BookingStatus.NO_SHOW])
            )
            .options(selectinload(BookingItem.service))
            .order_by(BookingItem.start_time)
        )

        if item_ids:
            query = query.where(col(BookingItem.id).in_(item_ids))

        result = await self.session.exec(query)
        booking_items = result.all()

        items = []
        for bi in booking_items:
            # Service info
            svc_name = bi.service.name if bi.service else "Unknown Service"
            svc_id = bi.service_id

            # Duration check (fallback if property fails)
            duration = bi.duration_minutes
            if duration is None:
                duration = int((bi.end_time - bi.start_time).total_seconds() / 60)

            # Lấy required skills cho service này
            # Lưu ý: service_id có thể None? items phải có service.
            if not svc_id: continue

            required_skills = await self._get_service_required_skills(svc_id)
            required_resources = await self._get_service_required_resources(svc_id)

            items.append(BookingItemData(
                id=bi.id,
                booking_id=bi.booking_id,
                service_id=svc_id,
                service_name=svc_name,
                start_time=bi.start_time,
                end_time=bi.end_time,
                duration_minutes=duration,
                required_skill_ids=required_skills,
                required_resources=required_resources,
                current_staff_id=bi.staff_id # Để tính C_perturb
            ))

        return items

    async def _get_service_required_skills(
        self, service_id: uuid.UUID
    ) -> list[uuid.UUID]:
        """Lấy danh sách skill IDs cần cho service."""
        query = text("""
            SELECT skill_id FROM service_skills
            WHERE service_id = :service_id
        """)
        result = await self.session.execute(query, {"service_id": str(service_id)})
        return [uuid.UUID(str(row[0])) for row in result.fetchall()]

    async def _get_service_required_resources(
        self, service_id: uuid.UUID
    ) -> list["ResourceRequirementData"]:
        """Lấy danh sách resource groups cần cho service (kèm delay/duration)."""
        from .models import ResourceRequirementData

        query = text("""
            SELECT group_id, quantity, start_delay, usage_duration
            FROM service_resource_requirements
            WHERE service_id = :service_id
        """)
        result = await self.session.execute(query, {"service_id": str(service_id)})
        rows = result.fetchall()

        return [
            ResourceRequirementData(
                group_id=uuid.UUID(str(row[0])),
                quantity=row[1],
                start_delay=row[2],
                usage_duration=row[3]
            )
            for row in rows
        ]

    async def _get_staff_schedules(
        self, target_date: date
    ) -> list[StaffScheduleData]:
        """Lấy ca làm việc của KTV trong ngày."""
        query = text("""
            SELECT
                ss.staff_id,
                ss.work_date,
                s.start_time,
                s.end_time,
                s.name as shift_name
            FROM staff_schedules ss
            JOIN shifts s ON ss.shift_id = s.id
            WHERE ss.work_date = :target_date
            ORDER BY s.start_time
        """)
        result = await self.session.execute(query, {"target_date": target_date})
        rows = result.fetchall()

        return [
            StaffScheduleData(
                staff_id=uuid.UUID(str(row[0])),
                work_date=row[1],
                start_time=row[2],
                end_time=row[3],
                shift_name=row[4]
            )
            for row in rows
        ]

    async def _get_staff_with_skills(
        self, staff_ids: list[uuid.UUID]
    ) -> list[StaffData]:
        """Lấy thông tin KTV và skills của họ."""
        unique_ids = list(set(staff_ids))
        if not unique_ids:
            return []

        # Sử dụng SQLModel Select để đảm bảo tương thích type với asyncpg
        stmt = (
            select(Staff.user_id, User.full_name)
            .join(User, Staff.user_id == User.id)
            .where(Staff.user_id.in_(unique_ids))
        )

        result = await self.session.exec(stmt)
        rows = result.all()

        staff_list = []
        for row in rows:
            staff_id = row[0]
            name = row[1] or "Unknown"

            # Lấy skills của staff này
            skills = await self._get_staff_skills(staff_id)

            staff_list.append(StaffData(
                id=staff_id,
                name=name,
                skill_ids=skills
            ))

        return staff_list

    async def _get_staff_skills(self, staff_id: uuid.UUID) -> list[uuid.UUID]:
        """Lấy danh sách skill IDs của staff."""
        query = text("""
            SELECT skill_id FROM staff_skills
            WHERE staff_id = :staff_id
        """)
        result = await self.session.execute(query, {"staff_id": str(staff_id)})
        return [uuid.UUID(str(row[0])) for row in result.fetchall()]

    async def _get_available_resources(self) -> list[ResourceData]:
        """Lấy danh sách resources khả dụng."""
        query = text("""
            SELECT
                r.id,
                r.name,
                r.group_id,
                rg.name as group_name
            FROM resources r
            JOIN resource_groups rg ON r.group_id = rg.id
            WHERE r.status = 'ACTIVE'
            ORDER BY rg.name, r.name
        """)
        result = await self.session.execute(query)
        rows = result.fetchall()

        return [
            ResourceData(
                id=uuid.UUID(str(row[0])),
                name=row[1],
                group_id=uuid.UUID(str(row[2])),
                group_name=row[3]
            )
            for row in rows
        ]

    async def _get_existing_assignments(
        self,
        target_date: date,
        exclude_item_ids: list[uuid.UUID] | None = None
    ) -> list[ExistingAssignment]:
        """Lấy các lịch đã được gán (để tránh conflict)."""
        start_of_day = datetime.combine(target_date, time.min, tzinfo=timezone.utc)
        end_of_day = datetime.combine(target_date, time.max, tzinfo=timezone.utc)

        # 1. Lấy Staff Assignments
        staff_query_str = """
            SELECT
                bi.id,
                bi.staff_id,
                bi.start_time,
                bi.end_time
            FROM booking_items bi
            JOIN bookings b ON bi.booking_id = b.id
            WHERE bi.start_time >= :start_of_day
              AND bi.start_time < :end_of_day
              AND bi.staff_id IS NOT NULL
              AND b.status NOT IN ('CANCELLED', 'NO_SHOW', 'COMPLETED')
        """

        # 2. Lấy Resource Assignments (Joined)
        resource_query_str = """
            SELECT
                bi.id,
                bir.resource_id,
                bi.start_time,
                bi.end_time
            FROM booking_items bi
            JOIN bookings b ON bi.booking_id = b.id
            JOIN booking_item_resources bir ON bi.id = bir.booking_item_id
            WHERE bi.start_time >= :start_of_day
              AND bi.start_time < :end_of_day
              AND b.status NOT IN ('CANCELLED', 'NO_SHOW', 'COMPLETED')
        """

        params = {
            "start_of_day": start_of_day,
            "end_of_day": end_of_day
        }

        if exclude_item_ids:
            exclude_clause = " AND bi.id NOT IN :exclude_ids"
            staff_query_str += exclude_clause
            resource_query_str += exclude_clause
            params["exclude_ids"] = [str(eid) for eid in exclude_item_ids]

        assignments = []

        # Execute Staff Query
        staff_stmt = text(staff_query_str)
        if exclude_item_ids:
            staff_stmt = staff_stmt.bindparams(bindparam("exclude_ids", expanding=True))

        staff_result = await self.session.execute(staff_stmt, params)
        for row in staff_result.fetchall():
            assignments.append(ExistingAssignment(
                staff_id=uuid.UUID(str(row[1])),
                resource_id=None,
                start_time=row[2],
                end_time=row[3]
            ))

        # Execute Resource Query
        resource_stmt = text(resource_query_str)
        if exclude_item_ids:
            resource_stmt = resource_stmt.bindparams(bindparam("exclude_ids", expanding=True))

        resource_result = await self.session.execute(resource_stmt, params)
        for row in resource_result.fetchall():
            assignments.append(ExistingAssignment(
                staff_id=None,
                resource_id=uuid.UUID(str(row[1])),
                start_time=row[2],
                end_time=row[3]
            ))

        return assignments
