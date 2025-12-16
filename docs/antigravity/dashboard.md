# Tiến Độ Dự Án Synapse: Core Scheduling Data

**Giai đoạn:** Database & Backend Foundation
**Cập nhật lần cuối:** 2025-12-16 20:15

---

## Tổng Quan Trạng Thái

| Giai đoạn | Tiến độ | Trạng thái |
|:---|:---:|:---|
| 1. Database Migration | 4/4 | ✅ Hoàn thành |
| 2. Backend Models/API | 4/5 | 🟡 Đang tiến hành |
| 3. Matching Logic | 0/3 | 🔴 Chưa bắt đầu |

---

## Chi Tiết Tác Vụ

### 📦 Giai Đoạn 1: Database Migration

| ID | Tác Vụ | Trạng Thái | Ghi Chú |
|:---|:---|:---:|:---|
| DB-01 | Migration: `add_service_categories` | ✅ Done | Bảng + FK vào services |
| DB-02 | Migration: `add_resource_system` | ✅ Done | ENUMs + groups/resources |
| DB-03 | Migration: `add_service_resource_requirements` | ✅ Done | Bảng link N-N |
| DB-04 | Migration: `add_proficiency_levels` | ✅ Done | proficiency_level columns |

### ⚙️ Giai Đoạn 2: Backend Implementation

| ID | Tác Vụ | Trạng Thái | Ghi Chú |
|:---|:---|:---:|:---|
| BE-01 | Module `categories`: Models + CRUD | ✅ Done | Tích hợp vào services |
| BE-02 | Module `resources`: Models + CRUD | ✅ Done | Full CRUD API |
| BE-03 | Update Module `services` | ✅ Done | Relationships updated |
| BE-04 | Model `ServiceResourceRequirement` | ✅ Done | Link model |
| BE-05 | API CRUD cho ServiceCategory | ⬜ Pending | Cần thêm endpoints |

### 🧠 Giai Đoạn 3: Matching Logic

| ID | Tác Vụ | Trạng Thái | Ghi Chú |
|:---|:---|:---:|:---|
| ML-01 | `MatchingService.get_qualified_staff()` | ⬜ | Core logic |
| ML-02 | `MatchingService.get_available_resources()` | ⬜ | Core logic |
| ML-03 | API `/services/{id}/candidates` | ⬜ | Endpoint |

---

## Kết Quả Kiểm Tra

| Hạng Mục | Kết Quả |
|:---|:---:|
| Database Schema | ✅ Pass |
| Backend Import | ✅ Pass |
| Ruff Lint | ⚠️ Minor warnings (F401) |

---

## Ghi Chú Phiên Làm Việc

### 2025-12-16
- ✅ **DB-01 đến DB-04**: Hoàn thành tất cả Database Migrations lên Supabase Cloud.
- ✅ **BE-01 đến BE-04**: Tạo Module `resources`, cập nhật Module `services`.
- ✅ Đăng ký router mới vào `main.py`.
- ✅ Backend import test passed.
- ⏳ Còn lại: ServiceCategory CRUD endpoints, Matching Logic.

---

## Bước Tiếp Theo

1. **BE-05**: Thêm API endpoints cho ServiceCategory trong services router.
2. **ML-01 đến ML-03**: Implement Matching Logic để trả lời câu hỏi "Ai + Phòng nào làm được dịch vụ này?"
3. **Frontend Integration**: Cập nhật types và UI để sử dụng dữ liệu mới.
