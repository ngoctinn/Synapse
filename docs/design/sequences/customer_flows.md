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
    participant BE as Backend
    participant DB as Database

    KH->>UI: Truy cập trang dịch vụ
    activate UI
    UI->>BE: fetchServices()
    activate BE

    BE->>DB: query_services_by_category
    activate DB
    DB-->>BE: services_list
    deactivate DB

    BE-->>UI: Dữ liệu dịch vụ
    deactivate BE

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
    participant BE as Backend
    participant DB as Database

    KH->>UI: Chọn một dịch vụ
    activate UI
    UI->>BE: getServiceDetail(serviceId)
    activate BE

    BE->>DB: find_service_with_related
    activate DB
    DB-->>BE: service_record
    deactivate DB

    BE-->>UI: Dữ liệu chi tiết
    deactivate BE

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
    participant BE as Backend
    participant SOLVER as Bộ giải ràng buộc
    participant DB as Database

    KH->>UI: Chọn dịch vụ và ngày mong muốn
    activate UI
    UI->>BE: getAvailableSlots(serviceId, date)
    activate BE

    par Lấy dữ liệu khả dụng
        BE->>DB: get_staff_schedules
        BE->>DB: get_existing_bookings
        BE->>DB: get_resource_availability
    end

    BE->>SOLVER: compute_feasible_slots(data)
    activate SOLVER
    note right of SOLVER: Thuật toán tối ưu hóa kiểm tra ràng buộc
    SOLVER-->>BE: valid_slots[]
    deactivate SOLVER

    BE-->>UI: Hiển thị khung giờ
    deactivate BE

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
    participant BE as Backend
    participant NOTI as Kênh thông báo
    participant DB as Database

    KH->>UI: Xác nhận đặt lịch
    activate UI
    UI->>BE: createBooking(slotData)
    activate BE

    critical Kiểm tra tính nhất quán (Atomic Transaction)
        BE->>DB: Kiểm tra khả dụng lần cuối (Exclusion Check)
        activate DB
        Note over BE,DB: Thao tác được bảo vệ bằng Database Transaction
        DB-->>BE: OK
        deactivate DB
    end

    BE->>DB: INSERT INTO bookings
    activate DB
    DB-->>BE: new_booking
    deactivate DB

    par Gửi thông báo
        BE->>NOTI: send_confirmation_email(customer)
        BE->>NOTI: notify_staff_new_appointment(staff)
    end

    BE-->>UI: Đặt lịch thành công
    deactivate BE

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
    participant BE as Backend
    participant DB as Database

    KH->>UI: Chọn khung giờ đã hết chỗ
    activate UI
    UI->>BE: joinWaitlist(slotData)
    activate BE

    BE->>DB: INSERT INTO waitlist_entries
    activate DB
    DB-->>BE: waitlist_entry
    deactivate DB

    BE-->>UI: Đăng ký thành công
    deactivate BE

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
    participant BE as Backend
    participant DB as Database

    KH->>UI: Mở cửa sổ trò chuyện
    activate UI
    UI->>BE: getChatSession()
    BE-->>UI: Hiển thị lịch sử (nếu có)

    KH->>UI: Gửi tin nhắn yêu cầu hỗ trợ
    UI->>BE: sendMessage(content)
    activate BE

    BE->>DB: INSERT INTO chat_messages
    activate DB
    Note over BE,DB: Truy cập được kiểm soát bởi RLS (auth.uid())
    DB-->>BE: message
    deactivate DB

    BE-->>UI: Cập nhật khung trò chuyện
    deactivate BE

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
    participant BE as Backend
    participant DB as Database

    KH->>UI: Truy cập trang lịch sử
    activate UI
    UI->>BE: getBookingHistory()
    activate BE

    BE->>DB: query_bookings_by_user
    activate DB
    DB-->>BE: bookings[]
    deactivate DB

    BE-->>UI: Hiển thị danh sách
    deactivate BE

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
    participant BE as Backend
    participant DB as Database

    KH->>UI: Chọn lịch hẹn và yêu cầu hủy
    activate UI
    UI->>BE: cancelBooking(bookingId)
    activate BE

    BE->>DB: get_booking(bookingId)
    activate DB
    DB-->>BE: booking
    deactivate DB

    BE->>BE: check_cancellation_policy

    alt Vi phạm chính sách hủy
        BE-->>UI: Hiển thị thông báo chính sách
    else Hợp lệ
        BE->>DB: UPDATE bookings SET status = 'CANCELLED'
        activate DB
        DB-->>BE: success
        deactivate DB
        BE-->>UI: Hủy thành công
        deactivate BE
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
    participant BE as Backend
    participant DB as Database
    participant NOTI as Kênh thông báo
    actor KH as Khách hàng

    Note over CRON: Chạy định kỳ (mỗi giờ)
    CRON->>BE: trigger_reminder_check()
    activate BE

    BE->>DB: get_upcoming_bookings(reminder_threshold)
    activate DB
    DB-->>BE: bookings_to_remind[]
    deactivate DB

    loop Với mỗi lịch hẹn cần nhắc
        BE->>NOTI: send_reminder(customer, booking)
        NOTI-->>KH: Thư điện tử/Tin nhắn nhắc lịch hẹn
    end

    BE->>DB: UPDATE bookings SET reminder_sent = true
    deactivate BE

    Note over KH: Khách hàng nhận thông báo
    Note over KH,NOTI: Khách hàng phản hồi từ các kênh (Email/SMS/App)
    KH-->>NOTI: Gửi xác nhận hoặc yêu cầu hủy

    Note over BE: Nếu xác nhận: Cập nhật trạng thái 'CONFIRMED'
    Note over BE: Nếu yêu cầu hủy: Chuyển sang luồng Hủy lịch (A3.2)
```
**Hình 3.16: Sơ đồ tuần tự chức năng Nhận thông báo nhắc lịch**
### 3.17. Gửi yêu cầu bảo hành (A3.6)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    KH->>UI: Chọn Treatment đã mua và gửi yêu cầu bảo hành
    activate UI
    UI->>BE: createWarrantyRequest(treatmentId, description, images)
    activate BE

    BE->>DB: INSERT INTO warranty_tickets
    activate DB
    DB-->>BE: ticket_record
    deactivate DB

    BE-->>UI: Thông báo gửi yêu cầu thành công
    deactivate BE

    UI-->>KH: Hiển thị trạng thái "Đang chờ xử lý"
    deactivate UI
```
**Hình 3.17: Sơ đồ tuần tự chức năng Gửi yêu cầu bảo hành**
