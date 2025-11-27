---
title: User Authentication Planning
status: Draft
---

# Feature: User Authentication Planning

## 1. Task Breakdown

### Phase 1: Database & Backend Setup
- [ ] **DB-01**: Tạo migration cho bảng `public.users` và Trigger `on_auth_user_created`.
- [ ] **BE-01**: Cập nhật `SQLModel` cho `User` trong `backend/src/modules/users/models.py`.
- [ ] **BE-02**: Implement `get_current_user` dependency trong `backend/src/common/security.py`.
- [ ] **BE-03**: Tạo API endpoint `GET /me` và `PUT /me` trong `backend/src/modules/users/router.py`.

### Phase 2: Frontend Authentication (Next.js)
- [ ] **FE-01**: Cài đặt `@supabase/ssr` và cấu hình client (Server/Client/Middleware).
- [ ] **FE-02**: Implement Server Actions cho Auth (`login`, `signup`, `logout`).
- [ ] **FE-03**: Tạo UI trang Đăng nhập (`/login`).
- [ ] **FE-04**: Tạo UI trang Đăng ký (`/register`).
- [ ] **FE-05**: Tạo UI trang Quên mật khẩu (`/forgot-password`).
- [ ] **FE-06**: Tạo UI trang Đặt lại mật khẩu (`/reset-password`).
- [ ] **FE-07**: Cập nhật Middleware để bảo vệ routes `/dashboard`.

### Phase 3: Integration & Polish
- [ ] **INT-01**: Test luồng đăng ký -> kiểm tra DB có user mới.
- [ ] **INT-02**: Test luồng đăng nhập -> kiểm tra truy cập Dashboard.
- [ ] **INT-03**: Test gọi API Backend từ Frontend (kèm Token).

## 2. Dependencies
- Cần biến môi trường Supabase trong `.env` (Backend) và `.env.local` (Frontend) - **Đã hoàn thành**.
- Cần thư viện `@supabase/ssr` cho Next.js.

## 3. Effort Estimation
- **Backend:** 2-3 hours.
- **Frontend:** 4-5 hours.
- **Testing:** 1-2 hours.
- **Total:** ~1 day.

## 4. Risks & Mitigation
- **Risk:** Trigger không chạy hoặc lỗi quyền hạn.
  - *Mitigation:* Test kỹ trigger với user `postgres` và `service_role`.
- **Risk:** Cookie không được set đúng trên production (domain issue).
  - *Mitigation:* Test kỹ trên localhost và môi trường staging (nếu có), đảm bảo `secure` flag đúng.
