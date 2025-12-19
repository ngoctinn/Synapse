# Kế Hoạch Triển Khai Backend - Giai Đoạn 2: Module Customer Treatments

**Mã phiên:** `BACKEND-P2-TREATMENTS-20251219`
**Ngày tạo:** 2025-12-19
**Trạng thái:** THINK (Chờ phê duyệt)

---

## 1. Vấn đề (Problem Statement)

Hệ thống Spa cần quản lý các gói liệu trình (Treatments) mà khách hàng đã mua (ví dụ: Gói massage 10 buổi). Hiện tại:
1.  Chưa có bảng `customer_treatments` để lưu trữ thông tin gói đã mua.
2.  Booking không có liên kết với Treatment, dẫn đến không thể tự động trừ buổi khi khách sử dụng dịch vụ.
3.  Không thể kiểm tra hạn sử dụng của liệu trình.

---

## 2. Mục đích (Goals)

1.  **Tạo module `treatments`** (hoặc `customer_treatments`): Quản lý các gói liệu trình của khách hàng.
2.  **Logic Punch Card**: Trừ số buổi (`used_sessions`) khi Booking Item hoàn thành (`COMPLETED`).
3.  **Tích hợp Booking**: `booking_items` cần có trường `treatment_id` (optional) để biết item này thuộc về gói nào.
4.  **Kiểm tra hợp lệ**: Chặn sử dụng nếu hết buổi hoặc hết hạn (`expiry_date`).

---

## 3. Ràng buộc (Constraints)

### 3.1 Kỹ thuật
- Tuân thủ Backend Rules (Async, Pydantic V2, SQLModel).
- Quan hệ: `customers` 1-N `customer_treatments`.
- Quan hệ: `booking_items` N-1 `customer_treatments` (đã có trong design, cần thêm FK).
- `treatment_id` trong `booking_items` là nullable (khách có thể đặt lẻ, không dùng gói).

### 3.2 Nghiệp vụ
- **Mua gói**: Khi khách mua gói, tạo record trong `customer_treatments` (chưa làm Billing, nên tạm thời API tạo thủ công).
- **Sử dụng**: Khi tạo Booking, nếu chọn dùng gói -> check `used_sessions < total_sessions` và `expiry_date >= today`.
- **Trừ buổi**: Khi Booking chuyển sang `COMPLETED`, tăng `used_sessions`.
- **Hủy Booking**: Nếu Booking bị hủy hoặc No-show (tùy chính sách), có thể hoàn lại buổi (giảm `used_sessions`). *Tạm thời: Cancel -> hoàn buổi; No-show -> mất buổi (cần confirm policy, MVP: Cancel hoàn, No-show chưa xử lý tự động).*

---

## 4. Chiến lược (Strategy)

### Phase 2A: Tạo Module Customer Treatments
```
src/modules/customer_treatments/
├── __init__.py
├── models.py
├── schemas.py
├── service.py
├── router.py
└── exceptions.py
```

### Phase 2B: Cập nhật Module Bookings
- Thêm trường `treatment_id` vào `BookingItem` (DB Migration).
- Cập nhật `BookingItemCreate` schema.
- Logic Service:
    - Khi tạo booking: Validate treatment (còn buổi, chưa hết hạn).
    - Khi `complete` booking: Gọi service treatment để trừ buổi (`punch`).

### Phase 2C: Integration
- Đăng ký router.

---

## 5. Giải pháp Chi tiết (Solution)

### 5.1 Entity (models.py)

```python
class TreatmentStatus(str, Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    EXPIRED = "EXPIRED"

class CustomerTreatment(SQLModel, table=True):
    __tablename__ = "customer_treatments"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    customer_id: uuid.UUID = Field(foreign_key="customers.id")
    service_id: uuid.UUID | None = Field(default=None, foreign_key="services.id")

    name: str  # Tên gói (Lấy snapshot từ Service Package hoặc nhập tay)
    total_sessions: int
    used_sessions: int = Field(default=0)
    expiry_date: date | None = None

    status: TreatmentStatus = Field(default=TreatmentStatus.ACTIVE)

    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Constraints
    # used <= total
```

### 5.2 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/treatments/customer/{customer_id}` | Lấy liệu trình của khách |
| GET | `/treatments/{id}` | Chi tiết liệu trình |
| POST | `/treatments` | Tạo liệu trình mới (Mua gói - Admin/Recep ONLY) |
| PUT | `/treatments/{id}` | Cập nhật (gia hạn, sửa lỗi) |
| POST | `/treatments/{id}/punch` | Internal API: Trừ buổi (dùng bởi Booking Service) |

---

## 6. Danh sách Task Chi Tiết (SPLIT)

### 2.1 Khởi tạo Module (Basic)
- [ ] **2.1.1** Tạo folder `src/modules/customer_treatments/`
- [ ] **2.1.2** `exceptions.py` (TreatmentNotFound, TreatmentExpired, TreatmentOutOfSessions)
- [x] **2.1** Khởi tạo Module `customer_treatments` (Entity, Schema, Exception).
- [x] **2.2** Logic Service (CRUD + `punch` method + `refund` method).
- [x] **2.3** API Router cho Treatments.
- [x] **2.4** Database Migration (Tạo bảng `customer_treatments` + Update `booking_items`).
- [x] **2.5** Tích hợp vào Module `bookings`:
    - Logic Validate Treatment (`used < total`).
    - Logic Auto-Punch khi `COMPLETED`.
    - Logic Refund khi `CANCELLED`.
- [x] **2.6** Đăng ký Router chính.
- [ ] **2.1.3** `models.py` (CustomerTreatment, TreatmentStatus)
- [ ] **2.1.4** `schemas.py` (Create/Read/Update)

### 2.2 Logic Service
- [ ] **2.2.1** CRUD cơ bản (Get Customer Treatments)
- [ ] **2.2.2** Method `validate_availability(treatment_id)`: Check còn hạn & còn buổi
- [ ] **2.2.3** Method `punch_session(treatment_id)`: used_sessions += 1
- [ ] **2.2.4** Method `refund_session(treatment_id)`: used_sessions -= 1

### 2.3 Router & Integration
- [ ] **2.3.1** API Endpoints cho Treatments
- [ ] **2.3.2** Register Router in `main.py`
- [ ] **2.3.3** Export module in `src/modules/__init__.py`

### 2.4 Database Migration
- [ ] **2.4.1** Update `BookingItem` model (Add `treatment_id`)
- [ ] **2.4.2** Alembic Revision (Create table + Add Foreign Key)

### 2.5 Tích hợp Bookings Logic
- [ ] **2.5.1** Update `BookingItemCreate` schema (Add `treatment_id`)
- [ ] **2.5.2** Update `BookingService.create` & `add_item`: Call `validate_availability`
- [ ] **2.5.3** Update `BookingService.complete`: Call `punch_session`
- [ ] **2.5.4** Update `BookingService.cancel`: Call `refund_session` (nếu booking đã completed hoặc logic khác - *Lưu ý: Nếu cancel từ CONFIRMED thì ko cần refund vì chưa trừ, chỉ trừ khi COMPLETED. Nhưng nếu lỡ complete nhầm rồi cancel thì cần refund.*)
  * *Quyết định:* Chỉ gọi refund khi revert từ COMPLETED -> CANCELLED/OTHER. Với luồng chuẩn (PENDING -> CONFIRMED -> COMPLETED), ta sẽ trừ ở bước cuối.

---

## 7. Kiểm tra Thành công

- [ ] Tạo được Treatment cho Customer.
- [ ] Tạo Booking với `treatment_id`.
- [ ] Booking hoàn thành -> `used_sessions` tăng lên 1.
- [ ] Không thể đặt nếu `used_sessions` == `total_sessions`.

---

**⏸️ TRẠNG THÁI: Chờ phê duyệt để tiếp tục sang giai đoạn SPLIT.**
