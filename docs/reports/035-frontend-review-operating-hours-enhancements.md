# Báo Cáo Review Frontend: Operating Hours & Kế Hoạch Nâng Cấp

**Ngày:** 04/12/2025
**Người thực hiện:** Antigravity
**Phạm vi:** `frontend/src/features/settings/operating-hours`

## 1. Tổng Quan & Tuân Thủ Kiến Trúc (FSD)

### 1.1. Cấu Trúc Thư Mục
- **Đạt chuẩn FSD**: Feature được tổ chức tốt với `index.ts` public API, `components/`, `model/`.
- **Không có Deep Imports**: Các import đều tuân thủ quy tắc đóng gói.
- **Thin Page**: `page.tsx` chỉ đóng vai trò render `OperatingHoursForm`, logic nghiệp vụ nằm trong feature.

### 1.2. Code Quality & Clean Code
- **Naming**: Rõ ràng, dễ hiểu (`DayScheduleRow`, `ExceptionsCalendar`).
- **Comments**: Đầy đủ và sử dụng Tiếng Việt.
- **Types**: `DaySchedule` đã được thiết kế để hỗ trợ mảng `timeSlots` (`TimeSlot[]`), rất thuận lợi cho việc nâng cấp.

## 2. Đánh Giá UX/UI & Đề Xuất Nâng Cấp

### 2.1. Giao Diện Hiện Tại
- **Ưu điểm**: Thiết kế hiện đại, sử dụng Shadcn/UI, có hiệu ứng chuyển động (framer-motion), trạng thái "Đóng cửa" trực quan.
- **Điểm cần cải thiện**:
  - Chưa hỗ trợ thêm nhiều khung giờ trong ngày (ví dụ: Sáng 8:00-12:00, Chiều 13:00-17:00).
  - Việc thêm ngày nghỉ lễ (Exception) đang làm từng ngày một, tốn thời gian nếu cần cấu hình cho cả kỳ nghỉ dài.

### 2.2. Yêu Cầu Mới (User Request)
1.  **Thêm nút `+`**: Cho phép thêm khoảng thời gian thứ 2 (hoặc nhiều hơn) trong ngày.
2.  **Cấu hình hàng loạt (Bulk)**: Cho phép chọn nhiều ngày trên lịch để thiết lập ngoại lệ cùng lúc.

## 3. Kế Hoạch Triển Khai (Implementation Plan)

Dưới đây là kế hoạch chi tiết để thực hiện các yêu cầu trên:

### Tính Năng 1: Hỗ Trợ Đa Khung Giờ (Multi-slot Support)

**File mục tiêu:** `frontend/src/features/settings/operating-hours/components/day-schedule-row.tsx`

**Thay đổi đề xuất:**
1.  **UI Update**:
    - Trong vòng lặp `schedule.timeSlots.map`:
      - Thêm nút `Button` icon `Trash2` (Xóa) bên cạnh mỗi slot (chỉ hiện khi có > 1 slot).
    - Thêm nút `Button` icon `Plus` (Thêm) ở cuối danh sách slots.
2.  **Logic Update**:
    - Hàm `handleAddSlot`: Thêm một object `{ start: "08:00", end: "17:00" }` vào mảng `timeSlots`.
    - Hàm `handleRemoveSlot(index)`: Xóa slot tại index tương ứng.
    - Cập nhật `handleTimeChange` để nhận thêm tham số `slotIndex`.

### Tính Năng 2: Cấu Hình Ngoại Lệ Hàng Loạt (Bulk Exceptions)

**File mục tiêu:** `frontend/src/features/settings/operating-hours/components/exceptions-calendar.tsx`

**Thay đổi đề xuất:**
1.  **Calendar Component**:
    - Chuyển prop `mode="single"` thành `mode="multiple"` (hoặc `mode="range"` nếu muốn chọn khoảng). Đề xuất dùng `multiple` để linh hoạt chọn các ngày rời rạc hoặc liên tiếp.
    - State `date` (Date) sẽ đổi thành `dates` (Date[]).
2.  **Dialog Form**:
    - Tiêu đề Dialog đổi thành: "Thêm ngoại lệ cho [Số lượng] ngày đã chọn".
3.  **Logic Update**:
    - Hàm `handleAdd`: Duyệt qua mảng `dates`. Với mỗi ngày, tạo một object `ExceptionDate` và gọi `onAddException`.
    - Lưu ý: Cần kiểm tra trùng lặp (nếu ngày đó đã có exception thì update hoặc bỏ qua).

### Tính Năng 3: Cải Thiện UX Khác (Optional)

Dưới đây là mô tả ngắn gọn kỹ thuật cho tính năng **"Sao chép/Dán Lịch hoạt động linh hoạt"** (Manual Copy/Paste):

**Tên tính năng:** Sao chép cấu hình giờ theo ngày (Any-to-Any Copy).

**Mục đích:** Cho phép lấy cấu hình giờ của **bất kỳ ngày nào** làm mẫu để áp dụng cho các ngày khác.

**Luồng tương tác (UI/UX Flow):**

1.  **Trạng thái tĩnh:** Cuối mỗi dòng (Thứ 2 - CN) hiển thị nút biểu tượng `[ ❐ Copy ]`.
2.  **Kích hoạt nguồn (Copy):**
    * Người dùng bấm `[Copy]` tại dòng **Ngày A**.
    * **Ngày A**: Nút chuyển thành `[ ✖ Hủy ]`, dòng được tô viền sáng (Highlight) để báo hiệu là nguồn.
    * **Các ngày khác**: Nút `[Copy]` biến mất, thay thế bằng nút `[ 📋 Dán ]` (Paste).
3.  **Thực thi đích (Paste):**
    * Người dùng bấm `[Paste]` tại dòng **Ngày B**.
    * **Hệ thống**: Sao chép toàn bộ giờ mở/đóng/ca gãy từ Ngày A sang Ngày B.
    * **Phản hồi**: Ô giờ của Ngày B nháy sáng (Flash) báo thành công.
4.  **Kết thúc:** Chế độ Paste giữ nguyên (Sticky) để dán tiếp sang Ngày C, D... cho đến khi bấm `[Hủy]` hoặc click ra ngoài khoảng trống.

**Yêu cầu Logic:**
* Dữ liệu copy bao gồm: Trạng thái (Mở/Đóng) + Tất cả khung giờ (bao gồm ca gãy).
* Ghi đè hoàn toàn dữ liệu cũ của ngày đích.

## 4. Kết Luận
Hệ thống hiện tại có nền tảng tốt để mở rộng. Việc thêm tính năng Multi-slot và Bulk Exceptions hoàn toàn khả thi và không phá vỡ kiến trúc hiện tại.

---
**Hành động tiếp theo:**
Để thực hiện các thay đổi này, hãy chạy lệnh:
`/frontend-refactor` và tham chiếu đến báo cáo này.
