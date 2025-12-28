"""
Services Module - Business Logic (Service Layer)

Quản lý danh mục dịch vụ, kỹ năng và quy trình Smart Tagging.
"""

from typing import Annotated
import uuid
import re
import unicodedata
from datetime import datetime, timezone
from fastapi import Depends
from sqlmodel import select, func, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from sqlmodel.ext.asyncio.session import AsyncSession
from src.common.database import get_db_session
from src.modules.services.models import Service, Skill, ServiceSkill
from src.modules.resources.models import ServiceResourceRequirement
from src.modules.services.schemas import ServiceCreate, ServiceUpdate
from src.modules.services.exceptions import ServiceNotFoundError

def simple_slugify(text: str) -> str:
    """Helper: Chuyển đổi chuỗi thành slug đơn giản (không dấu, snake_case)."""
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '_', text)

class ServiceManagementService:
    """
    Service quản lý danh mục dịch vụ và kỹ năng đi kèm.
    """
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        self.session = session

    # --- SERVICES ---
    async def get_services(
        self,
        skip: int = 0,
        limit: int = 100,
        search: str | None = None,
        only_active: bool = False
    ) -> tuple[list[Service], int]:
        """
        Lấy danh sách dịch vụ (có phân trang & lọc).

        Args:
            skip (int): Số bản ghi bỏ qua.
            limit (int): Số bản ghi tối đa.
            search (str | None): Từ khóa tìm kiếm (tên dịch vụ).
            only_active (bool): Chỉ lấy dịch vụ đang hoạt động.

        Returns:
            tuple[list[Service], int]: Danh sách dịch vụ và tổng số bản ghi.
        """
        query = select(Service).options(
            selectinload(Service.skills),
            selectinload(Service.category),
            selectinload(Service.resource_requirements)
        )

        if only_active:
            query = query.where(Service.is_active)

        if search:
            # Tìm kiếm theo tên dịch vụ (case-insensitive)
            query = query.where(Service.name.ilike(f"%{search}%"))

        # Count total
        count_query = select(func.count()).select_from(Service)
        if only_active:
            count_query = count_query.where(Service.is_active)
        if search:
            count_query = count_query.where(Service.name.ilike(f"%{search}%"))

        total = await self.session.exec(count_query)
        total_count = total.one()

        # Pagination
        query = query.offset(skip).limit(limit)

        result = await self.session.exec(query)
        services = result.all()

        return list(services), total_count

    async def get_service(self, service_id: uuid.UUID) -> Service:
        """
        Lấy chi tiết dịch vụ.

        Args:
            service_id (uuid.UUID): ID dịch vụ.

        Returns:
            Service: Dịch vụ tìm thấy.

        Raises:
            ServiceNotFoundError: Nếu không tìm thấy dịch vụ.
        """
        query = select(Service).where(Service.id == service_id).options(
            selectinload(Service.skills),
            selectinload(Service.category),
            selectinload(Service.resource_requirements)
        )
        result = await self.session.exec(query)
        service = result.first()

        if not service:
            raise ServiceNotFoundError(f"Dịch vụ {service_id} không tồn tại.")

        return service


    async def create_service(self, service_in: ServiceCreate) -> Service:
        """
        Tạo dịch vụ mới kèm gán kỹ năng và tài nguyên.
        """
        # 1. Create Service
        service_data = service_in.model_dump(exclude={"skill_ids", "resource_requirements"})
        service = Service(**service_data)
        self.session.add(service)
        await self.session.flush()

        # 2. Sync Skills
        if service_in.skill_ids:
            links = [
                ServiceSkill(service_id=service.id, skill_id=skill_id)
                for skill_id in set(service_in.skill_ids)
            ]
            self.session.add_all(links)

        # 3. Sync Resource Requirements
        if service_in.resource_requirements:
            reqs = [
                ServiceResourceRequirement(
                    service_id=service.id,
                    group_id=req.group_id,
                    quantity=req.quantity,
                    start_delay=req.start_delay,
                    usage_duration=req.usage_duration
                )
                for req in service_in.resource_requirements
            ]
            self.session.add_all(reqs)

        await self.session.commit()
        await self.session.refresh(service)
        return await self.get_service(service.id)

    async def update_service(self, service_id: uuid.UUID, service_in: ServiceUpdate) -> Service:
        """
        Cập nhật dịch vụ (Atomic Sync cho Skills và Resources).
        """
        service = await self.get_service(service_id)

        # Update basic fields
        update_data = service_in.model_dump(exclude_unset=True, exclude={"skill_ids", "resource_requirements"})
        for key, value in update_data.items():
            setattr(service, key, value)

        # Atomic Sync Skills
        if service_in.skill_ids is not None:
            # Delete old
            await self.session.exec(
                delete(ServiceSkill).where(ServiceSkill.service_id == service_id)
            )
            # Insert new
            if service_in.skill_ids:
                links = [
                    ServiceSkill(service_id=service_id, skill_id=skill_id)
                    for skill_id in set(service_in.skill_ids)
                ]
                self.session.add_all(links)

        # Atomic Sync Resource Requirements
        if service_in.resource_requirements is not None:
            # Delete old
            await self.session.exec(
                delete(ServiceResourceRequirement).where(ServiceResourceRequirement.service_id == service_id)
            )
            # Insert new
            if service_in.resource_requirements:
                reqs = [
                    ServiceResourceRequirement(
                        service_id=service_id,
                        group_id=req.group_id,
                        quantity=req.quantity,
                        start_delay=req.start_delay,
                        usage_duration=req.usage_duration
                    )
                    for req in service_in.resource_requirements
                ]
                self.session.add_all(reqs)

        self.session.add(service)
        await self.session.commit()
        await self.session.refresh(service)
        return await self.get_service(service.id)

    async def delete_service(self, service_id: uuid.UUID):
        """
        Xóa (ẩn) dịch vụ.

        Args:
            service_id (uuid.UUID): ID dịch vụ.

        Raises:
            ServiceNotFoundError: Nếu không tìm thấy dịch vụ.
        """
        service = await self.session.get(Service, service_id)
        if not service:
            raise ServiceNotFoundError(f"Dịch vụ {service_id} không tồn tại.")

        # Soft delete
        service.is_active = False
        service.deleted_at = datetime.now(timezone.utc)
        self.session.add(service)
        await self.session.commit()
