---
phase: deployment
title: Chiến lược Triển khai
description: Xác định quy trình triển khai, cơ sở hạ tầng và thủ tục phát hành
---

# Chiến lược Triển khai

## Cơ sở hạ tầng
**Ứng dụng sẽ chạy ở đâu?**

- Nền tảng lưu trữ (AWS, GCP, Azure, v.v.)
- Các thành phần cơ sở hạ tầng (máy chủ, cơ sở dữ liệu, v.v.)
- Phân tách môi trường (dev, staging, production)

## Quy trình Triển khai
**Chúng ta triển khai các thay đổi như thế nào?**

### Quy trình Xây dựng (Build)
- Các bước và lệnh xây dựng
- Biên dịch/tối ưu hóa tài sản (assets)
- Cấu hình môi trường

### Quy trình CI/CD
- Các cổng kiểm thử tự động
- Tự động hóa xây dựng
- Tự động hóa triển khai

## Cấu hình Môi trường
**Những cài đặt nào khác nhau theo môi trường?**

### Phát triển (Development)
- Chi tiết cấu hình
- Thiết lập cục bộ

### Thử nghiệm (Staging)
- Chi tiết cấu hình
- Môi trường kiểm thử

### Sản xuất (Production)
- Chi tiết cấu hình
- Thiết lập giám sát

## Các bước Triển khai
**Quy trình phát hành là gì?**

1. Danh sách kiểm tra trước khi triển khai
2. Các bước thực hiện triển khai
3. Xác thực sau khi triển khai
4. Thủ tục khôi phục (nếu cần)

## Di chuyển Cơ sở dữ liệu
**Chúng ta xử lý thay đổi lược đồ như thế nào?**

- Chiến lược di chuyển (migration)
- Thủ tục sao lưu
- Cách tiếp cận khôi phục

## Quản lý Bí mật
**Chúng ta xử lý dữ liệu nhạy cảm như thế nào?**

- Biến môi trường
- Giải pháp lưu trữ bí mật
- Chiến lược xoay vòng khóa

## Kế hoạch Khôi phục (Rollback)
**Nếu có sự cố xảy ra thì sao?**

- Các yếu tố kích hoạt khôi phục
- Các bước khôi phục
- Kế hoạch truyền thông
