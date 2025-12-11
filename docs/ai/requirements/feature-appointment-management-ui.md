---
phase: requirements
title: Giao diện Quản lý Lịch hẹn Toàn diện
description: Xây dựng hệ thống quản lý lịch hẹn chuyên nghiệp cho Spa với đầy đủ chế độ xem, tương tác kéo thả, và quản lý tài nguyên
feature: appointment-management-ui
status: draft
created: 2024-12-11
priority: high
---

# Yêu cầu: Giao diện Quản lý Lịch hẹn Toàn diện

## Tuyên bố Vấn đề

### Chúng ta đang giải quyết vấn đề gì?

**Vấn đề cốt lõi:**
- Spa cần một giao diện quản lý lịch hẹn chuyên nghiệp để điều phối cuộc hẹn của khách hàng với kỹ thuật viên và phòng/giường dịch vụ
- Hiện tại module `appointments` chỉ là placeholder, chưa có chức năng thực sự
- Nguy cơ **Double-booking** (trùng lịch) và **No-show** (khách không đến) nếu không có hệ thống quản lý bài bản

**Ai bị ảnh hưởng?**
1. **Lễ tân**: Cần xem Dashboard tổng quan, check-in khách, xử lý thanh toán, tạo lịch thủ công
2. **Quản lý/Admin**: Cần nhìn tổng quan tải trọng công việc của cả team, phát hiện xung đột
3. **Kỹ thuật viên**: Cần xem lịch làm việc cá nhân, ghi chú chuyên môn
4. **Khách hàng**: (Thông qua Customer Dashboard) Đặt lịch, xem liệu trình

**Tình huống hiện tại:**
- Module `appointments` tại `features/appointments` chỉ có 1 file placeholder
- Không có Calendar View, Timeline View, hay bất kỳ chế độ xem nào
- Không có actions.ts (Server Actions) cho CRUD operations
- Không có types, schemas, mock-data

---

## Mục tiêu & Mục đích

### Mục tiêu chính (Goals)
1. **Calendar Views**: Xây dựng đầy đủ các chế độ xem lịch (Ngày, Tuần, Tháng, Agenda)
2. **Resource Timeline**: Timeline ngang quản lý tài nguyên (KTV, Phòng/Giường)
3. **Drag & Drop**: Tương tác kéo thả chuyên nghiệp với visual feedback
4. **Conflict Detection**: Phát hiện và xử lý xung đột lịch trình real-time
5. **Recurrence**: Hỗ trợ lịch lặp lại (RRULE)

### Mục tiêu phụ (Sub-goals)
- Dashboard Overview với Key Metrics Cards
- Filter Bar với khả năng lọc theo KTV, Dịch vụ, Trạng thái
- Side Panel (Drawer) cho việc xem/sửa chi tiết cuộc hẹn
- Mobile-friendly Agenda View
- Empty States với illustration và CTA

### Phi mục tiêu (Non-goals)
- ❌ **Payment Integration**: Không xử lý thanh toán trong phiên bản này
- ❌ **SMS/Email Notifications**: Thuộc module notifications riêng
- ❌ **Customer-facing Booking**: Thuộc module customer-dashboard
- ❌ **Analytics/Reports**: Sẽ là tính năng riêng về sau

---

## Câu chuyện Người dùng & Trường hợp Sử dụng

### Epic 1: Xem Lịch hẹn (Calendar Views)

**US1.1: Chế độ xem Ngày (Day View)**
> Là một **Lễ tân**, tôi muốn xem tất cả cuộc hẹn trong ngày theo dạng lưới giờ, để biết lịch trình cụ thể từng khung giờ và chuẩn bị đón khách.

- Tiêu chí chấp nhận:
  - [ ] Hiển thị lưới 24 giờ (tùy chỉnh được khoảng hiển thị: 8h-21h)
  - [ ] Mỗi giờ chia thành 4 ô 15 phút
  - [ ] Sự kiện hiển thị dưới dạng thẻ với chiều cao tương ứng thời lượng
  - [ ] Sự kiện chồng chéo được hiển thị cạnh nhau (Side-by-side)

**US1.2: Chế độ xem Tuần (Week View)**
> Là một **Quản lý**, tôi muốn xem tổng quan một tuần để lên kế hoạch phân bổ nhân sự.

- Tiêu chí chấp nhận:
  - [ ] Hiển thị 7 ngày theo cột
  - [ ] Trục tung là giờ trong ngày
  - [ ] Có thể cuộn ngang/dọc
  - [ ] Ngày hôm nay được highlight

**US1.3: Chế độ xem Tháng (Month View)**
> Là một **Lễ tân**, tôi muốn xem lịch tháng để nắm xu hướng bận/rảnh.

- Tiêu chí chấp nhận:
  - [ ] Hiển thị lưới 5-6 tuần
  - [ ] Mỗi ô ngày hiển thị tối đa 2-3 sự kiện + nút "+X more"
  - [ ] Dot indicator báo mật độ (trên mobile)
  - [ ] Click vào ngày để mở Day View hoặc Popover

**US1.4: Chế độ xem Danh sách (Agenda View)**
> Là một **Kỹ thuật viên**, tôi muốn xem danh sách cuộc hẹn dạng list để dễ đọc trên điện thoại.

- Tiêu chí chấp nhận:
  - [ ] Danh sách cuộn dọc theo ngày
  - [ ] Mỗi item hiển thị: Giờ, Tên khách, Dịch vụ, Trạng thái
  - [ ] Group by ngày với sticky date header
  - [ ] Swipe action: Sửa/Xóa/Check-in

### Epic 2: Resource Timeline (Quản lý Tài nguyên)

**US2.1: Timeline theo Kỹ thuật viên**
> Là một **Quản lý**, tôi muốn xem timeline ngang của tất cả KTV để biết ai đang rảnh/bận.

- Tiêu chí chấp nhận:
  - [ ] Mỗi hàng là một KTV (Avatar + Tên)
  - [ ] Trục hoành là thời gian liên tục
  - [ ] Zoom levels: 15 phút, 30 phút, 1 giờ, 4 giờ
  - [ ] Sticky column (cột tên) và Sticky header (thước thời gian)
  - [ ] Hiển thị khoảng trống (gap) và chồng chéo (overlap)

**US2.2: Timeline theo Phòng/Giường**
> Là một **Lễ tân**, tôi muốn xem timeline phòng/giường để phân bổ tài nguyên.

- Tiêu chí chấp nhận:
  - [ ] Tương tự US2.1 nhưng theo Resource (Phòng VIP 1, Giường 2...)
  - [ ] Cho phép filter theo loại phòng (VIP, Thường)

### Epic 3: Tương tác Kéo-Thả (Drag & Drop)

**US3.1: Di chuyển cuộc hẹn**
> Là một **Lễ tân**, tôi muốn kéo thả một cuộc hẹn sang khung giờ khác để dời lịch nhanh chóng.

- Tiêu chí chấp nhận:
  - [ ] Nhấn giữ sự kiện -> Thẻ "nổi lên" (shadow tăng, scale 1.05)
  - [ ] Tooltip hiển thị thời gian mới khi kéo
  - [ ] Ghost image (bóng mờ) ở vị trí gốc
  - [ ] Snap to grid (hút vào đường lưới 15 phút)
  - [ ] Drop zone highlight
  - [ ] Vùng cấm (ngày đã qua, giờ nghỉ) chuyển cursor "not-allowed"

**US3.2: Resize sự kiện**
> Là một **Lễ tân**, tôi muốn kéo giãn/thu hẹp cuộc hẹn để thay đổi thời lượng.

- Tiêu chí chấp nhận:
  - [ ] Handle (tay nắm) ở đầu và cuối thẻ sự kiện
  - [ ] Kéo handle để resize
  - [ ] Minimum duration: 15 phút
  - [ ] Cập nhật thời gian real-time

**US3.3: Tạo cuộc hẹn bằng kéo**
> Là một **Lễ tân**, tôi muốn click-drag trên lưới trống để tạo cuộc hẹn mới.

- Tiêu chí chấp nhận:
  - [ ] Click-and-drag để quét khoảng thời gian
  - [ ] Hiện Selection overlay với màu nhạt
  - [ ] Thả chuột -> Mở form với thời gian đã điền sẵn

### Epic 4: Xử lý Xung đột & Logic Phức tạp

**US4.1: Phát hiện xung đột real-time**
> Là một **Lễ tân**, tôi muốn hệ thống cảnh báo khi tôi đặt lịch trùng.

- Tiêu chí chấp nhận:
  - [ ] Validation real-time trong form
  - [ ] Inline error: "Khung giờ này đã có hẹn với [Tên KTV]"
  - [ ] Disabled/Grayed khung giờ đã kín trong time picker

**US4.2: Hiển thị xung đột**
> Là một **Quản lý**, tôi muốn nhìn thấy các cuộc hẹn trùng giờ để xử lý.

- Tiêu chí chấp nhận:
  - [ ] Sự kiện trùng giờ hiển thị side-by-side (50% width mỗi cái)
  - [ ] Badge "Xung đột" màu đỏ
  - [ ] Tool quét xung đột: "Phát hiện X xung đột. Xem chi tiết?"

**US4.3: Lịch lặp lại (Recurrence)**
> Là một **Lễ tân**, tôi muốn tạo cuộc hẹn lặp theo tuần cho khách VIP.

- Tiêu chí chấp nhận:
  - [ ] Recurrence Rule Builder UI
  - [ ] Tần suất: Ngày, Tuần, Tháng, Năm
  - [ ] Interval: "Mỗi X [đơn vị]"
  - [ ] Day selector (T2, T3... CN)
  - [ ] End condition: Không bao giờ / Sau X lần / Vào ngày
  - [ ] Natural language preview: "Lặp lại vào Thứ 2 và Thứ 4 mỗi tuần, 10 lần"

### Epic 5: Form & Side Panel

**US5.1: Xem chi tiết cuộc hẹn**
> Là một **Lễ tân**, tôi muốn click vào cuộc hẹn để xem chi tiết mà không mất ngữ cảnh.

- Tiêu chí chấp nhận:
  - [ ] Side Panel (Drawer) trượt từ phải
  - [ ] Hiển thị: Thông tin khách, Dịch vụ, KTV, Phòng, Ghi chú, Lịch sử
  - [ ] Giữ lịch nền visible
  - [ ] Nút: Sửa, Xóa, Check-in, Đánh dấu hoàn thành

**US5.2: Form tạo/sửa cuộc hẹn**
> Là một **Lễ tân**, tôi muốn form nhập liệu đầy đủ và thông minh.

- Tiêu chí chấp nhận:
  - [ ] Combobox chọn Khách hàng (có Search)
  - [ ] Multi-select Dịch vụ (tự động tính tổng thời lượng)
  - [ ] Select Kỹ thuật viên (chỉ hiện KTV có kỹ năng phù hợp)
  - [ ] Time Picker với slot đã kín bị disabled
  - [ ] Textarea Ghi chú
  - [ ] Validation Zod

### Epic 6: Dashboard & Filtering

**US6.1: Key Metrics Cards**
> Là một **Quản lý**, tôi muốn nhìn thấy số liệu tổng quan ngay đầu trang.

- Tiêu chí chấp nhận:
  - [ ] Card: Tổng cuộc hẹn hôm nay
  - [ ] Card: Đang chờ xác nhận
  - [ ] Card: Tỷ lệ lấp đầy (Occupancy %)
  - [ ] Card: Doanh thu dự kiến
  - [ ] Typography lớn, màu sắc biểu thị trạng thái

**US6.2: Filter Bar**
> Là một **Lễ tân**, tôi muốn lọc lịch theo KTV, Dịch vụ, Trạng thái.

- Tiêu chí chấp nhận:
  - [ ] Dropdown: Kỹ thuật viên (Multi-select)
  - [ ] Dropdown: Dịch vụ
  - [ ] Dropdown: Trạng thái (Đã xác nhận, Chờ, Hủy, Hoàn thành)
  - [ ] Chips hiển thị filter đang áp dụng
  - [ ] Nút "Xóa bộ lọc"

---

## Tiêu chí Thành công

### Kết quả có thể đo lường
1. **Render Performance**: Time-to-Interactive (TTI) < 2s với 100 sự kiện
2. **Interaction Latency**: Drag-drop feedback < 16ms (60fps)
3. **Conflict Detection**: 100% xung đột được phát hiện trước khi lưu
4. **Mobile Usability**: Agenda View đạt điểm Lighthouse Accessibility > 90

### Tiêu chí chấp nhận tổng quát
- [ ] Tất cả 6 Epic hoàn thành
- [ ] Không có lỗi TypeScript/Lint
- [ ] Responsive trên Mobile/Tablet/Desktop
- [ ] Localization 100% Tiếng Việt
- [ ] Tuân thủ Design System (oklch colors, shadcn components)

---

## Ràng buộc & Giả định

### Ràng buộc Kỹ thuật
- **Framework**: Next.js 16 + React 19
- **Components**: Shadcn/UI + Custom components
- **State**: React Server Components + Server Actions (không dùng external state management)
- **Calendar Engine**: Có thể cần thư viện hỗ trợ (FullCalendar, react-big-calendar, hoặc custom)
- **Drag & Drop**: @dnd-kit (đã có trong project)

### Ràng buộc Kinh doanh
- Spa hoạt động từ 8:00 đến 21:00 (cấu hình được)
- Ngày nghỉ/ngày lễ (tích hợp với module settings/operating-hours)
- Một KTV có thể có nhiều kỹ năng (skill-based assignment)

### Giả định
- Backend API (FastAPI) đã sẵn sàng các endpoint CRUD
- Database schema cho Appointments đã thiết kế
- Module Staff đã có data KTV
- Module Services đã có data Dịch vụ
- Module Resources đã có data Phòng/Giường

---

## Câu hỏi & Các mục Mở

### Câu hỏi chưa được giải quyết
1. **Calendar Library**: Nên dùng thư viện có sẵn (FullCalendar) hay custom từ đầu?
   - FullCalendar: Mạnh mẽ nhưng style khó customize
   - Custom: Flexibility cao nhưng tốn thời gian
   - **Đề xuất**: Hybrid - Dùng @dnd-kit cho logic kéo thả, tự build UI

2. **Timezone**: Có cần hỗ trợ đa múi giờ không?
   - **Đề xuất**: Không trong phiên bản đầu (Spa VN = GMT+7)

3. **Real-time Updates**: Có cần WebSocket cho đồng bộ real-time không?
   - **Đề xuất**: Giai đoạn 1 dùng polling, Giai đoạn 2 tích hợp Supabase Realtime

### Nghiên cứu cần thiết
- Benchmark hiệu năng các thư viện calendar
- Nghiên cứu RRULE (iCalendar standard) cho recurrence
- UX research: Compact vs Comfortable density preference

---

## Tham khảo

- Báo cáo Nghiên cứu UX/UI: "Chiến lược Thiết kế UX/UI Toàn diện cho Hệ thống Quản lý Lịch hẹn"
- Dự án tham khảo: Google Calendar, Calendly, Acuity Scheduling, Timely
- Nguyên tắc thiết kế: Material Design Calendar Guidelines, Apple HIG Calendar
