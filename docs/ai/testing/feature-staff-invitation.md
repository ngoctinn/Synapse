---
title: Kiểm Thử Mời Nhân Viên
status: Draft
---

# Kiểm Thử Mời Nhân Viên

## 1. Unit Tests
- Test phương thức service `invite_staff`.
- Mock Supabase `inviteUserByEmail` để trả về thành công/thất bại.
- Xác minh rollback DB nếu insert `employees` thất bại.

## 2. Danh sách Kiểm thử Thủ công (Manual Checklist)
- [ ] Mở modal "Thêm nhân viên".
- [ ] Nhập Email, Tên, Vai trò (Quản lý) hợp lệ. -> Thành công.
- [ ] Nhập Email, Tên, Vai trò (Kỹ thuật viên) hợp lệ, Chọn Kỹ năng. -> Thành công.
- [ ] Kiểm tra Database: `auth.users` có bản ghi, `public.employees` có bản ghi (PENDING), `public.employee_skills` có bản ghi.
- [ ] Kiểm tra Email: Nhận được email mời.
- [ ] Click Link: Chuyển hướng đến trang Đặt mật khẩu (luồng Supabase).
- [ ] Đăng nhập: Đăng nhập với mật khẩu mới.
