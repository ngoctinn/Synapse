"""
Staff Module - Database Models

Định nghĩa các Entity liên quan đến Nhân viên (Staff):
- Staff: Bảng chứa thông tin nhân viên (1-1 với User)
- StaffSkill: Bảng trung gian Staff ↔ Skill (M:M)
"""

import uuid
from datetime import date, datetime
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.modules.users import User
    from src.modules.services import Skill
    from src.modules.schedules import StaffSchedule


class StaffSkill(SQLModel, table=True):
    """
    Bảng trung gian: Staff ↔ Skill (Many-to-Many)

    Lý do: Chỉ Kỹ thuật viên (TECHNICIAN) mới có kỹ năng.
    Khách hàng hoặc Lễ tân không cần skills.
    """
    __tablename__ = "staff_skills"

    staff_id: uuid.UUID = Field(
        foreign_key="staff.user_id",
        primary_key=True,
        ondelete="CASCADE"
    )
    skill_id: uuid.UUID = Field(
        foreign_key="skills.id",
        primary_key=True,
        ondelete="CASCADE"
    )


class Staff(SQLModel, table=True):
    """
    Bảng Staff: Lưu thông tin nghiệp vụ của Nhân viên

    Relationship: 1-1 với User (user_id là PK và FK)

    Chỉ User có role = {admin, receptionist, technician} mới có Staff profile.
    """
    __tablename__ = "staff"

    # Primary Key = Foreign Key to users.id (1-1 relationship)
    user_id: uuid.UUID = Field(
        primary_key=True,
        foreign_key="users.id",
        ondelete="CASCADE"
    )

    # Thông tin nghiệp vụ
    hired_at: date  # Ngày vào làm
    bio: str | None = None  # Giới thiệu (hiển thị khi đặt lịch)
    title: str  # Chức danh: "Kỹ thuật viên cao cấp", "Chuyên viên Skincare"
    color_code: str = "#3B82F6"  # Màu hiển thị trên Calendar
    commission_rate: float = 0.0  # Tỷ lệ hoa hồng (%) - Chỉ cho TECHNICIAN

    # Metadata
    created_at: datetime = Field(
        default_factory=lambda: datetime.now()
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now()
    )

    # Relationships
    user: "User" = Relationship(back_populates="staff_profile")
    skills: list["Skill"] = Relationship(
        link_model=StaffSkill
    )
    schedules: list["StaffSchedule"] = Relationship(back_populates="staff")

