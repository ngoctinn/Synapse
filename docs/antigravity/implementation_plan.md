# Kế Hoạch Triển Khai: BOOKING DOMAIN (Đặt Lịch Cơ Bản)

## 🔥 ĐÂY LÀ GIAI ĐOẠN QUAN TRỌNG NHẤT

> **Vì sao:** Toàn bộ hệ thống xoay quanh `booking_item` - đây chính là **Activity** trong mô hình toán RCPSP.

---

## 1. Mục Tiêu Giai Đoạn

Xây dựng luồng đặt lịch hoàn chỉnh với khả năng **kiểm tra xung đột** (KTV và Phòng).

**Câu hỏi cần trả lời:**
- *"KTV A có rảnh lúc 10:00 ngày X không?"*
- *"Phòng VIP 1 có trống lúc 14:00 ngày X không?"*

---

## 2. Phân Tích Hiện Trạng

### Database Audit
| Bảng | Trạng Thái | Ghi Chú |
|:---|:---:|:---|
| `bookings` | ❌ Chưa có | Cần tạo mới |
| `booking_items` | ❌ Chưa có | Cần tạo mới |
| ENUM `booking_status` | ❌ Chưa có | 6 giá trị |

### Đặc Tả (Theo `data_specification.md`)

**Bảng `bookings`** - Lịch hẹn tổng:
| Cột | Kiểu | Mô tả |
|:---|:---|:---|
| `id` | UUID | PK |
| `customer_id` | UUID (nullable) | FK → users (khách) |
| `created_by` | UUID (nullable) | FK → users (lễ tân tạo) |
| `start_time` | TIMESTAMPTZ | Thời gian bắt đầu |
| `end_time` | TIMESTAMPTZ | Thời gian kết thúc |
| `status` | ENUM | PENDING → CONFIRMED → IN_PROGRESS → COMPLETED |
| `notes` | TEXT | Ghi chú |
| `cancel_reason` | TEXT | Lý do hủy |
| `check_in_time` | TIMESTAMPTZ | Thời điểm check-in |
| `total_price` | DECIMAL | Tổng giá |

**Bảng `booking_items`** - Chi tiết từng dịch vụ trong booking:
| Cột | Kiểu | Mô tả |
|:---|:---|:---|
| `id` | UUID | PK |
| `booking_id` | UUID | FK → bookings |
| `service_id` | UUID | FK → services |
| `staff_id` | UUID (nullable) | FK → staff (KTV được gán) |
| `resource_id` | UUID (nullable) | FK → resources (Phòng được gán) |
| `start_time` | TIMESTAMPTZ | Thời gian bắt đầu item |
| `end_time` | TIMESTAMPTZ | Thời gian kết thúc item |
| `original_price` | DECIMAL | Giá gốc tại thời điểm đặt |
| `service_name_snapshot` | VARCHAR | Snapshot tên dịch vụ |

---

## 3. Luồng Nghiệp Vụ

```
[Khách/Lễ tân] Tạo Booking (PENDING)
        ↓
[Lễ tân] Thêm booking_items (dịch vụ)
        ↓
[Lễ tân] Gán staff + resource cho từng item
        ↓
[Hệ thống] Kiểm tra xung đột
    - KTV đã có booking khác?
    - Phòng đã được sử dụng?
        ↓
[Lễ tân] Xác nhận booking (CONFIRMED)
        ↓
[Khách đến] Check-in → IN_PROGRESS
        ↓
[Hoàn thành] → COMPLETED
```

---

## 4. Kế Hoạch Thực Thi

### Giai Đoạn 1: Database Migration

#### Migration 3.1: `add_bookings_table`
```sql
CREATE TYPE booking_status AS ENUM (
    'PENDING', 'CONFIRMED', 'IN_PROGRESS',
    'COMPLETED', 'CANCELLED', 'NO_SHOW'
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status booking_status NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    cancel_reason TEXT,
    check_in_time TIMESTAMPTZ,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    total_price DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT bookings_time_check CHECK (end_time > start_time)
);
```

#### Migration 3.2: `add_booking_items_table`
```sql
CREATE TABLE booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES staff(user_id) ON DELETE SET NULL,
    resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
    service_name_snapshot VARCHAR(255),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    original_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT booking_items_time_check CHECK (end_time > start_time)
);
```

---

### Giai Đoạn 2: Backend Module `bookings`

#### Cấu trúc:
```
src/modules/bookings/
├── __init__.py
├── models.py         # Booking, BookingItem, BookingStatus
├── schemas.py        # DTOs
├── router.py         # API Endpoints
├── service.py        # Business Logic
└── conflict_checker.py  # ⚡ CORE: Kiểm tra xung đột
```

---

### Giai Đoạn 3: API Endpoints

#### Bookings CRUD:
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| GET | `/bookings` | Danh sách (filter: date, status, customer) |
| POST | `/bookings` | Tạo booking mới (PENDING) |
| GET | `/bookings/{id}` | Chi tiết + items |
| PATCH | `/bookings/{id}` | Cập nhật thông tin |
| DELETE | `/bookings/{id}` | Hủy booking |

#### Booking Items:
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| POST | `/bookings/{id}/items` | Thêm dịch vụ |
| PATCH | `/bookings/{id}/items/{item_id}` | Cập nhật (assign staff/resource) |
| DELETE | `/bookings/{id}/items/{item_id}` | Xóa dịch vụ |

#### Status Transitions:
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| PATCH | `/bookings/{id}/confirm` | PENDING → CONFIRMED |
| PATCH | `/bookings/{id}/check-in` | CONFIRMED → IN_PROGRESS |
| PATCH | `/bookings/{id}/complete` | IN_PROGRESS → COMPLETED |
| PATCH | `/bookings/{id}/cancel` | → CANCELLED |
| PATCH | `/bookings/{id}/no-show` | → NO_SHOW |

#### Conflict Check (CORE):
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| GET | `/availability/staff/{id}` | Kiểm tra KTV rảnh không |
| GET | `/availability/resource/{id}` | Kiểm tra Phòng trống không |
| POST | `/availability/check` | Kiểm tra nhiều slots cùng lúc |

---

## 5. ⚡ CORE LOGIC: Conflict Checker

### Nguyên tắc kiểm tra xung đột:

```python
def is_conflicting(new_start, new_end, existing_start, existing_end):
    """
    True nếu 2 khoảng thời gian CHỒNG CHÉO.
    """
    return new_start < existing_end and new_end > existing_start
```

### Query kiểm tra KTV:
```sql
SELECT COUNT(*) FROM booking_items bi
JOIN bookings b ON bi.booking_id = b.id
WHERE bi.staff_id = :staff_id
  AND b.status NOT IN ('CANCELLED', 'NO_SHOW', 'COMPLETED')
  AND bi.start_time < :new_end
  AND bi.end_time > :new_start
```

### Query kiểm tra Phòng:
```sql
SELECT COUNT(*) FROM booking_items bi
JOIN bookings b ON bi.booking_id = b.id
WHERE bi.resource_id = :resource_id
  AND b.status NOT IN ('CANCELLED', 'NO_SHOW', 'COMPLETED')
  AND bi.start_time < :new_end
  AND bi.end_time > :new_start
```

---

## 6. Tiêu Chí Nghiệm Thu

### Database
- [ ] Bảng `bookings` với constraints
- [ ] Bảng `booking_items` với FKs
- [ ] ENUM `booking_status`
- [ ] Indexes cho query thường dùng

### Backend
- [ ] CRUD bookings + items
- [ ] Status transitions
- [ ] **Conflict checker hoạt động chính xác**

### Integration Test
- [ ] Tạo booking với 2 services
- [ ] Gán staff + resource
- [ ] Thử gán KTV đang bận → Lỗi
- [ ] Thử gán Phòng đang dùng → Lỗi
- [ ] Confirm → Check-in → Complete

---

## 7. Thứ Tự Thực Thi

1. **[DB]** Migration 3.1: `add_bookings_table`
2. **[DB]** Migration 3.2: `add_booking_items_table`
3. **[BE]** Module `bookings`: models.py
4. **[BE]** Module `bookings`: conflict_checker.py ⚡
5. **[BE]** Module `bookings`: schemas.py
6. **[BE]** Module `bookings`: service.py
7. **[BE]** Module `bookings`: router.py
8. **[BE]** Đăng ký router
9. **[DB]** Seed data mẫu
10. **[TEST]** Verify conflict checking
