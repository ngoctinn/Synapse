"""
Unit Tests for ServiceManagementService
"""

import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from src.modules.services.service import ServiceManagementService, simple_slugify
from src.modules.services.models import Service
from src.modules.services.exceptions import ServiceNotFoundError
from src.modules.services.schemas import ServiceCreate

@pytest.fixture
def mock_session():
    session = AsyncMock()
    # Các hàm đồng bộ trong SQLAlchemy 2.0 AsyncSession
    session.add = MagicMock()
    session.add_all = MagicMock()
    session.delete = MagicMock()
    session.refresh = AsyncMock() # refresh() có bản async
    return session

@pytest.fixture
def service_service(mock_session):
    return ServiceManagementService(session=mock_session)

def test_simple_slugify():
    """Test helper slugify."""
    assert simple_slugify("Massage Body") == "massage_body"
    assert simple_slugify("Chăm sóc da mặt (VIP)") == "cham_soc_da_mat_vip"

@pytest.mark.asyncio
async def test_get_service_success(service_service, mock_session):
    """Test lấy chi tiết dịch vụ thành công."""
    service_id = uuid.uuid4()
    mock_sv = Service(id=service_id, name="Test Service", duration=60)

    # Mock query result
    mock_result = MagicMock()
    mock_result.first.return_value = mock_sv
    mock_session.exec.return_value = mock_result

    result = await service_service.get_service(service_id)

    assert result.name == "Test Service"
    mock_session.exec.assert_called_once()

@pytest.mark.asyncio
async def test_get_service_not_found(service_service, mock_session):
    """Test lấy dịch vụ không tồn tại."""
    service_id = uuid.uuid4()
    mock_result = MagicMock()
    mock_result.first.return_value = None
    mock_session.exec.return_value = mock_result

    with pytest.raises(ServiceNotFoundError):
        await service_service.get_service(service_id)

