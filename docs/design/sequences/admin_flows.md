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
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Thêm mới dịch vụ
    activate UI
    UI->>BE: createService(data)
    activate BE

    BE->>DB: INSERT INTO services
    activate DB
    DB-->>BE: service_record
    deactivate DB

    BE-->>UI: Cập nhật danh sách
    deactivate BE

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
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Nhập thông tin tài nguyên mới
    activate UI
    UI->>BE: createResource(data)
    activate BE

    BE->>DB: INSERT INTO resources (group_id, name, code, status, capacity)
    activate DB
    DB-->>BE: resource_record
    deactivate DB

    BE-->>UI: Cập nhật danh sách
    deactivate BE

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
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Sửa thông tin tài nguyên
    activate UI
    UI->>BE: updateResource(id, data)
    activate BE

    BE->>DB: UPDATE resources SET ... WHERE id = ?
    activate DB
    DB-->>BE: updated_record
    deactivate DB

    BE-->>UI: Thành công
    deactivate BE

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
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Chọn tài nguyên và vô hiệu hóa
    activate UI
    UI->>BE: deactivateResource(id)
    activate BE

    BE->>DB: UPDATE resources SET deleted_at = NOW() WHERE id = ?
    activate DB
    DB-->>BE: success
    deactivate DB

    BE-->>UI: Xóa khỏi danh sách
    deactivate BE

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
    participant BE as Backend
    participant SOLVER as Bộ giải ràng buộc
    participant DB as Database

    QTV->>UI: Phân ca cho kỹ thuật viên
    activate UI
    UI->>BE: assignShift(staffId, scheduleData)
    activate BE

    BE->>SOLVER: check_constraints(data)
    activate SOLVER
    note right of SOLVER: Kiểm tra ràng buộc lịch

    alt Vi phạm ràng buộc
        SOLVER-->>BE: Invalid
        BE-->>UI: Cảnh báo xung đột lịch
    else Hợp lệ
        SOLVER-->>BE: Valid
        deactivate SOLVER
        BE->>DB: INSERT INTO staff_schedules
        activate DB
        DB-->>BE: success
        deactivate DB
    end

    BE-->>UI: Làm mới danh sách
    deactivate BE

    UI-->>QTV: Hiển thị lịch đã phân công
    deactivate UI
```
**Hình 3.24: Sơ đồ tuần tự chức năng Cấu hình lịch làm việc nhân viên**

---

### 3.25. Cấu hình giờ hoạt động Spa (C1)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Truy cập cấu hình giờ hoạt động
    activate UI
    UI->>BE: getOperatingHours()
    activate BE

    BE->>DB: SELECT * FROM regular_operating_hours
    activate DB
    DB-->>BE: operating_hours[]
    deactivate DB

    BE-->>UI: Hiển thị bảng giờ hoạt động
    deactivate BE

    QTV->>UI: Chỉnh sửa giờ mở/đóng cửa
    UI->>BE: updateOperatingHours(data)
    activate BE

    BE->>DB: UPSERT regular_operating_hours
    activate DB
    DB-->>BE: success
    deactivate DB

    BE-->>UI: Cập nhật thành công
    deactivate BE

    UI-->>QTV: Hiển thị thông báo lưu thành công
    deactivate UI
```
**Hình 3.25: Sơ đồ tuần tự chức năng Cấu hình giờ hoạt động Spa**

---

### 3.26. Quản lý ngày nghỉ lễ (C2)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Truy cập quản lý ngày ngoại lệ
    activate UI
    UI->>BE: getExceptionDates(year)
    activate BE

    BE->>DB: SELECT * FROM exception_dates WHERE YEAR(exception_date) = ?
    activate DB
    DB-->>BE: exception_dates[]
    deactivate DB

    BE-->>UI: Hiển thị danh sách ngày ngoại lệ
    deactivate BE

    QTV->>UI: Thêm ngày nghỉ lễ mới
    UI->>BE: createExceptionDate(data)
    activate BE

    BE->>DB: INSERT INTO exception_dates
    activate DB
    Note over BE,DB: type: HOLIDAY, MAINTENANCE, hoặc SPECIAL_HOURS
    DB-->>BE: exception_record
    deactivate DB

    BE-->>UI: Thêm thành công
    deactivate BE

    UI-->>QTV: Hiển thị ngày ngoại lệ mới
    deactivate UI
```
**Hình 3.26: Sơ đồ tuần tự chức năng Quản lý ngày nghỉ lễ**

---

### 3.27. Mời nhân viên qua thư điện tử (C3)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant SUPA as Supabase Auth
    actor NV as Nhân viên mới

    QTV->>UI: Nhập email và thông tin nhân viên
    activate UI
    UI->>BE: inviteStaff(email, role, fullName)
    activate BE

    BE->>SUPA: inviteUserByEmail(email, metadata)
    activate SUPA
    Note over SUPA: metadata: { role, full_name }
    SUPA-->>BE: Invitation created
    deactivate SUPA

    BE-->>UI: Thư mời đã được gửi
    deactivate BE

    UI-->>QTV: Hiển thị thông báo thành công
    deactivate UI

    Note over SUPA,NV: Email chứa liên kết kích hoạt
    SUPA-->>NV: Gửi thư mời qua email
    NV->>SUPA: Nhấp liên kết và thiết lập mật khẩu
    Note over NV: Tài khoản được kích hoạt
```
**Hình 3.27: Sơ đồ tuần tự chức năng Mời nhân viên qua thư điện tử**

---

### 3.28. Quản lý tài khoản nhân viên (C9)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Truy cập danh sách nhân viên
    activate UI
    UI->>BE: getStaffList()
    activate BE

    BE->>DB: SELECT * FROM users WHERE role IN ('receptionist', 'technician')
    activate DB
    DB-->>BE: staff_list[]
    deactivate DB

    BE-->>UI: Hiển thị danh sách nhân viên
    deactivate BE

    alt Chỉnh sửa thông tin
        QTV->>UI: Chọn nhân viên và chỉnh sửa
        UI->>BE: updateStaff(staffId, data)
        BE->>DB: UPDATE users, staff_profiles
        BE-->>UI: Cập nhật thành công
    else Vô hiệu hóa tài khoản
        QTV->>UI: Chọn vô hiệu hóa nhân viên
        UI->>BE: deactivateStaff(staffId)
        BE->>DB: UPDATE users SET is_active = false
        BE-->>UI: Vô hiệu hóa thành công
    end

    UI-->>QTV: Cập nhật danh sách
    deactivate UI
```
**Hình 3.28: Sơ đồ tuần tự chức năng Quản lý tài khoản nhân viên**

---

### 3.29. Cấu hình hệ thống (C10)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Truy cập cấu hình hệ thống
    activate UI
    UI->>BE: getSystemConfigurations()
    activate BE

    BE->>DB: SELECT * FROM system_configurations
    activate DB
    DB-->>BE: configs[]
    deactivate DB

    BE-->>UI: Hiển thị các tham số cấu hình
    deactivate BE

    QTV->>UI: Chỉnh sửa tham số
    UI->>BE: updateConfiguration(key, value)
    activate BE

    BE->>DB: UPSERT system_configurations
    activate DB
    Note over BE,DB: key: reminder_hours_before, spa_name, v.v.
    DB-->>BE: success
    deactivate DB

    BE-->>UI: Lưu thành công
    deactivate BE

    UI-->>QTV: Hiển thị thông báo cập nhật thành công
    deactivate UI
```
**Hình 3.29: Sơ đồ tuần tự chức năng Cấu hình hệ thống**

---

### 3.30. Quản lý thẻ liệu trình (C6)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Truy cập quản lý gói liệu trình
    activate UI
    UI->>BE: getServicePackages()
    activate BE

    BE->>DB: SELECT * FROM service_packages
    activate DB
    DB-->>BE: packages[]
    deactivate DB

    BE-->>UI: Hiển thị danh sách gói
    deactivate BE

    alt Thêm gói mới
        QTV->>UI: Nhập thông tin gói (Tên, Giá, Số buổi, Hạn dùng)
        UI->>BE: createServicePackage(data)
        activate BE
        BE->>DB: INSERT INTO service_packages
        BE->>DB: INSERT INTO package_services (dịch vụ đính kèm)
        activate DB
        DB-->>BE: package_record
        deactivate DB
        BE-->>UI: Tạo thành công
        deactivate BE
    else Cập nhật gói
        QTV->>UI: Chỉnh sửa thông tin gói
        UI->>BE: updateServicePackage(id, data)
        BE->>DB: UPDATE service_packages SET ...
        BE-->>UI: Cập nhật thành công
    else Vô hiệu hóa gói
        QTV->>UI: Chọn vô hiệu hóa
        UI->>BE: deactivatePackage(id)
        BE->>DB: UPDATE service_packages SET is_active = false
        BE-->>UI: Đã vô hiệu hóa
    end

    UI-->>QTV: Cập nhật danh sách
    deactivate UI
```
**Hình 3.30: Sơ đồ tuần tự chức năng Quản lý thẻ liệu trình**

---

### 3.31. Quản lý chương trình khuyến mãi (C8)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Truy cập quản lý khuyến mãi
    activate UI
    UI->>BE: getPromotions()
    activate BE

    BE->>DB: SELECT * FROM promotions
    activate DB
    DB-->>BE: promotions[]
    deactivate DB

    BE-->>UI: Hiển thị danh sách mã khuyến mãi
    deactivate BE

    alt Tạo mã khuyến mãi mới
        QTV->>UI: Nhập thông tin (Mã, Loại giảm, Giá trị, Hạn dùng)
        UI->>BE: createPromotion(data)
        activate BE
        BE->>DB: INSERT INTO promotions
        activate DB
        Note over BE,DB: discount_type: PERCENTAGE hoặc FIXED_AMOUNT
        DB-->>BE: promotion_record
        deactivate DB
        BE-->>UI: Tạo thành công
        deactivate BE
    else Cập nhật mã
        QTV->>UI: Chỉnh sửa thông tin
        UI->>BE: updatePromotion(id, data)
        BE->>DB: UPDATE promotions SET ...
        BE-->>UI: Cập nhật thành công
    else Vô hiệu hóa mã
        QTV->>UI: Chọn vô hiệu hóa
        UI->>BE: deactivatePromotion(id)
        BE->>DB: UPDATE promotions SET is_active = false
        BE-->>UI: Đã vô hiệu hóa
    end

    UI-->>QTV: Cập nhật danh sách
    deactivate UI
```
**Hình 3.31: Sơ đồ tuần tự chức năng Quản lý chương trình khuyến mãi**

---
