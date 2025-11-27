---
title: User Authentication Design
status: Draft
---

# Feature: User Authentication Design

## 1. Architecture Overview
Hệ thống sử dụng mô hình **Hybrid Auth**:
- **Frontend (Next.js):** Sử dụng `@supabase/ssr` để thực hiện Authentication (Login, Register, Logout) trực tiếp với Supabase Auth. Quản lý Session thông qua Cookies.
- **Database (Supabase Postgres):** Lưu trữ thông tin đăng nhập (bảng `auth.users` - managed by Supabase) và thông tin hồ sơ mở rộng (bảng `public.users` - managed by application).
- **Backend (FastAPI):** Xác thực người dùng thông qua JWT Token (gửi từ Frontend) để bảo vệ các API endpoints. Truy xuất thông tin chi tiết từ bảng `public.users`.

## 2. Data Model & Schema Changes
Để giải quyết vấn đề "mở rộng profile", chúng ta sử dụng kỹ thuật **Trigger-based Profile Creation**.

### 2.1. Table: `public.users`
Bảng này ánh xạ 1-1 với `auth.users`.

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2. Database Trigger
Tự động tạo record trong `public.users` khi có user mới đăng ký.

```sql
-- Function xử lý trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger kích hoạt
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 3. API Design (FastAPI)
### 3.1. Authentication Middleware/Dependency
- `get_current_user`: Dependency kiểm tra JWT Token từ Header `Authorization: Bearer <token>`.
- Giải mã Token -> Lấy `sub` (User ID) -> Query bảng `public.users` để lấy thông tin đầy đủ.

### 3.2. Endpoints
- `GET /api/v1/users/me`: Trả về thông tin profile của user hiện tại.
- `PUT /api/v1/users/me`: Cập nhật thông tin profile (tên, sđt, avatar).

## 4. Frontend Implementation (Next.js)
- **Server Actions:**
  - `login(formData)`: Gọi `supabase.auth.signInWithPassword`.
  - `signup(formData)`: Gọi `supabase.auth.signUp`.
  - `logout()`: Gọi `supabase.auth.signOut`.
- **Middleware:** Kiểm tra Session Cookie để bảo vệ các route `/dashboard`.

## 5. Security Considerations
- **Row Level Security (RLS):**
  - Bảng `public.users`:
    - `SELECT`: User chỉ xem được profile của chính mình (hoặc Admin xem all).
    - `UPDATE`: User chỉ sửa được profile của chính mình.
- **Token:** Access Token có thời hạn ngắn, Refresh Token được quản lý bởi Supabase SDK.
