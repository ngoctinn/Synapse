# Đặc Tả Giao Diện Người Dùng - Synapse

Tài liệu này mô tả nguyên tắc thiết kế giao diện và danh mục các màn hình chính của hệ thống.

---

## 1. Nguyên tắc Thiết kế

### 1.1. Tối giản và Nhất quán
- **Ưu tiên sử dụng Shadcn/UI mặc định**: Sử dụng các thành phần giao diện có sẵn từ thư viện Shadcn/UI mà không tùy chỉnh quá mức.
- **Hạn chế ghi đè Tailwind**: Chỉ ghi đè style khi thực sự cần thiết cho yêu cầu nghiệp vụ đặc thù.
- **Nhất quán về màu sắc**: Sử dụng hệ màu CSS Variables đã định nghĩa trong theme, không sử dụng màu cứng.

### 1.2. Bản địa hóa
- 100% tiếng Việt cho toàn bộ nhãn, nút bấm, thông báo và hướng dẫn.
- Định dạng ngày tháng: `DD/MM/YYYY`
- Định dạng tiền tệ: `XXX.XXX VNĐ`

### 1.3. Khả năng đáp ứng
- Thiết kế ưu tiên thiết bị di động (Mobile-first).
- Giao diện lễ tân tối ưu cho máy tính bảng (Tablet) và máy tính để bàn.
- Giao diện khách hàng tối ưu cho điện thoại di động.

### 1.4. Biểu đạt Trạng thái
Sử dụng biến thể màu sắc chuẩn của Shadcn/UI:

| Trạng thái | Biến thể (Variant) |
|------------|---------------------|
| Chờ xác nhận | `secondary` |
| Đã xác nhận | `default` |
| Đang phục vụ | `outline` (với viền màu primary) |
| Hoàn thành | `default` (mờ - opacity) |
| Đã hủy | `destructive` |

---

## 2. Thành phần Giao diện Shadcn/UI

### 2.1. Thành phần Cốt lõi (Sử dụng mặc định)
| Thành phần | Mục đích sử dụng |
|------------|------------------|
| `Button` | Nút bấm hành động |
| `Input` | Trường nhập liệu |
| `Label` | Nhãn trường |
| `Card` | Khung chứa nội dung |
| `Dialog` | Hộp thoại xác nhận, biểu mẫu |
| `Table` | Bảng dữ liệu |
| `Calendar` | Chọn ngày |
| `Select` | Danh sách lựa chọn |
| `Tabs` | Điều hướng theo tab |
| `Badge` | Nhãn trạng thái |
| `Toast` | Thông báo tạm thời |
| `Alert` | Thông báo quan trọng |

### 2.2. Thành phần Mở rộng (Tùy chỉnh tối thiểu)
| Thành phần | Mục đích | Ghi chú |
|------------|----------|---------|
| `DataTable` | Bảng dữ liệu có phân trang | Dựa trên Table + Pagination |
| `ScheduleGrid` | Lưới lịch làm việc | Dựa trên Calendar |
| `StepWizard` | Quy trình nhiều bước | Dựa trên Tabs với chế độ tuần tự |

---

## 3. Danh mục Màn hình

### 3.1. Phân hệ Khách hàng

| Màn hình | Thành phần Shadcn/UI chính | Mô tả |
|----------|--------------------------|-------|
| Trang chủ | `Card`, `Button` | Giới thiệu dịch vụ và nút đặt lịch |
| Danh sách dịch vụ | `Card`, `Badge` | Hiển thị dịch vụ theo danh mục |
| Chi tiết dịch vụ | `Card`, `Button`, `Dialog` | Mô tả dịch vụ và nút đặt lịch |
| Đặt lịch hẹn | `Calendar`, `Select`, `Button` | Quy trình chọn dịch vụ, ngày giờ |
| Lịch sử lịch hẹn | `Table`, `Badge` | Danh sách lịch hẹn đã đặt |
| Theo dõi liệu trình | `Card`, `Progress`, `Badge` | Tiến độ liệu trình còn lại |
| Trò chuyện trực tuyến | `Card`, `Input`, `Button` | Giao diện trò chuyện đơn giản |

### 3.2. Phân hệ Lễ tân

| Màn hình | Thành phần Shadcn/UI chính | Mô tả |
|----------|--------------------------|-------|
| Bảng lịch hẹn | `Table`, `Badge`, `Button` | Danh sách lịch hẹn trong ngày |
| Quản lý khách hàng | `DataTable`, `Dialog`, `Input` | Tìm kiếm và cập nhật hồ sơ |
| Tạo lịch hẹn thủ công | `Dialog`, `Select`, `Calendar` | Biểu mẫu đặt lịch cho khách |
| Xác nhận khách đến | `Dialog`, `Button` | Xác nhận và cập nhật trạng thái |
| Xử lý thanh toán | `Dialog`, `Table`, `Button` | Chi tiết hóa đơn và thanh toán |
| Theo dõi liệu trình | `Card`, `Progress`, `Table` | Tiến độ liệu trình của khách |
| Trò chuyện trực tuyến | `Card`, `Input`, `Button` | Phản hồi khách hàng |

### 3.3. Phân hệ Kỹ thuật viên

| Màn hình | Thành phần Shadcn/UI chính | Mô tả |
|----------|--------------------------|-------|
| Lịch làm việc | `Card`, `Badge` | Danh sách khách hàng theo giờ |
| Ghi chú chuyên môn | `Dialog`, `Textarea`, `Button` | Nhập ghi chú sau buổi hẹn |

### 3.4. Phân hệ Quản trị viên

| Màn hình | Thành phần Shadcn/UI chính | Mô tả |
|----------|--------------------------|-------|
| Quản lý dịch vụ | `DataTable`, `Dialog` | Danh sách và biểu mẫu dịch vụ |
| Quản lý tài nguyên | `DataTable`, `Dialog` | Danh sách phòng, giường, thiết bị |
| Phân ca làm việc | `Table`, `Calendar`, `Select` | Lưới phân ca nhân viên |

---

## 4. Quy tắc Tùy chỉnh Tailwind

### 4.1. Được phép
- Sử dụng các lớp tiện ích cơ bản: `p-`, `m-`, `flex`, `grid`, `gap-`
- Sử dụng lớp responsive: `sm:`, `md:`, `lg:`
- Sử dụng biến màu CSS: `text-primary`, `bg-secondary`

### 4.2. Hạn chế
- Tránh ghi đè màu sắc trực tiếp: `text-[#FF0000]` → Dùng `text-destructive`
- Tránh ghi đè kích thước cố định: `w-[350px]` → Dùng `max-w-sm`
- Tránh ghi đè font-size trực tiếp: `text-[14px]` → Dùng `text-sm`

### 4.3. Không được phép
- Viết CSS tùy chỉnh trong file riêng cho thành phần đơn lẻ
- Sử dụng `!important` để ghi đè style
- Tạo biến thể Shadcn mới khi biến thể có sẵn đã đủ dùng

---

## 5. Luồng Trải nghiệm Tiêu biểu

### 5.1. Luồng Đặt lịch Hẹn
```
Trang chủ → Danh sách dịch vụ → Chi tiết dịch vụ → Chọn ngày giờ → Xác nhận → Hoàn tất
```

### 5.2. Luồng Xác nhận Khách đến
```
Bảng lịch hẹn → Chọn lịch hẹn → Dialog xác nhận → Cập nhật trạng thái → Thông báo thành công
```

### 5.3. Luồng Thanh toán
```
Lịch hẹn hoàn thành → Dialog thanh toán → Chọn phương thức → Xác nhận → In hóa đơn
```

---

*Lưu ý: Tài liệu này tập trung vào cấu trúc và quy tắc thiết kế. Các thiết kế chi tiết từng màn hình được thể hiện trực tiếp trong mã nguồn.*
