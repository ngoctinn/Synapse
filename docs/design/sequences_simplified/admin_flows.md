# Sequence Diagram: Administrator Module (Simplified)

---

### 3.1. Quản lý phân ca nhân sự (C4)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị viên
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Admin->>FE: Chọn nhân viên & Phân ca làm việc
    activate FE
    FE->>BE: thiết_lập_phân_ca()
    activate BE

    BE->>BE: Giải quyết bài toán lập lịch tối ưu
    Note right of BE: Kiểm tra ràng buộc và ngày nghỉ của nhân viên

    alt Hợp lệ
        BE->>DB: INSERT INTO staff_schedules
        activate DB
        DB-->>BE: Lưu thành công
        deactivate DB
        BE-->>FE: Xác nhận hoàn tất
        FE-->>Admin: Hiển thị lịch trình mới
    else Trùng lịch
        BE-->>FE: Báo lỗi xung đột lịch (Conflict)
        FE-->>Admin: Hiển thị cảnh báo cho Admin
    end
    deactivate BE
    deactivate FE
```

---

### 3.2. Quản lý Tài nguyên & Bảo trì (C7)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị viên
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Admin->>FE: Cập nhật trạng thái Tài nguyên (Phòng/Giường)
    activate FE
    FE->>BE: cập_nhật_trạng_ thái_vận_hành()
    activate BE

    alt Chế độ Bảo trì
        BE->>DB: UPDATE resources SET status = 'MAINTENANCE'
        Note right of BE: Hệ thống tự động loại bỏ khỏi Slots tương lai
    else Xóa mềm (Vô hiệu hóa)
        BE->>DB: UPDATE resources SET is_active = false
    end

    activate DB
    DB-->>BE: Cập nhật DB thành công
    deactivate DB
    BE-->>FE: Xác nhận hoàn tất
    deactivate BE
    FE-->>Admin: Hiển thị trạng thái mới
    deactivate FE
```

---

### 3.3. Cấu hình gói Liệu trình & Khuyến mãi (C6, C8)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị viên
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Admin->>FE: Thiết lập Gói Liệu trình / Mã Khuyến mãi
    activate FE
    FE->>BE: khởi_tạo_chương_trình()
    activate BE

    BE->>DB: INSERT INTO packages / promotions
    activate DB
    DB-->>BE: Bản ghi đã được tạo
    deactivate DB

    BE-->>FE: Phản hồi thành công
    deactivate BE
    FE-->>Admin: Cập nhật danh sách hiển thị
    deactivate FE
```
