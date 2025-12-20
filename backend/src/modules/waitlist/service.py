"""
Waitlist Module - Service
"""

import uuid
from datetime import datetime
from sqlmodel import select, desc
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends, HTTPException

from src.common.database import get_db_session
from .models import WaitlistEntry, WaitlistStatus
from .schemas import WaitlistEntryCreate, WaitlistEntryUpdate, WaitlistEntryRead, WaitlistEntryListResponse

class WaitlistService:
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_all(self, status: WaitlistStatus | None = None) -> WaitlistEntryListResponse:
        query = select(WaitlistEntry)
        if status:
            query = query.where(WaitlistEntry.status == status)
        query = query.order_by(desc(WaitlistEntry.created_at))

        result = await self.session.exec(query)
        entries = result.all()

        return WaitlistEntryListResponse(
            items=[WaitlistEntryRead.model_validate(e) for e in entries],
            total=len(entries)
        )

    async def create(self, data: WaitlistEntryCreate) -> WaitlistEntryRead:
        entry = WaitlistEntry.model_validate(data)
        self.session.add(entry)
        await self.session.commit()
        await self.session.refresh(entry)
        return WaitlistEntryRead.model_validate(entry)

    async def update(self, id: uuid.UUID, data: WaitlistEntryUpdate) -> WaitlistEntryRead:
        query = select(WaitlistEntry).where(WaitlistEntry.id == id)
        result = await self.session.exec(query)
        entry = result.first()
        if not entry:
            raise HTTPException(status_code=404, detail="Waitlist entry not found")

        values = data.model_dump(exclude_unset=True)
        for k, v in values.items():
            setattr(entry, k, v)

        entry.updated_at = datetime.now()
        self.session.add(entry)
        await self.session.commit()
        await self.session.refresh(entry)
        return WaitlistEntryRead.model_validate(entry)

    async def delete(self, id: uuid.UUID) -> None:
        query = select(WaitlistEntry).where(WaitlistEntry.id == id)
        result = await self.session.exec(query)
        entry = result.first()
        if not entry:
             raise HTTPException(status_code=404, detail="Waitlist entry not found")

        await self.session.delete(entry)
        await self.session.commit()
