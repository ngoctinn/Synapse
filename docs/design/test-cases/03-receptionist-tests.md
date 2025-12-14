# KIỂM THỬ PHÂN HỆ LỄ TÂN

## 1. Xem lịch hẹn tổng quan

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Hiển thị lịch trong ngày | Mở trang Dashboard | Không | Hệ thống hiển thị tất cả lịch hẹn trong ngày | |
| 2 | Lọc theo ngày | Chọn ngày từ bộ chọn | Ngày: mai | Hệ thống hiển thị lịch hẹn ngày mai | |
| 3 | Lọc theo trạng thái | Chọn bộ lọc trạng thái | Trạng thái: Chờ xác nhận | Hệ thống chỉ hiển thị lịch đang chờ | |
| 4 | Lọc theo KTV | Chọn bộ lọc nhân viên | KTV: Ngọc Anh | Hệ thống chỉ hiển thị lịch của KTV đó | |

## 2. Tạo lịch thủ công

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Khách mới | Nhập SĐT mới, tên, nhấn Xác nhận | SĐT: 0987654321, Tên: Văn B | Hệ thống tạo khách hàng mới và lịch hẹn thành công | |
| 2 | Khách cũ | Nhập SĐT có sẵn, nhấn Xác nhận | SĐT: 0901234567 | Hệ thống tự động điền tên, tạo lịch hẹn | |
| 3 | Xung đột KTV | Chọn KTV có lịch, nhấn Xác nhận | KTV: Ngọc, Giờ: 10:30 | Hiển thị "KTV đã có lịch trong khung giờ này" | |
| 4 | Bỏ trống SĐT | Không nhập SĐT, nhấn Xác nhận | SĐT: rỗng | Hiển thị "Vui lòng nhập số điện thoại khách hàng" | |

## 3. Check-in

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Check-in thành công | Chọn lịch đã xác nhận, nhấn Check-in | Trạng thái: Đã xác nhận | Trạng thái chuyển thành "Đang phục vụ" | |
| 2 | Lịch đã hủy | Mở lịch đã hủy | Trạng thái: Đã hủy | Nút Check-in không hiển thị | |
| 3 | Đánh dấu không đến | Chọn lịch quá giờ, nhấn Không đến | Giờ hẹn: quá 15 phút | Trạng thái chuyển thành "Không đến" | |

## 4. Xác nhận lịch

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Xác nhận lịch chờ | Chọn lịch chờ, nhấn Xác nhận | Trạng thái: Chờ xác nhận | Trạng thái chuyển thành "Đã xác nhận" | |

## 5. Thanh toán

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Tiền mặt | Chọn Tiền mặt, nhấn Xác nhận | Số tiền: 500.000đ | Hệ thống tạo hóa đơn, chuyển trạng thái "Hoàn thành" | |
| 2 | Chuyển khoản | Chọn Chuyển khoản, nhập mã GD, nhấn Xác nhận | Mã GD: VCB123 | Hệ thống lưu mã giao dịch vào hóa đơn | |
| 3 | Thẻ tín dụng | Chọn Thẻ, nhấn Xác nhận | Phương thức: CARD | Hệ thống tạo hóa đơn với phương thức thẻ | |
| 4 | Số tiền âm | Nhập số âm, nhấn Xác nhận | Số tiền: -100.000 | Hiển thị "Số tiền phải lớn hơn 0" | |
| 5 | Số tiền bằng 0 | Nhập 0, nhấn Xác nhận | Số tiền: 0 | Hiển thị "Số tiền phải lớn hơn 0" | |
| 6 | Xem lịch sử thanh toán | Mở chi tiết hóa đơn | Mã hóa đơn: INV001 | Hiển thị thông tin thanh toán chi tiết | |

## 6. Quản lý khách hàng

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Tìm khách theo SĐT | Nhập SĐT vào ô tìm kiếm | SĐT: 0901234567 | Hiển thị thông tin khách hàng tương ứng | |
| 2 | Tìm khách theo tên | Nhập tên vào ô tìm kiếm | Tên: Nguyễn | Hiển thị danh sách khách có tên chứa "Nguyễn" | |
| 3 | Xem lịch sử khách | Chọn khách, xem tab Lịch sử | Khách: Nguyễn Văn A | Hiển thị danh sách lịch hẹn của khách | |
| 4 | Cập nhật thông tin khách | Sửa thông tin, nhấn Lưu | Email: new@email.com | Hiển thị "Cập nhật thông tin thành công" | |
