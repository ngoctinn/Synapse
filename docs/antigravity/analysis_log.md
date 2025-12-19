# Nhật Ký Phân Tích (Analysis Log) - DESIGN-PATCH-20251219

## 1. Vị trí các lỗi cần sửa (Location Mapping)

### Lỗi 1: Auth Supabase sai hành vi
- **File**: `docs/design/sequences/authentication.md`
- **Chi tiết**: Sơ đồ đăng ký có bước `Hệ thống kiểm tra email tồn tại` và nhánh `alt` cho email đã tồn tại.
- **Hướng sửa**: Xóa bước kiểm tra và nhánh rẽ, chỉ để lại phản hồi chung từ Auth Service.

### Lỗi 2: Trigger DB vẽ như Actor/Service
- **File**: Cần rà soát `docs/design/sequences/customer_flows.md` và `docs/design/activity_diagrams.md`.
- **Chi tiết**: Tìm các luồng liên quan đến "Xác thực email" hoặc "Tự động hóa sau DB" (như tạo record phụ).

### Lỗi 3 & 6: Thuật toán & Lạm dụng alt/else
- **File**: `docs/design/activity_diagrams.md`, `docs/design/sequences/receptionist_flows.md`.
- **Chi tiết**: Các khối `alt` cho lỗi API, lỗi kết nối hoặc các bước lặp toán học quá chi tiết.
- **Hướng sửa**: Thay bằng `Note`.

### Lỗi 4: Mâu thuẫn Use Case Đặt lịch - Khách vãng lai
- **File**: `docs/design/usecase.md`, `docs/design/sequences/customer_flows.md`, `docs/design/sequences/receptionist_flows.md`.
- **Chi tiết**: Kiểm tra tiền điều kiện (Pre-conditions) của Use Case Đặt lịch.
- **DB Check**: `database_design.md` xác nhận `customers.user_id` là nullable.

### Lỗi 5: Activity Diagram quá tải
- **File**: `docs/design/activity_diagrams.md`.
- **Chi tiết**: Rà soát các sơ đồ có quá nhiều quyết định kỹ thuật (API Call, DB Save).

### Lỗi 7: Nhầm lẫn Actor (Hệ thống/DB)
- **File**: Toàn bộ các file trong `docs/design/sequences/` và `docs/design/usecase_diagrams.md`.

### Lỗi 8: Trùng lặp Use Case (Chat)
- **File**: `docs/design/usecase.md`.

### Lỗi 9 & 10: Thiếu RLS/ACID
- **File**: Các sơ đồ Sequence quan trọng tại `customer_flows.md` và `receptionist_flows.md`.

## 2. Các rủi ro/Dependencies
- Việc hợp nhất Use Case có thể làm thay đổi ID của Use Case (ví dụ A2.7, B1.6), cần cập nhật tham chiếu chéo.
- Việc xóa bước kiểm tra Auth có thể làm sơ đồ Sequence nhìn "ngắn" hơn nhưng đảm bảo đúng thực tế Supabase.
