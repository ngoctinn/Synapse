# Kế hoạch Kiến trúc: Quản lý Khách hàng & Notification Đa kênh (Modular Monolith)

## 1. Tổng quan vấn đề & Giải pháp

**Vấn đề:**
- Hệ thống hiện tại định danh bằng `User` (Email/Pass) gây khó khăn cho việc quản lý khách vãng lai (chiếm 80% khách Spa).
- Khách vãng lai cần được quản lý lịch sử, tích điểm nhưng không bắt buộc tạo tài khoản đăng nhập.
- Cần cơ chế thông báo linh hoạt: App Push (khách đã đăng ký) và Zalo/SMS (khách vãng lai).

**Giải pháp:**
- **Tách biệt Identity (User) và Profile (Customer):** Sử dụng Số điện thoại làm khoá định danh nghiệp vụ chính.
- **Chiến lược Notification Gateway:** Tự động điều hướng kênh thông báo dựa trên trạng thái người dùng.

---

## 2. Thiết kế Cơ sở dữ liệu (Database Design)

### 2.1. Module `customers` (Mới)
Tách rời thông tin khách hàng khỏi bảng `users`.

```python
# src/modules/customers/models.py
class Customer(SQLModel, table=True):
    __tablename__ = "customers"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    # Định danh nghiệp vụ (Bắt buộc)
    phone_number: str = Field(unique=True, index=True)
    full_name: str

    # Liên kết Identity (Tuỳ chọn - Nullable)
    # Nếu Null -> Khách vãng lai. Nếu Có -> Khách đã đăng ký App.
    user_id: uuid.UUID | None = Field(default=None, foreign_key="users.id", unique=True)

    # CRM Data
    loyalty_points: int = Field(default=0)
    membership_tier: str = Field(default="SILVER") # SILVER, GOLD, PLATINUM
    notes: str | None = None # Ghi chú chung

    # Audit
    created_at: datetime
    updated_at: datetime
```

### 2.2. Module `appointments` (Cập nhật)
Thay đổi khoá ngoại từ `user_id` sang `customer_id`.

```python
class Appointment(SQLModel, table=True):
    # ...
    # Cũ: user_id: uuid.UUID = Field(foreign_key="users.id")
    # Mới:
    customer_id: uuid.UUID = Field(foreign_key="customers.id")
    # ...
```

---

## 3. Kiến trúc Notification Service (Gateway Pattern)

Xây dựng module `notifications` xử lý logic gửi tin đa kênh.

### 3.1. Sơ đồ Luồng (Flow Chart)
```mermaid
graph TD
    A[Sự kiện: Đặt lịch thành công] --> B{Có user_id?}
    B -- Có (Đã dùng App) --> C[Gửi Firebase Push Notification]
    B -- Không (Vãng lai) --> D[Gửi Zalo ZNS (Priority 1)]
    D -- Thất bại --> E[Gửi SMS Brandname (Fallback)]
```

### 3.2. Interface Service
```python
# src/modules/notifications/service.py

class NotificationService:
    async def send_booking_confirmation(self, booking_id: uuid.UUID):
        booking = await self.booking_repo.get(booking_id)
        customer = await self.customer_repo.get(booking.customer_id)

        # Chiến lược chọn kênh
        if customer.user_id:
            await self.push_adapter.send(customer.user_id, "Đặt lịch thành công!")
        else:
            try:
                await self.zns_adapter.send(customer.phone_number, template_id="BOOKING_CONFIRM", data={...})
            except ZNsError:
                await self.sms_adapter.send(customer.phone_number, "Spa ABC xac nhan lich hen...")
```

---

## 4. Lộ trình Triển khai (Implementation Plan)

### Giai đoạn 1: Refactor Core Backend (Scope: Hôm nay)
1. **Tạo Module Customer:**
   - Tạo Schema `Customer`, `CustomerCreate` (Walk-in vs Registered).
   - Migration Database (Alembic).
2. **Refactor Appointment Relation:**
   - Chuyển FK `user_id` -> `customer_id`.
   - Update API `create_appointment` để hỗ trợ flow: *Tìm khách theo SĐT -> Nếu chưa có thì tạo Customer ẩn -> Tạo lịch*.
3. **Cập nhật Frontend (Customer 360):**
   - Đảm bảo màn hình quản lý khách hàng gọi API `customers` thay vì `users`.

### Giai đoạn 2: Notification Infrastructure (Scope: Tương lai gần)
1. **Zalo OA Setup:** (User thực hiện thủ tục đăng ký với Zalo).
2. **Build Notification Module:**
   - Implement Zalo Adapter (HTTP Client).
   - Implement Fallback Logic.

---

## 5. Kết quả Mong đợi (Acceptance Criteria)
1.  Lễ tân có thể tạo lịch hẹn cho **Khách vãng lai** chỉ bằng **Số điện thoại + Tên** (Không cần Email).
2.  Dữ liệu khách hàng được lưu trữ nhất quán: Khách vãng lai sau này đăng ký App sẽ tự động được "kế thừa" lịch sử cũ dựa trên SĐT trùng khớp.
3.  Hệ thống Database sẵn sàng cho việc tích hợp Zalo ZNS sau này.
