# Đặc Tả Giao Diện Người Dùng (UI/UX Design) - Synapse

Tài liệu này mô tả cấu trúc các màn hình chính, luồng trải nghiệm người dùng (UX) và các nguyên tắc thiết kế được áp dụng trong hệ thống Synapse.

## 1. Nguyên tắc thiết kế (Design Principles)
- **Bản địa hóa**: 100% tiếng Việt cho các nhãn, thông báo và tài liệu.
- **Aesthetics**: Sử dụng hệ màu `oklch` hiện đại, Glassmorphism, và Micro-animations.
- **Responsive**: Ưu tiên hiển thị tốt trên cả Tablet (cho Lễ tân/KTV) và Mobile (cho Khách hàng).
- **Trạng thái (Status-driven)**: Sử dụng màu sắc nhất quán để biểu đạt trạng thái lịch hẹn (Xanh - Đang làm, Vàng - Chờ, Đỏ - Hủy).

## 2. Danh mục màn hình chính

### 2.1. Phân hệ Khách hàng (Customer Facing)
| Màn hình | Layout chính | UX Flow quan trọng |
| :--- | :--- | :--- |
| **Landing Page** | Bố cục Z-pattern: Hero -> Services -> Reviews -> Footer. | Tạo ấn tượng, dẫn dắt khách đến nút "Đặt lịch ngay". |
| **Booking Wizard** | Quy trình nhiều bước (Stepper): Chọn dịch vụ -> Chọn KTV -> Chọn giờ -> Xác nhận. | Sử dụng Skeleton loading khi gọi API kiểm tra giờ trống thông minh. |
| **Hồ sơ cá nhân** | Sidebar điều hướng: Thông tin cá nhân, Lịch sử đặt lịch, Điểm thưởng. | Hiển thị Timeline lịch hẹn từ mới đến cũ. |

### 2.2. Phân hệ Lễ tân (Receptionist Dashboard)
| Màn hình | Layout chính | UX Flow quan trọng |
| :--- | :--- | :--- |
| **Main Scheduler** | Chế độ xem lịch (Calendar/Timeline) theo cột nhân viên. | Kéo thả để dời lịch (Drag & Drop), Click nhanh để Check-in. |
| **Quản lý khách hàng** | Data Table với bộ lọc tìm kiếm nhanh theo SĐT/Tên. | Tạo nhanh hồ sơ khách vãng lai (Quick form). |
| **Thanh toán (POS)** | Modal/Dialog hiển thị hóa đơn chi tiết và phương thức thanh toán. | In hóa đơn ngay sau khi xác nhận thanh toán thành công. |

### 2.3. Phân hệ Kỹ thuật viên (Technician Portal)
| Màn hình | Layout chính | UX Flow quan trọng |
| :--- | :--- | :--- |
| **Lịch làm việc** | Danh sách thẻ (Card list) theo trình tự thời gian trong ngày. | Vuốt/Bấm để xem Ghi chú chuyên môn của khách hàng. |
| **Nhật ký phục vụ** | Trình soạn thảo văn bản đơn giản kèm các checkbox tình trạng. | Ghi chú nhanh tình trạng da/liệu trình sau mỗi buổi làm. |

### 2.4. Phân hệ Quản trị (Admin System)
| Màn hình | Layout chính | UX Flow quan trọng |
| :--- | :--- | :--- |
| **Thống kê doanh thu** | Dashboard với các biểu đồ Area/Bar chart (Recharts). | Lọc theo thời gian để xem sự biến động doanh thu và hoa hồng. |
| **Phân ca trực** | Lưới (Grid) nhân viên - ngày trong tháng. | Giao diện xếp ca hàng loạt (Bulk actions). |

## 3. Luồng UX tiêu biểu (User Flows)

### 3.1. Luồng đặt lịch thông minh (Smart Booking Flow)
1. Khách hàng vào `Booking Wizard`.
2. Hệ thống gợi ý Dịch vụ dựa trên lịch sử (nếu có).
3. Khi chọn giờ, hệ thống gọi Backend xử lý OR-Tools để chỉ hiện ra các giờ thực sự khả dụng (tránh overlap).
4. Khách nhận thông báo xác nhận qua Email/SMS tức thì.

### 3.2. Luồng xử lý sự cố (Rescheduling Flow)
1. Lễ tân báo một Phòng/KTV bị hỏng/nghỉ.
2. Dashboard hiển thị các lịch hẹn bị ảnh hưởng (màu cảnh báo).
3. Hệ thống gợi ý phương án dời lịch tối ưu nhất (Matching).
4. Lễ tân xác nhận phương án, hệ thống tự động gửi tin nhắn cho các khách hàng liên quan.

### 3.3. Luồng Quản lý Liệu trình (Treatment Flow)
1. Lễ tân mở Hồ sơ khách hàng, xem danh sách "Thẻ liệu trình số" (Punch Cards).
2. Hiển thị tiến độ trực quan (ví dụ: 3/10 buổi đã thực hiện).
3. Khi tạo Booking, cho phép chọn "Sử dụng liệu trình" để hệ thống tự động gán `treatment_id`.
4. Sau khi Check-in, giao diện hiển thị thông báo "Đã trừ 1 buổi thành công, còn lại X buổi".

## 4. Thành phần giao diện (UI Components)

- **Shadcn/UI**: Button, Input, Dialog, Table, Calendar, Popover.
- **Custom**: Timeline, Multi-step wizard, Scheduler Grid.

---
*Lưu ý: Các UI Mockups chi tiết sẽ được đính kèm trong thư mục `assets/design/mockups/`.*
