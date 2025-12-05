# Báo cáo Đánh giá Frontend: Appointments Feature

**Ngày:** 05/12/2025
**Người review:** Antigravity
**Phạm vi:** `frontend/src/features/appointments`

## 1. Tổng quan & So sánh (Consistency Check)

Dựa trên yêu cầu so sánh với các trang hiện tại (`Services`, `Staff`), module `Appointments` hiện tại có sự **lệch chuẩn** đáng kể về mặt giao diện và triển khai layout.

### Điểm lệch chuẩn chính (Major Inconsistencies):

1.  **Sticky Header & Màu sắc**:
    - **Hiện tại (`Appointments`)**: Sử dụng hardcoded colors (`bg-white/80`, `bg-white`, `text-gray-900`).
    - **Chuẩn (`Services`/`Staff`)**: Sử dụng Theme Variables (`bg-background`, `bg-card`, `text-foreground`).
    - **Vấn đề**: Giao diện không hỗ trợ tốt Dark Mode và không đồng bộ với thiết kế "Premium Spa" (Soft Porcelain / Deep Teal) đang áp dụng global.

2.  **Cấu trúc Layout**:
    - **Hiện tại**: `AppointmentCalendar` tự định nghĩa chiều cao `h-[calc(100vh-4rem)]`.
    - **Chuẩn**: Sử dụng `min-h-screen flex flex-col` và để content giãn nở tự nhiên (`flex-1`). Việc hardcode `4rem` sẽ gây lỗi layout nếu Header của Admin thay đổi kích thước.

3.  **Thanh Công Cụ (Toolbar)**:
    - **Hiện tại**: Sử dụng `padding: p-4`.
    - **Chuẩn**: Sử dụng negative margin `-mx-4 px-4` để header dính sát lề (flush) với container cha, tạo cảm giác tràn viền cao cấp.
    - **Navigation**: Sử dụng `Select` để chuyển view (Timeline/Day/Month). Trong khi `Staff` dùng `Tabs`. Tuy nhiên, với Calendar thì `Select` hoặc `Segmented Control` là chấp nhận được, nhưng styling cần đồng bộ (chiều cao `h-9` thay vì mix `h-8` và `h-9`).

4.  **Typography**:
    - **Hiện tại**: Sử dụng `font-serif` cho tiêu đề ngày và tên nhân viên.
    - **Chuẩn**: Các bảng dữ liệu (Table) của `Staff` và `Services` chủ yếu dùng `font-sans` (Be Vietnam Pro). Cần xác nhận xem việc dùng Serif ở đây có phải chủ đích thiết kế không. Nếu không, nên đưa về `font-sans` để nhất quán.

## 2. Chi tiết Vi phạm & Đề xuất

### A. Code Style & FSD
| File | Vấn đề | Mức độ | Đề xuất |
| :--- | :--- | :--- | :--- |
| `calendar-header.tsx` | Hardcoded colors: `bg-white`, `text-gray-900`. | **Cao** | Đổi thành `bg-background`, `bg-card`, `text-foreground`. |
| `calendar-header.tsx` | Layout: `p-4` gây thụt lề so với header chuẩn. | Trung bình | Dùng pattern: `-mx-4 px-4 py-2 border-b` giống `ServicesPage`. |
| `appointment-calendar.tsx` | Layout: `h-[calc(100vh-4rem)]`. | Trung bình | Sử dụng `flex-1` trong container cha `flex-col` để fill chiều cao tự động. |
| `resource-timeline.tsx` | Hardcoded styles: `w-2.5 h-2.5 bg-red-500` (Red line). | Thấp | Cân nhắc đưa màu đỏ vào config hoặc dùng variable (`text-destructive` hoặc define class riêng). |
| `appointment-calendar.tsx` | State Management: Local state (`date`, `view`) nằm tại Client Component. | N/A | Tốt (Đúng mô hình Client Component cho Calendar tương tác cao). |

### B. UI/UX & Visuals
- **Buttons**: Các nút trong `CalendarHeader` đang dùng `h-8` (Next/Prev) và `h-9` (Filter).
    - -> **Fix**: Đồng bộ toàn bộ về `h-9` (36px) như đã làm ở `ServicesPage`.
- **Search/Filter**: Chưa có ô tìm kiếm nhanh (Search Input).
    - -> **Đề xuất**: Mặc dù là lịch, nhưng việc tìm kiếm nhanh "Tên khách" hoặc "SĐT" để highlight cuộc hẹn là tính năng UX quan trọng.
- **Glassmorphism**: `bg-white/80 backdrop-blur-md` trong Header.
    - -> **Fix**: Kiểm tra lại xem có trùng với `bg-background` của `ServicesPage` không. `ServicesPage` dùng `bg-background border-b` (solid/opaque). Nên đồng bộ hoặc dùng class `.glass` chuẩn nếu muốn hiệu ứng kính.

## 3. Kế hoạch Refactor (Action Plan)

Để đồng bộ với `Services` và `Staff`, cần thực hiện các bước sau:

1.  **Refactor `CalendarHeader.tsx`** [Đã hoàn thành]:
    - Thay thế màu cứng bằng variable (`bg-background`).
    - Điều chỉnh layout padding/margin để khớp với Admin Layout (-mx-4).
    - Đồng bộ kích thước nút bấm (`h-9`).
2.  **Refactor `AppointmentCalendar.tsx`** [Đã hoàn thành]:
    - Loại bỏ height calculation cứng nhắc.
    - Đảm bảo container fill full height bằng Flexbox (min-h-screen).
3.  **Refactor `ResourceTimeline.tsx`** [Đã hoàn thành]:
    - Review lại việc sử dụng `font-serif` (Đã xóa).
    - Thay thế màu nền `bg-muted/30` bằng các biến màu ngữ nghĩa (`bg-background`).
    - Cập nhật sticky header top position.

## 4. Kết luận

Feature `Appointments` đang hoạt động tốt về mặt chức năng (trên mock data) nhưng **lệch pha về giao diện (Visual Style)** so với phần còn lại của Admin Dashboard. Cần ưu tiên sửa đổi màu sắc và kích thước header.
