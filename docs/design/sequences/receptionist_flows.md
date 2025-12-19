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
    participant BFF as Server Action
    participant API as API Router
    participant S as BookingService
    participant DB as Database

    LT->>UI: Mở bảng điều khiển
    activate UI
    UI->>BFF: getAppointments(date)
    activate BFF

    BFF->>API: GET /appointments?date=...
    activate API

    API->>S: get_appointments_by_date(date)
    activate S

    S->>DB: query_appointments_with_details
    activate DB
    DB-->>S: appointments[]
    deactivate DB

    S-->>API: List[AppointmentSchema]
    deactivate S

    API-->>BFF: Data
    deactivate API

    BFF-->>UI: Hiển thị lịch hẹn
    deactivate BFF

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
    participant BFF as Server Action
    participant API as API Router
    participant S as CustomerService
    participant DB as Database

    LT->>UI: Tìm kiếm khách hàng
    activate UI
    UI->>BFF: searchCustomers(query)
    activate BFF

    BFF->>API: GET /customers?search=...
    activate API

    API->>S: search_customers(query)
    activate S

    S->>DB: query_by_name_or_phone
    activate DB
    DB-->>S: customers[]
    deactivate DB

    S-->>API: List[CustomerSchema]
    deactivate S

    API-->>BFF: Data
    deactivate API

    BFF-->>UI: Hiển thị kết quả
    deactivate BFF

    alt Chọn khách hàng
        LT->>UI: Chọn xem chi tiết
        UI->>BFF: getCustomerDetail(id)
        BFF->>API: GET /customers/{id}
        API-->>BFF: CustomerDetailSchema
        BFF-->>UI: Hiển thị hồ sơ chi tiết
    else Tạo mới khách hàng
        LT->>UI: Nhập thông tin khách mới
        UI->>BFF: createCustomer(data)
        BFF->>API: POST /customers
        API->>S: create_customer(data)
        S->>DB: INSERT INTO customers
        DB-->>S: customer
        S-->>API: CustomerSchema
        API-->>BFF: 201 Created
        BFF-->>UI: Hiển thị hồ sơ mới
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
    participant BFF as Server Action
    participant API as API Router
    participant S as BookingService
    participant SOLVER as Bộ giải ràng buộc
    participant DB as Database

    LT->>UI: Nhập thông tin khách và dịch vụ
    activate UI
    UI->>BFF: checkAvailability(data)
    activate BFF

    BFF->>API: POST /bookings/check
    activate API
    API->>S: check_slot_availability(data)
    activate S
    S->>SOLVER: validate_slot
    SOLVER-->>S: Valid
    S-->>API: OK
    deactivate S
    API-->>BFF: OK
    deactivate API
    deactivate BFF

    LT->>UI: Xác nhận tạo lịch
    UI->>BFF: createManualBooking(data)
    activate BFF

    BFF->>API: POST /bookings/manual
    activate API

    API->>S: create_manual_booking(data)
    activate S

    S->>DB: get_or_create_customer
    S->>DB: INSERT INTO bookings
    activate DB
    DB-->>S: booking
    deactivate DB

    S-->>API: BookingSchema
    deactivate S

    API-->>BFF: 201 Created
    deactivate API

    BFF-->>UI: Cập nhật bảng điều khiển
    deactivate BFF

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
    participant BFF as Server Action
    participant API as API Router
    participant S as BookingService
    participant DB as Database

    LT->>UI: Chọn lịch hẹn và xác nhận khách đến
    activate UI
    UI->>BFF: checkInCustomer(bookingId)
    activate BFF

    BFF->>API: POST /bookings/{id}/check-in
    activate API

    API->>S: check_in_booking(booking_id)
    activate S

    S->>DB: get_booking_with_items(booking_id)
    activate DB
    DB-->>S: booking (với danh sách dịch vụ)
    deactivate DB

    S->>DB: UPDATE bookings SET status = 'IN_PROGRESS'
    S->>DB: UPDATE bookings SET check_in_time = NOW()

    Note over S,DB: Xử lý liệu trình (nếu có)
    loop Với mỗi dịch vụ có liên kết liệu trình
        S->>DB: SELECT * FROM customer_treatments WHERE id = treatment_id
        DB-->>S: treatment
        alt Liệu trình còn hiệu lực
            S->>DB: UPDATE customer_treatments SET used_sessions = used_sessions + 1
            S->>DB: Kiểm tra và đánh dấu COMPLETED nếu hết buổi
        else Liệu trình hết hạn hoặc hết buổi
            Note over S: Ghi nhật ký cảnh báo
        end
    end

    activate DB
    DB-->>S: updated
    deactivate DB

    S-->>API: BookingSchema (updated)
    deactivate S

    API-->>BFF: 200 OK
    deactivate API

    BFF-->>UI: Đổi màu trạng thái
    deactivate BFF

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
    participant BFF as Server Action
    participant API as API Router
    participant S as PaymentService
    participant DB as Database

    LT->>UI: Xác nhận thanh toán
    activate UI
    UI->>BFF: processPayment(bookingId, paymentMethod)
    activate BFF

    BFF->>API: POST /payments
    activate API

    API->>S: create_payment_transaction(data)
    activate S

    S->>DB: INSERT INTO invoices
    S->>DB: UPDATE bookings SET status = 'COMPLETED'
    activate DB
    DB-->>S: invoice
    deactivate DB

    S-->>API: InvoiceSchema
    deactivate S

    API-->>BFF: 201 Created
    deactivate API

    BFF-->>UI: Hiển thị hóa đơn
    deactivate BFF

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
    participant BFF as Server Action
    participant API as API Router
    participant S as ChatService
    participant DB as Database

    Note over UI: Có khách hàng gửi tin nhắn
    UI->>LT: Thông báo có yêu cầu hỗ trợ mới
    activate LT

    LT->>UI: Mở phiên trò chuyện
    activate UI
    UI->>BFF: getChatSession(sessionId)
    activate BFF
    BFF->>API: GET /chat/sessions/{id}
    API-->>BFF: ChatSessionSchema
    BFF-->>UI: Hiển thị lịch sử tin nhắn
    deactivate BFF

    LT->>UI: Nhập và gửi phản hồi
    UI->>BFF: sendMessage(sessionId, content)
    activate BFF

    BFF->>API: POST /chat/messages
    activate API

    API->>S: send_message(sessionId, content)
    activate S

    S->>DB: INSERT INTO chat_messages
    activate DB
    DB-->>S: message
    deactivate DB

    S-->>API: MessageSchema
    deactivate S

    API-->>BFF: 201 Created
    deactivate API

    BFF-->>UI: Cập nhật khung trò chuyện
    deactivate BFF

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
    participant BFF as Server Action
    participant API as API Router
    participant S as TreatmentService
    participant DB as Database

    LT->>UI: Tra cứu liệu trình của khách hàng
    activate UI
    UI->>BFF: getCustomerTreatments(customerId)
    activate BFF

    BFF->>API: GET /customers/{id}/treatments
    activate API

    API->>S: get_treatments_by_customer(customerId)
    activate S

    S->>DB: query_customer_treatments_with_history
    activate DB
    DB-->>S: treatments[]
    deactivate DB

    S-->>API: List[TreatmentSchema]
    deactivate S

    API-->>BFF: Data
    deactivate API

    BFF-->>UI: Hiển thị danh sách liệu trình
    deactivate BFF

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
    participant BFF as Server Action
    participant S as BookingService
    participant SOLVER as Bộ giải ràng buộc
    participant NOTI as NotificationService
    participant DB as Database
    actor KH as Khách hàng

    QTV->>UI: Cập nhật lịch làm việc (Nghỉ đột xuất)
    activate UI
    UI->>BFF: updateStaffSchedule(data)
    activate BFF

    BFF->>S: trigger_reschedule_check(staffId, date)
    activate S

    S->>DB: find_conflicting_bookings(staffId, date)
    activate DB
    DB-->>S: bookings_list[]
    deactivate DB

    loop Với mỗi lịch hẹn bị xung đột
        S->>SOLVER: find_alternative_options(booking, policy)
        activate SOLVER
        Note right of SOLVER: Tìm KTV thay thế hoặc Giờ khác
        SOLVER-->>S: recommended_option
        deactivate SOLVER

        alt Có phương án thay thế tối ưu (Cùng khung giờ, khác KTV)
            S->>DB: UPDATE bookings SET staff_id = new_staff_id
            S->>NOTI: notify_reschedule_success(KH, "Đổi KTV")
        else Cần dời giờ (Khác khung giờ)
            S->>NOTI: notify_reschedule_proposal(KH, new_slot)
            Note over KH: Khách hàng xem xét đề xuất
        else Xung đột nghiêm trọng
            S->>DB: UPDATE bookings SET status = 'PENDING_MANUAL'
            S->>NOTI: notify_receptionist_critical_error(bookingId)
        end
    end

    S-->>BFF: RescheduleSummary
    deactivate S
    BFF-->>UI: Cập nhật Dashboard sự cố
    deactivate BFF
    UI-->>QTV: Hiển thị báo cáo xử lý tự động
    deactivate UI
```
**Hình 3.21: Sơ đồ tuần tự chức năng Tái lập lịch tự động**
