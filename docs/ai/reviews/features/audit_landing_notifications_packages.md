# Báo cáo Đánh giá Feature: Landing Page

## 1. Phân tích Giao diện & Style
- **Thành phần chính:** `Hero`, `ServicesSection`, `Features`, `Testimonials`.
- **Hiệu ứng:** `animate-fade-in`, `animate-slide-up`, `animate-bounce`, `text-gradient-premium`, `shadow-premium-primary`.
- **Bố cục:** Sử dụng `glass-card` cho Dashboard Mockup, các blob nền (`bg-blob`) để tạo chiều sâu.

## 2. Câu hỏi Phản biện
1. **Về Hiệu năng & Tài nguyên:**
   - Tại sao lại sử dụng các "blob" nền (`bg-blob`) với kích thước cực lớn (`w-[50rem] h-[50rem]`)? Việc này có gây ra hiện tượng giật lag khi cuộn trang trên các trình duyệt di động không?
   - Dashboard Mockup được xây dựng hoàn toàn bằng các thẻ `div` và class Tailwind. Tại sao không sử dụng một hình ảnh SVG hoặc WebP tối ưu để giảm số lượng DOM node?

2. **Về Nhất quán Thương hiệu:**
   - `text-gradient-premium` và `shadow-premium-primary` là các class tùy chỉnh. Tại sao chúng không được định nghĩa trong hệ thống Design System chung của `shadcn/ui`?
   - Tại sao Landing Page lại có phong cách "Premium" với nhiều gradient và hiệu ứng, trong khi giao diện Admin lại đi theo hướng tối giản (Minimalist)? Sự khác biệt này có làm người dùng cảm thấy hụt hẫng khi chuyển từ trang chủ vào trang quản trị không?

3. **Về UX & Khả năng truy cập:**
   - Nút "Bắt đầu miễn phí" có shadow rất đậm (`shadow-premium-primary`). Liệu shadow này có đảm bảo tính thẩm mỹ trên cả Dark Mode không?
   - Dashboard Mockup có các nút giả (đỏ, vàng, xanh) kiểu macOS. Tại sao lại đưa yếu tố thiết kế của một hệ điều hành cụ thể vào một ứng dụng web đa nền tảng?

---

# Báo cáo Đánh giá Feature: Notifications

## 1. Phân tích Giao diện & Style
- **Thành phần chính:** `NotificationItem`, `NotificationList`.
- **Màu sắc:** Sử dụng `bg-alert-info/40` cho thông báo chưa đọc.
- **Icon:** Phân loại theo `booking`, `alert`, `system`, `staff`.

## 2. Câu hỏi Phản biện
1. **Về Trạng thái Hiển thị:**
   - Tại sao thông báo chưa đọc lại sử dụng `bg-alert-info/40` (màu xanh nhạt)? Thông thường, các ứng dụng dùng màu nền khác biệt rõ rệt hoặc một chấm xanh đậm để thu hút sự chú ý. Màu xanh nhạt này có dễ bị nhầm lẫn với trạng thái "hover" không?
   - Tại sao lại có cả chấm tròn xanh (`bg-info`) và cả màu nền để đánh dấu chưa đọc? Việc sử dụng 2 dấu hiệu cùng lúc có gây dư thừa (redundancy) không?

2. **Về Phân loại & Icon:**
   - Tại sao `staff` lại dùng icon `MessageSquare`? Nếu có tin nhắn chat thật, người dùng có bị nhầm lẫn giữa thông báo hệ thống về nhân viên và tin nhắn chat trực tiếp không?
   - Logic `getIconColor` trả về các class string. Tại sao không sử dụng `cva` (Class Variance Authority) để quản lý các variant này một cách chuyên nghiệp như các component khác?

3. **Về Clean Code:**
   - Tại sao có đoạn code bị comment out (`function getIcon`)? Nếu không dùng, tại sao không xóa bỏ để giữ code sạch?
   - `new Date(notification.createdAt)` được gọi trong mỗi lần render item. Tại sao không xử lý dữ liệu này từ tầng Service/Action?

---

# Báo cáo Đánh giá Feature: Packages (Gói dịch vụ)

## 1. Phân tích Giao diện & Style
- **Thành phần chính:** `PackageTable`, `PackageForm`.
- **Chức năng:** Hỗ trợ xóa hàng loạt (Bulk Delete), chỉnh sửa qua Sheet.

## 2. Câu hỏi Phản biện
1. **Về Xử lý Dữ liệu & Hiệu suất:**
   - Trong `handleBulkDelete`, hệ thống sử dụng `Promise.allSettled` để gọi API xóa từng item một trong vòng lặp. Tại sao không thiết kế một API xóa hàng loạt (`deletePackages([ids])`) để giảm số lượng request và đảm bảo tính nguyên tử (atomicity) của thao tác?
   - Việc gọi `router.refresh()` sau khi xóa có phải là cách tối ưu nhất để cập nhật UI trong Next.js 15 không? Tại sao không sử dụng `optimistic updates`?

2. **Về UI/UX:**
   - Tại sao cột "Gói dịch vụ" lại sử dụng icon `Package` cố định cho tất cả các gói? Liệu có thể cho phép người dùng chọn icon hoặc upload ảnh đại diện cho gói để dễ phân biệt không?
   - `line-clamp-1` cho mô tả gói dịch vụ có thể làm mất đi các thông tin quan trọng. Tại sao không hiển thị đầy đủ hoặc có nút "Xem thêm"?

3. **Về Nhất quán:**
   - `PackageTable` sử dụng `useTableParams` và `useTableSelection`. Đây là các custom hooks rất tốt. Tuy nhiên, tại sao `AuditTable` (đã xem trước đó) lại không sử dụng `useTableSelection` dù cũng là một bảng dữ liệu?
   - Tại sao `PackageTable` lại có `AnimatedGiftIcon` trong import nhưng không thấy sử dụng trong code hiển thị?
