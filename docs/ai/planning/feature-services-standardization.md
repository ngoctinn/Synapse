---
phase: planning
title: Kế hoạch Triển khai - Services Module Standardization
description: Các giai đoạn thực hiện audit, refactor và testing cho module Services.
---

# Lập kế hoạch Dự án & Phân rã Nhiệm vụ

## Các Mốc quan trọng
**Các điểm kiểm tra chính là gì?**

- [ ] Mốc 1: Hoàn thành Audit toàn diện và chuẩn hóa UI/UX các Bảng dữ liệu.
- [ ] Mốc 2: Đồng bộ hóa logic Form và Server Actions cho Services & Packages.
- [ ] Mốc 3: Hoàn thành bộ Test suite và xác nhiệm 100% tiêu chí thành công.

## Phân rã Nhiệm vụ
**Công việc cụ thể nào cần được thực hiện?**

### Giai đoạn 1: Tailwind Refactor & UI Consistency (Ưu tiên cao)
- [ ] Nhiệm vụ 1.1: Loại bỏ toàn bộ `className` chứa Tailwind trực tiếp trong các component thuộc `features/services`.
  - Thay thế layout bằng `Stack`, `Box`, `Grid` từ `shared/ui/layout`.
  - Thay thế typography bằng props của component hoặc `Typography` component (nếu có).
- [ ] Nhiệm vụ 1.2: Triệt tiêu "Arbitrary Values" (giá trị tùy ý).
  - Thay thế `h-[30rem]` bằng các kích thước chuẩn hoặc truyền qua props `style` (nếu thực sự cần kích thước động).
  - Thay thế `text-[11px]` bằng các font-size tokens chuẩn.
- [ ] Nhiệm vụ 1.3: Chuẩn hóa `ServiceTable` và `PackageTable` sử dụng cùng một phiên bản `DataTable` nâng cao.
- [ ] Nhiệm vụ 1.4: Fix lỗi hiển thị Empty State và Loading state theo design system.

### Giai đoạn 2: Logic & Data Integration
- [ ] Nhiệm vụ 2.1: Đồng bộ hóa schema Pydantic (Backend) và Zod/TS (Frontend) cho module Packages.
- [ ] Nhiệm vụ 2.2: Refactor `ServiceSheet` và `PackageSheet` để tách biệt logic Validation và UI.
- [ ] Nhiệm vụ 2.3: Chuyển đổi toàn bộ Dialog/Sheet sang sử dụng shared components từ `shared/ui/custom`.

### Giai đoạn 3: Testing & Localization
- [ ] Nhiệm vụ 3.1: Viết test cho luồng "Tạo Service -> Tạo Package từ Service đó".
- [ ] Nhiệm vụ 3.2: Kiểm tra và sửa lỗi dịch thuật (Vietnamese) trong toàn bộ module.
- [ ] Nhiệm vụ 3.3: Chạy `mcp:next-devtools` để xác nhận không còn lỗi hydration hoặc layout shift.

## Các Phụ thuộc
**Cái gì cần xảy ra theo thứ tự nào?**

- Backend schema cho Packages phải được cập nhật xong (Mốc 1).
- DataTable component phải hỗ trợ đầy đủ các props cần thiết trước khi refactor hàng loạt.

## Rủi ro & Giảm thiểu
**Điều gì có thể đi sai hướng?**

- Phá vỡ các liên kết cũ trong Database khi thay đổi Schema (Giảm thiểu: Sử dụng Migrations thận trọng).
- Xung đột logic giữa Client-side state và Server-side cache (Giảm thiểu: Sử dụng `revalidatePath` và `router.refresh`).
