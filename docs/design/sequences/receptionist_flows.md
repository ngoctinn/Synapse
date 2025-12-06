# Sơ đồ Tuần tự: Hoạt động Lễ tân (Receptionist Flows)

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

## 1.1.3 Sơ đồ hoạt động cho nhân viên lễ tân

### 3.31. Xem lịch hẹn tổng quan

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service
    participant DB as Database

    LT->>UI: Mở Dashboard
    activate UI
    UI->>BFF: getAppointments
    activate BFF

    BFF->>API: GET /appointments
    activate API

    API->>S: get_appointments
    activate S

    S->>DB: query_all_appointments_with_details
    activate DB
    DB-->>S: appointments[]
    deactivate DB

    S-->>API: List[AppointmentSchema]
    deactivate S

    API-->>BFF: Data
    deactivate API

    BFF-->>UI: Hiển thị Lịch hẹn
    deactivate BFF

    UI-->>LT: Hiển thị lịch tổng quan
    deactivate UI
```
**Hình 3.31: Sơ đồ tuần tự chức năng Xem lịch hẹn tổng quan**

### 3.34. Tạo lịch hẹn thủ công (Walk-in)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service
    participant SOLVER as Bộ giải
    participant DB as Database

    LT->>UI: Nhập thông tin khách & dịch vụ
    activate UI
    UI->>BFF: checkAvailability
    activate BFF

    BFF->>API: POST /bookings/check
    activate API
    API->>S: check_slot_availability
    activate S
    S->>SOLVER: validate_slot
    SOLVER-->>S: Valid
    S-->>API: OK
    deactivate S
    API-->>BFF: OK
    deactivate API
    deactivate BFF

    LT->>UI: Xác nhận tạo lịch
    UI->>BFF: createWalkInBooking
    activate BFF

    BFF->>API: POST /bookings/manual
    activate API

    API->>S: create_manual_booking
    activate S

    S->>DB: get_or_create_customer
    S->>DB: create_booking
    activate DB
    DB-->>S: booking
    deactivate DB

    S-->>API: Success
    deactivate S

    API-->>BFF: OK
    deactivate API

    BFF-->>UI: Cập nhật Dashboard
    deactivate BFF

    UI-->>LT: Hiển thị lịch mới trên bảng
    deactivate UI
```
**Hình 3.34: Sơ đồ tuần tự chức năng Tạo lịch hẹn thủ công**

### 3.35. Check-in lịch hẹn

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service
    participant DB as Database

    LT->>UI: Chọn lịch hẹn -> Check-in
    activate UI
    UI->>BFF: checkInCustomer
    activate BFF

    BFF->>API: POST /bookings/{id}/check-in
    activate API

    API->>S: update_booking_status
    activate S

    S->>DB: set_status
    S->>DB: set_actual_start_time
    activate DB
    DB-->>S: updated
    deactivate DB

    S-->>API: Success
    deactivate S

    API-->>BFF: OK
    deactivate API

    BFF-->>UI: Đổi màu (Đang xử lý)
    deactivate BFF

    UI-->>LT: Cập nhật trạng thái "Đang phục vụ"
    deactivate UI
```
**Hình 3.35: Sơ đồ tuần tự chức năng Check-in lịch hẹn**

### 3.37. Xử lý thanh toán

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service
    participant DB as Database

    LT->>UI: Xác nhận thanh toán
    activate UI
    UI->>BFF: processPayment
    activate BFF

    BFF->>API: POST /payments
    activate API

    API->>S: create_payment_transaction
    activate S

    S->>DB: create_invoice
    S->>DB: update_booking_status
    activate DB
    DB-->>S: invoice
    deactivate DB

    S-->>API: InvoiceSchema
    deactivate S

    API-->>BFF: Success
    deactivate API

    BFF-->>UI: Hiển thị Hóa đơn
    deactivate BFF

    UI-->>LT: In hóa đơn & Hoàn tất
    deactivate UI
```
**Hình 3.37: Sơ đồ tuần tự chức năng Xử lý thanh toán**
