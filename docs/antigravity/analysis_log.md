# Analysis Log - Phase 5: Warranty & Chat

## Ngày: 2025-12-20

### 1. Database Schema Analysis

**Chat Modules**:
- `chat_sessions`: Quản lý phiên hội thoại (Open/Closed).
- `chat_messages`: Nội dung tin nhắn. Link `sender_id` tới `users`.

**Warranty Module**:
- `warranty_tickets`:
  - `status`: Enum ('PENDING', 'APPROVED', 'REJECTED', 'RESOLVED').
  - `images`: Array `TEXT[]`. (Trong Python SQLModel cần `Column(ARRAY(String))`).
  - Link `booking_id` (optional), `customer_id`.

### 2. Business Logic

**Chat Flow**:
- Khách gửi tin -> Kiểm tra có Session OPEN không?
  - Không: Tạo Session mới.
  - Có: Append message vào session đó.
- WebSocket: Kết nối tới `/ws/chat/{session_id}`.
  - Client gửi msg -> Server lưu DB -> Broadcast cho Staff đang subscribe.

**Warranty Flow**:
- Khách tạo yêu cầu bảo hành từ Booking cũ.
- Upload ảnh (Client upload lên Storage, gửi URL về API).
- Admin xem danh sách -> Cập nhật Status & Notes.

### 3. API Endpoints

**Module `warranty`**:
- `POST /warranty-tickets`: Tạo yêu cầu.
- `GET /warranty-tickets`: List (Filter by Customer/Status).
- `PATCH /warranty-tickets/{id}`: Update Status (Admin).

**Module `chat`**:
- `POST /chat/sessions`: Bắt đầu hội thoại.
- `GET /chat/sessions/{id}/messages`: Lấy lịch sử chat.
- `POST /chat/sessions/{id}/messages`: Gửi tin (HTTP Fallback).
- `WS /chat/ws/{session_id}`: WebSocket Real-time.

### 4. Dependencies
- Chat cần `users`, `customers`, `staff`.
- Warranty cần `bookings`, `customers`.

---

## Phase 2: Smart Slot Finding Analysis

### 1. Hiện trạng (Current State)
- `SchedulingService.get_suggestions(booking_id)` đã tồn tại, nhưng chỉ dành cho booking đã được lưu vào DB.
- `SpaSolver` có các hàm private `_get_qualified_staff` và `_get_qualified_resources` rất mạnh mẽ nhưng đang bị khóa bên trong instance solver.

### 2. Logic tìm kiếm Slot (Search Logic)
1. **Dữ liệu đầu vào**: `service_id`, `target_date`, `preferred_staff_id`.
2. **Sinh ứng viên (Candidate Generation)**:
   - Tạo các mốc thời gian (vd: mỗi 15 phút) từ giờ mở cửa đến giờ đóng cửa.
3. **Kiểm tra tính khả thi (Feasibility Check)**:
   - Với mỗi mốc:
     - Lọc KTV có kỹ năng phù hợp + đang rảnh + có làm việc vào giờ đó.
     - Lọc tài nguyên (giường/máy) thuộc group yêu cầu + đang rảnh.
4. **Xếp hạng (Ranking)**:
   - Ưu tiên KTV khách hàng thích (Preferred Staff).
   - Ưu tiên khung giờ sớm hơn.
   - Ưu tiên KTV có workload thấp hơn (Fairness).

### 3. Thành phần cần sửa đổi
- **schemas.py / models.py**: Thêm `SlotSearchRequest`, `SlotOption`, `SlotSuggestionResponse`.
- **service.py**: Thêm hàm `find_available_slots`.
- **solver.py**: Cân nhắc tách logic `is_staff_available` và `is_resource_available` ra để dùng chung.
- **router.py**: Endpoint `POST /scheduling-engine/find-slots`.

### 4. Rủi ro (Risks)
- Bài toán tìm kiếm exhaustive qua toàn bộ grid có thể chậm nếu spa có quá nhiều KTV.
- Giải pháp: Giới hạn số lượng slots trả về (vd: top 10).

---

# Analysis Log - Phase 10: Scheduling Optimization

## Ngày: 2025-12-20

### 1. Load Balancing Analysis

**Mục tiêu**: Phân phối công việc đều giữa các nhân viên để đảm bảo sự công bằng (Fairness).

**Hiện trạng**:
- `SchedulingService` hiện tại chỉ có `jain_fairness_index` để đánh giá, chưa có logic tối ưu hóa trong `SpaSolver`.
- Solver chỉ tối ưu preference (+10 điểm) và tìm feasible solution.

**Giải pháp đề xuất (OR-Tools)**:
- Thêm biến `staff_load[s]` = tổng thời gian làm việc (phút) của nhân viên `s`.
- Thêm biến `min_load` và `max_load` ràng buộc bởi các `staff_load`.
- Mục tiêu: Minimize `(max_load - min_load)`.
- Trọng số: `weight_fairness` từ config.

**Complexity**:
- Số lượng biến tăng tuyến tính theo số nhân viên.
- Không ảnh hưởng nhiều đến hiệu năng với số lượng nhân viên < 50.

### 2. Gap Minimization Analysis

**Mục tiêu**: Giảm thiểu thời gian chết xen kẽ (gaps) để tăng hiệu suất (Utilization) và giúp nhân viên có thời gian nghỉ dài hơn thay vì vụn vặt.

**Giải pháp đề xuất**:
- Định nghĩa "Working Span" của nhân viên = `Last Task End` - `First Task Start`.
- "Idle Time within Span" = `Working Span` - `Total Working Duration`.
- Mục tiêu: Minimize `Idle Time within Span`.
- Điều này khuyến khích co cụm các task lại gần nhau (compact schedule).

**Implementation Details**:
- Cần biến `first_start[s]` và `last_end[s]` cho mỗi nhân viên.
- Ràng buộc: `first_start[s] <= start_time` của mọi task được gán cho `s`.
- Ràng buộc: `last_end[s] >= end_time` của mọi task được gán cho `s`.
- Objective terms: `(last_end[s] - first_start[s] - total_load[s]) * weight_utilization`.

### 3. Impact Analysis

**Affected Files**:
- `solver.py`: Logic chính của CP-SAT.
- `models.py`: Cập nhật `SolveRequest` để truyền weights.
- `evaluator.py`: Cần tính `total_idle_minutes` để verify kết quả.

**Risks**:
- Tightening constraints might lead to `INFEASIBLE` if not careful.
- Solution time might increase. Cần set `time_limit_seconds` hợp lý (mặc định 30s).
