"""
Scheduling Module - Data Extractor

Trích xuất dữ liệu từ Database → SchedulingProblem instance.
"""

import uuid
from datetime import datetime, date, time, timezone
from sqlalchemy import text
from sqlmodel.ext.asyncio.session import AsyncSession

from .models import (
    SchedulingProblem,
    BookingItemData,
    StaffData,
    StaffScheduleData,
    ResourceData,
    ExistingAssignment,
)


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

        # 4. Lấy các lịch đã gán (để tránh conflict)
        existing_assignments = await self._get_existing_assignments(target_date)

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
        start_of_day = datetime.combine(target_date, time.min, tzinfo=timezone.utc)
        end_of_day = datetime.combine(target_date, time.max, tzinfo=timezone.utc)

        query = text("""
            SELECT
                bi.id,
                bi.booking_id,
                bi.service_id,
                s.name as service_name,
                bi.start_time,
                bi.end_time,
                EXTRACT(EPOCH FROM (bi.end_time - bi.start_time)) / 60 as duration_minutes
            FROM booking_items bi
            JOIN bookings b ON bi.booking_id = b.id
            LEFT JOIN services s ON bi.service_id = s.id
            WHERE bi.start_time >= :start_of_day
              AND bi.start_time < :end_of_day
              AND b.status NOT IN ('CANCELLED', 'NO_SHOW')
            ORDER BY bi.start_time
        """)

        result = await self.session.execute(query, {
            "start_of_day": start_of_day,
            "end_of_day": end_of_day
        })
        rows = result.fetchall()

        items = []
        for row in rows:
            item_id = uuid.UUID(str(row[0]))

            # Lọc theo item_ids nếu có
            if item_ids and item_id not in item_ids:
                continue

            # Lấy required skills cho service này
            required_skills = await self._get_service_required_skills(row[2])

            # Lấy required resource groups
            required_resources = await self._get_service_required_resources(row[2])

            items.append(BookingItemData(
                id=item_id,
                booking_id=uuid.UUID(str(row[1])),
                service_id=uuid.UUID(str(row[2])),
                service_name=row[3],
                start_time=row[4],
                end_time=row[5],
                duration_minutes=int(row[6]),
                required_skill_ids=required_skills,
                required_resource_group_ids=required_resources
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
    ) -> list[uuid.UUID]:
        """Lấy danh sách resource group IDs cần cho service."""
        query = text("""
            SELECT group_id FROM service_resource_requirements
            WHERE service_id = :service_id
        """)
        result = await self.session.execute(query, {"service_id": str(service_id)})
        return [uuid.UUID(str(row[0])) for row in result.fetchall()]

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
        if not staff_ids:
            return []

        staff_ids_str = ",".join(f"'{str(sid)}'" for sid in set(staff_ids))
        query = text(f"""
            SELECT
                st.user_id as id,
                u.full_name as name
            FROM staff st
            JOIN users u ON st.user_id = u.id
            WHERE st.user_id IN ({staff_ids_str})
        """)
        result = await self.session.execute(query)
        rows = result.fetchall()

        staff_list = []
        for row in rows:
            staff_id = uuid.UUID(str(row[0]))

            # Lấy skills của staff này
            skills = await self._get_staff_skills(staff_id)

            staff_list.append(StaffData(
                id=staff_id,
                name=row[1] or "Unknown",
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
        self, target_date: date
    ) -> list[ExistingAssignment]:
        """Lấy các lịch đã được gán (để tránh conflict)."""
        start_of_day = datetime.combine(target_date, time.min, tzinfo=timezone.utc)
        end_of_day = datetime.combine(target_date, time.max, tzinfo=timezone.utc)

        query = text("""
            SELECT
                bi.staff_id,
                bi.resource_id,
                bi.start_time,
                bi.end_time
            FROM booking_items bi
            JOIN bookings b ON bi.booking_id = b.id
            WHERE bi.start_time >= :start_of_day
              AND bi.start_time < :end_of_day
              AND (bi.staff_id IS NOT NULL OR bi.resource_id IS NOT NULL)
              AND b.status NOT IN ('CANCELLED', 'NO_SHOW', 'COMPLETED')
        """)
        result = await self.session.execute(query, {
            "start_of_day": start_of_day,
            "end_of_day": end_of_day
        })
        rows = result.fetchall()

        return [
            ExistingAssignment(
                staff_id=uuid.UUID(str(row[0])) if row[0] else None,
                resource_id=uuid.UUID(str(row[1])) if row[1] else None,
                start_time=row[2],
                end_time=row[3]
            )
            for row in rows
        ]
