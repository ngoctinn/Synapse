"""
Schedules Module - Business Logic Service

Tuân thủ Backend Rules:
- Async All The Way
- Service as Dependency
- Guard Clauses / Early Return
"""

import uuid
from datetime import date
from sqlmodel import select, and_
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends, HTTPException, status

from src.common.database import get_db_session
from .models import Shift, StaffSchedule, ScheduleStatus
from .schemas import (
    ShiftCreate,
    ShiftUpdate,
    StaffScheduleCreate,
    StaffScheduleBulkCreate,
    StaffScheduleUpdate,
    StaffAvailability,
    TimeSlot,
)


class ShiftService:
    """Service xử lý logic nghiệp vụ cho Shift."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_all(self) -> list[Shift]:
        """Lấy tất cả ca làm việc."""
        query = select(Shift).order_by(Shift.start_time)
        result = await self.session.exec(query)
        return list(result.all())

    async def get_by_id(self, shift_id: uuid.UUID) -> Shift | None:
        """Lấy ca làm việc theo ID."""
        return await self.session.get(Shift, shift_id)

    async def create(self, data: ShiftCreate) -> Shift:
        """Tạo ca làm việc mới."""
        # Validate: end_time > start_time
        if data.end_time <= data.start_time:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Giờ kết thúc phải sau giờ bắt đầu"
            )

        shift = Shift.model_validate(data)
        self.session.add(shift)
        await self.session.commit()
        await self.session.refresh(shift)
        return shift

    async def update(self, shift_id: uuid.UUID, data: ShiftUpdate) -> Shift:
        """Cập nhật ca làm việc."""
        shift = await self.get_by_id(shift_id)

        if not shift:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy ca làm việc"
            )

        update_data = data.model_dump(exclude_unset=True)

        # Validate time nếu cập nhật
        new_start = update_data.get("start_time", shift.start_time)
        new_end = update_data.get("end_time", shift.end_time)
        if new_end <= new_start:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Giờ kết thúc phải sau giờ bắt đầu"
            )

        for key, value in update_data.items():
            setattr(shift, key, value)

        await self.session.commit()
        await self.session.refresh(shift)
        return shift

    async def delete(self, shift_id: uuid.UUID) -> bool:
        """Xóa ca làm việc."""
        shift = await self.get_by_id(shift_id)

        if not shift:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy ca làm việc"
            )

        await self.session.delete(shift)
        await self.session.commit()
        return True


class StaffScheduleService:
    """Service xử lý logic nghiệp vụ cho StaffSchedule."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_all(
        self,
        staff_id: uuid.UUID | None = None,
        date_from: date | None = None,
        date_to: date | None = None,
        status_filter: ScheduleStatus | None = None
    ) -> list[StaffSchedule]:
        """Lấy danh sách lịch làm việc với filter."""
        query = select(StaffSchedule)

        conditions = []
        if staff_id:
            conditions.append(StaffSchedule.staff_id == staff_id)
        if date_from:
            conditions.append(StaffSchedule.work_date >= date_from)
        if date_to:
            conditions.append(StaffSchedule.work_date <= date_to)
        if status_filter:
            conditions.append(StaffSchedule.status == status_filter)

        if conditions:
            query = query.where(and_(*conditions))

        query = query.order_by(StaffSchedule.work_date, StaffSchedule.shift_id)
        result = await self.session.exec(query)
        return list(result.all())

    async def get_by_id(self, schedule_id: uuid.UUID) -> StaffSchedule | None:
        """Lấy lịch làm việc theo ID."""
        return await self.session.get(StaffSchedule, schedule_id)

    async def create(self, data: StaffScheduleCreate) -> StaffSchedule:
        """Tạo lịch làm việc mới."""
        # Check duplicate
        existing = await self._check_duplicate(
            data.staff_id, data.work_date, data.shift_id
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="KTV đã được phân công ca này trong ngày"
            )

        schedule = StaffSchedule.model_validate(data)
        self.session.add(schedule)
        await self.session.commit()
        await self.session.refresh(schedule)
        return schedule

    async def bulk_create(
        self, data: StaffScheduleBulkCreate
    ) -> list[StaffSchedule]:
        """Tạo nhiều lịch làm việc cùng lúc."""
        created = []

        for staff_id in data.staff_ids:
            for work_date in data.work_dates:
                # Skip nếu đã tồn tại
                existing = await self._check_duplicate(
                    staff_id, work_date, data.shift_id
                )
                if existing:
                    continue

                schedule = StaffSchedule(
                    staff_id=staff_id,
                    shift_id=data.shift_id,
                    work_date=work_date,
                    status=data.status
                )
                self.session.add(schedule)
                created.append(schedule)

        await self.session.commit()

        # Refresh để lấy ID
        for schedule in created:
            await self.session.refresh(schedule)

        return created

    async def update(
        self, schedule_id: uuid.UUID, data: StaffScheduleUpdate
    ) -> StaffSchedule:
        """Cập nhật lịch làm việc."""
        schedule = await self.get_by_id(schedule_id)

        if not schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy lịch làm việc"
            )

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(schedule, key, value)

        await self.session.commit()
        await self.session.refresh(schedule)
        return schedule

    async def delete(self, schedule_id: uuid.UUID) -> bool:
        """Xóa lịch làm việc."""
        schedule = await self.get_by_id(schedule_id)

        if not schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy lịch làm việc"
            )

        await self.session.delete(schedule)
        await self.session.commit()
        return True

    async def publish(self, schedule_id: uuid.UUID) -> StaffSchedule:
        """Công bố lịch làm việc (DRAFT → PUBLISHED)."""
        schedule = await self.get_by_id(schedule_id)

        if not schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy lịch làm việc"
            )

        schedule.status = ScheduleStatus.PUBLISHED
        await self.session.commit()
        await self.session.refresh(schedule)
        return schedule

    async def get_staff_availability(
        self, staff_id: uuid.UUID, work_date: date
    ) -> StaffAvailability:
        """
        Lấy khung giờ làm việc của KTV trong ngày.

        Đây là API core cho Solver - trả lời câu hỏi:
        "KTV này làm việc lúc nào trong ngày X?"
        """
        query = (
            select(StaffSchedule)
            .where(
                and_(
                    StaffSchedule.staff_id == staff_id,
                    StaffSchedule.work_date == work_date,
                    StaffSchedule.status == ScheduleStatus.PUBLISHED
                )
            )
        )
        result = await self.session.exec(query)
        schedules = result.all()

        time_slots: list[TimeSlot] = []
        total_hours = 0.0

        for schedule in schedules:
            # Eager load shift nếu chưa có
            if schedule.shift:
                slot = TimeSlot(
                    start_time=schedule.shift.start_time,
                    end_time=schedule.shift.end_time,
                    shift_name=schedule.shift.name,
                    shift_id=schedule.shift.id
                )
                time_slots.append(slot)
                total_hours += schedule.shift.duration_hours

        return StaffAvailability(
            staff_id=staff_id,
            work_date=work_date,
            time_slots=time_slots,
            total_hours=total_hours
        )

    async def get_schedules_by_date(self, work_date: date) -> list[StaffSchedule]:
        """Lấy tất cả lịch làm việc trong ngày."""
        query = (
            select(StaffSchedule)
            .where(StaffSchedule.work_date == work_date)
            .order_by(StaffSchedule.shift_id)
        )
        result = await self.session.exec(query)
        return list(result.all())

    async def _check_duplicate(
        self, staff_id: uuid.UUID, work_date: date, shift_id: uuid.UUID
    ) -> StaffSchedule | None:
        """Kiểm tra trùng lịch."""
        query = select(StaffSchedule).where(
            and_(
                StaffSchedule.staff_id == staff_id,
                StaffSchedule.work_date == work_date,
                StaffSchedule.shift_id == shift_id
            )
        )
        result = await self.session.exec(query)
        return result.first()
