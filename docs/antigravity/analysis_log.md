# Analysis Log - Scheduling Module Refactoring

## 1. Phát hiện (Findings)
- Module `scheduling` hiện chỉ được import tại:
  - `src/app/main.py`: Đăng ký router.
- Không thấy các module khác (`users`, `staff`, `bookings`, v.v.) phụ thuộc trực tiếp vào `scheduling`. Điều này cho thấy tính đóng gói (encapsulation) tốt.
- API Prefix hiện tại là `/scheduling`. Cần giữ nguyên prefix này trong `router.py` để không phá vỡ tích hợp với Frontend.

## 2. Danh sách file ảnh hưởng (Affected Files)
- `backend/src/modules/scheduling/` (Thư mục chính cần đổi tên)
- `backend/src/app/main.py` (Import và Register)

## 3. Rủi ro (Risks)
- **Cấu trúc import nội bộ**: Các file bên trong `scheduling/` như `router.py` hoặc `solver.py` có thể có import chéo hoặc absolute import. Tuy nhiên, theo quy tắc dự án, chúng nên dùng relative import hoặc export qua `__init__.py`.
- **Frontend**: Nếu Frontend hardcode logic dựa trên tên module (thay vì API endpoint), có thể có ảnh hưởng. Kiểm tra search `scheduling` trong frontend.
