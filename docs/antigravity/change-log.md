# Change Log - UI/UX Consistency Refinement

## 2025-12-24: Phase 14 - Audited UI/UX & A11y Refinement

### Giai đoạn 1: Core Layout & Admin Infrastructure (Hoàn tất)
- **Cải thiện A11y**: Bọc Breadcrumbs trong thẻ `<nav aria-label="Breadcrumb">` (Fix Issue 23).
- **Dark Mode Compatibility**: Chuyển đổi toàn bộ màu sắc nền và chữ của Breadcrumbs/Header sang semantic colors (Fix Issue 6).
- **UX Refinement**: Loại bỏ hiệu ứng `active:scale` bồng bềnh và các CSS `!important` trong sidebar (Fix Issue 18, 25).
### Giai đoạn 2: Booking Wizard & Layout (Hoàn tất)
- **ServiceCard**: Tăng `line-clamp-2` cho tiêu đề và mô tả, đảm bảo hiển thị đủ thông tin. Thêm hiệu ứng `ring` và `active:scale` để tăng phản hồi tactile (Fix Issue 4, 5, 8).
- **TimeSlots**:
    - Thêm **Sticky Headers** cho các nhóm giờ (Sáng/Chiều/Tối) giúp định hướng khi cuộn (Fix Issue 30).
    - Triển khai **Empty State** trực quan với minh họa `CalendarOff` khi không có lịch trống (Fix Issue 10).
    - Cân đối Grid bằng `auto-fill` giúp layout co giãn thông minh trên mọi kích cỡ màn hình (Fix Issue 20).
### Giai đoạn 3: Dashboard & Stats (Hoàn tất)
- **StatsCards**: Chuyển đổi màu sắc hardcoded sang logic màu động (`text-blue-500`, `bg-blue-500/10`) giúp hiển thị tốt trên cả Light và Dark Mode (Fix Issue 1).
- **RecentAppointments**:
    - Loại bỏ `shadow-inner` gây cảm giác cũ kỹ, thay bằng `shadow-sm` cho Card và `py-2.5` cho time slot (Fix Issue 3).
    - Tăng kích thước chữ cho Label "Chuyên viên" (10px -> 12px) để đảm bảo khả năng đọc (Fix Issue 2).
- **StatBadge**:
    - Thay đổi `cursor-help` thành `cursor-default` để tránh gây hiểu lầm cho người dùng (Fix Issue 14).
    - Thêm padding chuẩn cho Tooltip để text không sát viền (Fix Issue 26).

### Giai đoạn 4: Billing & Accessibility (Hoàn tất)
- **InvoiceTable**:
    - Tăng độ tương phản cho trạng thái "Thanh toán chờ" bằng cách sử dụng `text-amber-600` đạt chuẩn WCAG AA (Fix Issue 16).
    - Thêm thuộc tính `aria-label` chi tiết cho các nút Xem hóa đơn (Fix Issue 21).

### Giai đoạn 5: Auth Forms & UX Polish (Hoàn tất)
- **LoginForm**:
    - Áp dụng `max-width-md` cho form đăng nhập để bố cục tập trung hơn trên màn hình lớn (Fix Issue 15).
    - Thay thế `animate-fade-in` (có thể gây giật) bằng các class `animate-in fade-in slide-in-from-bottom` mượt mà của Tailwind CSS (Fix Issue 22).
    - Thêm chỉ báo `required` cho các trường bắt buộc (Fix Issue 24).
    - Vô hiệu hóa link "Quên mật khẩu" khi đang trong trạng thái Loading (Fix Issue 28).
- **EventCard**: Sửa lỗi cộng chuỗi màu hex không an toàn bằng hàm helper `getEventStyles` đảm bảo mã màu luôn hợp lệ (Fix Issue 7).

## 2025-12-24: Stage 1 to 4 - Comprehensive UI Refinement (Phase 13)

### Giai đoạn 1 & 2: Layout, Core & Forms (Hoàn tất)
-   **Chuẩn hóa Layout**: Cập nhật `PageShell`, `PageHeader`, `PageFooter` để đồng nhất cấu trúc trang, hoạt ảnh và vị trí phân trang.
-   **Chuẩn hóa Form**: Cập nhật `FormLabel` hỗ trợ prop `required`. Thay thế `RequiredMark` thủ công.
-   **Chuẩn hóa Component**: Tạo `SearchInput` và `Icon` component để dùng chung cho toàn dự án.
-   **Đồng nhất UI**: Áp dụng layout Sheet chuẩn (fixed header/footer, scrollable area) cho toàn bộ các form quản lý.

### Giai đoạn 3 & 4: Data & Visual Alignment (Hoàn tất)

#### 1. Trung tâm hóa Hệ thống Icon (Centralized Icon System)
-   **Thay đổi**: Chuyển đổi toàn bộ việc sử dụng trực tiếp Lucide icons sang component `Icon` chuẩn (`@/shared/ui/custom/icon`).
-   **Mục tiêu**: Đảm bảo toàn bộ icon có kích thước đồng nhất (`size-4` cho UI thông thường, `size-xl` cho loaders) và `stroke-width` chuẩn.
-   **Phạm vi**: Đã hoàn tất cho `Appointments`, `Customers`, `Staff`, `Services`, `Resources`, `Waitlist` và các Shared Components (`EmptyState`, `SearchInput`).

#### 2. Chuẩn hóa Badge & Presets (Badge Standardization)
-   **Thay đổi**:
    -   Tích hợp triệt để prop `preset` của component `Badge`.
    -   Bổ sung preset `status-active` (Hoạt động) và `status-inactive` (Ngưng) vào hệ thống `BADGE_PRESETS`.
-   **Phạm vi**: Áp dụng cho bảng khách hàng, bảng tài nguyên và bảng lịch hẹn.

#### 3. Bộ Helpers Định dạng Dữ liệu (Formatting Helpers)
-   **Thay đổi**: Thêm `formatDate`, `formatTime`, `formatDateTime` vào `@/shared/lib/utils.ts`.
-   **Lợi ích**: Đảm bảo hiển thị ngày giờ chuẩn Việt Nam (DD/MM/YYYY HH:mm) nhất quán trên toàn hệ thống mà không cần định dạng thủ công nhiều lần.

#### 4. Cải tiến Trải nghiệm Người dùng (UX Improvements)
-   **Trạng thái trống (Empty States)**: Cập nhật `DataTableEmptyState` sử dụng Icon chuẩn kích thước lớn, giúp giao diện trực quan hơn khi chưa có dữ liệu.
-   **Hiệu ứng tải (Loading States)**: Chuẩn hóa loader trong `CustomerTable` và `Appointments` bằng Icon xoay đồng nhất.
-   **Xử lý Toast**: Đồng nhất nội dung và tiêu đề thông báo thành công/thất bại.

---

    - Cải thiện Header Logo: Ẩn text mượt mà bằng `duration-300` khi collapse.
- **Group Headers**: Chuyển sang font `bold`, kích thước `10px`, màu `muted-foreground/40` và `uppercase` để tối ưu diện tích và tăng tính thẩm mỹ cao cấp.

## Kết quả kiểm tra (Verification)
- [x] **TypeScript**: `pnpm tsc --noEmit` Pass.
- [x] **Lint**: `pnpm lint` (Manual checkPassed).
- [x] **Build**: `pnpm build` Pass (Success).

**Người thực hiện**: Antigravity AI
**Trạng thái**: Giai đoạn 1-4 Hoàn tất theo kế hoạch.
