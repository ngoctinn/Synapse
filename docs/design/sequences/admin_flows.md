# Sơ đồ Tuần tự: Hoạt động Quản trị viên

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

## Sơ đồ hoạt động cho Quản trị viên

### 3.22. Quản lý danh mục dịch vụ (C5)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as ServiceService
    participant DB as Database

    QTV->>UI: Thêm mới dịch vụ
    activate UI
    UI->>BFF: createService(data)
    activate BFF

    BFF->>API: POST /services
    activate API

    API->>S: create_service(data)
    activate S

    S->>DB: INSERT INTO services
    activate DB
    DB-->>S: service_record
    deactivate DB

    S-->>API: ServiceSchema
    deactivate S

    API-->>BFF: 201 Created
    deactivate API

    BFF-->>UI: Cập nhật danh sách
    deactivate BFF

    UI-->>QTV: Hiển thị dịch vụ mới
    deactivate UI
```
**Hình 3.22: Sơ đồ tuần tự chức năng Quản lý danh mục dịch vụ**

### 3.23. Quản lý tài nguyên (C7)

> **Lưu ý:** Theo thiết kế cơ sở dữ liệu, hệ thống quản lý tài nguyên theo 2 cấp:
> - **Nhóm tài nguyên** (Resource Group): Ví dụ: "Phòng VIP", "Phòng Thường", "Máy Laser"
> - **Tài nguyên** (Resource): Ví dụ: "Giường 1 - Phòng VIP", "Máy Laser A"

#### 3.23a. Thêm mới tài nguyên

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as ResourceService
    participant DB as Database

    QTV->>UI: Nhập thông tin tài nguyên mới
    activate UI
    UI->>BFF: createResource(data)
    activate BFF

    BFF->>API: POST /resources
    activate API

    API->>S: create_resource(data)
    activate S

    S->>DB: INSERT INTO resources (group_id, name, code, status, capacity)
    activate DB
    DB-->>S: resource_record
    deactivate DB

    S-->>API: ResourceSchema
    deactivate S

    API-->>BFF: 201 Created
    deactivate API

    BFF-->>UI: Cập nhật danh sách
    deactivate BFF

    UI-->>QTV: Hiển thị tài nguyên mới
    deactivate UI
```
**Hình 3.23a: Sơ đồ tuần tự chức năng Thêm mới tài nguyên**

#### 3.23b. Cập nhật tài nguyên

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as ResourceService
    participant DB as Database

    QTV->>UI: Sửa thông tin tài nguyên
    activate UI
    UI->>BFF: updateResource(id, data)
    activate BFF

    BFF->>API: PUT /resources/{id}
    activate API

    API->>S: update_resource(id, data)
    activate S

    S->>DB: UPDATE resources SET ... WHERE id = ?
    activate DB
    DB-->>S: updated_record
    deactivate DB

    S-->>API: ResourceSchema
    deactivate S

    API-->>BFF: 200 OK
    deactivate API

    BFF-->>UI: Thành công
    deactivate BFF

    UI-->>QTV: Hiển thị thông tin đã cập nhật
    deactivate UI
```
**Hình 3.23b: Sơ đồ tuần tự chức năng Cập nhật tài nguyên**

#### 3.23c. Vô hiệu hóa tài nguyên

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as ResourceService
    participant DB as Database

    QTV->>UI: Chọn tài nguyên và vô hiệu hóa
    activate UI
    UI->>BFF: deactivateResource(id)
    activate BFF

    BFF->>API: DELETE /resources/{id}
    activate API

    API->>S: soft_delete_resource(id)
    activate S

    S->>DB: UPDATE resources SET deleted_at = NOW() WHERE id = ?
    activate DB
    DB-->>S: success
    deactivate DB

    S-->>API: 204 No Content
    deactivate S

    API-->>BFF: OK
    deactivate API

    BFF-->>UI: Xóa khỏi danh sách
    deactivate BFF

    UI-->>QTV: Thông báo đã vô hiệu hóa
    deactivate UI
```
**Hình 3.23c: Sơ đồ tuần tự chức năng Vô hiệu hóa tài nguyên**

### 3.24. Cấu hình lịch làm việc nhân viên (C4)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as ScheduleService
    participant SOLVER as Bộ giải ràng buộc
    participant DB as Database

    QTV->>UI: Phân ca cho kỹ thuật viên
    activate UI
    UI->>BFF: assignShift(staffId, scheduleData)
    activate BFF

    BFF->>API: POST /staff/schedule
    activate API

    API->>S: assign_work_shift(staffId, data)
    activate S

    S->>SOLVER: check_constraints(data)
    activate SOLVER
    note right of SOLVER: Kiểm tra ràng buộc lịch

    alt Vi phạm ràng buộc
        SOLVER-->>S: Invalid
        S-->>API: Error
        API-->>BFF: Error
        BFF-->>UI: Cảnh báo xung đột lịch
    else Hợp lệ
        SOLVER-->>S: Valid
        deactivate SOLVER
        S->>DB: INSERT INTO staff_schedules
        activate DB
        DB-->>S: success
        deactivate DB
    end

    S-->>API: ScheduleSchema
    deactivate S

    API-->>BFF: 200 OK
    deactivate API

    BFF-->>UI: Làm mới danh sách
    deactivate BFF

    UI-->>QTV: Hiển thị lịch đã phân công
    deactivate UI
```
**Hình 3.24: Sơ đồ tuần tự chức năng Cấu hình lịch làm việc nhân viên**
