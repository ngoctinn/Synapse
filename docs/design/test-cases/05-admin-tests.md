# KIỂM THỬ PHÂN HỆ QUẢN TRỊ

## 1. Quản lý dịch vụ

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Thêm dịch vụ | Nhập thông tin → Lưu | Tên: Massage đá nóng, Giá: 450.000, TG: 60 phút | Xuất hiện trong danh sách | |
| 2 | Sửa dịch vụ | Sửa giá → Lưu | Giá mới: 500.000 | Thông báo thành công | |
| 3 | Xóa dịch vụ | Chọn → Xóa → Xác nhận | Dịch vụ: Massage đá nóng | Ẩn khỏi danh sách | |
| 4 | Giá âm | Nhập giá âm → Lưu | Giá: -100.000 | Thông báo giá không hợp lệ | |
| 5 | Thời lượng = 0 | Nhập TG = 0 → Lưu | TG: 0 | Thông báo TG không hợp lệ | |
| 6 | Bỏ trống tên | Không nhập tên → Lưu | Tên: rỗng | Thông báo yêu cầu nhập | |

## 2. Quản lý tài nguyên

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Thêm phòng | Chọn loại Phòng → Nhập tên → Lưu | Tên: Phòng VIP 1 | Xuất hiện trong danh sách | |
| 2 | Đổi trạng thái | Chọn → Đổi trạng thái → Lưu | Trạng thái: Bảo trì | Hiển thị trạng thái mới | |
| 3 | Sức chứa = 0 | Nhập SC = 0 → Lưu | SC: 0 | Thông báo SC không hợp lệ | |

## 3. Phân ca làm việc

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Phân ca thành công | Chọn KTV, ngày, ca → Lưu | KTV: Ngọc, Ngày: 20/12, Ca: Sáng | Lịch được lưu | |
| 2 | Ca trùng lặp | Phân ca đã có → Lưu | Ngày: 20/12 (đã phân) | Thông báo ca đã tồn tại | |

## 4. Quản lý nhân viên

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Thêm nhân viên | Nhập thông tin → Lưu | Tên: Lê Thị C, Email: c@spa.vn, Vai trò: KTV | Xuất hiện trong danh sách | |
| 2 | Đổi quyền | Chọn NV → Đổi vai trò → Lưu | Vai trò: Lễ tân | Cập nhật thành công | |
| 3 | Vô hiệu hóa | Chọn NV → Vô hiệu hóa | Trạng thái: Hoạt động | Chuyển "Ngừng hoạt động" | |
| 4 | Hoa hồng > 100% | Nhập tỷ lệ = 150 → Lưu | Hoa hồng: 150 | Thông báo tỷ lệ sai | |

## 5. Báo cáo

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Xem doanh thu | Chọn khoảng thời gian → Xem | Từ: 01/12, Đến: 31/12 | Biểu đồ doanh thu | |
| 2 | Xuất Excel | Nhấn Xuất Excel | Không | Tải file báo cáo | |
