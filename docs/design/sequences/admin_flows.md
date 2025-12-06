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

### 3.42. Quản lý dịch vụ (CRUD Service)

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

    AD->>UI: Thêm mới dịc vụ
    activate UI
    UI->>BFF: createService(data)
    activate BFF

    BFF->>API: POST /services
    activate API

    API->>S: create_service(data)
    activate S

    S->>DB: insert_service(data)
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

### 3.44. Quản lý tài nguyên (Phòng/Thiết bị)

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
    UI->>BFF: updateResource(id, payload)
    activate BFF

    BFF->>API: PUT /resources/{id}
    activate API

    API->>S: update_resource(id, payload)
    activate S

    S->>DB: update(id, payload)
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
    participant DB as Database

    AD->>UI: Phân ca cho nhân viên
    activate UI
    UI->>BFF: assignShift(staffId, date, shiftId)
    activate BFF

    BFF->>API: POST /staff/schedule
    activate API

    API->>S: assign_work_shift(staffId, date, shift)
    activate S

    S->>SOLVER: check_soft_hard_constraints(staffId, date, shift)
    activate SOLVER
    note right of SOLVER: Kiểm tra ràng buộc (RCPSP)

    alt Vi phạm Ràng buộc Cứng
        SOLVER-->>S: Invalid (Hard Constraint)
        S-->>API: Error (Overlap/Capacity)
        API-->>BFF: Error
        BFF-->>UI: Cảnh báo xung đột
    else Hợp lệ (Thỏa mãn)
        SOLVER-->>S: Valid
        deactivate SOLVER
        S->>DB: save_schedule_record()
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
    UI->>BFF: getRevenue(month, year)
    activate BFF

    BFF->>API: GET /analytics/revenue
    activate API

    API->>S: calculate_monthly_revenue(month, year)
    activate S

    S->>DB: aggregate_completed_invoices(date_range)
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
