---
title: Kế hoạch Component UI Tùy chỉnh
status: Draft
priority: Medium
assignee: AI Assistant
---

# Kế hoạch Component UI Tùy chỉnh

## 1. Các Mốc Quan trọng
- **M1**: Triển khai Component (Sonner, Dialog, Inputs).
- **M2**: Tích hợp với Form Xác thực.
- **M3**: Xác minh & Tinh chỉnh.

## 2. Phân rã Nhiệm vụ

### Giai đoạn 1: Triển khai Component
- [x] **Task 1.1**: Tạo component/tiện ích `CustomToast` trong `shared/ui/custom/sonner.tsx`.
    - Triển khai các biến thể Thành công, Thông tin, Cảnh báo, Lỗi.
- [x] **Task 1.2**: Tạo component `CustomDialog` trong `shared/ui/custom/dialog.tsx`.
    - Triển khai layout "Kiểm tra Email" cụ thể nhưng có thể tái sử dụng.
- [x] **Task 1.3**: Tạo component `InputWithIcon` trong `shared/ui/custom/input-with-icon.tsx`.
    - Triển khai định vị icon bên trái.
- [x] **Task 1.4**: Tạo component `PasswordInput` trong `shared/ui/custom/password-input.tsx`.
    - Triển khai toggle hiện/ẩn và hỗ trợ icon trái.

### Giai đoạn 2: Tích hợp
- [x] **Task 2.1**: Cập nhật `LoginForm` để sử dụng `InputWithIcon` (Email) và `PasswordInput` (Mật khẩu).
- [x] **Task 2.2**: Cập nhật `RegisterForm`, `ForgotPasswordForm`, `UpdatePasswordForm` để sử dụng input mới cho đồng bộ.
- [x] **Task 2.3**: Tích hợp `CustomToast` vào `LoginForm` (và các form khác) cho phản hồi thành công/lỗi.
- [x] **Task 2.4**: Tích hợp `CustomDialog` vào `LoginForm` để hiển thị hướng dẫn "Kiểm tra Email" sau khi đăng nhập thành công (luồng demo).

### Giai đoạn 3: Xác minh
- [x] **Task 3.1**: Xác minh thủ công tất cả các trạng thái (Thành công, Lỗi, v.v.).
- [x] **Task 3.2**: Xác minh thiết kế phản hồi (responsive).
- [x] **Task 3.3**: Xác minh khả năng truy cập (thứ tự tab, trình đọc màn hình).

## 3. Phụ thuộc
- `sonner` (đã cài đặt).
- `lucide-react` (đã cài đặt).
- `shadcn/ui` components (Input, Dialog - đã cài đặt).

## 4. Ước tính Thời gian
- Triển khai Component: 1.5 giờ
- Tích hợp: 1 giờ
- Xác minh: 0.5 giờ
- **Tổng cộng**: ~3 giờ

## 5. Rủi ro & Giảm thiểu
- **Rủi ro**: Kiểu dáng tùy chỉnh có thể xung đột với kiểu toàn cục.
    - **Giảm thiểu**: Sử dụng lớp Tailwind cụ thể và kiểm tra `globals.css`.
- **Rủi ro**: "Hiện Mật khẩu" có thể vỡ layout trên màn hình nhỏ.
    - **Giảm thiểu**: Kiểm tra trên các viewport di động.
