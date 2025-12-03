# Báo cáo Đánh giá Thiết kế Chuyên sâu: Module Quản lý Lịch hẹn

**Ngày báo cáo:** 03/12/2025
**Phạm vi:** `frontend/src/app/(admin)/admin/appointments`
**Người thực hiện:** Antigravity (AI Assistant)

---

## 1. Tổng quan & Phân tích Hiện trạng

Module Quản lý Lịch hẹn (`Appointments`) đóng vai trò trung tâm trong hệ thống CRM cho Spa. Hiện tại, giao diện đã được xây dựng dựa trên **Feature-Sliced Design (FSD)** và sử dụng thư viện **Shadcn/UI** kết hợp với **Tailwind CSS**.

### 1.1. Bố cục (Layout) & Cấu trúc
- **Cấu trúc tổng thể:** Sử dụng layout 2 cột (Sidebar bộ lọc bên trái + Khu vực nội dung chính bên phải). Đây là mô hình chuẩn cho các trang quản lý phức tạp.
- **Grid & Spacing:**
  - Sử dụng `gap-4`, `p-4`, `p-6` khá nhất quán.
  - **Lịch (Calendar):** Grid được xây dựng thủ công bằng `div` và `flex/grid`. Cách tiếp cận này linh hoạt nhưng cần cẩn thận với việc căn chỉnh pixel-perfect giữa các cột ngày và dòng giờ.
- **Responsiveness:**
  - `min-w-[800px]` trong `AppointmentCalendar` và `AppointmentTable` đảm bảo không bị vỡ layout trên desktop, nhưng sẽ xuất hiện thanh cuộn ngang trên mobile/tablet. Điều này chấp nhận được với các bảng dữ liệu phức tạp nhưng cần cải thiện trải nghiệm cuộn.

### 1.2. Chi tiết Thành phần (Component Details)
- **Typography:** Sử dụng `Be Vietnam Pro` (thông qua biến `--font-sans`). Các tiêu đề và văn bản có phân cấp rõ ràng (`text-lg`, `font-semibold`, `text-xs`).
- **Màu sắc (Colors):**
  - Tuân thủ bảng màu `oklch` của hệ thống.
  - Mã màu nhân viên (`STAFF_COLORS`) đang được xử lý hơi thủ công trong code (`bg-blue-50`, `border-blue-500`...).
- **Trạng thái (States):**
  - `HoverCard` trong lịch hoạt động tốt, cung cấp thông tin chi tiết nhanh.
  - Các nút bấm và row trong bảng đều có trạng thái hover.

---

## 2. Đánh giá Thẩm mỹ & "Premium" Factor

### 2.1. Điểm mạnh
- **Sạch sẽ & Hiện đại:** Giao diện sử dụng nhiều khoảng trắng (white space), tạo cảm giác thoáng đãng.
- **Micro-interactions:** Đã có sử dụng `framer-motion` cho `AppointmentSidebar` (ẩn/hiện bộ lọc) và `AppointmentViewTransition`.
- **Quick Actions:** Tính năng "Hành động nhanh" (Gọi điện, Nhắn tin) ẩn hiện khi hover vào dòng trong bảng là một chi tiết UX tinh tế.

### 2.2. Điểm cần cải thiện (The "Missing Piece")
Mặc dù giao diện đã tốt, nhưng để đạt mức "Premium" và "WOW", cần bổ sung thêm chiều sâu và sự tinh tế trong các chuyển động.

- **Thanh chỉ báo thời gian (Current Time Indicator):** Hiện tại chỉ là một đường kẻ đơn giản. Cần thêm hiệu ứng "Glow" hoặc "Pulse" để tạo điểm nhấn sống động.
- **Glassmorphism:** Header của lịch và các thành phần sticky chưa tận dụng tốt hiệu ứng mờ (blur) để tạo cảm giác lớp (layering) hiện đại.
- **Chuyển đổi View:** Việc chuyển đổi giữa List và Calendar đang dùng `AppointmentViewTransition` (fade/scale), nhưng có thể mượt mà hơn nữa với `layout` animation.

---

## 3. Đề xuất Cải tiến (Action Plan)

Dưới đây là các đề xuất cụ thể để nâng cấp giao diện lên tầm cao mới:

### 3.1. Nâng cấp Visual & UI (Premium Look)

#### A. Hiệu ứng "Glow" cho Thanh thời gian hiện tại
Thay vì chỉ là `border-t-2`, hãy thêm `box-shadow` và một chấm tròn phát sáng (pulse animation).

```tsx
// Đề xuất thay đổi trong appointment-calendar.tsx
<div className="absolute w-full border-t-2 border-blue-500 z-10 pointer-events-none shadow-[0_0_10px_rgba(59,130,246,0.5)]">
  <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.6)] animate-pulse ring-2 ring-white" />
</div>
```

#### B. Áp dụng Glassmorphism tinh tế
Tăng cường hiệu ứng kính mờ cho các phần tử dính (sticky headers) để nội dung bên dưới trượt qua một cách mượt mà.

```tsx
// Header ngày trong tuần
<div className="grid grid-cols-8 border-b sticky top-0 z-20 shadow-sm bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
  {/* ... */}
</div>
```

#### C. Tinh chỉnh Card Lịch hẹn (Appointment Card)
Thêm chiều sâu cho các card lịch hẹn bằng `shadow-sm` và border nhẹ nhàng hơn. Sử dụng gradient rất nhẹ (subtle gradient) cho background thay vì màu bệt (flat color) để tạo cảm giác cao cấp.

### 3.2. Cải thiện UX & Micro-animations

#### A. Smooth View Transition
Sử dụng `LayoutGroup` của `framer-motion` để khi chuyển đổi giữa List và Calendar, các thành phần chung (như khung bao) có thể co giãn mượt mà thay vì chỉ fade in/out.

#### B. "Magnetic" Hover Effect
Áp dụng hiệu ứng từ tính nhẹ cho các nút hành động (Quick Actions) trong bảng để tạo cảm giác thú vị khi tương tác.

#### C. Cải thiện Scrollbar
Đảm bảo thanh cuộn trong khu vực lịch (vốn rất dài và rộng) được style lại mảnh mai và tinh tế hơn, tránh dùng thanh cuộn mặc định của trình duyệt gây thô.

### 3.3. Refactor & Clean Code (Technical)

- **Tách nhỏ Component:** `AppointmentCalendar` đang khá lớn (~400 dòng). Nên tách phần `CalendarHeader`, `CalendarGrid`, `AppointmentCard` ra thành các component nhỏ hơn.
- **Xử lý màu sắc động:** Thay vì dùng `style jsx` hoặc logic map màu thủ công, hãy định nghĩa một `const STAFF_THEMES` trong file constants và map trực tiếp vào Tailwind classes (ví dụ dùng `data-color="blue"` và style qua CSS variables).

---

## 4. Kết luận

Giao diện hiện tại đã đạt chuẩn MVP+ với cấu trúc rõ ràng và tuân thủ FSD. Việc áp dụng các đề xuất trên (đặc biệt là **Glow Effect**, **Glassmorphism**, và **Refactor Component**) sẽ giúp module này không chỉ hoạt động tốt mà còn mang lại trải nghiệm thị giác ấn tượng ("WOW factor") cho người dùng.
