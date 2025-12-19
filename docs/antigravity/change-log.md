# Change Log - Hoàn thiện tài liệu thiết kế KLTN

## [2025-12-19] - Phiên KLTN-SYNC: Đồng nhất Tài liệu Thiết kế

### Mục tiêu
Đồng nhất toàn bộ tài liệu thiết kế theo ngôn ngữ học thuật và phạm vi khóa luận tốt nghiệp "Xây dựng hệ thống chăm sóc khách hàng trực tuyến cho Spa".

### Đã thay đổi (Changed)

#### 1. usecase.md - Viết lại hoàn toàn
- **Giảm từ 868 dòng xuống ~450 dòng** (~48% gọn hơn)
- **Loại bỏ 12 chức năng ngoài phạm vi**: A2.6, A3.3-6, B1.8, C1-3, C6, C8, C12
- **Giữ lại 22 chức năng cốt lõi** với mô tả học thuật
- **Thống nhất thuật ngữ**: Không viết tắt, sử dụng ngôn ngữ chính quy
- **Thêm phần Phụ lục**: Liệt kê các chức năng "Hướng phát triển"

#### 2. sequences/authentication.md - Chuẩn hóa
- Đánh số lại các hình từ 3.1 đến 3.7
- Thống nhất thuật ngữ: "thư điện tử" thay vì "email"
- Chuẩn hóa participant labels: "Người dùng", "Khách hàng"

#### 3. sequences/customer_flows.md - Chuẩn hóa và bổ sung
- Đánh số lại các hình từ 3.8 đến 3.16
- **Bổ sung sơ đồ A2.6**: Tham gia danh sách chờ
- **Bổ sung sơ đồ A2.7**: Nhận hỗ trợ qua trò chuyện trực tuyến
- **Bổ sung sơ đồ A3.3**: Nhận thông báo nhắc lịch
- Thống nhất thuật ngữ

#### 4. sequences/receptionist_flows.md - Chuẩn hóa và bổ sung
- Đánh số lại các hình từ 3.14 đến 3.20
- **Bổ sung sơ đồ B1.2**: Quản lý hồ sơ khách hàng
- **Bổ sung sơ đồ B1.6**: Phản hồi hỗ trợ qua trò chuyện trực tuyến
- **Bổ sung sơ đồ B1.7**: Theo dõi tiến độ liệu trình
- **Loại bỏ sơ đồ B1.8**: Tái lập lịch tự động (ngoài phạm vi)

#### 5. sequences/technician_flows.md - Chuẩn hóa
- Đánh số lại các hình: 3.21, 3.22
- Thống nhất thuật ngữ

#### 6. sequences/admin_flows.md - Chuẩn hóa và loại bỏ
- Đánh số lại các hình từ 3.22 đến 3.24
- **Loại bỏ sơ đồ C12**: Tính toán hoa hồng nhân viên (ngoài phạm vi)
- **Loại bỏ sơ đồ 3.53**: Xem báo cáo doanh thu (gộp vào hướng phát triển)
- Thống nhất thuật ngữ: "Quản trị viên" thay vì "Admin"

#### 7. sequence_diagrams.md - Cập nhật mục lục
- Cập nhật bảng tổng hợp với 28 sơ đồ
- Thêm chú thích về cấu trúc và thuật ngữ

### Quy ước Thuật ngữ Áp dụng

| Cũ | Mới (Học thuật) |
|----|-----------------|
| Email | Thư điện tử |
| Admin | Quản trị viên |
| KTV | Kỹ thuật viên |
| Phòng/Giường | Tài nguyên |
| Check-in | Xác nhận khách đến |
| No-show | Khách không đến |
| Slot | Khung giờ |
| Live Chat | Trò chuyện trực tuyến |
| Booking | Lịch hẹn |
| Chatbot | (Loại bỏ - không dùng AI) |

### Tính năng Giữ lại (24)

**Xác thực**: A1.1-5
**Khách hàng**: A2.1, A2.2, A2.4, A2.5, A2.6, A2.7, A3.1, A3.2, A3.3, B1.7
**Lễ tân**: B1.1-6
**Kỹ thuật viên**: B2.1, B2.3
**Quản trị**: C4, C5, C7

### Tính năng Loại bỏ (10) - Ghi nhận "Hướng phát triển"

- A3.4: Đánh giá dịch vụ
- A3.5: Tích lũy và đổi điểm thưởng
- A3.6: Gửi yêu cầu bảo hành
- B1.8: Tái lập lịch tự động
- C1: Quản lý tài khoản người dùng
- C2: Phân quyền hệ thống
- C3: Quản lý nhân viên
- C6: Quản lý gói liệu trình
- C8: Quản lý chương trình khuyến mãi
- C12: Tính toán hoa hồng nhân viên

---

## [2025-12-19] - Phiên KLTN-FIX: Sửa 5 Vấn đề Nhất quán

### Đã thêm (Added)
- **PostgreSQL Exclusion Constraints** (`database_design.md`)
- **Mục 3: Chiến lược Kiểm soát Đồng thời** (`database_design.md`)
- **Mục 4: Quy ước Thuật ngữ** (`database_design.md`)

### Đã thay đổi (Changed)
- **Sơ đồ Đăng ký (3.7)**: Bổ sung bước tạo Customer Profile
- **Sơ đồ Check-in (3.35)**: Bổ sung logic trừ buổi liệu trình
- **Sơ đồ Quản lý Tài nguyên (3.44)**: Chuẩn hóa CRUD đầy đủ

---
