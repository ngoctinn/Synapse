"""
Customer Treatments Module - Service Layer

Handles logic for:
- Creating treatments (purchasing packages)
- Validating usage (check expiry & remaining sessions)
- Punching (deducting sessions)
- Refunding (reverting usage)
"""

import uuid
from datetime import date, datetime, timezone
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends, HTTPException

from src.common.database import get_db_session
from .models import CustomerTreatment, TreatmentStatus
from .schemas import (
    CustomerTreatmentCreate,
    CustomerTreatmentUpdate
)
from .exceptions import TreatmentNotFound, TreatmentExpired, TreatmentOutOfSessions

class CustomerTreatmentService:
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_by_customer(self, customer_id: uuid.UUID) -> list[CustomerTreatment]:
        """Get all treatments for a specific customer."""
        query = select(CustomerTreatment).where(CustomerTreatment.customer_id == customer_id)
        # Order by active first, then created_at desc
        query = query.order_by(CustomerTreatment.status, CustomerTreatment.created_at.desc())
        result = await self.session.exec(query)
        return list(result.all())

    async def get_by_id(self, treatment_id: uuid.UUID) -> CustomerTreatment:
        """Get detailed treatment info."""
        treatment = await self.session.get(CustomerTreatment, treatment_id)
        if not treatment:
            raise TreatmentNotFound()
        return treatment

    async def create(self, data: CustomerTreatmentCreate) -> CustomerTreatment:
        """Create a new treatment (Manual Purchase)."""
        treatment = CustomerTreatment.model_validate(data)
        self.session.add(treatment)
        await self.session.commit()
        await self.session.refresh(treatment)
        return treatment

    async def update(self, treatment_id: uuid.UUID, data: CustomerTreatmentUpdate) -> CustomerTreatment:
        treatment = await self.get_by_id(treatment_id)

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(treatment, key, value)

        treatment.updated_at = datetime.now(timezone.utc)

        # Auto update status if out of sessions?
        if treatment.used_sessions >= treatment.total_sessions:
            treatment.status = TreatmentStatus.COMPLETED

        await self.session.commit()
        await self.session.refresh(treatment)
        return treatment

    # =========================================================================
    # LOGIC CHO BOOKING (Punch Card)
    # =========================================================================

    async def validate_availability(self, treatment_id: uuid.UUID, customer_id: uuid.UUID) -> CustomerTreatment:
        """
        Kiểm tra xem treatment có hợp lệ để sử dụng không.
        - Phải thuộc về customer_id
        - Status == ACTIVE
        - Còn hạn sử dụng
        - Còn session chưa dùng
        """
        treatment = await self.session.get(CustomerTreatment, treatment_id)
        if not treatment:
            raise TreatmentNotFound()

        if treatment.customer_id != customer_id:
            raise HTTPException(status_code=400, detail="Liệu trình không thuộc về khách hàng này.")

        if treatment.status != TreatmentStatus.ACTIVE:
            raise HTTPException(status_code=400, detail=f"Liệu trình đang ở trạng thái {treatment.status}")

        # Check Expiry
        if treatment.expiry_date and treatment.expiry_date < date.today():
             # Mark as expired implicitly or explicitly?
             # For now, just raise error
             raise TreatmentExpired()

        # Check Sessions
        if treatment.used_sessions >= treatment.total_sessions:
            raise TreatmentOutOfSessions()

        return treatment

    async def punch_session(self, treatment_id: uuid.UUID) -> CustomerTreatment:
        """
        Trừ 1 buổi liệu trình.
        Gọi khi Booking COMPLETE.
        """
        # Lock row for update
        stmt = select(CustomerTreatment).where(CustomerTreatment.id == treatment_id).with_for_update()
        result = await self.session.exec(stmt)
        treatment = result.first()

        if not treatment:
             raise TreatmentNotFound()

        if treatment.used_sessions >= treatment.total_sessions:
            raise TreatmentOutOfSessions()

        treatment.used_sessions += 1

        # Check completion
        if treatment.used_sessions >= treatment.total_sessions:
            treatment.status = TreatmentStatus.COMPLETED

        treatment.updated_at = datetime.now(timezone.utc)
        self.session.add(treatment)
        await self.session.commit()
        await self.session.refresh(treatment)
        return treatment

    async def refund_session(self, treatment_id: uuid.UUID) -> CustomerTreatment:
        """
        Hoàn 1 buổi liệu trình (nếu huỷ booking đã complete).
        """
        # Lock row for update
        stmt = select(CustomerTreatment).where(CustomerTreatment.id == treatment_id).with_for_update()
        result = await self.session.exec(stmt)
        treatment = result.first()

        if not treatment:
            raise TreatmentNotFound()

        if treatment.used_sessions > 0:
            treatment.used_sessions -= 1
            # Revert status if it was completed
            if treatment.status == TreatmentStatus.COMPLETED:
                treatment.status = TreatmentStatus.ACTIVE

        treatment.updated_at = datetime.now(timezone.utc)
        self.session.add(treatment)
        await self.session.commit()
        await self.session.refresh(treatment)
        return treatment
