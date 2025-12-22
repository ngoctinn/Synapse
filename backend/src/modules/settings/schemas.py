"""
Settings Module - Pydantic Schemas
"""
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from .models import SettingType

class SettingBase(BaseModel):
    value: str = Field(description="Giá trị setting (string)")
    description: str | None = None
    group: str = Field(default="GENERAL")
    is_public: bool = False

class SettingCreate(SettingBase):
    key: str = Field(max_length=100)
    type: SettingType = SettingType.STRING

class SettingUpdate(BaseModel):
    value: str
    description: str | None = None

class SettingRead(SettingBase):
    key: str
    type: SettingType
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
