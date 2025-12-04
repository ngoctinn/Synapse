# Báo Cáo Đánh Giá Thiết Kế Chuyên Sâu: ExceptionsCalendar

**Ngày**: 04/12/2025
**Người thực hiện**: AI Assistant
**Đối tượng**: `frontend/src/features/settings/operating-hours/components/exceptions-calendar.tsx`

---

## 1. Tổng Quan & Phân Tích Hiện Trạng

Component `ExceptionsCalendar` đã được xây dựng với chất lượng thẩm mỹ khá cao, áp dụng tốt các nguyên tắc của "Premium UI" như Glassmorphism, Gradient, và Animation.

### Điểm Mạnh
- **Bố cục (Layout)**: Sử dụng Grid System (4/8 columns) hợp lý, tách biệt rõ ràng giữa phần Lịch (Input) và Danh sách (Output).
- **Thẩm mỹ (Aesthetics)**:
  - Sử dụng hiệu ứng **Glassmorphism** (`bg-card/50 backdrop-blur-md`) tạo cảm giác hiện đại.
  - **Empty State** được thiết kế rất chi tiết, có đầu tư về mặt hình ảnh (Grid pattern, Gradient icon).
  - **Type Selection** trong Dialog sử dụng Grid Card thay vì Select box nhàm chán -> Tăng trải nghiệm người dùng.
- **Tương tác (Interaction)**:
  - Có hỗ trợ **Drag-to-select** trên lịch.
  - Animation mượt mà với `framer-motion` (`AnimatePresence`, `layout`).

### Điểm Cần Cải Thiện
Tuy nhiên, vẫn còn một số điểm chưa đồng bộ và có thể nâng cấp để đạt độ hoàn thiện "Pixel-perfect".

---

## 2. Chi Tiết Đánh Giá & Đề Xuất

### 2.1. Visual Consistency (Sự Nhất Quán)

**Vấn đề 1: Filter UI không đồng bộ**
- **Hiện tại**: Bộ lọc "Trạng thái" sử dụng `Select` (Dropdown) chuẩn của Shadcn, trong khi bộ lọc "Loại sự kiện" sử dụng các nút bấm (Buttons) tùy chỉnh hình viên thuốc (Pill-shape).
- **Đánh giá**: Sự thiếu nhất quán này làm giảm tính liền mạch của thanh công cụ.
- **Đề xuất**: Chuyển đổi bộ lọc "Trạng thái" sang dạng **Toggle Group** hoặc **Pill Button** giống như "Loại sự kiện" để tạo sự đồng bộ.

**Vấn đề 2: Animation Classes chưa xác định**
- **Hiện tại**: Code sử dụng các class `animate-bounce-subtle` (dòng 234) và `animate-pulse-horizontal` (dòng 430).
- **Đánh giá**: Kiểm tra `globals.css` không thấy định nghĩa các keyframes này. Có thể dẫn đến việc animation không hoạt động.
- **Đề xuất**:
  - Thêm keyframes vào `globals.css` hoặc `tailwind.config.ts`.
  - Hoặc sử dụng `framer-motion` để thay thế cho các class CSS animation này để kiểm soát tốt hơn.

### 2.2. Typography & Hierarchy

**Vấn đề 3: Tiêu đề Dialog chưa nổi bật**
- **Hiện tại**: Tiêu đề Dialog "Thêm ngoại lệ mới" hơi đơn giản.
- **Đề xuất**: Thêm một icon nhỏ hoặc background gradient nhẹ cho phần Header của Dialog để tách biệt rõ ràng hơn với phần nội dung.

### 2.3. Colors & Contrast

**Vấn đề 4: Màu sắc Hardcoded trong Modifiers**
- **Hiện tại**: `modifiersStyles` (dòng 96-100) đang hardcode màu text (`color: 'var(--destructive)'`).
- **Đánh giá**: Mặc dù dùng biến CSS là tốt, nhưng việc set trực tiếp `style` object có thể khó override nếu cần.
- **Đề xuất**: Sử dụng Class Name modifier của `react-day-picker` thay vì Inline Styles để tận dụng sức mạnh của Tailwind (ví dụ: `modifiersClassNames`).

### 2.4. "Premium" Factor (Yếu tố cao cấp)

**Đề xuất 1: Nâng cấp Calendar Container**
- Thêm hiệu ứng **Inner Glow** hoặc **Gradient Border** nhẹ cho container chứa lịch để làm nó nổi bật hơn trên nền tối.
- Ví dụ: `ring-1 ring-white/20` hiện tại là tốt, nhưng có thể thêm `shadow-[0_0_15px_rgba(var(--primary),0.1)]`.

**Đề xuất 2: Cải thiện Empty State**
- Thêm animation nhẹ cho background grid (`bg-grid-slate-100`) để tạo cảm giác "sống động" (breathing effect).

---

## 3. Kế Hoạch Cải Tiến (Action Plan)

### Bước 1: Chuẩn hóa Animation
- Định nghĩa lại `animate-bounce-subtle` và `animate-pulse-horizontal` trong `globals.css`.

### Bước 2: Refactor Filter Bar
- Viết lại phần Filter Bar để sử dụng chung một ngôn ngữ thiết kế (Pill Buttons) cho cả Trạng thái và Loại sự kiện.

### Bước 3: Tinh chỉnh Calendar Visual
- Chuyển `modifiersStyles` sang `modifiersClassNames`.
- Thêm hiệu ứng hover/focus state tốt hơn cho các ngày trong lịch.

### Bước 4: Polish Dialog
- Cải thiện UI của Dialog form, đặc biệt là phần Input "Lý do" có thể dùng Floating Label hoặc Icon prefix để đẹp hơn.

---

## 4. Kết Luận

Component `ExceptionsCalendar` đã đạt 8.5/10 điểm về mặt thiết kế. Các thay đổi đề xuất chủ yếu tập trung vào sự nhất quán (Consistency) và các chi tiết nhỏ (Micro-details) để nâng tầm trải nghiệm lên mức 10/10.
