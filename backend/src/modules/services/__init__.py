"""
Services Module - Public API

File này đóng vai trò là Gatekeeper theo Backend Rules.
"""

from .models import Skill, Service, ServiceSkill, ServiceCategory
from .service import ServiceManagementService
from .skill_service import SkillService
from .router import router
from .schemas import (
    SkillCreate,
    SkillUpdate,
    SkillRead,
    ServiceCreate,
    ServiceUpdate,
    ServiceRead,
    ServiceCategoryCreate,
    ServiceCategoryUpdate,
    ServiceCategoryRead,
    ServicePaginationResponse,
)

__all__ = [
    # Models
    "Skill",
    "Service",
    "ServiceSkill",
    "ServiceCategory",
    # Services
    "ServiceManagementService",
    "SkillService",
    # Router
    "router",
    # Schemas
    "SkillCreate",
    "SkillUpdate",
    "SkillRead",
    "ServiceCreate",
    "ServiceUpdate",
    "ServiceRead",
    "ServiceCategoryCreate",
    "ServiceCategoryUpdate",
    "ServiceCategoryRead",
    "ServicePaginationResponse",
]
