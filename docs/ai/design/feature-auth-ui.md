---
phase: design
title: Thiết kế Hệ thống & Kiến trúc
description: Xác định kiến trúc kỹ thuật, các thành phần và mô hình dữ liệu
---

# Thiết kế Hệ thống & Kiến trúc

## Tổng quan Kiến trúc
**Cấu trúc hệ thống cấp cao là gì?**

- **Luồng dữ liệu**:
  ```mermaid
  graph TD
    User[Người dùng] -->|Nhập liệu| Client[Next.js Client Component]
    Client -->|Form Submission| ServerAction[Next.js Server Action]
    ServerAction -->|API Call| Backend[FastAPI Backend]
    Backend -->|Query/Update| DB[(PostgreSQL)]
  ```
- **Thành phần chính**:
    - **Frontend**: Next.js 15 (App Router), React Hook Form, Zod, Shadcn/UI.
    - **BFF (Backend for Frontend)**: Server Actions để xử lý logic trung gian, bảo mật và gọi API.
    - **Backend**: FastAPI xử lý nghiệp vụ xác thực (đã có hoặc sẽ tích hợp).

## Mô hình Dữ liệu
**Chúng ta cần quản lý dữ liệu gì?**

- **User Entity** (tham chiếu):
    - `email`: String (Unique)
    - `password_hash`: String
    - `full_name`: String
    - `role`: Enum (CUSTOMER, RECEPTIONIST, TECHNICIAN, ADMIN)
    - `status`: Enum (ACTIVE, INACTIVE)

## Thiết kế API
**Các thành phần giao tiếp như thế nào?**

- **API Endpoints** (Dự kiến từ Backend):
    - `POST /api/v1/auth/login`: Đăng nhập.
    - `POST /api/v1/auth/register`: Đăng ký.
    - `POST /api/v1/auth/forgot-password`: Yêu cầu đặt lại mật khẩu.
    - `POST /api/v1/auth/reset-password`: Đặt lại mật khẩu mới.

- **Server Actions** (Frontend):
    - `loginAction(formData)`
    - `registerAction(formData)`
    - `forgotPasswordAction(formData)`
    - `updatePasswordAction(formData)`

## Phân rã Thành phần
**Các khối xây dựng chính là gì?**

- **Layout**:
    - `AuthLayout`: Layout chung cho các trang xác thực (Logo, Background, Footer).
- **Pages**:
    - `/login`: Trang đăng nhập.
    - `/register`: Trang đăng ký.
    - `/forgot-password`: Trang quên mật khẩu.
    - `/update-password`: Trang cập nhật mật khẩu.
- **Components**:
    - `LoginForm`: Form đăng nhập.
    - `RegisterForm`: Form đăng ký.
    - `ForgotPasswordForm`: Form quên mật khẩu.
    - `UpdatePasswordForm`: Form cập nhật mật khẩu.
    - `AuthHeader`: Tiêu đề và mô tả cho từng trang.
    - `SocialAuth`: Các nút đăng nhập xã hội (placeholder cho giai đoạn sau).

## Các Quyết định Thiết kế
**Tại sao chúng ta chọn cách tiếp cận này?**

- **React Hook Form + Zod**: Quản lý form state hiệu quả, validation mạnh mẽ và dễ dàng tích hợp với UI.
- **Server Actions**: Tận dụng khả năng của Next.js 15 để xử lý logic phía server, giấu kín API endpoint thực tế và token (nếu cần).
- **Shadcn/UI**: Đảm bảo tính nhất quán về thiết kế và dễ dàng tùy biến.

## Yêu cầu Phi chức năng
**Hệ thống nên hoạt động như thế nào?**

- **Hiệu suất**: Tải trang dưới 1s (FCP).
- **Bảo mật**: Validation chặt chẽ ở cả Client và Server. Mật khẩu phải có độ mạnh nhất định.
- **Trải nghiệm**: Hiển thị thông báo lỗi rõ ràng, thân thiện. Có trạng thái loading khi đang xử lý.
