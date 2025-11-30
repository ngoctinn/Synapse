---
title: Service Management Testing
status: Draft
related_requirements: docs/ai/requirements/feature-service-management.md
---

# Kế Hoạch Kiểm Thử

## 1. Unit Tests (Backend)
- Test Model creation.
- Test Service CRUD logic.
- Test validation rules (e.g., duplicate skill code).

## 2. Integration Tests (API)
- `POST /services`: Tạo service thành công trả về 200.
- `POST /services`: Tạo service với skill_id không tồn tại trả về 400/404.
- `GET /services`: Trả về danh sách đúng định dạng.

## 3. Manual Testing (Frontend)
- [ ] Vào trang Admin > Services.
- [ ] Thêm mới Skill "Massage Body".
- [ ] Thêm mới Service "Massage Thụy Điển 60p", chọn skill "Massage Body".
- [ ] Lưu và kiểm tra hiển thị trên bảng.
- [ ] Sửa Service, bỏ chọn skill, lưu lại. Kiểm tra DB.
