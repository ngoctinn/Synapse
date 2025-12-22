"""
Integration Tests for Operating Hours Module
"""

import pytest
import uuid
from datetime import time, date
from httpx import AsyncClient
from unittest.mock import MagicMock
from src.modules.operating_hours.models import RegularOperatingHours, ExceptionDate, ExceptionDateType

@pytest.mark.asyncio
async def test_get_week_operating_hours(client: AsyncClient, mock_session):
    """Test lấy giờ hoạt động tuần."""
    mock_item = RegularOperatingHours(
        id=uuid.uuid4(),
        day_of_week=1,
        open_time=time(8, 0),
        close_time=time(20, 0),
        is_closed=False
    )

    mock_result = MagicMock()
    mock_result.all.return_value = [mock_item]
    mock_session.exec.return_value = mock_result

    response = await client.get("/api/v1/operating-hours")
    assert response.status_code == 200
    assert "days" in response.json()
    assert len(response.json()["days"]) == 7

@pytest.mark.asyncio
async def test_create_exception_date(client: AsyncClient, mock_admin_auth, mock_session):
    """Test tạo ngày nghỉ lễ."""
    # Mock uniqueness check in service.create
    mock_result = MagicMock()
    mock_result.first.return_value = None
    mock_session.exec.return_value = mock_result

    data = {
        "exception_date": str(date.today()),
        "type": "HOLIDAY",
        "is_closed": True,
        "reason": "Test Holiday"
    }

    response = await client.post("/api/v1/operating-hours/exceptions", json=data)
    assert response.status_code == 201
    assert response.json()["type"] == "HOLIDAY"

@pytest.mark.asyncio
async def test_list_exception_dates(client: AsyncClient, mock_session):
    """Test danh sách ngày ngoại lệ."""
    mock_exc = ExceptionDate(
        id=uuid.uuid4(),
        exception_date=date.today(),
        type=ExceptionDateType.MAINTENANCE,
        is_closed=True
    )

    mock_result = MagicMock()
    mock_result.all.return_value = [mock_exc]
    mock_result.one.return_value = 1
    mock_session.exec.return_value = mock_result

    response = await client.get("/api/v1/operating-hours/exceptions")
    assert response.status_code == 200
    assert response.json()["total"] == 1
    assert len(response.json()["items"]) == 1
