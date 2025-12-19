"""
Customers Module - API Endpoints
"""
import uuid
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Query

from .service import CustomerService
from .schemas import CustomerCreate, CustomerUpdate, CustomerRead, CustomerListResponse, CustomerFilter
from .exceptions import CustomerNotFound, CustomerAlreadyExists

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("", response_model=CustomerListResponse)
async def list_customers(
    search: str | None = None,
    membership_tier: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    service: CustomerService = Depends()
):
    """
    **Lấy danh sách khách hàng.**
    """
    filters = CustomerFilter(search=search, membership_tier=membership_tier)
    return await service.get_all(filters, page, limit)

@router.post("", response_model=CustomerRead, status_code=status.HTTP_201_CREATED)
async def create_customer(
    data: CustomerCreate,
    service: CustomerService = Depends()
):
    """
    **Tạo hồ sơ khách hàng mới.**
    """
    try:
        return await service.create(data)
    except CustomerAlreadyExists as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.detail)

@router.get("/phone/{phone}", response_model=CustomerRead)
async def get_customer_by_phone(
    phone: str,
    service: CustomerService = Depends()
):
    """
    **Tìm khách hàng theo số điện thoại.**
    """
    customer = await service.get_by_phone(phone)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer

@router.get("/{customer_id}", response_model=CustomerRead)
async def get_customer(
    customer_id: uuid.UUID,
    service: CustomerService = Depends()
):
    """
    **Xem chi tiết khách hàng.**
    """
    try:
        return await service.get_by_id(customer_id)
    except CustomerNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)

@router.put("/{customer_id}", response_model=CustomerRead)
async def update_customer(
    customer_id: uuid.UUID,
    data: CustomerUpdate,
    service: CustomerService = Depends()
):
    """
    **Cập nhật thông tin khách hàng.**
    """
    try:
        return await service.update(customer_id, data)
    except CustomerNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)
    except CustomerAlreadyExists as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.detail)

@router.post("/{customer_id}/link-account", response_model=CustomerRead)
async def link_account(
    customer_id: uuid.UUID,
    user_id: uuid.UUID,
    service: CustomerService = Depends()
):
    """
    **Liên kết hồ sơ khách hàng với tài khoản App.**
    """
    try:
        return await service.link_account(customer_id, user_id)
    except CustomerNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)
    except CustomerAlreadyExists as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.detail)

@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(
    customer_id: uuid.UUID,
    service: CustomerService = Depends()
):
    """
    **Xóa khách hàng (Soft Delete).**
    """
    try:
        await service.delete(customer_id)
    except CustomerNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)
