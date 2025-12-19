# Đặc Tả Chức Năng Hệ Thống Synapse

Tài liệu này mô tả chi tiết các chức năng của hệ thống chăm sóc khách hàng trực tuyến cho Spa, được tổ chức theo nhóm tác nhân và tuân thủ chuẩn đặc tả ca sử dụng (Use Case Specification).

---

## Mục lục

1. [Phân hệ Xác thực](#1-phân-hệ-xác-thực)
2. [Phân hệ Khách hàng](#2-phân-hệ-khách-hàng)
3. [Phân hệ Lễ tân](#3-phân-hệ-lễ-tân)
4. [Phân hệ Kỹ thuật viên](#4-phân-hệ-kỹ-thuật-viên)
5. [Phân hệ Quản trị viên](#5-phân-hệ-quản-trị-viên)

---

## 1. Phân hệ Xác thực

### Bảng 3.1: Đăng ký tài khoản khách hàng

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A1.1 |
| **Tên chức năng** | Đăng ký tài khoản khách hàng |
| **Mô tả** | Khách hàng tạo tài khoản mới để sử dụng các dịch vụ trực tuyến của Spa. |
| **Tác nhân** | Khách hàng |
| **Tiền điều kiện** | Địa chỉ thư điện tử chưa tồn tại trong hệ thống. |
| **Hậu điều kiện** | Tài khoản được tạo ở trạng thái chờ kích hoạt; hồ sơ khách hàng được khởi tạo; thư xác thực được gửi đi. |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Khách hàng | Cung cấp thông tin đăng ký bao gồm địa chỉ thư điện tử, mật khẩu và họ tên. |
| 2 | Hệ thống | Kiểm tra tính hợp lệ và duy nhất của thông tin, tạo tài khoản mới và hồ sơ khách hàng tương ứng. |
| 3 | Hệ thống | Gửi thư điện tử chứa liên kết xác thực đến địa chỉ đã đăng ký. |

**Luồng ngoại lệ:** Nếu địa chỉ thư điện tử đã tồn tại hoặc thông tin không hợp lệ, hệ thống hiển thị thông báo lỗi tương ứng.

---

### Bảng 3.2: Đăng nhập

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A1.2 |
| **Tên chức năng** | Đăng nhập |
| **Mô tả** | Người dùng xác thực thông tin để truy cập hệ thống theo vai trò được phân quyền. |
| **Tác nhân** | Khách hàng, Lễ tân, Kỹ thuật viên, Quản trị viên |
| **Hậu điều kiện** | Phiên làm việc được khởi tạo với quyền truy cập phù hợp. |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Người dùng | Cung cấp địa chỉ thư điện tử và mật khẩu. |
| 2 | Hệ thống | Xác thực thông tin và cấp quyền truy cập theo vai trò. |

**Luồng ngoại lệ:** Nếu thông tin không chính xác hoặc tài khoản chưa kích hoạt, hệ thống từ chối truy cập và hiển thị thông báo phù hợp.

---

### Bảng 3.3: Khôi phục mật khẩu

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A1.3 |
| **Tên chức năng** | Khôi phục mật khẩu |
| **Mô tả** | Người dùng yêu cầu đặt lại mật khẩu khi quên mật khẩu hiện tại. |
| **Tác nhân** | Khách hàng, Lễ tân, Kỹ thuật viên, Quản trị viên |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Người dùng | Cung cấp địa chỉ thư điện tử đã đăng ký. |
| 2 | Hệ thống | Gửi liên kết đặt lại mật khẩu qua thư điện tử. |
| 3 | Người dùng | Truy cập liên kết và thiết lập mật khẩu mới. |

---

### Bảng 3.4: Cập nhật thông tin cá nhân

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A1.4 |
| **Tên chức năng** | Cập nhật thông tin cá nhân |
| **Mô tả** | Người dùng chỉnh sửa hồ sơ cá nhân để cập nhật thông tin liên lạc. |
| **Tác nhân** | Khách hàng, Lễ tân, Kỹ thuật viên, Quản trị viên |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Người dùng | Chỉnh sửa thông tin cá nhân và gửi yêu cầu cập nhật. |
| 2 | Hệ thống | Kiểm tra tính hợp lệ và lưu thay đổi vào cơ sở dữ liệu. |

---

### Bảng 3.5: Đăng xuất

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A1.5 |
| **Tên chức năng** | Đăng xuất |
| **Mô tả** | Người dùng kết thúc phiên làm việc hiện tại. |
| **Tác nhân** | Khách hàng, Lễ tân, Kỹ thuật viên, Quản trị viên |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Người dùng | Chọn chức năng đăng xuất. |
| 2 | Hệ thống | Hủy phiên làm việc và thu hồi quyền truy cập. |

---

## 2. Phân hệ Khách hàng

### Bảng 3.6: Xem danh sách dịch vụ

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A2.1 |
| **Tên chức năng** | Xem danh sách dịch vụ |
| **Mô tả** | Khách hàng duyệt qua các dịch vụ và gói liệu trình do Spa cung cấp. |
| **Tác nhân** | Khách hàng |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Khách hàng | Truy cập trang danh sách dịch vụ. |
| 2 | Hệ thống | Hiển thị danh sách dịch vụ theo danh mục, bao gồm tên, giá và hình ảnh minh họa. |

---

### Bảng 3.7: Xem chi tiết dịch vụ

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A2.2 |
| **Tên chức năng** | Xem chi tiết dịch vụ |
| **Mô tả** | Khách hàng xem thông tin đầy đủ về một dịch vụ cụ thể. |
| **Tác nhân** | Khách hàng |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Khách hàng | Chọn một dịch vụ từ danh sách. |
| 2 | Hệ thống | Hiển thị mô tả chi tiết, lợi ích, thời lượng và giá dịch vụ. |

---

### Bảng 3.8: Tìm kiếm khung giờ khả dụng

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A2.4 |
| **Tên chức năng** | Tìm kiếm khung giờ khả dụng |
| **Mô tả** | Khách hàng tìm các khung giờ còn trống để đặt lịch hẹn. Hệ thống sử dụng thuật toán tối ưu để đề xuất các lựa chọn phù hợp. |
| **Tác nhân** | Khách hàng |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Khách hàng | Chọn dịch vụ và ngày mong muốn. |
| 2 | Hệ thống | Kiểm tra lịch làm việc của kỹ thuật viên, tình trạng tài nguyên và các lịch hẹn hiện có. |
| 3 | Hệ thống | Áp dụng thuật toán tối ưu hóa để đề xuất các khung giờ khả dụng. |

**Luồng thay thế:** Nếu không còn khung giờ trong ngày đã chọn, hệ thống gợi ý các ngày lân cận còn trống.

---

### Bảng 3.9: Hoàn tất đặt lịch hẹn

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A2.5 |
| **Tên chức năng** | Hoàn tất đặt lịch hẹn |
| **Mô tả** | Khách hàng xác nhận khung giờ đã chọn để tạo lịch hẹn chính thức. |
| **Tác nhân** | Khách hàng |
| **Hậu điều kiện** | Lịch hẹn được tạo; thông báo xác nhận được gửi đến khách hàng và kỹ thuật viên. |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Khách hàng | Chọn khung giờ và xác nhận đặt lịch. |
| 2 | Hệ thống | Kiểm tra lần cuối để đảm bảo không xảy ra xung đột do đặt trùng. |
| 3 | Hệ thống | Lưu lịch hẹn và gửi thông báo xác nhận. |

**Luồng ngoại lệ:** Nếu khung giờ vừa bị người khác đặt, hệ thống thông báo và yêu cầu chọn khung giờ khác.

---

### Bảng 3.10: Tham gia danh sách chờ

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A2.6 |
| **Tên chức năng** | Tham gia danh sách chờ |
| **Mô tả** | Khi khung giờ mong muốn đã hết chỗ, khách hàng có thể đăng ký vào danh sách chờ để nhận thông báo khi có chỗ trống. |
| **Tác nhân** | Khách hàng |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Khách hàng | Chọn khung giờ đã hết chỗ và yêu cầu tham gia danh sách chờ. |
| 2 | Hệ thống | Ghi nhận thông tin khách hàng vào danh sách chờ của khung giờ đó. |
| 3 | Hệ thống | Thông báo xác nhận đã đăng ký thành công. |

**Luồng thay thế:** Khi có khách hủy lịch, hệ thống tự động thông báo cho khách trong danh sách chờ theo thứ tự ưu tiên.

---

### Bảng 3.11: Nhận hỗ trợ qua trò chuyện trực tuyến

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A2.7 |
| **Tên chức năng** | Nhận hỗ trợ qua trò chuyện trực tuyến |
| **Mô tả** | Khách hàng sử dụng tính năng trò chuyện trực tuyến để nhận tư vấn hoặc hỗ trợ đặt lịch hẹn từ nhân viên Spa. |
| **Tác nhân** | Khách hàng |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Khách hàng | Gửi tin nhắn yêu cầu hỗ trợ qua giao diện trò chuyện. |
| 2 | Hệ thống | Chuyển tin nhắn đến lễ tân để xử lý. |
| 3 | Lễ tân | Phản hồi và hỗ trợ khách hàng trực tiếp. |

---

### Bảng 3.12: Xem lịch sử đặt lịch hẹn

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A3.1 |
| **Tên chức năng** | Xem lịch sử đặt lịch hẹn |
| **Mô tả** | Khách hàng xem danh sách các lịch hẹn đã đặt, bao gồm cả đã hoàn thành và đã hủy. |
| **Tác nhân** | Khách hàng |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Khách hàng | Truy cập trang lịch sử lịch hẹn. |
| 2 | Hệ thống | Hiển thị danh sách lịch hẹn sắp xếp theo thời gian từ mới nhất. |

---

### Bảng 3.12: Hủy lịch hẹn

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A3.2 |
| **Tên chức năng** | Hủy lịch hẹn |
| **Mô tả** | Khách hàng hủy một lịch hẹn đã đặt theo chính sách của Spa. |
| **Tác nhân** | Khách hàng |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Khách hàng | Chọn lịch hẹn cần hủy và xác nhận yêu cầu. |
| 2 | Hệ thống | Kiểm tra chính sách hủy lịch và thông báo điều kiện áp dụng. |
| 3 | Hệ thống | Cập nhật trạng thái lịch hẹn và giải phóng tài nguyên. |

**Luồng ngoại lệ:** Nếu thời gian hủy quá gần với giờ hẹn, hệ thống từ chối hoặc áp dụng phí theo chính sách.

---

### Bảng 3.14: Nhận thông báo nhắc lịch

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A3.3 |
| **Tên chức năng** | Nhận thông báo nhắc lịch |
| **Mô tả** | Hệ thống tự động gửi thông báo nhắc nhở lịch hẹn cho khách hàng trước thời gian hẹn. |
| **Tác nhân** | Khách hàng |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Hệ thống | Gửi thông báo nhắc lịch qua thư điện tử hoặc tin nhắn trước thời gian hẹn (theo cấu hình). |
| 2 | Khách hàng | Xác nhận sẽ đến hoặc yêu cầu hủy lịch. |
| 3 | Hệ thống | Cập nhật trạng thái xác nhận của lịch hẹn. |

**Luồng thay thế:** Nếu khách hàng không phản hồi, hệ thống đánh dấu lịch hẹn là "Chưa xác nhận" và thông báo cho lễ tân.

---

### Bảng 3.15: Theo dõi tiến độ liệu trình

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | B1.7 |
| **Tên chức năng** | Theo dõi tiến độ liệu trình |
| **Mô tả** | Khách hàng xem số buổi còn lại và lịch sử thực hiện của liệu trình đã mua. |
| **Tác nhân** | Khách hàng, Lễ tân |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Người dùng | Truy cập thông tin liệu trình của khách hàng. |
| 2 | Hệ thống | Hiển thị tổng số buổi, số buổi đã sử dụng, ngày hết hạn và danh sách các buổi đã thực hiện. |

---

## 3. Phân hệ Lễ tân

### Bảng 3.14: Xem lịch hẹn tổng quan

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | B1.1 |
| **Tên chức năng** | Xem lịch hẹn tổng quan |
| **Mô tả** | Lễ tân theo dõi toàn bộ lịch hẹn của Spa để điều phối hoạt động. |
| **Tác nhân** | Lễ tân |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Lễ tân | Truy cập bảng điều khiển lịch hẹn. |
| 2 | Hệ thống | Hiển thị toàn bộ lịch hẹn theo ngày hoặc tuần, bao gồm thông tin khách hàng, kỹ thuật viên phụ trách và trạng thái. |

---

### Bảng 3.15: Quản lý hồ sơ khách hàng

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | B1.2 |
| **Tên chức năng** | Quản lý hồ sơ khách hàng |
| **Mô tả** | Lễ tân tìm kiếm, xem và cập nhật thông tin hồ sơ khách hàng. |
| **Tác nhân** | Lễ tân |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Lễ tân | Tìm kiếm khách hàng theo tên hoặc số điện thoại. |
| 2 | Hệ thống | Hiển thị hồ sơ khách hàng bao gồm thông tin cá nhân, lịch sử dịch vụ và ghi chú. |
| 3 | Lễ tân | Cập nhật thông tin nếu cần thiết. |

**Luồng thay thế:** Nếu khách hàng chưa có hồ sơ, lễ tân có thể tạo hồ sơ mới.

---

### Bảng 3.16: Tạo lịch hẹn thủ công

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | B1.3 |
| **Tên chức năng** | Tạo lịch hẹn thủ công |
| **Mô tả** | Lễ tân đặt lịch hẹn cho khách hàng tại quầy hoặc qua điện thoại. |
| **Tác nhân** | Lễ tân |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Lễ tân | Chọn hoặc tạo hồ sơ khách hàng. |
| 2 | Lễ tân | Chọn dịch vụ, ngày giờ và kỹ thuật viên phụ trách. |
| 3 | Hệ thống | Kiểm tra tính khả dụng và tạo lịch hẹn. |

**Luồng ngoại lệ:** Nếu khung giờ đã hết chỗ, hệ thống đề xuất khung giờ thay thế.

---

### Bảng 3.17: Xác nhận khách đến

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | B1.4 |
| **Tên chức năng** | Xác nhận khách đến |
| **Mô tả** | Lễ tân ghi nhận khách hàng đã có mặt và bắt đầu phục vụ. Nếu lịch hẹn thuộc liệu trình, hệ thống tự động trừ một buổi. |
| **Tác nhân** | Lễ tân |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Lễ tân | Tìm và chọn lịch hẹn của khách. |
| 2 | Lễ tân | Xác nhận khách đã đến. |
| 3 | Hệ thống | Cập nhật trạng thái lịch hẹn và thông báo cho kỹ thuật viên. |
| 4 | Hệ thống | Nếu lịch hẹn thuộc liệu trình, tự động trừ một buổi khỏi thẻ liệu trình. |

**Luồng ngoại lệ:** Nếu khách không đến sau thời gian chờ, lễ tân đánh dấu trạng thái "Khách không đến" để giải phóng tài nguyên.

---

### Bảng 3.18: Xử lý thanh toán

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | B1.5 |
| **Tên chức năng** | Xử lý thanh toán |
| **Mô tả** | Lễ tân thu phí sau khi dịch vụ hoàn thành và tạo hóa đơn. |
| **Tác nhân** | Lễ tân |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Lễ tân | Mở lịch hẹn đã hoàn thành để xử lý thanh toán. |
| 2 | Hệ thống | Hiển thị tổng tiền sau khi áp dụng các ưu đãi nếu có. |
| 3 | Lễ tân | Xác nhận phương thức thanh toán và hoàn tất giao dịch. |
| 4 | Hệ thống | Lưu lịch sử thanh toán và tạo hóa đơn. |

---

### Bảng 3.19: Phản hồi hỗ trợ qua trò chuyện trực tuyến

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | B1.6 |
| **Tên chức năng** | Phản hồi hỗ trợ qua trò chuyện trực tuyến |
| **Mô tả** | Lễ tân tiếp nhận và phản hồi các yêu cầu hỗ trợ từ khách hàng qua kênh trò chuyện trực tuyến. |
| **Tác nhân** | Lễ tân |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Hệ thống | Thông báo có khách hàng đang yêu cầu hỗ trợ. |
| 2 | Lễ tân | Mở phiên trò chuyện và phản hồi khách hàng. |
| 3 | Hệ thống | Lưu lịch sử hội thoại vào hồ sơ khách hàng. |

---

## 4. Phân hệ Kỹ thuật viên

### Bảng 3.20: Xem lịch làm việc cá nhân

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | B2.1 |
| **Tên chức năng** | Xem lịch làm việc cá nhân |
| **Mô tả** | Kỹ thuật viên xem danh sách khách hàng và dịch vụ được phân công trong ngày. |
| **Tác nhân** | Kỹ thuật viên |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Kỹ thuật viên | Truy cập lịch làm việc cá nhân. |
| 2 | Hệ thống | Hiển thị danh sách lịch hẹn được phân công theo thời gian. |

---

### Bảng 3.21: Ghi chú chuyên môn sau buổi hẹn

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | B2.3 |
| **Tên chức năng** | Ghi chú chuyên môn sau buổi hẹn |
| **Mô tả** | Kỹ thuật viên ghi lại tình trạng khách hàng và các lưu ý chuyên môn để phục vụ tốt hơn trong các buổi tiếp theo. |
| **Tác nhân** | Kỹ thuật viên |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Kỹ thuật viên | Chọn lịch hẹn vừa hoàn thành và mở giao diện ghi chú. |
| 2 | Kỹ thuật viên | Nhập các thông tin chuyên môn như tình trạng da, phản ứng và lưu ý đặc biệt. |
| 3 | Hệ thống | Lưu ghi chú vào hồ sơ khách hàng. |

---

## 5. Phân hệ Quản trị viên

### Bảng 3.22: Cấu hình lịch làm việc nhân viên

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | C4 |
| **Tên chức năng** | Cấu hình lịch làm việc nhân viên |
| **Mô tả** | Quản trị viên phân ca làm việc và ngày nghỉ cho kỹ thuật viên. |
| **Tác nhân** | Quản trị viên |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Quản trị viên | Chọn nhân viên và khoảng thời gian cần phân ca. |
| 2 | Quản trị viên | Chỉ định ca làm việc hoặc đánh dấu ngày nghỉ. |
| 3 | Hệ thống | Kiểm tra xung đột và lưu lịch làm việc. |

**Luồng ngoại lệ:** Nếu phát hiện xung đột với lịch hẹn hiện có, hệ thống yêu cầu giải quyết trước khi lưu.

---

### Bảng 3.23: Quản lý danh mục dịch vụ

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | C5 |
| **Tên chức năng** | Quản lý danh mục dịch vụ |
| **Mô tả** | Quản trị viên thêm, sửa hoặc vô hiệu hóa các dịch vụ do Spa cung cấp. |
| **Tác nhân** | Quản trị viên |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Quản trị viên | Chỉnh sửa thông tin dịch vụ bao gồm tên, mô tả, giá và thời lượng. |
| 2 | Hệ thống | Kiểm tra tính hợp lệ và cập nhật danh mục dịch vụ. |

---

### Bảng 3.24: Quản lý tài nguyên

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | C7 |
| **Tên chức năng** | Quản lý tài nguyên |
| **Mô tả** | Quản trị viên quản lý các tài nguyên vật lý của Spa bao gồm phòng, giường, ghế và thiết bị lớn. |
| **Tác nhân** | Quản trị viên |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Quản trị viên | Thêm mới, cập nhật hoặc vô hiệu hóa tài nguyên. |
| 2 | Hệ thống | Cập nhật thông tin và điều chỉnh tính khả dụng trong hệ thống đặt lịch. |

**Luồng thay thế:** Khi đánh dấu tài nguyên ở trạng thái bảo trì, hệ thống tạm thời loại tài nguyên đó khỏi danh sách khả dụng.

---

## Phụ lục: Hướng phát triển

Các chức năng sau được xác định nằm ngoài phạm vi khóa luận hiện tại và được ghi nhận để phát triển trong tương lai:

| Mã | Tên chức năng | Mô tả ngắn |
|----|---------------|------------|
| A3.4 | Đánh giá dịch vụ | Khách hàng phản hồi sau khi sử dụng dịch vụ |
| A3.5 | Tích lũy và đổi điểm thưởng | Chương trình khách hàng thân thiết |
| C12 | Tính toán hoa hồng nhân viên | Báo cáo tiền thưởng theo doanh số |

---

*Lưu ý: Tài liệu này đã được tinh chỉnh theo tiêu chuẩn ngôn ngữ học thuật và phạm vi khóa luận "Xây dựng hệ thống chăm sóc khách hàng trực tuyến cho Spa".*