# Nhật Ký Thay Đổi (Change Log)

## Phiên Làm Việc: 2025-12-16 (Giai đoạn 2)

### Tóm Tắt
Triển khai thành công **TIME DOMAIN** - Lịch làm việc & Khung thời gian.

---

### 1. Database Migrations (Supabase Cloud)

| Migration | Trạng Thái | Mô Tả |
|:---|:---:|:---|
| `add_shifts_table` | ✅ Done | Bảng `shifts` với constraint time |
| `add_staff_schedules_table` | ✅ Done | Bảng `staff_schedules`, ENUM `schedule_status`, indexes |

### 2. Backend Code Changes

#### Module Mới: `src/modules/schedules/`
| File | Mô Tả |
|:---|:---|
| `models.py` | `Shift`, `StaffSchedule`, `ScheduleStatus` Enum |
| `schemas.py` | DTOs cho CRUD + `StaffAvailability`, `TimeSlot` |
| `service.py` | Logic nghiệp vụ: CRUD, bulk create, availability query |
| `router.py` | 13 API endpoints với docstrings tiếng Việt |
| `__init__.py` | Public API (Gatekeeper pattern) |

#### Module Cập Nhật: `src/modules/staff/`
| File | Thay Đổi |
|:---|:---|
| `models.py` | Thêm relationship `schedules` sang `StaffSchedule` |

#### Entry Point: `src/app/main.py`
- Đăng ký `schedules_router` vào app

### 3. API Endpoints Mới

#### Shifts (Ca làm việc):
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| GET | `/shifts` | Danh sách ca |
| POST | `/shifts` | Tạo ca mới |
| GET | `/shifts/{id}` | Chi tiết ca |
| PATCH | `/shifts/{id}` | Cập nhật ca |
| DELETE | `/shifts/{id}` | Xóa ca |

#### Staff Schedules (Lịch làm việc):
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| GET | `/schedules` | Danh sách lịch (có filter) |
| POST | `/schedules` | Tạo lịch |
| POST | `/schedules/bulk` | Tạo nhiều lịch |
| GET | `/schedules/{id}` | Chi tiết lịch |
| PATCH | `/schedules/{id}` | Cập nhật lịch |
| DELETE | `/schedules/{id}` | Xóa lịch |
| PATCH | `/schedules/{id}/publish` | Công bố lịch |

#### Availability Query (Core):
| Method | Endpoint | Mô tả |
|:---|:---|:---|
| GET | `/staff/{id}/availability?date=` | Khung giờ làm việc của KTV |
| GET | `/schedules/by-date/{date}` | Tất cả lịch trong ngày |

### 4. Seed Data

| Bảng | Số lượng | Mô tả |
|:---|:---:|:---|
| `shifts` | 4 | Ca sáng, Chiều, Tối, Full day |
| `staff_schedules` | 11 | Lịch làm việc tuần 17-21/12/2025 |

### 5. Kiểm Tra

| Hạng Mục | Kết Quả |
|:---|:---:|
| Database Schema | ✅ Pass |
| Backend Import | ✅ Pass |
| Seed Data | ✅ Pass |

---

### 6. Các File Đã Tạo/Sửa

**Tạo mới:**
- `backend/src/modules/schedules/models.py`
- `backend/src/modules/schedules/schemas.py`
- `backend/src/modules/schedules/service.py`
- `backend/src/modules/schedules/router.py`
- `backend/src/modules/schedules/__init__.py`

**Sửa đổi:**
- `backend/src/modules/staff/models.py`
- `backend/src/app/main.py`
