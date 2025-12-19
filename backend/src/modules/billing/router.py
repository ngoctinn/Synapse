"""
Billing Module - API Endpoints
"""
import uuid
from fastapi import APIRouter, Depends, status, Query
from .service import BillingService
from .schemas import (
    InvoiceRead, InvoiceCreate, InvoiceUpdate,
    PaymentRead, PaymentCreate, InvoiceListResponse
)

router = APIRouter(prefix="/billing", tags=["Billing"])

@router.post("/invoices", response_model=InvoiceRead, status_code=status.HTTP_201_CREATED)
async def create_invoice(data: InvoiceCreate, service: BillingService = Depends()):
    """Tạo hóa đơn thủ công."""
    return await service.create_invoice(data)

@router.get("/invoices/{invoice_id}", response_model=InvoiceRead)
async def get_invoice(invoice_id: uuid.UUID, service: BillingService = Depends()):
    """Lấy chi tiết hóa đơn."""
    return await service.get_invoice_by_id(invoice_id)

@router.patch("/invoices/{invoice_id}", response_model=InvoiceRead)
async def update_invoice(invoice_id: uuid.UUID, data: InvoiceUpdate, service: BillingService = Depends()):
    """Cập nhật hóa đơn (Trạng thái, giảm giá)."""
    return await service.update_invoice(invoice_id, data)

@router.post("/payments", response_model=PaymentRead, status_code=status.HTTP_201_CREATED)
async def process_payment(data: PaymentCreate, service: BillingService = Depends()):
    """Ghi nhận thanh toán cho một hóa đơn."""
    return await service.process_payment(data)

@router.post("/bookings/{booking_id}/invoice", response_model=InvoiceRead)
async def create_invoice_from_booking(booking_id: uuid.UUID, service: BillingService = Depends()):
    """Tạo hóa đơn từ một lịch hẹn (dành cho lễ tân)."""
    return await service.create_invoice_from_booking(booking_id)
