# Hướng Dẫn Kiểm Thử API Hệ Thống Synapse

Tài liệu này hướng dẫn chi tiết cách kiểm thử các API của hệ thống Synapse CRM theo luồng nghiệp vụ thực tế.

## 1. Chuẩn Bị & Xác Thực (Authentication)

Hệ thống sử dụng **Supabase Auth**. Backend không trực tiếp xử lý đăng nhập/đăng ký username/password mà xác thực qua **JWT Token**.

**Công cụ test:**
- **Swagger UI:** `http://localhost:8000/docs` (Khuyên dùng)
- **Postman/cURL:** Base URL `http://localhost:8000`

**Cách lấy Token (Bearer Token):**
1. Truy cập Frontend (`http://localhost:3000`) và đăng nhập bằng tài khoản Manager/Admin.
2. Mở **Developer Tools (F12)** -> **Application** tab -> **Local Storage**.
3. Tìm key `sb-<project-id>-auth-token`.
4. Copy giá trị `access_token` bên trong JSON.
5. Trên Swagger UI, nhấn nút **Authorize** -> Nhập `Bearer <token_ban_vua_copy>`.

---

## 2. Luồng Kiểm Thử 1: Khởi Tạo Dữ Liệu Nền (Master Data)

Trước khi thực hiện booking, cần đảm bảo hệ thống có dữ liệu cấu hình.

### 2.1. Quản Lý Dịch Vụ (Services & Skills)
*Dành cho Manager*

1.  **Tạo Kỹ Năng (Skills)**
    *   `POST /api/v1/services/skills`
    *   *Body:* `{"name": "Lấy nhân mụn", "code": "SK_ACNE"}`
2.  **Tạo Dịch Vụ (Services)**
    *   `POST /api/v1/services`
    *   *Body:*
        ```json
        {
          "name": "Trị mụn chuyên sâu",
          "duration": 60,
          "price": 350000,
          "skill_ids": ["<uuid_skill_vua_tao>"]
        }
        ```
    *   **Lưu ý:** `skill_ids` rất quan trọng để thuật toán xếp lịch tìm đúng nhân viên.

### 2.2. Quản Lý Tài Nguyên (Resources)
*Phòng, Giường, Máy móc*

1.  **Tạo Nhóm Tài Nguyên**
    *   `POST /api/v1/resources/groups`
    *   *Body:* `{"name": "Giường Spa", "type": "BED"}`
2.  **Tạo Tài Nguyên**
    *   `POST /api/v1/resources`
    *   *Body:* `{"name": "Giường 01", "group_id": "<uuid_group_vua_tao>"}`

### 2.3. Quản Lý Nhân Viên (Staff)
*Thiết lập nhân sự và tay nghề*

1.  **Mời Nhân Viên (Invite)**
    *   `POST /api/v1/staff/invite`
    *   *Body:* `{"email": "new_staff@example.com", "role": "technician"}`
    *   *Note:* API này sẽ gửi mail thật nếu cấu hình SMTP đúng.
2.  **Cập Nhật Hồ Sơ Staff** (Nếu đã có User)
    *   `PUT /api/v1/staff/{user_id}`
    *   *Body:* `{"color_code": "#FF5733", "commission_rate": 0.1}`
3.  **Gán Kỹ Năng Cho Nhân Viên** (Quan trọng!)
    *   `PUT /api/v1/staff/{user_id}/skills`
    *   *Body:* `{"skill_ids": ["<uuid_skill_id>"]}`
    *   *Tại sao cần:* Nếu nhân viên không có skill của dịch vụ, họ sẽ không hiện ra khi đặt lịch.

---

## 3. Luồng Kiểm Thử 2: Quy Trình Đặt Lịch (Booking Process)

Đây là chức năng cốt lõi của CRM.

### 3.1. Tìm Kiếm & Đặt Lịch
1.  **Tạo Khách Hàng (Nếu khách mới)**
    *   `POST /api/v1/customers`
    *   *Body:* `{"full_name": "Nguyễn Văn A", "phone_number": "0909123456"}`
2.  **Tìm Khung Giờ Trống (Smart Suggestion)**
    *   `POST /api/v1/scheduling/find-slots`
    *   *Body:* `{"service_ids": ["<uuid_service>"], "date": "2024-12-21"}`
    *   *Kết quả:* Hệ thống trả về các khung giờ khả dụng + Nhân viên đề xuất.
3.  **Tạo Booking (Trạng thái Pending)**
    *   `POST /api/v1/bookings`
    *   *Body:* `{"customer_id": "<uuid_customer>"}`
    *   *Kết quả:* Trả về `booking_id`.

### 3.2. Thêm Dịch Vụ & Xác Nhận
1.  **Thêm Dịch Vụ Vào Booking**
    *   `POST /api/v1/bookings/{booking_id}/items`
    *   *Body:*
        ```json
        {
          "service_id": "<uuid_service>",
          "start_time": "2024-12-21T10:00:00Z",
          "end_time": "2024-12-21T11:00:00Z",
          "staff_id": "<uuid_staff>",
          "resource_ids": ["<uuid_resource>"]
        }
        ```
2.  **Xác Nhận Booking**
    *   `PATCH /api/v1/bookings/{booking_id}/confirm`
    *   *Kết quả:* Status chuyển thành `CONFIRMED`.

---

## 4. Luồng Kiểm Thử 3: Vận Hành & Thanh Toán

Giả lập quy trình khi khách đến cửa hàng.

### 4.1. Check-in & Thực Hiện
1.  **Check-in**
    *   `PATCH /api/v1/bookings/{booking_id}/check-in`
    *   *Body:* `{"check_in_time": "..."}` (hoặc để null để lấy giờ hiện tại).
2.  **Ghi Chú Chuyên Môn (Notes)**
    *   `POST /api/v1/bookings/{booking_id}/notes`
    *   *Body:* `{"content": "Da khách hơi khô, cần dưỡng ẩm", "note_type": "PROFESSIONAL"}`
3.  **Hoàn Thành Lịch Hẹn**
    *   `PATCH /api/v1/bookings/{booking_id}/complete`

### 4.2. Thanh Toán (Billing)
1.  **Tạo Hóa Đơn Từ Booking**
    *   `POST /api/v1/billing/bookings/{booking_id}/invoice`
    *   *Kết quả:* Tạo ra Invoice với trạng thái `UNPAID`.
2.  **Thanh Toán**
    *   `POST /api/v1/billing/payments`
    *   *Body:*
        ```json
        {
          "invoice_id": "<uuid_invoice>",
          "amount": 350000,
          "method": "CASH"
        }
        ```
    *   *Kết quả:* Status Invoice chuyển `PAID`.

---

## 5. Các Tính Năng Nâng Cao

### 5.1. Scheduling Engine (Tự động hóa)
*   `POST /api/v1/scheduling/solve`: Chạy thuật toán tối ưu xếp lịch cho cả ngày.
*   `POST /api/v1/scheduling/reschedule`: Tự động tìm người thay thế khi nhân viên nghỉ đột xuất.
*   `GET /api/v1/scheduling/conflicts`: Kiểm tra xung đột trước khi duyệt đơn nghỉ phép.

### 5.2. Quản Lý Liệu Trình (Treatments/Packages)
*   **Mua Gói:** `POST /api/v1/treatments` (Khách mua gói 10 buổi).
*   **Sử Dụng Gói:** Khi tạo `Booking Item`, truyền `treatment_id` để trừ buổi thay vì tính tiền lẻ.

### 5.3. Giờ Hoạt Động (Operating Hours)
*   `PUT /api/v1/operating-hours`: Cấu hình giờ mở cửa.
*   `POST /api/v1/operating-hours/exceptions`: Đăng ký ngày nghỉ lễ (Tết, Giỗ tổ).

### 5.4. Chat & Notifications
*   `POST /api/v1/chat/sessions`: Bắt đầu hội thoại hỗ trợ.
*   `POST /api/v1/notifications/send-email`: Test gửi email mẫu (cần cấu hình SMTP).

### 5.5. Bảo Hành (Warranty)
*   `POST /api/v1/warranty-tickets`: Tạo phiếu bảo hành cho dịch vụ đã làm.
*   `PATCH /api/v1/warranty-tickets/{id}`: Cập nhật trạng thái xử lý bảo hành.

---

**Lưu ý chung:**
- Tất cả DateTime format theo chuẩn ISO 8601 (VD: `2024-12-21T10:00:00Z`).
- Các API xóa thường là Soft Delete (ẩn đi), dữ liệu vẫn còn trong DB.
- Khi gặp lỗi 403 Forbidden, hãy kiểm tra lại Role của User (Admin/Manager vs Customer).
