# Analysis Log - Comprehensive Backend Testing

## 1. Phát hiện về Database (Database Findings)
- **Dependency**: `src.common.database.get_db_session`.
- **Cơ chế**: Sử dụng `Annotated[dict | None, Depends(get_token_payload_optional)]` để lấy `token_payload` và thực hiện `SET LOCAL role` cho RLS.
- **Thách thức**: Khi test bằng SQLite in-memory, cơ chế `SET LOCAL role` của Postgres sẽ không hoạt động.
- **Giải pháp**:
    - **Unit Test**: Mock hoàn toàn `AsyncSession` và Service.
    - **Integration Test**: Sử dụng Postgres Test DB thật để kiểm chứng RLS logic.

## 2. Phát hiện về Xác thực (Authentication Findings)
- **Dependencies**: `get_token_payload`, `get_token_payload_optional`.
- **Cơ chế**: Giải mã JWT dựa trên `settings.SUPABASE_JWT_SECRET`.
- **Giải pháp**:
    - Tạo `auth_mock` fixture trong `conftest.py` để override các dependency này, trả về payload giả lập các vai trò (Admin, Staff, Customer).

## 3. Thư viện còn thiếu (Missing Dependencies)
Cần bổ sung vào `pyproject.toml` và cài đặt:
- `pytest`: Framework test.
- `pytest-asyncio`: Xử lý async tests.
- `httpx`: Thay thế `TestClient` chuẩn để hỗ trợ async requests tốt hơn.
- `pytest-mock`: Hỗ trợ patch dependencies dễ dàng.

## 4. Rủi ro và Ràng buộc (Risks & Constraints)
- **RLS**: Row Level Security là phần quan trọng nhất cần test. Nếu chỉ test logic Python mà không test RLS thì độ tin cậy chỉ đạt 50%.
- **Timezones**: Cần đảm bảo dữ liệu mock trong test đồng quán với chuẩn Timezone của dự án.

## 5. Danh sách File ảnh hưởng (Affected Files)
- `backend/pyproject.toml` (Cập nhật deps).
- `backend/tests/conftest.py` (Tạo mới).
- Toàn bộ `router.py` và `service.py` trong 17 modules.
