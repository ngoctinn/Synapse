---
title: Thiết Kế Tái Cấu Trúc Clean Code Frontend
status: Draft
priority: Medium
assignee: AI Agent
---

# Thiết Kế: Tái Cấu Trúc Clean Code Frontend

## 1. Thay Đổi Kiến Trúc
Chúng ta đang thực thi nghiêm ngặt mẫu **Public API** từ Feature-Sliced Design (FSD).
Mỗi module tính năng trong `src/features` phải có một file `index.ts` chỉ export các component, hook và tiện ích được dự định sử dụng bởi các phần khác của ứng dụng (ví dụ: `src/app` hoặc các tính năng khác).

### Trạng Thái Hiện Tại
- `src/features/staff`: Không có `index.ts`. Các consumer import từ `.../components/...`.
- `src/features/landing-page`: Không có `index.ts`.
- `src/features/admin`: Không có `index.ts`.

### Trạng Thái Mục Tiêu
- `src/features/staff/index.ts`: Export `StaffList`, `StaffModal`, v.v.
- `src/features/landing-page/index.ts`: Export `Hero`, `Features`, `Testimonials`, v.v.
- `src/features/admin/index.ts`: Export `AdminLayout`, `DashboardStats`, v.v.

## 2. Thiết Kế Component/Module

### Tính Năng Staff (`src/features/staff`)
**Exports:**
- `StaffTable` (Component chính cho danh sách nhân viên)
- `StaffModal` (Để thêm/sửa nhân viên)
- `useStaff` (Hook cho logic nhân viên, nếu có)
- Types: `Staff`, `Role`, v.v.

### Tính Năng Landing Page (`src/features/landing-page`)
**Exports:**
- `LandingPage` (Composition chính nếu tồn tại)
- Các phần riêng lẻ nếu được compose trong `page.tsx`: `HeroSection`, `FeatureSection`.

### Tính Năng Admin (`src/features/admin`)
**Exports:**
- `AdminSidebar`
- `AdminHeader`
- `AdminDashboard` (nếu được đóng gói)

## 3. Chiến Lược Tái Cấu Trúc
1.  **Phân Tích**: Liệt kê tất cả các file hiện đang import từ `src/features/X`.
2.  **Tạo**: Tạo `index.ts` trong `src/features/X` và thêm các export cần thiết.
3.  **Thay Thế**: Cập nhật import trong các file tiêu thụ để trỏ đến `@/features/X`.
    - *Trước*: `import { StaffTable } from "@/features/staff/components/staff-table"`
    - *Sau*: `import { StaffTable } from "@/features/staff"`

## 4. Bảo Mật & Hiệu Năng
- **Tree Shaking**: Đảm bảo các export trong `index.ts` không vô tình đóng gói mã server-only vào client bundle (mặc dù Next.js thường xử lý tốt việc này nếu các ranh giới được tôn trọng).
- **Phụ Thuộc Vòng**: Chú ý các vòng lặp khi tổng hợp các export.

## 5. Các Phương Án Thay Thế
- **Barrel Files cho mọi thứ**: Chúng ta có thể thêm `index.ts` vào mọi thư mục (components, hooks), nhưng điều đó có thể là quá mức cần thiết. Chúng ta sẽ tập trung vào **Ranh Giới Tính Năng** trước.
