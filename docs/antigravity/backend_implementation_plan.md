# Kế Hoạch Triển Khai Backend - Synapse

**Ngày tạo:** 2025-12-19
**Phiên bản:** 1.0
**Trạng thái:** Đang triển khai

---

## 1. PHÂN TÍCH HIỆN TRẠNG (Gap Analysis)

### 1.1. Modules Đã Triển Khai ✅

| Module | Router | Service | Models | Trạng thái | Ghi chú |
|--------|--------|---------|--------|------------|---------|
| **users** | ✅ 6 endpoints | ✅ | ✅ | **Hoàn thành** | CRUD + Auth dependency |
| **staff** | ✅ 7 endpoints | ✅ | ✅ | **Hoàn thành** | Invite, Skills, Deactivate |
| **services** | ✅ 10 endpoints | ✅ | ✅ | **Hoàn thành** | CRUD + Skills + Smart Tagging |
| **resources** | ✅ 11 endpoints | ✅ | ✅ | **Hoàn thành** | Groups + Resources CRUD |
| **schedules** | ✅ 14 endpoints | ✅ | ✅ | **Hoàn thành** | Shifts + StaffSchedules + Availability |
| **bookings** | ✅ 15 endpoints | ✅ | ✅ | **Hoàn thành** | CRUD + Items + Status Transitions + Conflict Check |
| **scheduling_engine** | ✅ 5 endpoints | ✅ | ✅ | **Hoàn thành** | OR-Tools Solver + Evaluator |

**Tổng cộng đã triển khai: 7 modules, ~68 endpoints**

---

### 1.2. Modules CHƯA Triển Khai ❌

| Module | Mức độ ưu tiên | Use Cases liên quan | Ghi chú |
|--------|---------------|---------------------|---------|
| **customers** | 🔴 **Cao** | B1.2, B1.3 (Quản lý hồ sơ khách) | **Thiếu nghiêm trọng** - Bảng customers tách biệt users |
| **customer_treatments** | 🔴 **Cao** | B1.7 (Theo dõi liệu trình) | Punch Card logic |
| **invoices** | 🟡 **Trung bình** | B1.5 (Xử lý thanh toán) | Tạo hóa đơn sau completing |
| **payments** | 🟡 **Trung bình** | B1.5 | Thu tiền, phương thức TT |
| **notifications** | 🟡 **Trung bình** | A3.3 (Nhắc lịch) | WebSocket/Push |
| **operating_hours** | 🟡 **Trung bình** | Algorithm H07 | Giờ mở cửa + Exception dates |
| **reviews** | 🟢 **Thấp** | Phụ lục A3.4 | Rating sau dịch vụ |
| **chat** | 🟢 **Thấp** | A2.7, B1.6 | Live Chat (Phụ lục) |
| **service_categories** | 🟢 **Thấp** | A2.1 | Phân loại dịch vụ |
| **service_packages** | 🟢 **Thấp** | Phụ lục C6 | Combo nhiều dịch vụ |

---

### 1.3. Tính Năng THIẾU Trong Modules Hiện Tại

| Module | Tính năng thiếu | Use Case | Ghi chú |
|--------|-----------------|----------|---------|
| **bookings** | Trừ buổi liệu trình khi check-in | B1.4 | Cần tích hợp customer_treatments |
| **bookings** | Gắn customer_id (không phải user_id) | B1.3 | Cần bảng customers |
| **schedules** | regular_operating_hours | Algorithm H07 | Giờ mở cửa Spa |
| **schedules** | exception_dates | Algorithm H07 | Ngày nghỉ lễ |
| **services** | service_resource_requirements | Algorithm H05 | Yêu cầu nhóm tài nguyên |

---

## 2. KẾ HOẠCH TRIỂN KHAI THEO GIAI ĐOẠN

### GIAI ĐOẠN 1: Core CRM - Customers (Ưu tiên cao nhất)
**Thời gian dự kiến:** 2-3 ngày
**Mục tiêu:** Hoàn thiện module quản lý khách hàng tách biệt với Users

#### Tasks:
- [ ] **1.1** Tạo module `src/modules/customers/`
  - [ ] `models.py` - Customer entity theo `database_design.md`
  - [ ] `schemas.py` - CustomerCreate, CustomerRead, CustomerUpdate
  - [ ] `service.py` - CRUD + Tìm kiếm theo phone/name
  - [ ] `router.py` - API endpoints
  - [ ] `__init__.py` - Public API

- [ ] **1.2** Endpoints cần có:
- [x] **2. Customer Treatment (Liệu trình)** (Phase 2 - High)
  - *Lý do*: Cần thiết để quản lý khách mua gói (tránh booking lẻ tẻ).
  - *Dependencies*: `customers`, `services`.
  - `GET /customers` - Danh sách + phân trang + tìm kiếm
  - `POST /customers` - Tạo hồ sơ khách mới (vãng lai)
  - `GET /customers/{id}` - Chi tiết
  - `PUT /customers/{id}` - Cập nhật
  - `GET /customers/phone/{phone}` - Tìm theo SĐT
  - `POST /customers/{id}/link-account` - Liên kết user_id (nếu KH đăng ký App)

- [ ] **1.3** Cập nhật module `bookings`:
  - Thay đổi reference từ `user_id` → `customer_id`
  - Thêm logic tìm/tạo Customer khi đặt lịch

---

### GIAI ĐOẠN 2: Liệu Trình (Treatment Punch Card)
**Thời gian dự kiến:** 2 ngày
**Mục tiêu:** Hệ thống quản lý gói nhiều buổi

#### Tasks:
- [ ] **2.1** Tạo module `src/modules/treatments/`
  - [ ] `models.py` - CustomerTreatment entity
  - [ ] `schemas.py`
  - [ ] `service.py` - Logic trừ buổi, kiểm tra hết hạn
  - [ ] `router.py`

- [ ] **2.2** Endpoints:
  - `POST /treatments` - Tạo thẻ liệu trình (sau khi mua)
  - `GET /customers/{id}/treatments` - Liệu trình của khách
  - `GET /treatments/{id}` - Chi tiết liệu trình
  - `POST /treatments/{id}/punch` - Trừ 1 buổi (Internal API)

- [ ] **2.3** Tích hợp với Bookings:
  - Thêm trường `treatment_id` vào BookingItem
  - Logic auto-punch khi check-in (B1.4)

---

### GIAI ĐOẠN 3: Thanh Toán (Invoices & Payments)
**Thời gian dự kiến:** 2-3 ngày
**Mục tiêu:** Hệ thống hóa đơn và thu tiền

#### Tasks:
- [ ] **3.1** Tạo module `src/modules/billing/`
  - [ ] `models.py` - Invoice, Payment entities
  - [ ] `schemas.py`
  - [ ] `service.py` - Tạo hóa đơn từ booking, ghi nhận thanh toán
  - [ ] `router.py`

- [ ] **3.2** Endpoints Invoices:
  - `POST /bookings/{id}/invoice` - Tạo hóa đơn từ booking hoàn thành
  - `GET /invoices` - Danh sách hóa đơn
  - `GET /invoices/{id}` - Chi tiết
  - `PUT /invoices/{id}/status` - Cập nhật trạng thái

- [ ] **3.3** Endpoints Payments:
  - `POST /invoices/{id}/payments` - Ghi nhận thanh toán
  - `GET /invoices/{id}/payments` - Lịch sử thanh toán

---

### GIAI ĐOẠN 4: Giờ Hoạt Động & Thông Báo
**Thời gian dự kiến:** 2 ngày
**Mục tiêu:** Hoàn thiện ràng buộc thuật toán + Nhắc lịch

#### Tasks:
- [ ] **4.1** Mở rộng module `schedules`:
  - [ ] Thêm models: `RegularOperatingHours`, `ExceptionDates`
  - [ ] Endpoints CRUD cho operating hours
  - [ ] API kiểm tra ngày có mở cửa không

- [ ] **4.2** Tạo module `src/modules/notifications/`
  - [ ] `models.py` - Notification entity
  - [ ] `service.py` - Gửi thông báo (in-app)
  - [ ] `router.py` - Đọc thông báo

- [ ] **4.3** Logic nhắc lịch:
  - Background job kiểm tra bookings sắp đến
  - Tạo notification trước X giờ (cấu hình)

---

### GIAI ĐOẠN 5: Tích Hợp & Nâng Cao
**Thời gian dự kiến:** 3-4 ngày
**Mục tiêu:** Hoàn thiện các tính năng còn lại

#### Tasks:
- [ ] **5.1** Service Resource Requirements:
  - Thêm bảng liên kết `service_resource_requirements`
  - Cập nhật Scheduling Engine để check resource group

- [ ] **5.2** Service Categories:
  - Thêm CRUD cho categories
  - Gắn category_id vào services

- [ ] **5.3** Reviews (nếu có thời gian):
  - Module đánh giá sau dịch vụ
  - Rating 1-5 sao + comment

- [ ] **5.4** Cải thiện Security:
  - Hoàn thiện RLS injection
  - Rate limiting
  - Input sanitization

---

## 3. TỔNG KẾT TIẾN ĐỘ

| Giai đoạn | Trạng thái | Deadline dự kiến |
|-----------|------------|------------------|
| GĐ1: Customers | 🔴 Chưa bắt đầu | - |
| GĐ2: Treatments | 🔴 Chưa bắt đầu | - |
| GĐ3: Billing | 🔴 Chưa bắt đầu | - |
| GĐ4: Operating Hours & Notifications | 🔴 Chưa bắt đầu | - |
| GĐ5: Tích hợp | 🔴 Chưa bắt đầu | - |

---

## 4. DEPENDENCY MAP

```
                    ┌──────────────┐
                    │   PHASE 1    │
                    │  Customers   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │ PHASE 2  │ │ Bookings │ │ PHASE 3  │
       │Treatments│ │ (Update) │ │ Billing  │
       └────┬─────┘ └──────────┘ └────┬─────┘
            │                         │
            └───────────┬─────────────┘
                        ▼
                 ┌──────────────┐
                 │   PHASE 4    │
                 │ Op Hours +   │
                 │ Notifications│
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │   PHASE 5    │
                 │ Integration  │
                 └──────────────┘
```

---

## 5. GHI CHÚ QUAN TRỌNG

### 5.1. Quy tắc Code (Tuân thủ `.agent/rules/backend.md`)
- ✅ Async All The Way (`async def`, `await`)
- ✅ Service as Dependency
- ✅ Guard Clauses / Early Return
- ✅ Pydantic V2 (`model_config = ConfigDict(...)`)
- ✅ Python 3.12+ syntax (`X | Y`, `list[X]`)
- ✅ Tiếng Việt trong Docstrings và Error messages

### 5.2. Database
- Sử dụng SQLModel với `table=True`
- Tất cả ID là UUID
- Soft Delete với `deleted_at` timestamp
- Relationship loading: `selectinload()` cho N+1 prevention

### 5.3. API Design
- RESTful conventions
- Prefix: `/api/v1`
- Response models với Pydantic
- HTTPException với status code phù hợp
- Docstrings Markdown cho Swagger UI

---

*Lưu ý: Kế hoạch này là roadmap tổng quan. Chi tiết từng task sẽ được cập nhật khi bắt đầu triển khai.*
