# Sơ đồ Tuần tự: Hoạt động Khách hàng

Tài liệu này chứa các sơ đồ tuần tự cho phân hệ Khách hàng.

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

## Sơ đồ hoạt động cho Khách hàng

### 3.8. Xem danh sách dịch vụ (A2.1)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as ServiceService
    participant DB as Database

    KH->>UI: Truy cập trang dịch vụ
    activate UI
    UI->>BFF: fetchServices()
    activate BFF

    BFF->>API: GET /services
    activate API

    API->>S: get_all_services()
    activate S

    S->>DB: query_services_by_category
    activate DB
    DB-->>S: services_list
    deactivate DB

    S-->>API: List[ServiceSchema]
    deactivate S

    API-->>BFF: Data
    deactivate API

    BFF-->>UI: Dữ liệu dịch vụ
    deactivate BFF

    UI-->>KH: Hiển thị danh sách dịch vụ
    deactivate UI
```
**Hình 3.8: Sơ đồ tuần tự chức năng Xem danh sách dịch vụ**

### 3.9. Xem chi tiết dịch vụ (A2.2)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as ServiceService
    participant DB as Database

    KH->>UI: Chọn một dịch vụ
    activate UI
    UI->>BFF: getServiceDetail(serviceId)
    activate BFF

    BFF->>API: GET /services/{id}
    activate API

    API->>S: get_service_by_id(id)
    activate S

    S->>DB: find_service_with_related
    activate DB
    DB-->>S: service_record
    deactivate DB

    S-->>API: ServiceDetailSchema
    deactivate S

    API-->>BFF: Data
    deactivate API

    BFF-->>UI: Dữ liệu chi tiết
    deactivate BFF

    UI-->>KH: Hiển thị chi tiết dịch vụ
    deactivate UI
```
**Hình 3.9: Sơ đồ tuần tự chức năng Xem chi tiết dịch vụ**

### 3.10. Tìm kiếm khung giờ khả dụng (A2.4)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as SchedulingService
    participant SOLVER as Bộ giải ràng buộc
    participant DB as Database

    KH->>UI: Chọn dịch vụ và ngày mong muốn
    activate UI
    UI->>BFF: getAvailableSlots(serviceId, date)
    activate BFF

    BFF->>API: POST /bookings/availability
    activate API

    API->>S: find_available_slots(serviceId, date)
    activate S

    par Lấy dữ liệu khả dụng
        S->>DB: get_staff_schedules
        S->>DB: get_existing_bookings
        S->>DB: get_resource_availability
    end

    S->>SOLVER: compute_feasible_slots(data)
    activate SOLVER
    note right of SOLVER: Thuật toán tối ưu hóa kiểm tra ràng buộc
    SOLVER-->>S: valid_slots[]
    deactivate SOLVER

    S-->>API: List[SlotSchema]
    deactivate S

    API-->>BFF: Data
    deactivate API

    BFF-->>UI: Hiển thị khung giờ
    deactivate BFF

    UI-->>KH: Hiển thị các khung giờ khả dụng
    deactivate UI
```
**Hình 3.10: Sơ đồ tuần tự chức năng Tìm kiếm khung giờ khả dụng**

### 3.11. Hoàn tất đặt lịch hẹn (A2.5)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as BookingService
    participant NOTI as NotificationService
    participant DB as Database

    KH->>UI: Xác nhận đặt lịch
    activate UI
    UI->>BFF: createBooking(slotData)
    activate BFF

    BFF->>API: POST /bookings
    activate API

    API->>S: create_booking(data)
    activate S

    critical Kiểm tra tính nhất quán
        S->>DB: Kiểm tra khả dụng lần cuối (Exclusion Check)
        activate DB
        DB-->>S: OK
        deactivate DB
    end

    S->>DB: INSERT INTO bookings
    activate DB
    DB-->>S: new_booking
    deactivate DB

    par Gửi thông báo
        S->>NOTI: send_confirmation_email(customer)
        S->>NOTI: notify_staff_new_appointment(staff)
    end

    S-->>API: BookingSchema
    deactivate S

    API-->>BFF: 201 Created
    deactivate API

    BFF-->>UI: Đặt lịch thành công
    deactivate BFF

    UI-->>KH: Hiển thị thông báo thành công
    deactivate UI
```
**Hình 3.11: Sơ đồ tuần tự chức năng Hoàn tất đặt lịch hẹn**

### 3.12. Tham gia danh sách chờ (A2.6)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as WaitlistService
    participant DB as Database

    KH->>UI: Chọn khung giờ đã hết chỗ
    activate UI
    UI->>BFF: joinWaitlist(slotData)
    activate BFF

    BFF->>API: POST /waitlist
    activate API

    API->>S: add_to_waitlist(customerId, slotData)
    activate S

    S->>DB: INSERT INTO waitlist_entries
    activate DB
    DB-->>S: waitlist_entry
    deactivate DB

    S-->>API: WaitlistEntrySchema
    deactivate S

    API-->>BFF: 201 Created
    deactivate API

    BFF-->>UI: Đăng ký thành công
    deactivate BFF

    UI-->>KH: Thông báo đã tham gia danh sách chờ
    deactivate UI
```
**Hình 3.12: Sơ đồ tuần tự chức năng Tham gia danh sách chờ**

### 3.13. Nhận hỗ trợ qua trò chuyện trực tuyến (A2.7)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện trò chuyện
    participant BFF as Server Action
    participant API as API Router
    participant S as ChatService
    participant DB as Database

    KH->>UI: Mở cửa sổ trò chuyện
    activate UI
    UI->>BFF: getChatSession()
    BFF->>API: GET /chat/sessions/me
    API-->>BFF: ChatSessionSchema
    BFF-->>UI: Hiển thị lịch sử (nếu có)

    KH->>UI: Gửi tin nhắn yêu cầu hỗ trợ
    UI->>BFF: sendMessage(content)
    activate BFF

    BFF->>API: POST /chat/messages
    activate API

    API->>S: send_message(customerId, content)
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

    Note over UI: Chờ phản hồi từ lễ tân
    UI-->>KH: Thông báo đang chờ phản hồi
    deactivate UI
```
**Hình 3.12: Sơ đồ tuần tự chức năng Nhận hỗ trợ qua trò chuyện trực tuyến**

### 3.13. Xem lịch sử đặt lịch hẹn (A3.1)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as BookingService
    participant DB as Database

    KH->>UI: Truy cập trang lịch sử
    activate UI
    UI->>BFF: getBookingHistory()
    activate BFF

    BFF->>API: GET /bookings/history
    activate API

    API->>S: get_user_history(userId)
    activate S

    S->>DB: query_bookings_by_user
    activate DB
    DB-->>S: bookings[]
    deactivate DB

    S-->>API: List[BookingSchema]
    deactivate S

    API-->>BFF: Data
    deactivate API

    BFF-->>UI: Hiển thị danh sách
    deactivate BFF

    UI-->>KH: Hiển thị lịch sử lịch hẹn
    deactivate UI
```
**Hình 3.13: Sơ đồ tuần tự chức năng Xem lịch sử đặt lịch hẹn**

### 3.14. Hủy lịch hẹn (A3.2)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as BookingService
    participant DB as Database

    KH->>UI: Chọn lịch hẹn và yêu cầu hủy
    activate UI
    UI->>BFF: cancelBooking(bookingId)
    activate BFF

    BFF->>API: POST /bookings/{id}/cancel
    activate API

    API->>S: cancel_booking(bookingId)
    activate S

    S->>DB: get_booking(bookingId)
    activate DB
    DB-->>S: booking
    deactivate DB

    S->>S: check_cancellation_policy

    alt Vi phạm chính sách hủy
        S-->>API: Error (quá thời hạn cho phép)
        API-->>BFF: Warning
        BFF-->>UI: Hiển thị thông báo chính sách
    else Hợp lệ
        S->>DB: UPDATE bookings SET status = 'CANCELLED'
        activate DB
        DB-->>S: success
        deactivate DB
        S-->>API: Success
        deactivate S
        API-->>BFF: 200 OK
        deactivate API
        BFF-->>UI: Hủy thành công
        deactivate BFF
        UI-->>KH: Xác nhận đã hủy lịch hẹn
        deactivate UI
    end
```
**Hình 3.15: Sơ đồ tuần tự chức năng Hủy lịch hẹn**

### 3.16. Nhận thông báo nhắc lịch (A3.3)

```mermaid
sequenceDiagram
    autonumber
    participant CRON as Bộ lập lịch
    participant S as NotificationService
    participant DB as Database
    participant NOTI as Kênh thông báo
    actor KH as Khách hàng

    Note over CRON: Chạy định kỳ (mỗi giờ)
    CRON->>S: trigger_reminder_check()
    activate S

    S->>DB: get_upcoming_bookings(reminder_threshold)
    activate DB
    DB-->>S: bookings_to_remind[]
    deactivate DB

    loop Với mỗi lịch hẹn cần nhắc
        S->>NOTI: send_reminder(customer, booking)
        NOTI-->>KH: Thư điện tử/Tin nhắn nhắc lịch hẹn
    end

    S->>DB: UPDATE bookings SET reminder_sent = true
    deactivate S

    Note over KH: Khách hàng nhận thông báo
    KH->>NOTI: Xác nhận sẽ đến (hoặc Hủy)

    alt Xác nhận đến
        NOTI->>S: confirm_attendance(bookingId)
        S->>DB: UPDATE bookings SET confirmed = true
    else Yêu cầu hủy
        NOTI->>S: request_cancellation(bookingId)
        Note over S: Chuyển sang luồng Hủy lịch (A3.2)
    end
```
**Hình 3.16: Sơ đồ tuần tự chức năng Nhận thông báo nhắc lịch**
### 3.17. Gửi yêu cầu bảo hành (A3.6)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as WarrantyService
    participant DB as Database

    KH->>UI: Chọn Booking hoàn thành và gửi yêu cầu bảo hành
    activate UI
    UI->>BFF: createWarrantyRequest(bookingId, description, images)
    activate BFF

    BFF->>API: POST /warranty-requests
    activate API

    API->>S: create_warranty_request(customerId, data)
    activate S

    S->>DB: INSERT INTO warranty_tickets
    activate DB
    DB-->>S: ticket_record
    deactivate DB

    S-->>API: WarrantyTicketSchema
    deactivate S

    API-->>BFF: 201 Created
    deactivate API

    BFF-->>UI: Thông báo gửi yêu cầu thành công
    deactivate BFF

    UI-->>KH: Hiển thị trạng thái "Đang chờ xử lý"
    deactivate UI
```
**Hình 3.17: Sơ đồ tuần tự chức năng Gửi yêu cầu bảo hành**
