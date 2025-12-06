# Sơ đồ Tuần tự: Hoạt động Khách hàng (Customer Flows)

Tài liệu này chứa các sơ đồ tuần tự cho phân hệ Khách hàng, bao gồm xem dịch vụ, đặt lịch và quản lý lịch hẹn.

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

## 1.1.2 Sơ đồ hoạt động cho khách hàng

### 3.15. Xem danh sách dịch vụ

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service (Logic)
    participant DB as Database

    KH->>UI: Truy cập trang Dịch vụ
    activate UI
    UI->>BFF: fetchServices(filter)
    activate BFF

    BFF->>API: GET /services
    activate API

    API->>S: get_all_services(filter)
    activate S

    S->>DB: query_services_by_category()
    activate DB
    DB-->>S: services_list
    deactivate DB

    S-->>API: ServiceSchema[]
    deactivate S

    API-->>BFF: ServiceData
    deactivate API

    BFF-->>UI: Dữ liệu
    deactivate BFF

    UI-->>KH: Hiển thị danh sách dịch vụ
    deactivate UI
```
**Hình 3.15: Sơ đồ tuần tự chức năng Xem danh sách dịch vụ**

### 3.16. Xem chi tiết dịch vụ

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service (Logic)
    participant DB as Database

    KH->>UI: Chọn một dịch vụ cụ thể
    activate UI
    UI->>BFF: getServiceDetail(id)
    activate BFF

    BFF->>API: GET /services/{id}
    activate API

    API->>S: get_service_by_id(id)
    activate S

    S->>DB: find_service_with_related(id)
    activate DB
    DB-->>S: service_record
    deactivate DB

    S-->>API: ServiceDetailSchema
    deactivate S

    API-->>BFF: Data
    deactivate API

    BFF-->>UI: Dữ liệu
    deactivate BFF

    UI-->>KH: Hiển thị chi tiết dịch vụ
    deactivate UI
```
**Hình 3.16: Sơ đồ tuần tự chức năng Xem chi tiết dịch vụ**

### 3.21. Tìm kiếm khung giờ (Smart Scheduling)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service (Logic)
    participant SOLVER as Bộ giải (Solver)
    participant DB as Database

    KH->>UI: Chọn Dịch vụ & Ngày
    activate UI
    UI->>BFF: getAvailableSlots(serviceId, date)
    activate BFF

    BFF->>API: POST /bookings/availability
    activate API

    API->>S: find_slots(service_id, date)
    activate S

    par Lấy dữ liệu khả dụng (Song song)
        S->>DB: get_staff_schedules(date)
        S->>DB: get_existing_bookings(date)
        S->>DB: get_room_availability(date)
    end

    S->>SOLVER: compute_feasible_slots(data)
    activate SOLVER
    note right of SOLVER: CP-SAT Solver checks constraints
    SOLVER-->>S: valid_slots[]
    deactivate SOLVER

    S-->>API: SlotSchema[]
    deactivate S

    API-->>BFF: Slots JSON
    deactivate API

    BFF-->>UI: Hiển thị Khung giờ
    deactivate BFF

    UI-->>KH: Hiển thị các khung giờ trống
    deactivate UI
```
**Hình 3.21: Sơ đồ tuần tự chức năng Tìm kiếm khung giờ**

### 3.22. Hoàn tất đặt lịch

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service (Logic)
    participant NOTI as Notification Service
    participant DB as Database

    KH->>UI: Xác nhận đặt lịch
    activate UI
    UI->>BFF: createBooking(payload)
    activate BFF

    BFF->>API: POST /bookings
    activate API

    API->>S: create_booking(user_id, booking_data)
    activate S

    crit Kiểm tra tính nhất quán (Critical)
        S->>DB: lock_resources(staff, room, time)
        S->>DB: check_conflict_last_time()
        activate DB
        DB-->>S: OK
        deactivate DB
    end

    S->>DB: insert_booking(status='PENDING')
    activate DB
    DB-->>S: new_booking
    deactivate DB

    par Gửi thông báo
        S->>NOTI: email_customer_confirmation()
        S->>NOTI: notify_staff_new_appointment()
    end

    S-->>API: BookingSchema
    deactivate S

    API-->>BFF: 201 Created
    deactivate API

    BFF-->>UI: Thành công
    deactivate BFF

    UI-->>KH: Hiển thị thông báo thành công
    deactivate UI
```
**Hình 3.22: Sơ đồ tuần tự chức năng Hoàn tất đặt lịch**

### 3.24. Nhận tư vấn và đặt lịch qua Chatbot

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as :ChatWidget
    participant BFF as :ChatAction
    participant API as :ChatRouter
    participant AI as :LLMService
    participant S as :BookingService

    KH->>UI: Gửi tin nhắn ("Đặt lịch mai 9h")
    activate UI
    UI->>BFF: sendMessage(text)
    activate BFF

    BFF->>API: POST /chat/message
    activate API

    API->>AI: process_intent(text)
    activate AI
    AI->>S: check_availability(context)
    activate S
    S-->>AI: slots_info
    deactivate S
    AI-->>API: Response (Natural Language)
    deactivate AI

    API-->>BFF: Message
    deactivate API

    BFF-->>UI: Hiển thị Phản hồi
    deactivate BFF

    UI-->>KH: Hiển thị phản hồi từ Chatbot
    deactivate UI
```
**Hình 3.24: Sơ đồ tuần tự chức năng Nhận tư vấn và đặt lịch qua chatbot**

### 3.25. Hủy lịch hẹn

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service (Logic)
    participant DB as Database

    KH->>UI: Nhấn Hủy lịch
    activate UI
    UI->>BFF: cancelBooking(id, reason)
    activate BFF

    BFF->>API: POST /bookings/{id}/cancel
    activate API

    API->>S: cancel_booking(id, user_id)
    activate S

    S->>DB: get_booking(id)
    activate DB
    DB-->>S: booking
    deactivate DB

    S->>S: check_penalty_policy(booking.start_time)

    alt Hủy muộn (Có phí)
        S-->>API: Error (Cancellation Fee Required)
        API-->>BFF: Warning
        BFF-->>UI: Cảnh báo phí hủy
    else Hợp lệ
        S->>DB: update_status(id, 'CANCELLED')
        activate DB
        DB-->>S: success
        deactivate DB
        S-->>API: Success
        deactivate S
        API-->>BFF: OK
        deactivate API
        BFF-->>UI: Thành công
        deactivate BFF
        UI-->>KH: Xác nhận đã hủy
        deactivate UI
    end
```
**Hình 3.25: Sơ đồ tuần tự chức năng Hủy lịch hẹn**

### 3.26. Xem lịch sử đặt lịch

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service (Logic)
    participant DB as Database

    KH->>UI: Truy cập Lịch sử
    activate UI
    UI->>BFF: getBookingHistory()
    activate BFF

    BFF->>API: GET /bookings/history
    activate API

    API->>S: get_user_history(user_id)
    activate S

    S->>DB: query_bookings_by_user(user_id)
    activate DB
    DB-->>S: bookings[]
    deactivate DB

    S-->>API: BookingListSchema
    deactivate S

    API-->>BFF: Data
    deactivate API

    BFF-->>UI: Hiển thị Danh sách
    deactivate BFF

    UI-->>KH: Hiển thị danh sách lịch sử
    deactivate UI
```
**Hình 3.26: Sơ đồ tuần tự chức năng Xem lịch sử đặt lịch**

### 3.28. Đánh giá dịch vụ

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service (Logic)
    participant DB as Database

    KH->>UI: Viết đánh giá & Chấm sao
    activate UI
    UI->>BFF: submitReview(bookingId, rating, comment)
    activate BFF

    BFF->>API: POST /reviews
    activate API

    API->>S: create_review(user_id, data)
    activate S

    S->>DB: check_booking_completed(bookingId)
    S->>DB: create_review_record(data)
    activate DB
    DB-->>S: success
    deactivate DB

    S-->>API: Success
    deactivate S

    API-->>BFF: OK
    deactivate API

    BFF-->>UI: Thành công
    deactivate BFF

    UI-->>KH: Thông báo cảm ơn
    deactivate UI
```
**Hình 3.28: Sơ đồ tuần tự chức năng Đánh giá dịch vụ**
