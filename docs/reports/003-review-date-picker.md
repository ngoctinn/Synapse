# Báo Cáo Đánh Giá Frontend: Date Picker Component (Cập Nhật)

**Ngày:** 30/11/2025
**Người thực hiện:** Antigravity (AI Agent)
**Đối tượng:** `frontend/src/shared/ui/custom/date-picker.tsx`

---

## 1. Tổng Quan
Component `DatePicker` là một thành phần UI quan trọng trong tầng `Shared`, được sử dụng để chọn ngày tháng. Component này được xây dựng dựa trên `Popover` và `Calendar` của Shadcn UI, có tích hợp `date-fns` để xử lý thời gian và bản địa hóa tiếng Việt.

## 2. Đánh Giá Tuân Thủ Kiến Trúc (FSD)
- **Vị trí:** `src/shared/ui/custom/` - Đúng vị trí cho các UI component tùy chỉnh dùng chung.
- **Public API:** Có file `index.ts` trong thư mục `custom` export component này. **Đạt chuẩn.**
- **Dependencies:**
  - Chỉ import từ `shared` (`lib/utils`, `ui/button`, `ui/calendar`, `ui/popover`) và các thư viện ngoài (`date-fns`, `lucide-react`).
  - Không có Deep Imports vi phạm quy tắc. **Đạt chuẩn.**

## 3. Phát Hiện Lỗi & Vấn Đề (Bug Report)
### 3.1. Lỗi Hiển Thị Ngôn Ngữ (Localization)
- **Mô tả:** Dropdown chọn tháng hiện đang hiển thị tên tháng bằng Tiếng Anh (Jan, Feb, Nov...) thay vì Tiếng Việt (Tháng 1, Tháng 2...).
- **Nguyên nhân:**
  - Component `Calendar` (`src/shared/ui/calendar.tsx`) có `formatters` mặc định sử dụng `date.toLocaleString("default", { month: "short" })`, dẫn đến việc hiển thị theo ngôn ngữ mặc định của trình duyệt/hệ thống thay vì `locale` được truyền vào.
  - `DatePicker` chưa override formatter `formatMonthDropdown`.
- **Giải pháp:** Cần override `formatMonthDropdown` trong prop `formatters` của `Calendar` tại `date-picker.tsx`.

## 4. Đánh Giá UX/UI & Trải Nghiệm Người Dùng (Đa Góc Độ)
### 4.1. Giao Diện & Thẩm Mỹ (Aesthetics)
- **Dropdown (Select):**
  - Hiện tại dropdown Tháng/Năm đang sử dụng style mặc định của trình duyệt (`<select>`), trông khá "thô" và không đồng bộ với design system (Shadcn Select).
  - **Đề xuất:** Mặc dù khó thay thế hoàn toàn cấu trúc DOM của `react-day-picker`, nhưng có thể cải thiện bằng cách style lại class `dropdown` và `dropdown_root` trong `calendar.tsx` hoặc `date-picker.tsx` để có padding, border và font giống Shadcn hơn.
- **Visual Feedback:**
  - Nút trigger khi mở Popover chưa có trạng thái active rõ ràng (ví dụ: đổi màu border hoặc ring).

### 4.2. Tương Tác (Interaction)
- **Tính năng Bỏ chọn (Deselect):**
  - **Vấn đề:** Người dùng không thể bỏ chọn ngày sau khi đã chọn (không có nút "X" hoặc click lại để bỏ chọn). Điều này gây khó khăn nếu trường ngày là không bắt buộc.
  - **Giải pháp:** Thêm nút "Xóa" hoặc set `required={false}` cho Calendar.
- **Phạm vi Năm (Year Range):**
  - Mặc định từ 1900 đến (Năm hiện tại + 10). Phạm vi này an toàn cho "Ngày sinh" nhưng có thể quá rộng cho các trường hợp khác (ví dụ: Lịch hẹn).
  - **Đề xuất:** Props `fromYear` và `toYear` đã có, nhưng nên cân nhắc default value thông minh hơn hoặc bắt buộc truyền vào tùy ngữ cảnh sử dụng.
- **Trải nghiệm Mobile:**
  - Dropdown native `<select>` thực ra lại tốt cho mobile (sử dụng native picker của OS). Cần đảm bảo touch target đủ lớn.

### 4.3. Code & Logic
- **Clean Code:** Code hiện tại khá sạch, logic tách biệt.
- **Naming:** Tên biến rõ nghĩa.
- **Comments:** Đầy đủ và bằng Tiếng Việt.

## 5. Kế Hoạch Hành Động (Refactor Plan)

Để nâng cấp component này lên chuẩn "Premium" và sửa lỗi ngôn ngữ, đề xuất thực hiện các thay đổi sau:

1.  **Sửa Lỗi Ngôn Ngữ (Ưu tiên cao):**
    - Trong `date-picker.tsx`, cập nhật prop `formatters` cho `Calendar`:
      ```tsx
      formatters={{
        formatCaption: (date) => format(date, "'Tháng' MM 'Năm' yyyy", { locale: vi }),
        formatMonthDropdown: (date) => format(date, "'Tháng' MM", { locale: vi }), // Fix lỗi tiếng Anh
      }}
      ```

2.  **Thêm Tính Năng "Xóa" & Toggle:**
    - Thêm prop `required={false}` vào `Calendar` để cho phép click lại ngày đã chọn để bỏ chọn.
    - Thêm nút icon "X" nhỏ (ghost button) bên phải trong nút trigger (chỉ hiện khi có `date`) để xóa nhanh.

3.  **Tinh Chỉnh UI:**
    - Thêm style `ring-2 ring-primary/20` cho nút trigger khi `isPopoverOpen` là true.
    - Thêm hiệu ứng hover mượt mà hơn cho nút "Hôm nay".

---
**Kết luận:** Component cần được sửa ngay lỗi hiển thị ngôn ngữ để đảm bảo trải nghiệm người dùng Việt Nam. Các cải tiến về UX (nút Xóa, style) sẽ làm tăng giá trị sản phẩm.
