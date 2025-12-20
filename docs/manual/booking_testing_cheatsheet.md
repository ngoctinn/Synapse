# Hướng Dẫn Test Quy Trình Đặt Lịch (Booking Testing Cheat Sheet)

Sử dụng bộ dữ liệu mới nhất dưới đây để test quy trình.

---

### **1. Dữ Liệu Test (Copy ID này)**

| Đối Tượng | Tên | ID (UUID) | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Service** | Trị Mụn Chuyên Sâu | `7700b093-6c84-4752-9477-96a67f185677` | Cần Skill: Acne |
| **Service** | Massage Body Đá Nóng | `8800b093-6c84-4752-9477-96a67f185688` | Cần Skill: Massage Body |
| **Customer** | Nguyễn Khách Hàng (Demo) | `c72d6f4f-ada5-4885-bc62-a9b5ae750150` | Silver Member |
| **Customer** | Trần Thị VIP | `1100b093-6c84-4752-9477-96a67f185611` | Gold Member |
| **Staff** | KTV Cao Cấp (Expert) | `6700b093-6c84-4752-9477-96a67f185673` | Có cả 2 skill (Acne, Massage) |
| **Staff** | KTV Demo (Junior) | `a62d8607-5185-43ce-8e3c-8ad6f74882f6` | Chỉ có skill Acne |
| **Resource** | Giường 01 | `e975efc5-b8c9-4590-84ed-1fe1d256e37c` | |
| **Resource** | Giường 02 | `6542804e-16af-40a9-85d5-50cc4652a162` | |

---

### **2. Quy Trình 1: Khách đặt Trị Mụn (KTV nào cũng làm được)**

**Bước 1: Tìm slot**
`POST /api/v1/scheduling/find-slots`
```json
{
  "customer_id": "c72d6f4f-ada5-4885-bc62-a9b5ae750150",
  "service_ids": ["7700b093-6c84-4752-9477-96a67f185677"],
  "date": "2024-12-25"
}
```

**Bước 2: Tạo Booking**
`POST /api/v1/bookings`
```json
{
  "customer_id": "c72d6f4f-ada5-4885-bc62-a9b5ae750150",
  "notes": "Booking Demo Trị Mụn"
}
```
*(Copy `id` trả về)*

**Bước 3: Thêm dịch vụ (Assign KTV Demo)**
`POST /api/v1/bookings/{booking_id}/items`
```json
{
  "service_id": "7700b093-6c84-4752-9477-96a67f185677",
  "start_time": "2024-12-25T09:00:00Z",
  "end_time": "2024-12-25T10:00:00Z",
  "staff_id": "a62d8607-5185-43ce-8e3c-8ad6f74882f6",
  "resource_ids": ["e975efc5-b8c9-4590-84ed-1fe1d256e37c"]
}
```

---

### **3. Quy Trình 2: Khách VIP đặt Massage (Chỉ KTV Cao Cấp làm được)**

**Bước 1: Tạo Booking**
`POST /api/v1/bookings`
```json
{
  "customer_id": "1100b093-6c84-4752-9477-96a67f185611",
  "notes": "Booking VIP Massage"
}
```

**Bước 2: Thêm dịch vụ (Assign KTV Cao Cấp)**
`POST /api/v1/bookings/{booking_id}/items`
```json
{
  "service_id": "8800b093-6c84-4752-9477-96a67f185688",
  "start_time": "2024-12-25T10:30:00Z",
  "end_time": "2024-12-25T12:00:00Z",
  "staff_id": "6700b093-6c84-4752-9477-96a67f185673",
  "resource_ids": ["6542804e-16af-40a9-85d5-50cc4652a162"]
}
```

---

### **4. Quy Trình 3: Thanh Toán**

**Bước 1: Confirm**
`PATCH /api/v1/bookings/{booking_id}/confirm`

**Bước 2: Check-in**
`PATCH /api/v1/bookings/{booking_id}/check-in`

**Bước 3: Complete**
`PATCH /api/v1/bookings/{booking_id}/complete`

**Bước 4: Tạo Invoice**
`POST /api/v1/billing/bookings/{booking_id}/invoice`

**Bước 5: Thanh Toán**
`POST /api/v1/billing/payments`
```json
{
  "invoice_id": "<INVOICE_ID_FROM_STEP_4>",
  "amount": 500000,
  "method": "CASH"
}
```
