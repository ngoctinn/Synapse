"""
Promotions Module - Database Models

Định nghĩa Entity cho chương trình khuyến mãi và mã giảm giá.
"""

import uuid
from datetime import date, datetime, timezone
from enum import Enum
from decimal import Decimal
from sqlmodel import SQLModel, Field, Column, DECIMAL, DateTime


class DiscountType(str, Enum):
    """Loại giảm giá."""
    PERCENTAGE = "PERCENTAGE"       # Giảm theo phần trăm
    FIXED_AMOUNT = "FIXED_AMOUNT"   # Giảm số tiền cố định


class Promotion(SQLModel, table=True):
    """
    Chương trình khuyến mãi / Mã giảm giá.
    """
    __tablename__ = "promotions"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    code: str = Field(unique=True, index=True, max_length=50)
    name: str = Field(max_length=255)
    description: str | None = Field(default=None)

    discount_type: DiscountType = Field(sa_column_kwargs={"nullable": False})
    discount_value: Decimal = Field(default=0, sa_column=Column(DECIMAL(12, 2), nullable=False))

    min_order_value: Decimal = Field(default=0, sa_column=Column(DECIMAL(12, 2), default=0))
    max_uses: int | None = Field(default=None, description="NULL = Unlimited")
    current_uses: int = Field(default=0)

    valid_from: date = Field(nullable=False)
    valid_until: date = Field(nullable=False)

    is_active: bool = Field(default=True)
    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Note: SQLModel chưa hỗ trợ CheckConstraint trực tiếp trong class body dễ dàng
    # nên ta định nghĩa __table_args__ nếu cần, nhưng DB schema đã có rồi.
