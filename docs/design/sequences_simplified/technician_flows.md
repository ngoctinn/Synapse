# Sơ đồ Tuần tự Rút gọn: Hoạt động Kỹ thuật viên

Tài liệu này trình bày các sơ đồ tuần tự tối giản dành cho Kỹ thuật viên.

---

### 3.1. Xem lịch làm việc cá nhân (B2.1)

```mermaid
sequenceDiagram
    autonumber
    actor KTV as Kỹ thuật viên
    participant UI as Giao diện
    participant HT as Hệ thống

    KTV->>UI: Truy cập lịch làm việc
    UI->>HT: fetchData()
    HT-->>UI: Danh sách khách hàng được phân công
    UI-->>KTV: Hiển thị lịch trình
```

---

### 3.2. Ghi chú chuyên mốn sau buổi hẹn (B2.3)

```mermaid
sequenceDiagram
    autonumber
    actor KTV as Kỹ thuật viên
    participant UI as Giao diện
    participant HT as Hệ thống
    participant DB as Database

    KTV->>UI: Chọn lịch hẹn hoàn thành & Nhập ghi chú
    UI->>HT: updateTreatmentNote()

    HT->>DB: save_note()
    Note right of DB: Kiểm soát truy cập bằng RLS

    HT-->>UI: Lưu thành công
    UI-->>KTV: Thông báo hoàn tất
```
