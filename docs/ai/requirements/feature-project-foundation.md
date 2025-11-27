---
phase: requirements
title: Yêu cầu & Hiểu biết Vấn đề - Project Foundation
description: Thiết lập nền tảng cơ bản cho dự án Synapse (Frontend + Backend)
---

# Yêu cầu & Hiểu biết Vấn đề

## Tuyên bố Vấn đề
**Chúng ta đang giải quyết vấn đề gì?**

- Dự án Synapse cần một nền tảng kỹ thuật vững chắc để bắt đầu phát triển các tính năng nghiệp vụ.
- Hiện tại chưa có cấu trúc dự án chuẩn, chưa có sự kết nối giữa Frontend và Backend.
- Developer cần một môi trường phát triển thống nhất để làm việc hiệu quả.

## Mục tiêu & Mục đích
**Chúng ta muốn đạt được điều gì?**

- **Mục tiêu chính**:
    - Thiết lập cấu trúc Monorepo/Modular Monolith cho dự án.
    - Cài đặt và cấu hình FastAPI (Backend) với các thư viện cần thiết (SQLModel, Pydantic, Alembic).
    - Cài đặt và cấu hình Next.js 15 (Frontend) với Tailwind CSS, Shadcn/UI.
    - Thiết lập kết nối cơ bản giữa Frontend và Backend (Proxy/CORS).
    - Kết nối với Supabase (Auth, DB).
- **Phi mục tiêu**:
    - Chưa phát triển các tính năng nghiệp vụ cụ thể (Đặt lịch, Quản lý khách hàng...).
    - Chưa triển khai Authentication đầy đủ (chỉ cấu hình cơ bản).

## Câu chuyện Người dùng & Trường hợp Sử dụng
**Người dùng sẽ tương tác với giải pháp như thế nào?**

- Là một **Developer**, tôi muốn **có cấu trúc thư mục chuẩn** để **bắt đầu viết code theo quy chuẩn**.
- Là một **Developer**, tôi muốn **Backend và Frontend kết nối được với nhau** để **phát triển tính năng full-stack**.
- Là một **Developer**, tôi muốn **môi trường phát triển được cấu hình sẵn (Linting, Formatting)** để **đảm bảo chất lượng code**.

## Tiêu chí Thành công
**Làm sao chúng ta biết khi nào chúng ta hoàn thành?**

- [ ] Cấu trúc thư mục `backend` và `frontend` được tạo đúng theo tài liệu kiến trúc.
- [ ] Backend chạy được (`uvicorn`) và trả về Hello World/Health check.
- [ ] Frontend chạy được (`npm run dev`) và hiển thị trang chủ cơ bản.
- [ ] Frontend có thể gọi API từ Backend thành công.
- [ ] Kết nối được với Supabase (biến môi trường được cấu hình đúng).

## Ràng buộc & Giả định
**Chúng ta cần làm việc trong những giới hạn nào?**

- **Ràng buộc kỹ thuật**: Tuân thủ Tech Stack đã định (FastAPI, Next.js 15, Supabase).
- **Giả định**: Tài khoản Supabase và Project đã được tạo sẵn.

## Câu hỏi & Các mục Mở
**Chúng ta vẫn cần làm rõ điều gì?**

- (Hiện tại chưa có câu hỏi mở nào, đã xác nhận với user).
