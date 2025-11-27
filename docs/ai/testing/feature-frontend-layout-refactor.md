---
phase: testing
title: Chiến lược Kiểm thử - Refactor Frontend Layout
description: Kiểm thử sau khi refactor
---

# Chiến lược Kiểm thử

## Mục tiêu Độ bao phủ Kiểm thử
**Chúng ta nhắm đến mức độ kiểm thử nào?**

- Đảm bảo không có regression về UI và chức năng.

## Kiểm thử Đơn vị
**Các thành phần riêng lẻ nào cần kiểm thử?**

- Nếu có unit test cũ cho Header, cần cập nhật đường dẫn import và chạy lại.

## Kiểm thử Tích hợp
**Chúng ta kiểm thử tương tác thành phần như thế nào?**

- Kiểm tra `app/layout.tsx` tích hợp `Header` thành công.

## Kiểm thử Thủ công
**Cái gì yêu cầu xác thực của con người?**

- Mở trang chủ (`/`), kiểm tra Header hiển thị đúng.
- Thử resize màn hình (Mobile/Desktop) để đảm bảo responsive không bị vỡ do mất CSS (nếu có CSS module relative).
- Thử các link trên Header.
- Thử User Dropdown.

## Theo dõi Lỗi
**Chúng ta quản lý vấn đề như thế nào?**

- Fix ngay nếu phát hiện lỗi build hoặc runtime.
