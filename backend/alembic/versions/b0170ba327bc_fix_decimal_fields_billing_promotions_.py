"""fix_decimal_fields_billing_promotions_bookings

Revision ID: b0170ba327bc
Revises: 5f35f45158c7
Create Date: 2025-12-27 10:11:37.607333

Mục đích:
- Đồng bộ SQLModel với max_digits/decimal_places native
- Code đã cập nhật: billing, promotions, bookings models
- DB schema không cần thay đổi vì NUMERIC type đã hỗ trợ precision linh hoạt

Các file đã sửa:
- billing/models.py: Thêm max_digits=12 cho total_amount, discount_amount, final_amount, amount
- promotions/models.py: Chuyển từ sa_column=Column(DECIMAL) sang max_digits/decimal_places
- bookings/models.py: Chuyển từ sa_type=DECIMAL sang max_digits/decimal_places
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b0170ba327bc'
down_revision: Union[str, None] = '5f35f45158c7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Không cần thay đổi DB schema
    # SQLModel native max_digits/decimal_places tương thích với NUMERIC trong Postgres
    # Migration này chỉ để đánh dấu version sau khi sửa code
    pass


def downgrade() -> None:
    # Không cần rollback vì DB không thay đổi
    pass

