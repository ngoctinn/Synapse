# Báo cáo Đánh giá Feature: Settings (Cài đặt)

## 1. Phân tích Giao diện & Style
- **Thành phần chính:** `SettingsPage`, `NotificationsSettings`, `OperatingHoursConfig`.
- **Cơ chế lưu:** Kết hợp giữa Auto-save (cho Exceptions) và Manual-save (cho Schedule).
- **Bố cục:** Sử dụng `Tabs` để phân chia các nhóm cài đặt.

## 2. Câu hỏi Phản biện
1. **Về Cơ chế Lưu dữ liệu (Save Mechanism):**
   - Tại sao lại có sự không nhất quán trong cơ chế lưu? Exceptions thì auto-save ngay khi thêm/xóa, trong khi Schedule lại yêu cầu nhấn nút Save thủ công? Điều này có thể gây nhầm lẫn cho người dùng: họ có thể nghĩ rằng mọi thay đổi đều tự động lưu, dẫn đến việc quên nhấn Save cho Schedule.
   - Tại sao không có trạng thái "Đang lưu..." (Loading state) rõ ràng trên từng item khi auto-save để người dùng biết hệ thống đang xử lý?

2. **Về UX & Điều hướng:**
   - `activeTab` được quản lý qua URL (`searchParams`). Đây là một cách làm tốt. Tuy nhiên, khi chuyển tab, trang có bị scroll lại lên đầu không? Trải nghiệm chuyển tab có mượt mà không?
   - Tại sao không có tính năng "Xem trước" (Preview) để người dùng thấy các thay đổi về giờ hoạt động sẽ ảnh hưởng thế nào đến lịch hẹn thực tế?

---

# Báo cáo Đánh giá Feature: Staff (Nhân viên)

## 1. Phân tích Giao diện & Style
- **Thành phần chính:** `StaffForm`, `StaffSchedulingPage`, `SkillManagerDialog`.
- **Màu sắc:** `COLOR_PRESETS` cho nhân viên (dùng trong lịch làm việc).
- **Bố cục:** `StaffForm` thay đổi layout giữa `create` (dọc) và `update` (tabs).

## 2. Câu hỏi Phản biện
1. **Về Nhất quán Layout Form:**
   - Tại sao chế độ `create` lại hiển thị tất cả thông tin theo chiều dọc (space-y-6), trong khi `update` lại chia thành các Tabs? Việc thay đổi cấu trúc hiển thị giữa 2 chế độ của cùng một form có làm người dùng cảm thấy lạ lẫm không? Tại sao không dùng Tabs cho cả hai?
   - "Premium Avatar Upload UI" bị ẩn đi với comment "Simplified / Hidden for now as per feedback". Phản hồi đó là gì và tại sao không xóa hẳn code cũ mà lại để lại comment?

2. **Về Quản lý Kỹ năng (Skills):**
   - `StaffForm` bọc một `SkillManagerDialog`. Tại sao logic quản lý kỹ năng lại nằm trong form nhân viên thay vì là một trang quản lý riêng biệt? Nếu muốn cập nhật kỹ năng cho 10 nhân viên, người dùng có phải mở từng form không?

3. **Về Lịch làm việc (Scheduling):**
   - `StaffSchedulingPage` sử dụng rất nhiều custom hooks (`useScheduleNavigation`, `useScheduleFilters`, `useSchedules`, `useSelection`). Đây là một kiến trúc rất sạch. Tuy nhiên, tại sao `SelectionToolbar` lại cần một `selectionMode` riêng? Người dùng có thể nhầm lẫn giữa việc click để xem chi tiết và click để chọn nhiều không?

---

# Báo cáo Đánh giá Feature: Treatments (Liệu trình)

## 1. Phân tích Giao diện & Style
- **Thành phần chính:** `TreatmentTable`, `TreatmentSheet`.
- **Trực quan hóa:** Sử dụng `Progress` bar để hiển thị tiến độ liệu trình.
- **Bố cục:** Bảng dữ liệu tập trung vào khách hàng và gói dịch vụ.

## 2. Câu hỏi Phản biện
1. **Về Hiển thị Tiến độ:**
   - Tại sao tiến độ lại được tính bằng phần trăm (`Math.round(t.progress)`)? Đối với liệu trình Spa, con số "3/10 buổi" có ý nghĩa hơn nhiều so với "30%". Tại sao không ưu tiên hiển thị số buổi lên trước?
   - Màu sắc của thanh Progress có thay đổi theo tiến độ không (ví dụ: xanh khi sắp hoàn thành, đỏ khi quá hạn)?

2. **Về UX & Thao tác:**
   - Nút "Điểm danh" (`handleCheckIn`) gọi API và `router.refresh()`. Tại sao không có hiệu ứng loading trên chính dòng đó để người dùng biết yêu cầu đang được xử lý?
   - Cột "Khách hàng" hiển thị cả ID khách hàng. ID này có thực sự cần thiết trong bảng quản lý liệu trình không?

3. **Về Nhất quán:**
   - Tại sao `TreatmentTable` lại dùng `toLocaleDateString("vi-VN")` thủ công thay vì dùng thư viện `date-fns` và helper `format` như các bảng khác?
   - Tại sao không có bộ lọc theo trạng thái liệu trình (Đang thực hiện, Đã hoàn thành, Tạm dừng) ngay trên bảng?
