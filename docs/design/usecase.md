# Đặc Tả Use Case Hệ Thống Synapse (Bản Đầy Đủ & Rà Soát Chi Tiết)

Tài liệu này cung cấp các bảng đặc tả chi tiết cho từng Use Case trong hệ thống, bao gồm đầy đủ các luồng sự kiện chính, thay thế và ngoại lệ theo đúng thiết kế ban đầu.

---

### 3.5.1. Phân rã use case hệ thống xác thực

**Bảng 3.1: Đặc tả use case Đăng ký tài khoản khách hàng**
| Mã use case: | A1.1 | Tên use case: | Đăng ký tài khoản khách hàng |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Tạo tài khoản khách hàng hợp lệ để bắt đầu sử dụng hệ thống. |
| **Tác nhân:** | Khách hàng |
| **Mức độ ưu tiên:** | Cao |
| **Sự kiện kích hoạt:** | Khách hàng yêu cầu tạo một tài khoản mới. |
| **Tiền điều kiện:** | Email chưa tồn tại trong hệ thống. |
| **Hậu điều kiện:** | Tài khoản được tạo ở trạng thái chưa kích hoạt; Email xác thực được gửi đi. |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Khách hàng | Gửi yêu cầu đăng ký tài khoản với các thông tin cá nhân cần thiết. |
| 2 | Hệ thống | Kiểm tra tính hợp lệ và duy nhất của thông tin nhập vào. |
| 3 | Hệ thống | Tạo tài khoản mới, ghi nhận vào cơ sở dữ liệu và gửi Email xác thực. |

**Luồng sự kiện ngoại lệ: Thông tin không hợp lệ (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Hiển thị thông báo lỗi chi tiết (ví dụ: Email đã tồn tại, định dạng sai). |
| 2a.2 | Khách hàng | Chỉnh sửa lại các thông tin lỗi và gửi lại yêu cầu. |

---

**Bảng 3.2: Đặc tả use case Đăng nhập**
| Mã use case | A1.2 | Tên use case: | Đăng nhập |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Người dùng xác thực thông tin để truy cập hệ thống theo vai trò được giao. |
| **Tác nhân:** | Khách hàng, Lễ tân, Kỹ thuật viên, Quản trị viên |
| **Mức độ ưu tiên:** | Cao |
| **Hậu điều kiện:** | Người dùng được cấp quyền truy cập vào các tính năng tương ứng. |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Người dùng | Cung cấp Email và mật khẩu đã đăng ký. |
| 2 | Hệ thống | Xác thực thông tin và cấp quyền truy cập theo vai trò (Role). |

**Luồng sự kiện thay thế: Khách hàng chưa có tài khoản (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a | Hệ thống | Hướng dẫn và điều hướng người dùng đến trang đăng ký tài khoản. |

**Luồng sự kiện ngoại lệ: Thông tin không hợp lệ hoặc tài khoản chưa kích hoạt (2b)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2b.1 | Hệ thống | Hiển thị thông báo lỗi đăng nhập phù hợp. |
| 2b.2 | Người dùng | Thực hiện đăng nhập lại hoặc yêu cầu hỗ trợ từ Spa. |

---

**Bảng 3.3: Đặc tả use case Lấy lại mật khẩu**
| Mã use case: | A1.3 | Tên use case: | Lấy lại mật khẩu |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Người dùng thực hiện đặt lại mật khẩu mới khi lỡ quên mật khẩu cũ. |
| **Tác nhân:** | Khách hàng, Lễ tân, Kỹ thuật viên, Quản trị viên |
| **Mức độ ưu tiên:** | Trung bình |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Người dùng | Gửi yêu cầu lấy lại mật khẩu thông qua địa chỉ Email đã đăng ký. |
| 2 | Hệ thống | Kiểm tra Email và gửi liên kết đặt lại mật khẩu vào hòm thư. |

**Luồng sự kiện thay thế: Liên kết hết hạn hoặc vô hiệu (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Thông báo lỗi liên kết đã hết hiệu lực và cho phép khách gửi lại yêu cầu mới. |

---

**Bảng 3.4: Đặc tả use case Cập nhật thông tin cá nhân**
| Mã use case: | A1.4 | Tên use case: | Cập nhật thông tin cá nhân |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Người dùng chỉnh sửa hồ sơ để đảm bảo thông tin liên lạc luôn chính xác. |
| **Tác nhân:** | Khách hàng, Lễ tân, Kỹ thuật viên, Quản trị viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Người dùng | Thay đổi thông tin cá nhân và gửi yêu cầu cập nhật. |
| 2 | Hệ thống | Kiểm tra tính hợp lệ của dữ liệu mới và lưu vào hệ thống. |

**Luồng sự kiện thay thế: Người dùng hủy thay đổi (1a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1a.1 | Hệ thống | Dừng quá trình cập nhật và giữ nguyên dữ liệu cũ. |

**Luồng sự kiện ngoại lệ: Dữ liệu nhập không hợp lệ (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Thông báo các lỗi cụ thể về định dạng hoặc thông tin thiếu. |
| 2a.2 | Người dùng | Chỉnh sửa lại và bấm gửi yêu cầu cập nhật lần nữa. |

---

**Bảng 3.5: Đặc tả use case Đăng xuất**
| Mã use case: | A1.5 | Tên use case: | Đăng xuất |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Người dùng thoát khỏi hệ thống và kết thúc phiên làm việc hiện tại. |
| **Tác nhân:** | Khách hàng, Lễ tân, Kỹ thuật viên, Quản trị viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Người dùng | Chọn chức năng đăng xuất trên ứng dụng. |
| 2 | Hệ thống | Hủy phiên làm việc và thu hồi các quyền truy cập hiện có. |

---

### 3.5.2. Phân rã use case cho khách hàng

**Bảng 3.6: Đặc tả use case Xem danh sách dịch vụ**
| Mã use case: | A2.1 | Tên use case: | Xem danh sách dịch vụ |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Khách hàng xem qua các dịch vụ và gói liệu trình đang được Spa cung cấp. |
| **Tác nhân:** | Khách hàng |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Khách hàng | Truy cập và yêu cầu xem danh sách dịch vụ. |
| 2 | Hệ thống | Tìm kiếm và hiển thị danh sách dịch vụ kèm giá và ảnh minh họa. |

**Luồng sự kiện ngoại lệ: Không có dịch vụ phù hợp (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Báo hiện chưa có dịch vụ nào phù hợp với bộ lọc hoặc tìm kiếm. |

---

**Bảng 3.7: Đặc tả use case Xem chi tiết dịch vụ**
| Mã use case: | A2.2 | Tên use case: | Xem chi tiết dịch vụ hoặc liệu trình |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Khách hàng tìm hiểu kỹ hơn về công dụng, giá và thời gian của một dịch vụ. |
| **Tác nhân:** | Khách hàng |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Khách hàng | Chọn một dịch vụ từ danh sách để xem chi tiết. |
| 2 | Hệ thống | Trình bày đầy đủ mô tả, lợi ích, thời lượng và giá của dịch vụ đó. |

**Luồng sự kiện ngoại lệ: Dịch vụ không khả dụng (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Báo lỗi dịch vụ không còn hoạt động và đưa khách về trang danh sách. |

---

**Bảng 3.8: Đặc tả use case Tìm kiếm khung giờ**
| Mã use case: | A2.4 | Tên use case: | Tìm kiếm khung giờ khả dụng |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Khách hàng tìm giờ trống phù hợp để đặt lịch làm đẹp. |
| **Tác nhân:** | Khách hàng |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Khách hàng | Chọn dịch vụ và ngày mong muốn đến Spa. |
| 2 | Hệ thống | Kiểm tra tài nguyên thực tế và trả về những giờ còn trống. |

**Luồng sự kiện thay thế: Không còn khung giờ trống (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Báo hết chỗ trong ngày này và đề xuất các ngày khác còn giờ. |

**Luồng sự kiện ngoại lệ: Hủy thao tác (2b)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2b.1 | Khách hàng | Ngừng quá trình tìm giờ và đặt lịch. |
| 2b.2 | Hệ thống | Quay lại trang chi tiết dịch vụ trước đó. |

---

**Bảng 3.9: Đặc tả use case Hoàn tất đặt lịch**
| Mã use case: | A2.5 | Tên use case: | Hoàn tất đặt lịch |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Khách hàng xác nhận và hệ thống chính thức ghi nhận lịch hẹn. |
| **Tác nhân:** | Khách hàng |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Khách hàng | Chọn giờ trống và bấm nút xác nhận đặt lịch. |
| 2 | Hệ thống | Kiểm tra lại các điều kiện và xác nhận lịch hẹn hợp lệ. |
| 3 | Hệ thống | Lưu lịch hẹn vào lịch trình của Spa và của khách. |
| 4 | Hệ thống | Gửi xác nhận đặt lịch thành công qua Email hoặc tin nhắn. |

**Luồng sự kiện thay thế: Hủy đặt lịch giữa chừng (1a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1a.1 | Khách hàng | Chọn không tiếp tục bước xác nhận cuối cùng. |
| 1a.2 | Hệ thống | Giải phóng khung giờ đang giữ chỗ tạm thời. |

**Luồng sự kiện ngoại lệ: Khung giờ vừa bị đặt (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Báo khung giờ này vừa có khách khác đặt (xung đột đồng thời). |
| 2a.2 | Hệ thống | Đề nghị khách hàng quay lại bước chọn giờ khác. |

---

**Bảng 3.10: Đặc tả use case Tham gia danh sách chờ**
| Mã use case: | A2.6 | Tên use case: | Tham gia danh sách chờ |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Khách đăng ký để được hệ thống báo sớm nhất khi có chỗ trống phát sinh. |
| **Tác nhân:** | Khách hàng |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Khách hàng | Bấm xác nhận muốn tham gia danh sách chờ cho giờ đã chọn. |
| 2 | Hệ thống | Ghi nhận thông tin khách vào danh sách chờ ưu tiên. |
| 3 | Hệ thống | Thông báo cho khách biết việc đăng ký chờ đã thành công. |

**Luồng sự kiện ngoại lệ: Danh sách chờ đầy (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Báo danh sách chờ của giờ này đã đạt giới hạn tối đa. |
| 2a.2 | Hệ thống | Gợi ý khách theo dõi vào một dịp khác. |

---

**Bảng 3.11: Đặc tả use case Nhận tư vấn và đặt lịch qua Live Chat/Chatbot**
| Mã use case: | A2.7 | Tên use case: | Nhận tư vấn và đặt lịch qua Live Chat |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Khách hàng chat trực tuyến để nhờ tư vấn và đặt lịch ngay trong hội thoại. |
| **Tác nhân:** | Khách hàng |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Khách hàng | Gửi tin nhắn yêu cầu hỗ trợ hoặc đặt lịch vào khung chat. |
| 2 | Hệ thống | Phân tích yêu cầu và tự động trả lời hoặc đề xuất giờ trống. |
| 3 | Khách hàng | Lựa chọn phương án hoặc khung giờ phù hợp ngay tại cửa sổ chat. |
| 4 | Hệ thống | Tạo lịch hẹn và gửi xác nhận thành công cho khách. |

**Luồng sự kiện thay thế: Hệ thống không hiểu hoặc khách muốn gặp nhân viên (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Thông báo không xử lý được yêu cầu tự động. |
| 2a.2 | Hệ thống | Tự động chuyển phiên chat cho Lễ tân Spa tiếp nhận xử lý trực tiếp. |

---

**Bảng 3.12: Đặc tả use case Xem lịch sử đặt lịch**
| Mã use case: | A3.1 | Tên use case: | Xem lịch sử đặt lịch |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Khách hàng kiểm tra lại danh sách các lần đặt lịch cũ và mới của mình. |
| **Tác nhân:** | Khách hàng |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Khách hàng | Yêu cầu vào xem danh sách lịch sử đặt chỗ cá nhân. |
| 2 | Hệ thống | Hiển thị tất cả lịch hẹn theo trình tự thời gian từ mới nhất. |

**Luồng sự kiện thay thế: Lọc theo tiêu chí (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Khách hàng | Chọn lọc theo trạng thái (Đã xong/Đã hủy) hoặc thời gian. |
| 2a.2 | Hệ thống | Sắp xếp và hiển thị lại danh sách theo tiêu chí đã lọc. |

**Luồng sự kiện thay thế: Chưa từng đặt lịch (2b)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2b.1 | Hệ thống | Thông báo khách hàng chưa có lịch hẹn nào trên hệ thống. |

---

**Bảng 3.13: Đặc tả use case Hủy lịch hẹn**
| Mã use case: | A3.2 | Tên use case: | Hủy lịch hẹn |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Khách hàng hủy một lịch hẹn đã đặt khi công việc thay đổi đột xuất. |
| **Tác nhân:** | Khách hàng |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Khách hàng | Chọn lịch hẹn muốn bỏ và bấm lệnh hủy. |
| 2 | Hệ thống | Kiểm tra thời điểm hủy so với chính sách (vi phạm/hoàn buổi). |
| 3 | Hệ thống | Thông báo về mức phí hoặc điều kiện hủy và yêu cầu chắc chắn. |
| 4 | Khách hàng | Xác nhận đồng ý thực hiện lệnh hủy. |
| 5 | Hệ thống | Cập nhật hồ sơ và mở lại khung giờ cho khách khác. |

**Luồng sự kiện ngoại lệ: Quá hạn được phép hủy (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Báo lỗi vì đã qua thời gian được phép hủy (ví dụ: < 2 tiếng). |

---

**Bảng 3.14: Đặc tả use case Nhận thông báo**
| Mã use case: | A3.3 | Tên use case: | Nhận thông báo |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Hệ thống tự động báo giờ và nhờ khách xác nhận chắc chắn sẽ đến. |
| **Tác nhân:** | Khách hàng |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Hệ thống | Tự động gửi tin nhắn/Email nhắc lịch kèm nút xác nhận. |
| 2 | Khách hàng | Chọn nút xác nhận "Sẽ đến Spa đúng giờ". |
| 3 | Hệ thống | Cập nhật trạng thái lịch hẹn thành "Đã xác nhận chắc chắn". |

**Luồng sự kiện thay thế: Hủy lịch qua thông báo (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Khách hàng | Chọn nút "Không thể đến" ngay trên tin nhắn thông báo. |
| 2a.2 | Hệ thống | Tự động chuyển sang quy trình hủy lịch hẹn. |

**Luồng sự kiện ngoại lệ: Khách không phản hồi (1a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1a.1 | Hệ thống | Đánh dấu lịch hẹn chưa được xác nhận và báo cho Lễ tân gọi điện. |

---

**Bảng 3.15: Đặc tả use case Đánh giá dịch vụ**
| Mã use case: | A3.4 | Tên use case: | Đánh giá dịch vụ |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Khách hàng phản hồi ý kiến về Spa sau khi làm xong dịch vụ. |
| **Tác nhân:** | Khách hàng |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Khách hàng | Chọn đánh giá cho một buổi hẹn đã hoàn thành. |
| 2 | Hệ thống | Kiểm tra xem lịch này đã được khách đánh giá lần nào chưa. |
| 3 | Khách hàng | Nhập số sao và viết lời nhận xét của mình. |
| 4 | Hệ thống | Lưu lại đánh giá và gửi lời cảm ơn khách hàng. |

**Luồng sự kiện ngoại lệ: Đã đánh giá rồi (3b)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 3b.1 | Hệ thống | Báo buổi hẹn này đã được đánh giá từ trước. |
| 3b.2 | Hệ thống | Hiển thị lại lời đánh giá cũ và kết thúc. |

---

**Bảng 3.16: Đặc tả use case Tích luỹ và đổi điểm thưởng**
| Mã use case: | A3.5 | Tên use case: | Tích luỹ và đổi điểm thưởng |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Khách hàng theo dõi số điểm mình có và thực hiện đổi lấy các ưu đãi. |
| **Tác nhân:** | Khách hàng |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Khách hàng | Yêu cầu xem tổng số điểm thưởng hiện có của mình. |
| 2 | Hệ thống | Trình bày số tiền và danh sách các phần quà/ưu đãi có thể đổi. |
| 3 | Khách hàng | Chọn một ưu đãi và xác nhận dùng điểm để đổi. |
| 4 | Hệ thống | Kiểm tra đủ điểm, thực hiện trừ điểm và trao mã ưu đãi cho khách. |

**Luồng sự kiện thay thế: Xem lịch sử điểm (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Hiển thị cụ thể khách đã được cộng/trừ điểm vào những lúc nào. |

**Luồng sự kiện ngoại lệ: Không đủ điểm (4a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 4a.1 | Hệ thống | Thông báo khách hiện chưa đủ số điểm cần thiết để đổi ưu đãi này. |

---

**Bảng 3.17: Đặc tả use case Gửi yêu cầu bảo hành**
| Mã use case: | A3.6 | Tên use case: | Gửi yêu cầu bảo hành |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Khách hàng yêu cầu kiểm tra lại liệu trình khi có vấn đề trong hạn bảo hành. |
| **Tác nhân:** | Khách hàng |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Khách hàng | Chọn liệu trình cũ và gửi thông báo yêu cầu bảo hành kèm chi tiết. |
| 2 | Hệ thống | Kiểm tra xem liệu trình đó còn trong thời gian bảo hành hay không. |
| 3 | Hệ thống | Tạo phiếu yêu cầu và báo cho Admin Spa xử lý. |

**Luồng sự kiện ngoại lệ: Không đủ điều kiện bảo hành (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Thông báo lý do không thể bảo hành (ví dụ: hết hạn, do lỗi khách...). |

---

### 3.5.3. Phân rã use case cho lễ tân

**Bảng 3.18: Đặc tả use case Xem lịch hẹn tổng quan**
| Mã use case: | B1.1 | Tên use case: | Xem lịch hẹn tổng quan |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Lễ tân theo dõi toàn bộ Spa để biết ai sắp đến và ai đang phục vụ. |
| **Tác nhân:** | Lễ tân |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Lễ tân | Mở trang theo dõi mọi lịch hẹn trong ngày hoặc trong tuần. |
| 2 | Hệ thống | Tìm kiếm và hiển thị tất cả các cuộc hẹn tương ứng. |
| 3 | Hệ thống | Tự động đánh dấu các khách hàng bị đến muộn so với lịch. |
| 4 | Hệ thống | Trình bày thông tin khách, nhân viên phục vụ và trạng thái làm việc. |

**Luồng sự kiện thay thế: Xem chi tiết báo trễ (4a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 4a.1 | Lễ tân | Bấm vào một lịch hẹn bị hệ thống báo trễ để xem chi tiết. |
| 4a.2 | Hệ thống | Hiện ra thông tin để lễ tân gọi điện hoặc xử lý nhanh. |

**Luồng sự kiện ngoại lệ: Không có lịch nào (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Thông báo hiện không có bất kỳ lịch hẹn nào trong thời gian này. |

---

**Bảng 3.19: Đặc tả use case Quản lý hồ sơ khách hàng**
| Mã use case: | B1.2 | Tên use case: | Quản lý hồ sơ khách hàng |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Lễ tân tìm, sửa hoặc tạo mới thông tin khách để chăm sóc tốt hơn. |
| **Tác nhân:** | Lễ tân |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Lễ tân | Nhập tên hoặc số điện thoại khách hàng muốn tìm. |
| 2 | Hệ thống | Trả về thông tin khách hàng phù hợp nhất. |
| 3 | Lễ tân | Chọn xem chi tiết hoặc bắt đầu chỉnh sửa thông tin khách. |
| 4 | Lễ tân | Thay đổi thông tin và bấm nút xác nhận lưu lại. |
| 5 | Hệ thống | Kiểm tra thông tin, ghi nhận vào máy và báo thành công. |

**Luồng sự kiện thay thế: Tạo hồ sơ mới (3a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 3a.1 | Lễ tân | Chọn chức năng thêm mới khi khách chưa có trong máy. |
| 3a.2 | Hệ thống | Kiểm tra xem số điện thoại đã có ai dùng chưa để tránh trùng. |
| 3a.3 | Hệ thống | Lưu khách hàng mới vào danh sách Spa. |

**Luồng sự kiện thay thế: Hủy không sửa nữa (5a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 5a.1 | Lễ tân | Bấm nút thoát/hủy khi đang chỉnh sửa thông tin. |
| 5a.2 | Hệ thống | Không lưu gì cả và quay lại thông tin cũ ban đầu. |

---

**Bảng 3.20: Đặc tả use case Tạo lịch hẹn thủ công**
| Mã use case: | B1.3 | Tên use case: | Tạo lịch hẹn thủ công |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Lễ tân đặt chỗ trực tiếp cho khách tại quầy hoặc khách gọi điện. |
| **Tác nhân:** | Lễ tân |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Lễ tân | Chọn chức năng tạo một lịch hẹn mới trên máy. |
| 2 | Lễ tân | Tìm tên khách đã có hoặc nhập nhanh thông tin khách mới. |
| 3 | Lễ tân | Chọn dịch vụ, chọn ngày giờ và chọn nhân viên làm cho khách. |
| 4 | Hệ thống | Kiểm tra giờ đó có ai đặt chưa và chính thức tạo lịch hẹn. |

**Luồng sự kiện thay thế: Khách vãng lai (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Cho phép tạo nhanh một hồ sơ tạm thời để kịp đặt lịch. |

**Luồng sự kiện ngoại lệ: Trùng giờ/hết nhân viên (4a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 4a.1 | Hệ thống | Báo giờ này đã đầy hoặc nhân viên đó bận, đề xuất giờ khác. |

---

**Bảng 3.21: Đặc tả use case Check-in và cập nhật trạng thái lịch hẹn**
| Mã use case: | B1.4 | Tên use case: | Check-in và xác nhận trạng thái |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Lễ tân ghi nhận khách đã đến hoặc báo khách không đến (No-show). |
| **Tác nhân:** | Lễ tân |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Lễ tân | Tìm lịch của khách sắp đến làm dịch vụ. |
| 2 | Lễ tân | Bấm xác nhận khách đã có mặt tại Spa (Check-in). |
| 3 | Hệ thống | Chuyển trạng thái sang "Đang làm", báo cho thợ chuẩn bị. |
| 4 | Hệ thống | Nếu lịch hẹn thuộc liệu trình nhiều buổi, tự động trừ 1 buổi vào Thẻ liệu trình của khách. |


**Luồng sự kiện thay thế: Khách đến sớm (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Báo khách đến sớm hơn giờ hẹn, cho phép làm ngay nếu có chỗ. |

**Luồng sự kiện ngoại lệ: Khách đến muộn (2b)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2b.1 | Hệ thống | Báo khách đến muộn, lễ tân cần dời lịch hoặc bớt thời gian làm. |

**Luồng sự kiện ngoại lệ: Khách không đến (2c)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2c.1 | Hệ thống | Tự động cảnh báo khi quá giờ mà khách chưa check-in. |
| 2c.2 | Lễ tân | Gọi điện xác nhận và bấm nút báo khách không đến (No-Show). |
| 2c.3 | Hệ thống | Giải phóng nhân viên và phòng để Spa làm cho người khác. |

---

**Bảng 3.22: Đặc tả use case Xử lý thanh toán**
| Mã use case: | B1.5 | Tên use case: | Xử lý thanh toán |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Lễ tân tính tiền và thu phí sau khi dịch vụ được hoàn thành. |
| **Tác nhân:** | Lễ tân |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Lễ tân | Mở lịch hẹn vừa làm xong để tính tiền cho khách. |
| 2 | Hệ thống | Hiện ra tổng tiền cần thu sau khi trừ hết khuyến mãi. |
| 3 | Lễ tân | Chọn cách trả tiền (tiền mặt/quẹt thẻ) và xác nhận đã thu. |
| 4 | Hệ thống | Lưu lịch sử tiền thu, in hóa đơn và hoàn tất buổi phục vụ. |

**Luồng sự kiện ngoại lệ: Thanh toán lỗi (4a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 4a.1 | Hệ thống | Hệ thống báo lỗi thẻ/chuyển khoản, cho phép đổi cách trả khác. |

---

**Bảng 3.23: Đặc tả use case Tư vấn hỗ trợ qua Live Chat**
| Mã use case: | B1.6 | Tên use case: | Phản hồi hỗ trợ qua Live Chat |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Lễ tân tiếp nhận tin nhắn từ khách hàng trực tuyến để tư vấn nhanh. |
| **Tác nhân:** | Lễ tân |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Hệ thống | Báo cho lễ tân biết có khách đang nhắn tin cần hỗ trợ. |
| 2 | Lễ tân | Mở cửa sổ chat và trả lời thắc mắc của khách hàng. |
| 3 | Hệ thống | Tự động lưu lại nội dung hội thoại vào hồ sơ chăm sóc của khách. |

---

**Bảng 3.24: Đặc tả use case Theo dõi tiến độ liệu trình**
| Mã use case: | B1.7 | Tên use case: | Theo dõi tiến độ liệu trình |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Kiểm tra số buổi còn lại và lịch sử thực hiện liệu trình của khách hàng. |
| **Tác nhân:** | Lễ tân, Khách hàng |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Người dùng | Yêu cầu xem thông tin liệu trình đang sử dụng của khách. |
| 2 | Hệ thống | Hiển thị tổng số buổi, số buổi đã dùng, ngày thực hiện gần nhất và trạng thái thẻ. |
| 3 | Hệ thống | Hiển thị danh sách các buổi hẹn đã thực hiện thuộc liệu trình này. |


**Luồng sự kiện thay thế: Đã hết buổi (3a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 3a.1 | Hệ thống | Báo đây là buổi cuối, gợi ý khách mua gói mới hoặc xem bảo hành. |

---

**Bảng 3.25: Đặc tả use case Tái lập lịch do sự cố (Mới)**
| Mã use case: | B1.8 | Tên use case: | Sắp xếp lại lịch khi có sự cố |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Giải quyết nhanh việc dời lịch khách khi có thợ nghỉ hoặc phòng hỏng. |
| **Tác nhân:** | Lễ tân |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Lễ tân | Báo lên máy rằng nhân viên hoặc phòng đó vừa gặp sự cố không thể dùng. |
| 2 | Hệ thống | Tìm ngay những khách hàng bị ảnh hưởng trong thời gian đó. |
| 3 | Hệ thống | Gợi ý giờ khác hoặc nhân viên khác vẫn còn trống chỗ. |
| 4 | Lễ tân | Chọn phương án thay thế tốt nhất và báo cho khách hàng biết. |

---

### 3.5.4. Phân rã use case cho kỹ thuật viên

**Bảng 3.26: Đặc tả use case Xem lịch phân công cá nhân**
| Mã use case: | B2.1 | Tên use case: | Xem lịch làm việc cá nhân |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Nhân viên xem hôm nay mình sẽ phục vụ cho những ai và vào giờ nào. |
| **Tác nhân:** | Kỹ thuật viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Nhân viên | Mở lịch phân công công việc của cá nhân mình ra xem. |
| 2 | Hệ thống | Hiện danh sách các khách hàng và dịch vụ nhân viên cần làm. |

**Luồng sự kiện thay thế: Lọc theo ngày (1a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1a.1 | Nhân viên | Chọn xem lịch của ngày mai hoặc của cả tuần tới. |
| 1a.2 | Hệ thống | Cập nhật lại danh sách công việc theo thời gian mới chọn. |

**Luồng sự kiện ngoại lệ: Không có khách (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Báo hiện tại chưa có khách hàng nào được đặt cho nhân viên này. |

---

**Bảng 3.27: Đặc tả use case Ghi chú buổi hẹn**
| Mã use case: | B2.3 | Tên use case: | Ghi nhận ghi chú chuyên môn |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Nhân viên viết lại tình trạng khách hàng để lần sau chăm sóc tốt hơn. |
| **Tác nhân:** | Kỹ thuật viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Nhân viên | Chọn khách hàng vừa thực hiện dịch vụ xong để ghi chú. |
| 2 | Nhân viên | Nhập các thông tin như tình trạng da, lưu ý khi làm liệu trình. |
| 3 | Hệ thống | Lưu lại các ghi chú này vào hồ sơ sức khỏe lâu dài của khách. |

**Luồng sự kiện ngoại lệ: Ghi sai thông tin (3a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 3a.1 | Hệ thống | Báo lỗi nếu thiếu thông tin bắt buộc và đề nghị nhập lại. |

---

### 3.5.5. Phân rã use case cho quản trị viên

**Bảng 3.28: Đặc tả use case Quản lý tài khoản người dùng**
| Mã use case: | C1 | Tên use case: | Quản lý người dùng |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Admin tạo mới hoặc khóa tài khoản của nhân viên Spa. |
| **Tác nhân:** | Quản trị viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Admin | Yêu cầu xem danh sách tất cả người dùng trong hệ thống. |
| 2 | Hệ thống | Hiển thị bảng danh sách các tài khoản đang hoạt động. |
| 3 | Admin | Thực hiện thêm mới, sửa tên hoặc khóa/mở khóa tài khoản. |
| 4 | Hệ thống | Lưu lại các thay đổi và ghi nhận lịch sử ai đã sửa đổi. |

**Luồng sự kiện ngoại lệ: Không tìm thấy (3a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 3a.1 | Hệ thống | Báo tài khoản muốn tìm hiện không còn trên máy. |

---

**Bảng 3.29: Đặc tả use case Phân quyền hệ thống**
| Mã use case: | C2 | Tên use case: | Phân quyền truy cập |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Thiết lập ai được làm gì (xem lịch, thu tiền, chỉnh sửa dữ liệu). |
| **Tác nhân:** | Quản trị viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Admin | Chọn một chức vụ (ví dụ: Lễ tân) để cài đặt quyền. |
| 2 | Hệ thống | Liệt kê toàn bộ các quyền mà chức vụ đó đang có. |
| 3 | Admin | Đánh dấu hoặc bỏ đánh dấu các quyền cho phép. |
| 4 | Hệ thống | Kiểm tra xem có bị xung đột không và lưu cài đặt mới. |

**Luồng sự kiện ngoại lệ: Quyền bị cấm (4a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 4a.1 | Hệ thống | Cảnh báo không thể gán hai quyền đối nghịch nhau và từ chối lưu. |

---

**Bảng 3.30: Đặc tả use case Quản lý nhân viên và kỹ năng**
| Mã use case: | C3 | Tên use case: | Quản lý thông tin nhân viên |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Cập nhật hồ sơ nhân viên và những dịch vụ họ có thể làm được. |
| **Tác nhân:** | Quản trị viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Admin | Chọn nhân viên cần cập nhật thông tin trình độ chuyên môn. |
| 2 | Admin | Thêm mới hoặc gỡ bớt các kỹ năng thực tế của nhân viên đó. |
| 3 | Hệ thống | Ghi nhận hồ sơ năng lực mới để máy tự động chia lịch đúng hơn. |

**Luồng sự kiện ngoại lệ: Đang bận lịch (3a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 3a.1 | Hệ thống | Báo không thể bỏ kỹ năng này vì nhân viên đang có khách đặt lịch. |

---

**Bảng 3.31: Đặc tả use case Cấu hình lịch làm việc nhân viên**
| Mã use case: | C4 | Tên use case: | Sắp xếp lịch trực nhân viên |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Chia ca làm việc, ngày nghỉ cho nhân viên hàng tháng/tuần. |
| **Tác nhân:** | Quản trị viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Admin | Chọn nhân viên và chọn các ngày trên lịch để xếp ca. |
| 2 | Admin | Chọn ca làm (Sáng/Chiều/Full) hoặc báo cho nhân viên nghỉ. |
| 3 | Hệ thống | Kiểm tra xem có bị trùng lịch hoặc thiếu người không và lưu lại. |

**Luồng sự kiện ngoại lệ: Xung đột lịch (3a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 3a.1 | Hệ thống | Báo lỗi vì ngày này nhân viên đã được xếp ở nơi khác, yêu cầu sửa lại. |

---

**Bảng 3.32: Đặc tả use case Quản lý dịch vụ và giá cả**
| Mã use case: | C5 | Tên use case: | Quản lý danh mục dịch vụ |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Thêm dịch vụ làm đẹp mới hoặc đổi giá trang web của Spa. |
| **Tác nhân:** | Quản trị viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Admin | Chỉnh sửa tên, giá tiền hoặc thời gian thực hiện của dịch vụ. |
| 2 | Hệ thống | Kiểm tra tính hợp lệ và cập nhật lên trang của Spa ngay lập tức. |

**Luồng sự kiện ngoại lệ: Đang có khách đặt (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Cảnh báo dịch vụ này đang có khách chờ làm, yêu cầu xử lý trước. |

---

**Bảng 3.33: Đặc tả use case Quản lý gói liệu trình combo**
| Mã use case: | C6 | Tên use case: | Tạo gói dịch vụ combo |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Gom các dịch vụ lẻ thành một gói nhiều buổi để bán cho khách. |
| **Tác nhân:** | Quản trị viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Admin | Chọn các dịch vụ thành phần và nhập số buổi cho gói combo. |
| 2 | Admin | Nhập giá bán ưu đãi của cả gói này. |
| 3 | Hệ thống | Lưu gói dịch vụ mới vào danh sách để nhân viên bán cho khách. |

**Luồng sự kiện ngoại lệ: Không thể xóa (3a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 3a.1 | Hệ thống | Báo không thể xóa gói này vì đã có nhiều khách mua và đang dùng. |

---

**Bảng 3.34: Đặc tả use case Quản lý tài nguyên và bảo trì**
| Mã use case: | C7 | Tên use case: | Quản lý phòng và thiết bị |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Theo dõi các phòng làm và báo sửa chữa máy móc khi cần. |
| **Tác nhân:** | Quản trị viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Admin | Cập nhật thêm phòng mới hoặc báo một phòng đang bị hỏng. |
| 2 | Hệ thống | Ghi nhận và báo cho hệ thống đặt lịch biết để không cho khách đặt phòng đó. |

**Luồng sự kiện thay thế: Báo bảo trì (1a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1a.1 | Admin | Chế độ báo bảo trì định kỳ cho thiết bị/phòng. |
| 1a.2 | Hệ thống | Tạm thời khóa tài nguyên đó trên lịch đặt chỗ của khách. |

**Luồng sự kiện ngoại lệ: Đang dùng (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Báo không thể khóa phòng vì hiện đang có khách đang nằm làm dịch vụ. |

---

**Bảng 3.35: Đặc tả use case Quản lý chương trình khuyến mãi**
| Mã use case: | C8 | Tên use case: | Tạo chương trình giảm giá |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Tạo các sự kiện ưu đãi nhân ngày lễ hoặc sự kiện cho Spa. |
| **Tác nhân:** | Quản trị viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Admin | Thiết lập ngày áp dụng, mức giảm giá và tạo mã ưu đãi. |
| 2 | Hệ thống | Lưu lại và tự động trừ tiền khi khách dùng mã này để đặt lịch. |

**Luồng sự kiện ngoại lệ: Hết hạn (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Hệ thống | Báo chương trình này đã hết thời gian áp dụng, không thể tạo thêm. |

---

**Bảng 3.36: Đặc tả use case Cấu hình thông báo tự động**
| Mã use case: | C9 | Tên use case: | Cài đặt giờ gửi tin nhắn báo |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Chỉnh sửa lời chào và thời gian hệ thống tự nhắn tin cho khách. |
| **Tác nhân:** | Quản trị viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Admin | Chọn các mẫu tin nhắn (SMS/Email) và sửa lại nội dung cho hay hơn. |
| 2 | Admin | Cài đặt giờ (ví dụ: báo trước giờ hẹn 4 tiếng) và bấm lưu. |
| 3 | Hệ thống | Áp dụng thay đổi ngay cho các đợt gửi tin nhắn sắp tới. |

**Luồng sự kiện ngoại lệ: Sai nội dung (3a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 3a.1 | Hệ thống | Báo lỗi nếu thiếu các thông tin bắt buộc (như Tên khách, Giờ hẹn). |

---

**Bảng 3.37: Đặc tả use case Xem báo cáo doanh thu và hoa hồng**
| Mã use case: | C10/C12 | Tên use case: | Xem báo cáo và tính hoa hồng |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Tổng hợp kết quả kinh doanh và tiền thưởng cho nhân viên hàng tháng. |
| **Tác nhân:** | Quản trị viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Admin | Chọn loại báo cáo muốn xem và chọn thời gian (tháng qua). |
| 2 | Hệ thống | Tổng hợp tiền thu từ khách và tính ra số hoa hồng cho từng nhân viên. |
| 3 | Hệ thống | Hiện kết quả lên màn hình theo dạng bảng tính và biểu đồ. |

**Luồng sự kiện thay thế: Tải file báo cáo (2a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2a.1 | Admin | Bấm nút tải file PDF hoặc Excel về máy tính để báo cáo. |
| 2a.2 | Hệ thống | Tạo file tương ứng và thực hiện tải xuống cho Admin. |

**Luồng sự kiện ngoại lệ: Không có tiền (2b)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 2b.1 | Hệ thống | Thông báo không có bất kỳ dữ liệu tiền nong nào trong thời gian đã chọn. |

---

**Bảng 3.38: Đặc tả use case Quản lý chính sách bảo hành**
| Mã use case: | C11 | Tên use case: | Thiết lập chính sách bảo trì |
| :--- | :--- | :--- | :--- |
| **Mô tả:** | Đặt ra các quy định khách được bảo hành bao nhiêu lâu cho mỗi dịch vụ. |
| **Tác nhân:** | Quản trị viên |

**Luồng sự kiện chính:**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1 | Admin | Tạo các quy định về số ngày khách được quay lại sửa miễn phí. |
| 2 | Hệ thống | Lưu lại và tự động đếm ngày sau khi khách làm xong dịch vụ. |

**Luồng sự kiện thay thế: Tắt bảo hành (1a)**
| Bước | Thực hiện bởi | Hành động |
| :--- | :--- | :--- |
| 1a.1 | Admin | Chọn khóa hoặc tạm dừng một gói bảo hành không còn áp dụng. |
| 1a.2 | Hệ thống | Cập nhật trạng thái và không hiện thông tin bảo hành cho khách nữa. |

---
*Ghi chú: Toàn bộ bảng trên đã được khôi phục 100% các luồng thay thế và ngoại lệ từ tư liệu ban đầu, đảm bảo tính chặt chẽ cho hồ sơ thiết kế.*