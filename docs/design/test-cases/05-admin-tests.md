# KIỂM THỬ PHÂN HỆ QUẢN TRỊ

## 1. Quản lý dịch vụ

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Thêm dịch vụ | Nhập thông tin, nhấn Lưu | Tên: Massage đá nóng, Giá: 450.000, TG: 60 phút | Dịch vụ mới xuất hiện trong danh sách | |
| 2 | Sửa dịch vụ | Sửa giá, nhấn Lưu | Giá mới: 500.000 | Hiển thị "Cập nhật dịch vụ thành công" | |
| 3 | Xóa dịch vụ | Chọn dịch vụ, nhấn Xóa, xác nhận | Dịch vụ: Massage đá nóng | Dịch vụ bị ẩn khỏi danh sách | |
| 4 | Giá âm | Nhập giá âm, nhấn Lưu | Giá: -100.000 | Hiển thị "Giá dịch vụ phải lớn hơn hoặc bằng 0" | |
| 5 | Thời lượng bằng 0 | Nhập thời lượng bằng 0, nhấn Lưu | TG: 0 | Hiển thị "Thời lượng phải lớn hơn 0 phút" | |
| 6 | Bỏ trống tên | Không nhập tên, nhấn Lưu | Tên: rỗng | Hiển thị "Vui lòng nhập tên dịch vụ" | |
| 7 | Lọc dịch vụ theo danh mục | Chọn bộ lọc danh mục | Danh mục: Chăm sóc da | Chỉ hiển thị dịch vụ thuộc danh mục đã chọn | |
| 8 | Tìm kiếm dịch vụ | Nhập từ khóa vào ô tìm kiếm | Từ khóa: Massage | Chỉ hiển thị dịch vụ có tên chứa "Massage" | |
| 9 | Lọc theo trạng thái | Chọn lọc Đang kinh doanh | Trạng thái: Đang kinh doanh | Chỉ hiển thị dịch vụ đang hoạt động | |

## 2. Quản lý kỹ năng

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Thêm kỹ năng | Nhập thông tin, nhấn Lưu | Tên: Massage Thái, Mã: MASSAGE_THAI | Kỹ năng mới xuất hiện trong danh sách | |
| 2 | Sửa kỹ năng | Sửa mô tả, nhấn Lưu | Mô tả: Kỹ thuật massage Thái truyền thống | Hiển thị "Cập nhật kỹ năng thành công" | |
| 3 | Xóa kỹ năng | Chọn kỹ năng, nhấn Xóa | Kỹ năng: Massage Thái | Kỹ năng bị xóa khỏi danh sách | |
| 4 | Mã trùng lặp | Thêm kỹ năng với mã đã có | Mã: MASSAGE_THAI (đã tồn tại) | Hiển thị "Mã kỹ năng đã tồn tại" | |

## 3. Quản lý tài nguyên

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Thêm phòng | Chọn loại Phòng, nhập tên, nhấn Lưu | Tên: Phòng VIP 1 | Phòng mới xuất hiện trong danh sách | |
| 2 | Đổi trạng thái bảo trì | Chọn thiết bị, đổi trạng thái, nhấn Lưu | Trạng thái: Bảo trì | Hệ thống cập nhật trạng thái mới | |
| 3 | Sức chứa bằng 0 | Nhập sức chứa bằng 0, nhấn Lưu | SC: 0 | Hiển thị "Sức chứa phải lớn hơn 0" | |
| 4 | Thêm thiết bị | Chọn loại Thiết bị, nhập tên, nhấn Lưu | Tên: Máy xông hơi 01 | Thiết bị mới xuất hiện trong danh sách | |
| 5 | Xóa tài nguyên | Chọn phòng, nhấn Xóa | Phòng: Phòng VIP 1 | Phòng bị ẩn khỏi danh sách | |

## 4. Phân ca làm việc

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Phân ca thành công | Chọn KTV, ngày, ca, nhấn Lưu | KTV: Ngọc, Ngày: 20/12, Ca: Sáng | Lịch làm việc được lưu thành công | |
| 2 | Ca trùng lặp | Phân ca đã có, nhấn Lưu | Ngày: 20/12 (đã phân) | Hiển thị "Ca làm việc này đã tồn tại" | |
| 3 | Xóa ca làm việc | Chọn ca, nhấn Xóa | Ca: 20/12 Sáng | Ca làm việc bị xóa thành công | |

## 5. Quản lý nhân viên

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Thêm nhân viên | Nhập thông tin, nhấn Lưu | Tên: Lê Thị C, Email: c@spa.vn, Vai trò: KTV | Nhân viên mới xuất hiện trong danh sách | |
| 2 | Đổi quyền | Chọn NV, đổi vai trò, nhấn Lưu | Vai trò: Lễ tân | Hiển thị "Cập nhật vai trò thành công" | |
| 3 | Vô hiệu hóa | Chọn NV, nhấn Vô hiệu hóa | Trạng thái: Hoạt động | Trạng thái chuyển thành "Ngừng hoạt động" | |
| 4 | Hoa hồng trên 100% | Nhập tỷ lệ bằng 150, nhấn Lưu | Hoa hồng: 150 | Hiển thị "Tỷ lệ hoa hồng phải từ 0 đến 100" | |
| 5 | Gán kỹ năng cho NV | Chọn NV, thêm kỹ năng, nhấn Lưu | Kỹ năng: Massage, Mức: 3 | Kỹ năng được gán cho nhân viên | |

## 6. Cấu hình giờ hoạt động

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Cập nhật giờ mở cửa | Sửa giờ mở, nhấn Lưu | Thứ 2: 08:00 - 21:00 | Giờ hoạt động được cập nhật | |
| 2 | Đánh dấu ngày nghỉ | Chọn ngày, đánh dấu Đóng cửa | Chủ nhật: Đóng cửa | Ngày chủ nhật hiển thị "Đóng cửa" | |
| 3 | Thêm ngày nghỉ đặc biệt | Thêm ngày nghỉ lễ | Ngày: 01/01/2026, Lý do: Tết Dương lịch | Ngày nghỉ xuất hiện trong danh sách | |
| 4 | Giờ đóng trước giờ mở | Nhập giờ đóng trước giờ mở | Mở: 08:00, Đóng: 07:00 | Hiển thị "Giờ đóng cửa phải sau giờ mở cửa" | |

## 7. Báo cáo

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Xem doanh thu | Chọn khoảng thời gian, nhấn Xem | Từ: 01/12, Đến: 31/12 | Hệ thống hiển thị biểu đồ doanh thu theo thời gian | |
| 2 | Xuất Excel | Nhấn Xuất Excel | Không | Hệ thống tải về file báo cáo định dạng Excel | |
