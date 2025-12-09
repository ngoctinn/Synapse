# ĐẶC TẢ CƠ SỞ DỮ LIỆU HỆ THỐNG SYNAPSE

## Thông tin tài liệu

| Thuộc tính | Giá trị |
|:---|:---|
| Phiên bản | 2.1 |
| Ngày cập nhật | 09/12/2025 |
| Hệ quản trị CSDL | PostgreSQL 14+ |
| Nền tảng | Supabase |

---

## 1. Tổng quan

Cơ sở dữ liệu Synapse được thiết kế phục vụ hệ thống quản lý khách hàng (CRM) chuyên biệt cho ngành Spa. Hệ thống bao gồm 24 bảng dữ liệu được tổ chức thành 11 module nghiệp vụ.

### 1.1. Danh sách module

| STT | Tên module | Số bảng | Chức năng |
|:---:|:---|:---:|:---|
| 1 | Users | 3 | Quản lý người dùng và hồ sơ |
| 2 | Skills | 2 | Kỹ năng chuyên môn nhân viên |
| 3 | Services | 3 | Danh mục dịch vụ |
| 4 | Resources | 3 | Quản lý nhóm và tài nguyên |
| 5 | Scheduling | 2 | Lịch làm việc nhân viên |
| 6 | Bookings | 3 | Đặt lịch hẹn |
| 7 | Packages | 2 | Gói dịch vụ (Combo) |
| 8 | Billing | 2 | Hóa đơn và thanh toán |
| 9 | Reviews | 1 | Đánh giá khách hàng |
| 10 | Notifications | 1 | Thông báo hệ thống |
| 11 | System | 2 | Cấu hình và nhật ký |

### 1.2. Quy ước đặt tên

- Tên bảng: snake_case, số nhiều (vd: booking_items)
- Tên cột: snake_case (vd: created_at)
- Khóa chính: id (kiểu UUID)
- Khóa ngoại: [tên_bảng]_id (vd: customer_id)

---

## 2. Kiểu dữ liệu liệt kê (ENUM)

### 2.1. user_role

Vai trò người dùng trong hệ thống.

| Giá trị | Mô tả |
|:---|:---|
| admin | Quản trị viên - toàn quyền quản lý hệ thống |
| receptionist | Lễ tân - quản lý lịch hẹn, thanh toán |
| technician | Kỹ thuật viên - thực hiện dịch vụ |
| customer | Khách hàng - đặt lịch, đánh giá |

### 2.2. membership_tier

Hạng thành viên khách hàng.

| Giá trị | Điều kiện | Quyền lợi |
|:---|:---|:---|
| SILVER | Mặc định | Tích điểm cơ bản |
| GOLD | Từ 500 điểm | Giảm giá 5% |
| PLATINUM | Từ 2000 điểm | Giảm giá 10% |

### 2.3. resource_type

Phân loại nhóm tài nguyên (Logic).

| Giá trị | Mô tả |
|:---|:---|
| ROOM | Phòng điều trị |
| EQUIPMENT | Thiết bị máy móc |

### 2.4. resource_status

| Giá trị | Mô tả |
|:---|:---|
| ACTIVE | Đang hoạt động |
| MAINTENANCE | Đang bảo trì |
| INACTIVE | Ngừng sử dụng |

### 2.5. booking_status

| Giá trị | Mô tả |
|:---|:---|
| PENDING | Chờ xác nhận |
| CONFIRMED | Đã xác nhận |
| IN_PROGRESS | Đang thực hiện |
| COMPLETED | Hoàn thành |
| CANCELLED | Đã hủy |
| NO_SHOW | Khách không đến |

### 2.6. invoice_status

| Giá trị | Mô tả |
|:---|:---|
| UNPAID | Chưa thanh toán |
| PAID | Đã thanh toán |
| REFUNDED | Đã hoàn tiền |

### 2.7. payment_method

| Giá trị | Mô tả |
|:---|:---|
| CASH | Tiền mặt |
| CARD | Thẻ ngân hàng |
| TRANSFER | Chuyển khoản |

### 2.8. treatment_status

| Giá trị | Mô tả |
|:---|:---|
| ACTIVE | Đang hoạt động |
| COMPLETED | Đã hoàn thành |
| EXPIRED | Đã hết hạn |

### 2.9. schedule_status

| Giá trị | Mô tả |
|:---|:---|
| DRAFT | Bản nháp |
| PUBLISHED | Đã công bố |

---

## 3. Đặc tả bảng dữ liệu

### 3.1. Bảng users

Lưu trữ thông tin người dùng hệ thống.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| email | VARCHAR(255) | Không | - | Email đăng nhập (UNIQUE) |
| full_name | VARCHAR(255) | Có | NULL | Họ và tên |
| phone_number | VARCHAR(50) | Có | NULL | Số điện thoại |
| avatar_url | TEXT | Có | NULL | Đường dẫn ảnh đại diện |
| role | user_role | Không | customer | Vai trò |
| is_active | BOOLEAN | Không | TRUE | Trạng thái hoạt động |
| deleted_at | TIMESTAMPTZ | Có | NULL | Thời điểm xóa mềm |
| created_at | TIMESTAMPTZ | Không | NOW() | Thời điểm tạo |
| updated_at | TIMESTAMPTZ | Không | NOW() | Thời điểm cập nhật |

### 3.2. Bảng staff_profiles

Thông tin chi tiết nhân viên. Quan hệ 1-1 với bảng users.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| user_id | UUID | Không | - | Khóa chính, FK users |
| title | VARCHAR(100) | Không | - | Chức danh |
| bio | TEXT | Có | NULL | Giới thiệu |
| color_code | VARCHAR(7) | Có | #6366F1 | Mã màu hiển thị |
| commission_rate | DECIMAL(5,2) | Có | 0.0 | Tỷ lệ hoa hồng (0-100) |
| hired_at | DATE | Có | CURRENT_DATE | Ngày vào làm |

### 3.3. Bảng customer_profiles

Thông tin chi tiết khách hàng. Quan hệ 1-1 với bảng users.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| user_id | UUID | Không | - | Khóa chính, FK users |
| loyalty_points | INTEGER | Có | 0 | Điểm tích lũy |
| membership_tier | membership_tier | Có | SILVER | Hạng thành viên |
| gender | gender | Có | NULL | Giới tính |
| date_of_birth | DATE | Có | NULL | Ngày sinh |
| address | TEXT | Có | NULL | Địa chỉ |
| allergies | TEXT | Có | NULL | Dị ứng (tinh dầu, mỹ phẩm...) |
| medical_notes | TEXT | Có | NULL | Ghi chú y tế (bệnh nền, có thai...) |
| preferred_staff_id | UUID | Có | NULL | FK staff_profiles - KTV yêu thích |

### 3.4. Bảng skills

Danh mục kỹ năng chuyên môn.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| name | VARCHAR(100) | Không | - | Tên kỹ năng |
| code | VARCHAR(50) | Không | - | Mã định danh (UNIQUE) |
| description | TEXT | Có | NULL | Mô tả |

### 3.5. Bảng staff_skills

Liên kết nhân viên với kỹ năng (N-N).

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| staff_id | UUID | Không | - | FK staff_profiles |
| skill_id | UUID | Không | - | FK skills |
| proficiency_level | INTEGER | Có | 1 | Mức thành thạo (1-3) |

Khóa chính: (staff_id, skill_id)

### 3.6. Bảng service_categories

Danh mục phân loại dịch vụ.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| name | VARCHAR(100) | Không | - | Tên danh mục |
| description | TEXT | Có | NULL | Mô tả |
| sort_order | INTEGER | Có | 0 | Thứ tự hiển thị |

### 3.7. Bảng services

Danh sách dịch vụ Spa.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| category_id | UUID | Có | NULL | FK service_categories |
| name | VARCHAR(255) | Không | - | Tên dịch vụ |
| duration_minutes | INTEGER | Không | - | Thời lượng (phút) |
| buffer_time_minutes | INTEGER | Có | 0 | Thời gian nghỉ (phút) |
| price | DECIMAL(12,2) | Không | - | Giá niêm yết |
| description | TEXT | Có | NULL | Mô tả |
| image_url | TEXT | Có | NULL | Hình ảnh |
| is_active | BOOLEAN | Không | TRUE | Trạng thái kinh doanh |
| deleted_at | TIMESTAMPTZ | Có | NULL | Thời điểm xóa mềm |
| created_at | TIMESTAMPTZ | Không | NOW() | Thời điểm tạo |
| updated_at | TIMESTAMPTZ | Không | NOW() | Thời điểm cập nhật |

### 3.8. Bảng service_required_skills

Kỹ năng yêu cầu cho mỗi dịch vụ (N-N).

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| service_id | UUID | Không | - | FK services |
| skill_id | UUID | Không | - | FK skills |
| min_proficiency_level | INTEGER | Có | 1 | Mức tối thiểu (1-3) |

Khóa chính: (service_id, skill_id)

### 3.9. Bảng resource_groups

Nhóm tài nguyên (phân loại logic).

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| name | VARCHAR(100) | Không | - | Tên nhóm |
| type | resource_type | Không | - | Loại (ROOM/EQUIPMENT) |
| description | TEXT | Có | NULL | Mô tả |
| deleted_at | TIMESTAMPTZ | Có | NULL | Thời điểm xóa mềm |
| created_at | TIMESTAMPTZ | Không | NOW() | Thời điểm tạo |

### 3.10. Bảng resources

Quản lý phòng và thiết bị cụ thể.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| group_id | UUID | Có | NULL | FK resource_groups |
| name | VARCHAR(100) | Không | - | Tên tài nguyên |
| code | VARCHAR(50) | Có | NULL | Mã định danh (UNIQUE) |
| status | resource_status | Không | ACTIVE | Trạng thái |
| capacity | INTEGER | Có | 1 | Sức chứa |
| setup_time_minutes | INTEGER | Có | 0 | Thời gian chuẩn bị |
| description | TEXT | Có | NULL | Mô tả |
| image_url | TEXT | Có | NULL | Hình ảnh |
| deleted_at | TIMESTAMPTZ | Có | NULL | Thời điểm xóa mềm |

### 3.11. Bảng service_resource_requirements

Yêu cầu nhóm tài nguyên cho dịch vụ.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| service_id | UUID | Không | - | FK services |
| group_id | UUID | Không | - | FK resource_groups |
| quantity | INTEGER | Có | 1 | Số lượng |

Khóa chính: (service_id, group_id)

### 3.12. Bảng shifts

Định nghĩa ca làm việc.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| name | VARCHAR(100) | Không | - | Tên ca |
| start_time | TIME | Không | - | Giờ bắt đầu |
| end_time | TIME | Không | - | Giờ kết thúc |
| color_code | VARCHAR(7) | Có | NULL | Mã màu |

### 3.13. Bảng staff_schedules

Phân công lịch làm việc.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| staff_id | UUID | Không | - | FK staff_profiles |
| shift_id | UUID | Không | - | FK shifts |
| work_date | DATE | Không | - | Ngày làm việc |
| status | schedule_status | Không | DRAFT | Trạng thái |
| created_at | TIMESTAMPTZ | Không | NOW() | Thời điểm tạo |

Ràng buộc UNIQUE: (staff_id, work_date, shift_id)

### 3.14. Bảng bookings

Thông tin lịch hẹn.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| customer_id | UUID | Có | NULL | FK users - khách hàng |
| created_by | UUID | Có | NULL | FK users - người tạo booking |
| start_time | TIMESTAMPTZ | Không | - | Thời gian bắt đầu |
| end_time | TIMESTAMPTZ | Không | - | Thời gian kết thúc |
| status | booking_status | Không | PENDING | Trạng thái |
| notes | TEXT | Có | NULL | Ghi chú |
| cancel_reason | TEXT | Có | NULL | Lý do hủy |
| check_in_time | TIMESTAMPTZ | Có | NULL | Thời điểm check-in |
| actual_start_time | TIMESTAMPTZ | Có | NULL | Bắt đầu thực tế |
| actual_end_time | TIMESTAMPTZ | Có | NULL | Kết thúc thực tế |
| total_price | DECIMAL(12,2) | Có | 0 | Tổng giá |
| created_at | TIMESTAMPTZ | Không | NOW() | Thời điểm tạo |
| updated_at | TIMESTAMPTZ | Không | NOW() | Thời điểm cập nhật |

### 3.15. Bảng booking_items

Chi tiết dịch vụ trong lịch hẹn.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| booking_id | UUID | Không | - | FK bookings |
| service_id | UUID | Có | NULL | FK services |
| staff_id | UUID | Có | NULL | FK staff_profiles |
| resource_id | UUID | Có | NULL | FK resources |
| treatment_id | UUID | Có | NULL | FK customer_treatments |
| service_name_snapshot | VARCHAR(255) | Có | NULL | Snapshot tên dịch vụ |
| start_time | TIMESTAMPTZ | Không | - | Thời gian bắt đầu |
| end_time | TIMESTAMPTZ | Không | - | Thời gian kết thúc |
| original_price | DECIMAL(12,2) | Không | - | Giá gốc |

### 3.16. Bảng customer_treatments

Gói liệu trình của khách hàng.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| customer_id | UUID | Không | - | FK users |
| service_id | UUID | Có | NULL | FK services |
| name | VARCHAR(255) | Không | - | Tên gói |
| total_sessions | INTEGER | Không | - | Tổng số buổi |
| used_sessions | INTEGER | Có | 0 | Số buổi đã dùng |
| expiry_date | DATE | Có | NULL | Ngày hết hạn |
| status | treatment_status | Không | ACTIVE | Trạng thái |
| created_at | TIMESTAMPTZ | Không | NOW() | Thời điểm tạo |

### 3.17. Bảng service_packages

Định nghĩa gói dịch vụ (Combo).

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| name | VARCHAR(255) | Không | - | Tên gói |
| description | TEXT | Có | NULL | Mô tả |
| price | DECIMAL(12,2) | Không | - | Giá gói |
| validity_days | INTEGER | Có | NULL | Thời hạn sử dụng (ngày) |
| is_active | BOOLEAN | Không | TRUE | Trạng thái kinh doanh |
| created_at | TIMESTAMPTZ | Không | NOW() | Thời điểm tạo |

### 3.18. Bảng package_services

Liên kết gói với dịch vụ (N-N).

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| package_id | UUID | Không | - | FK service_packages |
| service_id | UUID | Không | - | FK services |
| quantity | INTEGER | Có | 1 | Số lần dùng dịch vụ trong gói |

Khóa chính: (package_id, service_id)

### 3.19. Bảng invoices

Hóa đơn thanh toán.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| booking_id | UUID | Có | NULL | FK bookings (UNIQUE) |
| amount | DECIMAL(12,2) | Không | - | Số tiền |
| status | invoice_status | Không | UNPAID | Trạng thái |
| issued_at | TIMESTAMPTZ | Không | NOW() | Thời điểm xuất |

### 3.20. Bảng payments

Giao dịch thanh toán.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| invoice_id | UUID | Không | - | FK invoices |
| amount | DECIMAL(12,2) | Không | - | Số tiền |
| method | payment_method | Không | - | Phương thức |
| transaction_ref | VARCHAR(100) | Có | NULL | Mã giao dịch ngân hàng |
| gateway_info | JSONB | Có | NULL | Dữ liệu từ cổng TT |
| transaction_time | TIMESTAMPTZ | Không | NOW() | Thời điểm |

### 3.21. Bảng reviews

Đánh giá của khách hàng.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| booking_id | UUID | Không | - | FK bookings |
| customer_id | UUID | Không | - | FK users |
| rating | INTEGER | Không | - | Điểm (1-5) |
| comment | TEXT | Có | NULL | Nội dung |
| created_at | TIMESTAMPTZ | Không | NOW() | Thời điểm |

Ràng buộc UNIQUE: (booking_id, customer_id)

### 3.22. Bảng notifications

Thông báo hệ thống.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| user_id | UUID | Không | - | FK users |
| title | VARCHAR(255) | Không | - | Tiêu đề |
| message | TEXT | Không | - | Nội dung |
| is_read | BOOLEAN | Không | FALSE | Đã đọc |
| type | VARCHAR(50) | Có | NULL | Loại thông báo |
| created_at | TIMESTAMPTZ | Không | NOW() | Thời điểm |

### 3.23. Bảng system_configurations

Cấu hình hệ thống.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| key | VARCHAR(100) | Không | - | Khóa chính |
| value | JSONB | Không | - | Giá trị |
| description | TEXT | Có | NULL | Mô tả |
| updated_at | TIMESTAMPTZ | Không | NOW() | Cập nhật |

### 3.24. Bảng audit_logs

Nhật ký thay đổi.

| Tên cột | Kiểu dữ liệu | Null | Mặc định | Mô tả |
|:---|:---|:---:|:---|:---|
| id | UUID | Không | auto | Khóa chính |
| table_name | VARCHAR(50) | Không | - | Tên bảng |
| record_id | UUID | Có | NULL | ID bản ghi |
| action | VARCHAR(20) | Không | - | Hành động |
| old_data | JSONB | Có | NULL | Dữ liệu cũ |
| new_data | JSONB | Có | NULL | Dữ liệu mới |
| changed_by | UUID | Có | NULL | Người thay đổi |
| changed_at | TIMESTAMPTZ | Không | NOW() | Thời điểm |

---

## 4. Quan hệ giữa các bảng

### 4.1. Quan hệ 1-1

| Bảng cha | Bảng con | Khóa liên kết |
|:---|:---|:---|
| users | staff_profiles | user_id |
| users | customer_profiles | user_id |
| bookings | invoices | booking_id |

### 4.2. Quan hệ 1-N

| Bảng cha | Bảng con | Khóa liên kết |
|:---|:---|:---|
| users | bookings | customer_id |
| users | notifications | user_id |
| users | customer_treatments | customer_id |
| bookings | booking_items | booking_id |
| invoices | payments | invoice_id |
| service_categories | services | category_id |
| resource_groups | resources | group_id |
| staff_profiles | staff_schedules | staff_id |
| shifts | staff_schedules | shift_id |

### 4.3. Quan hệ N-N

| Bảng 1 | Bảng 2 | Bảng trung gian |
|:---|:---|:---|
| staff_profiles | skills | staff_skills |
| services | skills | service_required_skills |
| services | resource_groups | service_resource_requirements |

---

## 5. Ràng buộc toàn vẹn

### 5.1. Ràng buộc CHECK

| Bảng | Cột | Điều kiện |
|:---|:---|:---|
| staff_profiles | commission_rate | 0 <= x <= 100 |
| customer_profiles | loyalty_points | x >= 0 |
| staff_skills | proficiency_level | 1 <= x <= 3 |
| services | duration_minutes | x > 0 |
| services | price | x >= 0 |
| shifts | end_time | end_time > start_time |
| bookings | end_time | end_time > start_time |
| customer_treatments | used_sessions | 0 <= x <= total_sessions |
| reviews | rating | 1 <= x <= 5 |
| payments | amount | x > 0 |

### 5.2. Hành vi ON DELETE

| Bảng cha | Bảng con | Hành vi |
|:---|:---|:---|
| users | staff_profiles | CASCADE |
| users | customer_profiles | CASCADE |
| users | bookings | SET NULL |
| bookings | booking_items | CASCADE |
| bookings | reviews | CASCADE |
| invoices | payments | CASCADE |

---

## 6. Chỉ mục

### 6.1. Chỉ mục cho scheduling

| Bảng | Cột | Mục đích |
|:---|:---|:---|
| booking_items | (staff_id, start_time, end_time) | Kiểm tra xung đột KTV |
| booking_items | (resource_id, start_time, end_time) | Kiểm tra xung đột phòng |
| staff_schedules | (staff_id, work_date) | Tra cứu lịch làm việc |

### 6.2. Chỉ mục partial

| Bảng | Điều kiện WHERE | Mục đích |
|:---|:---|:---|
| bookings | status = 'PENDING' | Truy vấn booking chờ xác nhận |
| bookings | status = 'CONFIRMED' | Truy vấn booking đã xác nhận |
| notifications | is_read = FALSE | Đếm thông báo chưa đọc |
| customer_treatments | status = 'ACTIVE' | Kiểm tra gói còn hiệu lực |

---

## 7. Phân quyền theo vai trò

| Đối tượng | Khách hàng | KTV | Lễ tân | Admin |
|:---|:---:|:---:|:---:|:---:|
| users (của mình) | R | R | R | CRUD |
| users (của người khác) | - | - | R | CRUD |
| services | R | R | R | CRUD |
| bookings (của mình) | CR | R | CR | CRUD |
| bookings (tất cả) | - | - | CRUD | CRUD |
| staff_schedules (của mình) | - | R | R | CRUD |
| staff_schedules (tất cả) | - | - | R | CRUD |
| invoices (của mình) | R | - | CRUD | CRUD |
| reviews | CR | - | R | CRUD |
| notifications (của mình) | RU | RU | RU | CRUD |

Ghi chú: C = Create, R = Read, U = Update, D = Delete

---

## 8. Quy tắc nghiệp vụ

### 8.1. Quy trình đặt lịch

1. Khách hàng chọn dịch vụ, tạo booking với trạng thái PENDING
2. Hệ thống hoặc lễ tân xác nhận, chuyển sang CONFIRMED
3. Khách đến check-in, ghi nhận check_in_time
4. Bắt đầu phục vụ, chuyển sang IN_PROGRESS
5. Hoàn thành dịch vụ, chuyển sang COMPLETED
6. Tạo hóa đơn và xử lý thanh toán
7. Khách hàng đánh giá (tùy chọn)

### 8.2. Kiểm tra xung đột lịch

Trước khi gán nhân viên hoặc phòng cho booking_item, hệ thống kiểm tra không tồn tại booking_item khác có cùng staff_id hoặc resource_id với khoảng thời gian chồng lấn và booking.status không thuộc CANCELLED hoặc NO_SHOW.

### 8.3. Tính điểm thành viên

Sau khi thanh toán thành công, hệ thống tính điểm theo công thức: điểm = số tiền thanh toán / 10.000 (làm tròn xuống). Hạng thành viên được cập nhật tự động khi vượt ngưỡng.

---

## Phụ lục: Thuật ngữ

| Thuật ngữ | Giải thích |
|:---|:---|
| Booking | Lịch hẹn đặt dịch vụ |
| Booking Item | Chi tiết một dịch vụ trong booking |
| Treatment | Gói liệu trình nhiều buổi |
| Shift | Ca làm việc định sẵn |
| Resource | Phòng hoặc thiết bị |
| RLS | Row Level Security - bảo mật mức hàng |
| Soft Delete | Đánh dấu xóa thay vì xóa vật lý |
