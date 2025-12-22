"""
Integration Tests for Notifications Module
"""

import pytest
import uuid
from datetime import datetime
from httpx import AsyncClient
from unittest.mock import MagicMock
from src.modules.notifications.models import NotificationTemplate

@pytest.mark.asyncio
async def test_list_templates(client: AsyncClient, mock_session):
    """Test lấy danh sách template."""
    mock_tpl = NotificationTemplate(
        id=uuid.uuid4(),
        code="WELCOME",
        name="Chào mừng",
        subject_template="Chào mừng {{name}}",
        body_template="Hello {{name}}",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    mock_result = MagicMock()
    mock_result.all.return_value = [mock_tpl]
    mock_session.exec.return_value = mock_result

    response = await client.get("/api/v1/notifications/templates")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["code"] == "WELCOME"

@pytest.mark.asyncio
async def test_send_test_email(client: AsyncClient, mock_admin_auth, mock_session):
    """Test API send email."""
    mock_tpl = NotificationTemplate(
        id=uuid.uuid4(),
        code="BOOKING_CONFIRMATION",
        name="Booking OK",
        subject_template="Booking {customer_name} OK",
        body_template="Details for {customer_name}",
        is_active=True,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    # Mock session for template lookup
    mock_result = MagicMock()
    mock_result.first.return_value = mock_tpl
    mock_session.exec.return_value = mock_result

    data = {
        "to_email": "user@test.com",
        "template_code": "BOOKING_CONFIRMATION",
        "context": {"customer_name": "Tuan"}
    }

    response = await client.post("/api/v1/notifications/send-email", json=data)
    assert response.status_code == 200
    assert response.json()["success"] is True
