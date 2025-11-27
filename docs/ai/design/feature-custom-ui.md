---
title: Thiết kế Component UI Tùy chỉnh
status: Draft
priority: Medium
assignee: AI Assistant
---

# Thiết kế Component UI Tùy chỉnh

## 1. Tổng quan Kiến trúc
Các component UI tùy chỉnh sẽ được xây dựng dựa trên các nguyên mẫu Shadcn/UI (Radix UI) hiện có và thư viện `sonner`. Chúng sẽ được đặt tại `frontend/src/shared/ui/custom/` để phân biệt với các component Shadcn tiêu chuẩn. Các component này sẽ được sử dụng bởi các component nghiệp vụ (ví dụ: `LoginForm`, `RegisterForm`) để cung cấp phản hồi và khả năng sử dụng nâng cao.

## 2. Thiết kế Component

### 2.1. Custom Sonner (Toast)
- **Đường dẫn**: `frontend/src/shared/ui/custom/sonner.tsx` (hoặc `toast.tsx`)
- **Thư viện**: `sonner`
- **Cấu trúc**:
    - Chúng ta sẽ định nghĩa một tiện ích hoặc component tùy chỉnh sử dụng `toast.custom()`.
    - **Layout**:
        ```tsx
        <div className="flex w-full items-start gap-4 rounded-lg border p-4 shadow-lg bg-white dark:bg-gray-950">
          <div className="flex-shrink-0 text-{color}-500">
            {Icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-gray-50">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
          <button onClick={() => toast.dismiss(t)} className="text-gray-400 hover:text-gray-500">
            <XIcon />
          </button>
        </div>
        ```
- **Biến thể**:
    - `success`: CheckCircle2, Green-500
    - `info`: Info, Blue-500
    - `warning`: AlertTriangle, Yellow-500
    - `error`: XCircle, Red-500

### 2.2. Custom Dialog (Xác nhận/Phản hồi)
- **Đường dẫn**: `frontend/src/shared/ui/custom/dialog.tsx` (hoặc `confirmation-dialog.tsx`)
- **Thư viện**: `@radix-ui/react-dialog` (thông qua Shadcn `Dialog`)
- **Props**:
    - `open`: boolean
    - `onOpenChange`: (open: boolean) => void
    - `variant`: 'success' | 'info' | 'warning' | 'error'
    - `title`: string
    - `description`: string
    - `primaryAction`: { label: string, onClick: () => void, variant?: 'default' | 'destructive' }
    - `secondaryAction`: { label: string, onClick: () => void }
- **Layout**:
    - Nội dung căn giữa.
    - Icon với hiệu ứng gợn sóng/vòng tròn nền (Mẫu Nhấn mạnh Tín hiệu).
    - Tiêu đề và Mô tả căn giữa.
    - Nút hành động ở dưới cùng (toàn chiều rộng hoặc cạnh nhau).

### 2.3. Custom Input (Input có Icon)
- **Đường dẫn**: `frontend/src/shared/ui/custom/input-with-icon.tsx`
- **Cấu trúc**:
    - Wrapper `div` với định vị `relative`.
    - `Icon` (Lucide React) định vị `absolute left-3 top-1/2 -translate-y-1/2`.
    - `Input` (Shadcn) với `pl-10` (padding-left) để chứa icon.
- **Props**:
    - Kế thừa `InputHTMLAttributes`.
    - `icon`: LucideIcon
    - `iconProps`: LucideProps

### 2.4. Custom Password Input
- **Đường dẫn**: `frontend/src/shared/ui/custom/password-input.tsx`
- **Cấu trúc**:
    - Tương tự `InputWithIcon` nhưng dành riêng cho mật khẩu.
    - **Icon Trái**: Ổ khóa (mặc định) hoặc tùy chỉnh.
    - **Icon Phải**: Mắt / Mắt Gạch chéo (toggle hiển thị).
    - **Trạng thái**: `showPassword` (boolean).
- **Hành vi**:
    - Nhấn icon bên phải sẽ chuyển đổi `type` giữa "password" và "text".

## 3. Mô hình Dữ liệu
Không yêu cầu thay đổi cơ sở dữ liệu. Đây là các component thuần UI.

## 4. Thiết kế API
Không thay đổi API Backend.

## 5. Quyết định Thiết kế
- **Phân tách Mối quan tâm**: Các component tùy chỉnh được tách biệt khỏi thư viện UI cơ sở để cho phép cập nhật thư viện cơ sở dễ dàng mà không phá vỡ logic tùy chỉnh, và để giữ logic thương hiệu "tùy chỉnh" tập trung.
- **Tailwind CSS**: Sử dụng cho tất cả kiểu dáng để đảm bảo nhất quán với hệ thống thiết kế.
- **Composition**: Xây dựng dựa trên Shadcn/UI đảm bảo hỗ trợ khả năng truy cập và điều hướng bàn phím ngay lập tức.

## 6. Cân nhắc Bảo mật
- **Input Mật khẩu**: Đảm bảo tính năng "hiện mật khẩu" không vô tình lộ mật khẩu trong log hoặc trình đọc màn hình theo cách không an toàn (sử dụng chuẩn `type="text"`).
- **XSS**: Đảm bảo nội dung truyền vào toast/dialog được làm sạch nếu đến từ đầu vào người dùng (mặc dù chủ yếu sẽ là văn bản tĩnh từ ứng dụng).

## 7. Yêu cầu Phi chức năng
- **Phản hồi (Responsiveness)**: Component phải hiển thị tốt trên di động và máy tính để bàn.
- **Chế độ Tối (Dark Mode)**: Tất cả component phải hỗ trợ chế độ tối (sử dụng biến thể `dark:`).
