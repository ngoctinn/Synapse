# Nhật Ký Thay Đổi (Change Log)

## Phiên Làm Việc: 2025-12-16 (Giai đoạn 3)

### 🔥 GIAI ĐOẠN QUAN TRỌNG NHẤT - BOOKING DOMAIN

---

### 1. Database Migrations (Supabase Cloud)

| Migration | Trạng Thái | Mô Tả |
|:---|:---:|:---|
| `add_bookings_table` | ✅ Done | ENUM `booking_status` + bảng `bookings` |
| `add_booking_items_table` | ✅ Done | Bảng `booking_items` với FKs + indexes |

### 2. Backend Code Changes

#### Module Mới: `src/modules/bookings/`
| File | Mô Tả |
|:---|:---|
| `models.py` | `Booking`, `BookingItem`, `BookingStatus` Enum |
| `conflict_checker.py` | ⚡ **CORE LOGIC**: Kiểm tra xung đột KTV/Phòng |
| `schemas.py` | DTOs cho CRUD + conflict check |
| `service.py` | Business logic với conflict checking |
| `router.py` | 15+ API endpoints |
| `__init__.py` | Public API |

#### Entry Point: `src/app/main.py`
- Đăng ký `bookings_router` vào app

### 3. API Endpoints Mới

#### Bookings CRUD (5 endpoints):
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| GET | `/bookings` | Danh sách (filter) |
| POST | `/bookings` | Tạo mới |
| GET | `/bookings/{id}` | Chi tiết |
| PATCH | `/bookings/{id}` | Cập nhật |

#### Booking Items (3 endpoints):
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| POST | `/bookings/{id}/items` | Thêm dịch vụ |
| PATCH | `/bookings/{id}/items/{item_id}` | Gán KTV/Phòng |
| DELETE | `/bookings/{id}/items/{item_id}` | Xóa dịch vụ |

#### Status Transitions (5 endpoints):
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| PATCH | `/bookings/{id}/confirm` | PENDING → CONFIRMED |
| PATCH | `/bookings/{id}/check-in` | CONFIRMED → IN_PROGRESS |
| PATCH | `/bookings/{id}/complete` | IN_PROGRESS → COMPLETED |
| PATCH | `/bookings/{id}/cancel` | → CANCELLED |
| PATCH | `/bookings/{id}/no-show` | → NO_SHOW |

#### Conflict Check (3 endpoints):
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| POST | `/bookings/check-conflicts` | Kiểm tra xung đột |
| GET | `/bookings/staff/{id}/bookings` | Lịch KTV trong ngày |
| GET | `/bookings/resource/{id}/bookings` | Lịch Phòng trong ngày |

### 4. Conflict Checker Logic

```python
# Nguyên tắc: 2 khoảng thời gian CHỒNG CHÉO nếu:
new_start < existing_end AND new_end > existing_start

# Kiểm tra:
1. Staff conflict: KTV đã có booking khác?
2. Resource conflict: Phòng đã được sử dụng?
3. Schedule conflict: KTV có trong ca làm việc?
```

### 5. Seed Data

| Bảng | Số lượng | Mô tả |
|:---|:---:|:---|
| `bookings` | 3 | 1 CONFIRMED, 1 PENDING, 1 COMPLETED |
| `booking_items` | 4 | 1 đã gán đủ, 1 chưa gán KTV/Phòng |

### 6. Kiểm Tra

| Hạng Mục | Kết Quả |
|:---|:---:|
| Database Schema | ✅ Pass |
| Backend Import | ✅ Pass |
| Seed Data | ✅ 3 bookings + 4 items |

---

### 7. Các File Đã Tạo

**Tạo mới:**
- `backend/src/modules/bookings/models.py`
- `backend/src/modules/bookings/conflict_checker.py` ⚡
- `backend/src/modules/bookings/schemas.py`
- `backend/src/modules/bookings/service.py`
- `backend/src/modules/bookings/router.py`
- `backend/src/modules/bookings/__init__.py`

**Sửa đổi:**
- `backend/src/app/main.py`
