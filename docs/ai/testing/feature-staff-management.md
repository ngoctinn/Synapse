---
title: Kiểm Thử Quản Lý Nhân Sự (Frontend)
description: Kịch bản kiểm thử giao diện và trải nghiệm người dùng.
status: Draft
---

# Kiểm Thử: Quản Lý Nhân Sự (Frontend Only)

## 1. Kiểm thử Giao diện (UI Testing)
- [ ] **Danh sách nhân viên**:
    - Kiểm tra hiển thị đúng Avatar, Tên, Email.
    - Badge vai trò có đúng màu quy định không? (Đỏ/Xanh/Tím).
    - Tags kỹ năng có hiển thị đẹp không?
- [ ] **Modal Thêm/Sửa**:
    - Mở modal có mượt không?
    - Chuyển tab Tài khoản/Hồ sơ có hoạt động không?
    - Form validation: Thử để trống trường bắt buộc -> Có hiện lỗi đỏ không?
- [ ] **Lịch làm việc**:
    - Lưới lịch có hiển thị đúng ngày trong tuần không?
    - Các ca làm việc có màu sắc phân biệt rõ không?

## 2. Kiểm thử Tương tác (Interaction Testing)
| ID | Kịch bản | Các bước | Kết quả mong đợi |
|---|---|---|---|
| INT-01 | Thêm nhân viên mới | 1. Click "Thêm nhân viên". <br> 2. Nhập thông tin hợp lệ. <br> 3. Click "Lưu". | Modal đóng. Toast thông báo thành công. Nhân viên mới hiện trong danh sách. |
| INT-02 | Xóa nhân viên | 1. Click menu 3 chấm -> Xóa. <br> 2. Xác nhận Dialog. | Nhân viên biến mất khỏi danh sách. Toast thông báo. |
| INT-03 | Phân quyền | 1. Chuyển sang tab Phân quyền. <br> 2. Tick vào ô quyền của Lễ tân. | Checkbox đổi trạng thái ngay lập tức. |
| INT-04 | Kéo thả lịch | 1. Chuyển sang tab Lịch. <br> 2. Kéo "Ca Sáng" thả vào ô Thứ 2 của NV A. | Ô đó hiển thị Ca Sáng. |

## 3. Kiểm thử Responsive
- [ ] **Tablet (iPad)**: Kiểm tra xem bảng có bị vỡ layout không? Sidebar lịch có bị che không?
- [ ] **Mobile**: (Nếu hỗ trợ) Kiểm tra xem Modal có full màn hình không?
