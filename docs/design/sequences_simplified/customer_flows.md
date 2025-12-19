# Sơ đồ Tuần tự Rút gọn: Hoạt động Khách hàng

Tài liệu này trình bày các sơ đồ tuần tự tối giản cho các luồng công việc của Khách hàng.

---

### 3.1. Xem & Đặt lịch dịch vụ (A2.1, A2.2)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant HT as Hệ thống

    KH->>UI: Truy cập danh sách/chi tiết dịch vụ
    UI->>HT: fetchData()
    HT-->>UI: Dữ liệu dịch vụ
    UI-->>KH: Hiển thị thông tin
```

---

### 3.2. Tìm kiếm khung giờ khả dụng (A2.4)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant HT as Hệ thống

    KH->>UI: Chọn dịch vụ & Ngày mong muốn
    UI->>HT: findAvailableSlots()

    Note right of HT: Thuật toán SISF kiểm tra ràng buộc

    HT-->>UI: Danh sách khung giờ trống
    UI-->>KH: Hiển thị Slots khả dụng
```

---

### 3.3. Hoàn tất đặt lịch hẹn (A2.5)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant HT as Hệ thống
    participant DB as Database

    KH->>UI: Xác nhận đặt lịch
    UI->>HT: createBooking()

    critical Đảm bảo tính nhất quán
        HT->>DB: execute_transaction()
        DB-->>HT: Booking Created
    end

    Note right of HT: Gửi thông báo xác nhận (Email/App)

    HT-->>UI: Thông báo thành công
    UI-->>KH: Hiển thị mã lịch hẹn
```

---

### 3.4. Tham gia danh sách chờ (A2.6)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant HT as Hệ thống

    KH->>UI: Đăng ký nhận tin khi có chỗ
    UI->>HT: joinWaitlist()
    HT-->>UI: Đăng ký thành công
    UI-->>KH: Thông báo xác nhận danh sách chờ
```

---

### 3.5. Hỗ trợ qua trò chuyện (A2.7)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant HT as Hệ thống
    participant DB as Database

    KH->>UI: Gửi tin nhắn yêu cầu hỗ trợ
    UI->>HT: sendMessage()

    HT->>DB: save_message()
    Note right of DB: Kiểm soát quyền truy cập bằng RLS

    HT-->>UI: Trạng thái: Đã gửi
    UI-->>KH: Chờ phản hồi từ lễ tân
```

---

### 3.6. Quản lý lịch hẹn cá nhân (A3.1, A3.2)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant HT as Hệ thống
    participant DB as Database

    KH->>UI: Truy cập lịch sử/Yêu cầu hủy
    UI->>HT: requestAction()

    alt Thao tác Hủy
        HT->>HT: checkPolicy()
        HT->>DB: update_status('CANCELLED')
    end

    HT-->>UI: Phản hồi kết quả
    UI-->>KH: Cập nhật giao diện
```

---

### 3.7. Nhận thông báo nhắc lịch (A3.3)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant HT as Hệ thống

    Note left of HT: Tác vụ nền định kỳ (Cron) kiểm tra lịch hẹn

    HT->>KH: Gửi thông báo nhắc lịch

    Note right of KH: Khách hàng phản hồi từ App/Email

    KH-->>HT: Xác nhận tham gia / Yêu cầu hủy
```

---

### 3.8. Gửi yêu cầu bảo hành (A3.6)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant HT as Hệ thống
    participant DB as Database

    KH->>UI: Nhập thông tin bảo hành
    UI->>HT: createWarrantyRequest()

    HT->>DB: save_warranty_ticket()

    HT-->>UI: Gửi yêu cầu thành công
    UI-->>KH: Thông báo chờ xử lý
```
