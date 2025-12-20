"""
Promotions Module - Pydantic Schemas

DTOs cho API Requests/Responses.
"""

import uuid
from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field, field_validator

from .models import DiscountType


class PromotionBase(BaseModel):
    code: str = Field(min_length=3, max_length=50, pattern=r"^[A-Z0-9_-]+$")
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    discount_type: DiscountType
    discount_value: Decimal = Field(gt=0)
    min_order_value: Decimal = Field(default=Decimal(0), ge=0)
    max_uses: int | None = Field(default=None, gt=0)
    valid_from: date
    valid_until: date
    is_active: bool = True

    @field_validator("valid_until")
    def validate_dates(cls, v, info):
        if "valid_from" in info.data and v < info.data["valid_from"]:
            raise ValueError("Ngày kết thúc phải sau ngày bắt đầu")
        return v


class PromotionCreate(PromotionBase):
    pass


class PromotionUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    discount_type: DiscountType | None = None
    discount_value: Decimal | None = None
    min_order_value: Decimal | None = None
    max_uses: int | None = None
    valid_from: date | None = None
    valid_until: date | None = None
    is_active: bool | None = None


class PromotionRead(PromotionBase):
    id: uuid.UUID
    current_uses: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PromotionListResponse(BaseModel):
    items: list[PromotionRead]
    total: int


# ============================================================================
# VALIDATION SCHEMAS
# ============================================================================

class ValidatePromotionRequest(BaseModel):
    code: str
    order_total: Decimal

class ValidatePromotionResponse(BaseModel):
    valid: bool
    discount_amount: Decimal
    final_price: Decimal
    message: str | None = None
    promotion: PromotionRead | None = None
