"""
Services Module - API Endpoints

Quản lý danh mục dịch vụ làm đẹp, kỹ năng yêu cầu và quy trình Smart Tagging tự động.
"""

from typing import Annotated
import uuid
from fastapi import APIRouter, Depends, status, HTTPException, Query
from src.modules.services.schemas import (
    ServiceRead, ServiceCreate, ServiceUpdate, ServicePaginationResponse,
    SkillRead, SkillCreate, SkillUpdate,
    ServiceCategoryRead, ServiceCategoryCreate, ServiceCategoryUpdate
)
from src.modules.services.service import ServiceManagementService
from src.modules.services.skill_service import SkillService
from src.modules.services.category_service import CategoryService
from src.modules.services.exceptions import ServiceNotFoundError, SkillNotFoundError, SkillAlreadyExistsError, ServiceCategoryNotFoundError
from src.modules.users import get_current_user, User, UserRole

router = APIRouter(prefix="/services", tags=["Services"])

# --- SKILLS ---
@router.get("/skills", response_model=list[SkillRead])
async def list_skills(
    service: Annotated[SkillService, Depends(SkillService)]
):
    """
    **Lấy danh sách tất cả các kỹ năng chuyên môn.**

    Truy vấn toàn bộ các kỹ năng (Skills) hiện có trong hệ thống để sử dụng cho việc định nghĩa dịch vụ hoặc gán cho nhân viên.

    ### Logic Flow:
    1. Truy vấn Database bảng `skills`.
    2. Trả về danh sách object `SkillRead`.
    """
    return await service.get_skills()

@router.post("/skills", response_model=SkillRead, status_code=status.HTTP_201_CREATED)
async def create_skill(
    skill_in: SkillCreate,
    service: Annotated[SkillService, Depends(SkillService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    **Tạo mới một kỹ năng trong danh mục.**

    Thêm một loại kỹ năng chuyên môn mới vào hệ thống (Vd: "Massage đá nóng", "Chăm sóc da mặt chuyên sâu").

    ### Logic Flow:
    1. Kiểm tra quyền hạn: Chỉ dành cho `MANAGER`.
    2. Kiểm tra xem mã kỹ năng (`code`) đã tồn tại chưa để tránh trùng lặp.
    3. Tạo bản ghi mới và trả về thông tin.

    ### Bảo mật:
    - Yêu cầu quyền: `MANAGER`.

    ### Lỗi có thể xảy ra:
    - `403 Forbidden`: Người dùng không có quyền quản lý danh mục.
    - `400 Bad Request`: Tên hoặc mã kỹ năng đã tồn tại.
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Bạn không có quyền truy cập")
    try:
        return await service.create_skill(skill_in)
    except SkillAlreadyExistsError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/skills/{skill_id}", response_model=SkillRead)
async def update_skill(
    skill_id: uuid.UUID,
    skill_in: SkillUpdate,
    service: Annotated[SkillService, Depends(SkillService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    **Cập nhật thông tin kỹ năng.**

    Cho phép thay đổi tên, mã hoặc mô tả của một kỹ năng sẵn có.

    ### Logic Flow:
    1. Kiểm tra quyền `MANAGER`.
    2. Tìm kiếm Skill theo ID.
    3. Cập nhật các trường thông tin.

    ### Tham số đầu vào:
    - **skill_id**: ID của kỹ năng cần sửa.
    - **body**: Thông tin cập nhật (name, code, description).

    ### Lỗi có thể xảy ra:
    - `404 Not Found`: Không tìm thấy ID kỹ năng.
    - `403 Forbidden`: Thiếu quyền hạn.
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Bạn không có quyền truy cập")
    try:
        return await service.update_skill(skill_id, skill_in)
    except SkillNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except SkillAlreadyExistsError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    skill_id: uuid.UUID,
    service: Annotated[SkillService, Depends(SkillService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    **Xóa kỹ năng khỏi danh mục.**

    Xóa vĩnh viễn một kỹ năng. Lưu ý có thể ảnh hưởng đến các dịch vụ đang liên kết.

    ### Logic Flow:
    1. Kiểm tra quyền `MANAGER`.
    2. Thực hiện xóa bản ghi trong DB.

    ### Lỗi có thể xảy ra:
    - `404 Not Found`: Kỹ năng không tồn tại.
    - `403 Forbidden`: Không có quyền xóa.
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Bạn không có quyền truy cập")
    try:
        return await service.delete_skill(skill_id)
    except SkillNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

# --- CATEGORIES ---
@router.get("/categories", response_model=list[ServiceCategoryRead])
async def list_categories(
    service: Annotated[CategoryService, Depends(CategoryService)]
):
    """Lấy danh sách danh mục dịch vụ."""
    return await service.get_categories()

@router.post("/categories", response_model=ServiceCategoryRead, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_in: ServiceCategoryCreate,
    service: Annotated[CategoryService, Depends(CategoryService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Tạo danh mục mới (Yêu cầu MANAGER)."""
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Bạn không có quyền truy cập")
    return await service.create_category(category_in)

@router.put("/categories/{category_id}", response_model=ServiceCategoryRead)
async def update_category(
    category_id: uuid.UUID,
    category_in: ServiceCategoryUpdate,
    service: Annotated[CategoryService, Depends(CategoryService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Cập nhật danh mục (Yêu cầu MANAGER)."""
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Bạn không có quyền truy cập")
    try:
        return await service.update_category(category_id, category_in)
    except ServiceCategoryNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: uuid.UUID,
    service: Annotated[CategoryService, Depends(CategoryService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Xóa danh mục (Yêu cầu MANAGER)."""
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Bạn không có quyền truy cập")
    try:
        await service.delete_category(category_id)
    except ServiceCategoryNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

# --- SERVICES ---
@router.get("", response_model=ServicePaginationResponse)
async def list_services(
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)],
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str | None = None,
    active: bool = False
):
    """
    **Lấy danh sách dịch vụ spa.**

    Truy vấn toàn bộ danh mục dịch vụ kèm theo các kỹ năng yêu cầu. Hỗ trợ tìm kiếm và phân trang.

    ### Logic Flow:
    1. Xây dựng câu lệnh query kèm `selectinload` để lấy danh sách `skills` liên quan.
    2. Áp dụng bộ lọc `active` và `search` (theo tên dịch vụ).
    3. Thực hiện đếm tổng số bản ghi phục vụ phân trang.

    ### Tham số query:
    - **search**: Tìm kiếm mờ theo tên dịch vụ.
    - **active**: Nếu `true`, chỉ lấy những dịch vụ đang mở bán.

    ### Trả về:
    - Object `ServicePaginationResponse` chứa danh sách dịch vụ và thông tin tổng quan.
    """
    skip = (page - 1) * limit
    services, total = await service.get_services(skip=skip, limit=limit, search=search, only_active=active)

    return ServicePaginationResponse(
        data=services,
        total=total,
        page=page,
        limit=limit
    )

@router.get("/{service_id}", response_model=ServiceRead)
async def get_service(
    service_id: uuid.UUID,
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)]
):
    """
    **Xem chi tiết một dịch vụ.**

    Lấy toàn bộ thông tin về giá, thời lượng, và các kỹ năng cần thiết để thực hiện dịch vụ này.

    ### Logic Flow:
    1. Truy vấn Database theo `service_id`.
    2. Eager load danh sách kỹ năng liên kết.

    ### Lỗi có thể xảy ra:
    - `404 Not Found`: Dịch vụ không tồn tại trong hệ thống.
    """
    try:
        return await service.get_service(service_id)
    except ServiceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("", response_model=ServiceRead, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_in: ServiceCreate,
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    **Tạo một dịch vụ mới hoàn chỉnh.**

    Yêu cầu quyền Quản lý. Hỗ trợ tính năng **Smart Tagging**: Tự động tạo kỹ năng mới nếu chưa có trong hệ thống.

    ### Logic Flow (Smart Tagging Process):
    1. Kiểm tra quyền `MANAGER`.
    2. Xử lý `new_skills`: Chuyển đổi tên thành *Slug code*, kiểm tra tồn tại, nếu chưa có thì tạo mới trong bảng `skills`.
    3. Tạo bản ghi `service`.
    4. Liên kết `service` với danh sách kỹ năng (cả cũ và mới) vào bảng trung gian.

    ### Tham số đầu vào quan trọng:
    - **skill_ids**: Danh sách các ID kỹ năng đã có.
    - **new_skills**: Danh sách tên các kỹ năng mới muốn tạo nhanh.

    ### Lỗi có thể xảy ra:
    - `403 Forbidden`: Thiếu quyền quản lý.
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Bạn không có quyền truy cập")
    return await service.create_service(service_in)

@router.put("/{service_id}", response_model=ServiceRead)
async def update_service(
    service_id: uuid.UUID,
    service_in: ServiceUpdate,
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    **Cập nhật thông tin dịch vụ và liên kết kỹ năng.**

    Cho phép thay đổi bất kỳ thông tin nào của dịch vụ, bao gồm cả việc gán lại các kỹ năng yêu cầu.

    ### Logic Flow:
    1. Kiểm tra tồn tại của dịch vụ.
    2. Cập nhật các trường thông tin cơ bản.
    3. Đồng bộ lại kỹ năng (Sync skills): Xóa các kỹ năng cũ không còn dùng và thêm các kỹ năng mới được gán.

    ### Lỗi có thể xảy ra:
    - `404 Not Found`: Không tìm thấy ID dịch vụ.
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Bạn không có quyền truy cập")
    try:
        return await service.update_service(service_id, service_in)
    except ServiceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(
    service_id: uuid.UUID,
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    **Xóa (Vô hiệu hóa) dịch vụ.**

    Thay vì xóa cứng khỏi Database, hệ thống sẽ thực hiện Soft Delete bằng cách set `is_active = False`.

    ### Tại sao dùng Soft Delete?
    - Để bảo toàn dữ liệu lịch sử cho các đơn hàng và báo cáo đã thực hiện trước đó.

    ### Quyền hạn:
    - Chỉ `MANAGER` được phép vô hiệu hóa dịch vụ.

    ### Lỗi có thể xảy ra:
    - `404 Not Found`: Dịch vụ không tồn tại.
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Bạn không có quyền truy cập")
    try:
        return await service.delete_service(service_id)
    except ServiceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
