"""refactor_database_v2_2

Revision ID: 5f35f45158c7
Revises: 7e40273d288a
Create Date: 2025-12-27 09:56:20.367520

Thay đổi:
1. ALTER services.price: double precision -> DECIMAL(12,2)
2. ALTER staff.commission_rate: double precision -> DECIMAL(5,2)
3. DROP users.phone_number, users.address, users.date_of_birth
4. DROP booking_items.resource_id (legacy column)
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5f35f45158c7'
down_revision: Union[str, None] = '7e40273d288a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. ALTER services.price: double precision -> DECIMAL(12,2)
    op.alter_column(
        'services',
        'price',
        existing_type=sa.Float(),
        type_=sa.DECIMAL(12, 2),
        existing_nullable=True,
        postgresql_using='price::numeric(12,2)'
    )

    # 2. ALTER staff.commission_rate: double precision -> DECIMAL(5,2)
    op.alter_column(
        'staff',
        'commission_rate',
        existing_type=sa.Float(),
        type_=sa.DECIMAL(5, 2),
        existing_nullable=True,
        postgresql_using='commission_rate::numeric(5,2)'
    )

    # 3. DROP redundant columns from users table
    # Theo thiết kế v2.2, bảng users chỉ quản lý Auth
    op.drop_column('users', 'phone_number')
    op.drop_column('users', 'address')
    op.drop_column('users', 'date_of_birth')

    # 4. DROP legacy resource_id từ booking_items (đã chuyển sang N-N)
    # Kiểm tra xem cột có tồn tại trước khi xóa
    conn = op.get_bind()
    result = conn.execute(sa.text("""
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'booking_items' AND column_name = 'resource_id'
    """))
    if result.fetchone():
        op.drop_column('booking_items', 'resource_id')


def downgrade() -> None:
    # 4. Restore resource_id (if dropped)
    op.add_column(
        'booking_items',
        sa.Column('resource_id', sa.UUID(), nullable=True)
    )

    # 3. Restore users columns
    op.add_column('users', sa.Column('date_of_birth', sa.DATE(), nullable=True))
    op.add_column('users', sa.Column('address', sa.TEXT(), nullable=True))
    op.add_column('users', sa.Column('phone_number', sa.VARCHAR(50), nullable=True))

    # 2. Restore staff.commission_rate to Float
    op.alter_column(
        'staff',
        'commission_rate',
        existing_type=sa.DECIMAL(5, 2),
        type_=sa.Float(),
        existing_nullable=True
    )

    # 1. Restore services.price to Float
    op.alter_column(
        'services',
        'price',
        existing_type=sa.DECIMAL(12, 2),
        type_=sa.Float(),
        existing_nullable=True
    )

