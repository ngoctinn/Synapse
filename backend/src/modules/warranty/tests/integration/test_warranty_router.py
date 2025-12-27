"""
Integration Tests for Warranty Module
"""

import pytest
import uuid
from datetime import datetime, timezone
from httpx import AsyncClient
from unittest.mock import MagicMock
from src.modules.warranty.models import WarrantyTicket, WarrantyStatus

@pytest.mark.asyncio
async def test_create_warranty_ticket(client: AsyncClient, mock_admin_auth, mock_session):
    """Test tạo yêu cầu bảo hành."""
    customer_id = uuid.uuid4()
    WarrantyTicket(
        id=uuid.uuid4(),
        customer_id=customer_id,
        description="Lỗi da sau điều trị",
        status=WarrantyStatus.PENDING,
        created_at=datetime.now(timezone.utc)
    )

    # service.create returns the ticket
    # mock refresh might be needed

    data = {
        "customer_id": str(customer_id),
        "description": "Lỗi da sau điều trị",
        "images": ["http://img.com/1.jpg"]
    }

    response = await client.post("/api/v1/warranty-tickets", json=data)
    assert response.status_code == 201
    assert response.json()["status"] == "PENDING"

@pytest.mark.asyncio
async def test_list_warranty_tickets(client: AsyncClient, mock_admin_auth, mock_session):
    """Test lấy danh sách yêu cầu bảo hành."""
    mock_ticket = WarrantyTicket(
        id=uuid.uuid4(),
        customer_id=uuid.uuid4(),
        description="Test list",
        status=WarrantyStatus.PENDING,
        created_at=datetime.now(timezone.utc)
    )

    mock_result = MagicMock()
    mock_result.all.return_value = [mock_ticket]
    mock_result.one.return_value = 1
    mock_session.exec.return_value = mock_result

    response = await client.get("/api/v1/warranty-tickets")
    assert response.status_code == 200
    assert response.json()["total"] == 1
    assert len(response.json()["items"]) == 1

@pytest.mark.asyncio
async def test_update_warranty_status(client: AsyncClient, mock_admin_auth, mock_session):
    """Test duyệt yêu cầu bảo hành (Admin)."""
    t_id = uuid.uuid4()
    mock_ticket = WarrantyTicket(
        id=t_id,
        customer_id=uuid.uuid4(),
        description="Test update",
        status=WarrantyStatus.PENDING,
        created_at=datetime.now(timezone.utc)
    )

    # service.update calls get_by_id which calls session.get or exec
    # Let's check service.py
    mock_session.get.return_value = mock_ticket

    update_data = {
        "status": "APPROVED",
        "resolution_notes": "Đã duyệt hỗ trợ"
    }

    response = await client.patch(f"/api/v1/warranty-tickets/{t_id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["status"] == "APPROVED"
