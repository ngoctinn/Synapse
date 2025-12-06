# Báo Cáo Đánh Giá Frontend & Layout: ResourceTimeline

## 1. Tổng Quan Component
- **Đường dẫn**: `src/features/appointments/components/resource-timeline.tsx`
- **Chức năng**: Hiển thị lịch hẹn theo tài nguyên (nhân viên) trên trục thời gian ngang. Hỗ trợ cuộn 2 chiều và drag-to-scroll.
- **Dependencies chính**: `date-fns`, `AppointmentCard`, `Avatar` (Shared UI).

## 2. Đánh Giá Frontend (FSD & Clean Code)

### 2.1. Tuân Thủ Feature-Sliced Design (FSD)
- **Cấu trúc**: Component nằm đúng vị trí `features/appointments/components`.
- **Public API**: Được export chính xác qua `features/appointments/index.ts`.
- **Imports**: Các import tuân thủ quy tắc, sử dụng alias `@/shared/ui`. Sibling imports (`./appointment-card`) hợp lệ.

### 2.2. Next.js 16 & React Guidelines
- **Directive**: Component sử dụng Hooks (`useRef`, `useState`, `useEffect`) nhưng thiếu directive `'use client'` ở đầu file.
  - *Lưu ý*: Mặc dù parent (`AppointmentTimeline`) đã có `'use client'`, việc thêm explicit directive vào component stateful giúp tăng tính độc lập và portable.
- **Clean Code**:
  - Logic tính toán vị trí (`currentTimePosition`) và xử lý sự kiện drag-to-scroll khá dài dòng, làm component bị phình to (gần 300 dòng).
  - Sử dụng "Magic Numbers" trong logic scroll (`* 1.5`).

## 3. Đánh Giá Layout & UX (UX Guidelines)

### 3.1. Layout & Z-Index
- **Z-Index Scale**: Hệ thống Z-Index hiện tại (`z-10`, `z-20`, `z-30`, `z-40`) chưa tuân thủ hoàn toàn scale tiêu chuẩn (10, 20, 30, 50).
  - *Hiện tại*: `z-40` cho Header Corner.
  - *Đề xuất*: Sử dụng `z-50` cho các phần tử overlay cao nhất (như dropdown menu nếu có) và điều chỉnh lại scale cho thống nhất.
- **Sticky Positioning**: Logic sticky hoạt động tốt cho cả Header và Sidebar.

### 3.2. Touch & Interaction (Mobile/Tablet)
- **Touch Targets**:
  - `Avatar` trong sidebar có kích thước `h-10 w-10` (40px).
  - *Vi phạm*: Minimum touch target theo guideline là **44px**.
  - *Hiện tượng*: User trên mobile có thể khó chạm chính xác vào avatar để xem profile (nếu có tính năng này).
- **Drag-to-Scroll**:
  - Logic tính toán thủ công (`scrollLeft - walkX`) có thể gây xung đột với native scroll behavior của trình duyệt trên một số thiết bị.
  - Thiếu visual feedback khi đang "grab" (ngoài con trỏ chuột).

### 3.3. Accessibility (A11Y)
- **ARIA Roles**: Sử dụng tốt `role="grid"`, `role="row"`, `role="columnheader"`.
- **Keyboard Navigation**:
  - Component hiện tại phụ thuộc hoàn toàn vào chuột/touch để scroll.
  - *Thiếu*: Khả năng navigate bằng bàn phím (Arrow Keys) để di chuyển giữa các slot thời gian hoặc appointment.
- **Contrast**: Text `text-muted-foreground` trên nền `bg-background` cần kiểm tra lại contrast ratio ở chế độ Dark Mode.

## 4. Đề Xuất Cải Tiến Chi Tiết

### Mức Độ Nghiêm Trọng Cao (Cần sửa ngay)
| Vấn Đề | Vị Trí | Giải Pháp |
|--------|--------|-----------|
| **Touch Target** | Avatar Sidebar | Tăng kích thước Avatar lên `h-11 w-11` (44px) hoặc tăng padding bao quanh. |
| **Missing Directive** | File Header | Thêm `'use client';` vào dòng 1. |

### Mức Độ Trung Bình (Nên sửa)
| Vấn Đề | Vị Trí | Giải Pháp |
|--------|--------|-----------|
| **Hardcoded Logic** | Drag Scroll | Tách logic drag-to-scroll ra custom hook riêng (`useDraggableScroll`) để giảm độ phức tạp component. |
| **Keyboard Nav** | Container | Thêm xử lý sự kiện `onKeyDown` để hỗ trợ scroll bằng phím mũi tên. |

### Mức Độ Thấp (Polish)
| Vấn Đề | Vị Trí | Giải Pháp |
|--------|--------|-----------|
| **Z-Index** | CSS Classes | Chuẩn hóa lại các giá trị z-index theo scale 10-20-30-50. |
| **Magic Number** | Speed Factor | Đưa hệ số tốc độ scroll (`1.5`) vào `APPOINTMENT_SETTINGS`. |

## 5. Kế Hoạch Hành Động (Gợi Ý Refactor)

1. **Refactor Code**:
   - Thêm `'use client'`.
   - Extract logic Drag-to-Scroll sang hook `src/shared/hooks/use-draggable-scroll.ts`.
2. **UX Improvements**:
   - Tăng size Avatar.
   - Thêm hỗ trợ Keyboard navigation.
3. **Verify**:
   - Kiểm tra build và test trên mobile emulator.

---
*Báo cáo được tạo bởi Workflow Review.*
