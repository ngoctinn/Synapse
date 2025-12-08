# Báo Cáo Cập Nhật UI/UX Staff Form

## 1. Mục Tiêu
Cập nhật giao diện `StaffForm` theo chuẩn **UI/UX Pro Max** và yêu cầu của người dùng:
- Chuyển đổi layout từ 2 cột sang **1 cột (Single Column)** để tối ưu hóa sự tập trung (Scanning Pattern).
- Thu gọn kích thước Sheet (`Drawer`) để phù hợp với layout 1 cột, tạo cảm giác gọn gàng.
- Thêm Placeholder cho tính năng **Avatar Upload**.

## 2. Các Thay Đổi Chi Tiết

### A. Layout Refactoring (Single Column)
- **Trước**: Sử dụng Grid Layout (2 cột).
- **Sau**: Chuyển sang Linear Layout (Vertical Stack).
- **Lý do**: Dễ đọc, tránh lỗi hiển thị trên màn hình nhỏ, và phù hợp với số lượng trường không quá nhiều.

### B. Compact Drawer Width
- **Thay đổi**: Giảm `max-w` của `StaffSheet` từ `xl` (576px) xuống `md` (448px).
- **Lợi ích**:
  - Giao diện "Fit" hơn với Form 1 cột.
  - Tăng khoảng trống (negative space) cho màn hình nền phía sau.
  - Cảm giác "Lightweight" (nhẹ nhàng) hơn cho tác vụ quản lý nhanh.

### C. Avatar & Profile UI
- Thêm UI Placeholder cho Avatar trong tab "Thông tin chung".
- Hiển thị icon `User` mặc định với style bo tròn, tạo cảm giác hiện đại.

### D. Tabs Organization
- Form Cập nhật (`Update Mode`) được chia thành 3 Tabs: "Thông tin chung", "Nghiệp vụ", "Nhân sự".

## 3. Kết Quả
- Form trở nên gọn gàng, tinh tế và chuyên nghiệp.
- Tuân thủ nguyên tắc "Less is More" của Premium UI.
