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
