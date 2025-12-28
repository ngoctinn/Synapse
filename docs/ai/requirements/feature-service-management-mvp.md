---
phase: requirements
title: Hoàn thiện Nghiệp vụ Quản lý Dịch vụ (MVP)
description: Yêu cầu chi tiết cho quản lý dịch vụ, kỹ năng và tài nguyên giai đoạn MVP.
---

# Yêu cầu Tính năng: Quản lý Dịch vụ (MVP)

## Tuyên bố Vấn đề
Hiện tại, hệ thống Synapse đã có CRUD cơ bản cho dịch vụ nhưng chưa hỗ trợ đầy đủ việc cấu hình tài nguyên (phòng/máy) và chưa tối ưu hóa việc quản lý kỹ thuật viên (kỹ năng) để phục vụ cho Scheduling Engine. Ngoài ra, việc phân biệt giữa dịch vụ lẻ và gói liệu trình (Packages) cần được làm rõ để hỗ trợ nghiệp vụ bán hàng.

## Mục tiêu
- **Quản lý Tài nguyên:** Cho phép Admin gán yêu cầu tài nguyên (Resource Groups) cho từng dịch vụ để Scheduling Engine hoạt động chính xác.
- **Quản lý Kỹ năng (Manual Mapping):** Admin tự định nghĩa danh mục kỹ năng chuyên môn; hệ thống hỗ trợ gán các kỹ năng có sẵn này vào từng dịch vụ.
- **Dịch vụ & Gói liệu trình:** Phân biệt rõ ràng dịch vụ đơn lẻ và gói liệu trình nhiều buổi phục vụ bán hàng và quản lý buổi tập/liệu trình.
- **UX/UI Nhất quán:** Cung cấp giao diện quản lý tập trung, mượt mà theo chuẩn FSD và Premium UI.

## Phạm vi (Scope)
### Mục tiêu (In-Scope)
- Cập nhật Form Service để hỗ trợ gán **Resource Groups** (Phòng/Máy).
- Tích hợp logic xử lý **ServiceResourceRequirement** vào Backend.
- Bổ sung trường `is_package`, `total_sessions` vào Service model và UI.
- Đồng bộ hóa logic từ Backend xuống Frontend qua Server Actions.

### Phi mục tiêu (Out-of-Scope)
- Quản lý kho vật tư tiêu hao (Inventory).
- Hệ thống hoa hồng (Commission) chi tiết (để sau M5).
- Lịch sử thay đổi giá dịch vụ.

## Câu chuyện Người dùng (User Stories)
1. **Là một Admin**, tôi muốn gán nhóm tài nguyên "Giường đơn" cho dịch vụ "Massage Body" để hệ thống tự động tìm giường trống khi đặt lịch.
2. **Là một Admin**, tôi muốn định nghĩa "Liệu trình Triệt lông" gồm 10 buổi để khi khách mua, hệ thống tự động tạo 10 buổi liệu trình.
3. **Là một Admin**, tôi muốn chọn các kỹ năng chuyên môn (đã định nghĩa trước) cho dịch vụ để hệ thống biết kỹ thuật viên nào có thể thực hiện.

## Tiêu chí Thành công
- Admin có thể tạo một dịch vụ yêu cầu cụ thể các nhóm tài nguyên (phòng/máy).
- Hệ thống hỗ trợ gán kỹ năng hiện có vào dịch vụ mà không tự động tạo kỹ năng mới lạ.
- Dịch vụ dạng gói hiển thị đúng số lượng buổi và logic trừ buổi hoạt động chính xác.
- Dữ liệu `services`, `service_resource_requirements`, và `service_skills` được lưu trữ nhất quán.

## Ràng buộc & Giả định
- **Ràng buộc Kỹ thuật:** Phải sử dụng `shared/ui` và không sử dụng Tailwind trực tiếp ngoài `shared/ui`.
- **Ràng buộc Dữ liệu:** `duration` và `buffer_time` nên là bội số của 5 phút để tối ưu hóa việc chia slot lịch hẹn.
- **Giả định:** Scheduling Engine sẽ sử dụng dữ liệu từ `service_resource_requirements` để tính toán tài nguyên thực tế.

## Trường hợp biên (Edge Cases)
- **Xóa Tài nguyên:** Nếu một `ResourceGroup` bị xóa, hệ thống phải cảnh báo hoặc ngăn chặn nếu đang có dịch vụ liên kết.
- **Chuyển đổi loại dịch vụ:** Khi chuyển dịch vụ từ "lẻ" sang "gói", cần xử lý rõ ràng các khách hàng đang có lịch hẹn hiện tại.
- **Xung đột Kỹ năng:** Một kỹ thuật viên có nhiều kỹ năng cần được ưu tiên sắp xếp phù hợp.

## Câu hỏi Mở
- Một dịch vụ có thể yêu cầu nhiều nhóm tài nguyên cùng lúc không? (Giả định: Có).
- Có cần thiết lập mức độ ưu tiên cho các Kỹ năng của dịch vụ không? (Hiện tại: Coi các kỹ năng là bắt buộc như nhau).
