"""
Resources Module - Public API

File này đóng vai trò là Gatekeeper theo Backend Rules.
Chỉ export những gì cần thiết cho các module khác.

Cấm Deep Import: Không được import trực tiếp từ .models, .service, v.v.
"""

# Models (cho việc type hinting và relationships)
from .models import (
    ResourceGroup,
    Resource,
    ResourceType,
    ResourceStatus,
    ServiceResourceRequirement,
)

# Schemas (cho DTOs)
from .schemas import (
    ResourceGroupCreate,
    ResourceGroupUpdate,
    ResourceGroupRead,
    ResourceCreate,
    ResourceUpdate,
    ResourceRead,
    ServiceResourceRequirementCreate,
    ServiceResourceRequirementRead,
)

# Services (cho Dependency Injection)
from .service import ResourceGroupService, ResourceService

# Router (cho main.py)
from .router import router

__all__ = [
    # Models
    "ResourceGroup",
    "Resource",
    "ResourceType",
    "ResourceStatus",
    "ServiceResourceRequirement",
    # Schemas
    "ResourceGroupCreate",
    "ResourceGroupUpdate",
    "ResourceGroupRead",
    "ResourceCreate",
    "ResourceUpdate",
    "ResourceRead",
    "ServiceResourceRequirementCreate",
    "ServiceResourceRequirementRead",
    # Services
    "ResourceGroupService",
    "ResourceService",
    # Router
    "router",
]
