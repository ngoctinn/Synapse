"""
Integration Tests for Bookings Router
"""

import pytest
import uuid
from datetime import datetime, timezone, timedelta
from decimal import Decimal
from httpx import AsyncClient
from src.modules.bookings.models import BookingStatus
from src.modules.services.models import Service
from src.modules.users.models import User
from src.modules.users.constants import UserRole
from unittest.mock import MagicMock

@pytest.mark.asyncio
async def test_create_and_get_booking_flow(client: AsyncClient, mock_admin_auth, mock_session):
    """Test flow: Tạo booking -> Lấy chi tiết."""
    now = datetime.now(timezone.utc)
    service_id = uuid.uuid4()
    b_id = uuid.uuid4()

    # Mock Service & User
    mock_service = Service(id=service_id, name="Test Service", price=Decimal("100000"))
    def mock_get(model, id):
        if model == Service: return mock_service
        if model == User: return MagicMock(role=UserRole.MANAGER)
        return None
    mock_session.get.side_effect = mock_get

    from src.modules.bookings.models import Booking
    mock_booking = Booking(
        id=b_id,
        customer_id=uuid.uuid4(),
        status=BookingStatus.PENDING,
        start_time=now,
        end_time=now + timedelta(minutes=60),
        total_price=Decimal("100000"),
        created_at=now,
        updated_at=now,
        notes="Test note",
        created_by=uuid.uuid4()
    )

    # 2 calls to exec().first(): 1. create(), 2. GET detail
    mock_result = MagicMock()
    mock_result.first.side_effect = [mock_booking, mock_booking]
    mock_session.exec.return_value = mock_result

    # 1. Tạo Booking
    data = {
        "customer_id": str(uuid.uuid4()),
        "items": [{
            "service_id": str(service_id),
            "start_time": now.isoformat(),
            "end_time": (now + timedelta(minutes=60)).isoformat()
        }]
    }
    response = await client.post("/api/v1/bookings", json=data)
    assert response.status_code == 201

    # 2. Lấy chi tiết
    response = await client.get(f"/api/v1/bookings/{b_id}")
    assert response.status_code == 200
    assert response.json()["id"] == str(b_id)

@pytest.mark.asyncio
async def test_add_item_to_booking(client: AsyncClient, mock_admin_auth, mock_session):
    """Test thêm dịch vụ vào booking hiện có."""
    now = datetime.now(timezone.utc)
    b_id = uuid.uuid4()
    s_id = uuid.uuid4()

    # Mock Service & User
    mock_service = Service(id=s_id, name="Massage", price=Decimal("300000"))
    def mock_get(model, id):
        if model == Service: return mock_service
        if model == User: return MagicMock(role=UserRole.MANAGER)
        return None
    mock_session.get.side_effect = mock_get

    from src.modules.bookings.models import Booking
    mock_booking = Booking(
        id=b_id,
        customer_id=uuid.uuid4(),
        status=BookingStatus.PENDING,
        start_time=now,
        end_time=now + timedelta(minutes=60),
        total_price=Decimal("100000"),
        created_at=now,
        updated_at=now,
        created_by=uuid.uuid4()
    )

    # calls: 1. create(), 2. add_item() -> get_by_id, 3. add_item() -> conflict check
    mock_result = MagicMock()
    mock_result.first.side_effect = [mock_booking, mock_booking, None]
    mock_session.exec.return_value = mock_result

    # 1. POST /bookings
    b_resp = await client.post("/api/v1/bookings", json={
        "customer_id": str(uuid.uuid4()),
        "items": [{"service_id": str(s_id), "start_time": now.isoformat(), "end_time": (now + timedelta(minutes=30)).isoformat()}]
    })
    assert b_resp.status_code == 201

    # 2. POST /items
    item_data = {
        "service_id": str(s_id),
        "start_time": now.isoformat(),
        "end_time": (now + timedelta(minutes=60)).isoformat(),
        "staff_id": str(uuid.uuid4())
    }
    response = await client.post(f"/api/v1/bookings/{b_id}/items", json=item_data)
    assert response.status_code == 201

@pytest.mark.asyncio
async def test_confirm_booking_endpoint(client: AsyncClient, mock_admin_auth, mock_session):
    """Test endpoint xác nhận lịch hẹn."""
    now = datetime.now(timezone.utc)
    b_id = uuid.uuid4()

    from src.modules.bookings.models import Booking
    mock_booking = Booking(
        id=b_id,
        customer_id=uuid.uuid4(),
        status=BookingStatus.PENDING,
        start_time=now,
        end_time=now + timedelta(minutes=60),
        total_price=Decimal("0"),
        created_at=now,
        updated_at=now,
        created_by=uuid.uuid4()
    )

    mock_result = MagicMock()
    mock_result.first.return_value = mock_booking
    mock_session.exec.return_value = mock_result

    response = await client.patch(f"/api/v1/bookings/{b_id}/confirm")
    assert response.status_code == 200
    assert response.json()["status"] == "CONFIRMED"

@pytest.mark.asyncio
async def test_bookings_unauthorized(client: AsyncClient):
    """Test không có token thì không được phép truy cập."""
    response = await client.get("/api/v1/bookings")
    assert response.status_code == 401
