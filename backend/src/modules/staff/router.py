"""
Staff Module - API Router (Presentation Layer)

Định nghĩa các API endpoints để quản lý nhân viên.
"""

import uuid
from fastapi import APIRouter, Depends, Query, status, HTTPException
from typing import Annotated

from .service import StaffService
from .schemas import (
    StaffInvite,
    StaffCreate,
    StaffRead,
    StaffUpdate,
    StaffSkillsUpdate,
    StaffListResponse
)
from .exceptions import StaffNotFound, StaffAlreadyExists, StaffOperationError


router = APIRouter(prefix="/staff", tags=["Staff Management"])


@router.post("/invite", status_code=status.HTTP_201_CREATED)
async def invite_staff(
    data: StaffInvite,
    service: StaffService = Depends(StaffService)
) -> dict:
    """
    Mời nhân viên mới.

    Tạo User qua Supabase (gửi email invite) và Staff profile tương ứng.

    - **Request Body**:
        - `email`: Email nhân viên (sẽ nhận email mời).
        - `role`: Vai trò (admin, receptionist, technician).
        - `full_name`: Họ tên đầy đủ.
        - `title`: Chức danh (VD: "Kỹ thuật viên cao cấp").
        - `bio`: Giới thiệu (tùy chọn).

    - **Response**:
        - `message`: Thông báo đã gửi email.
        - `user_id`: UUID của user vừa tạo.

    - **Errors**:
        - `400`: Email đã tồn tại.
        - `500`: Lỗi khi gọi Supabase API.
    """
    try:
        return await service.invite_staff(data)
    except StaffAlreadyExists as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.detail)
    except StaffOperationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.detail)


@router.get("/", response_model=StaffListResponse)
async def list_staff(
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
    role: str | None = None,
    is_active: bool | None = None,
    service: StaffService = Depends(StaffService)
) -> StaffListResponse:
    """
    Lấy danh sách nhân viên.

    Hỗ trợ phân trang và lọc theo role/trạng thái.

    - **Query Parameters**:
        - `page`: Trang hiện tại (mặc định: 1).
        - `limit`: Số lượng mỗi trang (mặc định: 10, tối đa: 100).
        - `role`: Lọc theo vai trò (admin, receptionist, technician).
        - `is_active`: Lọc theo trạng thái hoạt động (true/false).

    - **Response**:
        - `data`: Danh sách staff.
        - `total`: Tổng số staff.
        - `page`: Trang hiện tại.
        - `limit`: Số lượng mỗi trang.
    """
    return await service.get_staff_list(
        page=page,
        limit=limit,
        role_filter=role,
        is_active=is_active
    )


@router.get("/{user_id}", response_model=StaffRead)
async def get_staff_detail(
    user_id: uuid.UUID,
    service: StaffService = Depends(StaffService)
) -> StaffRead:
    """
    ## Lấy chi tiết 1 nhân viên

    Trả về thông tin đầy đủ kèm User info và Skills.

    **Path Parameters**:
    - `user_id`: UUID của user

    **Response**: Thông tin staff đầy đủ

    **Errors**:
    - `404`: Không tìm thấy nhân viên
    """
    try:
        return await service.get_staff_by_id(user_id)
    except StaffNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)


@router.post("/", response_model=StaffRead, status_code=status.HTTP_201_CREATED)
async def create_staff(
    data: StaffCreate,
    service: StaffService = Depends(StaffService)
) -> StaffRead:
    """
    ## Tạo Staff profile cho User đã tồn tại

    Dùng khi User đã được tạo từ nguồn khác (không qua invite).

    **Request Body**:
    - `user_id`: UUID của user đã tồn tại
    - `hired_at`: Ngày vào làm
    - `title`: Chức danh
    - `bio`, `color_code`, `commission_rate`: Tùy chọn

    **Errors**:
    - `404`: User không tồn tại
    - `400`: User đã có Staff profile hoặc là customer
    """
    try:
        return await service.create_staff(data)
    except StaffNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)
    except StaffAlreadyExists as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.detail)
    except StaffOperationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.detail)


@router.put("/{user_id}", response_model=StaffRead)
async def update_staff(
    user_id: uuid.UUID,
    data: StaffUpdate,
    service: StaffService = Depends(StaffService)
) -> StaffRead:
    """
    ## Cập nhật thông tin nhân viên

    Partial update (chỉ cập nhật các trường được gửi lên).

    **Path Parameters**:
    - `user_id`: UUID của user

    **Request Body** (tất cả optional):
    - `title`: Chức danh mới
    - `bio`: Giới thiệu mới
    - `color_code`: Màu mới
    - `commission_rate`: Tỷ lệ hoa hồng mới

    **Errors**:
    - `404`: Không tìm thấy nhân viên
    """
    try:
        return await service.update_staff(user_id, data)
    except StaffNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)


@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
async def deactivate_staff(
    user_id: uuid.UUID,
    service: StaffService = Depends(StaffService)
) -> dict:
    """
    ## Vô hiệu hóa tài khoản nhân viên (Soft Delete)

    Không xóa khỏi database mà chỉ set `is_active = False`.
    Nhân viên không thể đăng nhập nhưng dữ liệu vẫn được giữ lại.

    **Path Parameters**:
    - `user_id`: UUID của user

    **Response**: Thông báo thành công

    **Errors**:
    - `404`: Không tìm thấy nhân viên
    """
    try:
        return await service.deactivate_staff(user_id)
    except StaffNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)


@router.put("/{user_id}/skills", response_model=StaffRead)
async def update_staff_skills(
    user_id: uuid.UUID,
    data: StaffSkillsUpdate,
    service: StaffService = Depends(StaffService)
) -> StaffRead:
    """
    ## Gán kỹ năng cho Kỹ thuật viên

    Chỉ User có role = 'technician' mới được gán skills.
    Thay thế toàn bộ skills cũ bằng danh sách mới (replace strategy).

    **Path Parameters**:
    - `user_id`: UUID của user

    **Request Body**:
    - `skill_ids`: Danh sách UUID của skills (không được rỗng)

    **Response**: Staff với skills đã cập nhật

    **Errors**:
    - `404`: Không tìm thấy nhân viên hoặc skill
    - `400`: Không phải Kỹ thuật viên
    """
    try:
        return await service.update_staff_skills(user_id, data)
    except StaffNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)
    except StaffOperationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.detail)
