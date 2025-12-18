"""
Resources Module - API Endpoints

Quản lý cơ sở hạ tầng spa bao gồm các Nhóm tài nguyên (Phòng, Máy móc) và các tài nguyên cụ thể.
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

router = APIRouter(prefix="/resources", tags=["Resources"])


# ============================================================================
# RESOURCE GROUPS ENDPOINTS
# ============================================================================

@router.get(
    "/groups",
    response_model=list[ResourceGroupRead]
)
async def list_resource_groups(
    service: ResourceGroupService = Depends()
) -> list[ResourceGroupRead]:
    """
    **Lấy danh sách các nhóm tài nguyên.**

    Truy vấn toàn bộ các danh mục tài nguyên hiện có (Vd: Nhóm "Giường đơn", Nhóm "Phòng VIP").

    ### Logic Flow:
    1. Truy vấn Database bảng `resource_groups`.
    2. Trả về danh sách object `ResourceGroupRead`.
    """
    return await service.get_all()


@router.post(
    "/groups",
    response_model=ResourceGroupRead,
    status_code=status.HTTP_201_CREATED
)
async def create_resource_group(
    data: ResourceGroupCreate,
    service: ResourceGroupService = Depends()
) -> ResourceGroupRead:
    """
    **Định nghĩa một nhóm tài nguyên mới.**

    Tạo các cấp danh mục để phân loại tài nguyên vật lý trong trung tâm Spa.

    ### Logic Flow:
    1. Nhận dữ liệu `name`, `description`.
    2. Lưu bản ghi mới vào Database.
    3. Trả về thông tin nhóm vừa tạo.
    """
    return await service.create(data)


@router.get(
    "/groups/{group_id}",
    response_model=ResourceGroupRead
)
async def get_resource_group(
    group_id: uuid.UUID,
    service: ResourceGroupService = Depends()
) -> ResourceGroupRead:
    """
    **Xem chi tiết nhóm tài nguyên.**

    Truy vấn thông tin chi tiết của một nhóm cụ thể theo ID.

    ### Lỗi có thể xảy ra:
    - `404 Not Found`: Nếu ID nhóm không tồn tại.
    """
    group = await service.get_by_id(group_id)
    if not group:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource group not found"
        )
    return group


@router.patch(
    "/groups/{group_id}",
    response_model=ResourceGroupRead
)
async def update_resource_group(
    group_id: uuid.UUID,
    data: ResourceGroupUpdate,
    service: ResourceGroupService = Depends()
) -> ResourceGroupRead:
    """
    **Cập nhật thông tin nhóm tài nguyên.**

    Chỉnh sửa tên hoặc mô tả của nhóm hiện có (Cập nhật từng phần - Partial update).
    """
    return await service.update(group_id, data)


@router.delete(
    "/groups/{group_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_resource_group(
    group_id: uuid.UUID,
    service: ResourceGroupService = Depends()
) -> None:
    """
    **Xóa nhóm tài nguyên (Soft Delete).**

    Đánh dấu nhóm tài nguyên là đã bị xóa để đảm bảo toàn vẹn dữ liệu cho các bản ghi liên quan (Vd: các Resource con).
    """
    await service.soft_delete(group_id)


# ============================================================================
# RESOURCES ENDPOINTS
# ============================================================================

@router.get(
    "",
    response_model=list[ResourceRead]
)
async def list_resources(
    group_id: uuid.UUID | None = None,
    service: ResourceService = Depends()
) -> list[ResourceRead]:
    """
    **Lấy danh sách các tài nguyên spa cụ thể.**

    Truy vấn các tài nguyên vật lý (Vd: "Phòng VIP 1", "Máy triệt lông Apollo"). Có hỗ trợ lọc nhanh theo nhóm.

    ### Tham số lọc:
    - **group_id**: Nếu cung cấp, chỉ lấy các tài nguyên thuộc nhóm này.
    """
    return await service.get_all(group_id=group_id)


@router.post(
    "",
    response_model=ResourceRead,
    status_code=status.HTTP_201_CREATED
)
async def create_resource(
    data: ResourceCreate,
    service: ResourceService = Depends()
) -> ResourceRead:
    """
    **Đăng ký tài nguyên mới vào hệ thống.**

    Khởi tạo một tài nguyên vật lý và gán nó vào một nhóm quản lý cụ thể.

    ### Logic Flow:
    1. Kiểm tra sự tồn tại của `group_id`.
    2. Lưu bản ghi tài nguyên mới.
    """
    return await service.create(data)


@router.get(
    "/{resource_id}",
    response_model=ResourceRead
)
async def get_resource(
    resource_id: uuid.UUID,
    service: ResourceService = Depends()
) -> ResourceRead:
    """
    **Xem thông tin chi tiết một tài nguyên cụ thể.**
    """
    resource = await service.get_by_id(resource_id)
    if not resource:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    return resource


@router.patch(
    "/{resource_id}",
    response_model=ResourceRead
)
async def update_resource(
    resource_id: uuid.UUID,
    data: ResourceUpdate,
    service: ResourceService = Depends()
) -> ResourceRead:
    """
    **Cập nhật trạng thái hoặc thông tin tài nguyên.**
    """
    return await service.update(resource_id, data)


@router.delete(
    "/{resource_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_resource(
    resource_id: uuid.UUID,
    service: ResourceService = Depends()
) -> None:
    """
    **Xóa tài nguyên khỏi hệ thống (Soft Delete).**
    """
    await service.soft_delete(resource_id)
