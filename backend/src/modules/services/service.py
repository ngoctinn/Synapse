from typing import Annotated
import uuid
import re
import unicodedata
from fastapi import Depends
from sqlmodel import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from sqlmodel.ext.asyncio.session import AsyncSession
from src.common.database import get_db_session
from src.modules.services.models import Service, Skill, ServiceSkill
from src.modules.services.schemas import ServiceCreate, ServiceUpdate, SkillCreate, SkillUpdate
from src.modules.services.exceptions import ServiceNotFoundError, SkillNotFoundError, SkillAlreadyExistsError

class ServiceManagementService:
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        self.session = session

    # --- SKILLS ---
    async def get_skills(self) -> list[Skill]:
        result = await self.session.exec(select(Skill))
        return list(result.all())

    async def create_skill(self, skill_in: SkillCreate) -> Skill:
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
        skill = await self.session.get(Skill, skill_id)
        if not skill:
            raise SkillNotFoundError(f"Kỹ năng {skill_id} không tồn tại.")
        await self.session.delete(skill)
        await self.session.commit()

    # --- SERVICES ---
    async def get_services(
        self,
        skip: int = 0,
        limit: int = 100,
        search: str | None = None,
        only_active: bool = False
    ) -> list[Service]:
        query = select(Service).options(
            selectinload(Service.skills)
        )

        if only_active:
            query = query.where(Service.is_active == True)

        if search:
            # Tìm kiếm theo tên dịch vụ (case-insensitive)
            query = query.where(Service.name.ilike(f"%{search}%"))

        # Pagination
        query = query.offset(skip).limit(limit)

        result = await self.session.exec(query)
        services = result.all()

        return list(services)

    async def get_service(self, service_id: uuid.UUID) -> Service:
        query = select(Service).where(Service.id == service_id).options(
            selectinload(Service.skills)
        )
        result = await self.session.exec(query)
        service = result.first()

        if not service:
            raise ServiceNotFoundError(f"Dịch vụ {service_id} không tồn tại.")

        return service

    async def _get_or_create_skills(self, skill_names: list[str]) -> list[uuid.UUID]:
        """Helper: Lấy hoặc tạo kỹ năng theo tên."""
        if not skill_names:
            return []

        def simple_slugify(text):
            text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
            text = re.sub(r'[^\w\s-]', '', text).strip().lower()
            return re.sub(r'[-\s]+', '_', text)

        # 1. Prepare codes
        name_map = {f"SK_{simple_slugify(name).upper()}": name for name in skill_names}
        codes = list(name_map.keys())

        # 2. Find existing skills
        query = select(Skill).where(Skill.code.in_(codes))
        result = await self.session.exec(query)
        existing_skills = result.all()
        existing_codes = {skill.code for skill in existing_skills}
        skill_ids = [skill.id for skill in existing_skills]

        # 3. Create missing skills
        new_skills = []
        for code, name in name_map.items():
            if code not in existing_codes:
                new_skills.append(Skill(name=name, code=code))

        if new_skills:
            self.session.add_all(new_skills)
            try:
                await self.session.flush()
                skill_ids.extend([skill.id for skill in new_skills])
            except IntegrityError:
                # Nếu có lỗi trùng lặp (do race condition), rollback và query lại
                await self.session.rollback()
                # Query lại tất cả codes để lấy ID của những cái đã được tạo bởi process khác
                query_retry = select(Skill).where(Skill.code.in_(codes))
                result_retry = await self.session.exec(query_retry)
                all_skills = result_retry.all()
                skill_ids = [skill.id for skill in all_skills]

        return skill_ids

    async def create_service(self, service_in: ServiceCreate) -> Service:
        # 1. Handle Smart Tagging
        final_skill_ids = set(service_in.skill_ids)
        if service_in.new_skills:
            new_ids = await self._get_or_create_skills(service_in.new_skills)
            final_skill_ids.update(new_ids)

        # 2. Create Service
        service_data = service_in.model_dump(exclude={"skill_ids", "new_skills"})
        service = Service(**service_data)
        self.session.add(service)
        await self.session.flush()

        # 3. Bulk Insert Links
        if final_skill_ids:
            links = [
                ServiceSkill(service_id=service.id, skill_id=skill_id)
                for skill_id in final_skill_ids
            ]
            self.session.add_all(links)

        await self.session.commit()
        await self.session.refresh(service)
        return await self.get_service(service.id)

    async def update_service(self, service_id: uuid.UUID, service_in: ServiceUpdate) -> Service:
        # Load service with links
        query = select(Service).where(Service.id == service_id).options(
            selectinload(Service.skill_links)
        )
        result = await self.session.exec(query)
        service = result.first()

        if not service:
            raise ServiceNotFoundError(f"Dịch vụ {service_id} không tồn tại.")

        # Handle Smart Tagging
        final_skill_ids = None
        if service_in.skill_ids is not None:
            final_skill_ids = set(service_in.skill_ids)
            if service_in.new_skills:
                new_ids = await self._get_or_create_skills(service_in.new_skills)
                final_skill_ids.update(new_ids)

        # Update basic fields
        update_data = service_in.model_dump(exclude_unset=True, exclude={"skill_ids", "new_skills"})
        for key, value in update_data.items():
            setattr(service, key, value)

        # Update Skills
        if final_skill_ids is not None:
            current_skill_ids = {link.skill_id for link in service.skill_links}

            # Add new
            to_add = final_skill_ids - current_skill_ids
            new_links = [
                ServiceSkill(service_id=service.id, skill_id=skill_id)
                for skill_id in to_add
            ]
            if new_links:
                self.session.add_all(new_links)

            # Remove old
            to_remove = current_skill_ids - final_skill_ids
            for link in service.skill_links:
                if link.skill_id in to_remove:
                    await self.session.delete(link)

        self.session.add(service)
        await self.session.commit()
        await self.session.refresh(service)
        return await self.get_service(service.id)

    async def delete_service(self, service_id: uuid.UUID):
        service = await self.session.get(Service, service_id)
        if not service:
            raise ServiceNotFoundError(f"Dịch vụ {service_id} không tồn tại.")

        # Soft delete
        service.is_active = False
        self.session.add(service)
        await self.session.commit()
