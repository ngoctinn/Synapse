# Change Log - Hoàn thiện tài liệu thiết kế KLTN

## [2025-12-19] - Đánh giá và bổ sung tài liệu thiết kế

### Đã thêm (Added)
- **Sequence Diagrams**:
    - Bổ sung luồng `B1.8: Tái lập lịch do sự cố` vào `docs/design/sequences/receptionist_flows.md`.
    - Bổ sung luồng `C12: Tính toán và báo cáo hoa hồng` vào `docs/design/sequences/admin_flows.md`.
- **UI Design Spec**: Tạo mới `docs/design/ui_design.md` đặc tả danh mục màn hình, layout và UX Flows chính.
- **Activity Diagrams**: Tạo mới `docs/design/activity_diagrams.md` mô tả logic chi tiết cho Smart Scheduling, Rescheduling và Commission.

### Đã thay đổi (Changed)
- **Implementation Plan**: Cập nhật mục tiêu đánh giá bộ tài liệu thiết kế.
- **Analysis Log**: Ghi nhận kết quả rà soát tính đầy đủ và nhất quán của bộ Design.

### Lý do (Rationale)
- Chuẩn bị hồ sơ thiết kế đầy đủ cho Khóa luận tốt nghiệp (KLTN).
- Làm nổi bật tính "thông minh" (Smart) của hệ thống thông qua các sơ đồ hoạt động và tuần tự phức tạp.
- Cung cấp cái nhìn trực quan về giao diện người dùng để hội đồng dễ hình dung sản phẩm.

---
# Change Log - Backend Module Refactoring

## [2025-12-19] - Hệ thống hóa Module Lập lịch

### Đã thay đổi (Changed)
- **Rename Folder**: `backend/src/modules/scheduling` -> `backend/src/modules/scheduling_engine`.
  - Mục đích: Tránh nhầm lẫn với module `schedules` (Dữ liệu).
- **Backend Entry Point**: Cập nhật `backend/src/app/main.py` để sử dụng `scheduling_engine`.
- **API Documentation**:
  - Cập nhật Swagger tags trong `router.py` thành `Scheduling Engine`.
  - Cập nhật `__init__.py` docstring.
- **Tài liệu Hệ thống**: Cập nhật `docs/ai/implementation/knowledge-schedules-scheduling.md` để khớp với tên module mới.

### Lý do (Rationale)
- Theo kiến trúc **Modular Monolith**, các module cần có tên gọi phản ánh đúng trách nhiệm. `scheduling_engine` thể hiện rõ đây là logic xử lý (Engine), phân biệt với thực thể lưu trữ lịch làm việc (`schedules`).

### Tác động (Impact)
- **Frontend**: Không thay đổi API URL (`/scheduling` vẫn được giữ nguyên).
- **Backend Internal**: Tất cả các tham chiếu import đã được cập nhật. Tính đóng gói của module được bảo toàn.
