# Sơ đồ Tuần tự: Hoạt động Kỹ thuật viên

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

## Sơ đồ hoạt động cho Kỹ thuật viên

### 3.21. Xem lịch làm việc cá nhân (B2.1)

```mermaid
sequenceDiagram
    autonumber
    actor KTV as Kỹ thuật viên
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as ScheduleService
    participant DB as Database

    KTV->>UI: Truy cập lịch làm việc
    activate UI
    UI->>BFF: getMySchedule(date)
    activate BFF

    BFF->>API: GET /staff/me/schedule?date=...
    activate API

    API->>S: get_staff_schedule(staffId, date)
    activate S

    S->>DB: query_bookings_by_staff_id
    activate DB
    DB-->>S: booking_list
    deactivate DB

    S-->>API: ScheduleSchema
    deactivate S

    API-->>BFF: Data
    deactivate API

    BFF-->>UI: Hiển thị lịch trình
    deactivate BFF

    UI-->>KTV: Hiển thị danh sách khách hàng được phân công
    deactivate UI
```
**Hình 3.21: Sơ đồ tuần tự chức năng Xem lịch làm việc cá nhân**

### 3.22. Ghi chú chuyên môn sau buổi hẹn (B2.3)

```mermaid
sequenceDiagram
    autonumber
    actor KTV as Kỹ thuật viên
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as BookingService
    participant DB as Database

    KTV->>UI: Chọn lịch hẹn đã hoàn thành
    activate UI
    UI->>BFF: getBookingDetail(bookingId)
    BFF->>API: GET /bookings/{id}
    API-->>BFF: BookingSchema
    BFF-->>UI: Hiển thị thông tin lịch hẹn

    KTV->>UI: Nhập ghi chú chuyên môn
    UI->>BFF: updateBookingNote(bookingId, noteData)
    activate BFF

    BFF->>API: POST /bookings/{id}/notes
    activate API

    API->>S: add_treatment_note(bookingId, noteData)
    activate S

    S->>DB: INSERT INTO treatment_notes
    activate DB
    DB-->>S: success
    deactivate DB

    S-->>API: NoteSchema
    deactivate S

    API-->>BFF: 201 Created
    deactivate API

    BFF-->>UI: Lưu thành công
    deactivate BFF

    UI-->>KTV: Thông báo lưu ghi chú thành công
    deactivate UI
```
**Hình 3.22: Sơ đồ tuần tự chức năng Ghi chú chuyên môn sau buổi hẹn**
