"""
Supabase Admin Client - Shared Service

Module này cung cấp Supabase Client với quyền Admin (Service Role)
để các module khác có thể tạo/quản lý User qua Supabase Admin API.

Sử dụng:
    from src.common.supabase_admin import get_supabase_admin

    supabase = get_supabase_admin()
    result = supabase.auth.admin.invite_user_by_email(...)
"""

from supabase import create_client, Client
from src.app.config import settings


def get_supabase_admin() -> Client:
    """
    Trả về Supabase Client với quyền Admin (Service Role Key).

    Được dùng để:
    - Tạo User mới (invite_user_by_email, create_user).
    - Reset password.
    - Xóa User.
    - Quản lý User metadata.

    Returns:
        Client: Supabase client instance với full quyền.
    """
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY
    )
