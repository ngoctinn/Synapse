# Backend Audit Plan - Antigravity Protocol

**Trạng thái:** 🚀 Đang thực hiện
**Ngày bắt đầu:** 2025-12-20
**Mục tiêu:** Rà soát toàn diện mã nguồn Backend, phát hiện lỗi tiềm ẩn, lỗ hổng bảo mật và nợ kỹ thuật.

## 1. Phân Loại Modules

### 🔴 Nhóm 1: Critical Business Logic (Ưu tiên cao nhất)
- [x] Bookings (Đã fix 2 lỗi lớn)
- [ ] Scheduling Engine (Check lại AI Logic & Performance)
- [ ] Billing (Check transaction integrity)
- [ ] Customer Treatments (Check trừ liệu trình & hoàn tác)

### 🟡 Nhóm 2: Core Data Management
- [ ] Users (Auth & RLS)
- [ ] Staff
- [ ] Customers
- [ ] Services
- [ ] Resources
- [ ] Schedules

### 🟢 Nhóm 3: Supporting Features
- [ ] Notifications
- [ ] Warranty
- [ ] Chat
- [ ] Waitlist
- [ ] Promotions
- [ ] Operating Hours

## 2. Checklist Rà Soát (Automated Scan)

### Code Quality & Standards
- [ ] Tìm `print()` statements (Debug code bỏ quên).
- [ ] Tìm `TODO` / `FIXME` comments.
- [ ] Tìm `except Exception:` (Catch-all errors quá rộng).
- [ ] Check `typing`: Sử dụng `list[X]` thay vì `List[X]`, `X | None`.

### Database & Security
- [ ] Check `session.execute(text(...))` (Raw SQL Injection risks).
- [ ] Check `Commit` logic (Đảm bảo Transaction Atomic).
- [ ] Check RLS Policies (User data leakage).

## 3. Nhật Ký Audit (Audit Log)

### 2025-12-20 (Bookings & RLS Fixes)
- **Fix:** `TypeError: Incompatible collection type` (Bookings Model).
- **Fix:** `ArgumentError` (Conflict Checker SQL Bind).
- **Fix:** `TypeError: Decimal + Float` (Billing Item Calculation).
- **Fix:** RLS Policy cho `Users` table (Cho phép xem thông tin KTV).

## 4. Hành Động Tiếp Theo
1.  Quét `grep_search` toàn bộ `backend/src/modules` với các từ khóa "danger".
2.  Deep Dive vào `Billing` và `Customer Treatments` code.
