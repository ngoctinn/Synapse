from typing import Annotated
from fastapi import APIRouter, Depends
from src.modules.users.dependencies import get_current_user
from src.modules.users.models import User
from src.modules.users.schemas import UserRead, UserUpdate, InviteStaffRequest
from src.modules.users.service import UserService
from src.modules.users.constants import UserRole

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


@router.post("/invite", response_model=UserRead)
async def invite_staff(
    invite_request: "InviteStaffRequest",
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserService, Depends(UserService)]
):
    """
    Mời nhân viên mới tham gia hệ thống.
    Chỉ dành cho Quản lý (Manager).
    """
    # Kiểm tra quyền Manager
    if current_user.role != UserRole.MANAGER:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện thao tác này"
        )

    return await service.invite_staff(invite_request)
