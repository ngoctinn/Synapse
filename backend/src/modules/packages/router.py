from fastapi import APIRouter, Depends, status, Query
import uuid
from .schemas import PackageRead, PackageCreate, PackageUpdate, PackageReadDetailed, PackagePaginationResponse
from .service import PackageManagementService

router = APIRouter(prefix="/packages", tags=["Packages"])

@router.get("/", response_model=PackagePaginationResponse)
async def list_packages(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str | None = None,
    is_active: bool | None = None,
    service: PackageManagementService = Depends()
):
    skip = (page - 1) * limit
    packages, total = await service.get_packages(
        skip=skip,
        limit=limit,
        search=search,
        is_active=is_active
    )
    return {
        "data": packages,
        "total": total,
        "page": page,
        "limit": limit
    }

@router.post("/", response_model=PackageRead, status_code=status.HTTP_201_CREATED)
async def create_package(
    package_in: PackageCreate,
    service: PackageManagementService = Depends()
):
    return await service.create_package(package_in)

@router.get("/{package_id}", response_model=PackageReadDetailed)
async def get_package(
    package_id: uuid.UUID,
    service: PackageManagementService = Depends()
):
    return await service.get_package(package_id)

@router.put("/{package_id}", response_model=PackageRead)
async def update_package(
    package_id: uuid.UUID,
    package_in: PackageUpdate,
    service: PackageManagementService = Depends()
):
    return await service.update_package(package_id, package_in)

@router.delete("/{package_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_package(
    package_id: uuid.UUID,
    service: PackageManagementService = Depends()
):
    await service.delete_package(package_id)
