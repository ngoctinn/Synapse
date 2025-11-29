---
title: Kế Hoạch Mời Nhân Viên
status: Draft
---

# Kế Hoạch Mời Nhân Viên

## 1. Phân rã Nhiệm vụ

### Backend
- [ ] Cập nhật Trigger `handle_new_user` (Migration) để hỗ trợ `role`, `phone_number` từ metadata.
- [ ] Định nghĩa Schema `InviteStaffRequest` (Pydantic).
- [ ] Triển khai endpoint `POST /staff/invite` trong `modules/users`.
- [ ] Triển khai Logic Transaction:
    - [ ] Gọi Supabase Admin API với Metadata đầy đủ.
    - [ ] Insert vào `employee_skills` (nếu là Technician).
    - [ ] Xử lý Rollback (Xóa Auth User nếu lỗi).

### Frontend
- [ ] Tạo component `InviteStaffModal` (Shadcn Dialog).
- [ ] Triển khai Form với Validate Zod.
    - [ ] Render có điều kiện cho Kỹ năng (chỉ hiện khi chọn Technician).
- [ ] Tích hợp với API `POST /staff/invite`.
- [ ] Xử lý Toast Thành công/Lỗi.

### Kiểm thử
- [ ] Unit Test: Logic Service với Supabase call được mock.
- [ ] Manual Test: Gửi lời mời, kiểm tra email, click link, đặt mật khẩu.

## 2. Phụ thuộc
- Supabase Admin Client (Backend).
- `react-hook-form`, `zod`.
- Shadcn UI Components (`Dialog`, `Form`, `Select`, `Input`).

## 3. Ước lượng Nỗ lực
- Backend: 2 giờ.
- Frontend: 3 giờ.
- Kiểm thử: 1 giờ.
