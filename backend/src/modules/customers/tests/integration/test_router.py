"""
Integration Tests for Customers Router
"""

import pytest
import uuid
from httpx import AsyncClient
from unittest.mock import MagicMock
from datetime import datetime, timezone

@pytest.mark.asyncio
async def test_customer_crud_flow(client: AsyncClient, mock_admin_auth, mock_session):
    """Test flow: Tạo khách hàng -> Lấy chi tiết -> Cập nhật -> Xóa."""
    # Setup Mock
    from src.modules.customers.models import Customer
    c_id = uuid.uuid4()
    mock_customer = Customer(
        id=c_id,
        full_name="Nguyen Integration Test",
        phone_number="0123456789",
        email="integration@test.com",
        created_at=datetime.now(timezone.utc)
    )

    # Mock for get_by_id and update
    mock_result = MagicMock()
    # first() call 1: get_by_phone in create -> None
    # first() call 2: GET after create -> mock_customer
    # first() call 3: PUT -> mock_customer
    # first() call 4: DELETE -> mock_customer
    mock_result.first.side_effect = [None, mock_customer, mock_customer, mock_customer]
    mock_session.exec.return_value = mock_result

    # 1. Tạo Customer
    data = {
        "full_name": "Nguyen Integration Test",
        "phone_number": "0123456789",
        "email": "integration@test.com"
    }
    response = await client.post("/api/v1/customers", json=data)
    assert response.status_code == 201
    customer = response.json()
    customer_id = customer["id"]

    # 2. Lấy chi tiết
    response = await client.get(f"/api/v1/customers/{customer_id}")
    assert response.status_code == 200
    assert response.json()["full_name"] == "Nguyen Integration Test"

    # 3. Cập nhật
    update_data = {"full_name": "Nguyen Updated"}
    response = await client.put(f"/api/v1/customers/{customer_id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["full_name"] == "Nguyen Updated"

    # 4. Xóa
    response = await client.delete(f"/api/v1/customers/{customer_id}")
    assert response.status_code == 204

@pytest.mark.asyncio
async def test_get_customer_not_found(client: AsyncClient, mock_admin_auth, mock_session):
    """Test lấy khách hàng không tồn tại trả về 404."""
    random_id = uuid.uuid4()
    response = await client.get(f"/api/v1/customers/{random_id}")
    # Vì mock session trả về None nên router sẽ raise 404
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_list_customers(client: AsyncClient, mock_admin_auth, mock_session):
    """Test lấy danh sách khách hàng."""
    response = await client.get("/api/v1/customers?limit=5")
    assert response.status_code == 200
    # CustomerListResponse has 'data' and 'total'
    res_data = response.json()
    assert "data" in res_data
    assert "total" in res_data
