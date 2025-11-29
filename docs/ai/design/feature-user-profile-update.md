---
title: Thiết kế Cập nhật Hồ sơ Người dùng
status: Draft
---

# Thiết kế: Cập nhật Hồ sơ Người dùng

## 1. Thay đổi Kiến trúc
- **Frontend**: Tái cấu trúc `ProfileForm` để bao gồm các trường mới và modal/popover Chọn Hình đại diện.
- **Backend**: Cập nhật model `User` và schema `UserUpdate` để bao gồm `address` và `date_of_birth`.

## 2. Mô hình Dữ liệu / Schema
### Cơ sở dữ liệu (`public.users`)
Cần đảm bảo các cột này tồn tại hoặc thêm chúng:
- `address`: text (nullable)
- `date_of_birth`: date (nullable)
- `avatar_url`: text (hiện có)

### API Schema (`UserUpdate`)
```python
class UserUpdate(SQLModel):
    full_name: str | None = None
    phone_number: str | None = None
    address: str | None = None
    date_of_birth: date | None = None
    avatar_url: str | None = None
```

## 3. Điểm cuối API
- `PUT /api/v1/users/me`: Điểm cuối hiện có, cần chấp nhận các trường mới.

## 4. Thành phần Giao diện
- **ProfileForm**:
  - Sử dụng `InputWithIcon` cho các trường văn bản.
  - Sử dụng `DatePicker` (từ `shared/ui/custom` hoặc `shadcn`) cho Ngày sinh.
  - Thành phần `AvatarSelector` mới:
    - Hiển thị lưới các hình đại diện DiceBear.
    - Cho phép chọn.
    - Trả về URL đã chọn.

## 5. Bảo mật & Hiệu suất
- **Bảo mật**: Xác thực đầu vào ở cả client và server. Đảm bảo người dùng chỉ có thể cập nhật hồ sơ của chính họ.
- **Hiệu suất**: URL hình đại diện DiceBear là bên ngoài, vì vậy việc lưu trữ đệm được xử lý bởi trình duyệt/CDN.
