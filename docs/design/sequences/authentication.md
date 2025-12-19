# Sơ đồ Tuần tự: Hệ thống Xác thực (Authentication)

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

## 1.1.1 Sơ đồ hoạt động cho hệ thống xác thực


### 3.7. Đăng ký tài khoản khách hàng

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant SUPA as Supabase Auth
    participant API as API Router
    participant S as CustomerService
    participant DB as Database

    KH->>UI: Nhập thông tin (email, password, name)
    activate UI
    UI->>BFF: registerUser(payload)
    activate BFF

    BFF->>SUPA: signUp(email, password, metadata)
    activate SUPA
    alt Đăng ký thất bại
        SUPA-->>BFF: Error (Email đã tồn tại)
        BFF-->>UI: Hiển thị lỗi
    else Đăng ký thành công
        SUPA-->>BFF: User (id, email)
        deactivate SUPA

        Note over BFF,DB: Tạo Customer Profile ngay sau khi tạo User
        BFF->>API: POST /customers
        activate API
        API->>S: create_customer_for_user(user_id, name)
        activate S
        S->>DB: INSERT INTO customers (user_id, full_name)
        activate DB
        DB-->>S: customer
        deactivate DB
        S-->>API: CustomerSchema
        deactivate S
        API-->>BFF: 201 Created
        deactivate API

        BFF-->>UI: Kết quả thành công
        deactivate BFF

        UI-->>KH: Hiển thị thông báo "Kiểm tra email để xác thực"
        deactivate UI
    end
```
**Hình 3.7: Sơ đồ tuần tự chức năng Đăng ký tài khoản khách hàng**

> **Ghi chú quan trọng:** Sơ đồ này đã được cập nhật để phản ánh thiết kế tách biệt `users` (tài khoản) và `customers` (hồ sơ CRM). Khi đăng ký thành công, hệ thống **tự động tạo Customer Profile** để đảm bảo khách hàng có thể đặt lịch ngay sau khi xác thực email.

### 3.8. Xác thực email

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant SUPA as Supabase Auth

    KH->>UI: Click link xác thực trong Email
    activate UI
    UI->>SUPA: Verify Token (Auto via Link)
    activate SUPA
    SUPA-->>UI: Redirect (Đã xác thực)
    deactivate SUPA

    UI-->>KH: Chuyển hướng trang đăng nhập
    deactivate UI
```
**Hình 3.8: Sơ đồ tuần tự chức năng Xác thực email**

### 3.9. Đăng nhập

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant SUPA as Supabase Auth

    KH->>UI: Nhập credentials (email, password)
    activate UI
    UI->>BFF: login(credentials)
    activate BFF

    BFF->>SUPA: signInWithPassword(email, password)
    activate SUPA

    alt Thông tin sai
        SUPA-->>BFF: Error (Invalid Credentials)
        BFF-->>UI: Hiển thị lỗi thông tin đăng nhập
    else Hợp lệ
        SUPA-->>BFF: Session (JWT)
        deactivate SUPA

        BFF->>BFF: Set Cookie (Session)
        BFF-->>UI: Chuyển hướng Dashboard
        deactivate BFF

        UI-->>KH: Chuyển hướng trang chủ
        deactivate UI
    end
```
**Hình 3.9: Sơ đồ tuần tự chức năng Đăng nhập**

### 3.10. Quên mật khẩu

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant SUPA as Supabase Auth

    KH->>UI: Nhập email yêu cầu
    activate UI
    UI->>BFF: forgotPasswordAction(email)
    activate BFF

    BFF->>SUPA: resetPasswordForEmail(email)
    activate SUPA
    SUPA-->>BFF: OK
    deactivate SUPA

    BFF-->>UI: Hiển thị thông báo
    deactivate BFF

    UI-->>KH: Thông báo kiểm tra email
    deactivate UI
```
**Hình 3.10: Sơ đồ tuần tự chức năng Quên mật khẩu**

### 3.11. Đặt lại mật khẩu (Từ Email)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant SUPA as Supabase Auth

    KH->>UI: Click Link Reset -> Nhập mật khẩu mới
    activate UI
    UI->>BFF: updatePasswordAction(newPass)
    activate BFF

    BFF->>SUPA: updateUser({ password: newPass })
    activate SUPA
    SUPA-->>BFF: OK (Updated)
    deactivate SUPA

    BFF-->>UI: Thông báo thành công
    deactivate BFF

    UI-->>KH: Chuyển hướng Dashboard
    deactivate UI
```
**Hình 3.11: Sơ đồ tuần tự chức năng Đặt lại mật khẩu**

### 3.12. Thay đổi mật khẩu (Khi đã Login)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant SUPA as Supabase Auth

    KH->>UI: Nhập mật khẩu mới
    activate UI
    UI->>BFF: updatePasswordAction(newPass)
    activate BFF

    BFF->>SUPA: updateUser({ password: newPass })
    activate SUPA
    SUPA-->>BFF: OK
    deactivate SUPA

    BFF-->>UI: Thành công
    deactivate BFF

    UI-->>KH: Thông báo cập nhật xong
    deactivate UI
```
**Hình 3.12: Sơ đồ tuần tự chức năng Thay đổi mật khẩu khi đã đăng nhập**

### 3.13. Cập nhật thông tin cá nhân

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service
    participant DB as Database

    KH->>UI: Sửa thông tin & Lưu
    activate UI
    UI->>BFF: updateProfile(data)
    activate BFF

    BFF->>API: PUT /users/me
    activate API

    API->>S: update_profile(current_user, data)
    activate S

    S->>DB: update_user(user_id, data)
    activate DB
    DB-->>S: updated_user
    deactivate DB

    S-->>API: UserSchema
    deactivate S

    API-->>BFF: 200 OK
    deactivate API

    BFF-->>UI: Cập nhật trạng thái
    deactivate BFF

    UI-->>KH: Hiển thị thông tin mới
    deactivate UI
```
**Hình 3.13: Sơ đồ tuần tự chức năng Cập nhật thông tin cá nhân**

### 3.14. Đăng xuất

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant SUPA as Supabase Auth

    KH->>UI: Nhấn Đăng xuất
    activate UI
    UI->>BFF: logoutAction()
    activate BFF

    BFF->>SUPA: signOut()
    activate SUPA
    SUPA-->>BFF: OK
    deactivate SUPA

    BFF->>BFF: Xóa Cookie
    BFF-->>UI: Chuyển hướng Đăng nhập
    deactivate BFF

    UI-->>KH: Trang đăng nhập
    deactivate UI
```
**Hình 3.14: Sơ đồ tuần tự chức năng Đăng xuất**
