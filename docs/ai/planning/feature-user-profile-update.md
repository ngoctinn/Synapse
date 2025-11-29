---
title: Lập kế hoạch Cập nhật Hồ sơ Người dùng
status: Draft
---

# Lập kế hoạch: Cập nhật Hồ sơ Người dùng

## 1. Phân rã Nhiệm vụ
### Backend
- [ ] Xác minh schema bảng `users` trong Supabase.
- [ ] Tạo migration để thêm `address` và `date_of_birth` nếu thiếu.
- [ ] Cập nhật model `User` và schema `UserUpdate` trong `backend/src/modules/users`.
- [ ] Cập nhật logic `UserService.update_profile` nếu cần thiết.

### Frontend
- [ ] Tạo thành phần `AvatarSelector`.
- [ ] Cập nhật `ProfileForm` để bao gồm các trường Địa chỉ và Ngày sinh.
- [ ] Tích hợp `AvatarSelector` vào `ProfileForm`.
- [ ] Kết nối với action `updateProfile`.

## 2. Phụ thuộc
- DiceBear API (có sẵn công khai).
- Cơ sở dữ liệu Supabase.

## 3. Ước tính
- Backend: 1 giờ
- Frontend: 2 giờ
- Kiểm thử: 0.5 giờ

## 4. Thứ tự Thực hiện
1. Cập nhật Schema & Model Backend.
2. Thành phần Frontend AvatarSelector.
3. Cập nhật Frontend ProfileForm.
4. Tích hợp & Kiểm thử.
