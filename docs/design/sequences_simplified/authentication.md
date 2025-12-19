# Sơ đồ Tuần tự: Phân hệ Xác thực (Chuẩn học thuật)

Tài liệu này trình bày quy trình trao đổi thông điệp cho các chức năng xác thực, phân định rõ ranh giới giữa Frontend, Backend và Dịch vụ hạ tầng.

---

### 3.1. Đăng ký tài khoản khách hàng (A1.1)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant FE as Giao diện (Frontend)
    participant SUPA as Dịch vụ xác thực (Supabase)
    participant BE as Hệ thống (Backend)
    participant DB as Cơ sở dữ liệu

    KH->>FE: yêu_cầu_đăng_ký(email, password)
    activate FE
    FE->>SUPA: tạo_tài_khoản_mới()
    activate SUPA
    SUPA-->>FE: thông_báo_chờ_xác_thực_email
    deactivate SUPA

    FE->>BE: khởi_tạo_hồ_sơ_khách_hàng()
    activate BE
    critical Giao dịch lưu trữ
        BE->>DB: INSERT INTO customers (profile)
        activate DB
        DB-->>BE: hoàn_tất
        deactivate DB
    end
    BE-->>FE: phản_hồi_thành_công
    deactivate BE

    FE-->>KH: hiển_thị_thông_báo_thành_công
    deactivate FE
```

---

### 3.2. Đăng nhập hệ thống (A1.2)

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant FE as Giao diện (Frontend)
    participant SUPA as Dịch vụ xác thực (Supabase)

    ND->>FE: cung_cấp_thông_tin_đăng_nhập()
    activate FE
    FE->>SUPA: xác_thực_thông_tin()
    activate SUPA

    alt [Thông tin hợp lệ]
        SUPA-->>FE: trả_về_phiên_làm_việc (JWT)
        FE-->>ND: chuyển_hướng_đến_Dashboard
    else [Thông tin sai]
        SUPA-->>FE: thông_báo_lỗi_xác_thực
        deactivate SUPA
        FE-->>ND: hiển_thị_lỗi_đăng_nhập
    end
    deactivate FE
```

---

### 3.3. Cập nhật thông tin cá nhân (A1.4)

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant FE as Giao diện (Frontend)
    participant BE as Hệ thống (Backend)
    participant DB as Cơ sở dữ liệu

    ND->>FE: thay_đổi_thông_tin_hồ_sơ()
    activate FE
    FE->>BE: yêu_cầu_cập_nhật(data)
    activate BE
    BE->>DB: UPDATE users SET ... WHERE id = ?
    activate DB
    DB-->>BE: kết_quả_cập_nhật
    deactivate DB
    BE-->>FE: xác_nhận_thành_công
    deactivate BE
    FE-->>ND: hiển_thị_thông_tin_mới
    deactivate FE
```
