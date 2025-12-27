"""
Settings Module - Business Logic Service
"""

import uuid
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends, HTTPException
from src.common.database import get_db_session
from .models import SystemSetting
from .schemas import SettingCreate, SettingUpdate

class SettingsService:
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_all(self, group: str | None = None) -> list[SystemSetting]:
        query = select(SystemSetting)
        if group:
            query = query.where(SystemSetting.group == group)
        result = await self.session.exec(query)
        return list(result.all())

    async def get_by_key(self, key: str) -> SystemSetting | None:
        return await self.session.get(SystemSetting, key)

    async def create(self, data: SettingCreate, updated_by: uuid.UUID | None = None) -> SystemSetting:
        # Check exists
        existing = await self.get_by_key(data.key)
        if existing:
            raise HTTPException(status_code=400, detail="Setting key already exists")

        setting = SystemSetting.model_validate(data)
        setting.updated_by = updated_by
        self.session.add(setting)
        await self.session.commit()
        await self.session.refresh(setting)
        return setting

    async def update(self, key: str, data: SettingUpdate, updated_by: uuid.UUID | None = None) -> SystemSetting:
        setting = await self.get_by_key(key)
        if not setting:
            raise HTTPException(status_code=404, detail="Setting not found")

        setting.value = data.value
        if data.description is not None:
            setting.description = data.description

        setting.updated_by = updated_by
        self.session.add(setting)
        await self.session.commit()
        await self.session.refresh(setting)
        return setting
