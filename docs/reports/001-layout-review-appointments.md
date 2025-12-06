# Báo Cáo Đánh Giá Layout: Appointments Feature

## 1. Tổng Quan Component
- **Đường dẫn**: `frontend/src/features/appointments/`
- **Chức năng**: Quản lý lịch hẹn, hiển thị timeline tài nguyên, tạo lịch hẹn.
- **Dependencies chính**: `date-fns`, `framer-motion`, `lucide-react`, Shadcn UI (`Button`, `Select`, `Dialog`, `Tabs`).

## 2. Các Vấn Đề Phát Hiện

### Mức Độ Nghiêm Trọng Cao (High)
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|--------|--------|-------|-----------|
| **Touch Target Size** | `appointment-filter.tsx` | Các item trong `SelectContent` (lọc nhân viên) có thể nhỏ trên mobile. | Đảm bảo `SelectItem` có height tối thiểu 44px hoặc padding đủ rộng. |
| **Accessibility** | `resource-timeline.tsx` | Chức năng Drag-to-Scroll tự chế có thể gây xung đột với thao tác chạm cuộn trang tự nhiên trên màn hình cảm ứng nếu không xử lý kỹ `touch-action`. | Thêm `touch-action: pan-y` hoặc `pan-x` vào container tùy theo hướng cuộn mong muốn. Hiện tại `touch-none` có thể chặn cuộn trang hoàn toàn. |
| **Color Contrast** | `appointment-card.tsx` | Màu nền pastel (ví dụ `bg-amber-50/90`) kết hợp với opacity có thể khiến text khó đọc trên các màn hình độ sáng thấp hoặc high contrast mode. | Kiểm tra contrast ratio. Đảm bảo text `text-amber-900` trên nền `amber-50` đạt chuẩn AAA hoặc tối thiểu AA. |

### Mức Độ Nghiêm Trọng Trung Bình (Medium)
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|--------|--------|-------|-----------|
| **Hardcoded Colors** | `appointment-card.tsx` | Sử dụng màu hardcoded (`bg-amber...`, `bg-sky...`) thay vì semantic tokens từ `globals.css`. Khó thêm dark mode chuẩn hoặc đổi theme. | Map các trạng thái `pending`, `confirmed`, v.v. vào biến CSS (ví dụ `--status-pending-bg`) hoặc sử dụng màu `oklch` tương ứng trong `globals.css`. |
| **Inline Styles** | `resource-timeline.tsx` | Sử dụng nhiều inline styles để tính toán vị trí (`left`, `width`). | Chuyển logic tính toán style sang CSS Variables nếu có thể, hoặc giữ nguyên nếu hiệu năng yêu cầu (nhưng các giá trị tĩnh như width header nên dùng class/variable). |
| **Z-Index** | `calendar-header.tsx` | `z-30` được dùng hardcoded. | Nên dùng variable hoặc convention chuẩn cho z-index để tránh stacking context hell. |

### Mức Độ Thấp (Low / Khuyến Nghị)
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|--------|--------|-------|-----------|
| **Consistency** | `appointment-page.tsx` | Header height tính toán bằng style inline `--header-height`. | Nên chuyển vào `globals.css` :root để tái sử dụng toàn app. |
| **Micro-animation** | `appointment-card.tsx` | `whileHover={{ scale: 1.02 }}` là tốt, nhưng cần đảm bảo `motion-safe` cho người dùng nhạy cảm chuyển động. | Sử dụng `prefers-reduced-motion` media query hoặc logic trong Framer Motion để tắt animation này. |

## 3. Đề Xuất Cải Thiện Chi Tiết

### 3.1. Cải thiện Accessibility cho Timeline
```tsx
// resource-timeline.tsx
// Thay đổi touch-none thành touch-pan-x hoặc touch-pan-y tuỳ context
<div
  className="... touch-pan-y" // Cho phép cuộn dọc trang web, chỉ chặn cuộn ngang để xử lý drag timeline
  // ...
>
```

### 3.2. Semantic Colors cho Appointment Card
Thay vì hardcoded Tailwind colors, hãy định nghĩa trong `globals.css`:
```css
/* globals.css */
:root {
  --status-pending: oklch(0.96 0.08 85); /* Amber-like */
  --status-confirmed: oklch(0.96 0.05 240); /* Sky-like */
  /* ... */
}
```
Và sử dụng trong component:
```tsx
// appointment-card.tsx
const statusStyles = {
  pending: 'bg-[var(--status-pending)] text-[var(--status-pending-foreground)]',
  // ...
};
```

### 3.3. Tối ưu Touch Target
Trong `appointment-filter.tsx` và `calendar-header.tsx`, đảm bảo các nút bấm (Button icon) có size tối thiểu 44x44px trên mobile (có thể dùng padding ảo).

## 4. Checklist Sau Khi Sửa
- [ ] Chuyển đổi màu sắc sang Semantic Tokens (hoặc chấp nhận pastel nếu design fix cứng).
- [ ] Kiểm tra Contrast Ratio cho các thẻ Appointment.
- [ ] Review lại hành vi Drag-to-scroll trên Mobile thật.
- [ ] Đảm bảo các nút bấm icon có `aria-label`.
