# KIỂM THỬ PHÂN HỆ KHÁCH HÀNG

## 1. Xem dịch vụ

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Hiển thị danh sách | Truy cập trang Dịch vụ | Không | Hệ thống hiển thị danh sách dịch vụ theo danh mục | |
| 2 | Xem chi tiết | Chọn một dịch vụ | Dịch vụ: Massage toàn thân | Hệ thống hiển thị tên, giá, thời lượng, mô tả | |
| 3 | Lọc theo danh mục | Chọn bộ lọc danh mục | Danh mục: Chăm sóc da | Hệ thống chỉ hiển thị dịch vụ thuộc danh mục đã chọn | |

## 2. Tìm khung giờ

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Tìm giờ trống | Chọn dịch vụ, ngày, nhấn Tìm | Dịch vụ: Massage, Ngày: mai | Hệ thống hiển thị danh sách khung giờ khả dụng | |
| 2 | Không còn giờ trống | Chọn ngày đã đầy, nhấn Tìm | Ngày: 20/12/2025 (đầy) | Hiển thị "Không còn khung giờ trống cho ngày này" | |
| 3 | Lọc theo KTV | Chọn KTV cụ thể, nhấn Tìm | KTV: Ngọc Anh | Hệ thống chỉ hiển thị giờ KTV đó rảnh | |

## 3. Đặt lịch hẹn

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Đặt lịch thành công | Chọn dịch vụ, giờ, nhấn Xác nhận | Giờ: 10:00 | Hiển thị "Đặt lịch thành công", gửi email xác nhận | |
| 2 | Xung đột giờ | Xác nhận giờ vừa bị đặt | Giờ: 10:00 (đã đặt) | Hiển thị "Khung giờ đã hết, vui lòng chọn giờ khác" | |
| 3 | Thêm ghi chú | Nhập ghi chú, nhấn Xác nhận | Ghi chú: Dị ứng tinh dầu | Ghi chú được lưu cùng lịch hẹn | |

## 4. Hủy lịch hẹn

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Hủy trước 2 giờ | Chọn lịch, nhấn Hủy, nhập lý do | Lý do: Có việc đột xuất | Hiển thị "Hủy lịch hẹn thành công" | |
| 2 | Hủy dưới 2 giờ | Chọn lịch sắp tới, nhấn Hủy | Thời gian còn: dưới 2 giờ | Hiển thị "Không thể hủy trong vòng 2 giờ trước giờ hẹn" | |
| 3 | Lịch đã hoàn thành | Mở lịch hoàn thành | Trạng thái: Hoàn thành | Nút Hủy không hiển thị | |

## 5. Xem lịch sử

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Hiển thị lịch sử | Truy cập trang Lịch sử | Không | Hệ thống hiển thị danh sách lịch hẹn đã đặt | |

## 6. Đánh giá dịch vụ

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Đánh giá thành công | Chọn số sao, nhập nhận xét, nhấn Gửi | Số sao: 4, Nhận xét: Tốt | Hiển thị "Cảm ơn bạn đã đánh giá!" | |
| 2 | Lịch chưa hoàn thành | Mở lịch đang xử lý | Trạng thái: Đã xác nhận | Nút Đánh giá không hiển thị | |
| 3 | Đánh giá 1 sao | Chọn 1 sao, nhấn Gửi | Số sao: 1 | Hệ thống lưu đánh giá 1 sao thành công | |
| 4 | Đánh giá 5 sao | Chọn 5 sao, nhấn Gửi | Số sao: 5 | Hệ thống lưu đánh giá 5 sao thành công | |
| 5 | Đánh giá trùng lặp | Đánh giá lịch đã có đánh giá | Lịch: đã đánh giá trước đó | Hiển thị "Bạn đã đánh giá lịch hẹn này rồi" | |
