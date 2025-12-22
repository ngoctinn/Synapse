# Kế hoạch Triển khai: Tối ưu UI/UX Auth Feature

Kế hoạch này giải quyết các vấn đề được nêu trong báo cáo audit `audit_admin_auth_billing.md` cho phần Auth.

## Vấn đề

1.  **Luồng Đăng ký gây gián đoạn**: Chuyển hướng về `/login` sau khi đăng ký thành công buộc người dùng nhập lại thông tin.
2.  **Thiếu Inline Errors**: Các lỗi từ server (validation) chỉ hiển thị qua Toast, khó xác định field bị lỗi.

## Mục đích

- Tự động đăng nhập sau khi đăng ký thành công.
- Hiển thị lỗi validation trực tiếp dưới các trường nhập liệu.

## Ràng buộc

- Sử dụng `useActionState` và `react-hook-form`.
- Đảm bảo an toàn bảo mật khi tự động đăng nhập.

## Chiến lược & Giải pháp

### 1. Auto-login sau khi Đăng ký
- **Giải pháp**: Cập nhật `registerAction` để tự động đăng nhập bằng mật khẩu vừa tạo nếu việc đăng ký thành công (hoặc sử dụng session trả về từ `signUp` nếu config cho phép bypass confirm email).
- **File ảnh hưởng**: `frontend/src/features/auth/actions.ts`.

### 2. Inline Server Errors
- **Giải pháp**: Trong `RegisterForm` và `LoginForm`, sử dụng `setError` từ `react-hook-form` để map các lỗi trường (field errors) trả về từ `actionState`.
- **File ảnh hưởng**: `frontend/src/features/auth/components/register-form.tsx`, `frontend/src/features/auth/components/login-form.tsx`.

## Kế hoạch hành động (Atomic Tasks)

- [ ] Phân tích logic `signUp` của Supabase (Hiện tại đang yêu cầu confirm email).
- [ ] Cập nhật `registerAction` để hỗ trợ auto-login (nếu được phép).
- [ ] Triển khai hiển thị lỗi inline cho `RegisterForm`.
- [ ] Triển khai hiển thị lỗi inline cho `LoginForm`.
