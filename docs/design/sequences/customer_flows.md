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
    participant S as Service
    participant DB as Database

    KH->>UI: Truy cập trang Dịch vụ
    activate UI
    UI->>BFF: fetchServices
    activate BFF

    BFF->>API: GET /services
    activate API

    API->>S: get_all_services
    activate S

    S->>DB: query_services_by_category
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
    participant S as Service
    participant DB as Database

    KH->>UI: Chọn một dịch vụ cụ thể
    activate UI
    UI->>BFF: getServiceDetail
    activate BFF

    BFF->>API: GET /services/{id}
    activate API

    API->>S: get_service_by_id
    activate S

    S->>DB: find_service_with_related
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

### 3.21. Tìm kiếm khung giờ

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service
    participant SOLVER as Bộ giải
    participant DB as Database

    KH->>UI: Chọn Dịch vụ & Ngày
    activate UI
    UI->>BFF: getAvailableSlots
    activate BFF

    BFF->>API: POST /bookings/availability
    activate API

    API->>S: find_slots
    activate S

    par Lấy dữ liệu khả dụng
        S->>DB: get_staff_schedules
        S->>DB: get_existing_bookings
        S->>DB: get_room_availability
    end

    S->>SOLVER: compute_feasible_slots
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
    participant S as Service
    participant NOTI as Notification Service
    participant DB as Database

    KH->>UI: Xác nhận đặt lịch
    activate UI
    UI->>BFF: createBooking
    activate BFF

    BFF->>API: POST /bookings
    activate API

    API->>S: create_booking
    activate S

    crit Kiểm tra tính nhất quán
        S->>DB: lock_resources
        S->>DB: check_conflict_last_time
        activate DB
        DB-->>S: OK
        deactivate DB
    end

    S->>DB: insert_booking
    activate DB
    DB-->>S: new_booking
    deactivate DB

    par Gửi thông báo
        S->>NOTI: email_customer_confirmation
        S->>NOTI: notify_staff_new_appointment
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
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant AI as AI Bot
    participant S as Service

    KH->>UI: Gửi tin nhắn
    activate UI
    UI->>BFF: sendMessage
    activate BFF

    BFF->>API: POST /chat/message
    activate API

    API->>S: process_chat_message
    activate S

    S->>AI: detect_intent
    activate AI
    AI-->>S: intent, entities
    deactivate AI

    alt Intent là Đặt lịch
        S->>S: get_booking_availability
        S-->>AI: slots_info
        activate AI
        AI-->>S: response_text
        deactivate AI
    end

    S-->>API: MessageResponse
    deactivate S

    API-->>BFF: Message Data
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
    participant S as Service
    participant DB as Database

    KH->>UI: Nhấn Hủy lịch
    activate UI
    UI->>BFF: cancelBooking
    activate BFF

    BFF->>API: POST /bookings/{id}/cancel
    activate API

    API->>S: cancel_booking
    activate S

    S->>DB: get_booking
    activate DB
    DB-->>S: booking
    deactivate DB

    S->>S: check_penalty_policy

    alt Hủy muộn
        S-->>API: Error
        API-->>BFF: Warning
        BFF-->>UI: Cảnh báo phí hủy
    else Hợp lệ
        S->>DB: update_status
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
    participant S as Service
    participant DB as Database

    KH->>UI: Truy cập Lịch sử
    activate UI
    UI->>BFF: getBookingHistory
    activate BFF

    BFF->>API: GET /bookings/history
    activate API

    API->>S: get_user_history
    activate S

    S->>DB: query_bookings_by_user
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
    participant S as Service
    participant DB as Database

    KH->>UI: Viết đánh giá & Chấm sao
    activate UI
    UI->>BFF: submitReview
    activate BFF

    BFF->>API: POST /reviews
    activate API

    API->>S: create_review
    activate S

    S->>DB: check_booking_completed
    S->>DB: create_review_record
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
