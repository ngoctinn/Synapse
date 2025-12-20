"""
Warranty Module - Service
"""

import uuid
from datetime import datetime
from sqlmodel import select, desc
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends, HTTPException

from src.common.database import get_db_session
from .models import WarrantyTicket, WarrantyStatus
from .schemas import WarrantyTicketCreate, WarrantyTicketUpdate, WarrantyTicketRead, WarrantyListResponse

class WarrantyService:
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_all(self, customer_id: uuid.UUID | None = None) -> WarrantyListResponse:
        query = select(WarrantyTicket)
        if customer_id:
            query = query.where(WarrantyTicket.customer_id == customer_id)
        query = query.order_by(desc(WarrantyTicket.created_at))

        result = await self.session.exec(query)
        tickets = result.all()

        return WarrantyListResponse(
            items=[WarrantyTicketRead.model_validate(t) for t in tickets],
            total=len(tickets)
        )

    async def create(self, data: WarrantyTicketCreate) -> WarrantyTicketRead:
        ticket = WarrantyTicket.model_validate(data)
        self.session.add(ticket)
        await self.session.commit()
        await self.session.refresh(ticket)
        return WarrantyTicketRead.model_validate(ticket)

    async def update(self, id: uuid.UUID, data: WarrantyTicketUpdate) -> WarrantyTicketRead:
        ticket = await self.session.get(WarrantyTicket, id)
        if not ticket:
             raise HTTPException(status_code=404, detail="Warranty ticket not found")

        values = data.model_dump(exclude_unset=True)
        for k, v in values.items():
            setattr(ticket, k, v)

        if data.status in [WarrantyStatus.RESOLVED, WarrantyStatus.REJECTED, WarrantyStatus.APPROVED]:
            ticket.resolved_at = datetime.now()

        self.session.add(ticket)
        await self.session.commit()
        await self.session.refresh(ticket)
        return WarrantyTicketRead.model_validate(ticket)

    async def get_by_id(self, id: uuid.UUID) -> WarrantyTicketRead:
        ticket = await self.session.get(WarrantyTicket, id)
        if not ticket:
             raise HTTPException(status_code=404, detail="Warranty ticket not found")
        return WarrantyTicketRead.model_validate(ticket)
