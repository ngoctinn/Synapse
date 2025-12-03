r# Báo Cáo Deep Design Review: Module Appointments

**Ngày:** 03/12/2025
**Người thực hiện:** Antigravity (AI Assistant)
**Phạm vi:** `frontend/src/app/(admin)/admin/appointments`
**Tài liệu tham khảo:** Hình ảnh upload từ người dùng (Premium Dental Clinic UI)

## 1. Phân Tích Bố Cục & Cấu Trúc (Layout & Structure)

### Hiện Trạng
- **Layout**: Sidebar bên trái (Lọc Nhân viên, Dịch vụ) + Main Content bên phải (Lịch/Danh sách).
- **Sidebar**: Sử dụng `ScrollArea`, `Checkbox`, `Avatar`. Có chức năng collapse bộ lọc.
- **Calendar**: Grid view theo tuần, các cột là ngày, các hàng là giờ.

### So Sánh Với Hình Ảnh Tham Khảo (Target Design)
- **Sidebar**:
  - **Target**: Có thêm phần "Patient Queue" (Danh sách bệnh nhân chờ) ở dưới cùng.
  - **Target**: Checkbox được thiết kế mềm mại hơn, màu sắc (xanh dương, hồng) tương ứng với bác sĩ.
  - **Target**: Font chữ trong Sidebar có vẻ đậm hơn ở tiêu đề (AVAILABLE DOCTOR) và nhạt hơn ở nội dung.
- **Calendar**:
  - **Target**: Header lịch đơn giản, tinh tế với nút điều hướng tháng/năm.
  - **Target**: Các thẻ lịch hẹn (Appointment Card) có màu nền pastel nhẹ nhàng (hồng nhạt, xanh nhạt, tím nhạt) thay vì chỉ một màu hoặc màu đậm.
  - **Target**: Grid lines rất mờ, tạo cảm giác thoáng đãng (Clean & Airy).

## 2. Đánh Giá Chi Tiết Thành Phần (Component Details)

### Typography
- **Hiện tại**: Sử dụng font mặc định (Inter/Sans).
- **Đề xuất**:
  - Tăng `font-weight` cho các tiêu đề (Header, Sidebar Section Title) lên `600` hoặc `700`.
  - Giảm `font-size` của các text phụ (như giờ, loại dịch vụ) xuống `text-xs` hoặc `text-[11px]` để tinh tế hơn.

### Colors & Contrast
- **Hiện tại**: Chủ yếu là Slate (Xám xanh) và Blue (Xanh dương).
- **Đề xuất (Premium Look)**:
  - Sử dụng bảng màu Pastel cho các thẻ lịch hẹn để phân biệt trạng thái hoặc bác sĩ (như hình tham khảo).
  - Tăng độ tương phản cho text chính (Slate-900) và giảm cho text phụ (Slate-500).
  - Thêm "Glassmorphism" (hiệu ứng kính mờ) cho các overlay hoặc tooltip.

### Shadows & Borders
- **Hiện tại**: `shadow-sm`, `border`.
- **Đề xuất**:
  - Sử dụng `shadow-lg` hoặc `shadow-xl` với màu bóng nhạt (`shadow-slate-200/50`) cho các thành phần nổi (Tooltip, Modal) để tạo độ sâu (Depth).
  - Bo góc (Border Radius) lớn hơn (`rounded-xl` hoặc `rounded-2xl`) cho Container chính và Card để tạo cảm giác mềm mại, hiện đại.

## 3. Đề Xuất Cải Tiến "Premium" & "WOW Factor"

### 1. Micro-animations (Framer Motion)
- **Hover Effects**: Khi hover vào thẻ lịch hẹn, thẻ nên "nổi" lên nhẹ (`scale: 1.02`, `shadow-md`).
- **Transition**: Chuyển đổi giữa các tuần/tháng nên có hiệu ứng trượt (Slide) mượt mà.
- **Loading**: Skeleton loading nên có hiệu ứng "shimmer" tinh tế.

### 2. UI Polish (Tinh Chỉnh Giao Diện)
- **Sidebar**:
  - Thêm section "Hàng chờ bệnh nhân" (Patient Queue) nếu có dữ liệu backend hỗ trợ.
  - Tùy chỉnh Checkbox để có màu sắc tương ứng với bác sĩ (như hình tham khảo).
- **Calendar**:
  - Làm mờ các đường kẻ Grid (`border-slate-100` thay vì `border-slate-200`).
  - Thêm chỉ báo "Giờ hiện tại" (Current Time Indicator) với hiệu ứng "Glow" (phát sáng).

### 3. Tooltip/Hover Card
- **Target**: Tooltip trong hình tham khảo rất chi tiết (Thông tin bệnh nhân, Quy trình điều trị, Timeline).
- **Hành động**: Nâng cấp `AppointmentCard` hover content:
  - Thêm Timeline đơn giản (nếu có dữ liệu các bước điều trị).
  - Hiển thị Avatar lớn hơn của bệnh nhân.
  - Thêm nút "Gọi điện" hoặc "Nhắn tin" nhanh.

## 4. Kết Luận & Kế Hoạch
Giao diện hiện tại đã khá tốt về mặt chức năng và cấu trúc. Để đạt chuẩn "Premium" như hình tham khảo, cần tập trung vào:
1.  **Màu sắc**: Chuyển sang bảng màu Pastel & Soft UI.
2.  **Chi tiết**: Tinh chỉnh Typography, Border Radius, Shadow.
3.  **Trải nghiệm**: Thêm Micro-animations và làm mượt các chuyển động.

---
*Vui lòng xem xét các đề xuất trên và sử dụng workflow `/frontend-refactor` để triển khai từng phần.*
