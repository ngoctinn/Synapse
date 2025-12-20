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

### 3.28. Quản lý danh mục dịch vụ (C5)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    alt Thêm mới dịch vụ
        QTV->>UI: Thêm mới dịch vụ
        activate UI
        UI->>BE: create_service(data)
        activate BE
        BE->>DB: INSERT INTO services
        activate DB
        DB-->>BE: service_record
        deactivate DB
        BE-->>UI: Thành công
        deactivate BE
    else Cập nhật dịch vụ
        QTV->>UI: Chỉnh sửa thông tin
        activate UI
        UI->>BE: update_service(service_id, data)
        activate BE
        BE->>DB: UPDATE services SET ...
        activate DB
        DB-->>BE: updated_record
        deactivate DB
        BE-->>UI: Thành công
        deactivate BE
    else Vô hiệu hóa dịch vụ
        QTV->>UI: Yêu cầu vô hiệu hóa
        activate UI
        UI->>BE: deactivate_service(id)
        activate BE
        BE->>DB: UPDATE services SET deleted_at = NOW()
        activate DB
        DB-->>BE: success
        deactivate DB
        BE-->>UI: Thành công
        deactivate BE
    end
    UI-->>QTV: Cập nhật danh sách hiển thị
    deactivate UI
```
**Hình 3.28: Sơ đồ tuần tự chức năng Quản lý danh mục dịch vụ (CRUD)**

### 3.29. Quản lý tài nguyên (C7)

> **Lưu ý:** Theo thiết kế cơ sở dữ liệu, hệ thống quản lý tài nguyên theo 2 cấp:
> - **Nhóm tài nguyên** (Resource Group): Ví dụ: "Giường Spa Premium", "Máy Laser" (Loại: BED/EQUIPMENT)
> - **Tài nguyên** (Resource): Ví dụ: "Giường 01", "Máy Laser A"

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    alt Thêm mới tài nguyên
        QTV->>UI: Nhập thông tin tài nguyên mới
        activate UI
        UI->>BE: create_resource(data)
        activate BE
        BE->>DB: INSERT INTO resources
        activate DB
        DB-->>BE: resource_record
        deactivate DB
        BE-->>UI: Thành công
        deactivate BE
    else Cập nhật tài nguyên
        QTV->>UI: Sửa thông tin tài nguyên
        activate UI
        UI->>BE: update_resource(resource_id, data)
        activate BE
        BE->>DB: UPDATE resources SET ...
        activate DB
        DB-->>BE: updated_record
        deactivate DB
        BE-->>UI: Thành công
        deactivate BE
    else Vô hiệu hóa tài nguyên
        QTV->>UI: Chọn vô hiệu hóa
        activate UI
        UI->>BE: deactivate_resource(id)
        activate BE
        BE->>DB: UPDATE resources SET deleted_at = NOW()
        activate DB
        DB-->>BE: success
        deactivate DB
        BE-->>UI: Thành công
        deactivate BE
    end
    UI-->>QTV: Cập nhật danh sách hiển thị
    deactivate UI
```
**Hình 3.29: Sơ đồ tuần tự chức năng Quản lý tài nguyên (CRUD)**

### 3.30. Cấu hình lịch làm việc nhân viên (C4)

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
    UI->>BE: assign_shift(staff_id, schedule_data)
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
**Hình 3.30: Sơ đồ tuần tự chức năng Cấu hình lịch làm việc nhân viên**

---

### 3.31. Cấu hình giờ hoạt động Spa (C1)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Truy cập cấu hình giờ hoạt động
    activate UI
    UI->>BE: get_operating_hours()
    activate BE

    BE->>DB: SELECT * FROM regular_operating_hours
    activate DB
    DB-->>BE: operating_hours[]
    deactivate DB

    BE-->>UI: Hiển thị bảng giờ hoạt động
    deactivate BE

    QTV->>UI: Chỉnh sửa giờ mở/đóng cửa
    UI->>BE: update_operating_hours(data)
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
**Hình 3.31: Sơ đồ tuần tự chức năng Cấu hình giờ hoạt động Spa**

---

### 3.32. Quản lý ngày nghỉ lễ (C2)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Truy cập quản lý ngày ngoại lệ
    activate UI
    UI->>BE: get_exception_dates(year)
    activate BE

    BE->>DB: SELECT * FROM exception_dates WHERE YEAR(exception_date) = ?
    activate DB
    DB-->>BE: exception_dates[]
    deactivate DB

    BE-->>UI: Hiển thị danh sách ngày ngoại lệ
    deactivate BE

    QTV->>UI: Thêm ngày nghỉ lễ mới
    UI->>BE: create_exception_date(data)
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
**Hình 3.32: Sơ đồ tuần tự chức năng Quản lý ngày nghỉ lễ**

---

### 3.33. Mời nhân viên qua thư điện tử (C3)

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
    UI->>BE: invite_staff(email, role, full_name)
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
**Hình 3.33: Sơ đồ tuần tự chức năng Mời nhân viên qua thư điện tử**

---

### 3.34. Quản lý tài khoản nhân viên (C9)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Truy cập danh sách nhân viên
    activate UI
    UI->>BE: get_staff_list()
    activate BE

    BE->>DB: SELECT * FROM users WHERE role IN ('receptionist', 'technician')
    activate DB
    DB-->>BE: staff_list[]
    deactivate DB

    BE-->>UI: Hiển thị danh sách nhân viên
    deactivate BE

    alt Chỉnh sửa thông tin
        QTV->>UI: Chọn nhân viên và chỉnh sửa
        UI->>BE: update_staff(staff_id, data)
        BE->>DB: UPDATE users, staff_profiles
        BE-->>UI: Cập nhật thành công
    else Vô hiệu hóa tài khoản
        QTV->>UI: Chọn vô hiệu hóa nhân viên
        UI->>BE: deactivate_staff(staff_id)
        BE->>DB: UPDATE users SET is_active = false
        BE-->>UI: Vô hiệu hóa thành công
    end

    UI-->>QTV: Cập nhật danh sách
    deactivate UI
```
**Hình 3.34: Sơ đồ tuần tự chức năng Quản lý tài khoản nhân viên**

---

### 3.35. Cấu hình hệ thống (C10)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Truy cập cấu hình hệ thống
    activate UI
    UI->>BE: get_system_configurations()
    activate BE

    BE->>DB: SELECT * FROM system_configurations
    activate DB
    DB-->>BE: configs[]
    deactivate DB

    BE-->>UI: Hiển thị các tham số cấu hình
    deactivate BE

    QTV->>UI: Chỉnh sửa tham số
    UI->>BE: update_configuration(key, value)
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
**Hình 3.35: Sơ đồ tuần tự chức năng Cấu hình hệ thống**

---

### 3.36. Quản lý thẻ liệu trình (C6)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Truy cập quản lý gói liệu trình
    activate UI
    UI->>BE: get_service_packages()
    activate BE

    BE->>DB: SELECT * FROM service_packages
    activate DB
    DB-->>BE: packages[]
    deactivate DB

    BE-->>UI: Hiển thị danh sách gói
    deactivate BE

    alt Thêm gói mới
        QTV->>UI: Nhập thông tin gói (Tên, Giá, Số buổi, Hạn dùng)
        UI->>BE: create_service_package(data)
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
        UI->>BE: update_service_package(package_id, data)
        BE->>DB: UPDATE service_packages SET ...
        BE-->>UI: Cập nhật thành công
    else Vô hiệu hóa gói
        QTV->>UI: Chọn vô hiệu hóa
        UI->>BE: deactivate_package(id)
        BE->>DB: UPDATE service_packages SET is_active = false
        BE-->>UI: Đã vô hiệu hóa
    end

    UI-->>QTV: Cập nhật danh sách
    deactivate UI
```
**Hình 3.36: Sơ đồ tuần tự chức năng Quản lý thẻ liệu trình**

---

### 3.37. Quản lý chương trình khuyến mãi (C8)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    QTV->>UI: Truy cập quản lý khuyến mãi
    activate UI
    UI->>BE: get_promotions()
    activate BE

    BE->>DB: SELECT * FROM promotions
    activate DB
    DB-->>BE: promotions[]
    deactivate DB

    BE-->>UI: Hiển thị danh sách mã khuyến mãi
    deactivate BE

    alt Tạo mã khuyến mãi mới
        QTV->>UI: Nhập thông tin (Mã, Loại giảm, Giá trị, Hạn dùng)
        UI->>BE: create_promotion(data)
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
        UI->>BE: update_promotion(promotion_id, data)
        BE->>DB: UPDATE promotions SET ...
        BE-->>UI: Cập nhật thành công
    else Vô hiệu hóa mã
        QTV->>UI: Chọn vô hiệu hóa
        UI->>BE: deactivate_promotion(id)
        BE->>DB: UPDATE promotions SET is_active = false
        BE-->>UI: Đã vô hiệu hóa
    end

    UI-->>QTV: Cập nhật danh sách
    deactivate UI
```
**Hình 3.37: Sơ đồ tuần tự chức năng Quản lý chương trình khuyến mãi**

### 3.38. Tái lập lịch tự động khi có sự cố (B1.8)

```mermaid
sequenceDiagram
    autonumber
    participant SOLVER as Reschedule Solver
    participant BE as Backend
    participant DB as Database
    participant NOTI as Kênh thông báo

    Note over SOLVER: Phát hiện sự kiện (KTV nghỉ/Tài nguyên hỏng)
    SOLVER->>BE: trigger_auto_reschedule(event_data)
    activate BE

    BE->>DB: find_conflicting_bookings(resource_id, time_range)
    activate DB
    DB-->>BE: conflict_list[]
    deactivate DB

    loop Với mỗi Booking bị ảnh hưởng
        BE->>SOLVER: find_best_alternative(booking_id)
        activate SOLVER
        SOLVER-->>BE: alternative_option (New Staff/Time)
        deactivate SOLVER

        alt Tìm thấy phương án thay thế
            BE->>DB: update_booking_assignment()
            BE->>NOTI: notify_customer_rescheduled(booking_id)
        else Không tìm thấy (Critical)
            BE->>DB: mark_booking_manual_review()
            BE->>NOTI: notify_receptionist_manual_needed(booking_id)
        end
    end

    BE-->>SOLVER: Hoàn thành xử lý đợt
    deactivate BE
```
**Hình 3.38: Sơ đồ tuần tự chức năng Tái lập lịch tự động**

---
