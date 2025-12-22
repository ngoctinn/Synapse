"""
Unit Tests for UserService
"""

import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from src.modules.users.service import UserService
from src.modules.users.models import User
from src.modules.users.exceptions import UserNotFound

@pytest.fixture
def mock_session():
    """Fixture cung cấp AsyncSession giả lập."""
    session = AsyncMock()
    session.add = MagicMock()
    session.add_all = MagicMock()
    session.delete = MagicMock()
    session.refresh = AsyncMock()
    return session

@pytest.fixture
def user_service(mock_session):
    """Fixture cung cấp UserService với session giả lập."""
    return UserService(session=mock_session)

@pytest.mark.asyncio
async def test_get_profile_success(user_service, mock_session):
    """Test lấy profile thành công."""
    # 1. Setup dữ liệu giả lập
    user_id = uuid.uuid4()
    mock_user = User(id=user_id, email="test@example.com", full_name="Test User")

    # Giả lập hàm session.get trả về user
    mock_session.get.return_value = mock_user

    # 2. Thực thi hàm cần test
    result = await user_service.get_profile(user_id)

    # 3. Kiểm tra kết quả
    assert result.id == user_id
    assert result.email == "test@example.com"
    mock_session.get.assert_called_once_with(User, user_id)

@pytest.mark.asyncio
async def test_get_profile_not_found(user_service, mock_session):
    """Test lấy profile không tồn tại (ném exception)."""
    # 1. Setup: session.get trả về None
    user_id = uuid.uuid4()
    mock_session.get.return_value = None

    # 2. Thực thi & Kiểm tra ném đúng Exception
    with pytest.raises(UserNotFound) as exc_info:
        await user_service.get_profile(user_id)

    assert str(exc_info.value.detail) == "Người dùng không tồn tại"
    mock_session.get.assert_called_once_with(User, user_id)
