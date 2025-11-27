---
phase: design
title: Thiết kế Hệ thống & Kiến trúc - Project Foundation
description: Xác định kiến trúc kỹ thuật, các thành phần và mô hình dữ liệu cho Project Foundation
---

# Thiết kế Hệ thống & Kiến trúc

## Tổng quan Kiến trúc
**Cấu trúc hệ thống cấp cao là gì?**

- **Mô hình**: Modular Monolith (Backend) + Vertical Slice Architecture.
- **Frontend**: Next.js 15 (App Router) đóng vai trò là Client & BFF (Backend-for-Frontend).
- **Backend**: FastAPI xử lý nghiệp vụ cốt lõi và API.
- **Database**: PostgreSQL (Supabase).

```mermaid
graph TD
  User[User / Browser] -->|HTTPS| NextJS[Next.js 15 (Frontend + BFF)]
  NextJS -->|Server Actions / Fetch| FastAPI[FastAPI (Backend)]
  FastAPI -->|SQLModel| DB[(Supabase PostgreSQL)]
  NextJS -->|Auth SDK| SupabaseAuth[Supabase Auth]
  FastAPI -->|Auth Middleware| SupabaseAuth
```

## Mô hình Dữ liệu
**Chúng ta cần quản lý dữ liệu gì?**

- Giai đoạn này chưa định nghĩa các thực thể nghiệp vụ (Booking, Customer...).
- Chỉ thiết lập kết nối Database và cấu hình Alembic để sẵn sàng migration.

## Thiết kế API
**Các thành phần giao tiếp như thế nào?**

- **Giao thức**: RESTful API (JSON).
- **Authentication**: Bearer Token (JWT từ Supabase).
- **Cấu trúc URL**: `/api/v1/{module}/{resource}`.
- **Health Check**: `GET /api/health` -> `{"status": "ok"}`.

## Phân rã Thành phần
**Các khối xây dựng chính là gì?**

- **Frontend (`/frontend`)**:
    - `src/app`: App Router.
    - `src/shared`: UI components (Shadcn), utils.
    - `src/features`: Cấu trúc feature-sliced (sẽ thêm sau).
- **Backend (`/backend`)**:
    - `src/app`: Main entry, config.
    - `src/common`: DB session, Security.
    - `src/modules`: Các module nghiệp vụ (sẽ thêm sau).
    - `alembic`: DB Migrations.

## Các Quyết định Thiết kế
**Tại sao chúng ta chọn cách tiếp cận này?**

- **FastAPI + Async**: Hiệu năng cao, phù hợp với I/O bound.
- **Next.js 15**: Tận dụng Server Components và Server Actions để đơn giản hóa việc gọi API.
- **Supabase**: Giảm tải việc quản lý Auth và DB hạ tầng.
- **Monorepo**: Dễ quản lý code, chia sẻ type (nếu cần) và deploy thống nhất.

## Yêu cầu Phi chức năng
**Hệ thống nên hoạt động như thế nào?**

- **Bảo mật**: Không lưu secret trong code (dùng `.env`).
- **Khả năng mở rộng**: Cấu trúc Modular cho phép tách Microservices sau này nếu cần.
- **Chuẩn hóa**: Sử dụng `ruff` (Python) và `eslint/prettier` (JS) ngay từ đầu.
