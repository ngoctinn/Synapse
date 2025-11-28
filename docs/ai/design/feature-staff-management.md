---
title: Thiết Kế Giao Diện Quản Lý Nhân Sự
description: Thiết kế chi tiết UI/UX cho module Quản Lý Nhân Sự (Frontend Only).
status: Draft
---

# Thiết Kế: Quản Lý Nhân Sự (Staff Management)

## 1. Kiến trúc Frontend (Feature-Sliced Design)
- **Path**: `src/features/staff`
- **Cấu trúc**:
    - `components/`: Chứa các UI components (Bảng, Modal, Lịch).
    - `data/`: Chứa Mock Data (Danh sách nhân viên, Lịch mẫu).
    - `types.ts`: Định nghĩa TypeScript Interfaces.

## 2. Thiết kế Component Chi tiết

### TAB 1: Danh Sách & Hồ Sơ (Staff Directory)
- **Component chính**: `StaffList`
- **UI Elements**:
    - **DataTable**: Sử dụng `shadcn/ui/table`.
        - *Cột Nhân viên*: Avatar + Tên (Bold) + Email (Gray text nhỏ dưới tên).
        - *Cột Vai trò*: Badge màu (Admin: `destructive`, Lễ tân: `default` (blue), KTV: `secondary` (purple)).
        - *Cột Kỹ năng*: Flex wrap các Badge nhỏ.
            - **Cải tiến**: Hiển thị tối đa 2 kỹ năng, còn lại hiện "+X more". Hover vào số này sẽ hiện **Tooltip** chứa danh sách đầy đủ.
        - *Cột Trạng thái*: Switch (Toggle).
            - **An toàn**: Khi tắt (Inactive), hiển thị **Pop-confirm** hoặc chuyển hành động này vào Dropdown Menu để tránh bấm nhầm.
        - *Actions*: Dropdown menu (Sửa, Đổi mật khẩu, Xóa).
    - **StaffModal** (Dialog):
        - Header: "Thêm nhân viên mới" / "Cập nhật hồ sơ".
        - **Tabs**:
            - `Tab 1: Tài khoản`: Email, Mật khẩu, Vai trò (Select).
            - `Tab 2: Hồ sơ`: SĐT, Địa chỉ, Avatar Upload (UI giả).
            - *Kỹ năng*: Multi-select combobox (chỉ hiện cho KTV).
                - **Cải tiến**: Thêm nút "Chọn tất cả" hoặc nhóm kỹ năng (Facial, Body...) để thao tác nhanh.

### TAB 2: Phân Quyền (RBAC Matrix)
- **Component chính**: `PermissionMatrix`
- **UI Elements**:
    - **Table**: Rows = Modules, Cols = Roles, Cells = Checkboxes.
    - **Interaction (Bulk Save)**:
        - Thay vì lưu ngay (Optimistic UI), cho phép tick chọn nhiều ô.
        - Hiển thị thanh thông báo nổi (Floating Bar) phía dưới: "Bạn đã thay đổi X quyền" kèm nút **[Lưu thay đổi]** và **[Hoàn tác]**.
        - Giúp tránh rủi ro cấp/thu hồi quyền nhầm lẫn.

### TAB 3: Lịch Làm Việc (Scheduling)
- **Component chính**: `StaffScheduler`
- **Thư viện**: Custom Grid kết hợp **@dnd-kit/core** (nhẹ, modern, accessibility tốt).
- **UI Layout**:
    - **Sidebar (Trái)**:
        - Danh sách "Ca mẫu" (Sáng, Chiều, Tối).
        - **Mới**: Item "Nghỉ phép" (Màu xám/gạch chéo) để chặn đặt lịch.
    - **Main View (Phải)**: Lưới Lịch Tuần (Custom Grid).
    - **Toolbar**: Thêm nút **"Sao chép tuần trước"** (Copy previous week) để tiết kiệm thao tác.
- **Interaction**:
    - Kéo thả mượt mà dùng `dnd-kit`.
    - Click vào Ca đã gán -> Popover (Sửa giờ, Xóa).

## 3. Mô hình Dữ liệu (Frontend Types)
```typescript
type Role = 'ADMIN' | 'RECEPTIONIST' | 'TECHNICIAN';

interface Staff {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  skills: string[]; // VD: ['Facial', 'Massage']
  isActive: boolean;
  phone?: string;
  serviceIds?: string[]; // Ánh xạ ID dịch vụ để query nhanh
}

interface Shift {
  id: string;
  name: string; // "Ca Sáng", "Nghỉ phép"
  color: string; // Hex code
  startTime: string; // "08:00"
  endTime: string; // "12:00"
  type: 'WORK' | 'OFF'; // Phân loại
}

interface Schedule {
  staffId: string;
  date: string; // ISO Date
  shiftId: string;
  status: 'PUBLISHED' | 'DRAFT'; // Hỗ trợ quy trình duyệt/nháp
}
```

## 4. Trải nghiệm người dùng (UX Polish)
- **Empty States**: Khi chưa có nhân viên, hiển thị hình minh họa đẹp và nút "Thêm ngay".
- **Loading States**: Skeleton loading khi chuyển tab.
- **Toast**: Thông báo "Đã lưu thay đổi" góc phải dưới.
- **Confirm Delete**:
    - Kiểm tra lịch hẹn tương lai.
    - Nếu có lịch hẹn, hiện Dialog cảnh báo và gợi ý: **"Chuyển lịch hẹn sang nhân viên khác"**.
