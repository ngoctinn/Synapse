# Nhật Ký Phân Tích (Analysis Log)

## Phiên Phân Tích: 2025-12-16

### 1. Phạm Vi Kiểm Tra
- Supabase Project: `pvyngyztqwytkhpqpyyy` (Synapse)
- Tài liệu tham chiếu: `docs/design/data_specification.md` (v2.1)

### 2. Phương Pháp
Sử dụng Supabase MCP để truy xuất trực tiếp metadata của Database, so sánh với tài liệu đặc tả.

### 3. Kết Quả Kiểm Tra

#### 3.1. Các bảng HIỆN CÓ trong Database
| Bảng | Rows | RLS | Ghi Chú |
|:---|:---:|:---:|:---|
| `users` | 4 | ✅ | Bảng căn bản đã ổn định. |
| `staff` | 4 | ❌ | Đặc tả gọi là `staff_profiles`. |
| `services` | 16 | ❌ | Thiếu `category_id`, `description`, `deleted_at`. |
| `skills` | ? | ❌ | Có đủ `id`, `name`, `code`, `description`. |
| `staff_skills` | 0 | ❌ | Thiếu `proficiency_level`. |
| `service_skills` | ? | ❌ | Thiếu `min_proficiency_level`. |

#### 3.2. Các bảng THIẾU (so với đặc tả)
- `service_categories`
- `resource_groups`
- `resources`
- `service_resource_requirements`
- `customer_profiles`
- `shifts`
- `staff_schedules`
- `bookings`, `booking_items`
- `invoices`, `payments`
- ... (và nhiều bảng khác)

#### 3.3. ENUM Types
Kiểm tra cho thấy **KHÔNG CÓ ENUM nào được định nghĩa** trong DB hiện tại.
Cần tạo: `resource_type`, `resource_status`, `booking_status`, ...

### 4. Phân Tích Tác Động

#### Rủi ro khi thêm `category_id` vào `services`:
- Cột nullable, không ảnh hưởng data hiện có.
- Frontend cần cập nhật để hiển thị/chọn category.

#### Rủi ro khi đổi tên cột (`duration` → `duration_minutes`):
- **CAO**: Toàn bộ Frontend và Backend đang dùng `duration`.
- **Khuyến nghị:** KHÔNG rename, thêm alias hoặc giữ nguyên.

### 5. Dependency Map

```
services
├── service_categories (FK: category_id)
├── service_skills → skills
└── service_resource_requirements → resource_groups
                                        └── resources
```

```
staff
├── users (FK: user_id, 1-1)
└── staff_skills → skills
```

### 6. Kết Luận
Cần thực hiện **4 Migration** để đưa Database lên chuẩn đặc tả cho phase "Core Data".
Các bảng liên quan đến Booking/Scheduling sẽ triển khai ở phase sau.
