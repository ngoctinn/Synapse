from typing import Annotated
from fastapi import Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from src.common.auth_core import get_token_payload
from src.app.dependencies import get_db_session
from src.modules.users.models import User

async def get_current_user(
    payload: Annotated[dict, Depends(get_token_payload)],
    session: Annotated[AsyncSession, Depends(get_db_session)]
) -> User:
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Không thể xác thực thông tin đăng nhập", # Could not validate credentials
        )

    user = await session.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại", # User not found
        )
    return user
