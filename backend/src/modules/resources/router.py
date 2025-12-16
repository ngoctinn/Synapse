"""
Resources Module - API Endpoints (Router)

Tuân thủ Backend Rules:
- Docstring Markdown cho Swagger UI (Tiếng Việt)
- Service as Dependency
- Response models rõ ràng
"""

import uuid
from fastapi import APIRouter, Depends, status

from .service import ResourceGroupService, ResourceService
from .schemas import (
    ResourceGroupCreate,
    ResourceGroupUpdate,
    ResourceGroupRead,
    ResourceCreate,
    ResourceUpdate,
    ResourceRead,
)

router = APIRouter(prefix="/resources", tags=["Tài Nguyên"])


# ============================================================================
# RESOURCE GROUPS ENDPOINTS
# ============================================================================

@router.get(
    "/groups",
    response_model=list[ResourceGroupRead],
    summary="Lấy danh sách nhóm tài nguyên"
)
async def list_resource_groups(
    service: ResourceGroupService = Depends()
) -> list[ResourceGroupRead]:
    """
    Lấy tất cả nhóm tài nguyên trong hệ thống.

    **Ví dụ nhóm tài nguyên:**
    - Phòng đơn (ROOM)
    - Phòng VIP (ROOM)
    - Máy Laser (EQUIPMENT)
    """
    return await service.get_all()


@router.post(
    "/groups",
    response_model=ResourceGroupRead,
    status_code=status.HTTP_201_CREATED,
    summary="Tạo nhóm tài nguyên mới"
)
async def create_resource_group(
    data: ResourceGroupCreate,
    service: ResourceGroupService = Depends()
) -> ResourceGroupRead:
    """
    Tạo nhóm tài nguyên mới.

    **Các trường bắt buộc:**
    - `name`: Tên nhóm (VD: "Phòng đơn")
    - `type`: Loại nhóm (ROOM hoặc EQUIPMENT)

    **Lỗi có thể xảy ra:**
    - `400`: Dữ liệu không hợp lệ
    """
    return await service.create(data)


@router.get(
    "/groups/{group_id}",
    response_model=ResourceGroupRead,
    summary="Lấy chi tiết nhóm tài nguyên"
)
async def get_resource_group(
    group_id: uuid.UUID,
    service: ResourceGroupService = Depends()
) -> ResourceGroupRead:
    """
    Lấy thông tin chi tiết một nhóm tài nguyên.

    **Lỗi có thể xảy ra:**
    - `404`: Không tìm thấy nhóm tài nguyên
    """
    group = await service.get_by_id(group_id)
    if not group:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy nhóm tài nguyên"
        )
    return group


@router.patch(
    "/groups/{group_id}",
    response_model=ResourceGroupRead,
    summary="Cập nhật nhóm tài nguyên"
)
async def update_resource_group(
    group_id: uuid.UUID,
    data: ResourceGroupUpdate,
    service: ResourceGroupService = Depends()
) -> ResourceGroupRead:
    """
    Cập nhật thông tin nhóm tài nguyên.

    **Lưu ý:** Chỉ cần gửi các trường muốn thay đổi.

    **Lỗi có thể xảy ra:**
    - `404`: Không tìm thấy nhóm tài nguyên
    """
    return await service.update(group_id, data)


@router.delete(
    "/groups/{group_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa nhóm tài nguyên"
)
async def delete_resource_group(
    group_id: uuid.UUID,
    service: ResourceGroupService = Depends()
) -> None:
    """
    Xóa mềm nhóm tài nguyên (Soft Delete).

    **Lưu ý:** Các tài nguyên thuộc nhóm này sẽ có `group_id = NULL`.

    **Lỗi có thể xảy ra:**
    - `404`: Không tìm thấy nhóm tài nguyên
    """
    await service.soft_delete(group_id)


# ============================================================================
# RESOURCES ENDPOINTS
# ============================================================================

@router.get(
    "",
    response_model=list[ResourceRead],
    summary="Lấy danh sách tài nguyên"
)
async def list_resources(
    group_id: uuid.UUID | None = None,
    service: ResourceService = Depends()
) -> list[ResourceRead]:
    """
    Lấy tất cả tài nguyên trong hệ thống.

    **Query Parameters:**
    - `group_id` (optional): Lọc theo nhóm tài nguyên

    **Ví dụ tài nguyên:**
    - Phòng VIP 1
    - Phòng 02
    - Máy Laser 01
    """
    return await service.get_all(group_id=group_id)


@router.post(
    "",
    response_model=ResourceRead,
    status_code=status.HTTP_201_CREATED,
    summary="Tạo tài nguyên mới"
)
async def create_resource(
    data: ResourceCreate,
    service: ResourceService = Depends()
) -> ResourceRead:
    """
    Tạo tài nguyên mới.

    **Các trường bắt buộc:**
    - `name`: Tên tài nguyên (VD: "Phòng VIP 1")

    **Các trường tùy chọn:**
    - `group_id`: ID nhóm tài nguyên
    - `code`: Mã định danh (unique)
    - `capacity`: Sức chứa
    - `setup_time_minutes`: Thời gian chuẩn bị

    **Lỗi có thể xảy ra:**
    - `400`: Dữ liệu không hợp lệ
    - `409`: Mã code đã tồn tại
    """
    return await service.create(data)


@router.get(
    "/{resource_id}",
    response_model=ResourceRead,
    summary="Lấy chi tiết tài nguyên"
)
async def get_resource(
    resource_id: uuid.UUID,
    service: ResourceService = Depends()
) -> ResourceRead:
    """
    Lấy thông tin chi tiết một tài nguyên.

    **Lỗi có thể xảy ra:**
    - `404`: Không tìm thấy tài nguyên
    """
    resource = await service.get_by_id(resource_id)
    if not resource:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy tài nguyên"
        )
    return resource


@router.patch(
    "/{resource_id}",
    response_model=ResourceRead,
    summary="Cập nhật tài nguyên"
)
async def update_resource(
    resource_id: uuid.UUID,
    data: ResourceUpdate,
    service: ResourceService = Depends()
) -> ResourceRead:
    """
    Cập nhật thông tin tài nguyên.

    **Lưu ý:** Chỉ cần gửi các trường muốn thay đổi.

    **Lỗi có thể xảy ra:**
    - `404`: Không tìm thấy tài nguyên
    """
    return await service.update(resource_id, data)


@router.delete(
    "/{resource_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa tài nguyên"
)
async def delete_resource(
    resource_id: uuid.UUID,
    service: ResourceService = Depends()
) -> None:
    """
    Xóa mềm tài nguyên (Soft Delete).

    **Lưu ý:** Các lịch hẹn đã đặt với tài nguyên này vẫn được giữ.

    **Lỗi có thể xảy ra:**
    - `404`: Không tìm thấy tài nguyên
    """
    await service.soft_delete(resource_id)
