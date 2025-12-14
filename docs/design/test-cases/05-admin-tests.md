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

## 2. Quản lý tài nguyên

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Thêm phòng | Chọn loại Phòng, nhập tên, nhấn Lưu | Tên: Phòng VIP 1 | Phòng mới xuất hiện trong danh sách | |
| 2 | Đổi trạng thái | Chọn thiết bị, đổi trạng thái, nhấn Lưu | Trạng thái: Bảo trì | Hệ thống cập nhật trạng thái mới | |
| 3 | Sức chứa bằng 0 | Nhập sức chứa bằng 0, nhấn Lưu | SC: 0 | Hiển thị "Sức chứa phải lớn hơn 0" | |

## 3. Phân ca làm việc

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Phân ca thành công | Chọn KTV, ngày, ca, nhấn Lưu | KTV: Ngọc, Ngày: 20/12, Ca: Sáng | Lịch làm việc được lưu thành công | |
| 2 | Ca trùng lặp | Phân ca đã có, nhấn Lưu | Ngày: 20/12 (đã phân) | Hiển thị "Ca làm việc này đã tồn tại" | |

## 4. Quản lý nhân viên

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Thêm nhân viên | Nhập thông tin, nhấn Lưu | Tên: Lê Thị C, Email: c@spa.vn, Vai trò: KTV | Nhân viên mới xuất hiện trong danh sách | |
| 2 | Đổi quyền | Chọn NV, đổi vai trò, nhấn Lưu | Vai trò: Lễ tân | Hiển thị "Cập nhật vai trò thành công" | |
| 3 | Vô hiệu hóa | Chọn NV, nhấn Vô hiệu hóa | Trạng thái: Hoạt động | Trạng thái chuyển thành "Ngừng hoạt động" | |
| 4 | Hoa hồng trên 100% | Nhập tỷ lệ bằng 150, nhấn Lưu | Hoa hồng: 150 | Hiển thị "Tỷ lệ hoa hồng phải từ 0 đến 100" | |

## 5. Báo cáo

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Xem doanh thu | Chọn khoảng thời gian, nhấn Xem | Từ: 01/12, Đến: 31/12 | Hệ thống hiển thị biểu đồ doanh thu theo thời gian | |
| 2 | Xuất Excel | Nhấn Xuất Excel | Không | Hệ thống tải về file báo cáo định dạng Excel | |
