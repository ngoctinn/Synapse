# Sơ đồ Tuần tự: Hoạt động Khách hàng (Chuẩn học thuật)

Tài liệu này chi tiết hóa trình tự liên lạc giữa các tác nhân và thành phần hệ thống cho các nghiệp vụ dành cho Khách hàng.

---

### 3.1. Tìm kiếm và Lựa chọn khung giờ (A2.4)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant FE as Giao diện (Frontend)
    participant BE as Hệ thống (Backend)
    participant DB as Cơ sở dữ liệu

    KH->>FE: chọn_dịch_ vụ_và_ngày()
    activate FE
    FE->>BE: yêu_cầu_tìm_khung_giờ_khả_dụng()
    activate BE

    BE->>DB: truy_vấn_dữ_liệu_tài_nguyên()
    activate DB
    DB-->>BE: trả_về_dữ_liệu_trống
    deactivate DB

    Note right of BE: Thực hiện thuật toán SISF (RCPSP & Jain's Fairness)

    BE-->>FE: danh_sách_khung_giờ_tối_ưu
    deactivate BE
    FE-->>KH: hiển_thị_kết_quả_cho_khách_hàng
    deactivate FE
```

---

### 3.2. Hoàn tất đặt lịch hẹn (A2.5)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant FE as Giao diện (Frontend)
    participant BE as Hệ thống (Backend)
    participant DB as Cơ sở dữ liệu

    KH->>FE: xác_nhận_thanh_toán_và_đặt_lịch()
    activate FE
    FE->>BE: yêu_cầu_tạo_lịch_hẹn()
    activate BE

    critical Giao dịch ACID (Atomic)
        BE->>DB: kiểm_tra_xung_đột_giờ_chót (Exclusion)
        BE->>DB: ghi_dữ_liệu_lịch_hẹn (INSERT bookings)
        activate DB
        DB-->>BE: xác_nhận_lưu_thành_công
        deactivate DB
    end

    Note right of BE: Kích hoạt gửi thông báo qua Email/SMS

    BE-->>FE: mã_số_lịch_hẹn_và_trạng_thái
    deactivate BE
    FE-->>KH: hiển_thị_thông_báo_hoàn_tất
    deactivate FE
```

---

### 3.3. Hỗ trợ qua trò chuyện (A2.7)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant FE as Giao diện (Frontend)
    participant BE as Hệ thống (Backend)
    participant DB as Cơ sở dữ liệu

    KH->>FE: gửi_tin_nhắn_tư_vấn()
    activate FE
    FE->>BE: chuyển_tiếp_tin_nhắn()
    activate BE

    BE->>DB: lưu_trữ_tin_nhắn (INSERT chat_messages)
    Note right of DB: Phân quyền truy cập theo RLS chính sách

    BE-->>FE: trạng_thái_đã_gửi
    deactivate BE
    FE-->>KH: cập_nhật_khung_trò_chuyện
    deactivate FE
```

---

### 3.4. Quản lý và Hủy lịch hẹn (A3.1, A3.2)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant FE as Giao diện (Frontend)
    participant BE as Hệ thống (Backend)
    participant DB as Cơ sở dữ liệu

    KH->>FE: yêu_cầu_hủy_lịch_hẹn()
    activate FE
    FE->>BE: kiểm_tra_điều_kiện_hủy()
    activate BE

    alt [Trong thời hạn cho phép]
        BE->>DB: cập_nhật_trạng_thái_hủy (CANCELLED)
        activate DB
        DB-->>BE: hoàn_tất_cập_nhật
        deactivate DB
        BE-->>FE: thông_báo_hủy_thành_công
    else [Quá hạn quy định]
        BE-->>FE: từ_chối_hủy (Vi phạm chính sách)
    end
    deactivate BE
    FE-->>KH: hiển_thị_kết_quả_thực_hiện
    deactivate FE
```
