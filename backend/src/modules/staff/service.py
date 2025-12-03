"""
Staff Module - Business Logic (Service Layer)

Chứa toàn bộ logic nghiệp vụ liên quan đến quản lý nhân viên.
"""

import uuid
import random
import asyncio
from datetime import date, datetime, timezone
from fastapi import Depends, HTTPException
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession

from src.common.database import get_db_session
from src.common.supabase_admin import get_supabase_admin
from src.app.config import settings

from .models import Staff, StaffSkill
from .schemas import (
    StaffInvite,
    StaffCreate,
    StaffUpdate,
    StaffSkillsUpdate,
    StaffListResponse
)
from src.modules.users import User
from src.modules.services import Skill
from src.modules.users.constants import UserRole
from .exceptions import StaffNotFound, StaffAlreadyExists, StaffOperationError


class StaffService:
    """Service xử lý nghiệp vụ Staff"""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def invite_staff(self, data: StaffInvite) -> dict:
        """
        Mời nhân viên mới: Tạo User (qua Supabase) + Staff profile.

        Logic:
        1. Tạo User qua Supabase Admin API (gửi email invite).
        2. Tạo Staff profile tương ứng trong DB.

        Args:
            data (StaffInvite): Thông tin nhân viên cần mời.

        Returns:
            dict: Thông báo và user_id.

        Raises:
            StaffAlreadyExists: Nếu email đã tồn tại.
            StaffOperationError: Lỗi khi tạo User.
        """
        # 1. Tạo User qua Supabase Admin API
        supabase_admin = get_supabase_admin()

        try:
            # Gọi Supabase để tạo User và gửi email invite
            auth_response = await supabase_admin.auth.admin.invite_user_by_email(
                email=data.email,
                options={
                    "data": {  # user_metadata
                        "role": data.role,
                        "full_name": data.full_name
                    },
                    "redirect_to": f"{settings.FRONTEND_URL}/setup-account"
                }
            )

            user_id = uuid.UUID(auth_response.user.id)

        except Exception as e:
            error_msg = str(e).lower()
            # Xử lý trường hợp User đã tồn tại -> Kiểm tra để Promote
            if "already registered" in error_msg or "already exists" in error_msg:
                # Lấy user_id từ email (cần query DB)
                # Lưu ý: Supabase Admin API không trả về user_id khi lỗi duplicate
                # Nên ta phải tìm trong DB local
                query = select(User).where(User.email == data.email)
                result = await self.session.exec(query)
                existing_user = result.first()

                if not existing_user:
                    # Trường hợp hiếm: Có trên Supabase nhưng chưa có trong DB local
                    # Có thể do lỗi đồng bộ trước đó.
                    # TODO: Gọi Supabase Admin getUserById/Email để lấy ID và sync lại
                    raise StaffOperationError(f"Email {data.email} tồn tại trên Auth nhưng không tìm thấy trong DB. Vui lòng liên hệ Admin.")

                user_id = existing_user.id

                # Kiểm tra xem đã là Staff chưa
                existing_staff = await self.session.get(Staff, user_id)
                if existing_staff:
                    raise StaffAlreadyExists(f"Nhân viên với email {data.email} đã tồn tại.")

                # Nếu chưa là Staff -> Cho phép Promote (sẽ chạy xuống logic tạo Staff bên dưới)
                # Cập nhật Role cho User
                existing_user.role = data.role
                existing_user.full_name = data.full_name # Cập nhật tên mới nhất
                self.session.add(existing_user)
                # Commit ở bước cuối cùng
            else:
                raise StaffOperationError(f"Lỗi khi tạo User: {str(e)}")

        # 2. Tạo Staff profile tương ứng
        # Retry mechanism để chờ Trigger tạo User (nếu là user mới)
        if 'auth_response' in locals(): # Chỉ retry nếu vừa tạo mới user
            retries = 5
            for i in range(retries):
                user = await self.session.get(User, user_id)
                if user:
                    break
                await asyncio.sleep(0.5) # Chờ 0.5s

            if not user:
                 raise StaffOperationError("Lỗi đồng bộ dữ liệu: User không được tạo kịp thời trong Database.")

        staff = Staff(
            user_id=user_id,
            title=data.title,
            hired_at=date.today(),
            bio=data.bio or "",
            color_code=self._generate_random_color(),
            commission_rate=0.0  # Mặc định, admin sẽ cập nhật sau
        )

        self.session.add(staff)
        await self.session.commit()
        await self.session.refresh(staff)

        return {
            "message": f"Đã thêm nhân viên {data.email}",
            "user_id": str(staff.user_id)
        }

    async def get_staff_list(
        self,
        page: int = 1,
        limit: int = 10,
        role_filter: str | None = None,
        is_active: bool | None = None
    ) -> StaffListResponse:
        """
        Lấy danh sách nhân viên (với pagination).

        Args:
            page (int): Trang hiện tại (1-indexed).
            limit (int): Số lượng staff mỗi trang.
            role_filter (str | None): Lọc theo role (admin, receptionist, technician).
            is_active (bool | None): Lọc theo trạng thái hoạt động.

        Returns:
            StaffListResponse: Danh sách staff và metadata.
        """
        # Build query với JOIN User
        query = (
            select(Staff)
            .join(User, Staff.user_id == User.id)
        )

        # Apply filters
        if role_filter:
            query = query.where(User.role == role_filter)

        if is_active is not None:
            query = query.where(User.is_active == is_active)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total = await self.session.scalar(count_query)

        # Pagination
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)

        # Execute
        result = await self.session.exec(query)
        staff_list = result.all()

        return StaffListResponse(
            data=staff_list,
            total=total,
            page=page,
            limit=limit
        )

    async def get_staff_by_id(self, user_id: uuid.UUID) -> Staff:
        """
        Lấy chi tiết 1 nhân viên (kèm User info và Skills).

        Args:
            user_id (uuid.UUID): UUID của user.

        Returns:
            Staff: Thông tin staff đầy đủ.

        Raises:
            StaffNotFound: Nếu không tìm thấy.
        """
        # Query với eager loading (user và skills)
        query = (
            select(Staff)
            .where(Staff.user_id == user_id)
        )

        result = await self.session.exec(query)
        staff = result.first()

        if not staff:
            raise StaffNotFound(f"Không tìm thấy nhân viên với ID {user_id}")

        return staff

    async def create_staff(self, data: StaffCreate) -> Staff:
        """
        Tạo Staff profile cho User đã tồn tại.
        (Dùng khi User đã được tạo từ nguồn khác).

        Args:
            data (StaffCreate): Thông tin staff.

        Returns:
            Staff: Staff profile vừa tạo.

        Raises:
            StaffNotFound: Nếu User không tồn tại.
            StaffAlreadyExists: Nếu đã có Staff profile.
            StaffOperationError: Nếu User là customer.
        """
        # 1. Kiểm tra User tồn tại
        user = await self.session.get(User, data.user_id)
        if not user:
            raise StaffNotFound(f"Không tìm thấy User với ID {data.user_id}")

        # 2. Kiểm tra User phải không phải customer
        if user.role == UserRole.CUSTOMER:
            raise StaffOperationError("Không thể tạo Staff profile cho khách hàng")

        # 3. Kiểm tra chưa có Staff profile
        existing = await self.session.get(Staff, data.user_id)
        if existing:
            raise StaffAlreadyExists("User này đã có Staff profile")

        # 4. Tạo Staff
        staff = Staff(**data.model_dump())
        self.session.add(staff)
        await self.session.commit()
        await self.session.refresh(staff)

        return staff

    async def update_staff(
        self,
        user_id: uuid.UUID,
        data: StaffUpdate
    ) -> Staff:
        """
        Cập nhật thông tin Staff.

        Args:
            user_id (uuid.UUID): UUID của user.
            data (StaffUpdate): Dữ liệu cập nhật (partial).

        Returns:
            Staff: Staff đã cập nhật.
        """
        staff = await self.get_staff_by_id(user_id)

        # Cập nhật các trường không None
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(staff, key, value)

        staff.updated_at = datetime.now(timezone.utc)

        await self.session.commit()
        await self.session.refresh(staff)

        return staff

    async def deactivate_staff(self, user_id: uuid.UUID) -> dict:
        """
        Vô hiệu hóa tài khoản nhân viên (soft delete).

        Args:
            user_id (uuid.UUID): UUID của user.

        Returns:
            dict: Thông báo.
        """
        # Lấy User (không phải Staff) để set is_active
        user = await self.session.get(User, user_id)
        if not user:
            raise StaffNotFound("Không tìm thấy nhân viên")

        user.is_active = False
        user.updated_at = datetime.now(timezone.utc)

        await self.session.commit()

        return {"message": f"Đã vô hiệu hóa tài khoản {user.full_name}"}

    async def update_staff_skills(
        self,
        user_id: uuid.UUID,
        data: StaffSkillsUpdate
    ) -> Staff:
        """
        Gán kỹ năng cho nhân viên (replace strategy).

        Logic:
        1. Validate: User phải là TECHNICIAN.
        2. Xóa toàn bộ StaffSkill cũ.
        3. Thêm StaffSkill mới.

        Args:
            user_id (uuid.UUID): UUID của user.
            data (StaffSkillsUpdate): Danh sách skill_ids mới.

        Returns:
            Staff: Staff với skills đã cập nhật.

        Raises:
            StaffOperationError: Nếu không phải TECHNICIAN hoặc skill không tồn tại.
        """
        # 1. Lấy User để kiểm tra role
        user = await self.session.get(User, user_id)
        if not user:
            raise StaffNotFound("Không tìm thấy nhân viên")

        if user.role != UserRole.TECHNICIAN:
            raise StaffOperationError("Chỉ Kỹ thuật viên mới có thể gán kỹ năng")

        # 2. Xóa toàn bộ StaffSkill cũ
        delete_query = select(StaffSkill).where(StaffSkill.staff_id == user_id)
        old_skills = await self.session.exec(delete_query)
        for old_skill in old_skills:
            await self.session.delete(old_skill)

        # 3. Thêm StaffSkill mới
        for skill_id in data.skill_ids:
            # Validate skill tồn tại
            skill = await self.session.get(Skill, skill_id)
            if not skill:
                raise StaffOperationError(f"Không tìm thấy skill với ID {skill_id}")

            staff_skill = StaffSkill(staff_id=user_id, skill_id=skill_id)
            self.session.add(staff_skill)

        await self.session.commit()

        # 4. Trả về Staff với skills mới
        return await self.get_staff_by_id(user_id)

    def _generate_random_color(self) -> str:
        """Tạo màu ngẫu nhiên từ palette cho Staff"""
        colors = [
            "#3B82F6",  # Blue
            "#F59E0B",  # Amber
            "#10B981",  # Green
            "#EF4444",  # Red
            "#8B5CF6",  # Purple
            "#EC4899",  # Pink
            "#06B6D4",  # Cyan
        ]
        return random.choice(colors)
