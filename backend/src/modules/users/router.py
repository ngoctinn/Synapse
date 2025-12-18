"""
Users Module - API Endpoints

Cung cấp các API quản lý thông tin tài khoản, hồ sơ người dùng và phân quyền.
"""

from typing import Annotated
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from .dependencies import get_current_user
from .models import User
from .schemas import UserRead, UserUpdate, UserFilter, UserListResponse
from .constants import UserRole
from .exceptions import UserNotFound, UserOperationError
from .service import UserService

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserRead)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    **Lấy thông tin hồ sơ của người dùng hiện tại.**

    Truy vấn thông tin chi tiết của tài khoản đang thực hiện request dựa trên Token xác thực.

    ### Logic Flow:
    1. Trích xuất thông tin User từ `get_current_user` dependency.
    2. Trả về object User đầy đủ.

    ### Tham số đầu vào:
    - **current_user**: Tự động lấy từ JWT token trong Header.

    ### Lỗi có thể xảy ra:
    - `401 Unauthorized`: Token không hợp lệ hoặc đã hết hạn.
    """
    return current_user

@router.put("/me", response_model=UserRead)
async def update_user_me(
    user_update: UserUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserService, Depends(UserService)]
):
    """
    **Cập nhật hồ sơ cá nhân.**

    Cho phép người dùng tự cập nhật các thông tin cơ bản của mình (Full name, Avatar, Phone, etc.).

    ### Logic Flow:
    1. Kiểm tra session và quyền của người dùng hiện tại.
    2. Cập nhật các trường dữ liệu được gửi lên (Partial update).
    3. Lưu thay đổi vào Database.

    ### Tham số đầu vào:
    - **user_update**: Body chứa các trường cần cập nhật (Optional).

    ### Lỗi có thể xảy ra:
    - `401 Unauthorized`: Tài khoản chưa đăng nhập.
    - `400 Bad Request`: Dữ liệu gửi lên không hợp lệ.
    """
    return await service.update_profile(current_user, user_update)

@router.get("", response_model=UserListResponse)
async def get_users(
    user_filter: Annotated[UserFilter, Depends()],
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserService, Depends(UserService)]
):
    """
    **Lấy danh sách người dùng hệ thống.**

    Hỗ trợ tìm kiếm, lọc theo vai trò và phân trang. Yêu cầu quyền Quản trị hoặc Quản lý.

    ### Logic Flow:
    1. Kiểm tra quyền (Role Check): Chỉ `ADMIN` hoặc `MANAGER`.
    2. Áp dụng các bộ lọc (Search term, Role).
    3. Thực hiện phân trang (Limit/Offset).
    4. Trả về danh sách kèm thông tin Meta (Total count, current page).

    ### Tham số đầu vào (Query Results):
    - **role**: Lọc theo vai trò (optional).
    - **search**: Tìm kiếm theo tên hoặc email (optional).
    - **page**: Số trang (mặc định 1).
    - **limit**: Số lượng bàn ghi (mặc định 10).

    ### Bảo mật:
    - Yêu cầu: `current_user.role` thuộc `[ADMIN, MANAGER]`.

    ### Lỗi có thể xảy ra:
    - `403 Forbidden`: Người dùng không có quyền truy cập.
    """
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện hành động này"
        )
    return await service.get_users(user_filter)

@router.get("/{user_id}", response_model=UserRead)
async def get_user_detail(
    user_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserService, Depends(UserService)]
):
    """
    **Xem chi tiết thông tin người dùng theo ID.**

    Truy vấn toàn bộ Profile của một người dùng bất kỳ. Chỉ dành cho Admin/Manager.

    ### Logic Flow:
    1. Kiểm tra quyền truy cập.
    2. Truy vấn DB tìm User theo UUID.

    ### Tham số đầu vào:
    - **user_id**: UUID của người dùng cần xem.

    ### Bảo mật:
    - Yêu cầu: `ADMIN` hoặc `MANAGER`.

    ### Lỗi có thể xảy ra:
    - `404 Not Found`: Không tìm thấy ID người dùng.
    - `403 Forbidden`: Thiếu quyền hạn.
    """
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện hành động này"
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
    **Cập nhật thông tin người dùng (Admin/Manager).**

    Cho phép quản trị viên chỉnh sửa hồ sơ của một người dùng khác.

    ### Logic Flow:
    1. Kiểm tra quyền quản trị.
    2. Tìm User mục tiêu.
    3. Cập nhật dữ liệu từ Body.

    ### Tham số đầu vào:
    - **user_id**: ID người dùng đích.
    - **user_update**: Dữ liệu cần cập nhật.

    ### Lỗi có thể xảy ra:
    - `404 Not Found`: Không tìm thấy User.
    - `403 Forbidden`: Không có quyền Admin.
    """
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện hành động này"
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
    **Xóa tài khoản người dùng.**

    Thực hiện xóa đồng thời cả bản ghi trong Database và Account trên Supabase Auth.

    ### Logic Flow:
    1. Kiểm tra quyền tối cao (`ADMIN`).
    2. Gọi Supabase Admin API để xóa Auth account.
    3. Xóa bản ghi (Hard Delete) trong Database cục bộ.

    ### Chú ý quan trọng:
    - Thao tác này **KHÔNG THỂ** hoàn tác.
    - Sẽ xóa toàn bộ dữ liệu liên quan (Cascade) nếu có.

    ### Tham số đầu vào:
    - **user_id**: ID người dùng cần xóa.

    ### Bảo mật:
    - **Yêu cầu**: Duy nhất quyền `ADMIN` được phép thực hiện.

    ### Lỗi có thể xảy ra:
    - `403 Forbidden`: Quyền Manager cũng không được phép xóa.
    - `500 Internal Server Error`: Lỗi kết nối Supabase API.
    - `404 Not Found`: User không còn tồn tại.
    """
    if current_user.role != UserRole.ADMIN:
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện hành động này"
        )
    try:
        await service.delete_user(user_id)
    except UserNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)
    except UserOperationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.detail)
