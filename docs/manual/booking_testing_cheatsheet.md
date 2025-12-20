# Hướng Dẫn Nhanh: Test Quy Trình Đặt Lịch (Booking Testing Cheat Sheet)

Sử dụng trực tiếp các đoạn JSON bên dưới để paste vào Swagger UI mà không cần sửa ID.

**User Test:** Đã có sẵn trong DB từ bước trước.
*   **Service:** Massage Thư Giãn Toàn Thân (`44444444-4444-4444-4444-444444444401`)
*   **Customer:** Nguyễn Khách Hàng (Demo) (`b91dbf3b-a7e1-42a3-8741-f8273c3fae59`)
*   **Staff:** Trần Kỹ Thuật (Demo) (`a62d8607-5185-43ce-8e3c-8ad6f74882f6`)
*   **Resource:** Giường 01 (`e975efc5-b8c9-4590-84ed-1fe1d256e37c`)

---

## 1. Tìm Khung Giờ Trống (Find Slots)
**API:** `POST /api/v1/scheduling/find-slots`

```json
{
  "customer_id": "b91dbf3b-a7e1-42a3-8741-f8273c3fae59",
  "service_ids": [
    "44444444-4444-4444-4444-444444444401"
  ],
  "date": "2024-12-22"
}
```
*Ghi chú: Nếu ngày 2024-12-22 là quá khứ, hãy đổi thành ngày mai.*

---

## 2. Tạo Booking Mới (Create Booking)
**API:** `POST /api/v1/bookings`

```json
{
  "customer_id": "b91dbf3b-a7e1-42a3-8741-f8273c3fae59",
  "notes": "Khách thích im lặng, dùng tinh dầu sả"
}
```
*Copy kết quả `id` trả về (VD: `BOOKING_ID_MOI`) để dùng cho bước sau.*

---

## 3. Thêm Dịch Vụ Vào Booking (Add Item)
**API:** `POST /api/v1/bookings/{booking_id}/items`
**Tham số URL:** Thay `{booking_id}` bằng `BOOKING_ID_MOI` vừa tạo ở trên.

```json
{
  "service_id": "44444444-4444-4444-4444-444444444401",
  "start_time": "2024-12-22T14:30:00Z",
  "end_time": "2024-12-22T15:30:00Z",
  "staff_id": "a62d8607-5185-43ce-8e3c-8ad6f74882f6",
  "resource_ids": [
    "e975efc5-b8c9-4590-84ed-1fe1d256e37c"
  ]
}
```
*Ghi chú: Đảm bảo Staff `a62d8607...` đã được gán kỹ năng trong bước chuẩn bị nếu hệ thống báo lỗi.*

---

## 4. Kiểm Tra Xung Đột (Check Conflicts)
**API:** `POST /api/v1/bookings/check-conflicts`

Thử đặt trùng giờ với booking vừa tạo để xem hệ thống bắt lỗi.

```json
{
  "start_time": "2024-12-22T14:45:00Z",
  "end_time": "2024-12-22T15:45:00Z",
  "staff_id": "a62d8607-5185-43ce-8e3c-8ad6f74882f6",
  "check_schedule": true
}
```
*Kết quả mong đợi: Trả về conflict loại `DOUBLE_BOOKING`.*

---

## 5. Xác Nhận Booking
**API:** `PATCH /api/v1/bookings/{booking_id}/confirm` (Dùng `BOOKING_ID_MOI`)

*Không cần Body JSON.*

---

## 6. Check-in (Khách đến)
**API:** `PATCH /api/v1/bookings/{booking_id}/check-in`

```json
{
  "check_in_time": null
}
```
*(Để null hệ thống tự lấy giờ hiện tại)*

---

## 7. Thanh Toán (Tạo Invoice)
**API:** `POST /api/v1/billing/bookings/{booking_id}/invoice`

*Không cần tham số URL nào khác ngoài booking_id.*

---

Chúc bạn test thành công!
