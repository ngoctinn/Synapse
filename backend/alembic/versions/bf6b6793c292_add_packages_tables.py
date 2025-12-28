"""add_packages_tables

Revision ID: bf6b6793c292
Revises: b0170ba327bc
Create Date: 2025-12-28 13:38:55.362753

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision = 'bf6b6793c292'
down_revision = 'b0170ba327bc'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Tables already created manually via SQL, but keeping here for reference/consistency
    # We use execute to check if they exist to avoid errors
    op.execute("""
    CREATE TABLE IF NOT EXISTS service_packages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL,
        description VARCHAR,
        price DECIMAL(12, 2) DEFAULT 0,
        validity_days INTEGER,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    """)
    op.execute("""
    CREATE TABLE IF NOT EXISTS package_services (
        package_id UUID NOT NULL REFERENCES service_packages(id) ON DELETE CASCADE,
        service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
        quantity INTEGER DEFAULT 1,
        PRIMARY KEY (package_id, service_id)
    );
    """)

def downgrade() -> None:
    op.drop_table('package_services')
    op.drop_table('service_packages')
