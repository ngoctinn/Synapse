# Báo Cáo Đánh Giá Backend: Services Module

**Ngày tạo:** 02/12/2025
**Module:** `backend/src/modules/services`
**Người thực hiện:** Antigravity (AI Assistant)

---

## 1. Tổng Quan
Module `services` chịu trách nhiệm quản lý Dịch vụ (Services) và Kỹ năng (Skills). Cấu trúc module tuân thủ cơ bản kiến trúc Modular Monolith với đầy đủ các thành phần `models`, `schemas`, `service`, `router`. Tuy nhiên, vẫn còn một số vi phạm về tính đóng gói (Encapsulation) và các vấn đề về Code Quality cần khắc phục.

## 2. Vi Phạm Kiến Trúc (Modular Monolith)

### 2.1. Vi phạm Encapsulation (Tính đóng gói)
- **Vị trí:** `src/modules/services/router.py`
- **Chi tiết:**
  - Import trực tiếp từ file nội bộ của module khác: `from src.modules.users.models import User`.
  - Import trực tiếp từ file nội bộ của module khác: `from src.modules.users.constants import UserRole`.
- **Nguyên tắc:** Các module chỉ được giao tiếp với nhau thông qua Public API (`__init__.py`).
- **Đề xuất:**
  - Sửa import `User` thành `from src.modules.users import User`.
  - Export `UserRole` trong `src/modules/users/__init__.py` và import từ đó, hoặc tạo một shared kernel cho constants nếu cần thiết (nhưng tốt nhất là export qua module interface).

### 2.2. Service Layer Coupling
- **Vị trí:** `src/modules/services/service.py`
- **Chi tiết:** Service trực tiếp raise `HTTPException` (của FastAPI).
- **Nguyên tắc:** Service Layer không nên phụ thuộc vào framework HTTP (FastAPI). Việc này làm giảm tính tái sử dụng và khó test.
- **Đề xuất:**
  - Định nghĩa các Domain Exceptions (ví dụ: `ServiceNotFoundError`, `SkillAlreadyExistsError`).
  - Raise các exception này trong Service.
  - Sử dụng Exception Handler hoặc Router để map Domain Exception sang HTTP Status Code.

## 3. Code Quality & Best Practices

### 3.1. Hardcoded Strings & Inconsistency
- **Vị trí:** `src/modules/services/router.py`
- **Chi tiết:**
  - Dòng 30, 81: `if current_user.role != "manager":` (Dùng chuỗi cứng).
  - Dòng 104: `if current_user.role != UserRole.MANAGER:` (Dùng Enum).
- **Đề xuất:** Đồng bộ hóa toàn bộ code sử dụng `UserRole` Enum để đảm bảo tính nhất quán và tránh lỗi typo.

### 3.2. Race Condition (Concurrency)
- **Vị trí:** `src/modules/services/service.py` -> `_get_or_create_skills`
- **Chi tiết:** Logic kiểm tra tồn tại -> tạo mới (`check-then-act`) có thể gây lỗi `IntegrityError` nếu hai request chạy song song cùng tạo một skill mới.
- **Đề xuất:**
  - Sử dụng cơ chế `ON CONFLICT DO NOTHING` (nếu DB hỗ trợ và thư viện cho phép).
  - Hoặc bọc trong `try-except IntegrityError` để retry hoặc bỏ qua lỗi trùng lặp.

### 3.3. Documentation (Swagger)
- **Vị trí:** `src/modules/services/router.py`
- **Chi tiết:** Docstring quá đơn giản (ví dụ: "Lấy danh sách kỹ năng."), chưa mô tả Input/Output/Errors theo chuẩn Markdown.
- **Đề xuất:** Cập nhật Docstring chi tiết hơn. Ví dụ:
  ```python
  """
  Lấy danh sách kỹ năng.

  - **Input**: Không có.
  - **Output**: Danh sách các đối tượng `SkillRead`.
  """
  ```

## 4. Strategic Review (Chiến lược & Tối ưu hóa)

### 4.1. Hiệu năng & Khả năng mở rộng
- **Pagination (Phân trang):** API `GET /services` hiện trả về toàn bộ danh sách. Điều này sẽ gây vấn đề hiệu năng khi dữ liệu lớn. -> **Cần thêm Pagination.**
- **Search (Tìm kiếm):** Chưa có tính năng tìm kiếm dịch vụ theo tên hoặc kỹ năng. -> **Cần thêm Text Search.**
- **Caching:** Danh sách dịch vụ ít thay đổi nhưng được truy xuất nhiều. -> **Nên áp dụng Caching (Redis/In-memory).**

### 4.2. Logic Nghiệp vụ
- **Pricing Model:** Hiện tại `price` chỉ là một số thực đơn giản. Trong thực tế Spa, giá có thể thay đổi theo hạng thành viên, thời gian (Happy Hour), hoặc kỹ thuật viên. -> **Cân nhắc thiết kế Pricing Strategy linh hoạt hơn.**

## 5. Kế hoạch Hành động (Refactoring Plan)

Để khắc phục các vấn đề trên, đề xuất thực hiện workflow `/backend-refactor` với các bước sau:

1.  **Refactor Imports:** Sửa các import vi phạm trong `router.py`.
2.  **Standardize Roles:** Thay thế hardcoded string "manager" bằng `UserRole.MANAGER`.
3.  **Refactor Error Handling:** Tạo Domain Exceptions và loại bỏ `HTTPException` khỏi `service.py`.
4.  **Enhance Documentation:** Viết lại Docstring cho Router.
5.  **Implement Pagination & Search:** Cập nhật `get_services` để hỗ trợ phân trang và tìm kiếm cơ bản.

---
*Báo cáo này được tạo tự động bởi Antigravity.*
