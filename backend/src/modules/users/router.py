from typing import Annotated
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from src.modules.users.dependencies import get_current_user
from src.modules.users.models import User
from src.modules.users.schemas import UserRead, UserUpdate, InviteStaffRequest
from src.modules.users.service import UserService
from pydantic import BaseModel
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

@router.post("/invite", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def invite_staff(
    invite_request: InviteStaffRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserService, Depends(UserService)]
):
    """
    Mời nhân viên mới tham gia hệ thống.
    Chỉ dành cho Quản lý (Manager).
    """
    # Kiểm tra quyền Manager
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện thao tác này"
        )

    return await service.invite_staff(invite_request)

class UpdateSkillsRequest(BaseModel):
    skill_ids: list[uuid.UUID]

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
