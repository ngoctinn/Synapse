from typing import Annotated
import uuid
from datetime import datetime, timezone
from fastapi import Depends, HTTPException, status
from starlette.concurrency import run_in_threadpool
from sqlmodel.ext.asyncio.session import AsyncSession
from src.common.database import get_db_session
from src.modules.users.models import User
from src.modules.users.schemas import UserUpdate, InviteStaffRequest
from supabase import create_client, Client
from src.app.config import settings

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
            # TODO: Implement skill insertion
            pass

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
