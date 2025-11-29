---
title: Kiểm thử Cập nhật Hồ sơ Người dùng
status: Draft
---

# Kiểm thử: Cập nhật Hồ sơ Người dùng

## 1. Kiểm thử Đơn vị
- Kiểm thử `AvatarSelector` hiển thị chính xác.
- Kiểm thử logic xác thực `ProfileForm`.

## 2. Các bước Kiểm thử Thủ công
1. Đăng nhập với tư cách người dùng.
2. Điều hướng đến trang Hồ sơ.
3. Nhấp vào "Đổi ảnh đại diện" (hoặc tương tự).
4. Chọn một hình đại diện mới từ danh sách. Xác minh bản xem trước cập nhật.
5. Điền vào Địa chỉ và Ngày sinh.
6. Nhấp Lưu.
7. Tải lại trang để xác minh dữ liệu đã được lưu.
8. Kiểm tra Cơ sở dữ liệu để đảm bảo các trường được lưu chính xác.
