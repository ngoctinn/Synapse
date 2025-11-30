---
description: Đánh giá mã nguồn Backend theo tiêu chuẩn Modular Monolith, FastAPI và Clean Code.
---

1. **Chuẩn bị & Nạp Ngữ Cảnh**:
   - Đọc kỹ quy tắc tại `.agent/rules/backend.md` để nắm vững tiêu chuẩn Modular Monolith và Vertical Slice Architecture.
   - Xác định phạm vi đánh giá: `backend/src/app`, `backend/src/modules`, `backend/src/common`.

2. **Kiểm Tra Tuân Thủ Kiến Trúc (Modular Monolith)**:
   - **Cấu trúc Vertical Slice**: Kiểm tra xem các module trong `modules` có đầy đủ `router`, `service`, `models`, `schemas` và `__init__.py` không.
   - **Public API (Gatekeeper)**: Kiểm tra file `__init__.py` của từng module. Có export đúng các thành phần cần thiết không?
   - **Deep Imports**: Quét mã nguồn để phát hiện việc import trực tiếp vào file nội bộ của module khác (vi phạm quy tắc đóng gói).
   - **Common Layer**: Đảm bảo `src/common` chỉ chứa code hạ tầng, không chứa logic nghiệp vụ.

3. **Kiểm Tra Cú Pháp Python & FastAPI (Modern Standards)**:
   - **Async/Await**: Kiểm tra toàn bộ Service, Router, và Database calls có phải là `async/await` không. Phát hiện blocking code (vd: `time.sleep`, `requests`).
   - **Type Hinting**: Kiểm tra cú pháp Python 3.12+ (dùng `|` thay vì `Union`, `list[]` thay vì `List[]`).
   - **Pydantic V2**: Kiểm tra việc sử dụng `ConfigDict`, `field_validator`.
   - **SQLModel**: Kiểm tra việc sử dụng `session.exec()` (đúng) thay vì `session.execute()` (hạn chế), và các quan hệ Lazy Loading (string forward references).

4. **Kiểm Tra Bảo Mật & Dependency Injection**:
   - **RLS Injection**: Kiểm tra xem `get_db_session` có được sử dụng để inject thông tin user vào DB session không.
   - **Service Injection**: Kiểm tra xem Service có được inject vào Router không (tránh khởi tạo trực tiếp).

5. **Đề Xuất Cải Tiến (Brainstorming)**:
   - Thực hiện quy trình **Brainstormer** (.agent/workflows/brainstormer.md):
     - Đánh giá tính nhất quán của API (Naming, Status Codes).
     - Đề xuất cải thiện xử lý lỗi (Error Handling) và Logging.

6. **Nghiên Cứu & Tối Ưu Hóa (Researcher)**:
   - Thực hiện quy trình **Researcher** (.agent/workflows/researcher.md):
     - Tìm kiếm các pattern tối ưu hiệu năng cho các query phức tạp (nếu có).
     - Đề xuất các thư viện hoặc kỹ thuật mới nếu cần thiết.

7. **Tổng Hợp Báo Cáo**:
   - Liệt kê các vi phạm (nếu có) so với `.agent/rules/backend.md`.
   - Trình bày các đề xuất cải tiến.
   - Đưa ra kế hoạch hành động cụ thể để refactor.
