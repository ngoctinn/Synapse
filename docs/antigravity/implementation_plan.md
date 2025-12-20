# Kế Hoạch Triển Khai: Smart Slot Finding (Phase 2)

## 1. Vấn đề (Problem)
Khách hàng cần tìm kiếm các khung giờ khả dụng cho một dịch vụ cụ thể mà không cần phải thực hiện đặt lịch thử. Hiện tại hệ thống chưa có endpoint độc lập để gợi ý các slots tối ưu dựa trên tài nguyên và nhân viên.

## 2. Mục đích (Purpose)
Triển khai endpoint `POST /scheduling-engine/find-slots` giúp:
- Tự động tìm kiếm các khung giờ trống cho dịch vụ.
- Cân bằng tải nhân viên và tối ưu hóa sử dụng tài nguyên (giường, máy).
- Hỗ trợ khách hàng chọn nhân viên yêu thích.

## 3. Ràng buộc (Constraints)
- **H01-H09 (Hard Constraints)**: Phải tuân thủ tuyệt đối quy tắc chồng chéo (Non-overlap) và năng lực nhân viên.
- **S01-S05 (Soft Constraints)**: Tối ưu hóa theo sở thích khách hàng và sự công bằng giữa nhân viên.
- **Hiệu năng**: Kết quả trả về trong < 2 giây.
- **Vertical Slice**: Logic nằm trọn trong module `scheduling_engine`.

## 4. Chiến lược (Strategy)
Sử dụng logic của `SpaSolver` (CP-SAT) để tìm kiếm các vị trí khả dụng. Thay vì giải bài toán lập lịch cho toàn bộ spa, hỗ trợ tìm kiếm local quanh ngày khách yêu cầu (`target_date`).

## 5. Giải pháp (Solution)

### 5.1 API Specification
- **Endpoint**: `POST /scheduling-engine/find-slots`
- **Request**: `{ service_id, target_date, preferred_staff_id?, time_window? }`
- **Response**: List các `SlotOption` (mỗi option gồm start/end, nhân viên, tài nguyên và điểm số tối ưu).

### 5.2 Thành phần chính
1. **Schemas**: Định nghĩa `SlotSearchRequest` và `SlotSuggestionResponse`.
2. **Service**: Bổ sung hàm `find_available_slots` vào `SchedulingService`.
3. **Solver Integration**: Sử dụng `SchedulingEngine` để kiểm tra tính khả thi của từng slot ứng viên.

---

## 6. Kế hoạch thực thi (Steps)
1. **ANALYZE**: Rà soát `scheduling_engine/service.py` và `solver.py` để tìm điểm tích hợp.
2. **DIFF**: Thiết kế chi tiết hàm tìm kiếm slot (sinh ứng viên -> lọc -> chấm điểm).
3. **APPLY**: Code Schemas, Service và Router.
4. **VERIFY**: Unit test logic sinh slot và Integration test API.

---

# Kế Hoạch Triển Khai: Promotions Module (Phase 3)

## 1. Vấn đề (Problem)
Module `promotions` đã có mã nguồn nhưng chưa có bảng dữ liệu tương ứng trong Database và chưa thiết lập RLS (Row Level Security).

## 2. Mục đích (Purpose)
- Triển khai bảng `promotions`.
- Thiết lập RLS đảm bảo: Admin/Staff quản lý, Khách hàng chỉ xem/áp dụng mã.
- Tích hợp logic tính toán `Decimal` chính xác.

## 3. Thành phần chính
- **Models**: `promotions` table, `discount_type` enum.
- **Service**: CRUD operations + logic validate mã giảm giá.
- **Router**: API `/promotions` và `/promotions/validate`.

## 4. Kế hoạch thực thi (Steps)
1. **DIFF**: Tạo script SQL `migration_promotions.sql`.
2. **APPLY**:
    - Thực thi SQL migration trên Supabase.
    - Kiểm tra và sửa lỗi logic (nếu có) bằng Ruff.
3. **VERIFY**: Kiểm thử API trọn gói.

---

# Kế Hoạch Triển Khai: Waitlist Module (Phase 4)

## 1. Vấn đề (Problem)
Module `waitlist` đã có mã nguồn cơ bản nhưng chưa có bảng dữ liệu `waitlist_entries` trong Database và chưa thiết lập RLS (Row Level Security). Đồng thời, chưa có logic tự động hóa liên kết giữa waitlist và các lịch hẹn bị hủy (Phần Notification sẽ được xử lý ở Phase sau, Phase này tập trung vào Core CRUD & Security).

## 2. Mục đích (Purpose)
- Triển khai bảng `waitlist_entries`.
- Thiết lập RLS:
    - Khách hàng: Có thể gửi yêu cầu chờ (join waitlist), xem/hủy yêu cầu của chính mình.
    - Admin/Staff: Quản lý toàn bộ danh sách chờ.
- Đảm bảo logic dữ liệu hợp lệ (ngày/giờ ưu tiên).

## 3. Thành phần chính
- **Models**: `waitlist_entries` table, `WaitlistStatus` enum.
- **Service**: CRUD operations cho danh sách chờ.
- **Router**: API `/waitlist`.

## 4. Kế hoạch thực thi (Steps)
1. **ANALYZE**: Rà soát code `waitlist` hiện tại (Đã thực hiện).
2. **DIFF**: Tạo script SQL `migration_waitlist.sql`.
3. **APPLY**:
    - Thực thi SQL migration trên Supabase.
    - Kiểm tra lỗi linting bằng Ruff.
4. **VERIFY**: Kiểm thử API CRUD waitlist.

---

# Kế Hoạch Triển Khai: Warranty Module (Phase 5)

## 1. Vấn đề (Problem)
Khách hàng sau khi sử dụng dịch vụ (đặc biệt là các liệu trình nhiều buổi) nếu không hài lòng cần có cơ chế gửi yêu cầu bảo hành chính thức. Hiện tại module `warranty` đã có code nhưng chưa có Database, chưa liên kết đúng với đối tượng Liệu trình (`customer_treatments`) và chưa kích hoạt RLS.

## 2. Mục đích (Purpose)
- Triển khai hệ thống **Quản lý Ticket Bảo hành dựa trên Liệu trình**.
- Cho phép khách hàng gửi yêu cầu kèm hình ảnh minh họa cho các gói liệu trình đã mua.
- Quản trị viên (Admin) duyệt và xử lý Ticket (Approved/Rejected/Resolved) dựa trên lịch sử các buổi thực hiện.

## 3. Thành phần chính
- **Models**: `warranty_tickets` table (FK `treatment_id`), `WarrantyStatus` enum.
- **Service**: Logic xử lý Ticket, ghi nhận lịch sử giải quyết (`resolved_at`, `resolved_by`).
- **Router**: API `/warranty-tickets`.

## 4. Kế hoạch thực thi (Steps)
1. **DIFF**: Tạo script SQL `migration_warranty.sql`.
2. **APPLY**:
    - Thực thi SQL migration trên Supabase.
    - Sửa lỗi Ruff (unused imports, v.v.).
3. **VERIFY**: Kiểm thử luồng gửi và duyệt Ticket bảo hành.
