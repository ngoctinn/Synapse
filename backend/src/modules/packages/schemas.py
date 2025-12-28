import uuid
from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from .models import ServicePackage

class PackageServiceBase(BaseModel):
    service_id: uuid.UUID
    quantity: int = 1

class ServiceInPackage(PackageServiceBase):
    """Schema trả về thông tin dịch vụ trong gói."""
    service_name: str | None = None
    model_config = ConfigDict(from_attributes=True)

class PackageBase(BaseModel):
    name: str
    description: str | None = None
    price: Decimal
    validity_days: int | None = None
    is_active: bool = True

class PackageCreate(PackageBase):
    services: list[PackageServiceBase]

class PackageUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: Decimal | None = None
    validity_days: int | None = None
    is_active: bool | None = None
    services: list[PackageServiceBase] | None = None

class PackageRead(PackageBase):
    id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)

class PackageReadDetailed(PackageRead):
    services: list[ServiceInPackage]

class PackagePaginationResponse(BaseModel):
    """Schema phân trang danh sách Gói dịch vụ."""
    data: list[PackageReadDetailed]
    total: int
    page: int
    limit: int
