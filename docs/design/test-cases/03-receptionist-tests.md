# KIỂM THỬ PHÂN HỆ LỄ TÂN

## 1. Xem lịch hẹn tổng quan

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Hiển thị lịch trong ngày | Mở Dashboard | Không | Tất cả lịch hẹn hôm nay | |
| 2 | Lọc theo ngày | Chọn ngày từ bộ chọn | Ngày: mai | Lịch hẹn ngày mai | |
| 3 | Lọc theo trạng thái | Chọn bộ lọc | Trạng thái: Chờ xác nhận | Chỉ lịch đang chờ | |

## 2. Tạo lịch thủ công

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Khách mới | Nhập SĐT mới, tên → Xác nhận | SĐT: 0987654321, Tên: Văn B | Tạo khách và lịch thành công | |
| 2 | Khách cũ | Nhập SĐT có sẵn → Xác nhận | SĐT: 0901234567 | Tên tự động điền, tạo lịch | |
| 3 | Xung đột KTV | Chọn KTV có lịch → Xác nhận | KTV: Ngọc, Giờ: 10:30 (có lịch) | Thông báo KTV bận | |
| 4 | Bỏ trống SĐT | Không nhập SĐT → Xác nhận | SĐT: rỗng | Thông báo yêu cầu nhập | |

## 3. Check-in

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Check-in thành công | Chọn lịch đã xác nhận → Check-in | Trạng thái: Đã xác nhận | Chuyển "Đang phục vụ" | |
| 2 | Lịch đã hủy | Mở lịch đã hủy | Trạng thái: Đã hủy | Nút Check-in ẩn | |
| 3 | Đánh dấu không đến | Chọn lịch quá giờ → Không đến | Giờ hẹn: quá 15 phút | Chuyển "Không đến" | |

## 4. Xác nhận lịch

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Xác nhận lịch chờ | Chọn lịch chờ → Xác nhận | Trạng thái: Chờ xác nhận | Chuyển "Đã xác nhận" | |

## 5. Thanh toán

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Tiền mặt | Chọn Tiền mặt → Xác nhận | Số tiền: 500.000đ | Tạo hóa đơn, hoàn thành | |
| 2 | Chuyển khoản | Chọn CK → Nhập mã GD → Xác nhận | Mã GD: VCB123 | Lưu mã giao dịch | |
| 3 | Số tiền âm | Nhập số âm → Xác nhận | Số tiền: -100.000 | Thông báo số tiền sai | |
| 4 | Số tiền bằng 0 | Nhập 0 → Xác nhận | Số tiền: 0 | Thông báo số tiền sai | |
