from typing import Annotated
import uuid
from fastapi import Depends
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from src.common.database import get_db_session
from src.modules.services.models import ServiceCategory
from src.modules.services.schemas import ServiceCategoryCreate, ServiceCategoryUpdate
from src.modules.services.exceptions import ServiceCategoryNotFoundError

class CategoryService:
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        self.session = session

    async def get_categories(self) -> list[ServiceCategory]:
        """Lấy danh sách tất cả danh mục dịch vụ."""
        result = await self.session.exec(
            select(ServiceCategory).order_by(ServiceCategory.sort_order.asc())
        )
        return list(result.all())

    async def get_category(self, category_id: uuid.UUID) -> ServiceCategory:
        """Lấy chi tiết một danh mục."""
        category = await self.session.get(ServiceCategory, category_id)
        if not category:
            raise ServiceCategoryNotFoundError(f"Danh mục {category_id} không tồn tại.")
        return category

    async def create_category(self, category_in: ServiceCategoryCreate) -> ServiceCategory:
        """Tạo danh mục mới."""
        category = ServiceCategory.model_validate(category_in)
        self.session.add(category)
        await self.session.commit()
        await self.session.refresh(category)
        return category

    async def update_category(
        self, category_id: uuid.UUID, category_in: ServiceCategoryUpdate
    ) -> ServiceCategory:
        """Cập nhật danh mục."""
        category = await self.get_category(category_id)

        update_data = category_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(category, key, value)

        self.session.add(category)
        await self.session.commit()
        await self.session.refresh(category)
        return category

    async def delete_category(self, category_id: uuid.UUID):
        """Xóa danh mục."""
        category = await self.get_category(category_id)
        await self.session.delete(category)
        await self.session.commit()
