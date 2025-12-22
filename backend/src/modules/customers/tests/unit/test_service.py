"""
Unit Tests for CustomerService
"""

import pytest
import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock
from src.modules.customers.service import CustomerService
from src.modules.customers.models import Customer
from src.modules.customers.schemas import CustomerCreate, CustomerUpdate, CustomerFilter
from src.modules.customers.exceptions import CustomerNotFound, CustomerAlreadyExists

@pytest.fixture
def mock_session():
    session = AsyncMock()
    session.add = MagicMock()
    session.commit = AsyncMock()
    session.refresh = AsyncMock()
    return session

@pytest.fixture
def customer_service(mock_session):
    return CustomerService(session=mock_session)

@pytest.mark.asyncio
async def test_get_customer_by_id_success(customer_service, mock_session):
    """Test lấy khách hàng theo ID thành công."""
    customer_id = uuid.uuid4()
    mock_customer = Customer(id=customer_id, full_name="Nguyen Van A")

    # Mock result
    mock_result = MagicMock()
    mock_result.first.return_value = mock_customer
    mock_session.exec.return_value = mock_result

    result = await customer_service.get_by_id(customer_id)

    assert result.full_name == "Nguyen Van A"
    assert result.id == customer_id

@pytest.mark.asyncio
async def test_get_customer_by_id_not_found(customer_service, mock_session):
    """Test raise Exception khi không tìm thấy khách hàng."""
    customer_id = uuid.uuid4()

    mock_result = MagicMock()
    mock_result.first.return_value = None
    mock_session.exec.return_value = mock_result

    with pytest.raises(CustomerNotFound):
        await customer_service.get_by_id(customer_id)

@pytest.mark.asyncio
async def test_create_customer_success(customer_service, mock_session):
    """Test tạo khách hàng mới thành công."""
    data = CustomerCreate(
        full_name="Tran Thi B",
        phone_number="0987654321",
        email="tranb@example.com"
    )

    # Mock phone check (None = not exists)
    mock_result = MagicMock()
    mock_result.first.return_value = None
    mock_session.exec.return_value = mock_result

    result = await customer_service.create(data)

    assert result.full_name == "Tran Thi B"
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()

@pytest.mark.asyncio
async def test_create_customer_duplicate_phone(customer_service, mock_session):
    """Test chặn tạo khách hàng trùng số điện thoại."""
    data = CustomerCreate(full_name="C", phone_number="123", email="c@x.com")

    # Mock phone check (trả về 1 customer đã tồn tại)
    existing_customer = Customer(id=uuid.uuid4(), phone_number="123")
    mock_result = MagicMock()
    mock_result.first.return_value = existing_customer
    mock_session.exec.return_value = mock_result

    with pytest.raises(CustomerAlreadyExists):
        await customer_service.create(data)

@pytest.mark.asyncio
async def test_delete_customer_soft(customer_service, mock_session):
    """Test xóa mềm khách hàng (cập nhật deleted_at)."""
    customer_id = uuid.uuid4()
    mock_customer = Customer(id=customer_id, full_name="D")

    # Mock get_by_id
    get_result = MagicMock()
    get_result.first.return_value = mock_customer
    mock_session.exec.return_value = get_result

    await customer_service.delete(customer_id)

    assert mock_customer.deleted_at is not None
    mock_session.add.assert_called()
    mock_session.commit.assert_called()

@pytest.mark.asyncio
async def test_link_account_success(customer_service, mock_session):
    """Test liên kết tài khoản user_id cho profile khách hàng."""
    customer_id = uuid.uuid4()
    user_id = uuid.uuid4()
    mock_customer = Customer(id=customer_id, full_name="E")

    # 1. Mock get_by_id
    # 2. Mock link check
    mock_result = MagicMock()
    mock_result.first.side_effect = [mock_customer, None] # Lần 1: lấy customer, Lần 2: check user_id
    mock_session.exec.return_value = mock_result

    result = await customer_service.link_account(customer_id, user_id)

    assert result.user_id == user_id
    mock_session.commit.assert_called()
