# Đặc Tả Use Case Hệ Thống Synapse

Tài liệu này mô tả các tình huống sử dụng hệ thống Synapse bằng ngôn ngữ đơn giản, tập trung vào tương tác giữa người dùng và hệ thống.

---

## 2. NHÓM TÍNH NĂNG CHO KHÁCH HÀNG (MODULE A)

### A2.1: Xem danh sách dịch vụ
- **Người thực hiện (Actor):** Khách hàng
- **Mục tiêu:** Khách tìm thấy các dịch vụ và liệu trình mình cần.
- **Tiền điều kiện:** Không có.
- **Các bước thực hiện:**
    1. Khách hàng yêu cầu xem danh sách dịch vụ.
    2. Hệ thống hiển thị tất cả các dịch vụ đang được Spa cung cấp.
- **Kết quả mong đợi:** Khách hàng thấy được tên dịch vụ, mô tả ngắn và giá cả.

---

### A2.2: Xem chi tiết dịch vụ
- **Người thực hiện:** Khách hàng
- **Mục tiêu:** Khách nắm rõ thông tin cụ thể về một dịch vụ (thời gian, giá, nội dung).
- **Tiền điều kiện:** Đang ở trang danh sách dịch vụ.
- **Các bước thực hiện:**
    1. Khách hàng chọn một dịch vụ cụ thể.
    2. Hệ thống hiển thị thông tin chi tiết gồm: Mô tả đầy đủ, thời lượng thực hiện, và giá tiền.
- **Kết quả mong đợi:** Khách hàng hiểu rõ dịch vụ để quyết định đặt lịch.

---

### A2.4: Tìm khung giờ trống
- **Người thực hiện:** Khách hàng
- **Mục tiêu:** Khách tìm được giờ còn trống phù hợp với mình.
- **Tiền điều kiện:** Đã chọn một dịch vụ.
- **Các bước thực hiện:**
    1. Khách hàng chọn ngày muốn đến và chọn Kỹ thuật viên (nếu muốn).
    2. Hệ thống kiểm tra lịch làm việc và tài nguyên để hiển thị các giờ còn trống.
    3. Hệ thống trả về danh sách khung giờ mà khách có thể đặt.
- **Trường hợp khác:** Nếu ngày khách chọn đã hết giờ, hệ thống sẽ báo và gợi ý các ngày gần nhất còn trống.
- **Kết quả mong đợi:** Khách chọn được một khung giờ ưng ý.

---

### A2.5: Đặt lịch hẹn
- **Người thực hiện:** Khách hàng
- **Mục tiêu:** Khách hàng đặt chỗ thành công.
- **Tiền điều kiện:** Đã chọn được dịch vụ và khung giờ trống.
- **Các bước thực hiện:**
    1. Khách hàng bấm xác nhận đặt lịch.
    2. Hệ thống kiểm tra lại giờ trống một lần cuối để tránh trùng lịch.
    3. Hệ thống lưu lịch hẹn và gửi thông báo xác nhận cho khách qua Email/Hệ thống.
- **Kết quả mong đợi:** Lịch hẹn được tạo và khách nhận được thông báo thành công.

---

### A2.6: Đăng ký danh sách chờ
- **Người thực hiện:** Khách hàng
- **Mục tiêu:** Nhận thông báo sớm nhất khi có người khác hủy lịch vào giờ mình muốn.
- **Tiền điều kiện:** Khung giờ khách muốn đã bị người khác đặt hết.
- **Các bước thực hiện:**
    1. Khách hàng chọn đăng ký vào danh sách chờ của giờ đó.
    2. Hệ thống ghi nhận yêu cầu của khách.
    3. Hệ thống báo cho khách biết đã đăng ký thành công.
- **Kết quả mong đợi:** Khách yên tâm đợi thông báo nếu có chỗ trống.

---

### A2.7: Nhắn tin qua Live Chat
- **Người thực hiện:** Khách hàng, Lễ tân
- **Mục tiêu:** Khách được giải đáp thắc mắc ngay lập tức.
- **Các bước thực hiện:**
    1. Khách hàng nhập tin nhắn hỏi về dịch vụ hoặc đặt lịch.
    2. Hệ thống tự động trả lời các câu hỏi thường gặp (nếu có).
    3. Nếu khách muốn gặp nhân viên, hệ thống sẽ kết nối khách với Lễ tân đang trực.
    4. Lễ tân nhắn tin tư vấn trực tiếp cho khách.
- **Kết quả mong đợi:** Khách hàng được tư vấn và hỗ trợ kịp thời.

---

### A2.8: Xem lịch sử đặt lịch
- **Người thực hiện:** Khách hàng
- **Mục tiêu:** Khách theo dõi lại các lịch hẹn cũ và mới của mình.
- **Tiền điều kiện:** Đã đăng nhập.
- **Các bước thực hiện:**
    1. Khách hàng vào mục lịch sử cá nhân.
    2. Hệ thống hiển thị danh sách các lịch hẹn (đang chờ, đã xong, hoặc đã hủy).
- **Kết quả mong đợi:** Khách nắm được lộ trình làm đẹp của mình tại Spa.

---

### A3.2: Hủy lịch hẹn
- **Người thực hiện:** Khách hàng
- **Mục tiêu:** Hủy chỗ đã đặt khi có việc bận đột xuất.
- **Tiền điều kiện:** Lịch hẹn chưa bắt đầu.
- **Các bước thực hiện:**
    1. Khách hàng chọn lịch muốn hủy và bấm nút Hủy.
    2. Hệ thống kiểm tra xem có quá hạn hủy (ví dụ: 2 tiếng trước giờ hẹn) hay không.
    3. Nếu hợp lệ, hệ thống cập nhật trạng thái đã hủy và báo cho Lễ tân biết.
- **Kết quả mong đợi:** Lịch hẹn được hủy và chỗ đó được mở lại cho người khác đặt.

---

### A3.4: Đánh giá dịch vụ
- **Người thực hiện:** Khách hàng
- **Mục tiêu:** Phản hồi ý kiến về chất lượng phục vụ.
- **Tiền điều kiện:** Buổi hẹn đã hoàn thành.
- **Các bước thực hiện:**
    1. Khách hàng vào đánh giá buổi hẹn vừa xong.
    2. Khách chọn số sao và nhập cảm nhận.
    3. Hệ thống lưu đánh giá và gửi lời cảm ơn khách.
- **Kết quả mong đợi:** Spa nhận được ý kiến đóng góp từ khách hàng.

---

## 3. NHÓM TÍNH NĂNG CHO LỄ TÂN (MODULE B1)

### B1.1: Xem tổng quan lịch hẹn
- **Người thực hiện:** Lễ tân
- **Mục tiêu:** Theo dõi mọi hoạt động trong ngày tại Spa để phục vụ khách tốt nhất.
- **Các bước thực hiện:**
    1. Lễ tân mở trang quản lý lịch hẹn (Dashboard).
    2. Hệ thống hiển thị danh sách tất cả các lịch trong ngày/tuần.
    3. Lễ tân xem được ai đang đến, ai đang làm và phòng nào đang trống.
- **Kết quả mong đợi:** Lễ tân nắm bắt được tình hình hoạt động của Spa.

---

### B1.4: Đón khách và Check-in
- **Người thực hiện:** Lễ tân
- **Mục tiêu:** Ghi nhận khách đã đến bắt đầu sử dụng dịch vụ.
- **Các bước thực hiện:**
    1. Khách hàng đến và đọc số điện thoại hoặc mã lịch.
    2. Lễ tân tìm lịch hẹn của khách trên hệ thống.
    3. Lễ tân bấm xác nhận khách đã đến (Check-in).
    4. Hệ thống báo cho nhân viên phục vụ chuẩn bị.
- **Kết quả mong đợi:** Buổi hẹn chính thức bắt đầu.

---

### B1.5: Thu tiền (Thanh toán)
- **Người thực hiện:** Lễ tân
- **Mục tiêu:** Hoàn tất việc thu tiền sau khi dịch vụ xong.
- **Các bước thực hiện:**
    1. Sau khi khách làm xong, Lễ tân mở hóa đơn của khách.
    2. Hệ thống tính tổng tiền (đã trừ khuyến mãi nếu có).
    3. Lễ tân thu tiền (tiền mặt, thẻ, hoặc chuyển khoản) và xác nhận thành công.
    4. Hệ thống in hóa đơn (nếu khách cần) và lưu lịch sử.
- **Kết quả mong đợi:** Thanh toán xong, ghi nhận doanh thu cho Spa.

---

### B1.8: Thay đổi lịch do sự cố (Dời lịch)
- **Người thực hiện:** Lễ tân
- **Mục tiêu:** Xử lý nhanh khi có nhân viên nghỉ đột xuất hoặc phòng bị hỏng.
- **Các bước thực hiện:**
    1. Lễ tân báo trên hệ thống rằng nhân viên hoặc phòng đó đang gặp sự cố.
    2. Hệ thống tự động liệt kê các lịch hẹn bị ảnh hưởng.
    3. Hệ thống gợi ý các giờ trống hoặc nhân viên khác để thay thế.
    4. Lễ tân chọn phương án tốt nhất và thông báo cho khách hàng qua điện thoại/tin nhắn.
- **Kết quả mong đợi:** Các lịch hẹn được sắp xếp lại ổn thỏa, hạn chế ảnh hưởng đến khách.

---

## 4. NHÓM TÍNH NĂNG CHO QUẢN TRỊ VIÊN (MODULE C)

### C12: Tính hoa hồng nhân viên
- **Người thực hiện:** Quản trị viên (Admin)
- **Mục tiêu:** Tính toán số tiền hoa hồng nhân viên được nhận hàng tháng.
- **Các bước thực hiện:**
    1. Admin chọn tên nhân viên và khoảng thời gian cần tính (ví dụ: tháng này).
    2. Hệ thống quét tất cả các lịch hẹn mà nhân viên đó đã thực hiện và khách đã trả tiền.
    3. Hệ thống tự động nhân số tiền dịch vụ với mức hoa hồng của nhân viên đó.
    4. Admin xem bảng kê chi tiết và xuất báo cáo để trả lương.
- **Kết quả mong đợi:** Có bảng tính hoa hồng chính xác cho nhân viên.

---
*(Các tính năng khác như Quản lý nhân viên, Quản lý dịch vụ, Cấu hình thông báo... cũng được thực hiện theo nguyên tắc đơn giản và tập trung vào tương tác người dùng - hệ thống tương tự như trên).*