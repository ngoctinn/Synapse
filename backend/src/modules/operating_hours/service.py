"""
Operating Hours Module - Business Logic Service

Service Layer xử lý logic nghiệp vụ cho giờ hoạt động và ngày ngoại lệ.
"""

import uuid
from datetime import date, time
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends

from src.common.database import get_db_session
from .models import RegularOperatingHours, ExceptionDate
from .schemas import (
    DayOperatingHours,
    OperatingHourPeriod,
    WeekOperatingHoursRead,
    WeekOperatingHoursUpdate,
    ExceptionDateCreate,
    ExceptionDateUpdate,
    ExceptionDateRead,
    ExceptionDateListResponse,
)
from .exceptions import (
    ExceptionDateNotFound,
    DuplicateExceptionDate,
    InvalidOperatingHours,
)


DAY_NAMES = {
    1: "Thứ Hai",
    2: "Thứ Ba",
    3: "Thứ Tư",
    4: "Thứ Năm",
    5: "Thứ Sáu",
    6: "Thứ Bảy",
    7: "Chủ Nhật",
}


class OperatingHoursService:
    """Service quản lý giờ hoạt động thường xuyên."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_week_hours(self) -> WeekOperatingHoursRead:
        """Lấy giờ hoạt động toàn bộ tuần."""
        statement = select(RegularOperatingHours).order_by(
            RegularOperatingHours.day_of_week,
            RegularOperatingHours.period_number
        )
        result = await self.session.exec(statement)
        records = result.all()

        # Nhóm theo day_of_week
        days_map: dict[int, list[RegularOperatingHours]] = {}
        for record in records:
            if record.day_of_week not in days_map:
                days_map[record.day_of_week] = []
            days_map[record.day_of_week].append(record)

        # Tạo response cho 7 ngày
        days = []
        for day_num in range(1, 8):
            periods = []
            is_closed = True

            if day_num in days_map:
                for record in days_map[day_num]:
                    periods.append(OperatingHourPeriod(
                        period_number=record.period_number,
                        open_time=record.open_time,
                        close_time=record.close_time,
                        is_closed=record.is_closed
                    ))
                    if not record.is_closed:
                        is_closed = False

            days.append(DayOperatingHours(
                day_of_week=day_num,
                day_name=DAY_NAMES[day_num],
                periods=periods,
                is_closed=is_closed
            ))

        return WeekOperatingHoursRead(days=days)

    async def get_day_hours(self, day_of_week: int) -> DayOperatingHours:
        """Lấy giờ hoạt động của một ngày cụ thể."""
        statement = select(RegularOperatingHours).where(
            RegularOperatingHours.day_of_week == day_of_week
        ).order_by(RegularOperatingHours.period_number)

        result = await self.session.exec(statement)
        records = result.all()

        periods = []
        is_closed = True

        for record in records:
            periods.append(OperatingHourPeriod(
                period_number=record.period_number,
                open_time=record.open_time,
                close_time=record.close_time,
                is_closed=record.is_closed
            ))
            if not record.is_closed:
                is_closed = False

        return DayOperatingHours(
            day_of_week=day_of_week,
            day_name=DAY_NAMES[day_of_week],
            periods=periods,
            is_closed=is_closed if periods else True
        )

    async def update_week_hours(self, data: WeekOperatingHoursUpdate) -> WeekOperatingHoursRead:
        """Cập nhật giờ hoạt động toàn bộ tuần (replace all)."""
        # Xóa tất cả records cũ
        statement = select(RegularOperatingHours)
        result = await self.session.exec(statement)
        old_records = result.all()
        for record in old_records:
            await self.session.delete(record)

        # Tạo records mới
        for day_data in data.days:
            # Nếu ngày đóng cửa, tạo 1 record đánh dấu is_closed
            if day_data.is_closed or not day_data.periods:
                new_record = RegularOperatingHours(
                    day_of_week=day_data.day_of_week,
                    period_number=1,
                    open_time=time(0, 0),
                    close_time=time(0, 0),
                    is_closed=True
                )
                self.session.add(new_record)
            else:
                # Tạo các periods
                for period in day_data.periods:
                    # Validate giờ
                    if period.open_time >= period.close_time:
                        raise InvalidOperatingHours(
                            f"Ngày {DAY_NAMES[day_data.day_of_week]}: Giờ mở cửa phải trước giờ đóng cửa"
                        )

                    new_record = RegularOperatingHours(
                        day_of_week=day_data.day_of_week,
                        period_number=period.period_number,
                        open_time=period.open_time,
                        close_time=period.close_time,
                        is_closed=period.is_closed
                    )
                    self.session.add(new_record)

        await self.session.commit()
        return await self.get_week_hours()

    async def get_hours_for_date(self, target_date: date) -> DayOperatingHours | None:
        """
        Lấy giờ hoạt động cho một ngày cụ thể.

        Logic:
        1. Kiểm tra exception_dates trước
        2. Nếu không có exception, lấy regular_operating_hours
        """
        # Kiểm tra exception
        statement = select(ExceptionDate).where(
            ExceptionDate.exception_date == target_date
        )
        result = await self.session.exec(statement)
        exception = result.first()

        if exception:
            if exception.is_closed:
                return DayOperatingHours(
                    day_of_week=target_date.isoweekday(),
                    day_name=DAY_NAMES.get(target_date.isoweekday(), ""),
                    periods=[],
                    is_closed=True
                )
            else:
                return DayOperatingHours(
                    day_of_week=target_date.isoweekday(),
                    day_name=DAY_NAMES.get(target_date.isoweekday(), ""),
                    periods=[OperatingHourPeriod(
                        period_number=1,
                        open_time=exception.open_time or time(8, 0),
                        close_time=exception.close_time or time(20, 0),
                        is_closed=False
                    )],
                    is_closed=False
                )

        # Lấy từ regular hours
        day_of_week = target_date.isoweekday()
        return await self.get_day_hours(day_of_week)


class ExceptionDateService:
    """Service quản lý ngày nghỉ lễ và ngày đặc biệt."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_all(self, year: int | None = None) -> ExceptionDateListResponse:
        """Lấy danh sách ngày ngoại lệ."""
        statement = select(ExceptionDate).order_by(ExceptionDate.exception_date)

        if year:
            from datetime import date as dt_date
            start_date = dt_date(year, 1, 1)
            end_date = dt_date(year, 12, 31)
            statement = statement.where(
                ExceptionDate.exception_date >= start_date,
                ExceptionDate.exception_date <= end_date
            )

        result = await self.session.exec(statement)
        records = result.all()

        return ExceptionDateListResponse(
            items=[ExceptionDateRead.model_validate(r) for r in records],
            total=len(records)
        )

    async def get_by_id(self, exception_id: uuid.UUID) -> ExceptionDateRead:
        """Lấy chi tiết một ngày ngoại lệ."""
        statement = select(ExceptionDate).where(ExceptionDate.id == exception_id)
        result = await self.session.exec(statement)
        record = result.first()

        if not record:
            raise ExceptionDateNotFound(str(exception_id))

        return ExceptionDateRead.model_validate(record)

    async def create(self, data: ExceptionDateCreate) -> ExceptionDateRead:
        """Tạo ngày ngoại lệ mới."""
        # Kiểm tra trùng lặp
        statement = select(ExceptionDate).where(
            ExceptionDate.exception_date == data.exception_date
        )
        result = await self.session.exec(statement)
        existing = result.first()

        if existing:
            raise DuplicateExceptionDate(str(data.exception_date))

        # Validate giờ nếu không nghỉ cả ngày
        if not data.is_closed:
            if data.open_time and data.close_time:
                if data.open_time >= data.close_time:
                    raise InvalidOperatingHours()

        new_record = ExceptionDate(
            exception_date=data.exception_date,
            type=data.type,
            open_time=data.open_time,
            close_time=data.close_time,
            is_closed=data.is_closed,
            reason=data.reason
        )

        self.session.add(new_record)
        await self.session.commit()
        await self.session.refresh(new_record)

        return ExceptionDateRead.model_validate(new_record)

    async def update(self, exception_id: uuid.UUID, data: ExceptionDateUpdate) -> ExceptionDateRead:
        """Cập nhật ngày ngoại lệ."""
        statement = select(ExceptionDate).where(ExceptionDate.id == exception_id)
        result = await self.session.exec(statement)
        record = result.first()

        if not record:
            raise ExceptionDateNotFound(str(exception_id))

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(record, key, value)

        self.session.add(record)
        await self.session.commit()
        await self.session.refresh(record)

        return ExceptionDateRead.model_validate(record)

    async def delete(self, exception_id: uuid.UUID) -> None:
        """Xóa ngày ngoại lệ."""
        statement = select(ExceptionDate).where(ExceptionDate.id == exception_id)
        result = await self.session.exec(statement)
        record = result.first()

        if not record:
            raise ExceptionDateNotFound(str(exception_id))

        await self.session.delete(record)
        await self.session.commit()
