"""
Resources Module - Business Logic Service

Tuân thủ Backend Rules:
- Async All The Way (async def)
- Service as Dependency (inject session)
- Guard Clauses / Early Return
"""

import uuid
from datetime import datetime, timezone
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends, HTTPException, status

from src.common.database import get_db_session
from .models import ResourceGroup, Resource, ServiceResourceRequirement
from .schemas import (
    ResourceGroupCreate,
    ResourceGroupUpdate,
    ResourceCreate,
    ResourceUpdate,
)


class ResourceGroupService:
    """Service xử lý logic nghiệp vụ cho ResourceGroup."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_all(self, include_deleted: bool = False) -> list[ResourceGroup]:
        """Lấy tất cả nhóm tài nguyên."""
        query = select(ResourceGroup)
        if not include_deleted:
            query = query.where(ResourceGroup.deleted_at.is_(None))
        query = query.order_by(ResourceGroup.name)

        result = await self.session.exec(query)
        return list(result.all())

    async def get_by_id(self, group_id: uuid.UUID) -> ResourceGroup | None:
        """Lấy nhóm tài nguyên theo ID."""
        return await self.session.get(ResourceGroup, group_id)

    async def create(self, data: ResourceGroupCreate) -> ResourceGroup:
        """Tạo nhóm tài nguyên mới."""
        group = ResourceGroup.model_validate(data)
        self.session.add(group)
        await self.session.commit()
        await self.session.refresh(group)
        return group

    async def update(
        self, group_id: uuid.UUID, data: ResourceGroupUpdate
    ) -> ResourceGroup:
        """Cập nhật nhóm tài nguyên."""
        group = await self.get_by_id(group_id)

        # Guard clause: không tìm thấy
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy nhóm tài nguyên"
            )

        # Cập nhật các trường có giá trị
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(group, key, value)

        await self.session.commit()
        await self.session.refresh(group)
        return group

    async def soft_delete(self, group_id: uuid.UUID) -> bool:
        """Xóa mềm nhóm tài nguyên."""
        group = await self.get_by_id(group_id)

        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy nhóm tài nguyên"
            )

        group.deleted_at = datetime.now(timezone.utc)
        await self.session.commit()
        return True


class ResourceService:
    """Service xử lý logic nghiệp vụ cho Resource."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_all(
        self,
        group_id: uuid.UUID | None = None,
        include_deleted: bool = False
    ) -> list[Resource]:
        """Lấy tất cả tài nguyên, có thể lọc theo group."""
        query = select(Resource)

        if not include_deleted:
            query = query.where(Resource.deleted_at.is_(None))

        if group_id:
            query = query.where(Resource.group_id == group_id)

        query = query.order_by(Resource.name)
        result = await self.session.exec(query)
        return list(result.all())

    async def get_by_id(self, resource_id: uuid.UUID) -> Resource | None:
        """Lấy tài nguyên theo ID."""
        return await self.session.get(Resource, resource_id)

    async def create(self, data: ResourceCreate) -> Resource:
        """Tạo tài nguyên mới."""
        resource = Resource.model_validate(data)
        self.session.add(resource)
        await self.session.commit()
        await self.session.refresh(resource)
        return resource

    async def update(
        self, resource_id: uuid.UUID, data: ResourceUpdate
    ) -> Resource:
        """Cập nhật tài nguyên."""
        resource = await self.get_by_id(resource_id)

        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy tài nguyên"
            )

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(resource, key, value)

        await self.session.commit()
        await self.session.refresh(resource)
        return resource

    async def soft_delete(self, resource_id: uuid.UUID) -> bool:
        """Xóa mềm tài nguyên."""
        resource = await self.get_by_id(resource_id)

        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy tài nguyên"
            )

        resource.deleted_at = datetime.now(timezone.utc)
        await self.session.commit()
        return True

    async def get_by_group_ids(
        self, group_ids: list[uuid.UUID]
    ) -> dict[uuid.UUID, list[Resource]]:
        """
        Lấy tài nguyên theo danh sách group IDs.

        Returns:
            Dict[group_id, list[Resource]] - Grouped by group_id
        """
        if not group_ids:
            return {}

        query = (
            select(Resource)
            .where(Resource.group_id.in_(group_ids))
            .where(Resource.deleted_at.is_(None))
            .where(Resource.status == "ACTIVE")
        )
        result = await self.session.exec(query)
        resources = result.all()

        # Group by group_id
        grouped: dict[uuid.UUID, list[Resource]] = {}
        for resource in resources:
            if resource.group_id:
                if resource.group_id not in grouped:
                    grouped[resource.group_id] = []
                grouped[resource.group_id].append(resource)

        return grouped
