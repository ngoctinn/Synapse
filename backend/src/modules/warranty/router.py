"""
Warranty Module - Router
"""

import uuid
from fastapi import APIRouter, Depends, status, Query

from .service import WarrantyService
from .schemas import (
    WarrantyTicketCreate,
    WarrantyTicketUpdate,
    WarrantyTicketRead,
    WarrantyListResponse
)

router = APIRouter(prefix="/warranty-tickets", tags=["Warranty"])

@router.get("", response_model=WarrantyListResponse)
async def list_tickets(
    customer_id: uuid.UUID | None = Query(None),
    service: WarrantyService = Depends()
):
    """Lấy danh sách yêu cầu bảo hành."""
    return await service.get_all(customer_id=customer_id)

@router.post("", response_model=WarrantyTicketRead, status_code=status.HTTP_201_CREATED)
async def create_ticket(
    data: WarrantyTicketCreate,
    service: WarrantyService = Depends()
):
    """Tạo yêu cầu bảo hành mới."""
    return await service.create(data)

@router.get("/{id}", response_model=WarrantyTicketRead)
async def get_ticket(
    id: uuid.UUID,
    service: WarrantyService = Depends()
):
    """Chi tiết yêu cầu bảo hành."""
    return await service.get_by_id(id)

@router.patch("/{id}", response_model=WarrantyTicketRead)
async def update_ticket(
    id: uuid.UUID,
    data: WarrantyTicketUpdate,
    service: WarrantyService = Depends()
):
    """Cập nhật trạng thái yêu cầu bảo hành (Admin)."""
    return await service.update(id, data)
