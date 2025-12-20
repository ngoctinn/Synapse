# Sơ đồ Tuần tự: Hoạt động Lễ tân

Tài liệu này chứa các sơ đồ tuần tự cho phân hệ Lễ tân.

%%{
  init: {
    'theme': 'neutral',
    'themeVariables': {
      'fontFamily': 'Arial, Helvetica, sans-serif',
      'fontSize': '16px',
      'sequenceMessageFontSize': '14px',
      'sequenceActorMargin': 15,
      'sequenceActivationPadding': 5,
      'sequenceDiagramMarginY': 10,
      'sequenceLogLifeline': 'transparent',
      'primaryColor': '#ffffff',
      'primaryTextColor': '#000000',
      'lineColor': '#000000',
      'secondaryColor': '#f5f5f5'
    }
  }
}%%

## Sơ đồ hoạt động cho Lễ tân

### 3.14. Xem lịch hẹn tổng quan (B1.1)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    LT->>UI: Mở bảng điều khiển
    activate UI
    UI->>BE: getAppointments(date)
    activate BE

    BE->>DB: query_appointments_with_details
    activate DB
    DB-->>BE: appointments[]
    deactivate DB

    BE-->>UI: Hiển thị lịch hẹn
    deactivate BE

    UI-->>LT: Hiển thị lịch tổng quan
    deactivate UI
```
**Hình 3.14: Sơ đồ tuần tự chức năng Xem lịch hẹn tổng quan**

### 3.15. Quản lý hồ sơ khách hàng (B1.2)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    LT->>UI: Tìm kiếm khách hàng
    activate UI
    UI->>BE: searchCustomers(query)
    activate BE

    BE->>DB: query_by_name_or_phone
    activate DB
    DB-->>BE: customers[]
    deactivate DB

    BE-->>UI: Hiển thị kết quả
    deactivate BE

    alt Chọn khách hàng
        LT->>UI: Chọn xem chi tiết
        UI->>BE: getCustomerDetail(id)
        BE-->>UI: Hiển thị hồ sơ chi tiết
    else Tạo mới khách hàng
        LT->>UI: Nhập thông tin khách mới
        UI->>BE: createCustomer(data)
        BE->>DB: INSERT INTO customers
        DB-->>BE: customer
        BE-->>UI: Hiển thị hồ sơ mới
    end

    UI-->>LT: Hiển thị hồ sơ khách hàng
    deactivate UI
```
**Hình 3.15: Sơ đồ tuần tự chức năng Quản lý hồ sơ khách hàng**

### 3.16. Tạo lịch hẹn thủ công (B1.3)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant BE as Backend
    participant SOLVER as Bộ giải ràng buộc
    participant DB as Database

    LT->>UI: Nhập thông tin khách và dịch vụ
    activate UI
    UI->>BE: checkAvailability(data)
    activate BE
    BE->>SOLVER: validate_slot
    SOLVER-->>BE: Valid
    BE-->>UI: OK
    deactivate BE

    LT->>UI: Xác nhận tạo lịch
    UI->>BE: createManualBooking(data)
    activate BE

    BE->>DB: get_or_create_customer
    BE->>DB: INSERT INTO bookings
    activate DB
    Note over BE,DB: Thao tác tạo lịch thủ công trong Transaction
    DB-->>BE: booking
    deactivate DB

    BE-->>UI: Cập nhật bảng điều khiển
    deactivate BE

    UI-->>LT: Hiển thị lịch mới
    deactivate UI
```
**Hình 3.16: Sơ đồ tuần tự chức năng Tạo lịch hẹn thủ công**

### 3.17. Xác nhận khách đến (B1.4)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    LT->>UI: Chọn lịch hẹn và xác nhận khách đến
    activate UI
    UI->>BE: checkInCustomer(bookingId)
    activate BE

    BE->>DB: get_booking_with_items(booking_id)
    activate DB
    DB-->>BE: booking (với danh sách dịch vụ)
    deactivate DB

    BE->>DB: UPDATE bookings SET status = 'IN_PROGRESS'
    BE->>DB: UPDATE bookings SET check_in_time = NOW()

    Note over BE,DB: Xử lý liệu trình (nếu có)
    loop Với mỗi dịch vụ có liên kết liệu trình
        BE->>DB: SELECT * FROM customer_treatments WHERE id = treatment_id
        DB-->>BE: treatment
        alt Liệu trình còn hiệu lực
            BE->>DB: UPDATE customer_treatments SET used_sessions = used_sessions + 1
            BE->>DB: Kiểm tra và đánh dấu COMPLETED nếu hết buổi
        else Liệu trình hết hạn hoặc hết buổi
            Note over BE: Ghi nhật ký cảnh báo
        end
    end

    activate DB
    Note over BE,DB: Đồng bộ trạng thái và trừ buổi trong Transaction
    DB-->>BE: updated
    deactivate DB

    BE-->>UI: Đổi màu trạng thái
    deactivate BE

    UI-->>LT: Cập nhật trạng thái "Đang phục vụ"
    deactivate UI
```
**Hình 3.17: Sơ đồ tuần tự chức năng Xác nhận khách đến**

> **Ghi chú:** Sơ đồ này bao gồm logic **trừ buổi liệu trình** tự động. Khi xác nhận khách đến, nếu lịch hẹn có liên kết với thẻ liệu trình, hệ thống sẽ tự động tăng số buổi đã sử dụng.

### 3.18. Xử lý thanh toán (B1.5)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    LT->>UI: Xác nhận thanh toán
    activate UI
    UI->>BE: processPayment(bookingId, paymentMethod)
    activate BE

    BE->>DB: INSERT INTO invoices
    BE->>DB: UPDATE bookings SET status = 'COMPLETED'
    activate DB
    Note over BE,DB: Ghi hóa đơn & Cập nhật Booking trong Transaction
    DB-->>BE: invoice
    deactivate DB

    BE-->>UI: Hiển thị hóa đơn
    deactivate BE

    UI-->>LT: In hóa đơn và hoàn tất
    deactivate UI
```
**Hình 3.18: Sơ đồ tuần tự chức năng Xử lý thanh toán**

### 3.19. Phản hồi hỗ trợ qua trò chuyện trực tuyến (B1.6)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện trò chuyện
    participant BE as Backend
    participant DB as Database

    Note over UI: Có khách hàng gửi tin nhắn
    UI->>LT: Thông báo có yêu cầu hỗ trợ mới
    activate LT

    LT->>UI: Mở phiên trò chuyện
    activate UI
    UI->>BE: getChatSession(sessionId)
    activate BE
    BE-->>UI: Hiển thị lịch sử tin nhắn
    deactivate BE

    LT->>UI: Nhập và gửi phản hồi
    UI->>BE: sendMessage(sessionId, content)
    activate BE

    BE->>DB: INSERT INTO chat_messages
    activate DB
    DB-->>BE: message
    deactivate DB

    BE-->>UI: Cập nhật khung trò chuyện
    deactivate BE

    UI-->>LT: Tin nhắn đã gửi
    deactivate UI
    deactivate LT
```
**Hình 3.19: Sơ đồ tuần tự chức năng Phản hồi hỗ trợ qua trò chuyện trực tuyến**

### 3.20. Theo dõi tiến độ liệu trình (B1.7)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    LT->>UI: Tra cứu liệu trình của khách hàng
    activate UI
    UI->>BE: getCustomerTreatments(customerId)
    activate BE

    BE->>DB: query_customer_treatments_with_history
    activate DB
    DB-->>BE: treatments[]
    deactivate DB

    BE-->>UI: Hiển thị danh sách liệu trình
    deactivate BE

    UI-->>LT: Hiển thị tiến độ (số buổi còn lại, lịch sử)
    deactivate UI
```
**Hình 3.20: Sơ đồ tuần tự chức năng Theo dõi tiến độ liệu trình**

### 3.21. Tái lập lịch tự động khi có sự cố (B1.8)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant SOLVER as Bộ giải ràng buộc
    participant NOTI as Kênh thông báo
    participant DB as Database
    actor KH as Khách hàng

    QTV->>UI: Cập nhật lịch làm việc (Nghỉ đột xuất)
    activate UI
    UI->>BE: updateStaffSchedule(data)
    activate BE

    BE->>DB: find_conflicting_bookings(staffId, date)
    activate DB
    DB-->>BE: bookings_list[]
    deactivate DB

    loop Với mỗi lịch hẹn bị xung đột
        BE->>SOLVER: find_alternative_options(booking, policy)
        activate SOLVER
        Note right of SOLVER: Tìm KTV thay thế hoặc Giờ khác
        SOLVER-->>BE: recommended_option
        deactivate SOLVER

        alt Có phương án thay thế tối ưu (Cùng khung giờ, khác KTV)
            BE->>DB: UPDATE bookings SET staff_id = new_staff_id
            BE->>NOTI: notify_reschedule_success(KH, "Đổi KTV")
        else Cần dời giờ (Khác khung giờ)
            BE->>NOTI: notify_reschedule_proposal(KH, new_slot)
            Note over KH: Khách hàng xem xét đề xuất
        else Xung đột nghiêm trọng
            BE->>DB: UPDATE bookings SET status = 'PENDING_MANUAL'
            BE->>NOTI: notify_receptionist_critical_error(bookingId)
        end
    end

    Note over BE,DB: Toàn bộ quá trình quét và xử lý conflict được đảm bảo tính nguyên tử
    BE-->>UI: Cập nhật Dashboard sự cố
    deactivate BE
    UI-->>QTV: Hiển thị báo cáo xử lý tự động
```
**Hình 3.21: Sơ đồ tuần tự chức năng Tái lập lịch tự động**
