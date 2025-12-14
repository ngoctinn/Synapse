# Báo Cáo Nghiên Cứu: Giải Pháp Cấu Hình Lịch Làm Việc Cho Spa

**Ngày nghiên cứu:** 2025-12-13
**Phiên bản:** 1.0
**Dự án:** Synapse CRM

---

## 1. Tổng Quan Vấn Đề

### 1.1. Yêu Cầu Nghiệp Vụ
Cần quản lý thời gian hoạt động của Spa để:
- Hiển thị slot khả dụng khi khách hàng đặt lịch
- Validate booking không nằm ngoài giờ hoạt động
- Xử lý ngày ngoại lệ (lễ, tết, bảo trì, giờ đặc biệt)
- Cho phép Admin cấu hình linh hoạt

### 1.2. Trạng Thái Hiện Tại
Schema hiện tại (`schema.sql`) lưu operating hours trong bảng `system_configurations` dưới dạng JSONB:

```sql
INSERT INTO system_configurations (key, value, description) VALUES
('operating_hours',
 '{"monday": {"open": "08:00", "close": "21:00"}, ...}',
 'Giờ hoạt động của Spa');
```

**Ưu điểm hiện tại:**
- Đơn giản, triển khai nhanh
- Không cần migration khi thêm trường mới

**Hạn chế hiện tại:**
- ❌ Không hỗ trợ split-shift (nghỉ trưa)
- ❌ Không có bảng ngày ngoại lệ (exception dates)
- ❌ Khó query với SQL tiêu chuẩn
- ❌ Không có validation ở mức database

---

## 2. Các Giải Pháp Đề Xuất

### 2.1. Phương Án A: Bảng SQL Chuẩn Hóa (KHUYẾN NGHỊ)

**Mô tả:** Tạo 2 bảng riêng biệt cho giờ hoạt động tiêu chuẩn và ngày ngoại lệ.

```sql
-- ============================================================
-- Bảng 1: Giờ hoạt động tiêu chuẩn theo ngày trong tuần
-- ============================================================
CREATE TABLE regular_operating_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
    period_number SMALLINT NOT NULL DEFAULT 1, -- Cho phép nhiều ca/ngày (ca sáng, ca chiều)
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE, -- TRUE nếu đóng cửa cả ngày
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_hours CHECK (close_time > open_time OR is_closed = TRUE),
    UNIQUE (day_of_week, period_number)
);

COMMENT ON TABLE regular_operating_hours IS 'Lịch hoạt động tiêu chuẩn của Spa theo ngày trong tuần';
COMMENT ON COLUMN regular_operating_hours.day_of_week IS '1=Thứ Hai, 2=Thứ Ba, ..., 7=Chủ Nhật';
COMMENT ON COLUMN regular_operating_hours.period_number IS 'Số thứ tự ca trong ngày (1=Ca 1, 2=Ca 2 nếu có nghỉ trưa)';

-- ============================================================
-- Bảng 2: Ngày ngoại lệ (nghỉ lễ, bảo trì, giờ đặc biệt)
-- ============================================================
CREATE TYPE exception_type AS ENUM ('HOLIDAY', 'MAINTENANCE', 'SPECIAL_HOURS', 'CUSTOM');

CREATE TABLE exception_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exception_date DATE NOT NULL,
    exception_type exception_type NOT NULL DEFAULT 'CUSTOM',
    reason VARCHAR(255) NOT NULL,
    is_closed BOOLEAN DEFAULT TRUE, -- TRUE nếu đóng cửa cả ngày
    open_time TIME, -- NULL nếu is_closed = TRUE
    close_time TIME, -- NULL nếu is_closed = TRUE
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_exception_hours CHECK (
        (is_closed = TRUE AND open_time IS NULL AND close_time IS NULL) OR
        (is_closed = FALSE AND open_time IS NOT NULL AND close_time IS NOT NULL AND close_time > open_time)
    ),
    UNIQUE (exception_date)
);

COMMENT ON TABLE exception_dates IS 'Ngày ngoại lệ ghi đè lịch hoạt động tiêu chuẩn';
COMMENT ON COLUMN exception_dates.is_closed IS 'TRUE = đóng cửa cả ngày, FALSE = mở với giờ đặc biệt';

-- Index cho query hiệu quả
CREATE INDEX idx_exception_dates_date ON exception_dates(exception_date);
CREATE INDEX idx_exception_dates_date_range ON exception_dates(exception_date)
    WHERE exception_date >= CURRENT_DATE;
```

**Ưu điểm:**
- ✅ Chuẩn hóa SQL, query dễ dàng
- ✅ Hỗ trợ split-shift (nhiều ca/ngày)
- ✅ Validation ở mức database (constraints)
- ✅ Index tối ưu cho truy vấn
- ✅ Dễ mở rộng (thêm location_id nếu multi-branch)
- ✅ Tương thích với OR-Tools slot calculation

**Nhược điểm:**
- ❌ Cần migration 2 bảng mới
- ❌ Phức tạp hơn JSONB

---

### 2.2. Phương Án B: JSONB Có Cấu Trúc (Cải Tiến Hiện Tại)

**Mô tả:** Giữ nguyên `system_configurations` nhưng cải tiến cấu trúc JSON.

```sql
-- Cấu trúc JSON mới trong system_configurations
{
  "defaultSchedule": [
    {
      "day": "monday",
      "isOpen": true,
      "timeSlots": [
        { "start": "08:00", "end": "12:00" },
        { "start": "13:30", "end": "21:00" }
      ]
    },
    {
      "day": "sunday",
      "isOpen": false,
      "timeSlots": []
    }
  ],
  "exceptions": [
    {
      "id": "uuid-xxx",
      "date": "2025-02-10",
      "type": "HOLIDAY",
      "reason": "Tết Nguyên Đán",
      "isClosed": true
    },
    {
      "id": "uuid-yyy",
      "date": "2025-12-24",
      "type": "SPECIAL_HOURS",
      "reason": "Giáng sinh (về sớm)",
      "isClosed": false,
      "modifiedHours": [{ "start": "09:00", "end": "15:00" }]
    }
  ]
}
```

**Ưu điểm:**
- ✅ Không cần thêm bảng mới
- ✅ Linh hoạt thay đổi cấu trúc
- ✅ Frontend đã có types sẵn

**Nhược điểm:**
- ❌ Khó query exceptions theo ngày với SQL
- ❌ Không có validation ở database
- ❌ Khó JOIN với booking_items để check availability
- ❌ Performance có thể giảm khi danh sách exceptions lớn

---

### 2.3. Phương Án C: Kết Hợp (Hybrid)

**Mô tả:** Dùng bảng SQL cho exception_dates, giữ JSONB cho default schedule.

```sql
-- regular_operating_hours vẫn trong system_configurations
-- Nhưng exception_dates là bảng riêng

CREATE TABLE exception_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exception_date DATE NOT NULL UNIQUE,
    exception_type VARCHAR(50) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    is_closed BOOLEAN DEFAULT TRUE,
    modified_hours JSONB, -- [{"start": "09:00", "end": "15:00"}]
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_exception_dates_date ON exception_dates(exception_date);
```

**Ưu điểm:**
- ✅ Dễ query exception theo ngày
- ✅ Default schedule vẫn linh hoạt
- ✅ Cân bằng giữa đơn giản và chức năng

**Nhược điểm:**
- ❌ Không đồng nhất (nửa table, nửa JSONB)
- ❌ Default schedule vẫn khó query

---

## 3. So Sánh Các Phương Án

| Tiêu chí | Phương Án A (SQL) | Phương Án B (JSONB) | Phương Án C (Hybrid) |
|----------|-------------------|---------------------|----------------------|
| **Độ phức tạp triển khai** | Trung bình | Thấp | Thấp |
| **Khả năng query** | Cao | Thấp | Trung bình |
| **Validation DB** | Có | Không | Một phần |
| **Hỗ trợ split-shift** | Có | Có | Có |
| **Hỗ trợ multi-location** | Dễ mở rộng | Khó | Trung bình |
| **Tương thích OR-Tools** | Tốt | Cần convert | Trung bình |
| **Performance (nhiều exception)** | Tốt | Giảm | Tốt |
| **Phù hợp dự án hiện tại** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 4. Đề Xuất Cuối Cùng

### 4.1. Khuyến Nghị: **Phương Án A (Bảng SQL Chuẩn Hóa)**

**Lý do:**
1. **Tương thích với thiết kế hiện tại:** Dự án đã có các bảng SQL chuẩn (`shifts`, `staff_schedules`). Việc thêm `regular_operating_hours` và `exception_dates` nhất quán với kiến trúc.

2. **OR-Tools Integration:** Khi tích hợp OR-Tools cho slot calculation, việc query từ bảng SQL đơn giản hơn nhiều so với parse JSONB.

3. **Validation chặt chẽ:** Database constraints đảm bảo dữ liệu hợp lệ (close_time > open_time).

4. **Khả năng mở rộng:** Dễ dàng thêm `location_id` nếu Spa mở rộng thành chuỗi.

5. **Performance:** Index trên `exception_date` giúp query nhanh hơn scan toàn bộ JSONB.

### 4.2. Kế Hoạch Triển Khai

```
Phase 1: Database Migration (Ngày 1)
├── Tạo bảng regular_operating_hours
├── Tạo bảng exception_dates
├── Migrate dữ liệu từ system_configurations
└── Giữ lại system_configurations cũ (backup)

Phase 2: Backend API (Ngày 2-3)
├── GET /api/operating-hours (lấy lịch tuần + exceptions)
├── PUT /api/operating-hours (cập nhật lịch tiêu chuẩn)
├── POST /api/exception-dates (thêm ngày ngoại lệ)
├── DELETE /api/exception-dates/:id (xóa ngày ngoại lệ)
└── GET /api/slots/available (tính slot khả dụng - OR-Tools)

Phase 3: Frontend Refactor (Ngày 4-5)
├── Cập nhật types.ts theo schema mới
├── Cập nhật actions.ts gọi API thực
└── Test UI trên Settings page
```

---

## 5. Tham Khảo

### 5.1. Industry Best Practices
- **Salesforce Scheduler:** Sử dụng ResourceAbsences table cho exception dates
- **Cal.com (Open Source):** Bảng `Availability` với `days` và `startTime/endTime`
- **Zendesk:** Business hours API với holidays overlay

### 5.2. PostgreSQL Recommendations
- Sử dụng `SMALLINT` cho `day_of_week` (tiết kiệm storage so với ENUM)
- Partial index cho `exception_date >= CURRENT_DATE` (chỉ query tương lai)
- Trigger `update_modified_column()` đã có sẵn trong schema

---

## 6. Kết Luận

Với yêu cầu hiện tại của dự án Synapse và kế hoạch tích hợp OR-Tools trong tương lai, **Phương Án A (Bảng SQL Chuẩn Hóa)** là lựa chọn tốt nhất. Phương án này đảm bảo:

- Tính nhất quán với kiến trúc database hiện có
- Khả năng query hiệu quả cho availability calculation
- Validation dữ liệu chặt chẽ ở mức database
- Dễ dàng mở rộng trong tương lai

**Ghi chú:** Phương án hiện tại (JSONB) không sai, chỉ là không tối ưu cho các use case phức tạp như OR-Tools integration và multi-location.
