# Sơ đồ Tuần tự: Hoạt động Lễ tân (Chuẩn học thuật)

Tài liệu này trình bày các luồng thông điệp cho công tác quản lý và vận hành Spa của nhân viên Lễ tân.

---

### 3.1. Tiếp nhận và Check-in khách hàng (B1.4)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant FE as Giao diện (Frontend)
    participant BE as Hệ thống (Backend)
    participant DB as Cơ sở dữ liệu

    LT->>FE: chọn_lịch_hẹn_và_checkin()
    activate FE
    FE->>BE: yêu_cầu_xác_nhận_khách_đến()
    activate BE

    critical Giao dịch đồng bộ
        BE->>DB: cập_nhật_trạng_thái_phục_vụ (IN_PROGRESS)
        Note right of DB: Tự động trừ buổi liệu trình trong thẻ (used_sessions)
        BE->>DB: lưu_vết_thời_gian_đến (check_in_time)
        activate DB
        DB-->>BE: xác_nhận_cập_nhật
        deactivate DB
    end

    BE-->>FE: trả_về_trạng_thái_mới
    deactivate BE
    FE-->>LT: hiển_thị_thông_báo_phục_vụ
    deactivate FE
```

---

### 3.2. Xử lý thanh toán và In hóa đơn (B1.5)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Lễ tân
    participant FE as Giao diện (Frontend)
    participant BE as Hệ thống (Backend)
    participant DB as Cơ sở dữ liệu

    LT->>FE: yêu_cầu_thanh_toán()
    activate FE
    FE->>BE: tổng_hợp_dữ_liệu_billing()
    activate BE

    critical Hoàn tất tài chính
        BE->>DB: tạo_hóa_đơn_mới (invoices)
        BE->>DB: đánh_dấu_lịch_hẹn_hoàn_tất (COMPLETED)
        activate DB
        DB-->>BE: dữ_liệu_hóa_đơn_đã_lưu
        deactivate DB
    end

    BE-->>FE: trả_về_thông_tin_hóa_đơn
    deactivate BE
    FE-->>LT: hiển_thị_hóa_đơn_và_lệnh_in
    deactivate FE
```

---

### 3.3. Tái lập lịch tự động (B1.8)

```mermaid
sequenceDiagram
    autonumber
    actor QTV as Quản trị viên
    participant FE as Giao diện (Frontend)
    participant BE as Hệ thống (Backend)
    participant DB as Cơ sở dữ liệu

    QTV->>FE: cập_nhật_lịch_nghỉ_nhân_viên()
    activate FE
    FE->>BE: thông_báo_nhân_sự_vắng_mặt()
    activate BE

    BE->>DB: truy_vấn_danh_sách_xung_đột()
    activate DB
    DB-->>BE: các_lịch_hẹn_bị_ảnh_hưởng
    deactivate DB

    loop Xử lý từng khách hàng
        BE->>BE: tìm_giải_pháp_tái_lập_lịch()
        alt Có KTV thay thế
            BE->>DB: cập_nhật_kỹ_ thuật_viên_mới
        else Cần dời giờ
            Note right of BE: Gửi đề xuất giờ mới cho khách hàng
        end
    end

    BE-->>FE: báo_cáo_kết_quả_tự_động
    deactivate BE
    FE-->>QTV: hiển_thị_trạng_thái_xử_lý_sự_cố
    deactivate FE
```
