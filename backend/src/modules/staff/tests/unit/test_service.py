"""
Unit Tests for StaffService
"""

import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from src.modules.staff.service import StaffService
from src.modules.staff.models import Staff
from src.modules.staff.exceptions import StaffNotFound, StaffOperationError
from src.modules.users.models import User
from src.modules.users.constants import UserRole

@pytest.fixture
def mock_session():
    session = AsyncMock()
    session.add = MagicMock()
    session.add_all = MagicMock()
    session.delete = MagicMock()
    session.refresh = AsyncMock()
    return session

@pytest.fixture
def staff_service(mock_session):
    return StaffService(session=mock_session)

@pytest.mark.asyncio
async def test_get_staff_by_id_success(staff_service, mock_session):
    """Test lấy staff theo ID thành công."""
    staff_id = uuid.uuid4()
    mock_staff = Staff(user_id=staff_id, title="Senior Technician")

    # Giả lập kết quả query với exec().first()
    mock_result = MagicMock()
    mock_result.first.return_value = mock_staff
    mock_session.exec.return_value = mock_result

    result = await staff_service.get_staff_by_id(staff_id)

    assert result.user_id == staff_id
    assert result.title == "Senior Technician"
    mock_session.exec.assert_called_once()

@pytest.mark.asyncio
async def test_get_staff_by_id_not_found(staff_service, mock_session):
    """Test lấy staff không tồn tại."""
    staff_id = uuid.uuid4()

    mock_result = MagicMock()
    mock_result.first.return_value = None
    mock_session.exec.return_value = mock_result

    with pytest.raises(StaffNotFound):
        await staff_service.get_staff_by_id(staff_id)

@pytest.mark.asyncio
async def test_update_staff_skills_not_technician(staff_service, mock_session):
    """Test gán kỹ năng thất bại nếu không phải là Technician."""
    user_id = uuid.uuid4()
    # Mock user là Manager
    mock_user = User(id=user_id, role=UserRole.MANAGER)
    mock_session.get.return_value = mock_user

    from src.modules.staff.schemas import StaffSkillsUpdate
    data = StaffSkillsUpdate(skill_ids=[uuid.uuid4()])

    with pytest.raises(StaffOperationError) as exc_info:
        await staff_service.update_staff_skills(user_id, data)

    assert "Chỉ Kỹ thuật viên mới có thể gán kỹ năng" in str(exc_info.value.detail)
