# Sơ đồ Tuần tự Rút gọn: Hoạt động Lễ tân

Tài liệu này trình bày các sơ đồ tuần tự tối giản cho các quy trình nghiệp vụ của Lễ tân.

---

### 3.1. Quản lý lịch hẹn & Hồ sơ (B1.1, B1.2)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant HT as Hệ thống

    LT->>UI: Xem lịch hẹn / Tìm khách hàng
    UI->>HT: fetchData()
    HT-->>UI: Kết quả truy vấn

    alt Tạo mới khách hàng
        LT->>UI: Nhập thông tin khách mới
        UI->>HT: createCustomer()
        HT-->>UI: Hồ sơ đã tạo
    end
```

---

### 3.2. Tạo lịch hẹn thủ công (B1.3)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant HT as Hệ thống
    participant DB as Database

    LT->>UI: Nhập thông tin khách & dịch vụ
    UI->>HT: checkAvailability()
    Note right of HT: Hệ thống kiểm tra ràng buộc (SISF)
    HT-->>UI: Xác nhận khả dụng

    LT->>UI: Hoàn tất đặt lịch
    UI->>HT: createBooking()

    critical Giao dịch DB
        HT->>DB: save_booking_transaction()
        DB-->>HT: Success
    end

    HT-->>UI: Cập nhật Dashboard
    UI-->>LT: Hiển thị lịch mới
```

---

### 3.3. Xác nhận khách đến & Trừ liệu trình (B1.4)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant HT as Hệ thống
    participant DB as Database

    LT->>UI: Bấm "Check-in"
    UI->>HT: checkInCustomer()

    critical Cập nhật trạng thái & Liệu trình
        HT->>DB: update_booking_and_sessions()
        Note right of DB: Tự động trừ buổi nếu thuộc gói
        DB-->>HT: Updated
    end

    HT-->>UI: Đổi màu trạng thái
    UI-->>LT: Hiển thị "Đang phục vụ"
```

---

### 3.4. Xử lý thanh toán (B1.5)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant HT as Hệ thống
    participant DB as Database

    LT->>UI: Xác nhận thanh toán
    UI->>HT: processPayment()

    critical Hoàn tất hóa đơn
        HT->>DB: create_invoice_and_complete_booking()
        DB-->>HT: Invoice Created
    end

    HT-->>UI: Hiển thị hóa đơn điện tử
    UI-->>LT: In hóa đơn & Kết thúc
```

---

### 3.5. Phản hồi hỗ trợ trò chuyện (B1.6)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant HT as Hệ thống

    Note left of UI: Có yêu cầu hỗ trợ mới
    LT->>UI: Mở phiên trò chuyện
    UI->>HT: fetchChatHistory()
    HT-->>UI: Danh sách tin nhắn

    LT->>UI: Nhập và gửi phản hồi
    UI->>HT: sendMessage()
    HT-->>UI: Trạng thái: Đã gửi
```

---

### 3.6. Theo dõi tiến độ liệu trình (B1.7)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant UI as Giao diện
    participant HT as Hệ thống

    LT->>UI: Tra cứu liệu trình khách hàng
    UI->>HT: getCustomerTreatments()
    HT-->>UI: Dữ liệu (số buổi còn lại, lịch sử)
    UI-->>LT: Hiển thị thông tin
```

---

### 3.7. Tái lập lịch tự động (B1.8)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant HT as Hệ thống
    participant DB as Database

    QTV->>DB: Cập nhật lịch nghỉ nhân viên

    Note right of HT: Hệ thống quét các Booking bị ảnh hưởng

    loop Xử lý xung đột
        HT->>HT: findAlternative()
        alt Có phương án tốt nhất
            HT->>DB: update_booking()
            Note right of HT: Thông báo đổi KTV cho khách
        else Cần dời giờ / Thủ công
            Note right of HT: Đánh dấu cần xử lý thủ công
        end
    end

    HT-->>QTV: Báo cáo kết quả tái lập lịch
```
