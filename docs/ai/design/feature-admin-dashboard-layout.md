---
phase: design
title: Thiết kế Admin Dashboard Layout
description: Kiến trúc và UI/UX cho trang quản trị
---

# Thiết kế Hệ thống & Kiến trúc

## Tổng quan Kiến trúc
**Cấu trúc hệ thống cấp cao là gì?**

Sử dụng Route Group `(admin)` để tách biệt hoàn toàn với `(dashboard)` của khách hàng và `(auth)`.

```
src/app/
├── (admin)/
│   ├── layout.tsx       # Admin Layout (Sidebar + Header)
│   ├── page.tsx         # Redirect to /admin/overview
│   └── admin/
│       ├── overview/    # Dashboard Home
│       ├── calendar/
│       └── ...
```

## Phân rã Thành phần
**Các khối xây dựng chính là gì?**

1.  **`AdminLayout` (`src/app/(admin)/layout.tsx`)**:
    - Quản lý cấu trúc chung: Sidebar bên trái (cố định), Header bên trên, Main Content ở giữa.
    - Sử dụng `grid` hoặc `flex` layout.

2.  **`AdminSidebar` (`src/features/admin/components/sidebar.tsx`)**:
    - Chứa Logo "Medico" (hoặc Synapse).
    - Menu điều hướng: Overview, Calendar, Appointments, Patients...
    - Style: Nền trắng hoặc xám nhạt, active state nổi bật (màu xanh brand).

3.  **`AdminHeader` (`src/features/admin/components/header.tsx`)**:
    - Lời chào: "Welcome, Dr. [Name]!"
    - Search bar (icon search).
    - Notification bell.
    - User Profile Dropdown.

4.  **`StatCard` (`src/features/admin/components/stat-card.tsx`)**:
    - Component hiển thị chỉ số (như hình: Online Consultations, Total Patients...).

## Các Quyết định Thiết kế
**Tại sao chúng ta chọn cách tiếp cận này?**

- **Tách biệt Route Group**: Đảm bảo Admin và Customer không dùng chung Layout, dễ dàng quản lý quyền truy cập (Middleware) và style riêng biệt.
- **Sidebar cố định**: Phù hợp với các ứng dụng quản trị nhiều chức năng, giúp truy cập nhanh.

## Yêu cầu Phi chức năng
**Hệ thống nên hoạt động như thế nào?**

- **Responsive**: Trên mobile, Sidebar chuyển thành Drawer (Hamburger menu).
- **Thẩm mỹ**: Sử dụng nhiều khoảng trắng (whitespace), bo góc mềm mại (rounded-xl), đổ bóng nhẹ (shadow-sm) để tạo cảm giác hiện đại.
