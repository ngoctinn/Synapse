---
phase: implementation
title: Hướng dẫn Triển khai - Services Module Standardization
description: Quy chuẩn triển khai mã nguồn cho module Services đảm bảo sạch và dễ bảo trì.
---

# Hướng dẫn Triển khai

## Cấu trúc Mã
**Mã được tổ chức như thế nào?**

- `services/components/*`: Tách biệt Table, Form, Sheet và các Triggers.
- `services/actions.ts`: Chứa toàn bộ logic gọi API và revalidation.
- `services/model/schemas.ts`: Chứa Zod schemas dùng cho cả Client và Server validation.

## Ghi chú Triển khai
**Các chi tiết kỹ thuật chính cần nhớ:**

### Tính năng Cốt lõi
- **Standard Table:** Luôn truyền `variant="flush"` khi dùng trong Page.
- **Smart Tagging:** Logic tạo Skill tự động phải được bọc trong giao dịch (transaction) ở Backend.

### Các Mẫu & Thực hành Tốt nhất
- Sử dụng `useActionState` từ React 19 để quản lý trạng thái form.
- Luôn truyền `availableServices` (ở Packages) hoặc `skills` (ở Services) từ Server component xuống để tối ưu SEO và tốc độ tải.

## Xử lý Lỗi
**Chúng ta xử lý thất bại như thế nào?**

- Dùng `toast` để hiển thị lỗi từ Server Actions.
- Bắt lỗi runtime bằng `ErrorBoundary` hoặc kiểm tra điều kiện an toàn (`if (!data)`) trong component.

## Cân nhắc Hiệu suất
**Làm thế nào để giữ cho nó nhanh?**

- Tận dụng `Suspense` và streaming cho các bảng dữ liệu lớn.
- Debounce input tìm kiếm ít nhất 300ms.
