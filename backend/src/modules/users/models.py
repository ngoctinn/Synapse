from datetime import date, datetime, timezone
import uuid
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.modules.services.models import Skill

class UserSkill(SQLModel, table=True):
    __tablename__ = "user_skills"

    user_id: uuid.UUID = Field(foreign_key="users.id", primary_key=True, ondelete="CASCADE")
    skill_id: uuid.UUID = Field(foreign_key="skills.id", primary_key=True, ondelete="CASCADE")

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(primary_key=True)
    email: str = Field(index=True, unique=True)
    full_name: str | None = None
    avatar_url: str | None = None
    phone_number: str | None = None
    address: str | None = None
    date_of_birth: date | None = None
    role: str = Field(default="customer")

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    skills: list["Skill"] = Relationship(back_populates="users", link_model=UserSkill)
