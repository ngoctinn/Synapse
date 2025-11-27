---
title: Testing - Landing Page UI
status: Draft
---

# Landing Page UI Testing

## 1. Unit Tests
- Render Header thành công.
- Render Footer thành công.

## 2. Integration Tests
- Click "Đăng nhập" chuyển hướng đến `/login`.
- Click "Đăng ký" chuyển hướng đến `/register`.
- Mobile menu mở ra khi click hamburger icon.

## 3. Manual Verification Steps
1.  Mở trang chủ.
2.  Kiểm tra hiển thị trên Desktop:
    - Logo, Menu, Nút bấm căn chỉnh đúng.
    - Hover vào các link có hiệu ứng.
3.  Kiểm tra hiển thị trên Mobile:
    - Menu ẩn đi, hiện icon hamburger.
    - Click hamburger mở ra menu dọc.
4.  Kiểm tra trạng thái Auth:
    - Chưa đăng nhập: Thấy nút Login/Register.
    - Đã đăng nhập (mock): Thấy Avatar.
