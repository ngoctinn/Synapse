# Hướng Dẫn Kiểm Thử Hệ Thống Synapse - Toàn Diện & Chi Tiết
*(Cập nhật ngày 20/12/2024 - Dựa trên dữ liệu thực tế)*

Tài liệu này cung cấp lộ trình kiểm thử 4 giai đoạn, từ cơ bản đến nâng cao. Mỗi bước đều có sẵn dữ liệu mẫu (UUID thực) để bạn copy-paste và chạy ngay trên Swagger UI.

---

## 🛠️ Chuẩn Bị: Xác Thực (Authentication)
⚠️ **Lưu ý:** Trước khi test bất kỳ API nào (trừ `/docs`), bạn cần có **Bearer Token**.

1.  **Đăng nhập Frontend** (hoặc dùng Token có sẵn nếu đang dev).
2.  Tại Swagger UI (`/docs`), bấm nút **Authorize** ở góc phải.
3.  Nhập cú pháp: `Bearer <YOUR_TOKEN_HERE>`
4.  Bấm **Authorize**.

---

## 📋 Giai Đoạn 1: Dữ Liệu Nền (Master Data)
Kiểm tra xem hệ thống đã có đủ dữ liệu master chưa.

### 1. Dịch Vụ (Services)
**API:** `GET /api/v1/services`
*Mục tiêu: Đảm bảo dịch vụ đã load kèm Skills.*
**Dữ liệu mẫu (ID thực để tham chiếu):**
*   **Massage Thư Giãn:** `44444444-4444-4444-4444-444444444401`
*   **Trị Mụn Chuyên Sâu:** `7700b093-6c84-4752-9477-96a67f185677`

### 2. Nhân Viên (Staff)
**API:** `GET /api/v1/staff`
*Mục tiêu: Lấy danh sách KTV khả dụng.*
**Dữ liệu mẫu:**
*   **KTV Demo (Junior):** `a62d8607-5185-43ce-8e3c-8ad6f74882f6` (Chỉ làm được trị mụn)
*   **KTV Cao Cấp (Senior):** `6700b093-6c84-4752-9477-96a67f185673` (Làm được mọi thứ)

### 3. Khách Hàng (Customers)
**API:** `GET /api/v1/customers`
**Dữ liệu mẫu:**
*   **Khách Thường (Silver):** `c72d6f4f-ada5-4885-bc62-a9b5ae750150`
*   **Khách VIP (Gold):** `1100b093-6c84-4752-9477-96a67f185611`

---

## 🚀 Giai Đoạn 2: Quy Trình Đặt Lịch Chuẩn (Booking Flow)
Đây là quy trình quan trọng nhất của hệ thống spa.

### Bước 1: Tìm Khung Giờ Trống (Find Slots)
**API:** `POST /api/v1/scheduling/find-slots`
**Mô tả:** AI tìm giờ trống dựa trên thợ, giường và dịch vụ.

```json
{
  "service_id": "7700b093-6c84-4752-9477-96a67f185677",
  "target_date": "2024-12-25",
  "preferred_staff_id": "6700b093-6c84-4752-9477-96a67f185673",
  "time_window": {
    "start": "09:00:00",
    "end": "18:00:00"
  }
}
```

### Bước 2: Tạo Booking (Khởi tạo)
**API:** `POST /api/v1/bookings`
**Mô tả:** Tạo một "vỏ" booking cho khách hàng.

```json
{
  "customer_id": "c72d6f4f-ada5-4885-bc62-a9b5ae750150",
  "notes": "Test Flow Full - 12/2024"
}
```
📌 **Copy ID trả về (chúng ta gọi là `BOOKING_ID`) để dùng các bước sau.**

### Bước 3: Thêm Dịch Vụ (Add Item)
**API:** `POST /api/v1/bookings/{booking_id}/items`
**Mô tả:** Thêm dịch vụ vào booking vừa tạo.

```json
{
  "service_id": "7700b093-6c84-4752-9477-96a67f185677",
  "start_time": "2024-12-25T10:00:00Z",
  "end_time": "2024-12-25T11:00:00Z",
  "staff_id": "6700b093-6c84-4752-9477-96a67f185673",
  "resource_ids": ["e975efc5-b8c9-4590-84ed-1fe1d256e37c"]
}
```

### Bước 4: Xác Nhận & Check-in
1.  **Xác nhận:** `PATCH /api/v1/bookings/{booking_id}/confirm`
2.  **Khách đến (Check-in):** `PATCH /api/v1/bookings/{booking_id}/check-in`

### Bước 5: Hoàn Thành Dịch Vụ
**API:** `PATCH /api/v1/bookings/{booking_id}/complete`
*Lúc này Booking chuyển trạng thái `COMPLETED`.*

---

## 💰 Giai Đoạn 3: Tài Chính & Thanh Toán (Billing)

### Bước 1: Tạo Hóa Đơn Tự Động
**API:** `POST /api/v1/billing/bookings/{booking_id}/invoice`
**Mô tả:** Hệ thống tự gom các items trong booking để tạo Invoice.
📌 **Copy `id` trả về (gọi là `INVOICE_ID`).**

### Bước 2: Thanh Toán Tiền Mặt
**API:** `POST /api/v1/billing/payments`

```json
{
  "invoice_id": "<PASTE_INVOICE_ID_HERE>",
  "amount": 350000,
  "method": "CASH",
  "note": "Khách thanh toán tại quầy"
}
```

### Bước 3: Kiểm Tra Lại Hóa Đơn
**API:** `GET /api/v1/billing/invoices/{invoice_id}`
*Trạng thái phải là `PAID`.*

---

## 🧠 Giai Đoạn 4: Trí Tuệ Nhân Tạo (Scheduling Engine)
Tính năng nâng cao dành cho Quản lý & Điều phối.

### 1. Kiểm Tra Xung Đột (Conflict Check)
**API:** `GET /api/v1/scheduling/conflicts`
*Test case: KTV đang có lịch mà lại xin nghỉ phép.*

*   `staff_id`: `6700b093-6c84-4752-9477-96a67f185673`
*   `start_date`: `2024-12-25`
*   `end_date`: `2024-12-25`

### 2. Tự Động Xếp Lịch (Auto Solve)
**API:** `POST /api/v1/scheduling/solve`
*Test case: Có 3 khách book nhưng chưa gán KTV, nhờ AI xếp hộ.*

```json
{
  "booking_item_ids": null,
  "target_date": "2024-12-25",
  "time_limit_seconds": 10
}
```

### 3. Auto Reschedule (Tái lập lịch khi có sự cố)
**API:** `POST /api/v1/scheduling/reschedule`
*Test case: Giường bị hỏng, tìm giường khác cho các booking bị ảnh hưởng.*

```json
{
  "conflict_booking_item_ids": [ "<YOUR_BOOKING_ITEM_ID>" ],
  "allow_change_staff": true,
  "allow_change_resource": true
}
```
