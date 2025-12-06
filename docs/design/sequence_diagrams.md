# Sơ đồ Tuần tự (Sequence Diagrams) - Dự án Synapse

Tài liệu này mô tả chi tiết các luồng tương tác trong hệ thống Synapse theo kiến trúc **Modular Monolith** (Next.js + FastAPI).

## Quy ước
- **Actor (Tác nhân)**: Tiếng Việt.
- **Components/Classes**: Tiếng Anh (PascalCase).
- **Messages/Functions**: Tiếng Anh (camelCase).
- **Architecture**: Actor -> View (Next.js) -> Server Action (BFF) -> Router (FastAPI) -> Service -> Database.

---

## 1. Hệ thống xác thực (Authentication System)

### 3.7. Đăng ký tài khoản khách hàng
Người dùng tạo tài khoản mới để sử dụng dịch vụ.

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as :RegisterForm
    participant BFF as :AuthAction
    participant API as :AuthRouter
    participant S as :AuthService
    participant DB as :UserRepo/DB

    KH->>UI: Nhập thông tin đăng ký (email, pass)
    activate UI
    UI->>BFF: registerUser(payload)
    activate BFF

    BFF->>API: POST /auth/register
    activate API

    API->>S: register_new_user(user_data)
    activate S

    S->>DB: get_user_by_email(email)
    activate DB
    DB-->>S: null (User not found)
    deactivate DB

    S->>S: hash_password(password)

    S->>DB: create_user(new_user)
    activate DB
    DB-->>S: user_record
    deactivate DB

    S->>S: send_verification_email(email)

    S-->>API: UserSchema
    deactivate S

    API-->>BFF: 201 Created
    deactivate API

    BFF-->>UI: Success Result
    deactivate BFF

    UI-->>KH: Hiển thị thông báo "Kiểm tra email"
    deactivate UI
```

### 3.8. Xác thực email
Người dùng nhấp vào link trong email để kích hoạt tài khoản.

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as :VerifyPage
    participant BFF as :AuthAction
    participant API as :AuthRouter
    participant S as :AuthService
    participant DB as :UserRepo/DB

    KH->>UI: Truy cập link xác thực (token)
    activate UI
    UI->>BFF: verifyEmail(token)
    activate BFF

    BFF->>API: POST /auth/verify-email
    activate API

    API->>S: verify_user_email(token)
    activate S

    S->>DB: get_user_by_token(token)
    activate DB
    DB-->>S: user_record
    deactivate DB

    S->>DB: update_user_status(active=True)
    activate DB
    DB-->>S: updated_user
    deactivate DB

    S-->>API: Success Message
    deactivate S

    API-->>BFF: 200 OK
    deactivate API

    BFF-->>UI: Verification Success
    deactivate BFF

    UI-->>KH: Chuyển hướng đến trang đăng nhập
    deactivate UI
```

### 3.9. Đăng nhập
Người dùng đăng nhập vào hệ thống.

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as :LoginForm
    participant BFF as :AuthAction
    participant API as :AuthRouter
    participant S as :AuthService
    participant DB as :UserRepo/DB

    KH->>UI: Nhập credentials (email, pass)
    activate UI
    UI->>BFF: login(credentials)
    activate BFF

    BFF->>API: POST /auth/login
    activate API

    API->>S: authenticate_user(email, pass)
    activate S

    S->>DB: get_user_with_password(email)
    activate DB
    DB-->>S: user_record
    deactivate DB

    S->>S: verify_password(input_pass, db_pass)

    alt Password Invalid
        S-->>API: Error (Invalid Credentials)
        API-->>BFF: 401 Unauthorized
        BFF-->>UI: Hiển thị lỗi
    else Password Valid
        S->>S: create_access_token(user_id)
        S-->>API: TokenSchema (JWT)
        deactivate S

        API-->>BFF: 200 OK (Access Token)
        deactivate API

        BFF->>BFF: store_cookie(session)
        BFF-->>UI: Redirect to Dashboard
        deactivate BFF

        UI-->>KH: Hiển thị Dashboard
        deactivate UI
    end
```

### 3.10. Quên mật khẩu
Người dùng yêu cầu đặt lại mật khẩu khi quên.

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as :ForgotPasswordForm
    participant BFF as :AuthAction
    participant API as :AuthRouter
    participant S as :AuthService
    participant DB as :UserRepo/DB

    KH->>UI: Nhập email yêu cầu
    activate UI
    UI->>BFF: requestPasswordReset(email)
    activate BFF

    BFF->>API: POST /auth/forgot-password
    activate API

    API->>S: request_password_reset(email)
    activate S

    S->>DB: get_user_by_email(email)
    activate DB
    DB-->>S: user_record
    deactivate DB

    opt User exists
        S->>S: generate_reset_token()
        S->>DB: save_reset_token(user_id, token)
        activate DB
        DB-->>S: success
        deactivate DB
        S->>S: send_reset_email(email, token)
    end

    S-->>API: Success Message
    deactivate S

    API-->>BFF: 200 OK
    deactivate API

    BFF-->>UI: Hiển thị thông báo "Kiểm tra email"
    deactivate BFF
    deactivate UI
```

### 3.11. Đặt lại mật khẩu
Người dùng nhập mật khẩu mới sau khi xác thực token.

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as :ResetPasswordForm
    participant BFF as :AuthAction
    participant API as :AuthRouter
    participant S as :AuthService
    participant DB as :UserRepo/DB

    KH->>UI: Nhập mật khẩu mới (từ link email)
    activate UI
    UI->>BFF: resetPassword(token, newPass)
    activate BFF

    BFF->>API: POST /auth/reset-password
    activate API

    API->>S: reset_password(token, newPass)
    activate S

    S->>DB: validate_reset_token(token)
    activate DB
    DB-->>S: user_record
    deactivate DB

    S->>S: hash_password(newPass)
    S->>DB: update_password(user_id, hashedPass)
    activate DB
    DB-->>S: success
    deactivate DB

    S-->>API: Success Message
    deactivate S

    API-->>BFF: 200 OK
    deactivate API

    BFF-->>UI: Success Result
    deactivate BFF

    UI-->>KH: Thông báo thành công & Chuyển Login
    deactivate UI
```

### 3.14. Đăng xuất

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as :Dashboard
    participant BFF as :AuthAction

    KH->>UI: Nhấn Đăng xuất
    activate UI
    UI->>BFF: logout()
    activate BFF

    BFF->>BFF: delete_cookie(session)
    BFF-->>UI: Redirect to Login
    deactivate BFF

    UI-->>KH: Trang đăng nhập
    deactivate UI
```

## 2. Hoạt động khách hàng (Customer Flows)

### 3.15. Xem danh sách dịch vụ
Khách hàng xem danh sách các dịch vụ spa.

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as :ServiceListPage
    participant BFF as :ServiceAction
    participant API as :ServiceRouter
    participant S as :ServiceService
    participant DB as :ServiceRepo

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
    API-->>BFF: JSON Data
    deactivate API
    BFF-->>UI: Data
    deactivate BFF
    UI-->>KH: Hiển thị danh sách thẻ dịch vụ
    deactivate UI
```

### 3.21. Tìm kiếm khung giờ (Smart Scheduling)
Khách hàng chọn dịch vụ và tìm giờ trống. Hệ thống sử dụng thuật toán OR-Tools để kiểm tra ràng buộc tài nguyên.

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as :BookingWizard
    participant BFF as :BookingAction
    participant API as :BookingRouter
    participant S as :BookingService
    participant SOLVER as :AvailabilitySolver
    participant DB as :ResourceRepo

    KH->>UI: Chọn Dịch vụ & Ngày & KTV (Optional)
    activate UI
    UI->>BFF: getAvailableSlots(serviceId, date, staffId)
    activate BFF
    BFF->>API: POST /bookings/availability
    activate API
    API->>S: find_slots(service_id, date, staff_id)
    activate S

    par Fetch Constraint Data
        S->>DB: get_staff_schedules(date)
        S->>DB: get_room_bookings(date)
        S->>DB: get_service_duration(service_id)
    end

    S->>SOLVER: compute_available_slots(data)
    activate SOLVER
    note right of SOLVER: Xử lý ràng buộc:<br/>- Ca làm việc KTV<br/>- Sức chứa phòng<br/>- Kỹ năng staff
    SOLVER-->>S: slots[]
    deactivate SOLVER

    S-->>API: SlotSchema[]
    deactivate S
    API-->>BFF: JSON Slots
    deactivate API
    BFF-->>UI: Hiển thị các khung giờ khả dụng
    deactivate BFF
    UI-->>KH: Chọn giờ muốn đặt
    deactivate UI
```

### 3.22. Hoàn tất đặt lịch
Khách hàng xác nhận thông tin và tạo cuộc hẹn.

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as :BookingSummary
    participant BFF as :BookingAction
    participant API as :BookingRouter
    participant S as :BookingService
    participant DB as :BookingRepo
    participant NOTI as :NotificationService

    KH->>UI: Nhấn "Xác nhận đặt lịch"
    activate UI
    UI->>BFF: submitBooking(payload)
    activate BFF
    BFF->>API: POST /bookings
    activate API
    API->>S: create_booking(user_id, slot_info)
    activate S

    crit Double Booking Guard
        S->>DB: lock_resources(staff_id, room_id, time)
        S->>DB: check_availability_again()
        activate DB
        DB-->>S: available
        deactivate DB
    end

    S->>DB: insert_booking(status='PENDING')
    activate DB
    DB-->>S: booking_record
    deactivate DB

    par Notifications
        S->>NOTI: send_customer_confirmation(email)
        S->>NOTI: notify_staff(staff_id)
    end

    S-->>API: BookingSchema
    deactivate S
    API-->>BFF: 201 Created
    deactivate API
    BFF-->>UI: Success
    deactivate BFF
    UI-->>KH: Hiển thị màn hình thành công
    deactivate UI
```

### 3.25. Hủy lịch hẹn
Khách hàng hủy lịch hẹn đã đặt.

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as :AppointmentDetails
    participant BFF as :BookingAction
    participant API as :BookingRouter
    participant S as :BookingService
    participant DB as :BookingRepo

    KH->>UI: Nhấn nút Hủy (Lý do)
    activate UI
    UI->>BFF: cancelBooking(bookingId, reason)
    activate BFF
    BFF->>API: POST /bookings/{id}/cancel
    activate API
    API->>S: cancel_booking(id, user_id, reason)
    activate S

    S->>DB: get_booking(id)
    activate DB
    DB-->>S: booking
    deactivate DB

    S->>S: validate_cancellation_policy(booking.time)
    note right of S: Kiểm tra trước giờ hẹn > 2h?

    alt Vi phạm chính sách
        S-->>API: Error (Too late to cancel)
        API-->>BFF: 400 Bad Request
        BFF-->>UI: Thông báo lỗi
    else Hợp lệ
        S->>DB: update_status(id, 'CANCELLED')
        activate DB
        DB-->>S: success
        deactivate DB
        S-->>API: Success
        API-->>BFF: 200 OK
        BFF-->>UI: Cập nhật trạng thái
        UI-->>KH: "Đã hủy thành công"
    end
    deactivate S
    deactivate API
    deactivate BFF
    deactivate UI
```

## 3. Hoạt động Lễ tân (Receptionist Flows)

### 3.31. Xem lịch hẹn tổng quan
Lễ tân xem Dashboard lịch trình của toàn bộ Spa.

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as :ReceptionDashboard
    participant BFF as :AppointmentAction
    participant API as :AppointmentRouter
    participant S as :AppointmentService
    participant DB as :BookingRepo

    LT->>UI: Truy cập Dashboard
    activate UI
    UI->>BFF: getDailyAppointments(date)
    activate BFF
    BFF->>API: GET /appointments?date={date}&view=all
    activate API
    API->>S: get_all_appointments(date)
    activate S
    S->>DB: query_appointments_with_resources()
    activate DB
    note right of DB: Join Booking, User, Staff, Room
    DB-->>S: appointments[]
    deactivate DB
    S-->>API: AppointmentSchema[]
    deactivate S
    API-->>BFF: JSON Data
    deactivate API
    BFF-->>UI: Data
    deactivate BFF
    UI-->>LT: Hiển thị Scheduler/Calendar View
    deactivate UI
```

### 3.34. Tạo lịch hẹn thủ công (Walk-in)
Lễ tân tạo lịch cho khách vãng lai hoặc đặt hộ.

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as :ManualBookingForm
    participant BFF as :BookingAction
    participant API as :BookingRouter
    participant S as :BookingService
    participant DB as :BookingRepo

    LT->>UI: Nhập thông tin khách & Chọn dịch vụ
    activate UI
    UI->>BFF: createWalkInBooking(payload)
    activate BFF
    BFF->>API: POST /bookings/manual
    activate API
    API->>S: create_manual_booking(data, staff_id)
    activate S

    S->>DB: get_or_create_customer(phone)
    activate DB
    DB-->>S: customer_id
    deactivate DB

    S->>S: check_availability(slot)

    S->>DB: create_booking(status='CONFIRMED')
    activate DB
    DB-->>S: booking
    deactivate DB

    S-->>API: BookingSchema
    deactivate S
    API-->>BFF: 201 Created
    deactivate API
    BFF-->>UI: Success
    deactivate BFF
    UI-->>LT: Cập nhật lịch trên Dashboard
    deactivate UI
```

### 3.35. Check-in lịch hẹn
Khách đến Spa, lễ tân xác nhận có mặt.

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as :BookingCard
    participant BFF as :BookingAction
    participant API as :BookingRouter
    participant S as :BookingService
    participant DB as :BookingRepo

    LT->>UI: Chọn lịch hẹn -> Check-in
    activate UI
    UI->>BFF: checkInCustomer(bookingId)
    activate BFF
    BFF->>API: POST /bookings/{id}/check-in
    activate API
    API->>S: update_status(id, 'IN_PROGRESS')
    activate S
    S->>DB: update_booking_status(id, 'IN_PROGRESS')
    activate DB
    DB-->>S: updated
    deactivate DB
    S-->>API: Success
    deactivate S
    API-->>BFF: 200 OK
    deactivate API
    BFF-->>UI: Update color (Green)
    deactivate BFF
    UI-->>LT: Hiển thị trạng thái "Đang phục vụ"
    deactivate UI
```

### 3.37. Xử lý thanh toán
Lễ tân kết thúc lịch hẹn và thu tiền.

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as :PaymentDialog
    participant BFF as :PaymentAction
    participant API as :PaymentRouter
    participant S as :PaymentService
    participant DB as :BookingRepo

    LT->>UI: Nhấn "Thanh toán"
    activate UI
    UI->>BFF: processPayment(bookingId, amount, method)
    activate BFF
    BFF->>API: POST /payments/checkout
    activate API
    API->>S: process_transaction(bookingId, amount)
    activate S

    S->>DB: create_invoice_record()
    S->>DB: update_booking_status(id, 'COMPLETED')
    activate DB
    DB-->>S: success
    deactivate DB

    S-->>API: InvoiceSchema
    deactivate S
    API-->>BFF: Success
    deactivate API
    BFF-->>UI: Show Receipt
    deactivate BFF
    UI-->>LT: Hoàn tất & In hóa đơn
    deactivate UI
```

## 4. Hoạt động Kỹ thuật viên (Technician Flows)

### 3.39. Xem lịch làm việc cá nhân

```mermaid
sequenceDiagram
    autonumber
    actor KTV as Kỹ thuật viên
    participant UI as :StaffApp
    participant BFF as :StaffAction
    participant API as :StaffRouter
    participant S as :StaffService
    participant DB as :BookingRepo

    KTV->>UI: Mở ứng dụng
    activate UI
    UI->>BFF: getMySchedule(date)
    activate BFF
    BFF->>API: GET /staff/me/schedule
    activate API
    API->>S: get_staff_bookings(current_user.id, date)
    activate S
    S->>DB: query_bookings_by_staff()
    activate DB
    DB-->>S: bookings[]
    deactivate DB
    S-->>API: ScheduleSchema
    deactivate S
    API-->>BFF: Data
    deactivate API
    BFF-->>UI: Data
    deactivate BFF
    UI-->>KTV: Hiển thị danh sách khách cần phục vụ
    deactivate UI
```

## 5. Hoạt động Quản trị viên (Admin Flows)

### 3.42. Quản lý dịch vụ (CRUD Service)

```mermaid
sequenceDiagram
    autonumber
    actor AD as Admin
    participant UI as :ServiceManagement
    participant BFF as :ServiceAction
    participant API as :ServiceRouter
    participant S as :ServiceService
    participant DB as :ServiceRepo

    AD->>UI: Thêm dịch vụ mới (Form)
    activate UI
    UI->>BFF: createService(payload)
    activate BFF
    BFF->>API: POST /services
    activate API
    API->>S: create_service(data)
    activate S
    S->>DB: insert_service(data)
    activate DB
    DB-->>S: service_record
    deactivate DB
    S-->>API: ServiceSchema
    deactivate S
    API-->>BFF: 201 Created
    deactivate API
    BFF-->>UI: Update List
    deactivate BFF
    UI-->>AD: Thông báo thành công
    deactivate UI
```

### 3.44. Quản lý tài nguyên (Phòng/Thiết bị)

```mermaid
sequenceDiagram
    autonumber
    actor AD as Admin
    participant UI as :ResourcePage
    participant BFF as :ResourceAction
    participant API as :ResourceRouter
    participant S as :ResourceService
    participant DB as :ResourceRepo

    AD->>UI: Sửa thông tin phòng
    activate UI
    UI->>BFF: updateResource(id, data)
    activate BFF
    BFF->>API: PUT /resources/{id}
    activate API
    API->>S: update_resource(id, data)
    activate S
    S->>DB: update(id, data)
    activate DB
    DB-->>S: updated_record
    deactivate DB
    S-->>API: ResourceSchema
    deactivate S
    API-->>BFF: Success
    deactivate API
    BFF-->>UI: Success
    deactivate BFF
    UI-->>AD: Cập nhật thành công
    deactivate UI
```

### 3.47. Cấu hình lịch làm việc nhân viên
Admin phân ca làm việc cho KTV.

```mermaid
sequenceDiagram
    autonumber
    actor AD as Admin
    participant UI as :StaffSchedulePage
    participant BFF as :StaffAction
    participant API as :StaffRouter
    participant S as :StaffService
    participant DB as :StaffRepo

    AD->>UI: Chọn KTV & Gán Ca (Sáng/Chiều)
    activate UI
    UI->>BFF: assignShift(staffId, date, shiftId)
    activate BFF
    BFF->>API: POST /staff/schedule
    activate API
    API->>S: assign_shift(staff_id, date, shift)
    activate S

    S->>S: validate_conflict(staff_id, date)

    S->>DB: insert_or_update_schedule()
    activate DB
    DB-->>S: success
    deactivate DB

    S-->>API: Success
    deactivate S
    API-->>BFF: Success
    deactivate API
    BFF-->>UI: Refresh Calendar
    deactivate BFF
    UI-->>AD: Cập nhật lịch thành công
    deactivate UI
```

### 3.53. Xem báo cáo doanh thu

```mermaid
sequenceDiagram
    autonumber
    actor AD as Admin
    participant UI as :ReportDashboard
    participant BFF as :ReportAction
    participant API as :AnalyticsRouter
    participant S as :AnalyticsService
    participant DB as :BookingRepo

    AD->>UI: Chọn khoảng thời gian báo cáo
    activate UI
    UI->>BFF: getRevenueReport(startDate, endDate)
    activate BFF
    BFF->>API: GET /analytics/revenue?start=..&end=..
    activate API
    API->>S: calculate_revenue(start, end)
    activate S

    S->>DB: aggregate_completed_bookings(start, end)
    activate DB
    DB-->>S: sum_amount
    deactivate DB

    S-->>API: ReportSchema
    deactivate S
    API-->>BFF: JSON Data
    deactivate API
    BFF-->>UI: Render Charts
    deactivate BFF
    UI-->>AD: Hiển thị biểu đồ doanh thu
    deactivate UI
```
