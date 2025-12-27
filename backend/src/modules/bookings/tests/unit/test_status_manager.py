"""
Unit Tests for BookingStatusManager
"""

import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException
from src.modules.bookings.status_manager import BookingStatusManager
from src.modules.bookings.models import Booking, BookingStatus, BookingItem

@pytest.fixture
def mock_session():
    session = AsyncMock()
    session.add = MagicMock()
    return session

@pytest.fixture
def mock_treatment_service():
    return AsyncMock()

@pytest.fixture
def mock_billing_service():
    return AsyncMock()

@pytest.fixture
def status_manager(mock_session, mock_treatment_service, mock_billing_service):
    return BookingStatusManager(
        session=mock_session,
        treatment_service=mock_treatment_service,
        billing_service=mock_billing_service
    )

@pytest.mark.asyncio
async def test_confirm_success(status_manager, mock_session):
    """Test xác nhận lịch hẹn (PENDING -> CONFIRMED)."""
    booking = Booking(id=uuid.uuid4(), status=BookingStatus.PENDING)

    result = await status_manager.confirm(booking)

    assert result.status == BookingStatus.CONFIRMED
    mock_session.add.assert_called_once_with(booking)

@pytest.mark.asyncio
async def test_confirm_invalid_status(status_manager):
    """Test xác nhận thất bại nếu không phải PENDING."""
    booking = Booking(id=uuid.uuid4(), status=BookingStatus.CONFIRMED)

    with pytest.raises(HTTPException) as exc_info:
        await status_manager.confirm(booking)

    assert exc_info.value.status_code == 400

@pytest.mark.asyncio
async def test_check_in_with_treatment(status_manager, mock_treatment_service, mock_session):
    """Test check-in và trừ buổi liệu trình."""
    treatment_id = uuid.uuid4()
    item = BookingItem(id=uuid.uuid4(), treatment_id=treatment_id)
    booking = Booking(id=uuid.uuid4(), status=BookingStatus.CONFIRMED, items=[item])

    result = await status_manager.check_in(booking)

    assert result.status == BookingStatus.IN_PROGRESS
    assert result.check_in_time is not None
    # Kiểm tra service trừ liệu trình được gọi
    mock_treatment_service.punch_session.assert_called_once_with(treatment_id)
    mock_session.add.assert_called_once()

@pytest.mark.asyncio
async def test_complete_success(status_manager, mock_billing_service, mock_session):
    """Test hoàn thành và tạo hóa đơn."""
    booking = Booking(id=uuid.uuid4(), status=BookingStatus.IN_PROGRESS)

    result = await status_manager.complete(booking)

    assert result.status == BookingStatus.COMPLETED
    mock_billing_service.create_invoice_from_booking.assert_called_once_with(booking.id)

@pytest.mark.asyncio
async def test_cancel_already_in_progress(status_manager, mock_treatment_service):
    """Test hủy lịch khi đang thực hiện -> phải hoàn trả buổi liệu trình."""
    treatment_id = uuid.uuid4()
    item = BookingItem(id=uuid.uuid4(), treatment_id=treatment_id)
    booking = Booking(id=uuid.uuid4(), status=BookingStatus.IN_PROGRESS, items=[item])

    result = await status_manager.cancel(booking, cancel_reason="Khách bận đột xuất")

    assert result.status == BookingStatus.CANCELLED
    mock_treatment_service.refund_session.assert_called_once_with(treatment_id)
