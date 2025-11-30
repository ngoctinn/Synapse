---
description: Thiết kế Schema, Migrations và Tối ưu hóa Database
---

1. **Phân tích Thay đổi Schema**:
   - Xác định các bảng (tables) hoặc trường (columns) cần thêm/sửa.
   - Kiểm tra quan hệ (Relationships) giữa các bảng.

2. **Cập nhật Models (SQLModel)**:
   - Sửa đổi file `models.py` trong module tương ứng (ví dụ: `backend/src/modules/users/models.py`).
   - Đảm bảo tuân thủ quy tắc `backend.md` (Async, Type hints).

3. **Tạo Migration (Alembic)**:
   - Chạy lệnh tạo migration: `docker-compose exec backend alembic revision --autogenerate -m "message"` (hoặc lệnh tương đương).
   - Kiểm tra file migration vừa tạo trong `backend/alembic/versions/`.
   - **QUAN TRỌNG**: Review kỹ file migration để đảm bảo không có lệnh drop không mong muốn.

4. **Apply Migration**:
   - Chạy lệnh apply: `docker-compose exec backend alembic upgrade head`.
   - Kiểm tra lại database (dùng `mcp0_execute_sql` hoặc `mcp0_list_tables` để verify).

5. **Cập nhật Types (Nếu cần)**:
   - Nếu thay đổi ảnh hưởng đến Frontend, cập nhật TypeScript types (có thể dùng `mcp0_generate_typescript_types`).
