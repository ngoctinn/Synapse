---
title: Quản lý Dịch vụ & Kỹ năng
status: Draft
---

# Yêu cầu: Quản lý Dịch vụ & Kỹ năng

## 1. Tuyên bố Vấn đề
Hệ thống hiện tại chưa có chức năng quản lý danh mục dịch vụ, định nghĩa kỹ năng nhân viên và cấu hình thời gian thực hiện. Điều này gây khó khăn cho việc:
-   Xếp lịch hẹn chính xác (thiếu thông tin thời gian làm và thời gian nghỉ/dọn dẹp).
-   Phân công nhân viên phù hợp (không biết ai làm được dịch vụ gì).
-   Tính toán doanh thu và hoa hồng sau này.

## 2. Mục tiêu
-   Xây dựng hệ thống quản lý Dịch vụ (Services) và Kỹ năng (Skills) linh hoạt.
-   Hỗ trợ mô hình "Skill-based Assignment": Dịch vụ yêu cầu kỹ năng -> Nhân viên có kỹ năng tương ứng mới được làm.
-   Quản lý thời gian chính xác: Bao gồm thời gian thực hiện (Duration) và thời gian dọn dẹp (Buffer Time).
-   UX tối ưu cho Admin: Thao tác nhanh, trực quan (Smart Tagging, Skill Matrix).

## 3. User Stories
### Admin / Quản lý
-   **Tạo Dịch vụ:** Tôi muốn tạo dịch vụ mới với tên, giá, thời lượng và *thời gian nghỉ (buffer)*. Buffer time được hiểu là thời gian nghỉ *sau* khi làm xong dịch vụ.
-   **Gán Kỹ năng cho Dịch vụ:** Tôi muốn quy định dịch vụ này yêu cầu những kỹ năng gì (Smart Tagging). Hệ thống phải tự động ngăn chặn trùng lặp (VD: "Massage" và "massage").
-   **Quản lý Kỹ năng Nhân viên:** Tôi muốn gán kỹ năng cho nhân viên theo dạng bảng ma trận (Matrix View) có hỗ trợ lọc/phân trang để dễ nhìn.
-   **Sao chép Dịch vụ:** Tôi muốn nhân bản một dịch vụ có sẵn.
-   **Xóa Kỹ năng:** Tôi muốn xóa kỹ năng nhưng không làm hỏng các dịch vụ cũ (Soft Delete).

### Khách hàng (Tương lai)
-   **Đặt lịch:** Hệ thống tính toán slot trống dựa trên (Duration + Buffer Time). Dữ liệu lịch hẹn phải lưu snapshot giá/thời gian tại thời điểm đặt.

## 4. Yêu cầu Phi chức năng
-   **Hiệu năng:** Tìm kiếm KTV < 200ms.
-   **Dữ liệu:** Chuẩn hóa tên kỹ năng (lowercase, trim) để tránh trùng lặp.

## 5. Ràng buộc & Giả định
-   Buffer Time là Post-service Buffer (Nghỉ sau khi làm).
-   Xóa Kỹ năng/Dịch vụ chỉ là Soft Delete (`is_active: false`).
-   Lịch hẹn (Booking) trong tương lai sẽ lưu snapshot dữ liệu dịch vụ, không tham chiếu trực tiếp.
