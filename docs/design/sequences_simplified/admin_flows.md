# Sơ đồ Tuần tự Rút gọn: Hoạt động Quản trị viên

Tài liệu này trình bày các sơ đồ tuần tự tối giản dành cho Quản trị viên.

---

### 3.1. Quản lý danh mục & Tài nguyên (C5, C7)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant HT as Hệ thống
    participant DB as Database

    QTV->>UI: Thêm/Sửa/Xóa Dịch vụ hoặc Tài nguyên
    UI->>HT: requestAction()

    HT->>DB: update_records()

    HT-->>UI: Cập nhật thành công
    UI-->>QTV: Hiển thị thông tin mới
```

---

### 3.2. Cấu hình lịch làm việc nhân viên (C4)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant HT as Hệ thống
    participant DB as Database

    QTV->>UI: Phân ca cho nhân viên
    UI->>HT: assignShift()

    HT->>HT: checkConstraints()
    Note right of HT: Bộ giải ràng buộc kiểm tra xung đột

    alt Hợp lệ
        HT->>DB: save_schedule()
        HT-->>UI: Thành công
        UI-->>QTV: Hiển thị lịch đã phân công
    else Vi phạm
        HT-->>UI: Báo lỗi xung đột
        UI-->>QTV: Hiển thị cảnh báo
    end
```
