# Backend Database Refactor - Change Log

**Ngày thực hiện:** 27/12/2025
**Thực hiện bởi:** Agent (Antigravity Workflow)

---

## Phiên bản 2.2.1 - Database Schema Alignment

### Tổng quan
Đồng bộ hóa Backend Models với Database thực tế và chuẩn hóa kiểu dữ liệu tài chính.

---

## Các thay đổi chi tiết

### 1. Fix Kiểu Dữ Liệu Tài Chính (Phase 2)

**Best Practice:** Sử dụng SQLModel native `max_digits`/`decimal_places` thay vì import `DECIMAL` từ SQLAlchemy.

| File | Thay đổi |
|:---|:---|
| `services/models.py` | `price: Decimal = Field(default=0, max_digits=12, decimal_places=2)` |
| `services/schemas.py` | `price: Decimal` (ServiceBase, ServiceUpdate) |
| `staff/models.py` | `commission_rate: Decimal = Field(default=0, max_digits=5, decimal_places=2)` |
| `staff/schemas.py` | `commission_rate: Decimal` (StaffBase, StaffUpdate) |

**Lý do:** SQLModel đã hỗ trợ native Decimal với `max_digits` và `decimal_places` - không cần import từ SQLAlchemy.

---

### 2. Xóa Cột Dư Thừa trong `users` (Phase 3)

| File | Cột đã xóa |
|:---|:---|
| `users/models.py` | `phone_number`, `address`, `date_of_birth` |
| `users/schemas.py` | `phone_number`, `address`, `date_of_birth` (UserBase, UserUpdate) |
| `users/service.py` | Logic sync phone_number với CustomerService |
| `staff/schemas.py` | `phone_number` trong `UserRead` nested schema |

**Lý do:** Theo thiết kế v2.2, bảng `users` chỉ quản lý Auth. Thông tin cá nhân được lưu trong bảng `customers` hoặc `staff`.

---

### 3. Cập Nhật Tài Liệu Thiết Kế (Phase 1)

| File | Thay đổi |
|:---|:---|
| `database_design.md` | `staff_profiles` → `staff` |
| `database_design.md` | `service_required_skills` → `service_skills` |
| `database_design.md` | Xóa `phone_number` khỏi bảng `staff` trong ER Diagram |

**Lý do:** Đồng bộ tài liệu với thực tế triển khai (Code & Database đã khớp).

---

## Kiểm tra đã thực hiện

- [x] Python syntax check (`py_compile`) - PASS
- [ ] Alembic migration (Cần tạo riêng)
- [ ] Backend integration test

---

## Ghi chú quan trọng

> [!WARNING]
> **Database Migration Pending:** Các thay đổi này chỉ ảnh hưởng Backend code. Cần tạo Alembic migration để:
> 1. ALTER COLUMN `services.price` → `DECIMAL(12,2)`
> 2. ALTER COLUMN `staff.commission_rate` → `DECIMAL(5,2)`
> 3. DROP COLUMN `users.phone_number`, `users.address`, `users.date_of_birth`
> 4. DROP COLUMN `booking_items.resource_id` (legacy)

---

## Rollback Instructions

Nếu cần rollback, revert các commit liên quan và chạy:
```bash
git checkout HEAD~1 -- backend/src/modules/
```
