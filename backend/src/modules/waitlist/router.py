"""
Waitlist Module - Router
"""

import uuid
from fastapi import APIRouter, Depends, Query, status

from .service import WaitlistService
from .schemas import (
    WaitlistEntryCreate,
    WaitlistEntryUpdate,
    WaitlistEntryRead,
    WaitlistEntryListResponse
)
from .models import WaitlistStatus

router = APIRouter(prefix="/waitlist", tags=["Waitlist"])

@router.get("", response_model=WaitlistEntryListResponse)
async def list_waitlist(
    status_filter: WaitlistStatus | None = Query(None, alias="status"),
    service: WaitlistService = Depends()
):
    """Lấy danh sách hàng đợi."""
    return await service.get_all(status=status_filter)

@router.post("", response_model=WaitlistEntryRead, status_code=status.HTTP_201_CREATED)
async def join_waitlist(
    data: WaitlistEntryCreate,
    service: WaitlistService = Depends()
):
    """Đăng ký vào danh sách chờ."""
    return await service.create(data)

@router.patch("/{id}", response_model=WaitlistEntryRead)
async def update_waitlist_entry(
    id: uuid.UUID,
    data: WaitlistEntryUpdate,
    service: WaitlistService = Depends()
):
    """Cập nhật trạng thái hoặc thông tin entry."""
    return await service.update(id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_waitlist_entry(
    id: uuid.UUID,
    service: WaitlistService = Depends()
):
    """Xóa khỏi danh sách chờ."""
    await service.delete(id)
