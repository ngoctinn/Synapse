---
title: Thiết Kế Mời Nhân Viên
status: Draft
---

# Thiết Kế Mời Nhân Viên

## 1. Thay đổi Kiến trúc
- **Backend:** Endpoint API mới `POST /users/invite` trong `modules/users`.
- **Frontend:** Component `InviteStaffModal` mới thay thế modal "Thêm nhân viên" cũ.

## 2. Cấu trúc Database Schema
### `auth.users` (Supabase Quản lý)
- `id`: UUID
- `email`: Email nhân viên
- `confirmed_at`: Timestamp (được set khi user click link)

### `public.users` (Hợp nhất - PostgreSQL)
- Bảng này đã tồn tại và được tự động đồng bộ từ `auth.users` qua Trigger.
- `id`: UUID (PK, khớp với auth.users.id)
- `email`: Varchar
- `full_name`: Varchar
- `phone_number`: Varchar
- `role`: Enum (CUSTOMER, MANAGER, RECEPTIONIST, TECHNICIAN)
- `avatar_url`: Text
- `address`: Text
- `date_of_birth`: Date

### `public.employee_skills` (PostgreSQL)
- `user_id`: UUID (FK -> public.users.id)
- `skill_id`: Integer (FK)

## 3. Thiết kế API
### `POST /api/v1/users/invite`
- **Request Body:**
  ```json
  {
    "email": "staff@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "role": "technician",
    "skillIds": [1, 2] // Tùy chọn, chỉ dành cho technician
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "message": "Đã gửi lời mời thành công"
  }
  ```

## 4. Thiết kế Component
### Frontend
- **`InviteStaffModal`**:
    - Sử dụng `Dialog` từ Shadcn UI.
    - Form với `react-hook-form` + `zod`.
    - Các trường: Tên, Email (Validate bất đồng bộ), SĐT, Vai trò (Select), Kỹ năng (Multi-select, có điều kiện).
    - Footer: Hủy (Ghost), Gửi lời mời (Primary).

### Logic Backend (Transaction)
1.  **Chuẩn bị Metadata:** Đóng gói `full_name`, `phone_number`, `role` vào `data` (metadata) của Supabase Auth.
2.  **Supabase Auth:** Gọi `supabase.auth.admin.inviteUserByEmail(email, { data: ... })`.
    -   *Lưu ý:* Trigger `handle_new_user` sẽ tự động chạy và insert bản ghi vào `public.users` với đầy đủ thông tin từ metadata.
3.  **Skills Insert:** Nếu role là Technician (TODO: Sẽ triển khai sau khi có bảng `employee_skills`):
    -   Lấy `user_id` trả về từ bước 2.
    -   Insert vào bảng `public.employee_skills`.
4.  **Error Handling:** Nếu bước 3 lỗi, gọi `supabase.auth.admin.deleteUser(user_id)` để rollback.

## 5. Bảo mật & Hiệu năng
- **Bảo mật:** Admin cần quyền `manage_staff`.
- **Hiệu năng:** Transaction đảm bảo tính toàn vẹn dữ liệu.
