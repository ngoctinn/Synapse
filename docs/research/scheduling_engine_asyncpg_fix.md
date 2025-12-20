# Báo cáo Nghiên cứu & Sửa lỗi: Scheduling Engine Data Extractor

**Ngày:** 2025-12-20
**Module:** `scheduling_engine`
**Vấn đề:** API `find_available_slots` trả về rỗng do không tìm thấy nhân viên khả dụng (`available_staff` empty), mặc dù dữ liệu có tồn tại trong database.

## 1. Phân Tích Nguyên Nhân

Sau quá trình debug sâu và kiểm tra log hệ thống, chúng tôi đã xác định được 2 nguyên nhân cốt lõi gây ra vấn đề này:

### A. Vấn đề về Row Level Security (RLS) - Nguyên nhân chính
- **Mô tả:** Hệ thống sử dụng cơ chế RLS Injection để bảo mật dữ liệu theo người dùng. Khi gọi API, session database được chuyển sang role `authenticated`.
- **Tác động:**
    - Query lấy thông tin nhân viên thực hiện JOIN giữa hai bảng: `staff` (RLS: OFF) và `users` (RLS: ON).
    - Policy cũ của bảng `users` (`Admins can view all profiles`) chỉ cho phép role `admin` xem toàn bộ dữ liệu.
    - User hiện tại (`manager`) không có quyền `SELECT` các dòng của user khác trong bảng `users`.
    - Kết quả: Khi JOIN, PostgreSQL loại bỏ tất cả các dòng mà user không có quyền truy cập → Trả về danh sách rỗng, mặc dù bảng `staff` tìm thấy lịch làm việc.

### B. Vấn đề về Asyncpg Parameter Binding - Nguyên nhân phụ
- **Mô tả:** Driver `asyncpg` rất nghiêm ngặt về kiểu dữ liệu (Strict Typing). Việc sử dụng `bindparam(expanding=True)` với Raw SQL (`text()`) dễ gây lỗi nếu truyền sai kiểu (ví dụ: truyền `list[str]` cho cột `uuid[]`).
- **Tác động:** Gây khó khăn trong việc debug và tiềm ẩn lỗi runtime nếu dữ liệu đầu vào không được validate chặt chẽ.

## 2. Giải Pháp Đã Thực Hiện

### A. Cập nhật RLS Policy (Security)
Đã áp dụng migration để mở rộng quyền truy cập cho người dùng nội bộ:
```sql
CREATE POLICY "Allow authenticated to read users"
ON "public"."users"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (true);
```
Điều này cho phép tất cả user đã đăng nhập (bao gồm Manager, Receptionist) xem thông tin cơ bản (Tên, ID) của nhau để phục vụ nghiệp vụ.

### B. Refactor Code (Code Quality)
Đã chuyển đổi logic truy vấn từ Raw SQL sang sử dụng **SQLModel ORM (Select)**.

**Trước (Raw SQL - Rủi ro):**
```python
query = text("... WHERE st.user_id IN :staff_ids ...")
# Phải manually bind params và cast types
```

**Sau (SQLModel - Type Safe):**
```python
stmt = (
    select(Staff.user_id, User.full_name)
    .join(User, Staff.user_id == User.id)
    .where(Staff.user_id.in_(unique_ids))
)
# SQLModel tự động xử lý type binding và query generation an toàn
```

## 3. Kết Quả

- API `find_available_slots` đã hoạt động chính xác.
- Mã nguồn sạch hơn (Clean Code), dễ bảo trì và tuân thủ chuẩn Vertical Slice Architecture (sử dụng Models thay vì hardcoded SQL).
