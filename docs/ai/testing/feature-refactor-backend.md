---
phase: testing
title: Chiến lược Kiểm thử Refactor Backend
description: Kế hoạch kiểm thử cho việc refactor
---

# Chiến lược Kiểm thử

## Mục tiêu Độ bao phủ Kiểm thử
**Chúng ta nhắm đến mức độ kiểm thử nào?**

- Kiểm thử thủ công các API endpoint quan trọng sau khi refactor.
- Đảm bảo không có lỗi 500 do thiếu dependency.

## Kiểm thử Đơn vị
**Các thành phần riêng lẻ nào cần kiểm thử?**

### UserService
- [ ] Test `get_profile`: Đảm bảo gọi đúng query DB.
- [ ] Test `update_profile`: Đảm bảo logic update đúng.

## Kiểm thử Tích hợp
**Chúng ta kiểm thử tương tác thành phần như thế nào?**

- [ ] Gọi API `GET /api/v1/users/me` với Token hợp lệ.
    - Kỳ vọng: 200 OK, trả về thông tin user.
- [ ] Gọi API `PUT /api/v1/users/me`.
    - Kỳ vọng: 200 OK, DB được cập nhật.

## Kiểm thử Thủ công
**Cái gì yêu cầu xác thực của con người?**

1.  Chạy server: `uvicorn src.app.main:app --reload`
2.  Đăng nhập (lấy token từ frontend hoặc postman).
3.  Gọi API User Profile.
4.  Kiểm tra console log của server xem có dòng SQL `SET LOCAL role...` không (nếu bật echo=True).

## Dữ liệu Kiểm thử
**Chúng ta sử dụng dữ liệu gì để kiểm thử?**

- User hiện có trong DB Supabase.
