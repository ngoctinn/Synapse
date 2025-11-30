# Báo Cáo Đánh Giá Backend: Module Users

**Ngày tạo:** 30/11/2025
**Người thực hiện:** AI Assistant
**Phạm vi:** `backend/src/modules/users`

## 1. Tuân Thủ Kiến Trúc (Modular Monolith)

- **Vertical Slices**: ✅ Module `users` có cấu trúc đầy đủ (`models.py`, `schemas.py`, `service.py`, `router.py`).
- **Public API**: ✅ `__init__.py` export `User` model.
- **Encapsulation**: ✅ Các import nội bộ và từ `common` đều hợp lệ.

## 2. Chất Lượng Code (Python & FastAPI)

### 🔴 Lỗi Nghiêm Trọng (Critical Issues)

1.  **Blocking I/O trong Async Function**:
    -   **File**: `src/modules/users/service.py`
    -   **Vị trí**: Hàm `invite_staff` (dòng 62).
    -   **Mô tả**: `supabase.auth.admin.invite_user_by_email` là một hàm đồng bộ (synchronous). Việc gọi nó trực tiếp trong `async def` sẽ chặn (block) event loop của FastAPI, làm giảm hiệu năng của toàn bộ server.
    -   **Giải pháp**: Chạy hàm này trong threadpool bằng `run_in_threadpool` hoặc sử dụng thư viện async nếu có.
    -   **Trạng thái**: ✅ Đã sửa (Wrap trong `run_in_threadpool`).

2.  **Thiếu Import**:
    -   **File**: `src/modules/users/service.py`
    -   **Vị trí**: Dòng 100, 101.
    -   **Mô tả**: Code sử dụng `datetime.now(timezone.utc)` nhưng chưa import `datetime` và `timezone`.
    -   **Hậu quả**: Gây lỗi `NameError` khi chạy fallback logic.
    -   **Trạng thái**: ✅ Đã sửa (Thêm import).

### 🟡 Cải Tiến (Improvements)

1.  **Error Handling**:
    -   **File**: `src/modules/users/service.py`
    -   **Mô tả**: Service đang raise trực tiếp `HTTPException`. Theo quy tắc Clean Code, nên xem xét việc wrap lỗi vào Domain Exceptions (ví dụ: `UserNotFoundError`, `InviteFailedError`) và để tầng Router hoặc Exception Handler xử lý việc chuyển đổi sang HTTP Status Code. Tuy nhiên, với mức độ hiện tại, `HTTPException` vẫn chấp nhận được nhưng cần lưu ý.

2.  **Hardcoded Strings**:
    -   **File**: `src/modules/users/router.py`
    -   **Mô tả**: Role "manager" được hardcode (dòng 42). Nên chuyển thành Constant hoặc Enum.
    -   **Trạng thái**: ✅ Đã sửa (Sử dụng `UserRole` Enum).

## 3. Tài Liệu & Định Danh

-   **Naming**: ✅ Tuân thủ `snake_case`.
-   **Ngôn ngữ**: ✅ Docstring và Comment đều là Tiếng Việt.
-   **Swagger Docs**: ✅ Docstring rõ ràng.

## 4. Đề Xuất Kế Hoạch Refactor

1.  **Sửa lỗi Missing Import**: Thêm `from datetime import datetime, timezone` vào `service.py`.
2.  **Xử lý Blocking I/O**: Wrap gọi Supabase trong `starlette.concurrency.run_in_threadpool`.
3.  **Refactor Constants**: Tạo file `constants.py` hoặc Enum trong `schemas.py` cho các Role.

---

**Hướng dẫn tiếp theo**:
Chạy workflow `/backend-refactor` và cung cấp đường dẫn file báo cáo này để tự động sửa lỗi.
