# Báo cáo Đánh giá Feature: Audit Logs

## 1. Phân tích Giao diện & Style

- **Thành phần chính:** `AuditTable` sử dụng `DataTable` tùy chỉnh.
- **Màu sắc trạng thái:** Sử dụng `Badge` với các biến thể `success`, `warning`, `destructive`, `secondary`.
- **Bố cục:** Cột "Chi tiết" hiển thị JSON stringified, có tooltip.

## 2. Câu hỏi Phản biện

1. **Về Hiển thị Dữ liệu:**

   - Tại sao cột "Chi tiết" lại hiển thị JSON thô (`JSON.stringify(row.details)`) cho người dùng cuối? Liệu một nhân viên lễ tân hoặc quản lý có hiểu được cấu trúc JSON này không?
   - Tại sao không có cơ chế "Expand Row" để xem chi tiết thay vì nhồi nhét JSON vào một ô có `max-w-[300px] truncate`?
   - Tooltip hiển thị JSON thô có thực sự hữu ích khi dữ liệu lớn và bị cắt bớt bởi trình duyệt không?

2. **Về Trải nghiệm Người dùng (UX):**

   - Tại sao các hành động như `CREATE`, `UPDATE`, `DELETE` lại để nguyên tiếng Anh in hoa? Điều này có vi phạm nguyên tắc bản địa hóa 100% tiếng Việt của dự án không?
   - Cột "Người thực hiện" chỉ hiển thị tên, tại sao phần hiển thị `actor_id` lại bị comment out? Có cần thiết phải hiển thị ID để phân biệt các nhân viên trùng tên không?
   - Tại sao không có bộ lọc theo `entity_type` hoặc `action` ngay trên bảng để người dùng dễ dàng truy vết?

3. **Về Clean Code:**
   - Logic định nghĩa `variants` cho Badge nằm trực tiếp trong hàm `cell` của cột "Hành động". Tại sao không tách logic này ra một constant hoặc helper function để tránh khởi tạo lại object mỗi khi render cell?
   - `new Date(row.created_at)` được gọi 2 lần trong cùng một cell (cho giờ và ngày). Tại sao không parse một lần duy nhất?

---

# Báo cáo Đánh giá Feature: Chat

## 1. Phân tích Giao diện & Style

- **Thành phần chính:** `ChatWindow`, `MessageBubble`, `ChatSidebar`.
- **Hiệu ứng:** Sử dụng `glass-card`, `backdrop-blur`, `animate-fade-in`, `animate-pulse-subtle`.
- **Bố cục:** Bo góc rất lớn (`rounded-2xl`), sử dụng gradient nền.

## 2. Câu hỏi Phản biện

1. **Về Thẩm mỹ & Nhất quán:**

   - Tại sao Chat lại sử dụng font serif (`font-serif`) cho tiêu đề "Synapse Chat" trong khi toàn bộ ứng dụng dùng Sans-serif (`Be Vietnam Pro`)? Sự thay đổi font đột ngột này có mục đích gì về mặt thương hiệu không?
   - Tại sao Chat lại có bo góc `rounded-2xl` (rất lớn) trong khi các Card khác trong hệ thống dùng `rounded-xl`?
   - `glass-card` và `backdrop-blur` được sử dụng rất nhiều ở đây. Liệu nó có gây nặng nề cho hiệu năng trên các thiết bị di động cấu hình thấp không?

2. **Về Chức năng & UX:**

   - Tại sao các nút "Gọi điện", "Video call" lại xuất hiện trong khi tài liệu yêu cầu (Use Case) không đề cập đến tính năng gọi điện trực tuyến? Đây là tính năng thật hay chỉ là placeholder?
   - Logic "Auto-scroll to bottom" sử dụng `querySelector('[data-radix-scroll-area-viewport]')`. Việc can thiệp trực tiếp vào DOM của một thư viện bên thứ ba (Radix UI) như thế này có an toàn khi thư viện cập nhật phiên bản không?
   - Tại sao trạng thái online/offline lại dùng các class `indicator-online` / `indicator-offline` thay vì các màu chuẩn của hệ thống?

3. **Về Clean Code:**
   - `MessageBubble` có logic `max-w-[85%]`. Tại sao lại là 85%? Con số này có đảm bảo hiển thị tốt trên màn hình cực hẹp không?
   - Tại sao không có trạng thái "Đang soạn tin..." (Typing indicator) để tăng tính tương tác?

---

# Báo cáo Đánh giá Feature: Customers

## 1. Phân tích Giao diện & Style

- **Thành phần chính:** `CustomerForm` sử dụng `Tabs` để phân chia thông tin (Hồ sơ, Lịch sử, v.v.).
- **Bố cục:** Grid 2 cột cho các trường thông tin.

## 2. Câu hỏi Phản biện

1. **Về Cấu trúc Form:**

   - `CustomerForm` dài tới 320 dòng. Tại sao không tách các Tab thành các component riêng lẻ (e.g., `ProfileTab`, `HistoryTab`)?
   - Tại sao trường "Số điện thoại" lại có `autoFocus` khi ở chế độ `create`? Nếu form nằm trong một Dialog, việc autoFocus có thể gây nhảy màn hình hoặc che khuất các thông tin quan trọng khác trên mobile không?

2. **Về Logic Nghiệp vụ:**

   - Tại sao "Chuyên viên ưu tiên" lại là một dropdown đơn giản? Nếu Spa có 50 nhân viên, việc cuộn danh sách này có hiệu quả không? Tại sao không dùng `Combobox` như trong `AppointmentForm`?
   - Tại sao không có logic kiểm tra trùng lặp SĐT ngay khi người dùng đang nhập (onBlur) thay vì đợi đến khi submit form?

3. **Về Nhất quán:**
   - Tại sao `CustomerForm` lại dùng `useFormContext`? Điều này bắt buộc component cha phải bọc nó trong một `FormProvider`. Tại sao không để `CustomerForm` tự quản lý instance form của nó nếu nó là một thực thể độc lập?
   - Việc sử dụng `RequiredMark` và `OptionalMark` có nhất quán trên toàn bộ ứng dụng không? Tại sao một số form khác lại không thấy sử dụng?
