from typing import Annotated
import uuid
from fastapi import Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from src.app.dependencies import get_db_session
from src.modules.users.models import User
from src.modules.users.schemas import UserUpdate

class UserService:
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        self.session = session

    async def get_profile(self, user_id: uuid.UUID) -> User:
        """
        Lấy thông tin hồ sơ người dùng.
        """
        user = await self.session.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Người dùng không tồn tại"
            )
        return user

    async def update_profile(self, user: User, user_update: UserUpdate) -> User:
        """
        Cập nhật thông tin hồ sơ người dùng.
        """
        user_data = user_update.model_dump(exclude_unset=True)
        for key, value in user_data.items():
            setattr(user, key, value)

        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user
