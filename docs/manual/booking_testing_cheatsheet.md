# Synapse API Testing Cheatsheet

Dưới đây là các dữ liệu và JSON Payload mẫu dùng để test thủ công trên Swagger UI.

---

## 1. Dữ Liệu Test (Master Data)

| Đối Tượng | Tên | ID (UUID) | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Service** | Trị Mụn Chuyên Sâu | `7700b093-6c84-4752-9477-96a67f185677` | Cần Skill: Acne |
| **Service** | Massage Body Đá Nóng | `8800b093-6c84-4752-9477-96a67f185688` | Cần Skill: Massage Body |
| **Customer** | Nguyễn Khách Hàng (Demo) | `c72d6f4f-ada5-4885-bc62-a9b5ae750150` | Silver Member |
| **Customer** | Trần Thị VIP | `1100b093-6c84-4752-9477-96a67f185611` | Gold Member |
| **Staff** | KTV Cao Cấp (Expert) | `6700b093-6c84-4752-9477-96a67f185673` | Skill: Acne + Massage |
| **Staff** | KTV Demo (Junior) | `a62d8607-5185-43ce-8e3c-8ad6f74882f6` | Skill: Acne only |
| **Resource** | Giường 01 | `e975efc5-b8c9-4590-84ed-1fe1d256e37c` | |
| **Resource** | Giường 02 | `6542804e-16af-40a9-85d5-50cc4652a162` | |

---

## 2. Phần I: Quy Trình Đặt Lịch & Thanh Toán (Cơ Bản)

### Bước 1: Tìm slot trống phù hợp (Find Slots)
**API:** `POST /api/v1/scheduling/find-slots`
```json
{
  "service_id": "7700b093-6c84-4752-9477-96a67f185677",
  "target_date": "2024-12-25",
  "preferred_staff_id": "a62d8607-5185-43ce-8e3c-8ad6f74882f6",
  "time_window": {
    "start": "09:00:00",
    "end": "17:00:00"
  }
}
```

### Bước 2: Tạo Booking Mới
**API:** `POST /api/v1/bookings`
```json
{
  "customer_id": "c72d6f4f-ada5-4885-bc62-a9b5ae750150",
  "notes": "Test basic flow"
}
```
*-> Copy `id` trả về (gọi là BOOKING_ID) để dùng tiếp.*

### Bước 3: Thêm Dịch Vụ vào Booking
**API:** `POST /api/v1/bookings/{booking_id}/items`
```json
{
  "service_id": "7700b093-6c84-4752-9477-96a67f185677",
  "start_time": "2024-12-25T09:00:00Z",
  "end_time": "2024-12-25T10:00:00Z",
  "staff_id": "a62d8607-5185-43ce-8e3c-8ad6f74882f6",
  "resource_ids": ["e975efc5-b8c9-4590-84ed-1fe1d256e37c"]
}
```

### Bước 4: Vận Hành (Confirm -> Check-in -> Complete)
1.  **Confirm:** `PATCH /api/v1/bookings/{BOOKING_ID}/confirm`
2.  **Check-in:** `PATCH /api/v1/bookings/{BOOKING_ID}/check-in`
3.  **Complete:** `PATCH /api/v1/bookings/{BOOKING_ID}/complete`

---

## 3. Phần II: Scheduling Engine (Nâng Cao)

Hướng dẫn test khả năng tự động xếp lịch và xử lý xung đột của AI.

### 1. Tự Động Xếp Lịch (Solve Scheduling)
**API:** `POST /api/v1/scheduling/solve`
Dùng khi bạn có một Booking Item chưa gán nhân viên (staff_id = null trong Booking Item).

*Trước tiên hãy tạo một Booking và Add Item nhưng không điền `staff_id` và `resource_ids`.*

```json
{
  "booking_item_ids": null,
  "target_date": "2024-12-25",
  "time_limit_seconds": 30,
  "weight_preference": 1,
  "weight_utilization": 1,
  "weight_fairness": 1
}
```
*(Nếu `booking_item_ids` là null, AI sẽ quét toàn bộ item chưa gán trong ngày đó để xếp)*

### 2. Gợi Ý Nhân Viên Cho 1 Booking (Get Suggestions)
**API:** `GET /api/v1/scheduling/suggestions/{booking_id}`

Chỉ cần điền `BOOKING_ID` vào URL. API sẽ trả về các phương án tốt nhất để gán staff cho booking đó.

### 3. Đánh Giá Chất Lượng Lịch (Evaluate Schedule)
**API:** `POST /api/v1/scheduling/evaluate`
Xem hiệu suất làm việc, công bằng, và lãng phí của ngày hiện tại.

```json
{
  "target_date": "2024-12-25"
}
```

### 4. Kiểm Tra Xung Đột (Check Conflicts)
**API:** `GET /api/v1/scheduling/conflicts`
Kiểm tra xem nếu nhân viên nghỉ thì có bị trùng lịch không.

**Query Parameters:**
*   `staff_id`: `6700b093-6c84-4752-9477-96a67f185673` (KTV Cao Cấp)
*   `start_date`: `2024-12-25`
*   `end_date`: `2024-12-25`

### 5. Tự Động Tái Lập Lịch (Auto Reschedule)
**API:** `POST /api/v1/scheduling/reschedule`
Nếu phát hiện Item bị conflict, dùng API này để tìm người thay thế tự động.

*Cần ID của Booking Item (BOOKING_ITEM_ID) bị conflict.*

```json
{
  "conflict_booking_item_ids": [
    "<YOUR_BOOKING_ITEM_ID>"
  ],
  "allow_change_staff": true,
  "allow_change_resource": true
}
```

### 6. Health Check (OrTools)
**API:** `GET /api/v1/scheduling/health`
Kiểm tra module AI có đang chạy ổn định không.

---
**Lưu ý:** Ngày giờ trong ví dụ là `2024-12-25`. Nếu bạn test vào ngày khác, hãy cập nhật lại cho phù hợp logic tương lai.
