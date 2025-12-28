---
phase: design
title: Thiết kế Hệ thống - Module Services Standardization
description: Xác định cấu trúc component, luồng dữ liệu và tích hợp API cho module Services.
---

# Thiết kế Hệ thống & Kiến trúc

## Tổng quan Kiến trúc
**Cấu trúc hệ thống cấp cao là gì?**

- Đồng bộ hóa cấu trúc FSD cho cả Services và Packages.
- Sử dụng Common Actions pattern cho các thao tác CRUD.
  ```mermaid
  graph TD
    UI[ServicesPage/PackagesPage] -->|useActionState| Actions[Server Actions]
    Actions -->|fetchWithAuth| Backend[FastAPI API]
    Backend -->|SQLModel| DB[(PostgreSQL)]
  ```

## Mô hình Dữ liệu
**Chúng ta cần quản lý dữ liệu gì?**

- **Service:** metadata, price, duration, category_id, skill_ids.
- **Package:** name, total_price, services_list (id, quantity), validity.
- **ServiceCategory & Skill:** Metadata hỗ trợ tagging.

## Thiết kế API
**Các thành phần giao tiếp như thế nào?**

- Chuẩn hóa Response format `{ status, data, message }` thông qua `ActionResponse`.
- Đảm bảo các GET endpoints luôn hỗ trợ phân trang chuẩn `{ data, total, page, limit }`.

## Phân rã Thành phần
**Các khối xây dựng chính là gì?**

- `ServiceTable`, `PackageTable`: Shared logic thông qua `DataTable`.
- `ServiceSheet`, `PackageSheet`: Sử dụng `useActionState` và Zod schemas chung.
- `ServiceForm`, `PackageForm`: Tách nhỏ các tabs (Basic, Resources, Details).

## Các Quyết định Thiết kế
**Tại sao chúng ta chọn cách tiếp cận này?**

- Sử dụng `Suspense` và `use(promise)` để tối ưu UX khi tải dữ liệu trang Dashboard.
- Tận dụng `revalidatePath` để cập nhật UI ngay lập tức sau khi mutation thành công.

## Yêu cầu Phi chức năng
**Hệ thống nên hoạt động như thế nào?**

- Tốc độ phản hồi dưới 200ms cho các thao tác tìm kiếm/lọc (Client-side debouncing).
- Hỗ trợ đầy đủ Accessibility (Aria labels cho Tabs, Modals).
