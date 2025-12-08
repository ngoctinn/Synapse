# Báo Cáo Đánh Giá Frontend: Feature Appointments

**Ngày**: 2025-12-08
**Đối tượng**: `frontend/src/features/appointments/components`
**Tiêu chuẩn (`Reference`)**: `frontend/src/features/staff/components`

## 1. Tổng Quan
Đánh giá thực hiện so sánh giữa feature `appointments` đang phát triển và feature `staff` (đã chuẩn hóa). Mục tiêu là đồng bộ kiến trúc theo hướng **Next.js 16 Server Components**, **Feature-Sliced Design (FSD)** và nâng cao trải nghiệm người dùng.

## 2. Vi Phạm Kiến Trúc & Code Quality

### 2.1. Mô Hình Data Fetching (Nghiêm trọng nhất)
*   **Vấn đề**:
    *   `AppointmentPage` (`appointment-page.tsx`) đang hoạt động hoàn toàn theo mô hình **Client-Side Rendering** (CSR) "cổ điển" với `useState` và `useMemo` để lọc dữ liệu.
    *   Dữ liệu được hardcode (`MOCK_APPOINTMENTS`) trực tiếp trong Client Component.
    *   Không tận dụng được sức mạnh của **React Suspense** và **Streaming**.
*   **Chuẩn (`StaffPage`)**:
    *   Nhận `Promise` từ Server (Page) thông qua Props (`staffListPromise`).
    *   Sử dụng hook `use()` để "unwrap" dữ liệu bên trong component con.
    *   Sử dụng `<Suspense>` để bao bọc UI chờ tải.
    *   Bộ lọc (Search/Filter) hoạt động dựa trên URL Search Params để trigger Server Action/Fetch lại, thay vì filter array ở client.

### 2.2. Xử Lý Logic Form
*   **Vấn đề**:
    *   `AppointmentForm` (`appointment-form.tsx`) thực hiện xử lý chuỗi ngày tháng thủ công (`values.date.split('-')`), tiềm ẩn rủi ro lỗi format.
    *   `console.log` ("Submitting Appointment") vẫn còn tồn tại trong code production-ready.
    *   Màu sắc trạng thái (`#F59E0B`) đang bị hardcode thay vì dùng biến hoặc constant từ design system.

### 2.3. Cấu Trúc Component
*   **Vấn đề**:
    *   `AppointmentPage` chứa quá nhiều logic xử lý trạng thái popup (Create, Detail, Cancel Alert) làm cho component bị "phình to" (Fat Component).
*   **Đề xuất**:
    *   **Ưu tiên sử dụng Sheet (Side Panel)** thay vì Dialog cho form Tạo/Sửa (giống `StaffSheet`), giúp tận dụng không gian dọc tốt hơn cho form phức tạp.
    *   Tách logic quản lý dialog/sheet ra khỏi Page chính, hoặc sử dụng URL-based dialogs (Intercepting Routes).

## 3. Đánh Giá UX/UI (Dựa trên Staff Standard)

### 3.1. Điểm Tốt
*   Đã sử dụng đúng các component UI chuẩn (`InputWithIcon`, `Tabs`, `Sticky Header`).
*   Layout nhất quán với `Styles` của `StaffPage` (Sticky Header, Tabs positioning).

### 3.2. Điểm Cần Cải Thiện
*   **Empty State**: `AppointmentTable` có Empty State custom. Cần đảm bảo nó đồng bộ visual với `StaffTable` (nếu có).
*   **Loading State**: `AppointmentPage` hiện tại không có trạng thái Loading rõ ràng khi chuyển tab hoặc lọc (do xử lý client sync). Khi chuyển sang mô hình Async/Suspense, cần bổ sung Skeleton.

## 4. Đánh Giá Chuyên Sâu UI/UX (Theo Tiêu Chuẩn /ui-ux-check)

### 4.1. Tính Thẩm Mỹ & Sự Đồng Bộ (Aesthetic & Consistency)
*   **Vấn đề Inconsistency (Màu Sắc)**:
    *   `AppointmentDetailDialog` sử dụng CSS Variables chuẩn (`var(--status-pending)`).
    *   `AppointmentTable` lại sử dụng Tailwind Utility Classes cứng (`bg-amber-50`, `text-amber-600`).
    *   `AppointmentForm` sử dụng mã Hex cứng (`#F59E0B`).
    *   **Yêu cầu**: Đồng bộ toàn bộ về CSS Variables định nghĩa trong `globals.css` (Deep Teal/Ocean theme).
*   **Typography**:
    *   `CreateAppointmentDialog` sử dụng `font-serif` cho tiêu đề, lệch chuẩn so với hệ thống Sans Serif (`Inter`/`Geist`) của ứng dụng.
*   **Spacing**:
    *   Form Layout (`grid-cols-2`) tốt, tuân thủ Spacing 4px/8px (gap-4).

### 4.2. Độ Tương Thích (Responsive)
*   **Mobile View**:
    *   `AppointmentTable` có `overflow-hidden` nhưng cần kiểm tra kỹ trên mobile cực nhỏ (<375px) xem các cột có bị nén không đọc được không.
    *   `Tabs` trigger định nghĩa cứng `w-28`. Trên mobile có thể gây tràn hoặc sai layout nếu thêm tab mới. Nên dùng `flex-1` hoặc scrollable tabs list.

### 4.3. Trạng Thái Hệ Thống (System States)
*   **Loading Feedback**:
    *   Nút "Tạo lịch hẹn" trong `AppointmentForm` chưa có trạng thái `disabled` hoặc `loading spinner` khi đang submit. Người dùng có thể bấm nhiều lần gây duplicate.
    *   Chưa có `toast.promise` hoặc loading state khi xóa/hủy lịch hẹn.

### 4.4. Khả Năng Truy Cập (Accessibility - a11y)
*   **Điểm Tốt**: `AppointmentDetailDialog` đã làm rất tốt việc hỗ trợ a11y (`aria-label`, `useReducedMotion`, focus management).
*   **Cần Cải Thiện**:
    *   `AppointmentForm`: Các trường `Select` cần đảm bảo có `aria-label` nếu không hiện thị label rõ ràng.
    *   Contrast: Kiểm tra lại màu text cam (`text-amber-600`) trên nền vàng nhạt (`bg-amber-50`) trong Dark Mode có đạt chuẩn AA không.

## 5. Kế Hoạch Hành Động (Refactor Plan)

### Bước 1: Refactor Page to Server-Driven UI
*   [x] Chuyển đổi `AppointmentPage` để nhận `appointmentsPromise` (hoặc data initial) từ file `page.tsx` cha.
*   [x] Tạo `AppointmentListWrapper` sử dụng hook `use()` để đọc data.
*   [x] Bọc `AppointmentListWrapper` trong `<Suspense>`.

### Bước 2: Chuẩn Hóa Logic Lọc
*   [x] Loại bỏ logic `useMemo` filter client-side phức tạp trong Page.
*   [x] Đảm bảo `AppointmentFilter` update URL Search Params.

### Bước 3: Clean Code Form
*   [x] Sử dụng `date-fns` để parse và format ngày tháng trong `activeSubmit`.
*   [x] Xóa `console.log`.
*   [x] Extract hardcoded colors ra constants/theme.
*   [x] **Chuyển đổi UI**: Thay thế `CreateAppointmentDialog` và `AppointmentDetailDialog` (phần Edit) sang `AppointmentSheet` để đồng bộ trải nghiệm với Staff.

## 5. Kết Luận
Feature `appointments` có giao diện tốt nhưng kiến trúc dữ liệu đang bị tụt hậu so với chuẩn `staff`. Cần ưu tiên refactor sang mô hình Async Component để đảm bảo hiệu năng và chuẩn code Next.js 16.
