# Backend Database Refactor - Analysis Log

**Ngày:** 27/12/2025
**Người thực hiện:** Agent

---

## 1. Phạm vi rà soát

### 1.1. Các module đã kiểm tra

| Module | File Model | Số dòng | Trạng thái |
|:---|:---|:---:|:---|
| `users` | `models.py` | 46 | ✅ Đã rà soát |
| `staff` | `models.py` | 82 | ✅ Đã rà soát |
| `customers` | `models.py` | 58 | ✅ Đã rà soát |
| `services` | `models.py` | 128 | ✅ Đã rà soát |
| `bookings` | `models.py` | 227 | ✅ Đã rà soát |
| `billing` | `models.py` | 72 | ✅ Đã rà soát |
| `resources` | `models.py` | 111 | ✅ Đã rà soát |
| `customer_treatments` | `models.py` | 53 | ✅ Đã rà soát |
| `warranty` | `models.py` | 39 | ✅ Đã rà soát |

### 1.2. Nguồn tham chiếu

- **Tài liệu thiết kế:** `docs/design/database_design.md` (v2.2)
- **Tài liệu đặc tả:** `docs/design/data_specification.md` (v2.2)
- **Database thực tế:** Supabase project `Synapse` (ID: `pvyngyztqwytkhpqpyyy`)

---

## 2. Kết quả phân tích chi tiết

### 2.1. Module `users`

**File:** `backend/src/modules/users/models.py`

| Vấn đề | Mô tả | Mức độ |
|:---|:---|:---|
| Cột dư thừa | Còn `phone_number`, `address`, `date_of_birth` - không cần theo v2.2 | ⚠️ Trung bình |
| Enum Type | `role` dùng `SAEnum(UserRole)` - đúng chuẩn | ✅ OK |
| Timestamp | Có `created_at`, `updated_at` - đúng chuẩn | ✅ OK |

**Kết luận:** Cần xóa 3 cột dư thừa để đúng thiết kế v2.2.

---

### 2.2. Module `staff`

**File:** `backend/src/modules/staff/models.py`

| Vấn đề | Mô tả | Mức độ |
|:---|:---|:---|
| Tên bảng | `__tablename__ = "staff"` - khác tài liệu (`staff_profiles`) | ⚠️ Cần cập nhật tài liệu |
| `commission_rate` | Kiểu `float`, cần `Decimal(5,2)` | ❌ Nghiêm trọng |
| Thiếu `phone_number` | Model không có, DB cũng không cần vì lấy từ `users` | ✅ OK |

**Kết luận:** Fix kiểu dữ liệu `commission_rate`.

---

### 2.3. Module `customers`

**File:** `backend/src/modules/customers/models.py`

| Vấn đề | Mô tả | Mức độ |
|:---|:---|:---|
| Cấu trúc | Đầy đủ theo v2.2: phone, email, user_id, loyalty... | ✅ OK |
| `membership_tier` | Dùng `SAEnum(MembershipTier)` | ✅ OK |
| `gender` | Dùng `SAEnum(Gender)` | ✅ OK |
| Soft Delete | Có `deleted_at` | ✅ OK |

**Kết luận:** Module này đã chuẩn.

---

### 2.4. Module `services`

**File:** `backend/src/modules/services/models.py`

| Vấn đề | Mô tả | Mức độ |
|:---|:---|:---|
| `price` | Kiểu `float`, cần `Decimal(12,2)` | ❌ Nghiêm trọng |
| Tên bảng trung gian | `service_skills` - khác tài liệu (`service_required_skills`) | ⚠️ Cần cập nhật tài liệu |
| Relationships | Có đầy đủ: category, skills, resource_requirements | ✅ OK |

**Kết luận:** Fix kiểu dữ liệu `price`.

---

### 2.5. Module `bookings`

**File:** `backend/src/modules/bookings/models.py`

| Vấn đề | Mô tả | Mức độ |
|:---|:---|:---|
| `total_price` | Dùng `Decimal` với `DECIMAL(12,2)` | ✅ OK |
| `original_price` (booking_items) | Dùng `Decimal` với `DECIMAL(12,2)` | ✅ OK |
| `resource_id` cột đơn | Đã xóa khỏi Model, dùng bảng trung gian | ✅ OK |
| FK relationships | Đầy đủ: customer, creator, items, treatment_notes | ✅ OK |

**Kết luận:** Module này đã tốt, nhưng DB còn cột `resource_id` cũ cần xóa.

---

### 2.6. Module `billing`

**File:** `backend/src/modules/billing/models.py`

| Vấn đề | Mô tả | Mức độ |
|:---|:---|:---|
| `InvoiceStatus` | Có 5 giá trị (DRAFT, UNPAID, PARTIALLY_PAID, PAID, VOID) - nhiều hơn thiết kế (3) | ⚠️ OK, mở rộng hợp lý |
| `PaymentMethod` | 4 giá trị, DB enum là `paymentmethod` | ⚠️ Khác tên |
| Decimal fields | `amount`, `total_amount`... đều dùng `Decimal` | ✅ OK |

**Kết luận:** Module này ổn.

---

### 2.7. Module `resources`

**File:** `backend/src/modules/resources/models.py`

| Vấn đề | Mô tả | Mức độ |
|:---|:---|:---|
| Cấu trúc nhóm | Có `ResourceGroup` và `Resource` - đúng thiết kế | ✅ OK |
| `ServiceResourceRequirement` | Bảng trung gian đúng chuẩn | ✅ OK |
| Enums | `ResourceType`, `ResourceStatus` - dùng `SAEnum` | ✅ OK |

**Kết luận:** Module này chuẩn.

---

### 2.8. Module `customer_treatments`

**File:** `backend/src/modules/customer_treatments/models.py`

| Vấn đề | Mô tả | Mức độ |
|:---|:---|:---|
| Cấu trúc | Đủ: customer_id, service_id, total/used_sessions, expiry_date, status | ✅ OK |
| `TreatmentStatus` | 3 giá trị: ACTIVE, COMPLETED, EXPIRED | ✅ OK |

**Kết luận:** Module này chuẩn.

---

### 2.9. Module `warranty`

**File:** `backend/src/modules/warranty/models.py`

| Vấn đề | Mô tả | Mức độ |
|:---|:---|:---|
| FK to treatment | `treatment_id` → `customer_treatments.id` | ✅ OK |
| `images` | Dùng `ARRAY(String)` - đúng PostgreSQL | ✅ OK |
| `WarrantyStatus` | 4 giá trị: PENDING, APPROVED, REJECTED, RESOLVED | ✅ OK |

**Kết luận:** Module này chuẩn.

---

## 3. So sánh với Database thực tế

### 3.1. Các bảng đã có trong DB

```
users, staff, customers, services, service_categories, skills, service_skills,
staff_skills, shifts, staff_schedules, bookings, booking_items,
booking_item_resources, customer_treatments, invoices, payments,
warranty_tickets, treatment_notes, regular_operating_hours, exception_dates,
promotions, resource_groups, resources, service_resource_requirements,
notification_templates, waitlist_entries
```

### 3.2. Các bảng thiếu (so với thiết kế v2.2)

- `reviews`
- `notifications` (chỉ có `notification_templates`)
- `audit_logs`
- `service_packages`
- `package_services`
- `chat_sessions`
- `chat_messages`

---

## 4. Dependencies (Ảnh hưởng khi thay đổi)

### 4.1. Thay đổi `services.price` → Decimal

| File bị ảnh hưởng | Lý do |
|:---|:---|
| `services/schemas.py` | Có thể cần update type hint |
| `services/service.py` | Logic tính toán |
| `bookings/service.py` | Snapshot price vào booking |
| `billing/service.py` | Tính hóa đơn |

### 4.2. Thay đổi `staff.commission_rate` → Decimal

| File bị ảnh hưởng | Lý do |
|:---|:---|
| `staff/schemas.py` | Type hint |
| `billing/service.py` | Tính hoa hồng |

### 4.3. Xóa cột trong `users`

| File bị ảnh hưởng | Lý do |
|:---|:---|
| `users/models.py` | Xóa field |
| `users/schemas.py` | Xóa field trong DTO |
| `users/service.py` | Logic có thể reference |
| Frontend API consumers | Cần kiểm tra |

---

## 5. Kết luận tổng quan

| Hạng mục | Model (Code) | Database | Tài liệu |
|:---|:---|:---|:---|
| Tên bảng | ✅ Chuẩn | ✅ Khớp với Model | ⚠️ Cần cập nhật |
| Kiểu dữ liệu tài chính | ❌ Một số dùng float | ❌ Dùng double precision | ✅ Yêu cầu Decimal |
| Cột dư thừa `users` | ❌ Còn tồn tại | ❌ Còn tồn tại | ✅ Yêu cầu xóa |
| ENUMs | ✅ Dùng Python Enum | ⚠️ Một số là VARCHAR | ✅ Mong đợi Native Enum |
| Bảng còn thiếu | ❌ Chưa có | ❌ Chưa có | ✅ Đã định nghĩa |

**Ưu tiên sửa:**
1. ❌ Kiểu dữ liệu tài chính (Cao - Ảnh hưởng accuracy)
2. ⚠️ Cột dư thừa (Trung bình - Technical Debt)
3. ⚠️ Tài liệu (Thấp - Không ảnh hưởng runtime)
