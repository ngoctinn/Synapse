---
title: Triển khai Component UI Tùy chỉnh
status: Draft
priority: Medium
assignee: AI Assistant
---

# Triển khai Component UI Tùy chỉnh

## 1. Thiết lập Phát triển
- Đảm bảo `sonner` và `lucide-react` đã được cài đặt.
- Đảm bảo các component `shadcn/ui` (`input`, `dialog`, `button`) đã hiện diện.

## 2. Cấu trúc Mã

### 2.1. Custom Sonner (`shared/ui/custom/sonner.tsx`)
- **Exports**: Component `CustomToast` hoặc các hàm tiện ích.
- **Imports**: `sonner` (toast), `lucide-react` (icons).
- **Logic**: Wrapper bao quanh `toast.custom()` để render thiết kế cụ thể.

### 2.2. Custom Dialog (`shared/ui/custom/dialog.tsx`)
- **Exports**: Component `CustomDialog`.
- **Imports**: `Dialog` primitives từ `shared/ui/dialog`.
- **Logic**: Component có kiểm soát (controlled) chấp nhận trạng thái `open` và props nội dung.

### 2.3. Input Với Icon (`shared/ui/custom/input-with-icon.tsx`)
- **Exports**: Component `InputWithIcon`.
- **Imports**: `Input` từ `shared/ui/input`, `lucide-react`.
- **Logic**: Render `Input` với padding và icon định vị tuyệt đối.

### 2.4. Password Input (`shared/ui/custom/password-input.tsx`)
- **Exports**: Component `PasswordInput`.
- **Imports**: `InputWithIcon` (hoặc logic tương tự), `lucide-react` (Eye/EyeOff).
- **Logic**: State `showPassword` chuyển đổi loại input.

## 3. Ghi chú Triển khai
- **Styling**: Sử dụng `clsx` hoặc `cn` để gộp lớp (class merging).
- **Accessibility**: Đảm bảo `aria-label` cho toggle mật khẩu.
- **Chế độ Tối**: Kiểm tra tất cả màu sắc trong chế độ tối.

## 4. Điểm Tích hợp
- **Auth Forms**: `LoginForm`, `RegisterForm`, v.v., sẽ thay thế `Input` chuẩn bằng `InputWithIcon` / `PasswordInput`.
- **Phản hồi**: `LoginForm` sẽ gọi `toast.custom()` khi thành công.

## 5. Xử lý Lỗi
- Component nên xử lý các props bị thiếu một cách nhẹ nhàng (giá trị mặc định).

## 6. Cân nhắc Hiệu năng
- Tác động tối thiểu. Đảm bảo icon được import từ `lucide-react` (tree-shakable).

## 7. Ghi chú Bảo mật
- Input mật khẩu phải mặc định là `type="password"`.
