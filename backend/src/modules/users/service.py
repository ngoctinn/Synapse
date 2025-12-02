from typing import Annotated
import uuid
from datetime import datetime, timezone
from fastapi import Depends, HTTPException, status
from starlette.concurrency import run_in_threadpool
from sqlmodel.ext.asyncio.session import AsyncSession
from src.common.database import get_db_session
from src.modules.users.models import User
from src.modules.users.models import UserSkill
from sqlmodel import select, delete, func, or_, col
from supabase import create_client, Client
from src.app.config import settings
from src.modules.users.schemas import UserUpdate, InviteStaffRequest, UserFilter, UserListResponse

class UserService:
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        self.session = session

    async def get_profile(self, user_id: uuid.UUID) -> User:
        """Lấy hồ sơ người dùng."""
        user = await self.session.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Người dùng không tồn tại"
            )
        return user

    async def update_profile(self, user: User, user_update: UserUpdate) -> User:
        """Cập nhật hồ sơ người dùng."""
        user_data = user_update.model_dump(exclude_unset=True)
        for key, value in user_data.items():
            setattr(user, key, value)

        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def invite_staff(self, invite_data: "InviteStaffRequest") -> User:
        """Mời nhân viên mới (Supabase Admin API)."""
        # 1. Init Supabase Admin Client
        supabase: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )

        # 2. Prepare Metadata
        user_metadata = {
            "full_name": invite_data.full_name,
            "phone_number": invite_data.phone_number,
            "role": invite_data.role,
            "address": invite_data.address,
            "date_of_birth": str(invite_data.date_of_birth) if invite_data.date_of_birth else None
        }

        # 3. Call Supabase Invite API
        try:
            response = await run_in_threadpool(
                supabase.auth.admin.invite_user_by_email,
                email=invite_data.email,
                options={"data": user_metadata}
            )
            user_id = uuid.UUID(response.user.id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Lỗi khi gửi lời mời: {str(e)}"
            )

        # 4. Handle Skills (Technician)
        if invite_data.role == "technician" and invite_data.skill_ids:
            for skill_id in invite_data.skill_ids:
                user_skill = UserSkill(user_id=user_id, skill_id=skill_id)
                self.session.add(user_skill)
            await self.session.commit()

        # 5. Return User (Query DB with fallback)
        user = await self.session.get(User, user_id)
        if not user:
             # Fallback: Return temp object if trigger hasn't finished
             return User(
                 id=user_id,
                 email=invite_data.email,
                 full_name=invite_data.full_name,
                 role=invite_data.role,
                 phone_number=invite_data.phone_number,
                 avatar_url=None,
                 created_at=datetime.now(timezone.utc),
                 updated_at=datetime.now(timezone.utc)
             )
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
                    col(User.email).ilike(search_term),
                    col(User.phone_number).ilike(search_term)
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
        supabase: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )

        try:
            await run_in_threadpool(
                supabase.auth.admin.delete_user,
                user_id=str(user_id)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Lỗi khi xóa người dùng trên Supabase: {str(e)}"
            )

        # 2. Delete from DB
        await self.session.delete(user)
        await self.session.commit()
