# KIỂM THỬ PHÂN HỆ XÁC THỰC

## 1. Đăng ký tài khoản

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Đăng ký thành công | Nhập email, mật khẩu hợp lệ, nhấn Gửi | Email: test@gmail.com, Mật khẩu: Abc@1234 | Hiển thị "Vui lòng kiểm tra email để xác thực tài khoản" | |
| 2 | Email đã tồn tại | Nhập email đã đăng ký, nhấn Gửi | Email: existing@gmail.com | Hiển thị "Email này đã được sử dụng" | |
| 3 | Email sai định dạng | Nhập email không hợp lệ, nhấn Gửi | Email: abc | Hiển thị "Email không đúng định dạng" | |
| 4 | Mật khẩu 7 ký tự | Nhập mật khẩu ngắn, nhấn Gửi | Mật khẩu: Abc123 | Hiển thị "Mật khẩu phải có tối thiểu 8 ký tự" | |
| 5 | Mật khẩu 8 ký tự | Nhập mật khẩu đủ 8 ký tự, nhấn Gửi | Mật khẩu: Abcd@123 | Hiển thị "Vui lòng kiểm tra email để xác thực tài khoản" | |
| 6 | Bỏ trống các trường | Không nhập dữ liệu, nhấn Gửi | Email: rỗng, Mật khẩu: rỗng | Hiển thị "Vui lòng nhập đầy đủ thông tin" | |

## 2. Đăng nhập hệ thống

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Đăng nhập thành công | Nhập thông tin đúng, nhấn Gửi | Email: user@synapse.vn, Mật khẩu: Abc@1234 | Hệ thống chuyển sang trang Dashboard | |
| 2 | Mật khẩu sai | Nhập mật khẩu sai, nhấn Gửi | Email: user@synapse.vn, Mật khẩu: sai123 | Hiển thị "Email hoặc mật khẩu không chính xác" | |
| 3 | Email không tồn tại | Nhập email chưa đăng ký, nhấn Gửi | Email: khongtontai@gmail.com | Hiển thị "Email hoặc mật khẩu không chính xác" | |
| 4 | Email chưa xác thực | Nhập tài khoản chưa kích hoạt, nhấn Gửi | Email: chuaverify@gmail.com | Hiển thị "Vui lòng xác thực email trước khi đăng nhập" | |
| 5 | Bỏ trống email | Không nhập email, nhấn Gửi | Email: rỗng | Hiển thị "Vui lòng nhập email" | |
| 6 | Bỏ trống mật khẩu | Không nhập mật khẩu, nhấn Gửi | Mật khẩu: rỗng | Hiển thị "Vui lòng nhập mật khẩu" | |

## 3. Quên mật khẩu

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Gửi yêu cầu thành công | Nhập email hợp lệ, nhấn Gửi | Email: user@synapse.vn | Hiển thị "Vui lòng kiểm tra email để đặt lại mật khẩu" | |
| 2 | Email không tồn tại | Nhập email chưa đăng ký, nhấn Gửi | Email: khongtontai@gmail.com | Hiển thị "Vui lòng kiểm tra email để đặt lại mật khẩu" | |
| 3 | Email sai định dạng | Nhập email không hợp lệ, nhấn Gửi | Email: abc | Hiển thị "Email không đúng định dạng" | |

## 4. Đặt lại mật khẩu

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Đặt lại thành công | Nhập mật khẩu mới qua link, nhấn Gửi | Mật khẩu: NewPass@123 | Hiển thị "Đặt lại mật khẩu thành công", chuyển trang đăng nhập | |
| 2 | Link hết hạn | Dùng link cũ quá 24 giờ, nhấn Gửi | Mật khẩu: NewPass@123 | Hiển thị "Link đã hết hạn, vui lòng yêu cầu lại" | |
| 3 | Mật khẩu không khớp | Nhập 2 mật khẩu khác nhau, nhấn Gửi | MK: Abc@1234, Xác nhận: Xyz@5678 | Hiển thị "Mật khẩu xác nhận không khớp" | |

## 5. Đổi mật khẩu (khi đã đăng nhập)

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Đổi mật khẩu thành công | Nhập mật khẩu mới, nhấn Lưu | Mật khẩu mới: NewPass@123 | Hiển thị "Đã cập nhật mật khẩu thành công" | |
| 2 | Mật khẩu không khớp | Nhập xác nhận khác mật khẩu mới | MK: Abc@1234, Xác nhận: Xyz@5678 | Hiển thị "Mật khẩu xác nhận không khớp" | |
| 3 | Mật khẩu mới quá ngắn | Nhập mật khẩu dưới 8 ký tự | Mật khẩu mới: Abc123 | Hiển thị "Mật khẩu phải có tối thiểu 8 ký tự" | |

## 6. Đăng xuất

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Đăng xuất thành công | Nhấn nút Đăng xuất | Không | Hệ thống chuyển về trang đăng nhập | |
| 2 | Chặn truy cập sau đăng xuất | Truy cập trực tiếp URL /dashboard | URL: /dashboard | Hệ thống tự động chuyển về trang đăng nhập | |

## 7. Cập nhật thông tin cá nhân

| STT | Mục đích kiểm thử | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế |
|:---:|:---|:---|:---|:---|:---|
| 1 | Cập nhật họ tên | Sửa họ tên, nhấn Lưu | Họ tên: Nguyễn Văn A | Hiển thị "Cập nhật thông tin thành công" | |
| 2 | SĐT sai định dạng | Nhập SĐT không hợp lệ, nhấn Lưu | SĐT: abc123 | Hiển thị "Số điện thoại không hợp lệ" | |
| 3 | Cập nhật SĐT | Nhập SĐT hợp lệ, nhấn Lưu | SĐT: 0901234567 | Hiển thị "Cập nhật thông tin thành công" | |
