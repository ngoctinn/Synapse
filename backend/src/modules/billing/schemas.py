"""
Billing Module - Pydantic Schemas
"""
import uuid
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel
from .models import InvoiceStatus, PaymentMethod

# =========================================================================
# PAYMENT SCHEMAS
# =========================================================================

class PaymentBase(BaseModel):
    amount: Decimal
    payment_method: PaymentMethod = PaymentMethod.CASH
    transaction_reference: str | None = None

class PaymentCreate(PaymentBase):
    invoice_id: uuid.UUID

class PaymentRead(PaymentBase):
    id: uuid.UUID
    invoice_id: uuid.UUID
    payment_date: datetime

# =========================================================================
# INVOICE SCHEMAS
# =========================================================================

class InvoiceBase(BaseModel):
    booking_id: uuid.UUID | None = None
    customer_id: uuid.UUID
    total_amount: Decimal
    discount_amount: Decimal = Decimal("0")
    final_amount: Decimal
    status: InvoiceStatus = InvoiceStatus.UNPAID
    notes: str | None = None

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    status: InvoiceStatus | None = None
    discount_amount: Decimal | None = None
    final_amount: Decimal | None = None
    notes: str | None = None

class InvoiceRead(InvoiceBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    payments: list[PaymentRead] = []

class InvoiceListResponse(BaseModel):
    data: list[InvoiceRead]
    total: int
    page: int
    limit: int
