# BỔ SUNG CÁC BẢNG KIỂM THỬ CHỨC NĂNG CÒN THIẾU (4.3.2.7)

Dưới đây là các bảng kiểm thử bổ sung cho các tính năng quan trọng trong hệ thống nhưng chưa được liệt kê trong các phần trước.

### 4.3.2.7 Phân hệ Quản lý Danh sách chờ (Waitlist)
**Bảng 4.37 Kiểm thử chức năng Quản lý Danh sách chờ**

| Mã | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Status |
|----|----------|----------------|-----------------|------------------|--------|
| WL_01 | Chuyển danh sách chờ thành lịch hẹn | 1. Chọn một mục "Chờ" trong danh sách<br>2. Nhấn "Chuyển thành lịch hẹn"<br>3. Chọn khung giờ trống | N/A | Thông báo "Chuyển đổi thành công".<br>Mục đó biến mất khỏi danh sách chờ và xuất hiện trong lịch hẹn. | Pass |
| WL_02 | Thông báo cho khách hàng | 1. Nhấn "Gửi thông báo" cho khách trong danh sách chờ | N/A | Hệ thống gửi thông báo (Email/App) cho khách hàng báo có chỗ trống. | Pass |
| WL_03 | Hủy yêu cầu chờ | 1. Nhấn "Hủy" yêu cầu chờ | Lý do: "Khách đổi ý" | Trạng thái chuyển thành "Đã hủy". | Pass |

### 4.3.2.8 Phân hệ Thanh toán nâng cao
**Bảng 4.38 Kiểm thử chức năng Thanh toán nâng cao**

| Mã | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Status |
|----|----------|----------------|-----------------|------------------|--------|
| TT_03 | Thanh toán từng phần | 1. Chọn hóa đơn 1.000.000đ<br>2. Nhập số tiền thanh toán: 500.000đ<br>3. Nhấn "Thanh toán" | Số tiền: 500.000 | Trạng thái hóa đơn chuyển thành "Thanh toán một phần" (Partially Paid).<br>Số dư còn lại hiển thị 500.000đ. | Pass |
| TT_04 | Đa phương thức thanh toán | 1. Thanh toán hóa đơn bằng cả Tiền mặt và Chuyển khoản | Tiền mặt: 200k<br>CK: 800k | Hóa đơn ghi nhận đủ 2 giao dịch.<br>Trạng thái chuyển thành "Đã thanh toán". | Pass |
| TT_05 | Hủy hóa đơn (Void) | 1. Chọn hóa đơn sai<br>2. Nhấn "Hủy hóa đơn" | Lý do: "Nhập sai dịch vụ" | Trạng thái hóa đơn chuyển thành "Đã hủy" (Void).<br>Doanh thu trong báo cáo được trừ tương ứng. | Pass |

### 4.3.2.9 Phân hệ Quản lý Kỹ năng nhân viên
**Bảng 4.39 Kiểm thử chức năng Quản lý Kỹ năng**

| Mã | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Status |
|----|----------|----------------|-----------------|------------------|--------|
| SK_01 | Gán kỹ năng cho nhân viên | 1. Vào hồ sơ nhân viên<br>2. Chọn các dịch vụ nhân viên có thể thực hiện<br>3. Lưu | Kỹ năng: "Chăm sóc da", "Massage" | Nhân viên được liên kết với các dịch vụ đã chọn. | Pass |
| SK_02 | Lọc nhân viên theo kỹ năng khi đặt lịch | 1. Khách hàng chọn dịch vụ "Massage"<br>2. Xem danh sách KTV | Dịch vụ: "Massage" | Chỉ hiển thị các KTV có kỹ năng "Massage". | Pass |

### 4.3.2.10 Phân hệ Hồ sơ trị liệu chi tiết (Technician)
**Bảng 4.40 Kiểm thử chức năng Hồ sơ trị liệu**

| Mã | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Status |
|----|----------|----------------|-----------------|------------------|--------|
| HS_01 | Tạo hồ sơ trị liệu chi tiết | 1. Trong buổi hẹn, nhấn "Tạo hồ sơ trị liệu"<br>2. Nhập tình trạng da, sản phẩm sử dụng, lưu ý | Tình trạng: "Da khô"<br>Sản phẩm: "Serum A" | Hồ sơ được lưu vào lịch sử trị liệu của khách hàng.<br>KTV khác có thể xem lại ở buổi sau. | Pass |

### 4.3.2.11 Phân hệ Cấu hình hệ thống
**Bảng 4.41 Kiểm thử chức năng Cấu hình hệ thống**

| Mã | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Status |
|----|----------|----------------|-----------------|------------------|--------|
| CFG_01 | Cập nhật thông tin Spa | 1. Vào "Cài đặt hệ thống"<br>2. Thay đổi Tên Spa, Địa chỉ, Hotline<br>3. Lưu | Tên: "Synapse Spa V2" | Thông tin mới hiển thị trên Header và chân trang hóa đơn. | Pass |
