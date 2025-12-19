# Sơ đồ Tuần tự: Hoạt động Kỹ thuật viên (Chuẩn học thuật)

Tài liệu này trình bày các luồng thông tin phản hồi giữa Kỹ thuật viên và hệ thống trong quá trình phục vụ khách hàng.

---

### 3.1. Xem lịch phân công cá nhân (B2.1)

```mermaid
sequenceDiagram
    autonumber
    actor KTV as Kỹ thuật viên
    participant FE as Giao diện (Frontend)
    participant BE as Hệ thống (Backend)
    participant DB as Cơ sở dữ liệu

    KTV->>FE: yêu_cầu_xem_lịch_trình()
    activate FE
    FE->>BE: truy_vấn_lịch_làm_việc()
    activate BE
    BE->>DB: SELECT bookings WHERE staff_id = ?
    activate DB
    DB-->>BE: danh_sách_khách_hàng_phân_công
    deactivate DB
    BE-->>FE: dữ_liệu_lịch_trình
    deactivate BE
    FE-->>KTV: hiển_thị_danh_sách_chi_tiết
    deactivate FE
```

---

### 3.2. Ghi chú chuyên môn sau buổi hẹn (B2.3)

```mermaid
sequenceDiagram
    autonumber
    actor KTV as Kỹ thuật viên
    participant FE as Giao diện (Frontend)
    participant BE as Hệ thống (Backend)
    participant DB as Cơ sở dữ liệu

    KTV->>FE: nhập_ghi_chú_phục_vụ()
    activate FE
    FE->>BE: yêu_cầu_lưu_trình_trạng_khách()
    activate BE

    BE->>DB: lưu_ghi_chú (INSERT treatment_notes)
    Note right of DB: Dữ liệu được bảo vệ bằng chính sách RLS

    BE-->>FE: thông_báo_lưu_thành_công
    deactivate BE
    FE-->>KTV: hiển_thị_xác_nhận_hoàn_tất
    deactivate FE
```
