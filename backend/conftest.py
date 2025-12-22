"""
Global Pytest Configuration & Fixtures
"""

import pytest
import uuid
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from src.app.main import app
from src.common.database import get_db_session
from src.common.auth_core import get_token_payload, get_token_payload_optional
from unittest.mock import AsyncMock, MagicMock

# Mock Auth Payload
MOCK_USER_ID = uuid.uuid4()
MOCK_ADMIN_PAYLOAD = {
    "sub": str(MOCK_USER_ID),
    "role": "admin",
    "email": "admin@synapse.com",
    "full_name": "Admin Test"
}

@pytest.fixture
def mock_session():
    """Tạo một mock SQLModel session."""
    session = AsyncMock()
    session.add = MagicMock()
    session.commit = AsyncMock()
    session.refresh = AsyncMock()

    # Tạo mock result object mặc định để tránh lỗi 'coroutine' object is not iterable/has no attribute
    mock_result = MagicMock()
    mock_result.first.return_value = None
    mock_result.all.return_value = []
    mock_result.one.return_value = 0

    session.exec = AsyncMock(return_value=mock_result)
    session.get = AsyncMock(return_value=None)
    return session

@pytest.fixture
async def client(mock_session) -> AsyncGenerator[AsyncClient, None]:
    """Fixture cung cấp AsyncClient để test endpoints với DB đã được mock."""
    app.dependency_overrides[get_db_session] = lambda: mock_session
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver"
    ) as ac:
        yield ac
    app.dependency_overrides.clear()

@pytest.fixture
def mock_admin_auth():
    """Fixture giả lập quyền Admin."""
    app.dependency_overrides[get_token_payload] = lambda: MOCK_ADMIN_PAYLOAD
    app.dependency_overrides[get_token_payload_optional] = lambda: MOCK_ADMIN_PAYLOAD
    yield MOCK_ADMIN_PAYLOAD

@pytest.fixture
def mock_staff_auth():
    """Fixture giả lập quyền Staff."""
    staff_payload = {**MOCK_ADMIN_PAYLOAD, "role": "staff"}
    app.dependency_overrides[get_token_payload] = lambda: staff_payload
    app.dependency_overrides[get_token_payload_optional] = lambda: staff_payload
    yield staff_payload

# TODO: Add Mock Database Session fixture if needed for Integration tests
# For now, we rely on dependency_overrides in specific tests if we want to mock the DB.
