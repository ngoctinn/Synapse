"""
Promotions Module - Business Logic Service
"""

import uuid
from datetime import date
from decimal import Decimal
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends

from src.common.database import get_db_session
from .models import Promotion, DiscountType
from .schemas import (
    PromotionCreate,
    PromotionUpdate,
    PromotionRead,
    PromotionListResponse,
    ValidatePromotionResponse
)
from .exceptions import (
    PromotionNotFound,
    DuplicatePromotionCode,
    InvalidPromotionCode
)


class PromotionService:
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_all(self, active_only: bool = False) -> PromotionListResponse:
        """Lấy danh sách khuyến mãi."""
        query = select(Promotion)
        if active_only:
            query = query.where(Promotion.is_active == True)

        result = await self.session.exec(query)
        promotions = result.all()

        return PromotionListResponse(
            items=[PromotionRead.model_validate(p) for p in promotions],
            total=len(promotions)
        )

    async def get_by_id(self, id: uuid.UUID) -> PromotionRead:
        """Lấy chi tiết khuyến mãi."""
        query = select(Promotion).where(Promotion.id == id)
        result = await self.session.exec(query)
        promo = result.first()
        if not promo:
            raise PromotionNotFound()
        return PromotionRead.model_validate(promo)

    async def create(self, data: PromotionCreate) -> PromotionRead:
        """Tạo khuyến mãi mới."""
        # Check duplicate code
        query = select(Promotion).where(Promotion.code == data.code)
        result = await self.session.exec(query)
        if result.first():
            raise DuplicatePromotionCode(data.code)

        promo = Promotion.model_validate(data)
        self.session.add(promo)
        await self.session.commit()
        await self.session.refresh(promo)
        return PromotionRead.model_validate(promo)

    async def update(self, id: uuid.UUID, data: PromotionUpdate) -> PromotionRead:
        """Cập nhật khuyến mãi."""
        query = select(Promotion).where(Promotion.id == id)
        result = await self.session.exec(query)
        promo = result.first()
        if not promo:
            raise PromotionNotFound()

        # Partial update
        values = data.model_dump(exclude_unset=True)
        for k, v in values.items():
            setattr(promo, k, v)

        self.session.add(promo)
        await self.session.commit()
        await self.session.refresh(promo)
        return PromotionRead.model_validate(promo)

    async def delete(self, id: uuid.UUID) -> None:
        """Xóa (Soft delete logic? Hiện tại Hard delete theo requirement đơn giản)."""
        query = select(Promotion).where(Promotion.id == id)
        result = await self.session.exec(query)
        promo = result.first()
        if not promo:
            raise PromotionNotFound()

        await self.session.delete(promo)
        await self.session.commit()

    async def validate_code(self, code: str, order_total: Decimal) -> ValidatePromotionResponse:
        """
        Kiểm tra mã giảm giá và tính toán số tiền giảm.
        """
        query = select(Promotion).where(Promotion.code == code)
        result = await self.session.exec(query)
        promo = result.first()

        # 1. Existence check
        if not promo:
             return ValidatePromotionResponse(
                valid=False,
                discount_amount=Decimal(0),
                final_price=order_total,
                message="Mã giảm giá không tồn tại"
            )

        # 2. Status & Date check
        today = date.today()
        if not promo.is_active:
             return ValidatePromotionResponse(
                valid=False,
                discount_amount=Decimal(0),
                final_price=order_total,
                message="Chương trình đã kết thúc"
            )

        if today < promo.valid_from or today > promo.valid_until:
             return ValidatePromotionResponse(
                valid=False,
                discount_amount=Decimal(0),
                final_price=order_total,
                message="Mã giảm giá đã hết hạn hoặc chưa đến ngày áp dụng"
            )

        # 3. Usage limit check
        if promo.max_uses is not None and promo.current_uses >= promo.max_uses:
             return ValidatePromotionResponse(
                valid=False,
                discount_amount=Decimal(0),
                final_price=order_total,
                message="Mã giảm giá đã hết lượt sử dụng"
            )

        # 4. Min order check
        if order_total < promo.min_order_value:
             return ValidatePromotionResponse(
                valid=False,
                discount_amount=Decimal(0),
                final_price=order_total,
                message=f"Đơn hàng chưa đạt giá trị tối thiểu: {promo.min_order_value:,.0f}đ"
            )

        # 5. Determine Discount Amount
        discount = Decimal(0)
        if promo.discount_type == DiscountType.FIXED_AMOUNT:
            discount = promo.discount_value
        elif promo.discount_type == DiscountType.PERCENTAGE:
             discount = order_total * (promo.discount_value / Decimal(100))

        # Discount không thể lớn hơn total
        if discount > order_total:
            discount = order_total

        final = order_total - discount

        return ValidatePromotionResponse(
            valid=True,
            discount_amount=discount,
            final_price=final,
            message=f"Áp dụng mã thành công: Giảm {discount:,.0f}đ",
            promotion=PromotionRead.model_validate(promo)
        )
