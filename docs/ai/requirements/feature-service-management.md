---
title: Service Management Requirements
status: Draft
priority: High
assignee: AI
---

# Yêu cầu Tính năng: Quản lý Dịch vụ Spa

## 1. Tuyên bố Vấn đề
Hiện tại, hệ thống chưa có chức năng để Quản lý (Manager) định nghĩa các dịch vụ mà Spa cung cấp, cũng như các kỹ năng chuyên môn cần thiết cho từng dịch vụ. Điều này ngăn cản việc hiển thị danh mục dịch vụ cho khách hàng và tính toán khả năng đáp ứng của nhân viên.

## 2. Mục tiêu
- Cho phép Manager tạo, sửa, xóa, xem danh sách Dịch vụ (Services).
- Cho phép Manager tạo, sửa, xóa, xem danh sách Kỹ năng (Skills).
- Cho phép gán Kỹ năng yêu cầu cho từng Dịch vụ (Service-Skill Mapping).
- Đảm bảo dữ liệu chuẩn hóa để phục vụ cho tính năng Smart Booking sau này.

### Phi mục tiêu (Out of Scope)
- Chưa bao gồm logic Đặt lịch (Booking).
- Chưa bao gồm logic Gán kỹ năng cho Nhân viên (Employee Skills) - sẽ làm ở feature sau.

## 3. User Stories

### Quản lý Dịch vụ (Services)
- **US 1.1**: Là Manager, tôi muốn xem danh sách tất cả dịch vụ hiện có (tên, giá, thời gian) để nắm bắt danh mục sản phẩm.
- **US 1.2**: Là Manager, tôi muốn thêm một dịch vụ mới với các thông tin: Tên, Thời gian thực hiện (Duration), Thời gian nghỉ (Buffer Time), Giá tiền, Hình ảnh.
- **US 1.3**: Là Manager, tôi muốn cập nhật thông tin dịch vụ (ví dụ: thay đổi giá, sửa tên) để dữ liệu luôn đúng thực tế.
- **US 1.4**: Là Manager, tôi muốn ẩn/hiện (Active/Inactive) một dịch vụ thay vì xóa hẳn, để tạm ngưng phục vụ món đó.

### Quản lý Kỹ năng (Skills)
- **US 2.1**: Là Manager, tôi muốn định nghĩa danh sách các Kỹ năng (VD: Massage Body, Nặn mụn, Laser) để chuẩn hóa chuyên môn.
- **US 2.2**: Là Manager, tôi muốn gán một hoặc nhiều Kỹ năng cho một Dịch vụ (VD: Dịch vụ "Trị mụn chuyên sâu" cần kỹ năng "Nặn mụn" và "Chiếu đèn").

## 4. Tiêu chí Thành công (Success Criteria)
- Manager có thể thực hiện trọn vẹn luồng CRUD cho Service và Skill thông qua API/Giao diện.
- Dữ liệu được lưu trữ chính xác vào Database (PostgreSQL) với đúng quan hệ.
- API trả về đúng format JSON chuẩn.

## 5. Ràng buộc & Giả định
- **Ràng buộc**: Tên dịch vụ và Mã kỹ năng (Skill Code) không được trùng lặp.
- **Giả định**: Manager đã đăng nhập và có quyền `manager`.
