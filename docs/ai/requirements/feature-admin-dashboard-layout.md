---
phase: requirements
title: Bố cục Dashboard Quản trị (Admin Dashboard Layout)
description: Thiết kế và triển khai bố cục trang quản trị hiện đại, đơn giản cho Synapse CRM
---

# Yêu cầu & Hiểu biết Vấn đề

## Tuyên bố Vấn đề
**Chúng ta đang giải quyết vấn đề gì?**

- Hiện tại, Synapse chưa có giao diện dành riêng cho Quản trị viên và Nhân viên Spa.
- Layout hiện tại `(dashboard)` được thiết kế cho Khách hàng (Customer).
- Cần một không gian làm việc chuyên biệt, tối ưu cho việc quản lý, với giao diện hiện đại, trực quan như hình ảnh tham khảo.

## Mục tiêu & Mục đích
**Chúng ta muốn đạt được điều gì?**

- **Mục tiêu chính**: Xây dựng Layout Admin Dashboard (`(admin)`) tách biệt với Customer Dashboard.
- **Mục tiêu phụ**:
    - Thiết kế Sidebar điều hướng dọc (như hình tham khảo).
    - Header tối giản với thông tin người dùng và thông báo.
    - Giao diện "Card-based" sạch sẽ, hiện đại.
- **Phi mục tiêu**: Chưa triển khai logic nghiệp vụ chi tiết của từng trang con (chỉ tập trung vào khung Layout).

## Câu chuyện Người dùng & Trường hợp Sử dụng
**Người dùng sẽ tương tác với giải pháp như thế nào?**

- **Quản trị viên**: Đăng nhập và được chuyển hướng đến `/admin`. Thấy menu điều hướng bên trái (Tổng quan, Lịch hẹn, Bệnh nhân, Tin nhắn...).
- **Nhân viên Spa**: Sử dụng cùng layout nhưng có thể bị giới hạn quyền truy cập một số mục menu.

## Tiêu chí Thành công
**Làm sao chúng ta biết khi nào chúng ta hoàn thành?**

- [ ] Route group `(admin)` được tạo mới.
- [ ] Layout Admin hiển thị đúng trên Desktop và Mobile (Responsive).
- [ ] Sidebar có thể thu gọn/mở rộng (tùy chọn) hoặc hiển thị icon + text rõ ràng.
- [ ] Header hiển thị lời chào và Avatar người dùng.
- [ ] Giao diện khớp với phong cách "Modern, Simple" của hình tham khảo.

## Ràng buộc & Giả định
**Chúng ta cần làm việc trong những giới hạn nào?**

- **Công nghệ**: Next.js 15, Tailwind CSS, Shadcn/UI.
- **Giả định**: Đã có Shadcn/UI components cơ bản (Button, Card, Avatar...).

## Câu hỏi & Các mục Mở
**Chúng ta vẫn cần làm rõ điều gì?**

- Danh sách chính xác các mục menu? (Tạm thời lấy theo hình tham khảo: Overview, Calendar, Appointments, Patients, Messages, Notifications, Payment Info, Settings).
