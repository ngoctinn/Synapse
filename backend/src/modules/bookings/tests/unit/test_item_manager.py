"""
Unit Tests for BookingItemManager
"""

import pytest
import uuid
from datetime import datetime, timezone, timedelta
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException
from src.modules.bookings.item_manager import BookingItemManager
from src.modules.bookings.models import Booking, BookingStatus, BookingItem
from src.modules.services.models import Service
from src.modules.bookings.schemas import BookingItemCreate

@pytest.fixture
def mock_session():
    session = AsyncMock()
    session.add = MagicMock()
    session.flush = AsyncMock()
    return session

@pytest.fixture
def mock_conflict_checker():
    return AsyncMock()

@pytest.fixture
def mock_treatment_service():
    return AsyncMock()

@pytest.fixture
def item_manager(mock_session, mock_conflict_checker, mock_treatment_service):
    return BookingItemManager(
        session=mock_session,
        conflict_checker=mock_conflict_checker,
        treatment_service=mock_treatment_service
    )

@pytest.mark.asyncio
async def test_add_item_success(item_manager, mock_session, mock_conflict_checker):
    """Test thêm dịch vụ vào booking thành công."""
    # 1. Setup
    booking = Booking(
        id=uuid.uuid4(),
        status=BookingStatus.PENDING,
        customer_id=uuid.uuid4(),
        start_time=datetime.now(timezone.utc),
        end_time=datetime.now(timezone.utc) + timedelta(hours=1),
        total_price=0
    )

    data = BookingItemCreate(
        service_id=uuid.uuid4(),
        start_time=datetime.now(timezone.utc),
        end_time=datetime.now(timezone.utc) + timedelta(minutes=60),
        staff_id=uuid.uuid4(),
        resource_ids=[]
    )

    # Mock Service info
    mock_service = Service(id=data.service_id, name="Massage", price=50.0)
    mock_session.get.return_value = mock_service

    # Mock Conflict Checker (no conflicts)
    mock_conflict_checker.check_all_conflicts.return_value = []

    # 2. Execute
    item = await item_manager.add_item(booking, data)

    # 3. Verify
    assert item.service_name_snapshot == "Massage"
    assert booking.total_price == 50.0
    mock_session.add.assert_called()
    mock_conflict_checker.check_all_conflicts.assert_called_once()

@pytest.mark.asyncio
async def test_add_item_status_forbidden(item_manager):
    """Test thêm item thất bại nếu trạng thái booking đã bắt đầu/xong."""
    booking = Booking(id=uuid.uuid4(), status=BookingStatus.IN_PROGRESS)
    now = datetime.now(timezone.utc)
    data = BookingItemCreate(
        service_id=uuid.uuid4(),
        start_time=now,
        end_time=now + timedelta(minutes=30)
    )

    with pytest.raises(HTTPException) as exc_info:
        await item_manager.add_item(booking, data)

    assert exc_info.value.status_code == 400
    assert "PENDING hoặc CONFIRMED" in exc_info.value.detail

@pytest.mark.asyncio
async def test_add_item_conflict(item_manager, mock_session, mock_conflict_checker):
    """Test thêm item thất bại do xung đột lịch."""
    booking = Booking(id=uuid.uuid4(), status=BookingStatus.PENDING)
    from src.modules.bookings.schemas import BookingItemCreate
    now = datetime.now(timezone.utc)
    data = BookingItemCreate(
        service_id=uuid.uuid4(),
        start_time=now,
        end_time=now + timedelta(minutes=30),
        staff_id=uuid.uuid4()
    )

    mock_session.get.return_value = Service(id=data.service_id, name="Test", price=10)
    # Giả lập có xung đột
    conflict_mock = MagicMock()
    conflict_mock.message = "Nhân viên đã bận"
    mock_conflict_checker.check_all_conflicts.return_value = [conflict_mock]

    with pytest.raises(HTTPException) as exc_info:
        await item_manager.add_item(booking, data)

    assert exc_info.value.status_code == 409
    assert "Nhân viên đã bận" in exc_info.value.detail
