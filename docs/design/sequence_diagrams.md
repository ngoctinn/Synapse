# Tổng hợp Sơ đồ Tuần tự Hệ thống Synapse

Tài liệu này tổng hợp toàn bộ sơ đồ tuần tự của hệ thống, được tổ chức theo phân hệ chức năng.

---

## Mục lục Sơ đồ

### 1. Phân hệ Xác thực (Authentication)
| Số hình | Chức năng | Mã | File |
|---------|-----------|-----|------|
| 3.1 | Đăng ký tài khoản khách hàng | A1.1 | [authentication.md](sequences/authentication.md) |
| 3.2 | Xác thực thư điện tử | A1.1 | [authentication.md](sequences/authentication.md) |
| 3.3 | Đăng nhập | A1.2 | [authentication.md](sequences/authentication.md) |
| 3.4 | Khôi phục mật khẩu (Bước 1) | A1.3 | [authentication.md](sequences/authentication.md) |
| 3.5 | Đặt lại mật khẩu (Bước 2) | A1.3 | [authentication.md](sequences/authentication.md) |
| 3.6 | Cập nhật thông tin cá nhân | A1.4 | [authentication.md](sequences/authentication.md) |
| 3.7 | Đăng xuất | A1.5 | [authentication.md](sequences/authentication.md) |

### 2. Phân hệ Khách hàng (Customer)
| Số hình | Chức năng | Mã | File |
|---------|-----------|-----|------|
| 3.8 | Xem danh sách dịch vụ | A2.1 | [customer_flows.md](sequences/customer_flows.md) |
| 3.9 | Xem chi tiết dịch vụ | A2.2 | [customer_flows.md](sequences/customer_flows.md) |
| 3.10 | Tìm kiếm khung giờ khả dụng | A2.4 | [customer_flows.md](sequences/customer_flows.md) |
| 3.11 | Hoàn tất đặt lịch hẹn | A2.5 | [customer_flows.md](sequences/customer_flows.md) |
| 3.12 | Tham gia danh sách chờ | A2.6 | [customer_flows.md](sequences/customer_flows.md) |
| 3.13 | Nhận hỗ trợ trực tuyến | A2.7 | [customer_flows.md](sequences/customer_flows.md) |
| 3.14 | Xem lịch sử đặt lịch hẹn | A3.1 | [customer_flows.md](sequences/customer_flows.md) |
| 3.15 | Hủy lịch hẹn | A3.2 | [customer_flows.md](sequences/customer_flows.md) |
| 3.16 | Nhận thông báo nhắc lịch | A3.3 | [customer_flows.md](sequences/customer_flows.md) |
| 3.17 | Gửi yêu cầu bảo hành | A3.6 | [customer_flows.md](sequences/customer_flows.md) |

### 3. Phân hệ Lễ tân (Receptionist)
| Số hình | Chức năng | Mã | File |
|---------|-----------|-----|------|
| 3.18 | Xem lịch hẹn tổng quan | B1.1 | [receptionist_flows.md](sequences/receptionist_flows.md) |
| 3.19 | Quản lý hồ sơ khách hàng | B1.2 | [receptionist_flows.md](sequences/receptionist_flows.md) |
| 3.20 | Tạo lịch hẹn thủ công | B1.3 | [receptionist_flows.md](sequences/receptionist_flows.md) |
| 3.21 | Xác nhận khách đến & Trừ liệu trình | B1.4 | [receptionist_flows.md](sequences/receptionist_flows.md) |
| 3.22 | Xử lý thanh toán | B1.5 | [receptionist_flows.md](sequences/receptionist_flows.md) |
| 3.23 | Phản hồi hỗ trợ trực tuyến | B1.6 | [receptionist_flows.md](sequences/receptionist_flows.md) |
| 3.24 | Theo dõi tiến độ liệu trình | B1.7 | [receptionist_flows.md](sequences/receptionist_flows.md) |
| 3.25 | Quy trình tái lập lịch (Tổng quan) | B1.8 | [receptionist_flows.md](sequences/receptionist_flows.md) |

### 4. Phân hệ Kỹ thuật viên (Technician)
| Số hình | Chức năng | Mã | File |
|---------|-----------|-----|------|
| 3.26 | Xem lịch làm việc cá nhân | B2.1 | [technician_flows.md](sequences/technician_flows.md) |
| 3.27 | Ghi chú chuyên môn sau buổi hẹn | B2.3 | [technician_flows.md](sequences/technician_flows.md) |

### 5. Phân hệ Quản trị viên (Administrator)
| Số hình | Chức năng | Mã | File |
|---------|-----------|-----|------|
| 3.28 | Quản lý danh mục dịch vụ (CRUD) | C5 | [admin_flows.md](sequences/admin_flows.md) |
| 3.29 | Quản lý tài nguyên (CRUD) | C7 | [admin_flows.md](sequences/admin_flows.md) |
| 3.30 | Cấu hình lịch làm việc nhân viên | C4 | [admin_flows.md](sequences/admin_flows.md) |
| 3.31 | Cấu hình giờ hoạt động Spa | C1 | [admin_flows.md](sequences/admin_flows.md) |
| 3.32 | Quản lý ngày nghỉ lễ | C2 | [admin_flows.md](sequences/admin_flows.md) |
| 3.33 | Mời nhân viên qua Email | C3 | [admin_flows.md](sequences/admin_flows.md) |
| 3.34 | Quản lý tài khoản nhân viên | C9 | [admin_flows.md](sequences/admin_flows.md) |
| 3.35 | Cấu hình hệ thống | C10 | [admin_flows.md](sequences/admin_flows.md) |
| 3.36 | Quản lý thẻ liệu trình | C6 | [admin_flows.md](sequences/admin_flows.md) |
| 3.37 | Quản lý khuyến mãi | C8 | [admin_flows.md](sequences/admin_flows.md) |
| 3.38 | Logic Tái lập lịch (Reschedule Solver) | B1.8 | [admin_flows.md](sequences/admin_flows.md) |

---

## Tổng hợp

| Phân hệ | Số sơ đồ |
|---------|----------|
| Xác thực | 7 |
| Khách hàng | 10 |
| Lễ tân | 8 |
| Kỹ thuật viên | 2 |
| Quản trị viên | 11 |
| **Tổng cộng** | **38** |

---

## Chú thích

- Mọi sơ đồ tuân thủ kiến trúc Modular Monolith và quy tắc Vertical Slice.
- Tên hàm API được chuẩn hóa sang định dạng `snake_case`.
- Các luồng nghiệp vụ phức tạp (CRUD C5, C7) được gộp vào một sơ đồ duy nhất sử dụng khối `alt` để đảm bảo tính gọn gàng và dễ theo dõi.
