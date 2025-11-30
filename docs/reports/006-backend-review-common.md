# Báo Cáo Đánh Giá Backend: Common Layer

**Ngày:** 30/11/2025
**Người thực hiện:** AI Assistant
**Phạm vi:** `backend/src/common`

## 1. Tổng Quan
Thư mục `src/common` đóng vai trò là Shared Kernel, chứa các mã hạ tầng dùng chung (Database, Security, Logging). Nó **không được phép** chứa logic nghiệp vụ hoặc phụ thuộc vào các Module nghiệp vụ (`src/modules`) hay tầng ứng dụng (`src/app`).

**Trạng thái hiện tại:** 🟢 **ĐÃ KHẮC PHỤC**
Đã refactor để tuân thủ kiến trúc Modular Monolith. Các vi phạm phụ thuộc vòng đã được giải quyết.

## 2. Vi Phạm Kiến Trúc (Architectural Violations)

### 🔴 2.1. Common phụ thuộc vào Modules (Critical)
- **File:** `src/common/security.py`
- **Vi phạm:** Import `User` model từ `src.modules.users.models`.
- **Mã vi phạm:**
  ```python
  from src.modules.users.models import User
  ```
- **Giải thích:** `common` nằm ở tầng thấp nhất. Việc import từ `modules` tạo ra vòng lặp phụ thuộc (Circular Dependency) tiềm ẩn và phá vỡ nguyên tắc Modular Monolith. `common` không nên biết về `User` entity cụ thể.
- **Đề xuất:** Di chuyển hàm `get_current_user` ra khỏi `common`. Hàm này thuộc về nghiệp vụ User hoặc tầng `app` (composition root). `common` chỉ nên chứa `get_token_payload` (xử lý JWT thuần túy).

### 🔴 2.2. Common phụ thuộc vào App (Layering Violation)
- **File:** `src/common/security.py`
- **Vi phạm:** Import `get_db_session` từ `src.app.dependencies`.
- **Mã vi phạm:**
  ```python
  from src.app.dependencies import get_db_session
  ```
- **Giải thích:** `app` phụ thuộc vào `common`. Việc `common` import ngược lại `app` tạo ra sự phụ thuộc vòng.
- **Đề xuất:**
    1.  Chuyển `get_db_session` về `src/common/database.py` (nếu nó chỉ phụ thuộc vào `engine` và `sessionmaker` trong `common`).
    2.  Hoặc di chuyển `get_current_user` (người tiêu thụ dependency này) lên tầng `app` hoặc `modules`.

## 3. Vấn Đề Chất Lượng Code (Code Quality & Smells)

### 🟡 3.1. Hardcoded Values (Auth Core)
- **File:** `src/common/auth_core.py`
- **Vấn đề:** Các tham số JWT được fix cứng.
  ```python
  algorithms=["HS256"],
  audience="authenticated",
  leeway=60
  ```
- **Đề xuất:** Đưa vào `src/app/config.py` hoặc định nghĩa hằng số (Constants).

### 🟡 3.2. Sử dụng trực tiếp HTTPException
- **File:** `src/common/auth_core.py`, `src/common/security.py`
- **Vấn đề:** Raise `HTTPException` trực tiếp.
- **Đề xuất:** Nên định nghĩa các Exception cơ bản trong `common/exceptions.py` (ví dụ `AuthError`, `NotFoundError`) để dễ quản lý và tái sử dụng.

### 🟡 3.3. Thiếu Docstrings & Type Hinting chưa chặt chẽ
- **File:** Toàn bộ.
- **Vấn đề:**
    - Thiếu Docstring giải thích mục đích hàm (bằng Tiếng Việt).
    - `dict` trong `get_token_payload` nên là `dict[str, Any]`.

## 4. Kế Hoạch Refactor (Đề Xuất)

Để tuân thủ kiến trúc Modular Monolith và Clean Architecture, cần thực hiện tái cấu trúc như sau:

1.  **Refactor `src/common/database.py`**:
    - Định nghĩa `get_db_session` ngay tại đây (hoặc file `dependencies.py` trong `common` nếu muốn tách biệt), để các tầng trên có thể import mà không phụ thuộc ngược vào `app`.

2.  **Refactor `src/common/auth_core.py`**:
    - Giữ lại logic giải mã JWT (`get_token_payload`).
    - Thay thế hardcoded values bằng config.
    - Thêm Docstring Tiếng Việt.

3.  **Di chuyển `src/common/security.py`**:
    - **XÓA** file này hoặc làm rỗng nó.
    - Chuyển hàm `get_current_user` sang `src/modules/users/dependencies.py` (tạo mới nếu chưa có). Vì logic "lấy user hiện tại từ DB" là logic nghiệp vụ của module Users.
    - Các module khác nếu cần `current_user` sẽ import từ `src.modules.users` (thông qua Public API `__init__.py`).

4.  **Cập nhật `src/app/dependencies.py`**:
    - Điều chỉnh lại các import để phản ánh cấu trúc mới.

## 5. Kết Luận
Tầng `common` hiện tại đang vi phạm nghiêm trọng quy tắc phụ thuộc. Việc refactor là **BẮT BUỘC** trước khi phát triển tiếp để tránh nợ kỹ thuật chồng chất.
