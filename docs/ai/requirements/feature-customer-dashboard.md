---
phase: requirements
title: Yêu cầu & Hiểu biết Vấn đề - Customer Dashboard
description: Làm rõ không gian vấn đề, thu thập yêu cầu và xác định tiêu chí thành công cho Customer Dashboard
---

# Yêu cầu & Hiểu biết Vấn đề

## Tuyên bố Vấn đề
**Chúng ta đang giải quyết vấn đề gì?**

- **Vấn đề cốt lõi**: Khách hàng hiện chưa có giao diện tập trung để theo dõi dịch vụ và thông tin cá nhân. Họ khó khăn trong việc nắm bắt số buổi liệu trình còn lại, lịch sử đặt hẹn và quản lý thông tin cá nhân.
- **Đối tượng bị ảnh hưởng**: Khách hàng (Customer) của Spa.
- **Tình huống hiện tại**: Khách hàng phải hỏi lễ tân hoặc ghi nhớ thủ công.

## Mục tiêu & Mục đích
**Chúng ta muốn đạt được điều gì?**

- **Mục tiêu chính**: Cung cấp một Dashboard cá nhân hóa cho khách hàng để họ tự quản lý thông tin và dịch vụ của mình.
- **Mục tiêu phụ**: Tăng trải nghiệm người dùng, giảm tải cho lễ tân trong việc trả lời các câu hỏi tra cứu thông tin cơ bản.
- **Phi mục tiêu**: Chưa bao gồm tính năng thanh toán online hoặc mua gói dịch vụ mới trực tiếp trên dashboard (trong giai đoạn này).

## Câu chuyện Người dùng & Trường hợp Sử dụng
**Người dùng sẽ tương tác với giải pháp như thế nào?**

- Là một **Khách hàng**, tôi muốn **xem danh sách các gói liệu trình đã mua** (tên gói, số buổi còn lại, trạng thái) để **biết mình còn bao nhiêu buổi sử dụng**.
- Là một **Khách hàng**, tôi muốn **xem danh sách lịch hẹn** (sắp tới, lịch sử, đã hủy) để **quản lý thời gian đi spa**.
- Là một **Khách hàng**, tôi muốn **xem và cập nhật hồ sơ cá nhân** (tên, số điện thoại, email) để **đảm bảo thông tin liên lạc chính xác**.

## Tiêu chí Thành công
**Làm sao chúng ta biết khi nào chúng ta hoàn thành?**

- Khách hàng có thể đăng nhập và truy cập trang Dashboard.
- Hiển thị chính xác danh sách liệu trình và số buổi còn lại từ cơ sở dữ liệu.
- Hiển thị chính xác danh sách lịch hẹn với các trạng thái khác nhau.
- Cập nhật thông tin cá nhân thành công và dữ liệu được lưu vào hệ thống.
- Giao diện thân thiện, dễ sử dụng trên cả Mobile và Desktop.

## Ràng buộc & Giả định
**Chúng ta cần làm việc trong những giới hạn nào?**

- **Ràng buộc kỹ thuật**: Sử dụng Next.js cho Frontend, FastAPI cho Backend, Supabase cho Database. Tuân thủ Design System hiện có.
- **Giả định**: Khách hàng đã có tài khoản và đã đăng nhập. Dữ liệu liệu trình và lịch hẹn đã có sẵn trong hệ thống (hoặc dữ liệu mẫu).

## Câu hỏi & Các mục Mở
**Chúng ta vẫn cần làm rõ điều gì?**

- Cần xác định rõ các trường thông tin cụ thể trong hồ sơ cá nhân được phép chỉnh sửa.
- Giao diện chi tiết cho từng phần (Liệu trình, Lịch hẹn) sẽ hiển thị những thông tin gì (ví dụ: Lịch hẹn có hiện tên KTV không?).
