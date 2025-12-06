# Sequence Diagrams - Hệ Thống Synapse

Tài liệu này mô tả chi tiết các luồng tương tác trong hệ thống Synapse, tuân thủ kiến trúc **Modular Monolith** (Next.js + FastAPI).

## 1. Luồng Đặt Lịch Hẹn (Booking Flow)
Mô tả quá trình khách hàng chọn dịch vụ, kỹ thuật viên và xác nhận lịch hẹn để tránh trùng lặp.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontFamily': 'Times New Roman'}}}%%
sequenceDiagram
    autonumber
    actor User as Khách hàng
    participant View as :BookingDialog
    participant Action as :BookingAction
    participant Router as :BookingRouter
    participant Service as :BookingService
    participant DB as Database

    Note over User, View: Giai đoạn 1: Tìm kiếm slot trống

    User->>View: Chọn Dịch vụ, KTV & Ngày
    View->>Action: getAvailableSlots()
    Action->>Router: GET /api/slots
    Router->>Service: getAvailability()
    Service->>DB: querySchedules()
    DB-->>Service: return ExistingBookings

    Service->>Service: calculateFreeSlots()

    Service-->>Router: return Slots
    Router-->>Action: return JSON
    Action-->>View: return List<Slot>
    View-->>User: Hiển thị các khung giờ trống

    Note over User, View: Giai đoạn 2: Xác nhận đặt lịch

    User->>View: Chọn giờ & Bấm "Đặt lịch"
    View->>Action: createAppointment()
    Action->>Router: POST /api/appointments
    Router->>Service: createAppointment()

    Note right of Service: Kiểm tra logic nghiệp vụ & Khóa (Lock)

    alt Slot còn trống
        Service->>DB: insertAppointment(CONFIRMED)
        DB-->>Service: Success
        Service-->>Router: return Appointment
        Router-->>Action: return Success
        Action-->>View: return Success
        View-->>User: Thông báo đặt lịch thành công
    else Slot đã bị đặt
        Service-->>Router: raise ConflictError
        Router-->>Action: return 409 Conflict
        Action-->>View: return Error
        View-->>User: Thông báo: "Giờ này vừa có người đặt"
    end
```

## 2. Luồng Phục Vụ & Thanh Toán (Service & Payment)
Quy trình vận hành tại Spa từ lúc khách đến (Check-in) cho đến khi thanh toán (Check-out).

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontFamily': 'Times New Roman'}}}%%
sequenceDiagram
    autonumber
    actor Customer as Khách hàng
    actor Recep as Lễ tân
    actor Tech as Kỹ thuật viên
    participant View as :DashboardPage
    participant Action as :ServiceAction
    participant Router as :ServiceRouter
    participant Service as :ServiceService
    participant DB as Database

    Note over Customer, View: Bước 1: Check-in

    Customer->>Recep: Khách đến Spa
    Recep->>View: Chọn lịch & Bấm "Check-in"
    View->>Action: checkInCustomer()
    Action->>Router: POST /api/check-in
    Router->>Service: processCheckIn()
    Service->>DB: updateStatus(ARRIVED)
    Service-->>Tech: Gửi Notify: "Khách đã đến"

    Note over Tech, DB: Bước 2: Thực hiện dịch vụ

    Tech->>View: Bấm "Bắt đầu" (Mobile)
    View->>Action: startService()
    Action->>Router: POST /api/start
    Router->>Service: startService()
    Service->>DB: updateStatus(IN_PROGRESS)

    Note right of Tech: ...Thực hiện liệu trình...

    Tech->>View: Bấm "Hoàn thành"
    View->>Action: finishService()
    Action->>Router: POST /api/finish
    Router->>Service: endService()
    Service->>DB: updateStatus(COMPLETED)

    Note over Customer, DB: Bước 3: Thanh toán

    Recep->>View: Tạo hóa đơn
    View->>Action: createInvoice()
    Action->>Router: POST /api/invoices
    Router->>Service: calculateTotal()
    Service->>DB: saveInvoice() & addLoyaltyPoints()
    Service-->>View: return InvoiceData
    Recep->>Customer: Thu tiền & In hóa đơn
```

## 3. Luồng Xử Lý Hủy & Vắng Mặt (Cancel & No-Show)
Xử lý các trường hợp ngoại lệ khi lịch hẹn bị hủy hoặc khách không đến.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontFamily': 'Times New Roman'}}}%%
sequenceDiagram
    autonumber
    actor User as Khách hàng
    participant View as :HistoryPage
    participant Action as :BookingAction
    participant Router as :BookingRouter
    participant Service as :BookingService
    participant DB as Database
    participant Job as :CronJob

    rect rgb(255, 245, 245)
        Note right of User: Trường hợp A: Hủy chủ động
        User->>View: Bấm "Hủy lịch"
        View->>Action: cancelAppointment()
        Action->>Router: POST /api/cancel
        Router->>Service: cancelAppointment()
        Service->>Service: validateCancellationPolicy()

        alt Hủy hợp lệ (Trước giờ G)
            Service->>DB: updateStatus(CANCELLED)
            Service-->>Action: return Success
            View-->>User: Hủy thành công
        else Hủy quá muộn
            Service-->>Action: raise ValidationError
            View-->>User: Thông báo: "Không thể hủy sát giờ"
        end
    end

    rect rgb(245, 245, 255)
        Note right of Job: Trường hợp B: No-Show (Tự động)
        Job->>Router: Trigger Scan (Định kỳ 15p)
        Router->>Service: scanNoShow()
        Service->>DB: selectOverdueAppointments()
        DB-->>Service: List<Appt>

        loop Với mỗi lịch quá hạn
            Service->>DB: updateStatus(NO_SHOW)
            Service->>DB: applyPenalty() (Nếu có)
            Service->>User: Gửi Notify/Email thông báo
        end
    end
```
