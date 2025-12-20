# Sơ đồ Tuần tự: Phân hệ Xác thực

Tài liệu này chứa các sơ đồ tuần tự cho phân hệ Xác thực, tuân thủ quy chuẩn định dạng và kiến trúc Modular Monolith.

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

## Sơ đồ hoạt động cho Phân hệ Xác thực

### 3.1. Đăng ký tài khoản khách hàng (A1.1)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BE as Backend
    participant SUPA as Supabase Auth
    participant DB as Database

    KH->>UI: Nhập thông tin đăng ký
    activate UI
    UI->>BE: register_user(payload)
    activate BE

    BE->>SUPA: sign_up(email, password, metadata)
    activate SUPA
    SUPA-->>BE: Response (Xác nhận tiếp nhận)
    deactivate SUPA

    Note over BE,DB: Tạo hồ sơ khách hàng (Customer Profile)
    BE->>DB: INSERT INTO customers (user_id, full_name)
    activate DB
    DB-->>BE: customer
    deactivate DB

    BE-->>UI: Đăng ký thành công (Thông báo chung)
    deactivate BE

    UI-->>KH: Hiển thị thông báo kiểm tra thư điện tử
    deactivate UI
```
**Hình 3.1: Sơ đồ tuần tự chức năng Đăng ký tài khoản khách hàng**

> **Ghi chú:** Khi đăng ký thành công, hệ thống tự động tạo hồ sơ khách hàng (Customer Profile) để đảm bảo khách hàng có thể đặt lịch hẹn ngay sau khi xác thực thư điện tử.

### 3.2. Xác thực thư điện tử (A1.1)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant SUPA as Supabase Auth

    KH->>UI: Nhấp vào liên kết xác thực trong thư điện tử
    activate UI
    UI->>SUPA: Verify Token
    activate SUPA
    SUPA-->>UI: Redirect (đã xác thực)
    deactivate SUPA

    UI-->>KH: Chuyển hướng đến trang đăng nhập
    deactivate UI
```
**Hình 3.2: Sơ đồ tuần tự chức năng Xác thực thư điện tử**

### 3.3. Đăng nhập (A1.2)

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant UI as Giao diện
    participant BE as Backend
    participant SUPA as Supabase Auth

    ND->>UI: Nhập thông tin đăng nhập
    activate UI
    UI->>BE: login(credentials)
    activate BE

    BE->>SUPA: sign_in_with_password(email, password)
    activate SUPA

    alt Thông tin không hợp lệ
        SUPA-->>BE: Error (thông tin đăng nhập không chính xác)
        BE-->>UI: Hiển thị thông báo lỗi
    else Xác thực thành công
        SUPA-->>BE: Session (JWT)
        deactivate SUPA

        BE->>BE: Lưu Cookie phiên đăng nhập
        BE-->>UI: Chuyển hướng theo vai trò
        deactivate BE

        UI-->>ND: Chuyển hướng đến bảng điều khiển
        deactivate UI
    end
```
**Hình 3.3: Sơ đồ tuần tự chức năng Đăng nhập**

### 3.4. Khôi phục mật khẩu (A1.3)

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant UI as Giao diện
    participant BE as Backend
    participant SUPA as Supabase Auth

    ND->>UI: Nhập địa chỉ thư điện tử
    activate UI
    UI->>BE: forgot_password_action(email)
    activate BE

    BE->>SUPA: reset_password_for_email(email)
    activate SUPA
    SUPA-->>BE: OK
    deactivate SUPA

    BE-->>UI: Hiển thị thông báo
    deactivate BE

    UI-->>ND: Thông báo kiểm tra thư điện tử
    deactivate UI
```
**Hình 3.4: Sơ đồ tuần tự chức năng Khôi phục mật khẩu (Bước 1)**

### 3.5. Đặt lại mật khẩu từ thư điện tử (A1.3)

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant UI as Giao diện
    participant BE as Backend
    participant SUPA as Supabase Auth

    ND->>UI: Nhấp liên kết đặt lại và nhập mật khẩu mới
    activate UI
    UI->>BE: update_password_action(new_password)
    activate BE

    BE->>SUPA: update_user({ password: new_password })
    activate SUPA
    SUPA-->>BE: OK (đã cập nhật)
    deactivate SUPA

    BE-->>UI: Thông báo thành công
    deactivate BE

    UI-->>ND: Chuyển hướng đến bảng điều khiển
    deactivate UI
```
**Hình 3.5: Sơ đồ tuần tự chức năng Đặt lại mật khẩu (Bước 2)**

### 3.6. Cập nhật thông tin cá nhân (A1.4)

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant UI as Giao diện
    participant BE as Backend
    participant DB as Database

    ND->>UI: Sửa thông tin và lưu
    activate UI
    UI->>BE: update_profile(data)
    activate BE

    BE->>DB: UPDATE users SET ... WHERE id = ?
    activate DB
    DB-->>BE: updated_user
    deactivate DB

    BE-->>UI: Cập nhật trạng thái
    deactivate BE

    UI-->>ND: Hiển thị thông tin mới
    deactivate UI
```
**Hình 3.6: Sơ đồ tuần tự chức năng Cập nhật thông tin cá nhân**

### 3.7. Đăng xuất (A1.5)

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant UI as Giao diện
    participant BE as Backend
    participant SUPA as Supabase Auth

    ND->>UI: Chọn đăng xuất
    activate UI
    UI->>BE: logout_action()
    activate BE

    BE->>SUPA: sign_out()
    activate SUPA
    SUPA-->>BE: OK
    deactivate SUPA

    BE->>BE: Xóa Cookie phiên đăng nhập
    BE-->>UI: Chuyển hướng trang đăng nhập
    deactivate BE

    UI-->>ND: Hiển thị trang đăng nhập
    deactivate UI
```
**Hình 3.7: Sơ đồ tuần tự chức năng Đăng xuất**
