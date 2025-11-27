---
title: User Authentication Testing
status: Draft
---

# Feature: User Authentication Testing

## 1. Unit Tests
- [ ] **Backend:** Test `get_current_user` dependency (mock token).
- [ ] **Backend:** Test `User` model validation.
- [ ] **Frontend:** Test form validation logic (email format, password length).

## 2. Integration Tests
- [ ] **Trigger Test:**
  - Tạo user giả trong `auth.users`.
  - Assert record tương ứng xuất hiện trong `public.users`.
- **API Test:**
  - Gửi request đến `/api/v1/users/me` không có token -> 401.
  - Gửi request có token hợp lệ -> 200 + User data.

## 3. Manual Testing Checklist
- [ ] **Đăng ký:**
  - [ ] Nhập email sai -> Lỗi.
  - [ ] Nhập pass < 8 ký tự -> Lỗi.
  - [ ] Đăng ký thành công -> Chuyển hướng/Thông báo.
  - [ ] Kiểm tra DB `public.users` có dữ liệu.
- **Đăng nhập:**
  - [ ] Sai pass -> Lỗi.
  - [ ] Đúng pass -> Vào Dashboard.
  - [ ] F5 trang Dashboard -> Vẫn ở trạng thái đăng nhập.
- **Đăng xuất:**
  - [ ] Click Logout -> Về trang Login.
  - [ ] Back lại trang Dashboard -> Bị redirect ra Login.
