# Báo Cáo Deep Strategic Review: Backend Logic & Architecture

**Ngày:** 03/12/2025
**Phạm vi:** Logic nghiệp vụ, Luồng dữ liệu, Kiến trúc hệ thống.

---

## 1. Phân Tích Logic & Luồng Dữ Liệu (Logic Analysis)

### 1.1. Quy Trình Tạo User & Staff (Critical Race Condition)
-   **Cơ chế hiện tại**:
    1.  `StaffService.invite_staff` gọi Supabase Admin API để tạo User.
    2.  Supabase Auth kích hoạt Trigger `on_auth_user_created` -> Insert vào `public.users`.
    3.  Ngay lập tức, `StaffService` tiếp tục insert vào bảng `staff` (có FK `user_id` trỏ tới `public.users`).
-   **Rủi ro (Race Condition)**:
    -   Trigger chạy bất đồng bộ (hoặc có độ trễ nhất định tùy tải DB).
    -   Nếu bước (3) chạy trước khi bước (2) hoàn tất -> Lỗi `ForeignKeyViolation` (User chưa tồn tại trong bảng `public.users`).
-   **Đánh giá**: ⚠️ **Rủi ro Cao**. Cần cơ chế Retry hoặc đảm bảo Transaction.

### 1.2. Logic Mời Nhân Viên (Staff Invite)
-   **Hạn chế hiện tại**:
    -   Hàm `invite_staff` ném lỗi nếu email đã tồn tại (`StaffAlreadyExists`).
    -   **Vấn đề**: Không thể "thăng cấp" một Khách hàng (Customer) hiện có thành Nhân viên (Staff). Nếu một khách hàng thân thiết muốn trở thành KTV, hệ thống hiện tại không hỗ trợ luồng này mà bắt buộc phải tạo email mới.
-   **Đánh giá**: ⚠️ **Thiếu tính năng (Logical Gap)**.

### 1.3. Đồng Bộ Dữ Liệu (Dual Source of Truth)
-   **Vấn đề**:
    -   Thông tin `full_name`, `avatar_url` được lưu ở cả Supabase Auth (`raw_user_meta_data`) và bảng `public.users`.
    -   Trigger chỉ đồng bộ chiều `Insert` (Auth -> DB).
    -   Khi gọi `UserService.update_profile`, chỉ cập nhật DB, **không** cập nhật ngược lại Supabase Auth.
-   **Hệ quả**:
    -   Dữ liệu trên Supabase Dashboard hoặc JWT Claims (nếu dùng metadata) sẽ bị cũ/sai lệch so với DB.
-   **Đánh giá**: ⚠️ **Rủi ro Trung bình**. Cần đồng bộ 2 chiều hoặc xác định rõ "Single Source of Truth" là DB.

## 2. Đánh Giá Mã Nguồn & Kiến Trúc (Architecture Review)

### 2.1. Service Layer & Dependency Injection
-   **Điểm tốt**:
    -   Sử dụng `Dependency Injection` (`get_db_session`) tốt, đảm bảo RLS.
    -   Tách biệt rõ ràng giữa `Router` và `Service`.
-   **Điểm cần cải thiện**:
    -   `ServiceManagementService` đang ôm đồm cả logic `Skill` và `Service`. Nên tách thành `SkillService` riêng biệt để tuân thủ Single Responsibility Principle (SRP), vì `Skill` cũng được dùng bởi `Staff`.

### 2.2. Database Design
-   **Relationships**:
    -   Việc sửa lỗi `viewonly=True` cho quan hệ Many-to-Many giữa `Service` và `Skill` là giải pháp đúng đắn để tránh xung đột ghi (write conflict) của SQLAlchemy.
    -   Tuy nhiên, cần lưu ý khi cập nhật: Phải thao tác qua bảng trung gian `ServiceSkill` hoặc `link_model` cẩn thận (code hiện tại trong `update_service` đã xử lý thủ công việc này -> Tốt).

## 3. Kế Hoạch Hành Động (Action Plan)

### Ưu Tiên 1: Ổn định Core Logic (Fix Race Condition)
1.  **Cơ chế Retry**: Trong `StaffService.invite_staff`, thêm vòng lặp `retry` (ví dụ: 3 lần, cách nhau 500ms) khi query `User` sau khi invite, để chờ Trigger hoàn tất.
2.  **Promote Flow**: Bổ sung logic: Nếu User đã tồn tại (Role=Customer) -> Cho phép cập nhật Role thành Staff và tạo Staff Profile thay vì báo lỗi.

### Ưu Tiên 2: Đồng bộ Dữ liệu
3.  **Sync Profile**: Khi `update_profile`, gọi thêm Supabase Admin API để update `user_metadata` (nếu muốn đồng bộ hoàn toàn). Hoặc chấp nhận DB là nguồn duy nhất và bỏ qua metadata trên Supabase sau khi khởi tạo.

### Ưu Tiên 3: Refactor Nhỏ
4.  **Split Service**: Tách `SkillService` ra khỏi `ServiceManagementService`.

## 4. Kết Luận
Logic backend hiện tại hoạt động được cho "Happy Path" nhưng tiềm ẩn rủi ro ở các trường hợp biên (Race condition, Existing user). Cần xử lý ngay vấn đề Race Condition để đảm bảo tính ổn định khi triển khai thực tế.
