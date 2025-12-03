from typing import Annotated
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from src.modules.users.dependencies import get_current_user
from src.modules.users.models import User
from src.modules.users.schemas import UserRead, UserUpdate, UserFilter, UserListResponse, UpdateSkillsRequest
from src.modules.users.constants import UserRole
from src.modules.users.exceptions import UserNotFound, UserAlreadyExists, UserOperationError
from src.modules.users.service import UserService

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserRead)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Lấy thông tin hồ sơ của người dùng hiện tại.

    - **Permissions**: Authenticated User.
    - **Output**: Thông tin chi tiết của user đang đăng nhập.
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





@router.put("/{user_id}/skills", status_code=status.HTTP_200_OK)
async def update_skills(
    user_id: uuid.UUID,
    request: UpdateSkillsRequest,
    service: Annotated[UserService, Depends(UserService)]
):
    """
    Cập nhật danh sách kỹ năng cho nhân viên.
    """
    await service.update_skills(user_id, request.skill_ids)
    return {"message": "Cập nhật kỹ năng thành công"}

@router.get("", response_model=UserListResponse)
async def get_users(
    user_filter: Annotated[UserFilter, Depends()],
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserService, Depends(UserService)]
):
    """
    Lấy danh sách nhân viên (Admin/Manager).
    """
    # TODO: Check permission (Admin/Manager only)
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xem danh sách nhân viên"
        )
    return await service.get_users(user_filter)

@router.get("/{user_id}", response_model=UserRead)
async def get_user_detail(
    user_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserService, Depends(UserService)]
):
    """
    Xem chi tiết nhân viên (Admin/Manager).
    """
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xem thông tin này"
        )
    try:
        return await service.get_profile(user_id)
    except UserNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)

@router.put("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: uuid.UUID,
    user_update: UserUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserService, Depends(UserService)]
):
    """
    Cập nhật thông tin nhân viên (Admin/Manager).
    """
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền cập nhật thông tin này"
        )
    try:
        return await service.update_user(user_id, user_update)
    except UserNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserService, Depends(UserService)]
):
    """
    Xóa nhân viên (Admin Only).
    """
    if current_user.role != UserRole.ADMIN:
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chỉ Admin mới có quyền xóa nhân viên"
        )
    try:
        await service.delete_user(user_id)
    except UserNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)
    except UserOperationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.detail)
