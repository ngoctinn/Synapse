# Sơ đồ Tuần tự: Hoạt động Quản trị viên (Admin Flows)

Tài liệu này chứa các sơ đồ tuần tự cho phân hệ Quản trị viên.

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

## 1.1.5 Sơ đồ hoạt động cho quản trị viên

### 3.42. Quản lý dịch vụ

```mermaid
sequenceDiagram
    autonumber
    actor AD as Admin
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service
    participant DB as Database

    AD->>UI: Thêm mới dịch vụ
    activate UI
    UI->>BFF: createService
    activate BFF

    BFF->>API: POST /services
    activate API

    API->>S: create_service
    activate S

    S->>DB: insert_service
    activate DB
    DB-->>S: service_record
    deactivate DB

    S-->>API: ServiceSchema
    deactivate S

    API-->>BFF: 201 Created
    deactivate API

    BFF-->>UI: Cập nhật danh sách
    deactivate BFF

    UI-->>AD: Hiển thị dịch vụ mới
    deactivate UI
```
**Hình 3.42: Sơ đồ tuần tự chức năng Quản lý dịch vụ**

### 3.44. Quản lý tài nguyên

```mermaid
sequenceDiagram
    autonumber
    actor AD as Admin
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service
    participant DB as Database

    AD->>UI: Cập nhật thông tin phòng
    activate UI
    UI->>BFF: updateResource
    activate BFF

    BFF->>API: PUT /resources/{id}
    activate API

    API->>S: update_resource
    activate S

    S->>DB: update
    activate DB
    DB-->>S: updated_record
    deactivate DB

    S-->>API: ResourceSchema
    deactivate S

    API-->>BFF: OK
    deactivate API

    BFF-->>UI: Thành công
    deactivate BFF

    UI-->>AD: Cập nhật thành công
    deactivate UI
```
**Hình 3.44: Sơ đồ tuần tự chức năng Quản lý tài nguyên**

### 3.47. Cấu hình lịch làm việc nhân viên

```mermaid
sequenceDiagram
    autonumber
    actor AD as Admin
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service
    participant SOLVER as Bộ giải
    participant DB as Database

    AD->>UI: Phân ca cho nhân viên
    activate UI
    UI->>BFF: assignShift
    activate BFF

    BFF->>API: POST /staff/schedule
    activate API

    API->>S: assign_work_shift
    activate S

    S->>SOLVER: check_constraints
    activate SOLVER
    note right of SOLVER: Kiểm tra ràng buộc

    alt Vi phạm Ràng buộc Cứng
        SOLVER-->>S: Invalid
        S-->>API: Error
        API-->>BFF: Error
        BFF-->>UI: Cảnh báo xung đột
    else Hợp lệ
        SOLVER-->>S: Valid
        deactivate SOLVER
        S->>DB: save_schedule_record
        activate DB
        DB-->>S: success
        deactivate DB
    end

    S-->>API: Success
    deactivate S

    API-->>BFF: OK
    deactivate API

    BFF-->>UI: Làm mới danh sách
    deactivate BFF

    UI-->>AD: Hiển thị lịch đã phân công
    deactivate UI
```
**Hình 3.47: Sơ đồ tuần tự chức năng Cấu hình lịch làm việc nhân viên**

### 3.53. Xem báo cáo doanh thu

```mermaid
sequenceDiagram
    autonumber
    actor AD as Admin
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service
    participant DB as Database

    AD->>UI: Xem báo cáo tháng
    activate UI
    UI->>BFF: getRevenue
    activate BFF

    BFF->>API: GET /analytics/revenue
    activate API

    API->>S: calculate_monthly_revenue
    activate S

    S->>DB: aggregate_completed_invoices
    activate DB
    DB-->>S: total_revenue
    deactivate DB

    S-->>API: ReportSchema
    deactivate S

    API-->>BFF: Data
    deactivate API

    BFF-->>UI: Vẽ biểu đồ
    deactivate BFF

    UI-->>AD: Hiển thị biểu đồ báo cáo
    deactivate UI
```
**Hình 3.53: Sơ đồ tuần tự chức năng Xem báo cáo**

### 3.37. Xem báo cáo và tính hoa hồng (Staff Commission)

```mermaid
sequenceDiagram
    autonumber
    actor AD as Admin
    participant UI as :CommissionReportPage
    participant BFF as :ReportAction
    participant API as :AnalyticsRouter
    participant S as :AnalyticsService
    participant DB as :Database

    AD->>UI: Chọn tháng cần tính hoa hồng
    activate UI
    UI->>BFF: getCommissionReport(month, year)
    activate BFF

    BFF->>API: GET /analytics/commissions?month=..&year=..
    activate API

    API->>S: calculate_staff_commissions(month, year)
    activate S

    S->>DB: query_completed_bookings_with_staff_rate(month, year)
    activate DB
    DB-->>S: list_data (booking_price, commission_rate, staff_id)
    deactivate DB

    S->>S: aggregate_by_staff(list_data)
    note right of S: sum(price * rate) per staff

    S-->>API: CommissionReportSchema[]
    deactivate S

    API-->>BFF: Data JSON
    deactivate API

    BFF-->>UI: Hiển thị bảng tổng hợp hoa hồng
    deactivate BFF

    UI-->>AD: Hiển thị danh sách hoa hồng nhân viên
    deactivate UI
```
**Hình 3.37: Sơ đồ tuần tự chức năng Tính hoa hồng nhân viên**

