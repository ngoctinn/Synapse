# Kế hoạch Refactor Database Backend - Synapse v2.2

**Ngày tạo:** 27/12/2025
**Trạng thái:** Chờ phê duyệt

---

## 1. Vấn đề (Problem Statement)

Sau khi rà soát kỹ lưỡng Backend code `backend/src/modules/**/models.py` và so sánh với:
1. Tài liệu thiết kế (`docs/design/database_design.md` & `data_specification.md`)
2. Database thực tế trên Supabase (project `pvyngyztqwytkhpqpyyy`)

Phát hiện nhiều **bất đồng bộ nghiêm trọng** giữa 3 nguồn trên.

---

## 2. Danh sách vấn đề phát hiện

### 2.1. Khác biệt về tên bảng (Table Naming)

| Thiết kế (Tài liệu) | Backend Model | Database thực | Trạng thái |
|:---|:---|:---|:---|
| `staff_profiles` | `Staff` → `staff` | `staff` | ⚠️ Model & DB khớp, Tài liệu cần cập nhật |
| `service_required_skills` | `ServiceSkill` → `service_skills` | `service_skills` | ⚠️ Model & DB khớp, Tài liệu cần cập nhật |
| `waitlist` | `WaitlistEntry` → `waitlist_entries` | `waitlist_entries` | ⚠️ Model & DB khớp, Tài liệu cần cập nhật |

**Nhận xét:** Backend Models và Database đã KHỚP với nhau. Vấn đề nằm ở **Tài liệu thiết kế cần được cập nhật**.

---

### 2.2. Kiểu dữ liệu tài chính (Decimal vs Float)

| Bảng | Cột | Model (Backend) | Database thực | Chuẩn v2.2 | Trạng thái |
|:---|:---|:---|:---|:---|:---|
| `services` | `price` | `float` | `double precision` | `DECIMAL(12,2)` | ❌ Cần sửa |
| `staff` | `commission_rate` | `float` | `double precision` | `DECIMAL(5,2)` | ❌ Cần sửa |

**Giải pháp:**
1. Sửa Backend Model sang `Decimal` với `sa_type=DECIMAL(...)`.
2. Tạo Alembic migration để ALTER COLUMN trong DB.

---

### 2.3. Cột dư thừa trong bảng `users` (Technical Debt)

Theo thiết kế v2.2, bảng `users` chỉ quản lý Auth, không chứa thông tin CRM.

| Cột dư thừa | Hiện trạng Model | Hiện trạng DB | Hành động đề xuất |
|:---|:---|:---|:---|
| `phone_number` | Có | Có | Xóa khỏi Model & DB |
| `address` | Có | Có | Xóa khỏi Model & DB |
| `date_of_birth` | Có | Có | Xóa khỏi Model & DB |

**Lưu ý quan trọng:** Trước khi xóa, cần **migrate dữ liệu** từ `users` sang `customers` (nếu có liên kết).

---

### 2.4. Cột dư thừa trong bảng `booking_items`

| Cột | Hiện trạng Model | Hiện trạng DB | Hành động |
|:---|:---|:---|:---|
| `resource_id` | ❌ Đã xóa | ✅ Vẫn còn | Tạo migration xóa cột |

**Giải thích:** Model đã được refactor để dùng bảng trung gian `booking_item_resources`. Nhưng DB vẫn còn cột cũ.

---

### 2.5. ENUMs không đồng bộ

| Enum (Model/Thiết kế) | Enum (Database) | Vấn đề |
|:---|:---|:---|
| `user_role` (Enum) | `character varying` | DB không dùng Enum thật |
| `membership_tier` (Enum) | `character varying` | DB không dùng Enum thật |
| `gender` (Enum) | `character varying` | DB không dùng Enum thật |
| `payment_method` | `paymentmethod` | Khác tên (snake_case vs lowercase) |
| `invoice_status` | `invoicestatus` | Khác tên |
| `exception_type` | `exception_date_type` | Khác tên |

**Phân tích:**
-  Việc DB dùng `VARCHAR` thay vì Enum thật không sai về logic, nhưng giảm Type Safety ở tầng DB.
-  Model Python sử dụng `SAEnum` sẽ tự tạo Enum trong DB khi chạy migration. Nếu DB đang dùng VARCHAR, cần migration chuyển đổi.

---

### 2.6. Các bảng còn thiếu trong Database

| Module | Bảng (Thiết kế) | Có trong Model | Có trong DB | Ưu tiên |
|:---|:---|:---|:---|:---|
| Billing | `invoices` | ✅ | ✅ | N/A |
| Billing | `payments` | ✅ | ✅ | N/A |
| Reviews | `reviews` | ❌ | ❌ | Thấp (Feature chưa phát triển) |
| Packages | `service_packages` | ❌ | ❌ | Trung bình |
| Packages | `package_services` | ❌ | ❌ | Trung bình |
| Notifications | `notifications` | ❌ | ❌ | Thấp |
| System | `audit_logs` | ❌ | ❌ | Thấp |
| Chat | `chat_sessions`, `chat_messages` | ❌ | ❌ | Thấp |

---

## 3. Lộ trình Refactor (Proposed Roadmap)

### Phase 1: Cập nhật Tài liệu Thiết kế (Low Risk)
**Mục tiêu:** Đồng bộ tài liệu với thực tế (Code & DB đang khớp).

| Task | File | Hành động |
|:---|:---|:---|
| 1.1 | `database_design.md` | Đổi `staff_profiles` → `staff` |
| 1.2 | `database_design.md` | Đổi `service_required_skills` → `service_skills` |
| 1.3 | `data_specification.md` | Cập nhật tương ứng |

---

### Phase 2: Fix Kiểu Dữ Liệu Tài Chính (Medium Risk)
**Mục tiêu:** Đảm bảo độ chính xác khi tính toán tiền.

| Task | File | Hành động |
|:---|:---|:---|
| 2.1 | `services/models.py` | `price: float` → `price: Decimal = Field(sa_type=DECIMAL(12,2))` |
| 2.2 | `staff/models.py` | `commission_rate: float` → `commission_rate: Decimal = Field(sa_type=DECIMAL(5,2))` |
| 2.3 | Alembic Migration | ALTER TABLE `services`, `staff` |

---

### Phase 3: Xóa Cột Dư Thừa (Medium-High Risk)
**Mục tiêu:** Làm sạch bảng `users` theo thiết kế v2.2.

| Task | Hành động | Rủi ro |
|:---|:---|:---|
| 3.1 | Kiểm tra có dữ liệu trong `users.phone_number`, `users.address`, `users.date_of_birth` | - |
| 3.2 | Nếu có, tạo script migrate sang `customers` | Cao |
| 3.3 | Xóa các cột khỏi `User` model | Trung bình |
| 3.4 | Tạo Alembic migration DROP COLUMN | Cao |
| 3.5 | Xóa cột `resource_id` trong `booking_items` | Trung bình |

---

### Phase 4: Chuẩn hóa ENUMs (Low Risk, Cải thiện)
**Mục tiêu:** Đảm bảo Type Safety ở tầng DB.

> **Đề xuất tạm hoãn:** Việc convert VARCHAR → ENUM trong Postgres phức tạp và có thể gây downtime. Chỉ nên làm khi có thời gian padding hoặc trong lần upgrade lớn.

---

### Phase 5: Thêm Các Bảng Còn Thiếu (Future Work)
**Mục tiêu:** Hoàn thiện nghiệp vụ theo roadmap sản phẩm.

| Bảng | Milestone dự kiến |
|:---|:---|
| `reviews` | M6 hoặc sau |
| `service_packages`, `package_services` | M7 (Combo Feature) |
| `notifications` | M8 |
| `audit_logs` | Post-MVP |

---

## 4. Kế hoạch Verification

Sau mỗi Phase:

1. **Backend Linting:**
   ```bash
   cd backend && ruff check src/
   ```

2. **Alembic Check:**
   ```bash
   cd backend && alembic check
   ```

3. **Test Migration (Dry Run):**
   ```bash
   cd backend && alembic upgrade head --sql
   ```

---

## 5. Ràng buộc & Rủi ro

| Ràng buộc | Giải pháp |
|:---|:---|
| Không làm gián đoạn dịch vụ | Thực hiện migration trong maintenance window hoặc tạo migration an toàn (additive first) |
| Dữ liệu cũ không được mất | Backup trước khi thực hiện DROP COLUMN |
| Frontend đang sử dụng API | Đảm bảo Schema thay đổi backward-compatible |

---

## 6. Câu hỏi cần User phê duyệt

> [!IMPORTANT]
> **Các câu hỏi cần quyết định trước khi thực thi:**

1. **Phase 1:** Có đồng ý cập nhật tài liệu thiết kế để khớp với thực tế (Code & DB) không?

2. **Phase 3:** Có muốn thực hiện việc xóa các cột dư thừa (`phone_number`, `address`, `date_of_birth`) khỏi bảng `users` trong lần refactor này không? Hay để lại cho lần upgrade lớn hơn?

3. **Phase 4:** Có muốn migrate ENUMs từ VARCHAR sang Native Postgres ENUM không? (Phức tạp, khuyến nghị hoãn)

4. **Thứ tự ưu tiên:** Muốn làm Phase nào trước?
   - [ ] Phase 1 (Tài liệu)
   - [ ] Phase 2 (Decimal)
   - [ ] Phase 3 (Xóa cột dư)

---

## Phụ lục: File liên quan

- `backend/src/modules/users/models.py`
- `backend/src/modules/staff/models.py`
- `backend/src/modules/services/models.py`
- `backend/src/modules/customers/models.py`
- `backend/src/modules/bookings/models.py`
- `backend/alembic/versions/` (sẽ tạo migration mới)
- `docs/design/database_design.md`
- `docs/design/data_specification.md`
