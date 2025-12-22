# UI/UX Audit Report: Appointments, Booking Wizard & Customer Dashboard

## 1. Appointments Feature
**Files audited:** `appointments/components/calendar/day-view.tsx`, `appointments/components/calendar/calendar-view.tsx`

### Observations:
- **Complexity:** Logic tính toán layout cho event (`calculateEventLayout`) khá phức tạp để xử lý overlapping.
- **Interactions:** Hỗ trợ nhiều action qua `EventPopover` (Check-in, No-show, Cancel, v.v.).
- **Density:** Có chế độ `densityMode` (comfortable/compact) để điều chỉnh độ cao của giờ.

### Critical Questions:
- **Vì sao** `HOUR_HEIGHT` lại được hardcode trong constants? Nếu người dùng muốn zoom in/out lịch trình thì UI hiện tại không linh hoạt.
- **Vì sao** không có tính năng "Drag and Drop" để đổi giờ hẹn? Trong quản lý salon/spa, việc kéo thả để đổi lịch là một tính năng cực kỳ quan trọng về UX.
- **Vì sao** `DayView` lại render toàn bộ 24 giờ (mặc định từ `startHour` đến `endHour`)? Nếu spa chỉ làm việc từ 8h-20h, phần còn lại của ScrollArea sẽ bị trống vô ích.

---

## 2. Booking Wizard Feature
**Files audited:** `booking-wizard/components/booking-wizard.tsx`, `booking-wizard/components/wizard-footer.tsx`

### Observations:
- **State Management:** Sử dụng Zustand (`useBookingStore`) để quản lý state xuyên suốt các bước.
- **UX Flow:** Step 1 (Services) có logic hiển thị khác biệt (FloatingSummary) so với các bước còn lại.
- **Validation:** Logic `canProceed` kiểm tra điều kiện từng bước trước khi cho phép "Next".

### Critical Questions:
- **Vì sao** Step 1 lại giấu `WizardFooter` và dùng `FloatingSummary`? Sự thay đổi vị trí nút "Tiếp tục" giữa các bước (lúc thì ở Floating bar, lúc thì ở Footer cố định) có thể gây mất phương hướng cho người dùng.
- **Vì sao** không có thanh tiến trình (Progress Bar) trực quan? Người dùng không biết mình đang ở bước mấy trên tổng số bao nhiêu bước và còn bao lâu nữa thì xong.
- **Vì sao** `HoldTimer` (giữ chỗ) lại hiển thị ngay dưới Header? Nếu timer này hết hạn, người dùng có bị đá văng ra ngoài hay không? UX xử lý khi hết hạn cần được làm rõ (hiện tại chỉ thấy comment `// Optionally show a toast`).

---

## 3. Customer Dashboard Feature
**Files audited:** `customer-dashboard/components/profile-form.tsx`, `customer-dashboard/components/dashboard-stats.tsx`

### Observations:
- **Animations:** Sử dụng `framer-motion` rất mượt mà, có tính đến `prefersReducedMotion`.
- **Form Handling:** Sử dụng `useActionState` và `zodResolver` chuẩn mực.

### Critical Questions:
- **Vì sao** `ProfileForm` lại có `max-w-5xl`? Đối với một form thông tin cá nhân, chiều ngang quá rộng sẽ làm các input field bị kéo dài quá mức, gây khó đọc và khó điền.
- **Vì sao** không có tính năng "Đổi mật khẩu" ngay trong trang Profile? Thông thường người dùng kỳ vọng tìm thấy mục bảo mật chung với thông tin cá nhân.
- **Vì sao** các chỉ số trong `DashboardStats` không có so sánh với kỳ trước (ví dụ: +10% so với tháng trước)? Dữ liệu thô mà không có ngữ cảnh so sánh sẽ kém giá trị đối với người dùng.
