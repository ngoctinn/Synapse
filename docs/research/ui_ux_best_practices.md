# Báo cáo Nghiên cứu UI/UX - Dự án Synapse

## 1. Tổng quan
Dựa trên khảo sát các hệ thống CRM Spa hàng đầu (Zenoti, Mindbody, Vagaro) và các Best Practices về UI/UX, báo cáo này đưa ra các định hướng thiết kế để nâng cấp Synapse lên chuẩn "Premium".

## 2. Các Luồng Nghiệp vụ Trọng tâm

### A. Dashboard Lễ tân (Operational Focus)
- **Định hướng**: Tối ưu cho tốc độ và sự tiện lợi.
- **Thành phần chính**:
    - **Scheduler (Calendar view)**: Chế độ xem theo ngày/tuần với mã màu cho trạng thái (Đã đặt, Đã Check-in, Hoàn thành, No-show).
    - **Quick Actions Bar**: Nút bấm nhanh để Check-in, Checkout và tạo Lịch hẹn mới.
    - **Chỉ số vận hành ngày**: Số ca hôm nay, Doanh thu mục tiêu, Số giường đang trống.

### B. Workspace Kỹ thuật viên (Mobile-First)
- **Định hướng**: Đơn giản, dễ dùng trên thiết bị di động, tập trung vào dữ liệu lâm sàng.
- **Thành phần chính**:
    - **Lịch biểu cá nhân**: Danh sách các ca phục vụ trong ngày.
    - **SOAP Notes (Ghi chú chuyên môn)**: Form nhập liệu có cấu trúc (Subjective, Objective, Assessment, Plan).
    - **Quản lý ảnh liệu trình**: Tải ảnh trước/sau khi thực hiện dịch vụ.
    - **Tiến trình liệu trình**: Theo dõi số buổi đã làm/còn lại của khách hàng.

### C. Luồng Đặt lịch (Booking Wizard)
- **Định hướng**: Giảm tải nhận thức (Cognitive Load).
- **Các bước tối ưu**:
    1. **Chọn Dịch vụ**: Phân loại rõ ràng (Massage, Chăm sóc da, v.v.), hiển thị giá và thời gian trực quan.
    2. **Chọn Chuyên viên**: Có ảnh đại diện và đánh giá.
    3. **Chọn Thời gian**: Lưới giờ trống trực quan.
    4. **Xác nhận**: Tóm tắt đơn giản trước khi thanh toán/đặt chỗ.

## 3. Kiến trúc Điều hướng mới (Proposed Navigation)

### Admin/Receptionist Navigation (Sidebar)
- **Tổng quan**: Dashboard thống kê.
- **Lịch hẹn**: Calendar view chủ đạo.
- **Khách hàng**: Danh sách & Hồ sơ chi tiết.
- **Thanh toán**: Quản lý hóa đơn & Báo cáo doanh thu.
- **Cấu hình**: Dịch vụ, Nhân sự, Tài nguyên.

### Technician Navigation (Bottom Bar / Sidebar thu gọn)
- **Ca làm việc**: Danh sách công việc hôm nay.
- **Khách hàng của tôi**: Truy cập nhanh hồ sơ khách đang phục vụ.
- **Hồ sơ cá nhân**: Thống kê hoa hồng & hiệu suất.

## 4. Các "Điểm cụt" cần khắc phục ngay
1. Thêm nút **"Đặt lịch ngay"** vào tất cả các `ServiceCard`.
2. Chuyển `TreatmentSheet` từ View-only sang **Edit mode** cho KTV.
3. Thay thế trang Dashboard trống hiện tại bằng **Operational Dashboard** thực tế.
