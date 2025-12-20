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
