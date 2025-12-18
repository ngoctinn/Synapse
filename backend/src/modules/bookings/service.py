"""
Bookings Module - Business Logic Service

🔥 ĐÂY LÀ SERVICE QUAN TRỌNG NHẤT CỦA HỆ THỐNG

Tuân thủ Backend Rules:
- Async All The Way
- Service as Dependency
- Guard Clauses / Early Return
- Conflict checking trước mọi thao tác gán
"""

import uuid
from datetime import datetime, date, timezone
from decimal import Decimal
from sqlalchemy.orm import selectinload
from sqlmodel import select, and_, func
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends, HTTPException, status

from src.common.database import get_db_session
from src.modules.services.models import Service
from .models import Booking, BookingItem, BookingStatus
from .schemas import (
    BookingCreate,
    BookingUpdate,
    BookingItemCreate,
    BookingItemUpdate,
)
from .conflict_checker import ConflictChecker


class BookingService:
    """Service xử lý logic nghiệp vụ cho Booking."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session
        self.conflict_checker = ConflictChecker(session)

    async def get_all(
        self,
        date_from: date | None = None,
        date_to: date | None = None,
        status_filter: BookingStatus | None = None,
        customer_id: uuid.UUID | None = None,
        limit: int = 50,
        offset: int = 0
    ) -> tuple[list[Booking], int]:
        """Lấy danh sách bookings với filter và pagination."""
        query = select(Booking).options(selectinload(Booking.items))
        count_query = select(func.count(Booking.id))

        conditions = []
        if date_from:
            conditions.append(Booking.start_time >= datetime.combine(date_from, datetime.min.time()))
        if date_to:
            conditions.append(Booking.start_time < datetime.combine(date_to, datetime.max.time()))
        if status_filter:
            conditions.append(Booking.status == status_filter)
        if customer_id:
            conditions.append(Booking.customer_id == customer_id)

        if conditions:
            query = query.where(and_(*conditions))
            count_query = count_query.where(and_(*conditions))

        # Get total count
        count_result = await self.session.exec(count_query)
        total = count_result.one()

        # Get paginated results
        query = query.order_by(Booking.start_time.desc()).offset(offset).limit(limit)
        result = await self.session.exec(query)

        return list(result.all()), total

    async def get_by_id(self, booking_id: uuid.UUID) -> Booking | None:
        """Lấy booking theo ID, bao gồm items."""
        query = select(Booking).where(Booking.id == booking_id).options(selectinload(Booking.items))
        result = await self.session.exec(query)
        return result.first()

    async def create(
        self,
        data: BookingCreate,
        created_by: uuid.UUID | None = None
    ) -> Booking:
        """
        Tạo booking mới với các items.

        Flow:
        1. Validate tất cả services tồn tại
        2. Tạo Booking với status PENDING
        3. Tạo các BookingItems
        4. Tính tổng giá và time range
        """
        # Collect all service IDs và validate
        service_ids = [item.service_id for item in data.items]
        services_map = await self._get_services_map(service_ids)

        for service_id in service_ids:
            if service_id not in services_map:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Dịch vụ {service_id} không tồn tại"
                )

        # Calculate time range from items
        start_time = min(item.start_time for item in data.items)
        end_time = max(item.end_time for item in data.items)

        # Create booking
        booking = Booking(
            customer_id=data.customer_id,
            created_by=created_by,
            start_time=start_time,
            end_time=end_time,
            status=BookingStatus.PENDING,
            notes=data.notes
        )
        self.session.add(booking)
        await self.session.flush()  # Get booking.id

        # Create booking items
        total_price = Decimal("0")
        for item_data in data.items:
            service = services_map[item_data.service_id]

            # Kiểm tra xung đột nếu có gán staff/resource
            if item_data.staff_id or item_data.resource_id:
                conflicts = await self.conflict_checker.check_all_conflicts(
                    staff_id=item_data.staff_id,
                    resource_id=item_data.resource_id,
                    start_time=item_data.start_time,
                    end_time=item_data.end_time
                )
                if conflicts:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=conflicts[0].message
                    )

            item = BookingItem(
                booking_id=booking.id,
                service_id=item_data.service_id,
                staff_id=item_data.staff_id,
                resource_id=item_data.resource_id,
                service_name_snapshot=service.name,
                start_time=item_data.start_time,
                end_time=item_data.end_time,
                original_price=Decimal(str(service.price))
            )
            self.session.add(item)
            total_price += item.original_price

        booking.total_price = total_price
        await self.session.commit()
        await self.session.refresh(booking)

        return booking

    async def update(
        self,
        booking_id: uuid.UUID,
        data: BookingUpdate
    ) -> Booking:
        """Cập nhật thông tin booking (không bao gồm items)."""
        booking = await self.get_by_id(booking_id)

        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy lịch hẹn"
            )

        # Chỉ cho phép update khi PENDING hoặc CONFIRMED
        if booking.status not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Không thể cập nhật lịch hẹn ở trạng thái {booking.status}"
            )

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(booking, key, value)

        booking.updated_at = datetime.now(timezone.utc)
        await self.session.commit()
        await self.session.refresh(booking)

        return booking

    async def add_item(
        self,
        booking_id: uuid.UUID,
        data: BookingItemCreate
    ) -> BookingItem:
        """Thêm dịch vụ vào booking."""
        booking = await self.get_by_id(booking_id)

        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy lịch hẹn"
            )

        if booking.status not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Không thể thêm dịch vụ ở trạng thái này"
            )

        # Get service
        service = await self.session.get(Service, data.service_id)
        if not service:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Dịch vụ không tồn tại"
            )

        # Check conflicts
        if data.staff_id or data.resource_id:
            conflicts = await self.conflict_checker.check_all_conflicts(
                staff_id=data.staff_id,
                resource_id=data.resource_id,
                start_time=data.start_time,
                end_time=data.end_time
            )
            if conflicts:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=conflicts[0].message
                )

        item = BookingItem(
            booking_id=booking_id,
            service_id=data.service_id,
            staff_id=data.staff_id,
            resource_id=data.resource_id,
            service_name_snapshot=service.name,
            start_time=data.start_time,
            end_time=data.end_time,
            original_price=Decimal(str(service.price))
        )
        self.session.add(item)

        # Recalculate booking
        booking.total_price += item.original_price
        if item.start_time < booking.start_time:
            booking.start_time = item.start_time
        if item.end_time > booking.end_time:
            booking.end_time = item.end_time
        booking.updated_at = datetime.now(timezone.utc)

        await self.session.commit()
        await self.session.refresh(item)

        return item

    async def update_item(
        self,
        booking_id: uuid.UUID,
        item_id: uuid.UUID,
        data: BookingItemUpdate
    ) -> BookingItem:
        """
        Cập nhật booking item (gán staff/resource).

        ⚡ ĐÂY LÀ THAO TÁC QUAN TRỌNG - CẦN KIỂM TRA XUNG ĐỘT
        """
        item = await self.session.get(BookingItem, item_id)

        if not item or item.booking_id != booking_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy dịch vụ trong lịch hẹn"
            )

        booking = await self.get_by_id(booking_id)
        if booking.status not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Không thể cập nhật ở trạng thái này"
            )

        update_data = data.model_dump(exclude_unset=True)

        # Determine new values
        new_staff_id = update_data.get("staff_id", item.staff_id)
        new_resource_id = update_data.get("resource_id", item.resource_id)
        new_start = update_data.get("start_time", item.start_time)
        new_end = update_data.get("end_time", item.end_time)

        # Check conflicts (exclude current item)
        conflicts = await self.conflict_checker.check_all_conflicts(
            staff_id=new_staff_id,
            resource_id=new_resource_id,
            start_time=new_start,
            end_time=new_end,
            exclude_item_id=item_id
        )
        if conflicts:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=conflicts[0].message
            )

        for key, value in update_data.items():
            setattr(item, key, value)

        await self.session.commit()
        await self.session.refresh(item)

        return item

    async def delete_item(
        self,
        booking_id: uuid.UUID,
        item_id: uuid.UUID
    ) -> bool:
        """Xóa dịch vụ khỏi booking."""
        item = await self.session.get(BookingItem, item_id)

        if not item or item.booking_id != booking_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy dịch vụ trong lịch hẹn"
            )

        booking = await self.get_by_id(booking_id)
        if booking.status not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Không thể xóa ở trạng thái này"
            )

        # Update booking total
        booking.total_price -= item.original_price
        booking.updated_at = datetime.now(timezone.utc)

        await self.session.delete(item)
        await self.session.commit()

        return True

    # =========================================================================
    # STATUS TRANSITIONS
    # =========================================================================

    async def confirm(self, booking_id: uuid.UUID) -> Booking:
        """Xác nhận booking: PENDING → CONFIRMED"""
        booking = await self.get_by_id(booking_id)

        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy lịch hẹn"
            )

        if booking.status != BookingStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Chỉ có thể xác nhận từ PENDING, hiện tại là {booking.status}"
            )

        booking.status = BookingStatus.CONFIRMED
        booking.updated_at = datetime.now(timezone.utc)

        await self.session.commit()
        await self.session.refresh(booking)

        return booking

    async def check_in(
        self,
        booking_id: uuid.UUID,
        check_in_time: datetime | None = None
    ) -> Booking:
        """Check-in: CONFIRMED → IN_PROGRESS"""
        booking = await self.get_by_id(booking_id)

        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy lịch hẹn"
            )

        if booking.status != BookingStatus.CONFIRMED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Chỉ có thể check-in từ CONFIRMED, hiện tại là {booking.status}"
            )

        booking.status = BookingStatus.IN_PROGRESS
        booking.check_in_time = check_in_time or datetime.now(timezone.utc)
        booking.actual_start_time = datetime.now(timezone.utc)
        booking.updated_at = datetime.now(timezone.utc)

        await self.session.commit()
        await self.session.refresh(booking)

        return booking

    async def complete(
        self,
        booking_id: uuid.UUID,
        actual_end_time: datetime | None = None
    ) -> Booking:
        """Hoàn thành: IN_PROGRESS → COMPLETED"""
        booking = await self.get_by_id(booking_id)

        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy lịch hẹn"
            )

        if booking.status != BookingStatus.IN_PROGRESS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Chỉ có thể hoàn thành từ IN_PROGRESS, hiện tại là {booking.status}"
            )

        booking.status = BookingStatus.COMPLETED
        booking.actual_end_time = actual_end_time or datetime.now(timezone.utc)
        booking.updated_at = datetime.now(timezone.utc)

        await self.session.commit()
        await self.session.refresh(booking)

        return booking

    async def cancel(
        self,
        booking_id: uuid.UUID,
        cancel_reason: str
    ) -> Booking:
        """Hủy booking."""
        booking = await self.get_by_id(booking_id)

        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy lịch hẹn"
            )

        if booking.status in [BookingStatus.COMPLETED, BookingStatus.CANCELLED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Không thể hủy lịch hẹn ở trạng thái {booking.status}"
            )

        booking.status = BookingStatus.CANCELLED
        booking.cancel_reason = cancel_reason
        booking.updated_at = datetime.now(timezone.utc)

        await self.session.commit()
        await self.session.refresh(booking)

        return booking

    async def no_show(self, booking_id: uuid.UUID) -> Booking:
        """Đánh dấu khách không đến."""
        booking = await self.get_by_id(booking_id)

        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy lịch hẹn"
            )

        if booking.status != BookingStatus.CONFIRMED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Chỉ có thể đánh dấu NO_SHOW từ CONFIRMED"
            )

        booking.status = BookingStatus.NO_SHOW
        booking.updated_at = datetime.now(timezone.utc)

        await self.session.commit()
        await self.session.refresh(booking)

        return booking

    # =========================================================================
    # HELPERS
    # =========================================================================

    async def _get_services_map(
        self, service_ids: list[uuid.UUID]
    ) -> dict[uuid.UUID, Service]:
        """Lấy map service_id -> Service."""
        query = select(Service).where(Service.id.in_(service_ids))
        result = await self.session.exec(query)
        services = result.all()
        return {s.id: s for s in services}
