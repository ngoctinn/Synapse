"""
Bookings Module - Business Logic Service
"""

import uuid
from datetime import datetime, date, timezone
from decimal import Decimal
from sqlalchemy.orm import selectinload
from sqlmodel import select, and_, func
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends, HTTPException, status

from src.common.database import get_db_session
from src.modules.services import Service
from .models import Booking, BookingItem, BookingStatus
from src.modules.customer_treatments import CustomerTreatmentService
from src.modules.billing import BillingService
from src.modules.customers import CustomerService
from .schemas import (
    BookingCreate,
    BookingUpdate,
    BookingItemCreate,
    BookingItemUpdate,
)
from .conflict_checker import ConflictChecker
from .status_manager import BookingStatusManager
from .item_manager import BookingItemManager


class BookingService:
    """Service xử lý logic nghiệp vụ cho Booking."""

    def __init__(
        self,
        session: AsyncSession = Depends(get_db_session),
        treatment_service: CustomerTreatmentService = Depends(CustomerTreatmentService),
        billing_service: BillingService = Depends(BillingService),
        customer_service: CustomerService = Depends(CustomerService)
    ):
        self.session = session
        self.conflict_checker = ConflictChecker(session)
        self.treatment_service = treatment_service
        self.billing_service = billing_service
        self.customer_service = customer_service
        self.status_manager = BookingStatusManager(session, treatment_service, billing_service)
        self.item_manager = BookingItemManager(session, self.conflict_checker, treatment_service)

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
        query = select(Booking).options(
            selectinload(Booking.items).selectinload(BookingItem.resources)
        )
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

        count_result = await self.session.exec(count_query)
        total = count_result.one()

        query = query.order_by(Booking.start_time.desc()).offset(offset).limit(limit)
        result = await self.session.exec(query)

        return list(result.all()), total

    async def get_by_id(self, booking_id: uuid.UUID) -> Booking | None:
        """Lấy booking theo ID, bao gồm items và resources."""
        query = (
            select(Booking)
            .where(Booking.id == booking_id)
            .options(
                selectinload(Booking.items).selectinload(BookingItem.resources)
            )
        )
        result = await self.session.exec(query)
        return result.first()

    async def create(self, data: BookingCreate, created_by: uuid.UUID | None = None) -> Booking:
        """Tạo lịch hẹn mới."""
        from src.modules.users.models import User
        from src.modules.users.constants import UserRole

        # Tự động xác định customer_id nếu người tạo là khách hàng
        customer_id = data.customer_id
        creator_role = UserRole.CUSTOMER # Default role

        if created_by:
            creator = await self.session.get(User, created_by)
            if creator:
                creator_role = creator.role

            if not customer_id and creator_role == UserRole.CUSTOMER:
                # creator_role = creator.role # Retain for traceability if needed, but not used for status

                if not customer_id and creator.role == UserRole.CUSTOMER:
                    customer = await self.customer_service.get_by_user_id(created_by)
                    if customer:
                        customer_id = customer.id

        if not customer_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Thiếu thông tin khách hàng (customer_id)"
            )

        # Trạng thái ban đầu mặc định là CONFIRMED (Auto-confirm)
        # Hệ thống đã qua bước ConflictChecker trong add_item nên chốt luôn.
        initial_status = BookingStatus.CONFIRMED

        # Calculate time range from items
        start_time = min(item.start_time for item in data.items)
        end_time = max(item.end_time for item in data.items)

        booking = Booking(
            customer_id=customer_id,
            created_by=created_by,
            start_time=start_time,
            end_time=end_time,
            notes=data.notes,
            status=initial_status,
            total_price=Decimal("0")
        )
        self.session.add(booking)
        await self.session.flush()

        for item_data in data.items:
            await self.item_manager.add_item(booking, item_data)

        await self.session.commit()
        await self.session.refresh(booking)
        return await self.get_by_id(booking.id)

    async def update(self, booking_id: uuid.UUID, data: BookingUpdate) -> Booking:
        """Cập nhật thông tin cơ bản của booking."""
        booking = await self.get_by_id(booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Không tìm thấy lịch hẹn")

        if booking.status in [BookingStatus.COMPLETED, BookingStatus.CANCELLED]:
            raise HTTPException(status_code=400, detail="Không thể cập nhật lịch hẹn đã hoàn thành/hủy")

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(booking, key, value)

        booking.updated_at = datetime.now(timezone.utc)
        await self.session.commit()
        await self.session.refresh(booking)
        return booking

    async def add_item(self, booking_id: uuid.UUID, data: BookingItemCreate) -> BookingItem:
        booking = await self.get_by_id(booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Không tìm thấy lịch hẹn")

        item = await self.item_manager.add_item(booking, data)
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def update_item(self, booking_id: uuid.UUID, item_id: uuid.UUID, data: BookingItemUpdate) -> BookingItem:
        booking = await self.get_by_id(booking_id)
        item = await self.session.get(BookingItem, item_id)
        if not booking or not item or item.booking_id != booking_id:
            raise HTTPException(status_code=404, detail="Không tìm thấy")

        await self.item_manager.update_item(booking, item, data)
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def delete_item(self, booking_id: uuid.UUID, item_id: uuid.UUID) -> bool:
        booking = await self.get_by_id(booking_id)
        item = await self.session.get(BookingItem, item_id)
        if not booking or not item or item.booking_id != booking_id:
            raise HTTPException(status_code=404, detail="Không tìm thấy")

        await self.item_manager.delete_item(booking, item)
        await self.session.commit()
        return True

    # --- Status Transitions Delegate to StatusManager ---
    async def confirm(self, booking_id: uuid.UUID) -> Booking:
        booking = await self.get_by_id(booking_id)
        if not booking: raise HTTPException(status_code=404)
        await self.status_manager.confirm(booking)
        await self.session.commit()
        return booking

    async def check_in(self, booking_id: uuid.UUID, check_in_time: datetime | None = None) -> Booking:
        booking = await self.get_by_id(booking_id)
        if not booking: raise HTTPException(status_code=404)
        await self.status_manager.check_in(booking, check_in_time)
        await self.session.commit()
        return booking

    async def complete(self, booking_id: uuid.UUID, actual_end_time: datetime | None = None) -> Booking:
        booking = await self.get_by_id(booking_id)
        if not booking: raise HTTPException(status_code=404)
        await self.status_manager.complete(booking, actual_end_time)
        await self.session.commit()
        return booking

    async def cancel(self, booking_id: uuid.UUID, cancel_reason: str) -> Booking:
        booking = await self.get_by_id(booking_id)
        if not booking: raise HTTPException(status_code=404)
        await self.status_manager.cancel(booking, cancel_reason)
        await self.session.commit()
        return booking

    async def no_show(self, booking_id: uuid.UUID) -> Booking:
        booking = await self.get_by_id(booking_id)
        if not booking: raise HTTPException(status_code=404, detail="Không tìm thấy")
        if booking.status != BookingStatus.CONFIRMED:
            raise HTTPException(status_code=400, detail="Chỉ có thể đánh dấu NO_SHOW từ CONFIRMED")
        booking.status = BookingStatus.NO_SHOW
        booking.updated_at = datetime.now(timezone.utc)
        await self.session.commit()
        return booking

    # --- Helpers & Notes ---
    async def add_note(self, booking_id: uuid.UUID, staff_id: uuid.UUID, content: str, note_type: str = "PROFESSIONAL"):
        from .models import TreatmentNote, NoteType
        from src.modules.users import User
        from .schemas import TreatmentNoteRead

        booking = await self.get_by_id(booking_id)
        if not booking: raise HTTPException(status_code=404)

        note = TreatmentNote(booking_id=booking_id, staff_id=staff_id, content=content, note_type=NoteType[note_type])
        self.session.add(note)
        await self.session.commit()
        await self.session.refresh(note, ["staff"])

        return TreatmentNoteRead(
            id=note.id, booking_id=note.booking_id, staff_id=note.staff_id,
            content=note.content, note_type=note.note_type.value,
            created_at=note.created_at, staff_name=note.staff.full_name if note.staff else None
        )

    async def get_notes(self, booking_id: uuid.UUID):
        from .models import TreatmentNote
        from src.modules.users import User
        from .schemas import TreatmentNoteRead

        query = (
            select(TreatmentNote)
            .where(TreatmentNote.booking_id == booking_id)
            .options(selectinload(TreatmentNote.staff))
            .order_by(TreatmentNote.created_at.desc())
        )
        result = await self.session.exec(query)
        notes = result.all()

        return [
            TreatmentNoteRead(
                id=note.id, booking_id=note.booking_id, staff_id=note.staff_id,
                content=note.content, note_type=note.note_type.value,
                created_at=note.created_at, staff_name=note.staff.full_name if note.staff else None
            )
            for note in notes
        ]
