---
phase: design
title: Thiết kế Hệ thống & Kiến trúc
description: Xác định kiến trúc kỹ thuật, các thành phần và mô hình dữ liệu
---

# Thiết kế Hệ thống & Kiến trúc

## Tổng quan Kiến trúc
**Cấu trúc hệ thống cấp cao là gì?**

- Bao gồm biểu đồ mermaid nắm bắt các thành phần chính và mối quan hệ của chúng. Ví dụ:
  ```mermaid
  graph TD
    Client -->|HTTPS| API
    API --> ServiceA
    API --> ServiceB
    ServiceA --> Database[(DB)]
  ```
- Các thành phần chính và trách nhiệm của chúng
- Các lựa chọn ngăn xếp công nghệ và lý do

## Mô hình Dữ liệu
**Chúng ta cần quản lý dữ liệu gì?**

- Các thực thể cốt lõi và mối quan hệ của chúng
- Lược đồ/cấu trúc dữ liệu
- Luồng dữ liệu giữa các thành phần

## Thiết kế API
**Các thành phần giao tiếp như thế nào?**

- API bên ngoài (nếu có)
- Giao diện nội bộ
- Định dạng yêu cầu/phản hồi
- Cách tiếp cận xác thực/ủy quyền

## Phân rã Thành phần
**Các khối xây dựng chính là gì?**

- Các thành phần Frontend (nếu có)
- Các dịch vụ/mô-đun Backend
- Lớp cơ sở dữ liệu/lưu trữ
- Tích hợp bên thứ ba

## Các Quyết định Thiết kế
**Tại sao chúng ta chọn cách tiếp cận này?**

- Các quyết định kiến trúc chính và sự đánh đổi
- Các lựa chọn thay thế đã xem xét
- Các mẫu và nguyên tắc được áp dụng

## Yêu cầu Phi chức năng
**Hệ thống nên hoạt động như thế nào?**

- Mục tiêu hiệu suất
- Cân nhắc về khả năng mở rộng
- Yêu cầu bảo mật
- Nhu cầu về độ tin cậy/tính sẵn sàng
