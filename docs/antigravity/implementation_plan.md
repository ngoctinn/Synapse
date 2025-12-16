# Kế Hoạch Triển Khai: TIME DOMAIN (Lịch Làm Việc & Khung Thời Gian)

## 1. Mục Tiêu Giai Đoạn
Xác định **KHI NÀO** nhân viên có thể làm việc, tạo miền thời gian hợp lệ cho thuật toán lập lịch.

**Câu hỏi cần trả lời:** *"KTV A làm việc lúc nào trong ngày X?"*

---

## 2. Phân Tích Hiện Trạng

### Database Audit
| Bảng | Trạng Thái | Ghi Chú |
|:---|:---:|:---|
| `shifts` | ❌ Chưa có | Cần tạo mới |
| `staff_schedules` | ❌ Chưa có | Cần tạo mới |
| ENUM `schedule_status` | ❌ Chưa có | Cần tạo: DRAFT, PUBLISHED |

### Đặc Tả (Theo `data_specification.md`)

**Bảng `shifts`** - Định nghĩa các ca làm việc cố định:
| Cột | Kiểu | Mô tả |
|:---|:---|:---|
| `id` | UUID | PK |
| `name` | VARCHAR(100) | Tên ca (Ca sáng, Ca chiều...) |
| `start_time` | TIME | Giờ bắt đầu (08:00) |
| `end_time` | TIME | Giờ kết thúc (12:00) |
| `color_code` | VARCHAR(7) | Mã màu hiển thị (#FF5722) |

**Bảng `staff_schedules`** - Phân công ca cho KTV theo ngày:
| Cột | Kiểu | Mô tả |
|:---|:---|:---|
| `id` | UUID | PK |
| `staff_id` | UUID | FK → staff.user_id |
| `shift_id` | UUID | FK → shifts.id |
| `work_date` | DATE | Ngày làm việc |
| `status` | ENUM | DRAFT / PUBLISHED |
| `created_at` | TIMESTAMPTZ | Thời điểm tạo |

**Ràng buộc:** UNIQUE(staff_id, work_date, shift_id) - Một KTV không thể có 2 bản ghi trùng ca trong cùng ngày.

---

## 3. Kế Hoạch Thực Thi

### Giai Đoạn 1: Database Migration

#### Migration 2.1: `add_shifts_table`
```sql
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    color_code VARCHAR(7),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT shifts_time_check CHECK (end_time > start_time)
);
```

#### Migration 2.2: `add_staff_schedules_table`
```sql
CREATE TYPE schedule_status AS ENUM ('DRAFT', 'PUBLISHED');

CREATE TABLE staff_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(user_id) ON DELETE CASCADE,
    shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    status schedule_status NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT staff_schedules_unique UNIQUE (staff_id, work_date, shift_id)
);

CREATE INDEX ix_staff_schedules_staff_date ON staff_schedules(staff_id, work_date);
CREATE INDEX ix_staff_schedules_date ON staff_schedules(work_date);
```

---

### Giai Đoạn 2: Backend Module `schedules`

#### Cấu trúc thư mục:
```
src/modules/schedules/
├── __init__.py       # Public API
├── models.py         # Shift, StaffSchedule, ScheduleStatus
├── schemas.py        # DTOs
├── router.py         # API Endpoints
└── service.py        # Business Logic
```

#### Models:

**`Shift`**
- Định nghĩa ca làm việc (Ca sáng, Ca chiều, Ca tối...)
- Là dữ liệu master, ít thay đổi

**`StaffSchedule`**
- Phân công KTV vào ca nào, ngày nào
- Có trạng thái DRAFT/PUBLISHED (cho phép lên lịch trước rồi công bố)

**`ScheduleStatus`** (Enum)
- DRAFT: Bản nháp, chưa công bố
- PUBLISHED: Đã công bố, KTV có thể nhìn thấy

---

### Giai Đoạn 3: API Endpoints

#### Shifts CRUD:
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| GET | `/shifts` | Lấy danh sách ca làm việc |
| POST | `/shifts` | Tạo ca mới |
| PATCH | `/shifts/{id}` | Cập nhật ca |
| DELETE | `/shifts/{id}` | Xóa ca |

#### Staff Schedules:
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| GET | `/schedules` | Lấy lịch làm việc (filter by date range, staff_id) |
| POST | `/schedules` | Tạo lịch làm việc cho KTV |
| POST | `/schedules/bulk` | Tạo nhiều lịch cùng lúc (batch) |
| DELETE | `/schedules/{id}` | Xóa lịch |
| PATCH | `/schedules/{id}/publish` | Công bố lịch (DRAFT → PUBLISHED) |

#### Query Logic (Core):
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| GET | `/staff/{staff_id}/availability` | Lấy khung giờ làm việc của KTV trong ngày/tuần |
| GET | `/schedules/by-date/{date}` | Lấy tất cả KTV làm việc trong ngày |

---

## 4. Tiêu Chí Nghiệm Thu

### Database
- [ ] Bảng `shifts` tồn tại với constraint thời gian
- [ ] Bảng `staff_schedules` tồn tại với unique constraint
- [ ] ENUM `schedule_status` được tạo

### Backend
- [ ] CRUD shifts hoạt động
- [ ] CRUD staff_schedules hoạt động
- [ ] API `/staff/{id}/availability` trả về đúng khung giờ

### Integration Test
- [ ] Tạo ca "Sáng" (08:00-12:00) và "Chiều" (13:00-17:00)
- [ ] Phân công KTV A làm ca Sáng ngày 2025-12-17
- [ ] Query `/staff/{ktv_a}/availability?date=2025-12-17` → Trả về 08:00-12:00

---

## 5. Seed Data Mẫu

### Shifts (Ca làm việc)
| Tên ca | Bắt đầu | Kết thúc | Màu |
|:---|:---:|:---:|:---|
| Ca sáng | 08:00 | 12:00 | #4CAF50 (Xanh lá) |
| Ca chiều | 13:00 | 17:00 | #2196F3 (Xanh dương) |
| Ca tối | 18:00 | 21:00 | #9C27B0 (Tím) |
| Full day | 08:00 | 17:00 | #FF9800 (Cam) |

---

## 6. Thứ Tự Thực Thi

1. **[DB]** Migration 2.1: `add_shifts_table`
2. **[DB]** Migration 2.2: `add_staff_schedules_table`
3. **[BE]** Tạo Module `schedules` (models, schemas)
4. **[BE]** Implement Shifts CRUD
5. **[BE]** Implement StaffSchedules CRUD
6. **[BE]** Implement Availability Query Logic
7. **[DB]** Seed Data mẫu
8. **[TEST]** Verify toàn bộ API
