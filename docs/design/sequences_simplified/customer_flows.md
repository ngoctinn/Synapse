# Sequence Diagram: Customer Module (Simplified)

---

### 3.1. Tìm kiếm khung giờ thông minh (A2.4)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    KH->>FE: Chọn Dịch vụ & Ngày mong muốn
    activate FE
    FE->>BE: tìm_kiếm_khung_giờ_khả_dụng()
    activate BE

    par Truy vấn dữ liệu đầu vào
        BE->>DB: lấy_lịch_làm_việc_nhân_viên()
        BE->>DB: lấy_tình_trạng_tài_nguyên_phòng/giường()
        BE->>DB: lấy_danh_sách_lịch_hẹn_đã_có()
    end
    activate DB
    DB-->>BE: Trả về tập dữ liệu (Context Data)
    deactivate DB

    Note right of BE: Giải quyết bài toán lập lịch tối ưu (RCPSP)

    BE-->>FE: Danh sách khung giờ tối ưu (Slots)
    deactivate BE
    FE-->>KH: Hiển thị các Slots khả dụng trên giao diện
    deactivate FE
```

---

### 3.2. Hoàn tất đặt lịch hẹn (A2.5)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    KH->>FE: Xác nhận Đặt lịch (Confirm)
    activate FE
    FE->>BE: tạo_lịch_hẹn_mới(slot_id)
    activate BE

    critical Giao dịch ACID (Tính nguyên tử)
        BE->>DB: Kiểm tra xung đột (Xác nhận slot vẫn còn trống)
        activate DB
        DB-->>BE: Slot hợp lệ
        BE->>DB: INSERT INTO bookings
        BE->>DB: INSERT INTO booking_items
        DB-->>BE: Lịch hẹn được tạo thành công
        deactivate DB
    end

    Note right of BE: Kích hoạt Trigger gửi thông báo xác nhận

    BE-->>FE: Trả về Booking_ID & Trạng thái 'CONFIRMED'
    deactivate BE
    FE-->>KH: Hiển thị giao diện thành công
    deactivate FE
```

---

### 3.3. Quản lý và Hủy lịch hẹn (A3.1, A3.2)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    KH->>FE: Yêu cầu Xem lịch sử hoặc Hủy lịch
    activate FE
    FE->>BE: xử_lý_yêu_cầu()
    activate BE

    alt Hành động: Truy vấn lịch sử
        BE->>DB: SELECT * FROM bookings WHERE customer_id = ?
        activate DB
        DB-->>BE: Danh sách lịch hẹn
        deactivate DB
    else Hành động: Hủy lịch hẹn
        BE->>DB: lấy_thời_gian_lịch_hẹn()
        activate DB
        DB-->>BE: Thông tin lịch
        deactivate DB
        BE->>BE: kiểm_tra_chính_sách_hủy(thời_gian_hiện_tại)

        alt Hợp lệ (Ví dụ: trước 24h)
            BE->>DB: UPDATE booking_status = 'CANCELLED'
            BE->>DB: Giải phóng tài nguyên nhân viên & phòng
            BE-->>FE: Thông báo hủy thành công
        else Vi phạm chính sách
            BE-->>FE: Lỗi: Quá thời hạn hủy trực tuyến
        end
    end

    BE-->>FE: Phản hồi kết quả dữ liệu
    deactivate BE
    FE-->>KH: Cập nhật thông tin trên màn hình
    deactivate FE
```

---

### 3.4. Nhận thông báo nhắc lịch & Phản hồi (A3.3)

```mermaid
sequenceDiagram
    autonumber
    participant BE as Backend
    participant DB as Database
    actor KH as Khách hàng

    Note left of BE: Tác vụ nền (Cron Job) chạy định kỳ mỗi giờ
    BE->>DB: tìm_kiếm_lịch_hẹn_trong_khung_giờ_nhắc_nhở()
    activate DB
    DB-->>BE: Danh sách các lịch hẹn (Remind List)
    deactivate DB

    BE->>KH: Gửi thông báo nhắc lịch (Email/SMS)
    activate KH

    KH-->>BE: Phản hồi: Xác nhận sẽ đến
    deactivate KH
    activate BE
    BE->>DB: UPDATE bookings SET reminder_confirmed = true
    BE-->>KH: Ghi nhận phản hồi thành công
    deactivate BE
```
