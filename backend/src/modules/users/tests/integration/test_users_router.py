"""
Integration Tests for Users Router
"""

import pytest
import uuid
from fastapi import status
from src.modules.users.models import User
from src.modules.users.constants import UserRole

@pytest.mark.asyncio
async def test_read_users_me_success(client, mock_admin_auth, mocker):
    """Test API GET /users/me thành công với mock admin."""
    # 1. Setup mock data
    user_id = uuid.UUID(mock_admin_auth["sub"])
    mock_user = User(
        id=user_id,
        email=mock_admin_auth["email"],
        full_name=mock_admin_auth["full_name"],
        role=UserRole.MANAGER
    )

    # Mock dependency get_current_user để trả về mock_user trực tiếp
    # Lưu ý: router.py sử dụng get_current_user
    from src.modules.users.dependencies import get_current_user
    from src.app.main import app

    app.dependency_overrides[get_current_user] = lambda: mock_user

    # 2. Call API
    response = await client.get("/api/v1/users/me")

    # 3. Check kết quả
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == mock_admin_auth["email"]
    assert data["full_name"] == mock_admin_auth["full_name"]

    # Cleanup
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_read_users_me_unauthorized(client):
    """Test API GET /users/me thất bại khi không có token."""
    # Không dùng mock_auth fixture
    response = await client.get("/api/v1/users/me")

    # Mặc định HTTPBearer của FastAPI sẽ trả về 403 nếu auto_error=False và thiếu token
    # Hoặc 401 tùy cấu hình. Ở đây auth_core.py raise 401 nếu thiếu credentials.
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
