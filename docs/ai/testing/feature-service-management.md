---
title: Kiểm thử Quản lý Dịch vụ
status: Draft
---

# Kiểm thử: Quản lý Dịch vụ & Kỹ năng

## Test Cases

### Backend
- [ ] **Create Service (Basic):** Tạo dịch vụ chỉ có tên, giá, thời gian, buffer.
- [ ] **Smart Tagging Logic:** Gửi "Massage" và "massage" -> Chỉ tạo 1 skill duy nhất.
- [ ] **Soft Delete Service:** Xóa dịch vụ -> `is_active` = false.
- [ ] **Soft Delete Skill:** Xóa skill -> `is_active` = false.
- [ ] **Assign Skill to User:** Gán skill cho user -> Check bảng `employee_skills`.

### Frontend
- [ ] **Smart Tagging UX:** Gõ tên skill -> Enter -> Tag xuất hiện. Tự động normalize.
- [ ] **Buffer Time UX:** Thanh visualizer hiển thị đúng phần Xanh (Duration) và Xám (Buffer).
- [ ] **Matrix View:** Pagination hoạt động. Tích chọn skill lưu thành công.
