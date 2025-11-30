from typing import Annotated
import uuid
import re
import unicodedata
from fastapi import Depends, HTTPException, status
from sqlmodel import select
from sqlalchemy.orm import selectinload
from sqlmodel.ext.asyncio.session import AsyncSession
from src.app.dependencies import get_db_session
from src.modules.services.models import Service, Skill, ServiceSkill
from src.modules.services.schemas import ServiceCreate, ServiceUpdate, SkillCreate, SkillUpdate

class ServiceManagementService:
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        self.session = session

    # --- SKILLS ---
    async def get_skills(self) -> list[Skill]:
        result = await self.session.exec(select(Skill))
        return list(result.all())

    async def create_skill(self, skill_in: SkillCreate) -> Skill:
        # Kiểm tra mã trùng lặp
        existing_skill = await self.session.exec(select(Skill).where(Skill.code == skill_in.code))
        if existing_skill.first():
            raise HTTPException(status_code=400, detail="Mã kỹ năng đã tồn tại")

        skill = Skill.model_validate(skill_in)
        self.session.add(skill)
        await self.session.commit()
        await self.session.refresh(skill)
        return skill

    async def update_skill(self, skill_id: uuid.UUID, skill_in: SkillUpdate) -> Skill:
        skill = await self.session.get(Skill, skill_id)
        if not skill:
            raise HTTPException(status_code=404, detail="Kỹ năng không tồn tại")

        update_data = skill_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(skill, key, value)

        self.session.add(skill)
        await self.session.commit()
        await self.session.refresh(skill)
        return skill

    async def delete_skill(self, skill_id: uuid.UUID):
        skill = await self.session.get(Skill, skill_id)
        if not skill:
            raise HTTPException(status_code=404, detail="Kỹ năng không tồn tại")
        await self.session.delete(skill)
        await self.session.commit()

    # --- SERVICES ---
    async def get_services(self, only_active: bool = False) -> list[Service]:
        query = select(Service).options(
            selectinload(Service.skills)
        )

        if only_active:
            query = query.where(Service.is_active == True)

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
            raise HTTPException(status_code=404, detail="Dịch vụ không tồn tại")

        return service

    async def _get_or_create_skills(self, skill_names: list[str]) -> list[uuid.UUID]:
        # Helper để lấy hoặc tạo kỹ năng theo tên (Tối ưu hóa)
        if not skill_names:
            return []



        def simple_slugify(text):
            text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
            text = re.sub(r'[^\w\s-]', '', text).strip().lower()
            return re.sub(r'[-\s]+', '_', text)

        # 1. Chuẩn bị mã (codes)
        name_map = {f"SK_{simple_slugify(name).upper()}": name for name in skill_names}
        codes = list(name_map.keys())

        # 2. Tìm kiếm kỹ năng đã tồn tại
        query = select(Skill).where(Skill.code.in_(codes))
        result = await self.session.exec(query)
        existing_skills = result.all()
        existing_codes = {skill.code for skill in existing_skills}

        skill_ids = [skill.id for skill in existing_skills]

        # 3. Tạo kỹ năng còn thiếu
        new_skills = []
        for code, name in name_map.items():
            if code not in existing_codes:
                new_skill = Skill(name=name, code=code)
                new_skills.append(new_skill)

        if new_skills:
            self.session.add_all(new_skills)
            await self.session.flush() # Lấy ID mà không cần commit ngay
            skill_ids.extend([skill.id for skill in new_skills])

        return skill_ids

    async def create_service(self, service_in: ServiceCreate) -> Service:
        # 1. Xử lý Smart Tagging & Skill IDs
        final_skill_ids = set(service_in.skill_ids)
        if service_in.new_skills:
            new_ids = await self._get_or_create_skills(service_in.new_skills)
            final_skill_ids.update(new_ids)

        # 2. Tạo Dịch vụ
        service_data = service_in.model_dump(exclude={"skill_ids", "new_skills"})
        service = Service(**service_data)
        self.session.add(service)
        await self.session.flush() # Lấy Service ID

        # 3. Chèn hàng loạt liên kết (Bulk Insert Links)
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
        # Load service cùng với các liên kết hiện có
        query = select(Service).where(Service.id == service_id).options(
            selectinload(Service.skill_links)
        )
        result = await self.session.exec(query)
        service = result.first()

        if not service:
            raise HTTPException(status_code=404, detail="Dịch vụ không tồn tại")

        # Xử lý Smart Tagging
        final_skill_ids = None
        if service_in.skill_ids is not None:
            final_skill_ids = set(service_in.skill_ids)
            if service_in.new_skills:
                new_ids = await self._get_or_create_skills(service_in.new_skills)
                final_skill_ids.update(new_ids)

        # Cập nhật các trường cơ bản
        update_data = service_in.model_dump(exclude_unset=True, exclude={"skill_ids", "new_skills"})
        for key, value in update_data.items():
            setattr(service, key, value)

        # Cập nhật Skills nếu được cung cấp
        if final_skill_ids is not None:
            current_skill_ids = {link.skill_id for link in service.skill_links}

            # Thêm mới (To Add)
            to_add = final_skill_ids - current_skill_ids
            new_links = [
                ServiceSkill(service_id=service.id, skill_id=skill_id)
                for skill_id in to_add
            ]
            if new_links:
                self.session.add_all(new_links)

            # Xóa bỏ (To Remove)
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
            raise HTTPException(status_code=404, detail="Dịch vụ không tồn tại")

        # Xóa mềm (Soft delete)
        service.is_active = False
        self.session.add(service)
        await self.session.commit()
