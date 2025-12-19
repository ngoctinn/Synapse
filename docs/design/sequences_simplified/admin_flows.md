# Sơ đồ Tuần tự: Hoạt động Quản trị viên (Chuẩn học thuật)

Tài liệu này trình bày các luồng quản lý hệ thống cho Quản trị viên, bao gồm thiết lập tài nguyên và nhân sự.

---

### 3.1. Thiết lập Lịch làm việc nhân sự (C4)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant FE as Giao diện (Frontend)
    participant BE as Hệ thống (Backend)
    participant DB as Cơ sở dữ liệu

    QTV->>FE: cấu_hình_ca_làm_việc()
    activate FE
    FE->>BE: yêu_cầu_phân_ca(staff_id, schedule)
    activate BE

    BE->>BE: kiểm_tra_ràng_buộc_lịch_trình()
    Note right of BE: Module Solver kiểm tra xung đột thời gian

    alt [Lịch trình hợp lệ]
        BE->>DB: lưu_lịch_trình (INSERT staff_schedules)
        activate DB
        DB-->>BE: hoàn_tất
        deactivate DB
        BE-->>FE: thông_báo_thành_công
    else [Xảy ra xung đột]
        BE-->>FE: báo_lỗi_trùng_lịch (Conflict)
    end
    deactivate BE
    FE-->>QTV: cập_nhật_trạng_ thái_giao_diện
    deactivate FE
```

---

### 3.2. Quản lý Tài nguyên và Dịch vụ (C5, C7)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant FE as Giao diện (Frontend)
    participant BE as Hệ thống (Backend)
    participant DB as Cơ sở dữ liệu

    QTV->>FE: yêu_cầu_thay_đổi_danh_mục()
    activate FE
    FE->>BE: xử_lý_thông_tin_tài_nguyên()
    activate BE

    BE->>DB: cập_nhật_cơ_sở_dữ_liệu (SQL DML)
    activate DB
    DB-->>BE: kết_quả_thực_thi
    deactivate DB

    BE-->>FE: phản_hồi_thành_công
    deactivate BE
    FE-->>QTV: làm_mới_danh_sách_hiển_thị
    deactivate FE
```
