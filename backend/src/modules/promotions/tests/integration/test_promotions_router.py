"""
Integration Tests for Promotions Module
"""

import pytest
import uuid
from decimal import Decimal
from datetime import date, datetime, timezone, timedelta
from httpx import AsyncClient
from unittest.mock import MagicMock
from src.modules.promotions.models import Promotion, DiscountType

@pytest.mark.asyncio
async def test_create_promotion(client: AsyncClient, mock_admin_auth, mock_session):
    """Test tạo chương trình khuyến mãi."""
    # Mock uniqueness check
    mock_result = MagicMock()
    mock_result.first.return_value = None
    mock_session.exec.return_value = mock_result

    promo_data = {
        "code": "KM_TEST",
        "name": "Khuyến mãi dùng thử",
        "discount_type": "PERCENTAGE",
        "discount_value": 10,
        "valid_from": str(date.today()),
        "valid_until": str(date.today() + timedelta(days=30))
    }

    response = await client.post("/api/v1/promotions", json=promo_data)
    assert response.status_code == 201
    assert response.json()["code"] == "KM_TEST"

@pytest.mark.asyncio
async def test_validate_promotion_code(client: AsyncClient, mock_session):
    """Test kiểm tra mã giảm giá."""
    mock_promo = Promotion(
        id=uuid.uuid4(),
        code="VAL_OK",
        name="Valid Promo",
        discount_type=DiscountType.FIXED_AMOUNT,
        discount_value=Decimal("50000"),
        min_order_value=Decimal("100000"),
        valid_from=date.today(),
        valid_until=date.today() + timedelta(days=1),
        is_active=True,
        created_at=datetime.now(timezone.utc)
    )

    mock_result = MagicMock()
    mock_result.first.return_value = mock_promo
    mock_session.exec.return_value = mock_result

    val_data = {
        "code": "VAL_OK",
        "order_total": 200000
    }

    response = await client.post("/api/v1/promotions/validate", json=val_data)
    assert response.status_code == 200
    assert response.json()["valid"] is True
    assert float(response.json()["discount_amount"]) == 50000.0

@pytest.mark.asyncio
async def test_list_promotions(client: AsyncClient, mock_session):
    """Test danh sách khuyến mãi."""
    mock_promo = Promotion(
        id=uuid.uuid4(),
        code="LIST_1",
        name="List 1",
        discount_type=DiscountType.PERCENTAGE,
        discount_value=Decimal("5"),
        valid_from=date.today(),
        valid_until=date.today(),
        is_active=True,
        current_uses=0,
        created_at=datetime.now(timezone.utc)
    )

    mock_result = MagicMock()
    mock_result.all.return_value = [mock_promo]
    mock_result.one.return_value = 1
    mock_session.exec.return_value = mock_result

    response = await client.get("/api/v1/promotions")
    assert response.status_code == 200
    assert response.json()["total"] == 1
    assert len(response.json()["items"]) == 1
