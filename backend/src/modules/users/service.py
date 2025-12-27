"""
Users Module - Business Logic (Service Layer)

Quản lý hồ sơ người dùng, phân quyền và tích hợp với Supabase Auth.
"""

from typing import Annotated
import uuid
from fastapi import Depends
from starlette.concurrency import run_in_threadpool
from sqlmodel.ext.asyncio.session import AsyncSession
from src.common.database import get_db_session
from src.modules.users.models import User
from sqlmodel import select, func, or_, col
from src.common.supabase_admin import get_supabase_admin
from src.modules.users.schemas import UserUpdate, UserFilter, UserListResponse
from src.modules.users.exceptions import UserNotFound, UserOperationError

class UserService:
    """
    Service xử lý các nghiệp vụ cốt lõi về người dùng.
    """
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        self.session = session

    async def get_profile(self, user_id: uuid.UUID) -> User:
        """
        Lấy hồ sơ người dùng theo ID.

        Args:
            user_id (uuid.UUID): ID người dùng.

        Returns:
            User: Object User tìm thấy.

        Raises:
            UserNotFound: Nếu không tìm thấy user.
        """
        user = await self.session.get(User, user_id)
        if not user:
            raise UserNotFound("Người dùng không tồn tại")
        return user

    async def update_profile(self, user: User, user_update: UserUpdate) -> User:
        """
        Cập nhật hồ sơ người dùng.

        Lưu ý: Từ v2.2, bảng users chỉ chứa thông tin Auth (email, role).
        Thông tin cá nhân (phone, address...) được quản lý ở bảng customers hoặc staff.
        """
        # Update user fields
        user_data = user_update.model_dump(exclude_unset=True)
        for key, value in user_data.items():
            setattr(user, key, value)

        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)

        return user

    async def get_users(self, filter: UserFilter) -> UserListResponse:
        """Lấy danh sách người dùng (có phân trang & lọc)."""
        query = select(User)

        if filter.role:
            query = query.where(User.role == filter.role)

        if filter.search:
            search_term = f"%{filter.search}%"
            query = query.where(
                or_(
                    col(User.full_name).ilike(search_term),
                    col(User.email).ilike(search_term)
                )
            )

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total = await self.session.exec(count_query)
        total_count = total.one()

        # Pagination
        offset = (filter.page - 1) * filter.limit
        query = query.offset(offset).limit(filter.limit)

        result = await self.session.exec(query)
        users = result.all()

        total_pages = (total_count + filter.limit - 1) // filter.limit

        return UserListResponse(
            data=users,
            total=total_count,
            page=filter.page,
            limit=filter.limit,
            total_pages=total_pages
        )

    async def update_user(self, user_id: uuid.UUID, user_update: UserUpdate) -> User:
        """Admin cập nhật thông tin người dùng."""
        user = await self.get_profile(user_id)
        return await self.update_profile(user, user_update)

    async def delete_user(self, user_id: uuid.UUID) -> None:
        """Xóa người dùng (Khỏi Supabase Auth & DB)."""
        user = await self.get_profile(user_id)

        # 1. Delete from Supabase Auth
        supabase = get_supabase_admin()

        try:
            await run_in_threadpool(
                supabase.auth.admin.delete_user,
                user_id=str(user_id)
            )
        except Exception as e:
            raise UserOperationError(f"Lỗi khi xóa người dùng trên Supabase: {str(e)}")

        # 2. Delete from DB
        await self.session.delete(user)
        await self.session.commit()
