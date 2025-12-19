"""
Billing Module - Database Models
"""
import uuid
from datetime import datetime, timezone
from enum import Enum
from decimal import Decimal
from sqlmodel import SQLModel, Field, DateTime, Relationship
from pydantic import ConfigDict

class InvoiceStatus(str, Enum):
    DRAFT = "DRAFT"
    UNPAID = "UNPAID"
    PARTIALLY_PAID = "PARTIALLY_PAID"
    PAID = "PAID"
    VOID = "VOID"

class PaymentMethod(str, Enum):
    CASH = "CASH"
    BANK_TRANSFER = "BANK_TRANSFER"
    CREDIT_CARD = "CREDIT_CARD"
    E_WALLET = "E_WALLET"

class Invoice(SQLModel, table=True):
    __tablename__ = "invoices"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    booking_id: uuid.UUID | None = Field(default=None, foreign_key="bookings.id")
    customer_id: uuid.UUID = Field(foreign_key="customers.id")

    total_amount: Decimal = Field(default=Decimal("0"), decimal_places=2)
    discount_amount: Decimal = Field(default=Decimal("0"), decimal_places=2)
    final_amount: Decimal = Field(default=Decimal("0"), decimal_places=2)

    status: InvoiceStatus = Field(default=InvoiceStatus.UNPAID)
    notes: str | None = None

    # Timestamps
    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    payments: list["Payment"] = Relationship(back_populates="invoice")

    model_config = ConfigDict(from_attributes=True)

class Payment(SQLModel, table=True):
    __tablename__ = "payments"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    invoice_id: uuid.UUID = Field(foreign_key="invoices.id")

    amount: Decimal = Field(decimal_places=2)
    payment_method: PaymentMethod = Field(default=PaymentMethod.CASH)
    transaction_reference: str | None = None # Mã giao dịch ngân hàng/ví

    payment_date: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationship
    invoice: Invoice = Relationship(back_populates="payments")

    model_config = ConfigDict(from_attributes=True)
