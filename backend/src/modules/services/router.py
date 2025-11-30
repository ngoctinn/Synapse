from typing import Annotated
import uuid
from fastapi import APIRouter, Depends, status, HTTPException
from src.modules.services.schemas import (
    ServiceRead, ServiceCreate, ServiceUpdate,
    SkillRead, SkillCreate, SkillUpdate
)
from src.modules.services.service import ServiceManagementService
from src.modules.users import get_current_user
from src.modules.users.models import User
from src.modules.users.constants import UserRole

router = APIRouter(prefix="/services", tags=["services"])

# --- SKILLS ---
@router.get("/skills", response_model=list[SkillRead])
async def list_skills(
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)]
):
    """Lấy danh sách kỹ năng."""
    return await service.get_skills()

@router.post("/skills", response_model=SkillRead, status_code=status.HTTP_201_CREATED)
async def create_skill(
    skill_in: SkillCreate,
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Tạo kỹ năng mới (Chỉ Manager)."""
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    return await service.create_skill(skill_in)

@router.put("/skills/{skill_id}", response_model=SkillRead)
async def update_skill(
    skill_id: uuid.UUID,
    skill_in: SkillUpdate,
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Cập nhật kỹ năng (Chỉ Manager)."""
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    return await service.update_skill(skill_id, skill_in)

@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    skill_id: uuid.UUID,
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Xóa kỹ năng (Chỉ Manager)."""
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    return await service.delete_skill(skill_id)

# --- SERVICES ---
@router.get("", response_model=list[ServiceRead])
async def list_services(
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)],
    active: bool = False
):
    """Lấy danh sách dịch vụ."""
    return await service.get_services(only_active=active)

@router.get("/{service_id}", response_model=ServiceRead)
async def get_service(
    service_id: uuid.UUID,
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)]
):
    """Lấy chi tiết dịch vụ."""
    return await service.get_service(service_id)

@router.post("", response_model=ServiceRead, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_in: ServiceCreate,
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Tạo dịch vụ mới (Chỉ Manager)."""
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    return await service.create_service(service_in)

@router.put("/{service_id}", response_model=ServiceRead)
async def update_service(
    service_id: uuid.UUID,
    service_in: ServiceUpdate,
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Cập nhật dịch vụ (Chỉ Manager)."""
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    return await service.update_service(service_id, service_in)

@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(
    service_id: uuid.UUID,
    service: Annotated[ServiceManagementService, Depends(ServiceManagementService)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """Xóa (ẩn) dịch vụ (Chỉ Manager)."""
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    return await service.delete_service(service_id)
