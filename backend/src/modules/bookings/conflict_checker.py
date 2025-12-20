"""
Conflict Checker - CORE LOGIC của hệ thống đặt lịch

⚡ ĐÂY LÀ LOGIC QUAN TRỌNG NHẤT:
- Kiểm tra KTV có bị trùng lịch không
- Kiểm tra Phòng/Máy có bị trùng không
- Kiểm tra KTV có đang làm việc trong ca không

Nguyên tắc: 2 khoảng thời gian CHỒNG CHÉO nếu:
    new_start < existing_end AND new_end > existing_start
"""

import uuid
from datetime import datetime, date
from sqlalchemy import text, and_, bindparam
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel

from .models import BookingItem, Booking, BookingStatus


class ConflictResult(BaseModel):
    """Kết quả kiểm tra xung đột."""
    has_conflict: bool
    conflict_type: str | None = None  # 'STAFF', 'RESOURCE', 'SCHEDULE'
    conflicting_booking_id: uuid.UUID | None = None
    message: str | None = None


class AvailabilitySlot(BaseModel):
    """Slot khả dụng."""
    start_time: datetime
    end_time: datetime
    is_available: bool
    resource_id: uuid.UUID | None = None
    resource_name: str | None = None


class ConflictChecker:
    """
    Service kiểm tra xung đột - Không dùng Depends vì cần inject session.
    """

    def __init__(self, session: AsyncSession):
        self.session = session
        # Các status được coi là "active" - có thể gây xung đột
        self.active_statuses = [
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.IN_PROGRESS
        ]

    async def check_staff_conflict(
        self,
        staff_id: uuid.UUID,
        start_time: datetime,
        end_time: datetime,
        exclude_item_id: uuid.UUID | None = None
    ) -> ConflictResult:
        """
        Kiểm tra KTV có bị trùng lịch không.

        Args:
            staff_id: ID của KTV
            start_time: Thời gian bắt đầu mới
            end_time: Thời gian kết thúc mới
            exclude_item_id: Bỏ qua item này (khi update)

        Returns:
            ConflictResult với thông tin xung đột
        """
        query = (
            select(BookingItem)
            .join(Booking, BookingItem.booking_id == Booking.id)
            .where(
                and_(
                    BookingItem.staff_id == staff_id,
                    Booking.status.in_(self.active_statuses),
                    BookingItem.start_time < end_time,
                    BookingItem.end_time > start_time
                )
            )
        )

        if exclude_item_id:
            query = query.where(BookingItem.id != exclude_item_id)

        result = await self.session.exec(query)
        conflicting_item = result.first()

        if conflicting_item:
            return ConflictResult(
                has_conflict=True,
                conflict_type="STAFF",
                conflicting_booking_id=conflicting_item.booking_id,
                message=f"KTV đã có lịch từ {conflicting_item.start_time.strftime('%H:%M')} đến {conflicting_item.end_time.strftime('%H:%M')}"
            )

        return ConflictResult(has_conflict=False)

    async def check_resource_conflict(
        self,
        resource_id: uuid.UUID,
        start_time: datetime,
        end_time: datetime,
        exclude_item_id: uuid.UUID | None = None
    ) -> ConflictResult:
        """
        Kiểm tra Tài nguyên (Giường/Máy) có bị trùng không.

        Updated: Uses BookingItemResource junction table.
        """
        sql = """
            SELECT bi.booking_id, bi.start_time, bi.end_time
            FROM booking_items bi
            JOIN bookings b ON bi.booking_id = b.id
            JOIN booking_item_resources bir ON bi.id = bir.booking_item_id
            WHERE bir.resource_id = :resource_id
              AND b.status IN :statuses
              AND bi.start_time < :end_time
              AND bi.end_time > :start_time
        """

        if exclude_item_id:
            sql += " AND bi.id != :exclude_id"

        # Base binds
        binds = [
            bindparam("statuses", expanding=True),
            bindparam("resource_id"),
            bindparam("start_time"),
            bindparam("end_time"),
        ]

        # Params dict
        params = {
            "resource_id": str(resource_id),
            "start_time": start_time,
            "end_time": end_time,
            "statuses": [status.value for status in self.active_statuses] # Convert enum to values for SQL IN clause
        }

        if exclude_item_id:
            binds.append(bindparam("exclude_id"))
            params["exclude_id"] = str(exclude_item_id)

        stmt = text(sql).bindparams(*binds)

        result = await self.session.execute(stmt, params)
        row = result.first() # (booking_id, start, end)

        if row:
            # row[1] is start, row[2] is end (from select)
            # Need to parse if text returns strings or objects. Usually returns active types if typed?
            # Safe to assume it returns something.

            # Format message
            try:
                s_str = row[1].strftime('%H:%M') if isinstance(row[1], datetime) else str(row[1])
                e_str = row[2].strftime('%H:%M') if isinstance(row[2], datetime) else str(row[2])
            except:
                s_str = "..."
                e_str = "..."

            return ConflictResult(
                has_conflict=True,
                conflict_type="RESOURCE",
                conflicting_booking_id=uuid.UUID(str(row[0])),
                message=f"Tài nguyên {resource_id} đã được sử dụng từ {s_str} đến {e_str}"
            )

        return ConflictResult(has_conflict=False)

    async def check_staff_schedule(
        self,
        staff_id: uuid.UUID,
        work_date: date,
        start_time: datetime,
        end_time: datetime
    ) -> ConflictResult:
        """
        Kiểm tra KTV có đang trong ca làm việc không.

        Sử dụng dữ liệu từ staff_schedules (Giai đoạn 2).
        """
        # Query để kiểm tra KTV có ca làm việc cover khoảng thời gian này không
        query = text("""
            SELECT EXISTS (
                SELECT 1 FROM staff_schedules ss
                JOIN shifts s ON ss.shift_id = s.id
                WHERE ss.staff_id = :staff_id
                  AND ss.work_date = :work_date
                  AND ss.status = 'PUBLISHED'
                  AND s.start_time <= :check_start_time
                  AND s.end_time >= :check_end_time
            ) as is_working
        """)

        result = await self.session.execute(
            query,
            {
                "staff_id": str(staff_id),
                "work_date": work_date,
                "check_start_time": start_time.time(),
                "check_end_time": end_time.time()
            }
        )
        row = result.fetchone()
        is_working = row[0] if row else False

        if not is_working:
            return ConflictResult(
                has_conflict=True,
                conflict_type="SCHEDULE",
                message="KTV không có ca làm việc trong khoảng thời gian này"
            )

        return ConflictResult(has_conflict=False)

    async def check_all_conflicts(
        self,
        staff_id: uuid.UUID | None,
        resource_ids: list[uuid.UUID] | None,
        start_time: datetime,
        end_time: datetime,
        exclude_item_id: uuid.UUID | None = None,
        check_schedule: bool = False
    ) -> list[ConflictResult]:
        """
        Kiểm tra tất cả các loại xung đột.

        Returns:
            Danh sách các ConflictResult (chỉ những cái có xung đột)
        """
        conflicts: list[ConflictResult] = []

        if staff_id:
            staff_conflict = await self.check_staff_conflict(
                staff_id, start_time, end_time, exclude_item_id
            )
            if staff_conflict.has_conflict:
                conflicts.append(staff_conflict)

            # Kiểm tra ca làm việc nếu cần
            if check_schedule:
                schedule_conflict = await self.check_staff_schedule(
                    staff_id, start_time.date(), start_time, end_time
                )
                if schedule_conflict.has_conflict:
                    conflicts.append(schedule_conflict)

        if resource_ids:
            for rid in resource_ids:
                resource_conflict = await self.check_resource_conflict(
                    rid, start_time, end_time, exclude_item_id
                )
                if resource_conflict.has_conflict:
                    conflicts.append(resource_conflict)
                    # Optional: Break on first conflict or collect all? Collecting all is better.

        return conflicts

    async def get_staff_bookings_on_date(
        self,
        staff_id: uuid.UUID,
        work_date: date
    ) -> list[BookingItem]:
        """Lấy tất cả booking items của KTV trong ngày."""
        start_of_day = datetime.combine(work_date, datetime.min.time())
        end_of_day = datetime.combine(work_date, datetime.max.time())

        query = (
            select(BookingItem)
            .join(Booking, BookingItem.booking_id == Booking.id)
            .where(
                and_(
                    BookingItem.staff_id == staff_id,
                    Booking.status.in_(self.active_statuses),
                    BookingItem.start_time >= start_of_day,
                    BookingItem.start_time < end_of_day
                )
            )
            .order_by(BookingItem.start_time)
        )

        result = await self.session.exec(query)
        return list(result.all())

    async def get_resource_bookings_on_date(
        self,
        resource_id: uuid.UUID,
        work_date: date
    ) -> list[BookingItem]:
        """Lấy tất cả booking items của Resource trong ngày."""
        start_of_day = datetime.combine(work_date, datetime.min.time())
        end_of_day = datetime.combine(work_date, datetime.max.time())

        query = (
            select(BookingItem)
            .join(Booking, BookingItem.booking_id == Booking.id)
            .where(
                and_(
                    BookingItem.resource_id == resource_id,
                    Booking.status.in_(self.active_statuses),
                    BookingItem.start_time >= start_of_day,
                    BookingItem.start_time < end_of_day
                )
            )
            .order_by(BookingItem.start_time)
        )

        result = await self.session.exec(query)
        return list(result.all())
