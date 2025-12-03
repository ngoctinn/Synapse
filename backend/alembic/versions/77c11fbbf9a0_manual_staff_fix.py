"""manual_staff_fix

Revision ID: 77c11fbbf9a0
Revises: 70252cff6d08
Create Date: 2025-12-03 09:26:03.600513

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '77c11fbbf9a0'
down_revision: Union[str, None] = '70252cff6d08'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'))


def downgrade() -> None:
    op.drop_column('users', 'is_active')
