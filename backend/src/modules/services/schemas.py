import uuid
from sqlmodel import SQLModel
from pydantic import ConfigDict

# --- SKILLS ---
class SkillBase(SQLModel):
    name: str
    code: str
    description: str | None = None

class SkillCreate(SkillBase):
    pass

class SkillUpdate(SQLModel):
    name: str | None = None
    code: str | None = None
    description: str | None = None

class SkillRead(SkillBase):
    id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)

# --- SERVICES ---
class ServiceBase(SQLModel):
    name: str
    duration: int
    buffer_time: int = 15
    price: float
    image_url: str | None = None
    is_active: bool = True

class ServiceCreate(ServiceBase):
    skill_ids: list[uuid.UUID] = []
    new_skills: list[str] | None = None # List of names for new skills to auto-create

class ServiceUpdate(SQLModel):
    name: str | None = None
    duration: int | None = None
    buffer_time: int | None = None
    price: float | None = None
    image_url: str | None = None
    is_active: bool | None = None
    skill_ids: list[uuid.UUID] | None = None
    new_skills: list[str] | None = None

class ServiceRead(ServiceBase):
    id: uuid.UUID
    skills: list[SkillRead] = []
    model_config = ConfigDict(from_attributes=True)
