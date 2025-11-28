---
title: Triển Khai Quản Lý Nhân Sự (Frontend)
description: Chi tiết các file và components cần triển khai.
status: Draft
---

# Triển Khai: Quản Lý Nhân Sự (Frontend Only)

## 1. Cấu trúc Thư mục & Files
Tạo mới thư mục `src/features/staff` với cấu trúc sau:

```
src/features/staff/
├── components/
│   ├── staff-list/
│   │   ├── staff-table.tsx       # Bảng danh sách nhân viên
│   │   ├── staff-modal.tsx       # Modal Thêm/Sửa
│   │   ├── staff-actions.tsx     # Dropdown menu hành động
│   │   └── columns.tsx           # Định nghĩa cột cho DataTable
│   ├── permissions/
│   │   └── permission-matrix.tsx # Bảng phân quyền
│   ├── scheduling/
│   │   ├── staff-scheduler.tsx   # Component lịch chính
│   │   ├── shift-card.tsx        # Card ca làm việc (Draggable)
│   │   └── schedule-grid.tsx     # Lưới lịch
│   └── staff-tabs.tsx            # Component chứa Tabs chính
├── data/
│   ├── mock-staff.ts             # Dữ liệu giả nhân viên
│   ├── mock-permissions.ts       # Dữ liệu giả quyền
│   └── mock-schedules.ts         # Dữ liệu giả lịch
├── types.ts                      # Interfaces (Staff, Role, Shift...)
└── page.tsx                      # Trang chính (Export ra ngoài)
```

## 2. Chi tiết Triển khai

### A. Dữ liệu Giả (Mock Data)
- `mock-staff.ts`: Tạo mảng `Staff[]` với khoảng 10 user. Đủ các role: Admin, Lễ tân, KTV. KTV cần có mảng `skills`.
- `mock-schedules.ts`: Tạo lịch cho tuần hiện tại.

### B. Tab 1: Danh sách Nhân viên
- Sử dụng `shadcn/ui/table` hoặc `tanstack/react-table` (nếu cần sort/filter phức tạp).
- **StaffModal**:
    - Dùng `Dialog` component.
    - Form dùng `react-hook-form` + `zod`.
    - Tabs trong modal dùng `Tabs` component.

### C. Tab 2: Phân quyền
- Tạo bảng HTML đơn giản hoặc Grid.
- State quản lý: `Record<RoleId, Record<ModuleId, boolean>>`.

### D. Tab 3: Lịch làm việc
- Layout: Flexbox. Bên trái `w-64` (Sidebar), bên phải `flex-1` (Grid).
- **Drag & Drop**:
    - Có thể dùng HTML5 native API `draggable` và `onDrop` cho đơn giản và nhẹ.
    - Hoặc `dnd-kit` nếu muốn animation mượt mà.

## 3. Lưu ý Quan trọng
- **Không gọi API**: Tất cả hành động Thêm/Sửa/Xóa chỉ cập nhật vào State cục bộ (React State) hoặc Mock Store tạm thời.
- **UX**: Chú trọng vào spacing, màu sắc badge, và phản hồi khi tương tác.
