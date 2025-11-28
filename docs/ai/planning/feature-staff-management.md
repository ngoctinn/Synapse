---
title: Kế Hoạch Triển Khai Quản Lý Nhân Sự (Frontend)
description: Lộ trình xây dựng giao diện Quản Lý Nhân Sự.
status: Draft
    - Logic hiển thị field "Kỹ năng" động theo vai trò.
- [ ] Implement `StaffActions`: Dropdown menu (Sửa, Xóa).

### Giai đoạn 3: Tab 2 - Phân quyền
- [x] Implement `PermissionMatrix`: Bảng checkbox phân quyền.
- [x] Implement `BulkSaveBar`: Thanh thông báo nổi "Đã thay đổi X quyền" + Nút Lưu/Hoàn tác.
- [x] Xử lý Logic "Draft State" cho phân quyền trước khi commit.

### Giai đoạn 4: Tab 3 - Lịch làm việc (Phức tạp nhất)
- [x] Setup thư viện `@dnd-kit/core` (Context, Sensors).
- [x] Xây dựng Layout: Sidebar (Ca mẫu + Nghỉ phép) + Main Grid (Lịch).

## 3. Rủi ro & Giải pháp
- **Hiệu năng Render Lịch**: Nếu danh sách nhân viên quá dài, lưới lịch sẽ rất nặng.
    - *Giải pháp*: Chỉ render 1 tuần, phân trang nhân viên nếu cần (hoặc scroll ảo).
- **Phức tạp Kéo thả**: Dùng thư viện `dnd-kit` hoặc `react-dnd` có thể phức tạp.
    - *Giải pháp*: Dùng API HTML5 Drag & Drop đơn giản hoặc thư viện nhẹ nhàng `dnd-kit` nếu cần mobile support tốt.
