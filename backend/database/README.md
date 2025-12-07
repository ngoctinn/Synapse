# Synapse Database Schema

Thư mục này chứa các file SQL để khởi tạo và quản lý cơ sở dữ liệu cho hệ thống Synapse.

## Cấu trúc File

```
database/
├── README.md           # Tài liệu này
├── schema.sql          # Schema đầy đủ (production-ready)
└── migrations/         # Các migration files (quản lý bởi Alembic)
```

## Yêu cầu

- **PostgreSQL 14+** (được cung cấp bởi Supabase)
- **Supabase Auth** đã được cấu hình

## Cách sử dụng

### 1. Khởi tạo Database mới (Fresh Setup)

Chạy file `schema.sql` trực tiếp trên Supabase SQL Editor hoặc qua psql:

```bash
psql -h <supabase-host> -U postgres -d postgres -f schema.sql
```

### 2. Sử dụng với Alembic (Khuyến nghị)

Trong môi trường development, sử dụng Alembic để quản lý migrations:

```bash
cd backend
alembic upgrade head
```

## Cấu trúc Schema

### Các Module chính

| Module | Bảng | Mô tả |
|:---|:---|:---|
| **Users** | `users`, `staff_profiles`, `customer_profiles` | Quản lý người dùng và hồ sơ |
| **Skills** | `skills`, `staff_skills` | Kỹ năng chuyên môn KTV |
| **Services** | `service_categories`, `services`, `service_required_skills`, `service_resource_requirements` | Danh mục dịch vụ |
| **Resources** | `resources` | Quản lý phòng và thiết bị |
| **Scheduling** | `shifts`, `staff_schedules` | Lịch làm việc nhân viên |
| **Bookings** | `bookings`, `booking_items`, `customer_treatments` | Đặt lịch hẹn |
| **Billing** | `invoices`, `payments` | Thanh toán |
| **Reviews** | `reviews` | Đánh giá khách hàng |
| **System** | `notifications`, `system_configurations`, `audit_logs` | Hệ thống |

### Vai trò người dùng (Roles)

| Role | Tên Việt | Mô tả |
|:---|:---|:---|
| `admin` | Quản trị viên | Toàn quyền quản lý hệ thống |
| `receptionist` | Lễ tân | Quản lý booking, thanh toán |
| `technician` | Kỹ thuật viên (KTV) | Thực hiện dịch vụ |
| `customer` | Khách hàng | Đặt lịch, đánh giá |

## Row Level Security (RLS)

Schema đã bao gồm đầy đủ RLS Policies để bảo vệ dữ liệu:

- **Khách hàng**: Chỉ xem được dữ liệu của mình
- **KTV**: Xem lịch cá nhân, cập nhật buổi làm của mình
- **Lễ tân**: Xem tất cả booking, quản lý thanh toán
- **Admin**: Toàn quyền

## Lưu ý Quan trọng

1. **Không chạy trực tiếp trên Production** - Sử dụng migrations
2. **Backup trước khi thay đổi** - Luôn backup database trước khi apply schema mới
3. **Seed data là mẫu** - Dữ liệu seed ở cuối file chỉ dành cho development

## Changelog

- **v2.0** (2025-12-07): Chuẩn hóa vai trò, thêm RLS policies đầy đủ, tối ưu indexes
- **v1.0**: Schema ban đầu
