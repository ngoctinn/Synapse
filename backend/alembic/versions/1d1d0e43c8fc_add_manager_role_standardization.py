"""add_manager_role_standardization

Revision ID: 1d1d0e43c8fc
Revises: b9df64f282fd
Create Date: 2025-12-20 16:19:56.759109

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1d1d0e43c8fc'
down_revision: Union[str, None] = 'b9df64f282fd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Cập nhật dữ liệu người dùng cũ từ 'admin' sang 'manager'
    # Vì bảng 'users' sử dụng kiểu dữ liệu String (varchar) cho cột 'role'
    op.execute("UPDATE users SET role = 'manager' WHERE role = 'admin'")

def downgrade() -> None:
    # Quay lại 'admin' cho các manager nếu cần rollback
    op.execute("UPDATE users SET role = 'admin' WHERE role = 'manager'")
