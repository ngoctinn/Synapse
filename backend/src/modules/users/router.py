from typing import Annotated
from fastapi import APIRouter, Depends
from src.common.security import get_current_user
from src.modules.users.models import User
from src.modules.users.schemas import UserRead, UserUpdate
from src.modules.users.service import UserService

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserRead)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Lấy thông tin hồ sơ của người dùng hiện tại.
    """
    return current_user

@router.put("/me", response_model=UserRead)
async def update_user_me(
    user_update: UserUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserService, Depends(UserService)]
):
    """
    Cập nhật thông tin hồ sơ của người dùng hiện tại.
    """
    return await service.update_profile(current_user, user_update)

