# KIỂM THỬ PHÂN HỆ XÁC THỰC

## 1. Đăng ký tài khoản

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Đăng ký thành công | Nhập email, mật khẩu hợp lệ → Gửi | Email: test@gmail.com, Mật khẩu: Abc@1234 | Thông báo xác thực email | |
| 2 | Email đã tồn tại | Nhập email đã đăng ký → Gửi | Email: existing@gmail.com | Thông báo email đã sử dụng | |
| 3 | Email sai định dạng | Nhập email không hợp lệ → Gửi | Email: abc | Thông báo định dạng sai | |
| 4 | Mật khẩu 7 ký tự | Nhập mật khẩu ngắn → Gửi | Mật khẩu: Abc123 | Thông báo tối thiểu 8 ký tự | |
| 5 | Mật khẩu 8 ký tự | Nhập mật khẩu đủ 8 ký tự → Gửi | Mật khẩu: Abcd@123 | Thông báo xác thực email | |
| 6 | Bỏ trống các trường | Không nhập dữ liệu → Gửi | Email: rỗng, Mật khẩu: rỗng | Thông báo yêu cầu nhập đủ | |

## 2. Đăng nhập hệ thống

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Đăng nhập thành công | Nhập thông tin đúng → Gửi | Email: user@synapse.vn, Mật khẩu: Abc@1234 | Chuyển trang Dashboard | |
| 2 | Mật khẩu sai | Nhập mật khẩu sai → Gửi | Email: user@synapse.vn, Mật khẩu: sai123 | Thông báo thông tin sai | |
| 3 | Email không tồn tại | Nhập email chưa đăng ký → Gửi | Email: khongtontai@gmail.com | Thông báo thông tin sai | |
| 4 | Email chưa xác thực | Nhập tài khoản chưa kích hoạt → Gửi | Email: chuaverify@gmail.com | Thông báo cần xác thực | |
| 5 | Bỏ trống email | Không nhập email → Gửi | Email: rỗng | Thông báo yêu cầu nhập | |
| 6 | Bỏ trống mật khẩu | Không nhập mật khẩu → Gửi | Mật khẩu: rỗng | Thông báo yêu cầu nhập | |

## 3. Quên mật khẩu

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Gửi yêu cầu thành công | Nhập email hợp lệ → Gửi | Email: user@synapse.vn | Thông báo kiểm tra email | |
| 2 | Email không tồn tại | Nhập email chưa đăng ký → Gửi | Email: khongtontai@gmail.com | Thông báo kiểm tra email | |
| 3 | Email sai định dạng | Nhập email không hợp lệ → Gửi | Email: abc | Thông báo định dạng sai | |

## 4. Đặt lại mật khẩu

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Đặt lại thành công | Nhập mật khẩu mới qua link → Gửi | Mật khẩu: NewPass@123 | Chuyển trang đăng nhập | |
| 2 | Link hết hạn | Dùng link cũ (>24h) → Gửi | Mật khẩu: NewPass@123 | Thông báo link hết hạn | |
| 3 | Mật khẩu không khớp | Nhập 2 mật khẩu khác nhau → Gửi | MK: Abc@1234, Xác nhận: Xyz@5678 | Thông báo không khớp | |

## 5. Đăng xuất

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Đăng xuất thành công | Nhấn Đăng xuất | Không | Chuyển trang đăng nhập | |
| 2 | Chặn truy cập sau đăng xuất | Truy cập URL /dashboard | URL: /dashboard | Chuyển hướng đăng nhập | |

## 6. Cập nhật thông tin

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Cập nhật họ tên | Sửa họ tên → Lưu | Họ tên: Nguyễn Văn A | Thông báo thành công | |
| 2 | SĐT sai định dạng | Nhập SĐT không hợp lệ → Lưu | SĐT: abc123 | Thông báo SĐT không hợp lệ | |
| 3 | Cập nhật SĐT | Nhập SĐT hợp lệ → Lưu | SĐT: 0901234567 | Thông báo thành công | |
