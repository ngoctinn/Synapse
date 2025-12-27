"""
Billing Module - Service Layer
"""
import uuid
from datetime import datetime, timezone
from decimal import Decimal
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends, HTTPException
from sqlalchemy.orm import selectinload

from src.common.database import get_db_session
from .models import Invoice, Payment, InvoiceStatus
from .schemas import (
    InvoiceCreate, InvoiceUpdate,
    PaymentCreate
)

class BillingService:
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_invoice_by_id(self, invoice_id: uuid.UUID) -> Invoice:
        query = select(Invoice).where(Invoice.id == invoice_id).options(selectinload(Invoice.payments))
        result = await self.session.exec(query)
        invoice = result.first()
        if not invoice:
            raise HTTPException(status_code=404, detail="Không tìm thấy hóa đơn")
        return invoice

    async def create_invoice(self, data: InvoiceCreate) -> Invoice:
        invoice = Invoice.model_validate(data)
        self.session.add(invoice)
        await self.session.commit()
        await self.session.refresh(invoice)
        return await self.get_invoice_by_id(invoice.id)

    async def update_invoice(self, invoice_id: uuid.UUID, data: InvoiceUpdate) -> Invoice:
        invoice = await self.get_invoice_by_id(invoice_id)

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(invoice, key, value)

        invoice.updated_at = datetime.now(timezone.utc)
        self.session.add(invoice)
        await self.session.commit()
        await self.session.refresh(invoice)
        return invoice

    async def process_payment(self, data: PaymentCreate) -> Payment:
        # Use explicit transaction with locking to prevent race conditions
        # select ... for update
        stmt = (
            select(Invoice)
            .where(Invoice.id == data.invoice_id)
            .options(selectinload(Invoice.payments))
            .with_for_update()
        )

        result = await self.session.exec(stmt)
        invoice = result.first()

        if not invoice:
            raise HTTPException(status_code=404, detail="Không tìm thấy hóa đơn")

        # Create payment record
        payment = Payment.model_validate(data)
        self.session.add(payment)

        # Calculate new status for invoice
        # Query total paid via DB instead of loading all payment objects
        sum_stmt = select(func.sum(Payment.amount)).where(Payment.invoice_id == invoice.id)
        current_paid_result = await self.session.exec(sum_stmt)
        current_paid = current_paid_result.one() or Decimal("0")

        total_paid = current_paid + data.amount

        if total_paid >= invoice.final_amount:
            invoice.status = InvoiceStatus.PAID
        elif total_paid > 0:
            invoice.status = InvoiceStatus.PARTIALLY_PAID

        invoice.updated_at = datetime.now(timezone.utc)
        self.session.add(invoice)

        await self.session.commit()
        await self.session.refresh(payment)
        return payment

    # Helper for Bookings
    async def create_invoice_from_booking(self, booking_id: uuid.UUID) -> Invoice:
        # Import Booking inside to avoid circular dependencies if any
        from src.modules.bookings.models import Booking

        query = select(Booking).where(Booking.id == booking_id).options(selectinload(Booking.items))
        result = await self.session.exec(query)
        booking = result.first()

        if not booking:
            raise HTTPException(status_code=404, detail="Không tìm thấy lịch hẹn để tạo hóa đơn")

        # Check if invoice already exists
        exist_query = select(Invoice).where(Invoice.booking_id == booking_id)
        existing = (await self.session.exec(exist_query)).first()
        if existing:
            return existing

        invoice = Invoice(
            booking_id=booking_id,
            customer_id=booking.customer_id,
            total_amount=booking.total_price,
            final_amount=booking.total_price, # Default no discount
            status=InvoiceStatus.UNPAID,
            notes=f"Hóa đơn cho lịch hẹn {booking_id}"
        )

        self.session.add(invoice)
        await self.session.commit()
        await self.session.refresh(invoice)
        return invoice
