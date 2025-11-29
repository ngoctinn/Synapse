---
title: Cập nhật Hồ sơ Người dùng
status: Draft
priority: High
assignee: AI
---

# Tính năng: Cập nhật Hồ sơ Người dùng

## 1. Tuyên bố Vấn đề
Người dùng cần một cách để cập nhật thông tin cá nhân (Tên, Số điện thoại, Địa chỉ, Ngày sinh) và cá nhân hóa hồ sơ của họ bằng hình đại diện để thiết lập danh tính tốt hơn trong hệ thống. Hiện tại, biểu mẫu hồ sơ còn hạn chế và thiếu khả năng chọn hình đại diện.

## 2. Mục tiêu & Phi mục tiêu
### Mục tiêu
- Cho phép người dùng cập nhật Họ và tên, Số điện thoại, Địa chỉ và Ngày sinh.
- Cung cấp cơ chế chọn hình đại diện từ danh sách định sẵn (DiceBear API).
- Lưu tất cả thay đổi vào cơ sở dữ liệu Supabase.
- Sử dụng các thành phần giao diện tùy chỉnh hiện có để đảm bảo tính nhất quán.

### Phi mục tiêu
- Tải lên tệp hình ảnh tùy chỉnh cho hình đại diện (hoãn lại cho phiên bản sau).
- Thay đổi địa chỉ email (chỉ đọc).

## 3. Câu chuyện Người dùng
- **US1**: Là người dùng, tôi muốn xem thông tin hồ sơ hiện tại của mình để biết những gì đang được lưu trữ.
- **US2**: Là người dùng, tôi muốn cập nhật Họ và tên, Số điện thoại, Địa chỉ và Ngày sinh của mình.
- **US3**: Là người dùng, tôi muốn chọn một hình đại diện từ danh sách các tùy chọn được tạo sẵn để tôi có thể cá nhân hóa hồ sơ của mình mà không cần tải ảnh lên.
- **US4**: Là người dùng, tôi muốn thấy lỗi xác thực nếu tôi nhập dữ liệu không hợp lệ (ví dụ: định dạng số điện thoại sai).

## 4. Tiêu chí Thành công
- Người dùng có thể cập nhật thành công tất cả các trường hồ sơ.
- Hình đại diện đã chọn được lưu và hiển thị trên toàn bộ ứng dụng.
- Địa chỉ và Ngày sinh được lưu trữ chính xác trong cơ sở dữ liệu.
- Giao diện người dùng phù hợp với hệ thống thiết kế của dự án sử dụng `shared/ui/custom`.

## 5. Ràng buộc & Giả định
- **Ràng buộc**: Phải sử dụng DiceBear API cho hình đại diện. Phải sử dụng Supabase để lưu trữ.
- **Giả định**: Bảng `users` trong Supabase có thể được mở rộng hoặc đã có các trường cho địa chỉ và ngày sinh (cần xác minh).
