from typing import Annotated
import uuid
from fastapi import Depends
from sqlmodel import select
from sqlalchemy.exc import IntegrityError
from sqlmodel.ext.asyncio.session import AsyncSession
from src.common.database import get_db_session
from src.modules.services.models import Skill
from src.modules.services.schemas import SkillCreate, SkillUpdate
from src.modules.services.exceptions import SkillNotFoundError, SkillAlreadyExistsError

class SkillService:
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        self.session = session

    async def get_skills(self) -> list[Skill]:
        """
        Lấy danh sách tất cả kỹ năng.

        Returns:
            list[Skill]: Danh sách kỹ năng.
        """
        result = await self.session.exec(select(Skill))
        return list(result.all())

    async def create_skill(self, skill_in: SkillCreate) -> Skill:
        """
        Tạo kỹ năng mới.

        Args:
            skill_in (SkillCreate): Dữ liệu tạo kỹ năng.

        Returns:
            Skill: Kỹ năng vừa tạo.

        Raises:
            SkillAlreadyExistsError: Nếu mã kỹ năng đã tồn tại.
        """
        skill = Skill.model_validate(skill_in)
        self.session.add(skill)
        try:
            await self.session.commit()
            await self.session.refresh(skill)
            return skill
        except IntegrityError:
            await self.session.rollback()
            raise SkillAlreadyExistsError(f"Kỹ năng với mã '{skill_in.code}' đã tồn tại.")

    async def update_skill(self, skill_id: uuid.UUID, skill_in: SkillUpdate) -> Skill:
        """
        Cập nhật kỹ năng.

        Args:
            skill_id (uuid.UUID): ID kỹ năng.
            skill_in (SkillUpdate): Dữ liệu cập nhật.

        Returns:
            Skill: Kỹ năng đã cập nhật.

        Raises:
            SkillNotFoundError: Nếu không tìm thấy kỹ năng.
            SkillAlreadyExistsError: Nếu mã kỹ năng trùng lặp.
        """
        skill = await self.session.get(Skill, skill_id)
        if not skill:
            raise SkillNotFoundError(f"Kỹ năng {skill_id} không tồn tại.")

        update_data = skill_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(skill, key, value)

        self.session.add(skill)
        try:
            await self.session.commit()
            await self.session.refresh(skill)
            return skill
        except IntegrityError:
            await self.session.rollback()
            raise SkillAlreadyExistsError(f"Mã kỹ năng '{skill_in.code}' đã tồn tại.")

    async def delete_skill(self, skill_id: uuid.UUID):
        """
        Xóa kỹ năng.

        Args:
            skill_id (uuid.UUID): ID kỹ năng.

        Raises:
            SkillNotFoundError: Nếu không tìm thấy kỹ năng.
        """
        skill = await self.session.get(Skill, skill_id)
        if not skill:
            raise SkillNotFoundError(f"Kỹ năng {skill_id} không tồn tại.")
        await self.session.delete(skill)
        await self.session.commit()
