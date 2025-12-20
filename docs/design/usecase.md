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
| **Mô tả** | Người dùng tạo tài khoản mới để trở thành khách hàng chính thức và sử dụng các dịch vụ trực tuyến. |
| **Tác nhân** | Khách hàng (tiềm năng) |
| **Tiền điều kiện** | Hệ thống sẵn sàng tiếp nhận yêu cầu đăng ký. |
| **Hậu điều kiện** | Tài khoản được tạo ở trạng thái chờ kích hoạt; hồ sơ khách hàng được khởi tạo; thư xác thực được gửi đi. |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Khách hàng | Cung cấp thông tin đăng ký bao gồm địa chỉ thư điện tử, mật khẩu và họ tên. |
| 2 | Hệ thống | Kiểm tra tính hợp lệ và duy nhất của thông tin, tạo tài khoản mới và hồ sơ khách hàng tương ứng. |
| 3 | Hệ thống | Gửi thư điện tử chứa liên kết xác thực đến địa chỉ đã đăng ký. |

**Luồng ngoại lệ:** Nếu thông tin không hợp lệ hoặc lỗi hệ thống, hệ thống hiển thị thông báo lỗi chung.

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
| **Tiền điều kiện** | Khung giờ khả dụng đã được chọn. |
| **Hậu điều kiện** | Lịch hẹn được tạo; hồ sơ khách hàng được cập nhật/tạo mới (nếu là khách vãng lai); thông báo xác nhận được gửi đi. |

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

### Bảng 3.11: Hỗ trợ qua trò chuyện trực tuyến

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A2.7 (Hợp nhất B1.6) |
| **Tên chức năng** | Hỗ trợ qua trò chuyện trực tuyến |
| **Mô tả** | Khách hàng và Lễ tân trao đổi trực tiếp để giải đáp thắc mắc hoặc hỗ trợ đặt lịch. |
| **Tác nhân** | Khách hàng, Lễ tân |
| **Tiền điều kiện** | Khách hàng đang truy cập ứng dụng. |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Khách hàng | Gửi tin nhắn yêu cầu hỗ trợ qua giao diện trò chuyện. |
| 2 | Hệ thống | Thông báo cho Lễ tân có phiên trò chuyện mới. |
| 3 | Lễ tân | Tiếp nhận và phản hồi tin nhắn của khách hàng. |
| 4 | Hệ thống | Lưu trữ nội dung trao đổi vào lịch sử hỗ trợ. |

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

### Bảng 3.13: Hủy lịch hẹn

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A3.2 |
| **Tên chức năng** | Hủy lịch hẹn |
| **Mô tả** | Khách hàng hủy một lịch hẹn đã đặt theo chính sách của Spa. |
| **Tác nhân** | Khách hàng |
| **Mức độ ưu tiên** | Cao |
| **Sự kiện kích hoạt** | Khách hàng yêu cầu hủy một lịch hẹn. |
| **Tiền điều kiện** | Lịch hẹn đang ở trạng thái "Đã xác nhận" (CONFIRMED). |
| **Hậu điều kiện** | Lịch hẹn chuyển sang trạng thái "Đã hủy" (CANCELLED), khung giờ và tài nguyên được giải phóng. |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Khách hàng | Chọn lịch hẹn cần hủy và xác nhận yêu cầu. |
| 2 | Hệ thống | Kiểm tra chính sách hủy lịch và thông báo điều kiện áp dụng (phí hủy, hoàn cọc). |
| 3 | Hệ thống | Cập nhật trạng thái lịch hẹn và giải phóng tài nguyên. |

**Luồng ngoại lệ (2a): Quá thời hạn hủy**
- 2a.1: Hệ thống kiểm tra thấy thời gian hủy vi phạm chính sách (quá sát giờ hẹn).
- 2a.2: Hệ thống hiển thị thông báo lỗi từ chối hủy trực tuyến và hướng dẫn khách hàng liên hệ hotline.

---

### Bảng 3.14: Gửi yêu cầu bảo hành

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A3.6 |
| **Tên chức năng** | Gửi yêu cầu bảo hành |
| **Mô tả** | Khách hàng gửi yêu cầu hỗ trợ bảo hành cho gói liệu trình đã thực hiện không đạt yêu cầu. |
| **Tác nhân** | Khách hàng |
| **Mức độ ưu tiên** | Trung bình |
| **Tiền điều kiện** | Gói liệu trình (Treatment) đã hoàn thành hoặc đang sử dụng, và còn trong thời hạn bảo hành. |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Khách hàng | Chọn gói liệu trình đã mua và chọn chức năng "Yêu cầu bảo hành". |
| 2 | Khách hàng | Nhập mô tả vấn đề và tải lên hình ảnh minh họa (nếu có). |
| 3 | Hệ thống | Ghi nhận yêu cầu, tạo Ticket bảo hành liên kết với liệu trình và thông báo cho quản trị viên. |

**Luồng thay thế:** Quản trị viên sau khi kiểm tra lịch sử các buổi thực hiện trong liệu trình sẽ đưa ra phương án xử lý (bồi hoàn buổi tập, bảo dưỡng miễn phí, v.v.).

---

### Bảng 3.15: Nhận thông báo nhắc lịch

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

### Bảng 3.16: Theo dõi tiến độ liệu trình

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

### Bảng 3.17: Xem lịch hẹn tổng quan

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

### Bảng 3.18: Quản lý hồ sơ khách hàng

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

### Bảng 3.19: Tạo lịch hẹn thủ công

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

### Bảng 3.20: Xác nhận khách đến

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

### Bảng 3.21: Xử lý thanh toán

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

*(Lưu ý: Chức năng Phản hồi hỗ trợ qua trò chuyện trực tuyến đã được hợp nhất vào bảng 3.11 - A2.7)*

---

### Bảng 3.22: Tái lập lịch tự động khi có sự cố

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | B1.8 |
| **Tên chức năng** | Tái lập lịch tự động khi có sự cố |
| **Mô tả** | Hệ thống tự động xử lý các lịch hẹn bị xung đột do KTV báo nghỉ đột xuất hoặc tài nguyên bị bảo trì. |
| **Tác nhân** | Hệ thống |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Hệ thống | Phát hiện sự kiện thay đổi lịch làm việc hoặc trạng thái tài nguyên. |
| 2 | Hệ thống | Quét và xác định các lịch hẹn bị ảnh hưởng (Conflict). |
| 3 | Hệ thống | Chạy thuật toán tìm phương án thay thế tốt nhất (KTV khác cùng kỹ năng hoặc dời giờ). |
| 4 | Hệ thống | Cập nhật lịch mới và tự động gửi thông báo điều chỉnh lịch cho khách hàng. |

**Luồng ngoại lệ:** Nếu không tìm được phương án thay thế tự động, hệ thống đánh dấu "Critical" và thông báo cho lễ tân xử lý thủ công.

---

---

## 4. Phân hệ Kỹ thuật viên

### Bảng 3.23: Xem lịch làm việc cá nhân

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

### Bảng 3.24: Ghi chú chuyên môn sau buổi hẹn

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

### Bảng 3.25: Cấu hình lịch làm việc nhân viên

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

### Bảng 3.26: Quản lý danh mục dịch vụ

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

### Bảng 3.27: Quản lý tài nguyên

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

### Bảng 3.28: Quản lý thẻ liệu trình

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | C6 |
| **Tên chức năng** | Quản lý thẻ liệu trình |
| **Mô tả** | Quản trị viên thiết lập các gói liệu trình dịch vụ (Punch Card) cho khách hàng. |
| **Tác nhân** | Quản trị viên |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Quản trị viên | Định nghĩa gói dịch vụ (ví dụ: Mua 10 tặng 2). |
| 2 | Hệ thống | Khởi tạo cấu hình và cho phép lễ tân bán gói cho khách hàng. |

---

### Bảng 3.29: Quản lý chương trình khuyến mãi

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | C8 |
| **Tên chức năng** | Quản lý chương trình khuyến mãi |
| **Mô tả** | Quản trị viên thiết lập các mã giảm giá, Voucher hoặc chiến dịch khuyến mãi theo thời điểm. |
| **Tác nhân** | Quản trị viên |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Quản trị viên | Thiết lập mã khuyến mãi (Mã, Mức giảm, Hạn dùng, Điều kiện áp dụng). |
| 2 | Hệ thống | Lưu trữ và xác thực mã khi áp dụng tại quầy thanh toán. |

---

### Bảng 3.30: Cấu hình giờ hoạt động Spa

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | C1 |
| **Tên chức năng** | Cấu hình giờ hoạt động Spa |
| **Mô tả** | Quản trị viên thiết lập giờ mở cửa và đóng cửa của Spa cho từng ngày trong tuần. |
| **Tác nhân** | Quản trị viên |
| **Hậu điều kiện** | Giờ hoạt động được cập nhật và ảnh hưởng đến khung giờ khả dụng trong chức năng đặt lịch. |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Quản trị viên | Truy cập màn hình cấu hình giờ hoạt động. |
| 2 | Hệ thống | Hiển thị bảng 7 ngày với giờ mở/đóng cửa hiện tại. |
| 3 | Quản trị viên | Chỉnh sửa giờ mở/đóng cửa cho từng ngày hoặc đánh dấu ngày nghỉ. |
| 4 | Hệ thống | Kiểm tra tính hợp lệ và lưu cấu hình vào cơ sở dữ liệu. |

**Luồng thay thế:** Nếu cần thiết lập nhiều ca hoạt động trong ngày (ví dụ: 8h-12h và 14h-20h), quản trị viên thêm khoảng thời gian mới cho cùng ngày.

---

### Bảng 3.31: Quản lý ngày nghỉ lễ

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | C2 |
| **Tên chức năng** | Quản lý ngày nghỉ lễ và ngày đặc biệt |
| **Mô tả** | Quản trị viên đánh dấu các ngày nghỉ lễ, bảo trì hoặc thay đổi giờ hoạt động đặc biệt. |
| **Tác nhân** | Quản trị viên |
| **Hậu điều kiện** | Ngày ngoại lệ được ghi nhận và hệ thống chặn đặt lịch vào ngày đó (nếu nghỉ). |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Quản trị viên | Truy cập quản lý lịch ngoại lệ. |
| 2 | Quản trị viên | Thêm ngày nghỉ lễ hoặc ngày đặc biệt với lý do. |
| 3 | Quản trị viên | Chọn loại: Nghỉ lễ, Bảo trì, hoặc Giờ đặc biệt. |
| 4 | Hệ thống | Lưu vào danh sách ngày ngoại lệ và cập nhật tính khả dụng. |

**Luồng thay thế:** Nếu chọn "Giờ đặc biệt", quản trị viên nhập giờ mở/đóng cửa khác với lịch thường.

---

### Bảng 3.32: Mời nhân viên qua thư điện tử

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | C3 |
| **Tên chức năng** | Mời nhân viên mới qua thư điện tử |
| **Mô tả** | Quản trị viên gửi thư mời nhân viên tham gia hệ thống bằng địa chỉ thư điện tử. Nhân viên nhận thư và tự thiết lập mật khẩu. |
| **Tác nhân** | Quản trị viên |
| **Tiền điều kiện** | Địa chỉ thư điện tử chưa tồn tại trong hệ thống. |
| **Hậu điều kiện** | Tài khoản nhân viên được tạo ở trạng thái chờ kích hoạt; thư mời được gửi đi. |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Quản trị viên | Nhập địa chỉ thư điện tử và thông tin nhân viên mới (họ tên, vai trò). |
| 2 | Hệ thống | Kiểm tra tính duy nhất của địa chỉ thư điện tử. |
| 3 | Hệ thống | Gửi thư mời chứa liên kết kích hoạt đến địa chỉ đã nhập. |
| 4 | Nhân viên | Nhấp vào liên kết và thiết lập mật khẩu đăng nhập. |

**Luồng ngoại lệ:** Nếu địa chỉ thư điện tử đã tồn tại, hệ thống từ chối và yêu cầu nhập địa chỉ khác.

---

### Bảng 3.33: Quản lý tài khoản nhân viên

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | C9 |
| **Tên chức năng** | Quản lý tài khoản nhân viên |
| **Mô tả** | Quản trị viên xem danh sách, chỉnh sửa thông tin hoặc vô hiệu hóa tài khoản nhân viên. |
| **Tác nhân** | Quản trị viên |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Quản trị viên | Truy cập danh sách nhân viên (Lễ tân, Kỹ thuật viên). |
| 2 | Hệ thống | Hiển thị danh sách với trạng thái, vai trò và thông tin liên lạc. |
| 3 | Quản trị viên | Chọn nhân viên để xem chi tiết hoặc chỉnh sửa. |
| 4 | Hệ thống | Lưu thay đổi vào hồ sơ nhân viên. |

**Luồng thay thế:** Quản trị viên có thể vô hiệu hóa tài khoản nhân viên đã nghỉ việc thay vì xóa hoàn toàn.

---

### Bảng 3.34: Cấu hình hệ thống

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | C10 |
| **Tên chức năng** | Cấu hình hệ thống |
| **Mô tả** | Quản trị viên thiết lập các tham số toàn cục như thời gian nhắc lịch, chính sách hủy và thông tin liên hệ Spa. |
| **Tác nhân** | Quản trị viên |

**Luồng sự kiện chính:**

| Bước | Tác nhân | Hành động |
|------|----------|-----------|
| 1 | Quản trị viên | Truy cập màn hình cấu hình hệ thống. |
| 2 | Hệ thống | Hiển thị các tham số hiện tại theo nhóm (Thông báo, Chính sách, Thông tin Spa). |
| 3 | Quản trị viên | Chỉnh sửa các tham số cần thiết. |
| 4 | Hệ thống | Kiểm tra tính hợp lệ và lưu cấu hình. |

---

## Phụ lục: Hướng phát triển

Các chức năng sau được xác định nằm ngoài phạm vi khóa luận hiện tại và được ghi nhận để phát triển trong tương lai:

| Mã | Tên chức năng | Mô tả ngắn |
|----|---------------|------------|
| A3.4 | Đánh giá dịch vụ | Khách hàng phản hồi sau khi sử dụng dịch vụ |
| A3.5 | Tích lũy và đổi điểm thưởng | Chương trình khách hàng thân thiết |

---

*Lưu ý: Tài liệu này đã được tinh chỉnh theo tiêu chuẩn ngôn ngữ học thuật và phạm vi khóa luận "Xây dựng hệ thống chăm sóc khách hàng trực tuyến cho Spa".*