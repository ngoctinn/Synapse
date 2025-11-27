---
title: Kiểm thử Component UI Tùy chỉnh
status: Draft
priority: Medium
assignee: AI Assistant
---

# Kiểm thử Component UI Tùy chỉnh

## 1. Mục tiêu Bao phủ Kiểm thử
- Xác minh hiển thị trực quan của tất cả component (Sonner, Dialog, Inputs).
- Xác minh tính tương tác (Toggle mật khẩu, Đóng Dialog, Tắt Toast).

## 2. Kiểm thử Đơn vị (Unit Tests)
- **InputWithIcon**: Xác minh icon được render.
- **PasswordInput**: Xác minh loại input chuyển đổi giữa "password" và "text" khi nhấn nút.
- **CustomDialog**: Xác minh mở/đóng dựa trên props.

## 3. Kiểm thử Tích hợp
- **LoginForm**:
    - Xác minh nhập liệu vào input mới hoạt động.
    - Xác minh gửi form kích hoạt Custom Toast.
    - Xác minh gửi form kích hoạt Custom Dialog (luồng demo).

## 4. Các bước Xác minh Thủ công
1.  **Inputs**:
    - Truy cập `/login`.
    - Kiểm tra input Email có icon.
    - Kiểm tra input Mật khẩu có icon ổ khóa và icon mắt.
    - Nhấn icon mắt -> Mật khẩu hiển thị. Nhấn lại -> Ẩn.
2.  **Toast**:
    - Đăng nhập thành công.
    - Xác minh toast "Đăng nhập thành công" (hoặc "Saved Successfully") xuất hiện với thiết kế đúng (Xanh lá).
3.  **Dialog**:
    - Sau khi đăng nhập, xác minh dialog "Kiểm tra Email" xuất hiện.
    - Xác minh layout khớp thiết kế.
    - Nhấn "Đóng" hoặc nút Hành động -> Dialog đóng.

## 5. Dữ liệu Kiểm thử
- Thông tin đăng nhập hợp lệ.
