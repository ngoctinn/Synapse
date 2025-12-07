# ĐẶC TẢ CƠ SỞ DỮ LIỆU HỆ THỐNG SYNAPSE

**Phiên bản:** 2.0
**Ngày cập nhật:** 2025-12-07
**Tác giả:** Synapse Development Team
**Hệ quản trị CSDL:** PostgreSQL 14+ (Supabase)

---

## MỤC LỤC

1. [Tổng quan](#1-tổng-quan)
2. [Kiểu dữ liệu tùy chỉnh (ENUM)](#2-kiểu-dữ-liệu-tùy-chỉnh-enum)
3. [Đặc tả các bảng dữ liệu](#3-đặc-tả-các-bảng-dữ-liệu)
4. [Ma trận quan hệ giữa các bảng](#4-ma-trận-quan-hệ-giữa-các-bảng)
5. [Ràng buộc toàn vẹn](#5-ràng-buộc-toàn-vẹn)
6. [Chiến lược đánh chỉ mục](#6-chiến-lược-đánh-chỉ-mục)
7. [Chính sách bảo mật (RLS)](#7-chính-sách-bảo-mật-rls)
8. [Quy tắc nghiệp vụ](#8-quy-tắc-nghiệp-vụ)

---

## 1. TỔNG QUAN

### 1.1. Mục đích

Tài liệu này đặc tả chi tiết cấu trúc cơ sở dữ liệu cho hệ thống **Synapse** - nền tảng quản lý khách hàng (CRM) chuyên biệt cho ngành Spa tại Việt Nam.

### 1.2. Phạm vi

Cơ sở dữ liệu bao gồm **18 bảng chính** được tổ chức thành **10 module nghiệp vụ**:

| STT | Module | Số bảng | Mô tả chức năng |
|:---:|:---|:---:|:---|
| 1 | Users & Profiles | 3 | Quản lý người dùng và hồ sơ chi tiết |
| 2 | Skills | 2 | Kỹ năng chuyên môn của nhân viên |
| 3 | Services | 3 | Danh mục dịch vụ Spa |
| 4 | Resources | 2 | Quản lý phòng và thiết bị |
| 5 | Scheduling | 2 | Lịch làm việc nhân viên |
| 6 | Bookings | 3 | Đặt lịch hẹn và liệu trình |
| 7 | Billing | 2 | Hóa đơn và thanh toán |
| 8 | Reviews | 1 | Đánh giá khách hàng |
| 9 | Notifications | 1 | Thông báo hệ thống |
| 10 | System | 2 | Cấu hình và nhật ký |

### 1.3. Quy ước đặt tên

| Đối tượng | Quy tắc | Ví dụ |
|:---|:---|:---|
| Tên bảng | snake_case, số nhiều | `booking_items`, `staff_profiles` |
| Tên cột | snake_case | `created_at`, `customer_id` |
| Khóa chính | `id` (UUID) | `bookings.id` |
| Khóa ngoại | `<table>_id` hoặc `<context>_id` | `customer_id`, `staff_id` |
| Cột thời gian | `*_at` hoặc `*_date` | `created_at`, `expiry_date` |
| Cột trạng thái | `status` hoặc `is_*` | `status`, `is_active` |

---

## 2. KIỂU DỮ LIỆU TÙY CHỈNH (ENUM)

### 2.1. `user_role` - Vai trò người dùng

| Giá trị | Tên tiếng Việt | Mô tả |
|:---|:---|:---|
| `admin` | Quản trị viên | Toàn quyền quản lý hệ thống, tài khoản, cấu hình |
| `receptionist` | Lễ tân | Quản lý booking, check-in, thanh toán, tạo lịch cho khách vãng lai |
| `technician` | Kỹ thuật viên (KTV) | Xem lịch cá nhân, cập nhật trạng thái buổi làm, ghi chú chuyên môn |
| `customer` | Khách hàng | Đặt/hủy lịch, xem liệu trình, tích điểm, đánh giá dịch vụ |

### 2.2. `membership_tier` - Hạng thành viên

| Giá trị | Điều kiện | Quyền lợi |
|:---|:---|:---|
| `SILVER` | Mặc định (0+ điểm) | Tích điểm cơ bản |
| `GOLD` | 500+ điểm | Giảm giá 5%, ưu tiên đặt lịch |
| `PLATINUM` | 2000+ điểm | Giảm giá 10%, dịch vụ VIP |

### 2.3. `resource_type` - Loại tài nguyên

| Giá trị | Mô tả | Ví dụ |
|:---|:---|:---|
| `ROOM` | Phòng điều trị | Phòng Massage VIP, Phòng Facial |
| `EQUIPMENT` | Thiết bị máy móc | Máy xông hơi, Máy chăm sóc da |

### 2.4. `resource_status` - Trạng thái tài nguyên

| Giá trị | Mô tả | Có thể sử dụng? |
|:---|:---|:---:|
| `ACTIVE` | Đang hoạt động bình thường | ✅ Có |
| `MAINTENANCE` | Đang bảo trì | ❌ Không |
| `INACTIVE` | Ngừng sử dụng vĩnh viễn | ❌ Không |

### 2.5. `booking_status` - Trạng thái lịch hẹn

| Giá trị | Tên tiếng Việt | Mô tả | Hành động tiếp theo |
|:---|:---|:---|:---|
| `PENDING` | Chờ xác nhận | Khách vừa đặt, chờ xác nhận | Confirm hoặc Cancel |
| `CONFIRMED` | Đã xác nhận | Lịch hẹn được chấp nhận | Check-in khi khách đến |
| `IN_PROGRESS` | Đang thực hiện | Khách đang được phục vụ | Complete khi xong |
| `COMPLETED` | Hoàn thành | Dịch vụ đã hoàn tất | Thanh toán, Đánh giá |
| `CANCELLED` | Đã hủy | Lịch hẹn bị hủy | Không có |
| `NO_SHOW` | Khách không đến | Khách không đến theo lịch | Không có |

### 2.6. `invoice_status` - Trạng thái hóa đơn

| Giá trị | Mô tả |
|:---|:---|
| `UNPAID` | Chưa thanh toán |
| `PAID` | Đã thanh toán đủ |
| `REFUNDED` | Đã hoàn tiền |

### 2.7. `payment_method` - Phương thức thanh toán

| Giá trị | Mô tả |
|:---|:---|
| `CASH` | Tiền mặt |
| `CARD` | Thẻ ngân hàng (POS) |
| `TRANSFER` | Chuyển khoản |

### 2.8. `treatment_status` - Trạng thái gói liệu trình

| Giá trị | Mô tả | Điều kiện |
|:---|:---|:---|
| `ACTIVE` | Đang hoạt động | Còn buổi và chưa hết hạn |
| `COMPLETED` | Đã hoàn thành | `used_sessions = total_sessions` |
| `EXPIRED` | Đã hết hạn | Quá `expiry_date` |

### 2.9. `schedule_status` - Trạng thái lịch làm việc

| Giá trị | Mô tả |
|:---|:---|
| `DRAFT` | Bản nháp, chưa công bố cho nhân viên |
| `PUBLISHED` | Đã công bố, nhân viên có thể xem |

---

## 3. ĐẶC TẢ CÁC BẢNG DỮ LIỆU

### 3.1. MODULE: USERS & PROFILES

#### Bảng `users`

**Mục đích:** Lưu trữ thông tin xác thực và hồ sơ cơ bản của tất cả người dùng hệ thống. Đồng bộ với Supabase Auth.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính, đồng nhất với Supabase Auth ID |
| `email` | VARCHAR(255) | ✅ | - | UNIQUE | Địa chỉ email đăng nhập |
| `full_name` | VARCHAR(255) | ❌ | NULL | - | Họ và tên đầy đủ |
| `phone_number` | VARCHAR(50) | ❌ | NULL | UNIQUE (partial) | Số điện thoại (unique khi không null) |
| `avatar_url` | TEXT | ❌ | NULL | - | Đường dẫn ảnh đại diện |
| `role` | user_role | ✅ | 'customer' | - | Vai trò trong hệ thống |
| `is_active` | BOOLEAN | ✅ | TRUE | - | Tài khoản có đang hoạt động không |
| `deleted_at` | TIMESTAMPTZ | ❌ | NULL | - | Thời điểm xóa mềm (NULL = chưa xóa) |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | - | Thời điểm tạo tài khoản |
| `updated_at` | TIMESTAMPTZ | ✅ | NOW() | Auto-update | Thời điểm cập nhật gần nhất |

**Ghi chú:**
- Sử dụng **Soft Delete** thay vì xóa vật lý để bảo toàn dữ liệu lịch sử
- Cột `phone_number` chỉ unique khi không NULL và chưa bị xóa

---

#### Bảng `staff_profiles`

**Mục đích:** Lưu trữ thông tin mở rộng cho nhân viên (Lễ tân, KTV). Quan hệ 1-1 với bảng `users`.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `user_id` | UUID | ✅ | - | PK, FK → users | Khóa chính, liên kết đến users |
| `title` | VARCHAR(100) | ✅ | - | - | Chức danh (VD: "Senior Stylist") |
| `bio` | TEXT | ❌ | NULL | - | Giới thiệu ngắn về kỹ năng/kinh nghiệm |
| `color_code` | VARCHAR(7) | ❌ | '#6366F1' | - | Mã màu hiển thị trên lịch (HEX) |
| `commission_rate` | DECIMAL(5,2) | ❌ | 0.0 | CHECK 0-100 | Tỷ lệ hoa hồng (%) trên doanh thu dịch vụ |
| `hired_at` | DATE | ❌ | CURRENT_DATE | - | Ngày bắt đầu làm việc |

**Quy tắc nghiệp vụ:**
- Chỉ tạo cho user có `role` là `receptionist` hoặc `technician`
- `commission_rate` chỉ áp dụng cho KTV

---

#### Bảng `customer_profiles`

**Mục đích:** Lưu trữ thông tin mở rộng cho khách hàng. Quan hệ 1-1 với bảng `users`.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `user_id` | UUID | ✅ | - | PK, FK → users | Khóa chính, liên kết đến users |
| `loyalty_points` | INTEGER | ❌ | 0 | CHECK >= 0 | Điểm tích lũy thành viên |
| `membership_tier` | membership_tier | ❌ | 'SILVER' | - | Hạng thành viên hiện tại |
| `date_of_birth` | DATE | ❌ | NULL | - | Ngày sinh (phục vụ CSKH/Marketing) |
| `address` | TEXT | ❌ | NULL | - | Địa chỉ liên lạc |

**Quy tắc nghiệp vụ:**
- `membership_tier` được tự động cập nhật dựa trên `loyalty_points`
- Điểm được cộng sau khi thanh toán thành công

---

### 3.2. MODULE: SKILLS

#### Bảng `skills`

**Mục đích:** Danh mục các kỹ năng chuyên môn mà KTV có thể sở hữu.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `name` | VARCHAR(100) | ✅ | - | - | Tên kỹ năng hiển thị |
| `code` | VARCHAR(50) | ✅ | - | UNIQUE | Mã định danh duy nhất |
| `description` | TEXT | ❌ | NULL | - | Mô tả chi tiết kỹ năng |

---

#### Bảng `staff_skills`

**Mục đích:** Liên kết nhân viên với kỹ năng họ sở hữu (quan hệ N-N).

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `staff_id` | UUID | ✅ | - | PK, FK → staff_profiles | ID nhân viên |
| `skill_id` | UUID | ✅ | - | PK, FK → skills | ID kỹ năng |
| `proficiency_level` | INTEGER | ❌ | 1 | CHECK 1-3 | Mức độ thành thạo |

**Giá trị `proficiency_level`:**
- `1`: Cơ bản (Basic)
- `2`: Trung bình (Intermediate)
- `3`: Chuyên gia (Expert)

---

### 3.3. MODULE: SERVICES

#### Bảng `service_categories`

**Mục đích:** Phân loại các nhóm dịch vụ.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `name` | VARCHAR(100) | ✅ | - | - | Tên danh mục |
| `description` | TEXT | ❌ | NULL | - | Mô tả danh mục |
| `sort_order` | INTEGER | ❌ | 0 | - | Thứ tự hiển thị |

---

#### Bảng `services`

**Mục đích:** Danh sách các dịch vụ Spa cung cấp.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `category_id` | UUID | ❌ | NULL | FK → service_categories | Thuộc danh mục nào |
| `name` | VARCHAR(255) | ✅ | - | - | Tên dịch vụ |
| `duration_minutes` | INTEGER | ✅ | - | CHECK > 0 | Thời lượng thực hiện (phút) |
| `buffer_time_minutes` | INTEGER | ❌ | 0 | CHECK >= 0 | Thời gian nghỉ/dọn dẹp sau dịch vụ (phút) |
| `price` | DECIMAL(12,2) | ✅ | - | CHECK >= 0 | Giá niêm yết (VNĐ) |
| `description` | TEXT | ❌ | NULL | - | Mô tả chi tiết dịch vụ |
| `image_url` | TEXT | ❌ | NULL | - | Đường dẫn hình ảnh |
| `color_code` | VARCHAR(7) | ❌ | NULL | - | Màu hiển thị trên lịch |
| `is_active` | BOOLEAN | ✅ | TRUE | - | Có đang kinh doanh không |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | - | Thời điểm tạo |
| `updated_at` | TIMESTAMPTZ | ✅ | NOW() | Auto-update | Thời điểm cập nhật |

**Công thức tính thời gian slot:**
```
Tổng thời gian = duration_minutes + buffer_time_minutes
```

---

#### Bảng `service_required_skills`

**Mục đích:** Định nghĩa kỹ năng cần thiết để thực hiện mỗi dịch vụ (quan hệ N-N).

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `service_id` | UUID | ✅ | - | PK, FK → services | ID dịch vụ |
| `skill_id` | UUID | ✅ | - | PK, FK → skills | ID kỹ năng yêu cầu |
| `min_proficiency_level` | INTEGER | ❌ | 1 | CHECK 1-3 | Mức độ thành thạo tối thiểu |

**Quy tắc gán KTV:**
- KTV chỉ được gán dịch vụ nếu có TẤT CẢ kỹ năng yêu cầu với mức độ >= `min_proficiency_level`

---

### 3.4. MODULE: RESOURCES

#### Bảng `resources`

**Mục đích:** Quản lý phòng điều trị và thiết bị máy móc.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `name` | VARCHAR(100) | ✅ | - | - | Tên phòng/thiết bị |
| `code` | VARCHAR(50) | ❌ | NULL | UNIQUE | Mã định danh |
| `type` | resource_type | ✅ | - | - | Loại: ROOM hoặc EQUIPMENT |
| `status` | resource_status | ✅ | 'ACTIVE' | - | Trạng thái hoạt động |
| `capacity` | INTEGER | ❌ | 1 | CHECK > 0 | Sức chứa (số khách đồng thời) |
| `setup_time_minutes` | INTEGER | ❌ | 0 | CHECK >= 0 | Thời gian chuẩn bị trước khi sử dụng |
| `description` | TEXT | ❌ | NULL | - | Mô tả chi tiết |
| `image_url` | TEXT | ❌ | NULL | - | Đường dẫn hình ảnh |

---

#### Bảng `service_resource_requirements`

**Mục đích:** Định nghĩa loại tài nguyên cần cho mỗi dịch vụ.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `service_id` | UUID | ✅ | - | PK, FK → services | ID dịch vụ |
| `resource_type` | resource_type | ✅ | - | PK | Loại tài nguyên cần |
| `quantity` | INTEGER | ❌ | 1 | CHECK > 0 | Số lượng cần |

---

### 3.5. MODULE: SCHEDULING

#### Bảng `shifts`

**Mục đích:** Định nghĩa các ca làm việc tiêu chuẩn.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `name` | VARCHAR(100) | ✅ | - | - | Tên ca (VD: "Ca Sáng") |
| `start_time` | TIME | ✅ | - | - | Giờ bắt đầu |
| `end_time` | TIME | ✅ | - | CHECK > start_time | Giờ kết thúc |
| `color_code` | VARCHAR(7) | ❌ | NULL | - | Màu hiển thị |

---

#### Bảng `staff_schedules`

**Mục đích:** Phân công ca làm việc cho nhân viên theo ngày.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `staff_id` | UUID | ✅ | - | FK → staff_profiles | ID nhân viên |
| `shift_id` | UUID | ✅ | - | FK → shifts | ID ca làm việc |
| `work_date` | DATE | ✅ | - | - | Ngày làm việc |
| `status` | schedule_status | ✅ | 'DRAFT' | - | Trạng thái công bố |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | - | Thời điểm tạo |

**Ràng buộc đặc biệt:**
- UNIQUE(staff_id, work_date, shift_id): Một nhân viên chỉ có 1 bản ghi cho mỗi ca trong ngày

---

### 3.6. MODULE: BOOKINGS

#### Bảng `bookings`

**Mục đích:** Lưu trữ thông tin tổng quát của một lần đặt hẹn.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `customer_id` | UUID | ❌ | NULL | FK → users | Khách hàng đặt (NULL = khách vãng lai) |
| `start_time` | TIMESTAMPTZ | ✅ | - | - | Thời gian bắt đầu dự kiến |
| `end_time` | TIMESTAMPTZ | ✅ | - | CHECK > start_time | Thời gian kết thúc dự kiến |
| `status` | booking_status | ✅ | 'PENDING' | - | Trạng thái lịch hẹn |
| `notes` | TEXT | ❌ | NULL | - | Ghi chú của khách/lễ tân |
| `cancel_reason` | TEXT | ❌ | NULL | - | Lý do hủy (nếu có) |
| `check_in_time` | TIMESTAMPTZ | ❌ | NULL | - | Thời điểm khách check-in |
| `actual_start_time` | TIMESTAMPTZ | ❌ | NULL | - | Thời điểm bắt đầu thực tế |
| `actual_end_time` | TIMESTAMPTZ | ❌ | NULL | - | Thời điểm kết thúc thực tế |
| `total_price` | DECIMAL(12,2) | ❌ | 0 | CHECK >= 0 | Tổng giá trị (tạm tính) |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | - | Thời điểm tạo |
| `updated_at` | TIMESTAMPTZ | ✅ | NOW() | Auto-update | Thời điểm cập nhật |

**Các mốc thời gian:**
- `start_time/end_time`: Thời gian dự kiến (theo lịch đặt)
- `check_in_time`: Khi khách đến và check-in tại quầy
- `actual_start_time/actual_end_time`: Thời gian thực tế phục vụ (phục vụ báo cáo)

---

#### Bảng `booking_items`

**Mục đích:** Chi tiết từng dịch vụ trong một booking (hỗ trợ booking nhiều dịch vụ).

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `booking_id` | UUID | ✅ | - | FK → bookings | Thuộc booking nào |
| `service_id` | UUID | ❌ | NULL | FK → services | Dịch vụ được chọn |
| `staff_id` | UUID | ❌ | NULL | FK → staff_profiles | KTV được gán (có thể gán sau) |
| `resource_id` | UUID | ❌ | NULL | FK → resources | Phòng/thiết bị được gán |
| `treatment_id` | UUID | ❌ | NULL | FK → customer_treatments | Nếu sử dụng gói liệu trình |
| `start_time` | TIMESTAMPTZ | ✅ | - | - | Thời gian bắt đầu item này |
| `end_time` | TIMESTAMPTZ | ✅ | - | CHECK > start_time | Thời gian kết thúc item này |
| `original_price` | DECIMAL(12,2) | ✅ | - | CHECK >= 0 | Giá gốc tại thời điểm đặt |

**Quy tắc nghiệp vụ:**
- `staff_id` có thể NULL lúc đặt, sẽ được gán sau bởi hệ thống hoặc lễ tân
- Nếu `treatment_id` không NULL, nghĩa là đang sử dụng buổi từ gói liệu trình

---

#### Bảng `customer_treatments`

**Mục đích:** Lưu trữ các gói liệu trình/combo mà khách hàng đã mua.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `customer_id` | UUID | ✅ | - | FK → users | Khách hàng sở hữu |
| `service_id` | UUID | ❌ | NULL | FK → services | Dịch vụ gốc của gói |
| `name` | VARCHAR(255) | ✅ | - | - | Tên gói (snapshot tại thời điểm mua) |
| `total_sessions` | INTEGER | ✅ | - | CHECK > 0 | Tổng số buổi trong gói |
| `used_sessions` | INTEGER | ❌ | 0 | CHECK 0 <= x <= total | Số buổi đã sử dụng |
| `expiry_date` | DATE | ❌ | NULL | - | Ngày hết hạn sử dụng |
| `status` | treatment_status | ✅ | 'ACTIVE' | - | Trạng thái gói |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | - | Thời điểm mua |

**Công thức tính số buổi còn lại:**
```
remaining_sessions = total_sessions - used_sessions
```

---

### 3.7. MODULE: BILLING

#### Bảng `invoices`

**Mục đích:** Hóa đơn thanh toán cho mỗi booking.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `booking_id` | UUID | ❌ | NULL | FK → bookings, UNIQUE | Booking liên quan (1-1) |
| `amount` | DECIMAL(12,2) | ✅ | - | CHECK >= 0 | Số tiền cần thanh toán |
| `status` | invoice_status | ✅ | 'UNPAID' | - | Trạng thái thanh toán |
| `issued_at` | TIMESTAMPTZ | ✅ | NOW() | - | Thời điểm xuất hóa đơn |

**Quy tắc:**
- Mỗi booking chỉ có 1 invoice (ràng buộc UNIQUE)

---

#### Bảng `payments`

**Mục đích:** Giao dịch thanh toán thực tế (hỗ trợ thanh toán nhiều lần).

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `invoice_id` | UUID | ✅ | - | FK → invoices | Hóa đơn liên quan |
| `amount` | DECIMAL(12,2) | ✅ | - | CHECK > 0 | Số tiền giao dịch |
| `method` | payment_method | ✅ | - | - | Phương thức thanh toán |
| `transaction_time` | TIMESTAMPTZ | ✅ | NOW() | - | Thời điểm giao dịch |

---

### 3.8. MODULE: REVIEWS

#### Bảng `reviews`

**Mục đích:** Đánh giá của khách hàng sau khi hoàn thành dịch vụ.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `booking_id` | UUID | ✅ | - | FK → bookings | Đánh giá cho booking nào |
| `customer_id` | UUID | ✅ | - | FK → users | Người đánh giá |
| `rating` | INTEGER | ✅ | - | CHECK 1-5 | Điểm số (1-5 sao) |
| `comment` | TEXT | ❌ | NULL | - | Nội dung đánh giá |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | - | Thời điểm đánh giá |

**Ràng buộc đặc biệt:**
- UNIQUE(booking_id, customer_id): Mỗi khách chỉ đánh giá 1 lần cho mỗi booking

---

### 3.9. MODULE: NOTIFICATIONS

#### Bảng `notifications`

**Mục đích:** Thông báo in-app gửi đến người dùng.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `user_id` | UUID | ✅ | - | FK → users | Người nhận |
| `title` | VARCHAR(255) | ✅ | - | - | Tiêu đề thông báo |
| `message` | TEXT | ✅ | - | - | Nội dung chi tiết |
| `is_read` | BOOLEAN | ✅ | FALSE | - | Đã đọc chưa |
| `type` | VARCHAR(50) | ❌ | NULL | - | Loại thông báo |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | - | Thời điểm tạo |

**Các loại thông báo (`type`):**
- `booking_update`: Cập nhật lịch hẹn
- `reminder`: Nhắc nhở
- `promo`: Khuyến mãi
- `system`: Thông báo hệ thống

---

### 3.10. MODULE: SYSTEM

#### Bảng `system_configurations`

**Mục đích:** Lưu trữ cấu hình động của hệ thống.

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `key` | VARCHAR(100) | ✅ | - | PK | Khóa định danh cấu hình |
| `value` | JSONB | ✅ | - | - | Giá trị cấu hình (JSON) |
| `description` | TEXT | ❌ | NULL | - | Mô tả ý nghĩa |
| `updated_at` | TIMESTAMPTZ | ✅ | NOW() | Auto-update | Thời điểm cập nhật |

**Các key cấu hình chuẩn:**
- `operating_hours`: Giờ hoạt động theo ngày trong tuần
- `cancellation_policy`: Chính sách hủy lịch
- `loyalty_config`: Cấu hình điểm thành viên
- `notification_settings`: Cấu hình gửi thông báo

---

#### Bảng `audit_logs`

**Mục đích:** Ghi lại mọi thay đổi quan trọng trong hệ thống (kiểm toán).

| Tên cột | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|:---|
| `id` | UUID | ✅ | auto | PK | Khóa chính |
| `table_name` | VARCHAR(50) | ✅ | - | - | Tên bảng bị thay đổi |
| `record_id` | UUID | ❌ | NULL | - | ID bản ghi bị thay đổi |
| `action` | VARCHAR(20) | ✅ | - | - | Loại hành động: INSERT, UPDATE, DELETE |
| `old_data` | JSONB | ❌ | NULL | - | Dữ liệu trước khi thay đổi |
| `new_data` | JSONB | ❌ | NULL | - | Dữ liệu sau khi thay đổi |
| `changed_by` | UUID | ❌ | NULL | FK → users | Người thực hiện |
| `changed_at` | TIMESTAMPTZ | ✅ | NOW() | - | Thời điểm thay đổi |

---

## 4. MA TRẬN QUAN HỆ GIỮA CÁC BẢNG

### 4.1. Quan hệ 1-1

| Bảng cha | Bảng con | Khóa liên kết | Mô tả |
|:---|:---|:---|:---|
| `users` | `staff_profiles` | user_id | Thông tin chi tiết nhân viên |
| `users` | `customer_profiles` | user_id | Thông tin chi tiết khách hàng |
| `bookings` | `invoices` | booking_id (UNIQUE) | Mỗi booking có 1 hóa đơn |

### 4.2. Quan hệ 1-N

| Bảng cha (1) | Bảng con (N) | Khóa liên kết | Mô tả |
|:---|:---|:---|:---|
| `users` | `bookings` | customer_id | Khách hàng có nhiều lịch hẹn |
| `users` | `notifications` | user_id | User nhận nhiều thông báo |
| `users` | `customer_treatments` | customer_id | Khách có nhiều gói liệu trình |
| `bookings` | `booking_items` | booking_id | Booking có nhiều dịch vụ |
| `invoices` | `payments` | invoice_id | Hóa đơn có nhiều giao dịch |
| `service_categories` | `services` | category_id | Danh mục có nhiều dịch vụ |
| `staff_profiles` | `staff_schedules` | staff_id | Nhân viên có nhiều lịch làm việc |
| `shifts` | `staff_schedules` | shift_id | Ca có nhiều lịch phân công |

### 4.3. Quan hệ N-N (qua bảng trung gian)

| Bảng 1 | Bảng 2 | Bảng trung gian | Mô tả |
|:---|:---|:---|:---|
| `staff_profiles` | `skills` | `staff_skills` | Nhân viên có nhiều kỹ năng |
| `services` | `skills` | `service_required_skills` | Dịch vụ yêu cầu nhiều kỹ năng |

---

## 5. RÀNG BUỘC TOÀN VẸN

### 5.1. Ràng buộc CHECK

| Bảng | Cột | Điều kiện | Mô tả |
|:---|:---|:---|:---|
| `staff_profiles` | commission_rate | 0 <= x <= 100 | Tỷ lệ hoa hồng hợp lệ |
| `customer_profiles` | loyalty_points | x >= 0 | Điểm không âm |
| `staff_skills` | proficiency_level | 1 <= x <= 3 | 3 mức thành thạo |
| `services` | duration_minutes | x > 0 | Thời lượng dương |
| `services` | buffer_time_minutes | x >= 0 | Thời gian buffer không âm |
| `services` | price | x >= 0 | Giá không âm |
| `resources` | capacity | x > 0 | Sức chứa dương |
| `shifts` | end_time | end_time > start_time | Ca kết thúc sau khi bắt đầu |
| `bookings` | end_time | end_time > start_time | Kết thúc sau khi bắt đầu |
| `customer_treatments` | total_sessions | x > 0 | Ít nhất 1 buổi |
| `customer_treatments` | used_sessions | 0 <= x <= total_sessions | Không vượt quá tổng |
| `reviews` | rating | 1 <= x <= 5 | Đánh giá 1-5 sao |
| `payments` | amount | x > 0 | Số tiền dương |

### 5.2. Ràng buộc UNIQUE

| Bảng | Cột(s) | Mục đích |
|:---|:---|:---|
| `users` | email | Email duy nhất |
| `users` | phone_number (partial) | Số điện thoại duy nhất (khi không null) |
| `skills` | code | Mã kỹ năng duy nhất |
| `resources` | code | Mã tài nguyên duy nhất |
| `staff_schedules` | (staff_id, work_date, shift_id) | Mỗi ca chỉ phân công 1 lần |
| `invoices` | booking_id | Mỗi booking 1 hóa đơn |
| `reviews` | (booking_id, customer_id) | Mỗi khách đánh giá 1 lần/booking |

### 5.3. Ràng buộc ON DELETE

| Bảng cha | Bảng con | Hành vi | Lý do |
|:---|:---|:---|:---|
| `users` | `staff_profiles` | CASCADE | Xóa profile khi xóa user |
| `users` | `customer_profiles` | CASCADE | Xóa profile khi xóa user |
| `users` | `bookings` | SET NULL | Giữ lịch sử, đánh dấu khách vãng lai |
| `bookings` | `booking_items` | CASCADE | Xóa items khi xóa booking |
| `bookings` | `reviews` | CASCADE | Xóa đánh giá khi xóa booking |
| `invoices` | `payments` | CASCADE | Xóa thanh toán khi xóa hóa đơn |
| `services` | `booking_items` | SET NULL | Giữ lịch sử booking |

---

## 6. CHIẾN LƯỢC ĐÁNH CHỈ MỤC

### 6.1. Chỉ mục cho Scheduling (Quan trọng nhất)

| Bảng | Cột | Loại | Mục đích |
|:---|:---|:---|:---|
| `booking_items` | (staff_id, start_time, end_time) | B-tree | Kiểm tra xung đột lịch KTV |
| `booking_items` | (resource_id, start_time, end_time) | B-tree | Kiểm tra xung đột phòng |
| `staff_schedules` | (staff_id, work_date) | B-tree | Tra cứu lịch làm việc KTV |

### 6.2. Chỉ mục Partial (Tiết kiệm không gian)

| Bảng | Điều kiện | Mục đích |
|:---|:---|:---|
| `bookings` | WHERE status = 'PENDING' | Xem booking chờ xác nhận |
| `bookings` | WHERE status = 'CONFIRMED' | Xem booking đã xác nhận |
| `notifications` | WHERE is_read = FALSE | Đếm thông báo chưa đọc |
| `customer_treatments` | WHERE status = 'ACTIVE' | Kiểm tra gói còn hiệu lực |

---

## 7. CHÍNH SÁCH BẢO MẬT (RLS)

### 7.1. Ma trận phân quyền

| Bảng | Khách hàng | KTV | Lễ tân | Admin |
|:---|:---:|:---:|:---:|:---:|
| `users` (profile mình) | Đọc | Đọc | Đọc | CRUD |
| `users` (người khác) | ❌ | ❌ | Đọc | CRUD |
| `services` (active) | Đọc | Đọc | Đọc | CRUD |
| `bookings` (của mình) | Đọc/Tạo | Đọc | Đọc/CRUD | CRUD |
| `bookings` (tất cả) | ❌ | ❌ | Đọc/CRUD | CRUD |
| `staff_schedules` (của mình) | ❌ | Đọc | Đọc | CRUD |
| `staff_schedules` (tất cả) | ❌ | ❌ | Đọc | CRUD |
| `invoices` | Đọc (của mình) | ❌ | CRUD | CRUD |
| `payments` | Đọc (của mình) | ❌ | CRUD | CRUD |
| `reviews` | Tạo/Đọc | ❌ | Đọc | CRUD |
| `notifications` | Đọc (của mình) | Đọc (của mình) | Đọc (của mình) | CRUD |

### 7.2. Nguyên tắc RLS

1. **Principle of Least Privilege:** Mỗi vai trò chỉ có quyền tối thiểu cần thiết
2. **Data Isolation:** Khách hàng chỉ thấy dữ liệu của mình
3. **Staff Visibility:** Nhân viên thấy dữ liệu cần để làm việc
4. **Admin Override:** Admin có toàn quyền

---

## 8. QUY TẮC NGHIỆP VỤ

### 8.1. Quy trình đặt lịch

```
1. Khách chọn dịch vụ → Tạo booking (PENDING)
2. Hệ thống/Lễ tân xác nhận → booking (CONFIRMED)
3. Khách đến check-in → Ghi check_in_time
4. Bắt đầu phục vụ → booking (IN_PROGRESS), ghi actual_start_time
5. Hoàn thành → booking (COMPLETED), ghi actual_end_time
6. Thanh toán → Tạo invoice, payments
7. Đánh giá → Tạo review
```

### 8.2. Kiểm tra xung đột lịch

Trước khi gán KTV hoặc Phòng cho booking_item, hệ thống phải kiểm tra:

```
KHÔNG tồn tại booking_item khác mà:
- staff_id/resource_id trùng VÀ
- Khoảng thời gian chồng lấn (overlapping) VÀ
- booking.status NOT IN ('CANCELLED', 'NO_SHOW')
```

### 8.3. Cập nhật điểm thành viên

```
Sau khi invoice.status = 'PAID':
- points_earned = FLOOR(invoice.amount / 10000)
- customer_profiles.loyalty_points += points_earned
- Cập nhật membership_tier nếu vượt ngưỡng
```

### 8.4. Tự động hết hạn liệu trình

```
Chạy định kỳ hàng ngày:
UPDATE customer_treatments
SET status = 'EXPIRED'
WHERE status = 'ACTIVE' AND expiry_date < CURRENT_DATE
```

---

## PHỤ LỤC: THUẬT NGỮ

| Thuật ngữ | Tiếng Việt | Giải thích |
|:---|:---|:---|
| Booking | Lịch hẹn | Một lần đặt dịch vụ của khách |
| Booking Item | Chi tiết dịch vụ | Một dịch vụ cụ thể trong booking |
| Treatment | Liệu trình | Gói dịch vụ nhiều buổi |
| Shift | Ca làm việc | Khoảng thời gian làm việc định sẵn |
| Resource | Tài nguyên | Phòng hoặc thiết bị |
| RLS | Row Level Security | Bảo mật mức hàng dữ liệu |
| Soft Delete | Xóa mềm | Đánh dấu xóa thay vì xóa vật lý |
