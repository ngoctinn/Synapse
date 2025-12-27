"""
Settings Module - API Endpoints
"""
import uuid
from fastapi import APIRouter, Depends, status
from src.common.auth_core import get_token_payload, check_is_manager
from .service import SettingsService
from .schemas import SettingRead, SettingCreate, SettingUpdate

router = APIRouter(prefix="/settings", tags=["System Settings"])

@router.get("", response_model=list[SettingRead])
async def list_settings(
    group: str | None = None,
    service: SettingsService = Depends(),
    token_payload: dict = Depends(get_token_payload)
) -> list[SettingRead]:
    """
    Lấy danh sách cấu hình.
    Yêu cầu: Staff/Admin.
    """
    check_is_manager(token_payload) # Tạm thời chỉ cho Admin
    return await service.get_all(group)

@router.get("/public", response_model=list[SettingRead])
async def list_public_settings(
    service: SettingsService = Depends()
) -> list[SettingRead]:
    """
    Lấy danh sách cấu hình Public (không cần Auth).
    """
    # TODO: Implement filtering public only in service if needed efficiently
    # For now fetching all public
    # This is placeholder logic, actual service method for public needed
    all_settings = await service.get_all()
    return [s for s in all_settings if s.is_public]

@router.post("", response_model=SettingRead, status_code=status.HTTP_201_CREATED)
async def create_setting(
    data: SettingCreate,
    service: SettingsService = Depends(),
    token_payload: dict = Depends(get_token_payload)
) -> SettingRead:
    """Tạo cấu hình mới (Admin only)."""
    check_is_manager(token_payload)
    user_id = uuid.UUID(token_payload["sub"])
    return await service.create(data, updated_by=user_id)

@router.put("/{key}", response_model=SettingRead)
async def update_setting(
    key: str,
    data: SettingUpdate,
    service: SettingsService = Depends(),
    token_payload: dict = Depends(get_token_payload)
) -> SettingRead:
    """Cập nhật cấu hình (Admin only)."""
    check_is_manager(token_payload)
    user_id = uuid.UUID(token_payload["sub"])
    return await service.update(key, data, updated_by=user_id)
