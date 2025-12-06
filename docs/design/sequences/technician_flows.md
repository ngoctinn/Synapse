# Sơ đồ Tuần tự: Hoạt động Kỹ thuật viên (Technician Flows)

Tài liệu này chứa các sơ đồ tuần tự cho phân hệ Kỹ thuật viên.

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

## 1.1.4 Sơ đồ hoạt động cho kỹ thuật viên

### 3.39. Xem lịch làm việc cá nhân

```mermaid
sequenceDiagram
    autonumber
    actor KTV as Kỹ thuật viên
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service (Logic)
    participant DB as Database

    KTV->>UI: Truy cập ứng dụng
    activate UI
    UI->>BFF: getMySchedule(date)
    activate BFF

    BFF->>API: GET /staff/me/schedule
    activate API

    API->>S: get_staff_schedule(user_id, date)
    activate S

    S->>DB: query_bookings_by_staff_id(id, date)
    activate DB
    DB-->>S: booking_list
    deactivate DB

    S-->>API: ScheduleSchema
    deactivate S

    API-->>BFF: Data
    deactivate API

    BFF-->>UI: Hiển thị Lịch trình
    deactivate BFF

    UI-->>KTV: Hiển thị danh sách khách
    deactivate UI
```
**Hình 3.39: Sơ đồ tuần tự chức năng Xem lịch làm việc cá nhân**

### 3.40. Ghi chú buổi hẹn (Treatment Notes)

```mermaid
sequenceDiagram
    autonumber
    actor KTV as Kỹ thuật viên
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service (Logic)
    participant DB as Database

    KTV->>UI: Nhập ghi chú liệu trình
    activate UI
    UI->>BFF: updateBookingNote(id, note)
    activate BFF

    BFF->>API: POST /bookings/{id}/notes
    activate API

    API->>S: add_treatment_note(booking_id, content)
    activate S

    S->>DB: save_note(booking_id, content)
    activate DB
    DB-->>S: success
    deactivate DB

    S-->>API: Success
    deactivate S

    API-->>BFF: OK
    deactivate API

    BFF-->>UI: Đóng hộp thoại
    deactivate BFF

    UI-->>KTV: Lưu thành công
    deactivate UI
```
**Hình 3.40: Sơ đồ tuần tự chức năng Ghi chú buổi hẹn**
