from typing import Annotated
import uuid
from fastapi import APIRouter, Depends, status, HTTPException, Query
from src.modules.services.schemas import (
    ServiceRead, ServiceCreate, ServiceUpdate, ServicePaginationResponse,
    SkillRead, SkillCreate, SkillUpdate
)
from src.modules.services.service import ServiceManagementService
from src.modules.services.skill_service import SkillService
from src.modules.services.exceptions import ServiceNotFoundError, SkillNotFoundError, SkillAlreadyExistsError
from src.modules.users import get_current_user, User, UserRole

router = APIRouter(prefix="/services", tags=["services"])

# --- SKILLS ---
@router.get("/skills", response_model=list[SkillRead])
async def list_skills(
    service: Annotated[SkillService, Depends(SkillService)]
):
    """
    Lấy danh sách kỹ năng.

    - **Input**: Không có.
    - **Output**: Danh sách các đối tượng `SkillRead`.
    """
    return await service.get_skills()

@router.post("/skills", response_model=SkillRead, status_code=status.HTTP_201_CREATED)
async def create_skill(
    skill_in: SkillCreate,
    service: Annotated[SkillService, Depends(SkillService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Tạo kỹ năng mới (Chỉ Manager).

    - **Permissions**: Yêu cầu quyền `manager`.
    - **Input**: `SkillCreate` (name, code, description).
    - **Output**: `SkillRead` vừa tạo.
    - **Errors**:
        - `400 Bad Request`: Mã kỹ năng đã tồn tại.
        - `403 Forbidden`: Không có quyền truy cập.
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
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
    Cập nhật kỹ năng (Chỉ Manager).

    - **Permissions**: Yêu cầu quyền `manager`.
    - **Input**: `skill_id`, `SkillUpdate`.
    - **Output**: `SkillRead` đã cập nhật.
    - **Errors**:
        - `404 Not Found`: Kỹ năng không tồn tại.
        - `400 Bad Request`: Mã kỹ năng trùng lặp.
        - `403 Forbidden`: Không có quyền truy cập.
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
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
    Xóa kỹ năng (Chỉ Manager).

    - **Permissions**: Yêu cầu quyền `manager`.
    - **Input**: `skill_id`.
    - **Output**: Không có nội dung (204).
    - **Errors**:
        - `404 Not Found`: Kỹ năng không tồn tại.
        - `403 Forbidden`: Không có quyền truy cập.
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    try:
        return await service.delete_skill(skill_id)
    except SkillNotFoundError as e:
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
    Lấy danh sách dịch vụ (Phân trang).

    - **Input**:
        - `page` (int, optional): Số trang. Default: 1.
        - `limit` (int, optional): Số lượng bản ghi/trang. Default: 10. Max: 100.
        - `search` (str, optional): Tìm kiếm theo tên dịch vụ.
        - `active` (bool, optional): Chỉ lấy dịch vụ đang hoạt động.
    - **Output**: `ServicePaginationResponse` (data, total, page, limit).
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
    Lấy chi tiết dịch vụ.

    - **Input**: `service_id`.
    - **Output**: Đối tượng `ServiceRead`.
    - **Errors**:
        - `404 Not Found`: Dịch vụ không tồn tại.
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
    Tạo dịch vụ mới (Chỉ Manager).

    - **Permissions**: Yêu cầu quyền `manager`.
    - **Input**: `ServiceCreate`.
    - **Output**: `ServiceRead` vừa tạo.
    - **Errors**:
        - `403 Forbidden`: Không có quyền truy cập.
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    return await service.create_service(service_in)

@router.put("/{service_id}", response_model=ServiceRead)
async def update_service(
    service_id: uuid.UUID,
    service_in: ServiceUpdate,
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Cập nhật dịch vụ (Chỉ Manager).

    - **Permissions**: Yêu cầu quyền `manager`.
    - **Input**: `service_id`, `ServiceUpdate`.
    - **Output**: `ServiceRead` đã cập nhật.
    - **Errors**:
        - `404 Not Found`: Dịch vụ không tồn tại.
        - `403 Forbidden`: Không có quyền truy cập.
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
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
    Xóa (ẩn) dịch vụ (Chỉ Manager).

    - **Permissions**: Yêu cầu quyền `manager`.
    - **Input**: `service_id`.
    - **Output**: Không có nội dung (204).
    - **Errors**:
        - `404 Not Found`: Dịch vụ không tồn tại.
        - `403 Forbidden`: Không có quyền truy cập.
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    try:
        return await service.delete_service(service_id)
    except ServiceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
