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
    participant S as BookingService
    participant DB as Database

    LT->>UI: Chọn lịch hẹn -> Check-in
    activate UI
    UI->>BFF: checkInCustomer(bookingId)
    activate BFF

    BFF->>API: POST /bookings/{id}/check-in
    activate API

    API->>S: check_in_booking(booking_id)
    activate S

    S->>DB: get_booking_with_items(booking_id)
    activate DB
    DB-->>S: booking (với booking_items)
    deactivate DB

    S->>DB: set_status(IN_PROGRESS)
    S->>DB: set_check_in_time(NOW)
    S->>DB: set_actual_start_time(NOW)

    Note over S,DB: Xử lý liệu trình (nếu có)
    loop Với mỗi booking_item có treatment_id
        S->>DB: SELECT * FROM customer_treatments WHERE id = treatment_id
        DB-->>S: treatment
        alt Liệu trình còn hiệu lực
            S->>DB: UPDATE customer_treatments SET used_sessions = used_sessions + 1
            S->>DB: CHECK IF used_sessions >= total_sessions THEN SET status = 'COMPLETED'
        else Liệu trình hết hạn/hết lượt
            Note over S: Log cảnh báo, không trừ buổi
        end
    end

    activate DB
    DB-->>S: updated
    deactivate DB

    S-->>API: BookingSchema (updated)
    deactivate S

    API-->>BFF: 200 OK
    deactivate API

    BFF-->>UI: Đổi màu (Đang xử lý)
    deactivate BFF

    UI-->>LT: Cập nhật trạng thái "Đang phục vụ"
    deactivate UI
```
**Hình 3.35: Sơ đồ tuần tự chức năng Check-in lịch hẹn**

> **Ghi chú quan trọng:** Sơ đồ này đã được cập nhật để bổ sung logic **trừ buổi liệu trình** theo đúng quy trình nghiệp vụ. Khi check-in, nếu booking có liên kết với `customer_treatments`, hệ thống sẽ tự động tăng `used_sessions` và kiểm tra hoàn thành liệu trình.

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

### 3.25. Tái lập lịch do sự cố (Rescheduling)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as :ReschedulingBoard
    participant BFF as :BookingAction
    participant API as :BookingRouter
    participant S as :BookingService
    participant REDIS as :JobQueue (Redis)
    participant WORKER as :SolverWorker
    participant DB as :Database

    LT->>UI: Báo cáo sự cố (KTV nghỉ/Phòng hỏng)
    activate UI
    UI->>BFF: reportResourceIssue(resourceId, period)
    activate BFF

    BFF->>API: POST /resources/report-issue
    activate API

    API->>S: trigger_rescheduling_process(id, data)
    activate S

    S->>DB: update_resource_status(MAINTENANCE)
    S->>DB: find_affected_bookings(id, period)
    DB-->>S: bookings_list[]

    S->>REDIS: push_rescheduling_job(bookings_list)
    S-->>API: JobID (Processing)
    deactivate S

    API-->>BFF: 202 Accepted
    deactivate API
    BFF-->>UI: Hiển thị trạng thái "Đang xử lý dời lịch..."
    deactivate BFF

    Note over WORKER, REDIS: Tiến trình nền (Background)
    WORKER->>REDIS: pop_job()
    activate WORKER
    WORKER->>WORKER: compute_optimal_moves()
    WORKER->>DB: update_multiple_bookings(new_slots)
    WORKER->>DB: create_notifications(for_customers)
    deactivate WORKER

    UI->>BFF: checkJobStatus(jobId)
    BFF->>API: GET /jobs/{id}
    API-->>BFF: COMPLETED
    BFF-->>UI: Cập nhật lịch mới thành công
    deactivate UI
```
**Hình 3.25: Sơ đồ tuần tự chức năng Tái lập lịch tự động khi có sự cố**
