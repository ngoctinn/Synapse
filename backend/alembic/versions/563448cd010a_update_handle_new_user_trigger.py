"""update_handle_new_user_trigger

Revision ID: 563448cd010a
Revises: e2bb40c3dcee
Create Date: 2025-11-29 18:28:31.426153

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '563448cd010a'
down_revision: Union[str, None] = 'e2bb40c3dcee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Update Trigger for automatic profile creation with new fields
    op.execute("""
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.users (id, email, full_name, avatar_url, phone_number, role, address, date_of_birth)
      VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url',
        new.raw_user_meta_data->>'phone_number',
        COALESCE(new.raw_user_meta_data->>'role', 'customer'),
        new.raw_user_meta_data->>'address',
        NULLIF(new.raw_user_meta_data->>'date_of_birth', '')::date
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        phone_number = EXCLUDED.phone_number,
        role = EXCLUDED.role,
        address = EXCLUDED.address,
        date_of_birth = EXCLUDED.date_of_birth;
      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    """)


def downgrade() -> None:
    # Revert to original Trigger (only basic fields)
    op.execute("""
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.users (id, email, full_name, avatar_url)
      VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
      );
      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    """)
