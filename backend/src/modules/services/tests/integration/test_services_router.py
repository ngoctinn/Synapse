"""
Integration Tests for Services Module
"""

import pytest
import uuid
from datetime import datetime
from httpx import AsyncClient
from unittest.mock import MagicMock
from src.modules.services.models import Skill, Service
from src.modules.users.models import User
from src.modules.users.constants import UserRole

@pytest.mark.asyncio
async def test_list_skills(client: AsyncClient, mock_session):
    """Test lấy danh sách kỹ năng."""
    mock_skill = Skill(id=uuid.uuid4(), name="Massage", code="massage", description="Massage test")

    mock_result = MagicMock()
    mock_result.all.return_value = [mock_skill]
    mock_session.exec.return_value = mock_result

    response = await client.get("/api/v1/services/skills")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["code"] == "massage"

@pytest.mark.asyncio
async def test_create_skill_manager_success(client: AsyncClient, mock_admin_auth, mock_session):
    """Test tạo kỹ năng thành công với quyền Manager/Admin."""
    mock_user = User(id=uuid.UUID(mock_admin_auth["sub"]), role=UserRole.MANAGER, full_name="Manager")

    def mock_get(model, id):
        if model == User: return mock_user
        return None
    mock_session.get.side_effect = mock_get

    mock_result = MagicMock()
    mock_result.first.return_value = None
    mock_session.exec.return_value = mock_result

    skill_data = {"name": "Test Skill", "code": "test_skill", "description": "Desc"}
    response = await client.post("/api/v1/services/skills", json=skill_data)

    assert response.status_code == 201
    assert response.json()["code"] == "test_skill"

@pytest.mark.asyncio
async def test_create_skill_unauthorized(client: AsyncClient, mock_staff_auth, mock_session):
    """Test tạo kỹ năng thất bại do thiếu quyền MANAGER."""
    mock_user = User(id=uuid.UUID(mock_staff_auth["sub"]), role=UserRole.TECHNICIAN, full_name="Tech")

    def mock_get(model, id):
        if model == User: return mock_user
        return None
    mock_session.get.side_effect = mock_get

    skill_data = {"name": "Test Skill", "code": "test_skill"}
    response = await client.post("/api/v1/services/skills", json=skill_data)

    assert response.status_code == 403

@pytest.mark.asyncio
async def test_list_services_pagination(client: AsyncClient, mock_session):
    """Test lấy danh sách dịch vụ có phân trang."""
    mock_svc = Service(id=uuid.uuid4(), name="Massage Body", duration=60, price=200000)

    mock_result = MagicMock()
    mock_result.all.return_value = [mock_svc]
    mock_result.one.return_value = 1
    mock_session.exec.return_value = mock_result

    response = await client.get("/api/v1/services?page=1&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["data"]) == 1

@pytest.mark.asyncio
async def test_create_service_smart_tagging(client: AsyncClient, mock_admin_auth, mock_session):
    """Test tạo dịch vụ với Smart Tagging."""
    mock_user = User(id=uuid.UUID(mock_admin_auth["sub"]), role=UserRole.MANAGER, full_name="Manager")

    s_id = uuid.uuid4()
    mock_service = Service(
        id=s_id,
        name="Service New",
        duration=60,
        price=500000,
        skills=[],
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    def mock_get(model, id):
        if model == User: return mock_user
        if model == Service: return mock_service
        return None
    mock_session.get.side_effect = mock_get

    mock_result = MagicMock()
    mock_result.all.return_value = []
    mock_result.first.return_value = mock_service
    mock_session.exec.return_value = mock_result

    service_data = {
        "name": "Service New",
        "duration": 60,
        "price": 500000,
        "skill_ids": [],
        "new_skills": ["New Skill A"]
    }

    response = await client.post("/api/v1/services", json=service_data)
    assert response.status_code == 201
    assert response.json()["name"] == "Service New"
