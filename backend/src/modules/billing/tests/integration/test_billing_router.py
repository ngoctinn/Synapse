"""
Integration Tests for Billing Module
"""

import pytest
import uuid
from decimal import Decimal
from datetime import datetime, timezone
from httpx import AsyncClient
from unittest.mock import MagicMock
from src.modules.billing.models import Invoice, InvoiceStatus, Payment, PaymentMethod

@pytest.mark.asyncio
async def test_create_invoice_manual(client: AsyncClient, mock_admin_auth, mock_session):
    """Test tạo hóa đơn thủ công."""
    customer_id = uuid.uuid4()
    mock_invoice = Invoice(
        id=uuid.uuid4(),
        customer_id=customer_id,
        total_amount=Decimal("500000"),
        final_amount=Decimal("500000"),
        status=InvoiceStatus.UNPAID,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

    mock_result = MagicMock()
    mock_result.first.return_value = mock_invoice
    mock_session.exec.return_value = mock_result

    invoice_data = {
        "customer_id": str(customer_id),
        "total_amount": 500000,
        "final_amount": 500000,
        "notes": "Test invoice"
    }

    response = await client.post("/api/v1/billing/invoices", json=invoice_data)
    assert response.status_code == 201
    assert float(response.json()["total_amount"]) == 500000.0

@pytest.mark.asyncio
async def test_get_invoice_detail(client: AsyncClient, mock_admin_auth, mock_session):
    """Test lấy chi tiết hóa đơn."""
    inv_id = uuid.uuid4()
    mock_invoice = Invoice(
        id=inv_id,
        customer_id=uuid.uuid4(),
        total_amount=Decimal("300000"),
        final_amount=Decimal("300000"),
        status=InvoiceStatus.PAID,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        payments=[]
    )

    mock_result = MagicMock()
    mock_result.first.return_value = mock_invoice
    mock_session.exec.return_value = mock_result

    response = await client.get(f"/api/v1/billing/invoices/{inv_id}")
    assert response.status_code == 200
    assert response.json()["id"] == str(inv_id)

@pytest.mark.asyncio
async def test_process_payment(client: AsyncClient, mock_admin_auth, mock_session):
    """Test xử lý thanh toán."""
    inv_id = uuid.uuid4()
    mock_invoice = Invoice(
        id=inv_id,
        customer_id=uuid.uuid4(),
        total_amount=Decimal("500000"),
        final_amount=Decimal("500000"),
        status=InvoiceStatus.UNPAID,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        payments=[]
    )

    mock_invoice_result = MagicMock()
    mock_invoice_result.first.return_value = mock_invoice

    mock_sum_result = MagicMock()
    mock_sum_result.one.return_value = Decimal("0") # Giả định chưa trả đồng nào

    mock_session.exec.side_effect = [mock_invoice_result, mock_sum_result]

    payment_data = {
        "invoice_id": str(inv_id),
        "amount": 500000,
        "payment_method": "CASH"
    }

    response = await client.post("/api/v1/billing/payments", json=payment_data)
    assert response.status_code == 201
    assert float(response.json()["amount"]) == 500000.0
