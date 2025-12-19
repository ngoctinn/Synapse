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
