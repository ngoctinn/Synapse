# Báo Cáo Strategic Review: Backend Synapse

**Ngày:** 03/12/2025
**Người thực hiện:** AI Assistant
**Phạm vi:** Toàn bộ Backend (`src/modules`, `src/common`)

---

## 1. Tổng Quan
Backend của Synapse được xây dựng trên kiến trúc **Modular Monolith** với **FastAPI** và **SQLModel**. Dự án tuân thủ tốt các nguyên tắc cơ bản về Async/Await và Type Hinting. Tuy nhiên, có sự không nhất quán giữa các module cũ (`users`) và module mới (`staff`, `services`) về cách xử lý lỗi và cấu trúc import.

## 2. Phân Tích Chi Tiết

### 2.1. Kiến Trúc & Design Patterns
-   **Modular Monolith**: ✅ Cấu trúc thư mục chia theo module (`users`, `staff`, `services`) là hợp lý.
-   **Vertical Slices**: ✅ Mỗi module có đầy đủ các tầng (Router, Service, Model, Schema).
-   **Public API**: ⚠️ Module `users` chưa tuân thủ triệt để.
    -   `staff` import `User` từ `src.modules.users` (Đúng).
    -   `users` service vẫn import `User` từ `src.modules.users.models` (Nội bộ - Chấp nhận được nhưng chưa nhất quán).

### 2.2. Chất Lượng Mã Nguồn (Code Quality)
-   **Error Handling**: ❌ **Không nhất quán**.
    -   `staff`, `services`: Sử dụng **Domain Exceptions** (VD: `StaffNotFound`, `ServiceNotFoundError`) -> Router bắt lỗi và map sang HTTP 404/400. (✅ Best Practice).
    -   `users`: Service `raise HTTPException` trực tiếp. Điều này làm Service phụ thuộc vào tầng HTTP (FastAPI) và khó tái sử dụng hoặc test độc lập.
-   **Dead Code / Duplication**: ⚠️
    -   `UserService.invite_staff`: Logic này dường như bị trùng lặp với `StaffService.invite_staff`. Comment trong code cũng ghi chú là "Logic này đã di chuyển sang staff module". Cần loại bỏ để tránh nhầm lẫn.
-   **Type Hinting**: ✅ Sử dụng tốt `Annotated`, `uuid.UUID`, và Pydantic V2.

### 2.3. Bảo Mật & Hiệu Năng
-   **RLS (Row Level Security)**: ✅ `get_db_session` trong `common/database.py` đã inject `request.jwt.claims` chính xác. Đây là điểm cộng lớn về bảo mật.
-   **Async/Await**: ✅ Tuân thủ "Async All The Way".
-   **N+1 Problem**: ✅ Module `services` sử dụng `selectinload` để load relationships. Cần đảm bảo các module khác cũng áp dụng Eager Loading khi cần thiết.

### 2.4. Testing
-   **Automated Tests**: ❌ **CRITICAL MISSING**.
    -   Không tìm thấy thư mục `tests/` hoặc bất kỳ bài test nào (Unit/Integration).
    -   Rủi ro: Khó đảm bảo tính ổn định khi refactor hoặc thêm tính năng mới.

## 3. Đề Xuất Cải Tiến (Action Plan)

### Giai Đoạn 1: Chuẩn Hóa (Refactoring)
1.  **Refactor Module Users**:
    -   Chuyển `HTTPException` sang Domain Exceptions (`UserNotFound`, `UserAlreadyExists`).
    -   Loại bỏ Dead Code (`invite_staff` trong `UserService`).
    -   Cập nhật Router để xử lý Exception.
2.  **Standardize Imports**: Đảm bảo tất cả module đều import qua Public API (`__init__.py`).

### Giai Đoạn 2: Đảm Bảo Chất Lượng (Testing)
3.  **Thiết lập Testing Framework**:
    -   Cài đặt `pytest` và `pytest-asyncio`.
    -   Cấu hình `conftest.py` để mock DB session hoặc chạy trên Test DB.
4.  **Viết Unit Tests**:
    -   Ưu tiên test cho `StaffService` và `UserService` (các logic quan trọng như invite, update profile).

### Giai Đoạn 3: Mở Rộng
5.  **Common Utilities**:
    -   Chuyển các hàm tiện ích (như `slugify` trong `services`) vào `src/common/utils.py` để tái sử dụng.

## 4. Kết Luận
Backend có nền tảng tốt nhưng cần một đợt "dọn dẹp" (Refactor) để đồng bộ hóa phong cách code giữa các module. Việc thiếu Automated Tests là lỗ hổng lớn nhất cần được khắc phục sớm.
