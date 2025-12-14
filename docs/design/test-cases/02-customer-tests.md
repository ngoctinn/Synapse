# KIỂM THỬ PHÂN HỆ KHÁCH HÀNG

## 1. Xem dịch vụ

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Hiển thị danh sách | Truy cập trang Dịch vụ | Không | Danh sách dịch vụ theo danh mục | |
| 2 | Xem chi tiết | Chọn một dịch vụ | Dịch vụ: Massage toàn thân | Hiển thị tên, giá, thời lượng | |
| 3 | Lọc theo danh mục | Chọn bộ lọc danh mục | Danh mục: Chăm sóc da | Chỉ hiển thị dịch vụ thuộc danh mục | |

## 2. Tìm khung giờ

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Tìm giờ trống | Chọn dịch vụ, ngày → Tìm | Dịch vụ: Massage, Ngày: mai | Danh sách khung giờ khả dụng | |
| 2 | Không còn giờ trống | Chọn ngày đã đầy → Tìm | Ngày: 20/12/2025 (đầy) | Thông báo hết giờ trống | |
| 3 | Lọc theo KTV | Chọn KTV cụ thể → Tìm | KTV: Ngọc Anh | Chỉ hiển thị giờ KTV đó rảnh | |

## 3. Đặt lịch hẹn

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Đặt lịch thành công | Chọn dịch vụ, giờ → Xác nhận | Giờ: 10:00 | Thông báo thành công, gửi email | |
| 2 | Xung đột giờ | Xác nhận giờ vừa bị đặt | Giờ: 10:00 (đã đặt) | Thông báo chọn giờ khác | |
| 3 | Thêm ghi chú | Nhập ghi chú → Xác nhận | Ghi chú: Dị ứng tinh dầu | Ghi chú được lưu | |

## 4. Hủy lịch hẹn

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Hủy trước 2 giờ | Chọn lịch → Hủy → Nhập lý do | Lý do: Có việc đột xuất | Thông báo hủy thành công | |
| 2 | Hủy dưới 2 giờ | Chọn lịch sắp tới → Hủy | Thời gian còn: <2 giờ | Thông báo không thể hủy | |
| 3 | Lịch đã hoàn thành | Mở lịch hoàn thành | Trạng thái: Hoàn thành | Nút Hủy không hiển thị | |

## 5. Xem lịch sử

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Hiển thị lịch sử | Truy cập trang Lịch sử | Không | Danh sách lịch hẹn đã đặt | |

## 6. Đánh giá dịch vụ

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Đánh giá thành công | Chọn số sao, nhập nhận xét → Gửi | Số sao: 4, Nhận xét: Tốt | Thông báo cảm ơn | |
| 2 | Lịch chưa hoàn thành | Mở lịch đang xử lý | Trạng thái: Đã xác nhận | Nút Đánh giá ẩn | |
| 3 | Đánh giá 1 sao | Chọn 1 sao → Gửi | Số sao: 1 | Lưu đánh giá thành công | |
| 4 | Đánh giá 5 sao | Chọn 5 sao → Gửi | Số sao: 5 | Lưu đánh giá thành công | |
| 5 | Đánh giá trùng lặp | Đánh giá lịch đã có | Lịch: đã đánh giá | Thông báo đã đánh giá | |
