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

### 3.26. Xem lịch làm việc cá nhân (B2.1)

```mermaid
sequenceDiagram
    autonumber
    actor KTV as Kỹ thuật viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    KTV->>UI: Truy cập lịch làm việc
    activate UI
    UI->>BE: getMySchedule(date)
    activate BE

    BE->>DB: query_bookings_by_staff_id
    activate DB
    DB-->>BE: booking_list
    deactivate DB

    BE-->>UI: Hiển thị lịch trình
    deactivate BE

    UI-->>KTV: Hiển thị danh sách khách hàng được phân công
    deactivate UI
```
**Hình 3.26: Sơ đồ tuần tự chức năng Xem lịch làm việc cá nhân**

### 3.27. Ghi chú chuyên môn sau buổi hẹn (B2.3)

```mermaid
sequenceDiagram
    autonumber
    actor KTV as Kỹ thuật viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    KTV->>UI: Chọn lịch hẹn đã hoàn thành
    activate UI
    UI->>BE: getBookingDetail(bookingId)
    BE-->>UI: Hiển thị thông tin lịch hẹn

    KTV->>UI: Nhập ghi chú chuyên môn
    UI->>BE: updateBookingNote(bookingId, noteData)
    activate BE

    BE->>DB: INSERT INTO treatment_notes
    activate DB
    Note over BE,DB: Truy cập được kiểm soát bởi RLS
    DB-->>BE: success
    deactivate DB

    BE-->>UI: Lưu thành công
    deactivate BE

    UI-->>KTV: Thông báo lưu ghi chú thành công
    deactivate UI
```
**Hình 3.27: Sơ đồ tuần tự chức năng Ghi chú chuyên môn sau buổi hẹn**
