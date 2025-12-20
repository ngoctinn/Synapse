# Báo Cáo Đánh Giá Chi Tiết Backend Synapse

## I. Tổng Quan Nghiên Cứu

### Quy Tắc Đang Áp Dụng (.agent/rules)
| Quy tắc | Trạng thái |
|---------|------------|
| Vertical Slice Architecture | ✅ Tuân thủ |
| Service as Dependency | ✅ Tuân thủ |
| Pydantic V2 (`ConfigDict`) | ✅ Tuân thủ |
| Async All The Way | ✅ Tuân thủ |
| Python 3.12+ Syntax (`X \| Y`) | ✅ Tuân thủ |
| Docstring Markdown (Tiếng Việt) | ✅ Tuân thủ |
| Guard Clauses / Early Return | ✅ Tuân thủ |
| RLS Injection | ⚠️ Cần xác nhận (Supabase Auth) |

---

## II. Chi Tiết Modules Hiện Có (10 modules, 84 endpoints)

| Module | Prefix | Endpoints | Tình trạng |
|--------|--------|-----------|------------|
| `users` | `/users` | 6 | ✅ Hoàn thiện |
| `staff` | `/staff` | 7 | ✅ Hoàn thiện |
| `services` | `/services` | 10 | ✅ Hoàn thiện |
| `resources` | `/resources` | 11 | ✅ Hoàn thiện |
| `schedules` | `/schedules` | 14 | ✅ Hoàn thiện |
| `bookings` | `/bookings` | 15+ | ✅ Hoàn thiện |
| `customers` | `/customers` | 7 | ✅ Hoàn thiện |
| `scheduling_engine` | `/scheduling` | 5 | ✅ Hoàn thiện |
| `customer_treatments` | `/treatments` | 4 | ✅ Hoàn thiện |
| `billing` | `/billing` | 5 | ✅ Hoàn thiện |

---

## III. So Sánh Use Cases với Backend

### ✅ Đã Triển Khai Đầy Đủ (23/34)
| Mã UC | Tên | Module |
|-------|-----|--------|
| A1.1-A1.5 | Xác thực | Supabase Auth + `users` |
| A2.1-A2.2 | Xem dịch vụ | `services` |
| A2.4-A2.5 | Tìm slot, Đặt lịch | `scheduling_engine`, `bookings` |
| A3.1-A3.2 | Lịch sử, Hủy lịch | `bookings` |
| B1.1-B1.5 | Lễ tân CRUD | `bookings`, `customers`, `billing` |
| B1.7 | Tiến độ liệu trình | `customer_treatments` |
| B2.1, B2.3 | KTV xem lịch, Ghi chú | `schedules`, (ghi chú trong `bookings`) |
| C3-C5 | Staff invite, Lịch NV, Dịch vụ | `staff`, `schedules`, `services` |
| C6-C7 | Liệu trình, Tài nguyên | `customer_treatments`, `resources` |

### ❌ Chưa Triển Khai (11/34)
| Mã UC | Tên | Module Cần Tạo | Ưu tiên |
|-------|-----|----------------|---------|
| C1 | Giờ hoạt động Spa | `operating_hours` | 🔴 Cao |
| C2 | Ngày nghỉ lễ | `operating_hours` | 🔴 Cao |
| A2.6 | Danh sách chờ | `waitlist` | 🟡 Trung bình |
| A2.7 | Chat trực tuyến | `chat` | 🟡 Trung bình |
| A3.3 | Thông báo nhắc lịch | `notifications` | 🟡 Trung bình |
| A3.6 | Yêu cầu bảo hành | `warranty` | 🟡 Trung bình |
| B1.8 | Tái lập lịch tự động | `scheduling_engine` (mở rộng) | 🔴 Cao |
| C8 | Khuyến mãi | `promotions` | 🟡 Trung bình |
| C9 | Quản lý tài khoản NV | `staff` (có rồi) | ✅ Đã có |
| C10 | Cấu hình hệ thống | `system_config` | 🟢 Thấp |

---

## IV. Kế Hoạch Triển Khai Chia Phase

### Phase 1: Cấu Hình Vận Hành (Core Config)
**Thời gian:** ~2 ngày | **Endpoints:** ~8

| Module | Endpoints |
|--------|-----------|
| `operating_hours` | GET/PUT `/operating-hours` |
| `operating_hours` | CRUD `/exception-dates` |

**Files cần tạo:**
```
backend/src/modules/operating_hours/
├── __init__.py
├── models.py       # RegularOperatingHours, ExceptionDate
├── schemas.py      # OperatingHourRead, ExceptionDateCreate...
├── service.py      # OperatingHoursService
└── router.py       # API endpoints
```

---

### Phase 2: Tái Lập Lịch Tự Động
**Thời gian:** ~2 ngày | **Endpoints:** ~3

| Module | Endpoints |
|--------|-----------|
| `scheduling_engine` | POST `/scheduling/reschedule` |
| `scheduling_engine` | GET `/scheduling/conflicts` |
| `scheduling_engine` | POST `/scheduling/resolve-conflict` |

---

### Phase 3: Khuyến Mãi
**Thời gian:** ~2 ngày | **Endpoints:** ~6

| Module | Endpoints |
|--------|-----------|
| `promotions` | CRUD `/promotions` |
| `promotions` | POST `/promotions/validate` |

---

### Phase 4: Waitlist & Notifications
**Thời gian:** ~3 ngày | **Endpoints:** ~8 (Email Only)

| Module | Endpoints |
|--------|-----------|
| `waitlist` | CRUD `/waitlist` |
| `notifications` | POST `/notifications/send-email` (Test) |
| `notifications` | CRUD `/notification-templates` (Email Templates) |

---

### Phase 5: Warranty & Chat (Tương lai)
**Thời gian:** ~4 ngày | **Endpoints:** ~10

| Module | Endpoints |
|--------|-----------|
| `warranty` | CRUD `/warranty-tickets` |
| `chat` | WebSocket + REST API |

---

## V. Database Tables Đã Có vs Cần Thêm

### ✅ Đã Có Trong Schema (32 tables)
- `regular_operating_hours`, `exception_dates` → Sẵn sàng cho Phase 1
- `waitlist`, `promotions`, `warranty_tickets`, `chat_*`, `treatment_notes` → Đã thêm ER Diagram

### ⚠️ Chưa Có Migration
Cần tạo Alembic migration cho các tables mới trước khi code module.

---

## VI. Đề Xuất Tiếp Theo

1. **Bắt đầu Phase 1** (Operating Hours) vì:
   - Database tables đã có sẵn
   - Ảnh hưởng trực tiếp đến Scheduling Engine
   - Không dependency với module khác

2. **Tạo migration** cho các tables còn thiếu (waitlist, chat, warranty, promotions, treatment_notes)

3. **Mở rộng Scheduling Engine** để hỗ trợ tái lập lịch tự động

---

## VII. Câu Hỏi Xác Nhận

1. Bạn muốn bắt đầu với **Phase nào**?
2. Có cần tôi tạo **Alembic migration** cho các tables mới trước không?
3. **Ưu tiên** nào quan trọng nhất với bạn: Vận hành (Phase 1-2) hay Trải nghiệm khách (Phase 3-5)?
