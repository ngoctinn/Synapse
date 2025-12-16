# Nhật Ký Phân Tích (Analysis Log)

## Phiên Phân Tích: 2025-12-16 - TIME DOMAIN

### 1. Phạm Vi Kiểm Tra
- Supabase Project: `pvyngyztqwytkhpqpyyy` (Synapse)
- Giai đoạn: 2 - Lịch làm việc & Khung thời gian

### 2. Kết Quả Kiểm Tra Database

#### Bảng CHƯA CÓ (cần tạo):
- `shifts` - Định nghĩa ca làm việc
- `staff_schedules` - Phân công lịch làm việc

#### ENUM CHƯA CÓ:
- `schedule_status` (DRAFT, PUBLISHED)

### 3. Dependency Map

```
shifts (Master Data)
    ↓
staff_schedules ←→ staff (FK: staff_id → staff.user_id)
    |
    └── Cung cấp miền thời gian cho:
            - Thuật toán lập lịch (Solver)
            - Kiểm tra xung đột booking
```

### 4. Phân Tích Tác Động

#### Tác động lên Module hiện có:
- **Module `staff`**: Không cần sửa, chỉ thêm relationship sang `schedules`
- **Module `resources`**: Không ảnh hưởng
- **Module `services`**: Không ảnh hưởng

#### Tác động tương lai:
- Module `bookings` sẽ cần kiểm tra `staff_schedules` trước khi tạo lịch hẹn
- Solver sẽ query `staff_schedules` để lấy miền thời gian hợp lệ

### 5. Rủi Ro & Giảm Thiểu

| Rủi Ro | Xác suất | Giải pháp |
|:---|:---:|:---|
| FK `staff_id` tham chiếu sai bảng | Thấp | Tham chiếu đúng `staff.user_id` |
| Timezone mismatch giữa TIME và TIMESTAMPTZ | Trung bình | Sử dụng TIME cho giờ, DATE cho ngày (không có timezone) |
| Ca làm việc kéo dài qua đêm | Thấp | Thêm note trong docs, xử lý ở application layer nếu cần |

### 6. Quyết Định Thiết Kế

1. **Sử dụng TIME thay vì TIMESTAMPTZ cho ca làm việc**
   - Lý do: Ca "08:00-12:00" không phụ thuộc ngày, áp dụng cho mọi ngày

2. **Unique constraint trên (staff_id, work_date, shift_id)**
   - Cho phép 1 KTV làm nhiều ca trong cùng 1 ngày (VD: Ca sáng + Ca chiều)
   - Không cho phép duplicate cùng ca

3. **Status DRAFT/PUBLISHED**
   - Cho phép Manager lên lịch tuần trước, sau đó công bố
   - KTV chỉ thấy lịch PUBLISHED

### 7. Kết Luận

Cần thực hiện:
- 2 Database Migrations
- 1 Module Backend mới (`schedules`)
- Seed data mẫu cho testing
