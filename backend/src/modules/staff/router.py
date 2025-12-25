"""
Staff Module - API Endpoints

Quản lý hồ sơ chuyên môn của nhân viên, bao gồm quy trình mời nhân viên mới, phân vai trò và gán kỹ năng.
"""

import uuid
from fastapi import APIRouter, Depends, Query, status, HTTPException
from typing import Annotated

from src.common.auth_core import get_token_payload, check_is_manager
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

router = APIRouter(prefix="/staff", tags=["Staff"])

@router.post("/invite", status_code=status.HTTP_201_CREATED)
async def invite_staff(
    data: StaffInvite,
    token_payload: Annotated[dict, Depends(get_token_payload)],
    service: StaffService = Depends(StaffService)
) -> dict:
    """
    **Mời nhân viên mới tham gia hệ thống.**

    Gửi email mời thông qua Supabase Auth và tự động khởi tạo hồ sơ Staff trong Database.

    ### Logic Flow:
    1. Gọi Supabase Auth Admin API để mời User bằng Email.
    2. Nếu User đã tồn tại, thực hiện nâng cấp (Promote) role của User đó.
    3. Bypass RLS bằng `service_role` để lưu thông tin cơ bản vào bảng `users`.
    4. Khởi tạo bản ghi trong bảng `staff` với các thông tin nghiệp vụ ban đầu (Title, Hired date, v.v.).

    ### Tham số đầu vào:
    - **email**: Địa chỉ nhận thư mời.
    - **role**: Phân quyền (`admin`, `receptionist`, `technician`).
    - **full_name**: Tên hiển thị.
    - **title**: Chức danh chuyên môn.

    ### Chú ý:
    - Sau khi mời thành công, nhân viên sẽ nhận được email để thiết lập mật khẩu.

    ### Bảo mật:
    - **Yêu cầu quyền**: Manager.

    ### Lỗi có thể xảy ra:
    - `403 Forbidden`: Không có quyền thực hiện thao tác này.
    - `400 Bad Request`: Email đã được đăng ký làm nhân viên trước đó.
    - `500 Internal Server Error`: Lỗi kết nối với nhà cung cấp dịch vụ xác thực (Supabase).
    """
    check_is_manager(token_payload)
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
    **Lấy danh sách nhân viên hệ thống.**

    Truy vấn danh sách nhân viên kèm theo thông tin tài khoản và kỹ năng. Hỗ trợ phân trang và lọc nâng cao.

    ### Logic Flow:
    1. Join bảng `staff` với bảng `users` để lấy thông tin cá nhân.
    2. Áp dụng filter theo `role` (vai trò) hoặc `is_active` (trạng thái hoạt động).
    3. Thực hiện Eager Loading (`selectinload`) cho các quan hệ `user` và `skills` để tối ưu performance.
    4. Trả về kết quả phân trang.

    ### Tham số query:
    - **role**: admin, receptionist, technician.
    - **is_active**: true/false.
    - **page / limit**: Các thông số phân trang chuẩn.

    ### Lỗi có thể xảy ra:
    - `400 Bad Request`: Tham số phân trang không hợp lệ.
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
    **Xem chi tiết hồ sơ công việc của nhân viên.**

    Lấy toàn bộ thông tin nghiệp vụ, tài khoản và các kỹ năng chuyên môn của một nhân viên cụ thể.

    ### Logic Flow:
    1. Tìm kiếm bản ghi trong bảng `staff` theo ID.
    2. Tải trước thông tin User và Skills đi kèm.

    ### Tham số đầu vào:
    - **user_id**: ID của nhân viên (trùng với User ID).

    ### Lỗi có thể xảy ra:
    - `404 Not Found`: Không tìm thấy ID nhân viên yêu cầu.
    """
    try:
        return await service.get_staff_by_id(user_id)
    except StaffNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)

@router.post("/", response_model=StaffRead, status_code=status.HTTP_201_CREATED)
async def create_staff(
    data: StaffCreate,
    token_payload: Annotated[dict, Depends(get_token_payload)],
    service: StaffService = Depends(StaffService)
) -> StaffRead:
    """
    **Thiết lập hồ sơ Staff cho User sẵn có.**

    Chỉ sử dụng khi một User đã tồn tại (Vd: Khách hàng cũ) được tuyển dụng và cần tạo hồ sơ nhân viên.

    ### Logic Flow:
    1. Kiểm tra User ID có tồn tại trong hệ thống không.
    2. Đảm bảo User không phải là `CUSTOMER` (Khách hàng không được trực tiếp làm staff).
    3. Kiểm tra xem profile staff đã tồn tại chưa để tránh trùng lặp.
    4. Khởi tạo dữ liệu nghiệp vụ (Title, hired date...).

    ### Tham số đầu vào:
    - **user_id**: ID của User hiện tại.
    - **title**: Chức danh được bổ nhiệm.

    ### Bảo mật:
    - **Yêu cầu quyền**: Manager.

    ### Lỗi có thể xảy ra:
    - `403 Forbidden`: Không có quyền thực hiện thao tác này.
    - `404 Not Found`: Không tìm thấy User ID.
    - `400 Bad Request`: User đã có profile staff hoặc tài khoản đang ở role Customer.
    """
    check_is_manager(token_payload)
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
    token_payload: Annotated[dict, Depends(get_token_payload)],
    service: StaffService = Depends(StaffService)
) -> StaffRead:
    """
    **Cập nhật thông tin công việc của nhân viên.**

    Cho phép chỉnh sửa các thông tin như Chức danh, Tiểu sử, Màu sắc hiển thị trên lịch điều phối.

    ### Logic Flow:
    1. Kiểm tra sự tồn tại của Staff.
    2. Cập nhật các trường dữ liệu mới (chỉ cập nhật những gì được gửi lên).
    3. Ghi nhận thời gian cập nhật `updated_at`.

    ### Tham số đầu vào:
    - **user_id**: ID nhân viên cần chỉnh sửa.
    - **data**: Model chứa các trường cần thay đổi.

    ### Bảo mật:
    - **Yêu cầu quyền**: Manager.

    ### Lỗi có thể xảy ra:
    - `403 Forbidden`: Không có quyền thực hiện thao tác này.
    - `404 Not Found`: Không tìm thấy nhân viên.
    """
    check_is_manager(token_payload)
    try:
        return await service.update_staff(user_id, data)
    except StaffNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)

@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
async def deactivate_staff(
    user_id: uuid.UUID,
    token_payload: Annotated[dict, Depends(get_token_payload)],
    service: StaffService = Depends(StaffService)
) -> dict:
    """
    **Vô hiệu hóa tài khoản nhân viên (Soft Delete).**

    Thay vì xóa dữ liệu, API này sẽ đánh dấu nhân viên không còn hoạt động.

    ### Logic Flow:
    1. Tìm User tương ứng với ID được cung cấp.
    2. Set `is_active = False` để ngăn đăng nhập và hiển thị trên các ứng dụng.
    3. Giữ nguyên dữ liệu lịch sử (Bookings, Schedules) để phục vụ báo cáo.

    ### Chú ý:
    - Tài khoản bị vô hiệu hóa sẽ không thể đăng nhập vào Dashboard.

    ### Bảo mật:
    - **Yêu cầu quyền**: Manager.

    ### Lỗi có thể xảy ra:
    - `403 Forbidden`: Không có quyền thực hiện thao tác này.
    - `404 Not Found`: ID nhân viên không tồn tại.
    """
    check_is_manager(token_payload)
    try:
        return await service.deactivate_staff(user_id)
    except StaffNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)

@router.put("/{user_id}/skills", response_model=StaffRead)
async def update_staff_skills(
    user_id: uuid.UUID,
    data: StaffSkillsUpdate,
    token_payload: Annotated[dict, Depends(get_token_payload)],
    service: StaffService = Depends(StaffService)
) -> StaffRead:
    """
    **Gán kỹ năng chuyên môn cho Kỹ thuật viên.**

    Quản lý danh sách các dịch vụ mà Kỹ thuật viên có khả năng thực hiện.

    ### Logic Flow:
    1. Xác thực: Chỉ User có role `TECHNICIAN` mới được phép gán kỹ năng.
    2. Xóa bỏ toàn bộ các kỹ năng cũ đã gán.
    3. Kiểm tra tính hợp lệ của danh sách Skill ID mới.
    4. Thiết lập quan hệ Many-to-Many mới giữa Staff và Skills.

    ### Tại sao cần API này?
    - Dùng để hệ thống Lập lịch (Scheduling) biết KTV nào có thể thực hiện dịch vụ nào.

    ### Tham số đầu vào:
    - **skill_ids**: Danh sách UUID của các kỹ năng trong danh mục.

    ### Bảo mật:
    - **Yêu cầu quyền**: Manager.

    ### Lỗi có thể xảy ra:
    - `403 Forbidden`: Không có quyền thực hiện thao tác này.
    - `400 Bad Request`: Không phải là Kỹ thuật viên hoặc Skill ID không hợp lệ.
    - `404 Not Found`: Không tìm thấy nhân viên.
    """
    check_is_manager(token_payload)
    try:
        return await service.update_staff_skills(user_id, data)
    except StaffNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.detail)
    except StaffOperationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.detail)
