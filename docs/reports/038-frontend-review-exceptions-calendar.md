# Báo Cáo Đánh Giá Frontend: Exceptions Calendar Component

**Ngày:** 04/12/2025
**Người thực hiện:** AI Assistant
**Phạm vi:** `frontend/src/features/settings/operating-hours/components/exceptions-calendar.tsx`

---

## 1. Tổng Quan
Component `ExceptionsCalendar` chịu trách nhiệm quản lý các ngày nghỉ lễ, bảo trì và ngoại lệ tùy chỉnh. Giao diện hiện tại đã khá tốt với việc sử dụng `Calendar` của Shadcn UI, các thẻ sự kiện (Event Cards) và trạng thái trống (Empty State) được thiết kế tỉ mỉ. Tuy nhiên, vẫn còn dư địa để nâng cấp lên chuẩn "Premium" và tối ưu hóa code.

## 2. Đánh Giá Kiến Trúc (FSD & Clean Code)

### 2.1. Tuân thủ Feature-Sliced Design (FSD)
- **Vị trí:** `features/settings/operating-hours/components/exceptions-calendar.tsx` là hợp lý.
- **Exports:** Component này được sử dụng bởi `OperatingHoursForm` (được export qua `index.ts`), đảm bảo tính đóng gói.
- **Imports:** Không phát hiện vi phạm Deep Import. Các import đều từ `@/shared` hoặc nội bộ feature.

### 2.2. Chất lượng Mã nguồn (Code Quality)
- **Ưu điểm:**
  - Sử dụng `date-fns` với locale `vi` chính xác.
  - Tách biệt logic render (Card, Dialog).
  - Sử dụng `cn` utility để xử lý class dynamic.
- **Vấn đề cần cải thiện:**
  - **Tạo ID không an toàn:** Dòng 35 sử dụng `Math.random().toString(36).substr(2, 9)`. Nên thay thế bằng `crypto.randomUUID()` để đảm bảo tính duy nhất tốt hơn.
  - **Component quá lớn:** File dài 274 dòng. Phần render của từng item trong danh sách ngoại lệ (dòng 207-267) nên được tách thành component riêng `ExceptionItem` để dễ bảo trì.
  - **Hardcoded Styles:** Các object `modifiersStyles` (dòng 56-60) được khai báo trong render body. Nên đưa ra ngoài component hoặc dùng `useMemo` nếu cần tính toán động.
  - **Type Safety:** Dòng 38 ép kiểu `as 'holiday' | 'custom' | 'maintenance'` có thể gây lỗi runtime nếu giá trị không khớp. Nên validate chặt chẽ hơn.

## 3. Đánh Giá UX/UI (Premium Standards)

### 3.1. Điểm mạnh
- **Empty State:** Thiết kế đẹp, có icon và hướng dẫn rõ ràng.
- **Visual Feedback:** Sử dụng màu sắc (Đỏ/Vàng/Xanh) để phân biệt loại sự kiện rất trực quan.
- **Calendar Integration:** Tích hợp tốt với `react-day-picker` (qua Shadcn Calendar).

### 3.2. Đề xuất Cải tiến (WOW Factor)
1.  **Micro-animations (Framer Motion):**
    - Thêm `AnimatePresence` cho danh sách ngoại lệ để khi xóa một item, nó sẽ trượt ra hoặc mờ dần thay vì biến mất đột ngột.
    - Thêm hiệu ứng `layout` cho các item để danh sách tự sắp xếp lại mượt mà.

2.  **Tương tác Lịch thông minh hơn:**
    - Hiện tại phải chọn ngày -> bấm nút "Thêm ngoại lệ".
    - **Đề xuất:** Cho phép click đúp vào ngày trên lịch để mở ngay Dialog thêm ngoại lệ cho ngày đó.
    - Hiển thị Tooltip khi hover vào ngày có ngoại lệ trên lịch để xem nhanh thông tin.

3.  **Nâng cấp Dialog "Thêm ngoại lệ":**
    - Phần chọn "Loại sự kiện" (`Select`) có thể thay bằng các **Card Select** có icon và màu sắc minh họa để trực quan hơn (giống như chọn gói dịch vụ).
    - Thêm preview nhanh ngày đã chọn trong Dialog.

4.  **Chức năng Chỉnh sửa:**
    - Hiện tại chỉ có thể Xóa. Người dùng nên có thể click vào item để sửa Lý do hoặc Loại sự kiện.
5.  **Gom nhóm hiển thị:**
    - Gộp các ngày có cùng ID ngoại lệ (hoặc cùng đợt tạo) vào cùng 1 item trong danh sách để tránh làm rối danh sách khi thêm nhiều ngày nghỉ lễ liên tiếp (ví dụ: Tết Nguyên Đán).

## 4. Kế Hoạch Hành Động (Refactor Plan)

### Bước 1: Tối ưu hóa Code & Tách Component
- [ ] Tách `ExceptionItem` ra file riêng `components/exception-item.tsx`.
- [ ] Thay thế `Math.random()` bằng `crypto.randomUUID()`.
- [ ] Move `modifiers` và `modifiersStyles` ra khỏi render cycle hoặc dùng `useMemo`.

### Bước 2: Nâng cấp UX/UI
- [ ] Cài đặt `framer-motion` (nếu chưa có) và áp dụng `AnimatePresence` cho danh sách.
- [ ] Thiết kế lại UI chọn "Loại sự kiện" trong Dialog (dùng Grid Card thay vì Select dropdown đơn điệu).
- [ ] Thêm tính năng "Click ngày trên lịch để mở Dialog".
- [ ] Gộp hiển thị các ngày có cùng ID/Group ID thành một thẻ duy nhất trong danh sách.

### Bước 3: Kiểm thử
- [ ] Kiểm tra luồng Thêm/Xóa với nhiều ngày cùng lúc.
- [ ] Đảm bảo responsive trên mobile (lịch và danh sách hiển thị tốt).

---
*Báo cáo này được tạo tự động bởi quy trình `/frontend-review`.*
