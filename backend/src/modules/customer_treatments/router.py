from fastapi import APIRouter, Depends, HTTPException, status
import uuid

from .schemas import (
    CustomerTreatmentCreate,
    CustomerTreatmentRead,
    CustomerTreatmentUpdate,
)
from .service import CustomerTreatmentService
from .exceptions import TreatmentNotFound, TreatmentException

router = APIRouter(prefix="/treatments", tags=["Customer Treatments"])

@router.get("/customer/{customer_id}", response_model=list[CustomerTreatmentRead])
async def get_customer_treatments(
    customer_id: uuid.UUID,
    service: CustomerTreatmentService = Depends()
):
    """Lấy danh sách liệu trình của một khách hàng."""
    return await service.get_by_customer(customer_id)

@router.get("/{treatment_id}", response_model=CustomerTreatmentRead)
async def get_treatment_detail(
    treatment_id: uuid.UUID,
    service: CustomerTreatmentService = Depends()
):
    """Xem chi tiết liệu trình."""
    try:
        return await service.get_by_id(treatment_id)
    except TreatmentNotFound as e:
        raise HTTPException(status_code=404, detail=e.detail)

@router.post("", response_model=CustomerTreatmentRead, status_code=status.HTTP_201_CREATED)
async def create_treatment(
    data: CustomerTreatmentCreate,
    service: CustomerTreatmentService = Depends()
):
    """
    **Tạo liệu trình mới (Mua gói).**
    - Dùng cho Admin/Lễ tân khi khách mua gói tại quầy.
    """
    return await service.create(data)

@router.put("/{treatment_id}", response_model=CustomerTreatmentRead)
async def update_treatment(
    treatment_id: uuid.UUID,
    data: CustomerTreatmentUpdate,
    service: CustomerTreatmentService = Depends()
):
    """Cập nhật liệu trình (gia hạn, sửa lỗi)."""
    try:
        return await service.update(treatment_id, data)
    except TreatmentNotFound as e:
        raise HTTPException(status_code=404, detail=e.detail)

# Endpoint punch/refund có thể để internal hoặc admin trigger?
# Tạm thời chưa expose public API cho punch/refund vì nó được trigger bởi Booking Flow.
