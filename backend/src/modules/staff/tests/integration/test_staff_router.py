"""
Integration Tests for Staff Module
"""

import pytest
import uuid
from datetime import date, datetime, timezone
from httpx import AsyncClient
from unittest.mock import MagicMock, patch
from src.modules.staff.models import Staff
from src.modules.users.models import User
from src.modules.users.constants import UserRole

@pytest.fixture
def mock_supabase_admin():
    with patch("src.modules.staff.service.get_supabase_admin") as mock:
        admin_client = MagicMock()
        mock_user = MagicMock()
        mock_user.id = str(uuid.uuid4())
        admin_client.auth.admin.invite_user_by_email.return_value = MagicMock(user=mock_user)
        mock.return_value = admin_client
        yield admin_client

@pytest.mark.asyncio
async def test_invite_staff(client: AsyncClient, mock_admin_auth, mock_session, mock_supabase_admin):
    """Test mời nhân viên mới."""
    invite_data = {
        "email": "newstaff@test.com",
        "full_name": "New Staff",
        "role": UserRole.TECHNICIAN,
        "title": "KTV"
    }

    # Mock check email existence
    mock_result = MagicMock()
    mock_result.first.return_value = None
    mock_session.exec.return_value = mock_result

    response = await client.post("/api/v1/staff/invite", json=invite_data)
    assert response.status_code == 201
    assert "user_id" in response.json()

@pytest.mark.asyncio
async def test_list_staff(client: AsyncClient, mock_session):
    """Test lấy danh sách nhân viên."""
    u_id = uuid.uuid4()
    mock_user = User(
        id=u_id,
        full_name="Staff A",
        role=UserRole.TECHNICIAN,
        email="staffa@test.com",
        is_active=True
    )
    mock_staff = Staff(
        user_id=u_id,
        hired_at=date.today(),
        title="KTV",
        user=mock_user,
        skills=[],
        created_at=datetime.now(timezone.utc)
    )

    mock_result = MagicMock()
    mock_result.all.return_value = [mock_staff]
    mock_result.one.return_value = 1
    mock_session.exec.return_value = mock_result

    response = await client.get("/api/v1/staff/")
    assert response.status_code == 200
    assert response.json()["total"] == 1

@pytest.mark.asyncio
async def test_get_staff_detail(client: AsyncClient, mock_session):
    """Test lấy chi tiết nhân viên."""
    u_id = uuid.uuid4()
    mock_user = User(
        id=u_id,
        full_name="Detail Staff",
        role=UserRole.TECHNICIAN,
        email="detail@test.com",
        is_active=True
    )
    mock_staff = Staff(
        user_id=u_id,
        hired_at=date.today(),
        title="Dev",
        user=mock_user,
        skills=[],
        created_at=datetime.now(timezone.utc)
    )

    mock_result = MagicMock()
    mock_result.first.return_value = mock_staff
    mock_session.exec.return_value = mock_result

    response = await client.get(f"/api/v1/staff/{u_id}")
    assert response.status_code == 200
    assert response.json()["user_id"] == str(u_id)
    assert response.json()["user"]["email"] == "detail@test.com"

@pytest.mark.asyncio
async def test_deactivate_staff(client: AsyncClient, mock_admin_auth, mock_session):
    """Test vô hiệu hóa nhân viên."""
    u_id = uuid.uuid4()
    mock_user = User(id=u_id, full_name="To Inactive", is_active=True)
    mock_session.get.return_value = mock_user

    response = await client.delete(f"/api/v1/staff/{u_id}")
    assert response.status_code == 200
    assert mock_user.is_active is False
