"""
Promotions Module - API Endpoints
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Query

from .service import PromotionService
from .schemas import (
    PromotionCreate,
    PromotionUpdate,
    PromotionRead,
    PromotionListResponse,
    ValidatePromotionRequest,
    ValidatePromotionResponse
)
from .exceptions import PromotionException, DuplicatePromotionCode

router = APIRouter(prefix="/promotions", tags=["Promotions"])


@router.get("", response_model=PromotionListResponse)
async def list_promotions(
    active_only: bool = Query(False, description="Chỉ lấy khuyến mãi đang hiệu lực"),
    service: PromotionService = Depends()
):
    """
    Lấy danh sách các chương trình khuyến mãi.
    """
    return await service.get_all(active_only=active_only)


@router.post("", response_model=PromotionRead, status_code=status.HTTP_201_CREATED)
async def create_promotion(
    data: PromotionCreate,
    service: PromotionService = Depends()
):
    """
    Tạo chương trình khuyến mãi mới.
    """
    try:
        return await service.create(data)
    except DuplicatePromotionCode as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/{id}", response_model=PromotionRead)
async def get_promotion(
    id: uuid.UUID,
    service: PromotionService = Depends()
):
    """Lấy chi tiết khuyến mãi."""
    try:
        return await service.get_by_id(id)
    except PromotionException as e:
        raise HTTPException(status_code=404, detail=e.detail)


@router.put("/{id}", response_model=PromotionRead)
async def update_promotion(
    id: uuid.UUID,
    data: PromotionUpdate,
    service: PromotionService = Depends()
):
    """Cập nhật khuyến mãi."""
    try:
        return await service.update(id, data)
    except PromotionException as e:
         raise HTTPException(status_code=404, detail=e.detail)


@router.delete("/{id}", status_code=204)
async def delete_promotion(
    id: uuid.UUID,
    service: PromotionService = Depends()
):
    """Xóa khuyến mãi."""
    try:
        await service.delete(id)
    except PromotionException as e:
         raise HTTPException(status_code=404, detail=e.detail)


@router.post("/validate", response_model=ValidatePromotionResponse)
async def validate_promotion(
    data: ValidatePromotionRequest,
    service: PromotionService = Depends()
):
    """
    Kiểm tra tính hợp lệ của mã giảm giá và tính toán số tiền.
    Sử dụng khi khách nhập mã tại bước thanh toán.
    """
    return await service.validate_code(code=data.code, order_total=data.order_total)
