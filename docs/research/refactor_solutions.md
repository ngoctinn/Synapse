# Nghiên cứu Giải pháp Refactor Backend (Research Report)

## 1. Giải quyết SQL Injection trong SQLModel

Để thay thế các câu lệnh `text()` thiếu an toàn hiện tại, chúng ta có 2 phương án chính:

### Phương án A: Sử dụng SQLModel Select API (Khuyến nghị)
Sử dụng trực tiếp các phương thức của SQLModel giúp tự động tham số hóa dữ liệu.
```python
# Cũ
query = text(f"SELECT * FROM staff_profiles WHERE user_id IN ({ids})")
# Mới
from sqlmodel import select
query = select(StaffProfile).where(col(StaffProfile.user_id).in_(staff_ids))
```

### Phương án B: Sử dụng Bind Parameters trong `text()`
Nếu bắt buộc phải dùng raw SQL cho các query phức tạp:
```python
from sqlalchemy import text
# Dùng named parameters
query = text("SELECT * FROM staff_profiles WHERE user_id = :user_id")
result = await session.exec(query, {"user_id": user_id})

# Đối với mệnh đề IN
from sqlalchemy import bindparam
query = text("SELECT * FROM staff_profiles WHERE user_id IN :staff_ids")
query = query.bindparams(bindparam("staff_ids", expanding=True))
result = await session.exec(query, {"staff_ids": list_of_ids})
```

## 2. Hỗ trợ Public Access (Optional Authentication)

Để cho phép một số route có thể truy cập mà không cần Token, cấu trúc của `get_db_session` cần thay đổi:

1. **Dependency mới**: `get_token_optional`.
2. **Logic RLS**:
   - Nếu có token: `SET LOCAL role TO 'authenticated'` và inject claims.
   - Nếu không có token: `SET LOCAL role TO 'anon'`.

## 3. Chuẩn hóa Role: ADMIN -> MANAGER

Theo yêu cầu chuẩn hóa toàn bộ hệ thống sang `MANAGER`:

### Bước 1: Database Migration (Alembic)
PostgreSQL Enum không cho phép xóa value trực tiếp một cách dễ dàng. Quy trình chuẩn là:
```sql
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'manager';
-- Sau đó cập nhật dữ liệu cũ
UPDATE users SET role = 'manager' WHERE role = 'admin';
-- Lưu ý: Không nên xóa role 'admin' ngay nếu hệ thống Supabase/Auth vẫn phụ thuộc.
```

### Bước 2: Cập nhật Python Code
- Thay thế `UserRole.ADMIN` bằng `UserRole.MANAGER` trong `constants.py`.
- Rà soát các logic `Depends(RoleChecker([UserRole.ADMIN]))`.

## Đề xuất
- **Bảo mật**: Chuyển tối bà sang SQLModel Select API để tận dụng tính năng tự động binding.
- **Hạ tầng**: Implement `get_token_optional` để mở khóa các public routes.
- **Roles**: Thêm role `manager` vào DB và gộp logic Admin vào Manager trong code.
