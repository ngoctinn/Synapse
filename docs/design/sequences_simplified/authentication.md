# Sơ đồ Tuần tự Rút gọn: Phân hệ Xác thực

Tài liệu này trình bày các sơ đồ tuần tự đã được tối giản, tập trung vào luồng nghiệp vụ chính phục vụ báo cáo học thuật.

---

### 3.1. Đăng ký tài khoản khách hàng (A1.1)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant HT as Hệ thống
    participant DB as Database

    KH->>UI: Nhập thông tin đăng ký
    UI->>HT: registerUser()

    Note right of HT: Xác thực & Tạo tài khoản qua Auth Service

    critical Lưu trữ hồ sơ
        HT->>DB: create_customer_profile()
        DB-->>HT: Thành công
    end

    HT-->>UI: Thông báo đăng ký thành công
    UI-->>KH: Hiển thị yêu cầu xác thực email
```

---

### 3.2. Xác thực thư điện tử (A1.1)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant HT as Hệ thống

    KH->>UI: Nhấp liên kết xác thực
    UI->>HT: verifyEmail()
    HT-->>UI: Xác thực thành công
    UI-->>KH: Chuyển hướng đăng nhập
```

---

### 3.3. Đăng nhập (A1.2)

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant UI as Giao diện
    participant HT as Hệ thống

    ND->>UI: Nhập thông tin đăng nhập
    UI->>HT: login()

    alt Thông tin hợp lệ
        HT-->>UI: Session (JWT) & Role
        UI-->>ND: Chuyển hướng Dashboard
    else Thông tin sai
        HT-->>UI: Báo lỗi xác thực
        UI-->>ND: Hiển thị thông báo lỗi
    end
```

---

### 3.4. Khôi phục & Đặt lại mật khẩu (A1.3)

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant UI as Giao diện
    participant HT as Hệ thống

    ND->>UI: Yêu cầu khôi phục mật khẩu
    UI->>HT: requestReset()
    HT-->>UI: Gửi email thành công

    ND->>UI: Nhập mật khẩu mới từ liên kết
    UI->>HT: updatePassword()
    HT-->>UI: Cập nhật thành công
    UI-->>ND: Thông báo hoàn tất
```

---

### 3.5. Cập nhật thông tin cá nhân (A1.4)

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant UI as Giao diện
    participant HT as Hệ thống

    ND->>UI: Thay đổi thông tin hồ sơ
    UI->>HT: updateProfile()

    HT->>HT: processRequest()

    HT-->>UI: Cập nhật thành công
    UI-->>ND: Hiển thị thông tin mới
```

---

### 3.6. Đăng xuất (A1.5)

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant UI as Giao diện
    participant HT as Hệ thống

    ND->>UI: Chọn đăng xuất
    UI->>HT: logout()
    HT-->>UI: Xóa phiên làm việc
    UI-->>ND: Chuyển hướng trang chủ
```
