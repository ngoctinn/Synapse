# Báo Cáo Đánh Giá Frontend: Appointments Feature

## 1. Tuân Thủ Kiến Trúc (FSD & Clean Code)

### 1.1. Cấu Trúc Thư Mục
*   **Trạng thái**: ✅ Đạt yêu cầu.
*   **Chi tiết**: Module `appointments` tuân thủ pattern `index.ts` làm Public API. Các components được tổ chức trong `components/`.
*   **Ghi chú**: File `utils.ts` (nếu có logic phức tạp) có thể được tách ra khỏi components nếu logic tính toán ngày tháng trong `resource-timeline.tsx` phình to.

### 1.2. Deep Imports
*   **Trạng thái**: ✅ Tốt.
*   **Phân tích**: Không phát hiện import xuyên module không hợp lệ trong các file đã đọc. Các import từ shared (`@/shared/ui/...`, `@/shared/lib/...`) đều hợp lệ.

### 1.3. Next.js 16 & Server Actions
*   **Trạng thái**: ⚠️ Cần lưu ý.
*   **Vấn đề**:
    *   `appointment-page.tsx` hiện là Client Component (`"use client"`). Điều này ổn nếu nó chỉ render UI tương tác, nhưng để tối ưu SEO và Performance (First Contentful Paint), nên cân nhắc fetch dữ liệu lịch hẹn ban đầu tại Server Component cha (ví dụ `app/(dashboard)/appointments/page.tsx`) và truyền xuống dưới dạng prop, thay vì hardcode `MOCK_DATA` bên trong client component.
    *   Chưa thấy sử dụng `Server Actions` cho việc tạo/cập nhật lịch hẹn (tương lai sẽ cần cho `CreateAppointmentDialog`).

### 1.4. Code Styling & Convention
*   **Trạng thái**: ✅ Tốt.
*   **Chi tiết**:
    *   Naming convention (snake_case cho biến, PascalCase cho component) được tuân thủ.
    *   Sử dụng `date-fns` là chuẩn.
    *   Code tường minh, dễ đọc.

## 2. Đánh Giá & Đề Xuất UX/UI Cao Cấp

### 2.1. Micro-interactions
*   **Hiện tại**: `AppointmentCard` đã có hover animation (`scale: 1.02`).
*   **Đề xuất**:
    *   Thêm `layout` prop của Framer Motion vào `ResourceTimeline` để các thẻ tự động trượt mượt mà khi lọc hoặc thay đổi view.
    *   Hiệu ứng skeleton loading khi chuyển ngày/tuần thay vì nháy content.

### 2.2. Drag-to-Scroll UX
*   **Vấn đề**: Logic drag-to-scroll hiện tại (`resource-timeline.tsx`) mô phỏng lại hành vi native scroll nhưng có thể thiếu quán tính (inertia) và overscroll bounce tự nhiên của hệ điều hành.
*   **Đề xuất**: Cân nhắc sử dụng thư viện chuyên dụng như `react-use-gesture` kết hợp `react-spring` hoặc `framer-motion` drag constraints để có cảm giác vật lý "thật" hơn, hoặc đơn giản là để browser handle native scroll nếu không cần tính năng custom đặc biệt.

### 2.3. Responsive Design
*   **Vấn đề**: `AppointmentPage` có logic tính toán `header-height` cho mobile/desktop.
*   **Đề xuất**: Sử dụng CSS Container Queries (nếu support) hoặc Tailwind `md:` variants thuần túy để tránh JS calculation cho styling layout.

## 3. Kế Hoạch Hành Động (Refactor Plan)

### Bước 1: Chuẩn hóa Styles (Layout Refactor)
*   Thực hiện các sửa đổi trong báo cáo Layout Review (Semantic colors, touch targets).

### Bước 2: Tách Logic Data (Frontend Refactor)
*   Chuyển `MOCK_DATA` ra khỏi component, chuẩn bị interface để nhận data từ props.
*   Định nghĩa `actions.ts` (Server Actions) để fetch appointments từ DB (khi có backend).

### Bước 3: Nâng cấp UX
*   Cải thiện logic Scroll.
*   Thêm Loading State.

## 4. Kết Luận
Module `appointments` được viết khá sạch và tuân thủ tốt các quy tắc cơ bản. Vấn đề chính nằm ở việc hardcode stylist (màu sắc, kích thước) và chưa tận dụng hết sức mạnh của Server Components.
