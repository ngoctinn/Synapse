"""
Booking Status Manager - Business Logic for Transitions
"""
import uuid
from datetime import datetime, timezone
from fastapi import HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession

from .models import Booking, BookingStatus

class BookingStatusManager:
    """Quản lý các logic chuyển đổi trạng thái của Booking."""

    def __init__(self, session: AsyncSession, treatment_service, billing_service):
        self.session = session
        self.treatment_service = treatment_service
        self.billing_service = billing_service

    async def confirm(self, booking: Booking) -> Booking:
        """Xác nhận booking: PENDING → CONFIRMED"""
        if booking.status != BookingStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Chỉ có thể xác nhận từ PENDING, hiện tại là {booking.status}"
            )

        booking.status = BookingStatus.CONFIRMED
        booking.updated_at = datetime.now(timezone.utc)

        self.session.add(booking)
        return booking

    async def check_in(self, booking: Booking, check_in_time: datetime | None = None) -> Booking:
        """Check-in: CONFIRMED → IN_PROGRESS"""
        if booking.status != BookingStatus.CONFIRMED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Chỉ có thể check-in từ CONFIRMED, hiện tại là {booking.status}"
            )

        booking.status = BookingStatus.IN_PROGRESS
        booking.check_in_time = check_in_time or datetime.now(timezone.utc)
        booking.actual_start_time = datetime.now(timezone.utc)
        booking.updated_at = datetime.now(timezone.utc)

        # 1. Trừ buổi liệu trình ngay khi Check-in (Tránh thất thoát)
        if booking.items:
            for item in booking.items:
                if item.treatment_id:
                    await self.treatment_service.punch_session(item.treatment_id)

        self.session.add(booking)
        return booking

    async def complete(self, booking: Booking, actual_end_time: datetime | None = None) -> Booking:
        """Hoàn thành: IN_PROGRESS → COMPLETED"""
        if booking.status != BookingStatus.IN_PROGRESS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Chỉ có thể hoàn thành từ IN_PROGRESS, hiện tại là {booking.status}"
            )

        # 1. Tạo hóa đơn (Billing integration)
        await self.billing_service.create_invoice_from_booking(booking.id)

        booking.status = BookingStatus.COMPLETED
        booking.actual_end_time = actual_end_time or datetime.now(timezone.utc)
        booking.updated_at = datetime.now(timezone.utc)

        self.session.add(booking)
        return booking

    async def cancel(self, booking: Booking, cancel_reason: str) -> Booking:
        """Hủy booking."""
        if booking.status in [BookingStatus.COMPLETED, BookingStatus.CANCELLED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Không thể hủy lịch hẹn ở trạng thái {booking.status}"
            )

        # 1. Hoàn lại buổi liệu trình nếu đã trừ (Đã Check-in hoặc Đã Complete)
        if booking.status in [BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED]:
             if booking.items:
                for item in booking.items:
                    if item.treatment_id:
                        await self.treatment_service.refund_session(item.treatment_id)

        booking.status = BookingStatus.CANCELLED
        booking.cancel_reason = cancel_reason
        booking.updated_at = datetime.now(timezone.utc)

        self.session.add(booking)
        return booking
