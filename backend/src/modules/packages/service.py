from typing import Annotated
import uuid
from fastapi import Depends, HTTPException, status
from sqlmodel import select, delete
from sqlalchemy.orm import selectinload
from sqlmodel.ext.asyncio.session import AsyncSession
from src.common.database import get_db_session
from .models import ServicePackage, PackageService
from .schemas import PackageCreate, PackageUpdate

class PackageManagementService:
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        self.session = session

    async def get_packages(
        self,
        skip: int = 0,
        limit: int = 100,
        search: str | None = None,
        is_active: bool | None = None
    ) -> tuple[list[ServicePackage], int]:
        query = select(ServicePackage).options(
            selectinload(ServicePackage.services).selectinload(PackageService.service)
        )

        if search:
            query = query.where(ServicePackage.name.ilike(f"%{search}%"))

        if is_active is not None:
            query = query.where(ServicePackage.is_active == is_active)

        # Count total
        from sqlmodel import func
        count_query = select(func.count()).select_from(ServicePackage)
        if search:
            count_query = count_query.where(ServicePackage.name.ilike(f"%{search}%"))
        if is_active is not None:
            count_query = count_query.where(ServicePackage.is_active == is_active)

        total_count_result = await self.session.exec(count_query)
        total = total_count_result.one()

        query = query.offset(skip).limit(limit).order_by(ServicePackage.created_at.desc())

        result = await self.session.exec(query)
        return list(result.all()), total

    async def get_package(self, package_id: uuid.UUID) -> ServicePackage:
        query = select(ServicePackage).where(ServicePackage.id == package_id).options(
            selectinload(ServicePackage.services).selectinload(PackageService.service)
        )
        result = await self.session.exec(query)
        package = result.first()

        if not package:
            raise HTTPException(status_code=404, detail="Không tìm thấy gói dịch vụ")
        return package

    async def create_package(self, package_in: PackageCreate) -> ServicePackage:
        # 1. Tạo bản ghi package chính
        package_data = package_in.model_dump(exclude={"services"})
        package = ServicePackage.model_validate(package_data)
        self.session.add(package)
        await self.session.flush() # Để lấy ID

        # 2. Tạo các liên kết services
        for item in package_in.services:
            link = PackageService(
                package_id=package.id,
                service_id=item.service_id,
                quantity=item.quantity
            )
            self.session.add(link)

        await self.session.commit()
        await self.session.refresh(package)
        return package

    async def update_package(self, package_id: uuid.UUID, package_in: PackageUpdate) -> ServicePackage:
        package = await self.get_package(package_id)

        update_data = package_in.model_dump(exclude_unset=True, exclude={"services"})
        for key, value in update_data.items():
            setattr(package, key, value)

        # Cập nhật thời gian
        from datetime import datetime, timezone
        package.updated_at = datetime.now(timezone.utc)

        # Nếu có cập nhật danh sách dịch vụ
        if package_in.services is not None:
            # Xóa cũ
            await self.session.exec(
                delete(PackageService).where(PackageService.package_id == package_id)
            )
            # Thêm mới
            for item in package_in.services:
                link = PackageService(
                    package_id=package_id,
                    service_id=item.service_id,
                    quantity=item.quantity
                )
                self.session.add(link)

        await self.session.commit()
        await self.session.refresh(package)
        return package

    async def delete_package(self, package_id: uuid.UUID):
        package = await self.get_package(package_id)
        await self.session.delete(package)
        await self.session.commit()
