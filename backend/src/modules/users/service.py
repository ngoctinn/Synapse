from typing import Annotated
import uuid
from fastapi import Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from src.app.dependencies import get_db_session
from src.modules.users.models import User
from src.modules.users.schemas import UserUpdate, InviteStaffRequest

class UserService:
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]):
        self.session = session

    async def get_profile(self, user_id: uuid.UUID) -> User:
        """
        Lấy thông tin hồ sơ người dùng.
        """
        user = await self.session.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Người dùng không tồn tại"
            )
        return user

    async def update_profile(self, user: User, user_update: UserUpdate) -> User:
        """
        Cập nhật thông tin hồ sơ người dùng.
        """
        user_data = user_update.model_dump(exclude_unset=True)
        for key, value in user_data.items():
            setattr(user, key, value)

        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def invite_staff(self, invite_data: "InviteStaffRequest") -> User:
        """
        Mời nhân viên mới qua email sử dụng Supabase Admin API.
        """
        from supabase import create_client, Client
        from src.app.config import settings

        # 1. Khởi tạo Supabase Admin Client
        supabase: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )

        # 2. Chuẩn bị Metadata
        user_metadata = {
            "full_name": invite_data.full_name,
            "phone_number": invite_data.phone_number,
            "role": invite_data.role,
            "address": invite_data.address,
            "date_of_birth": str(invite_data.date_of_birth) if invite_data.date_of_birth else None
        }

        # 3. Gọi Supabase Invite API
        # Trigger handle_new_user sẽ tự động chạy và insert vào public.users
        try:
            response = supabase.auth.admin.invite_user_by_email(
                email=invite_data.email,
                options={"data": user_metadata}
            )
            user_id = uuid.UUID(response.user.id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Lỗi khi gửi lời mời: {str(e)}"
            )

        # 4. Xử lý Skills nếu là Technician
        if invite_data.role == "technician" and invite_data.skill_ids:
            # TODO: Implement skill insertion logic here
            # For now, we assume skills table exists or will be implemented separately
            pass

        # 5. Trả về thông tin User vừa tạo (lấy từ DB để đảm bảo đồng bộ)
        # Cần chờ một chút hoặc retry nếu trigger chạy chậm (tuy nhiên trong cùng transaction Postgres thì thường là ngay lập tức)
        # Nhưng ở đây Supabase Auth và DB là 2 service khác nhau nếu dùng Supabase Cloud.
        # Nếu self-hosted hoặc local thì chung DB.
        # Với kiến trúc hiện tại, ta sẽ query lại từ DB.

        # Lưu ý: Trigger chạy bất đồng bộ hoặc đồng bộ tùy cấu hình Supabase.
        # Tuy nhiên, để an toàn, ta trả về thông tin từ response của Supabase Auth trước,
        # hoặc query DB với retry logic. Ở đây ta query DB.

        user = await self.session.get(User, user_id)
        if not user:
             # Fallback nếu trigger chưa kịp chạy xong (hiếm gặp nhưng có thể)
             # Trả về object User tạm thời từ request
             return User(
                 id=user_id,
                 email=invite_data.email,
                 full_name=invite_data.full_name,
                 role=invite_data.role,
                 phone_number=invite_data.phone_number,
                 avatar_url=None,
                 created_at=datetime.now(timezone.utc),
                 updated_at=datetime.now(timezone.utc)
             )

        return user
