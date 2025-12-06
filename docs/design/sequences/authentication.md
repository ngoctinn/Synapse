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
    participant API as API Router
    participant S as Service (Logic)
    participant DB as Database

    KH->>UI: Nhập thông tin (email, password)
    activate UI
    UI->>BFF: registerUser(payload)
    activate BFF

    BFF->>API: POST /auth/register
    activate API

    API->>S: register_new_user(user_data)
    activate S

    S->>DB: get_user_by_email(email)
    activate DB
    DB-->>S: null (Người dùng chưa tồn tại)
    deactivate DB

    S->>S: hash_password(password)

    S->>DB: create_user(new_user)
    activate DB
    DB-->>S: user_record
    deactivate DB

    S->>S: send_verification_email(email)

    S-->>API: UserSchema
    deactivate S

    API-->>BFF: 201 Created
    deactivate API

    BFF-->>UI: Kết quả thành công
    deactivate BFF

    UI-->>KH: Hiển thị thông báo "Kiểm tra email"
    deactivate UI
```
**Hình 3.7: Sơ đồ tuần tự chức năng Đăng ký tài khoản khách hàng**

### 3.8. Xác thực email

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service (Logic)
    participant DB as Database

    KH->>UI: Truy cập liên kết xác thực
    activate UI
    UI->>BFF: verifyEmail(token)
    activate BFF

    BFF->>API: POST /auth/verify-email
    activate API

    API->>S: verify_user_email(token)
    activate S

    S->>DB: get_user_by_token(token)
    activate DB
    DB-->>S: user_record
    deactivate DB

    S->>DB: update_user_status(active=True)
    activate DB
    DB-->>S: updated_user
    deactivate DB

    S-->>API: Success Message
    deactivate S

    API-->>BFF: 200 OK
    deactivate API

    BFF-->>UI: Xác thực thành công
    deactivate BFF

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
    participant API as API Router
    participant S as Service (Logic)
    participant DB as Database

    KH->>UI: Nhập credentials (email, password)
    activate UI
    UI->>BFF: login(credentials)
    activate BFF

    BFF->>API: POST /auth/login
    activate API

    API->>S: authenticate_user(email, password)
    activate S

    S->>DB: get_user_with_password(email)
    activate DB
    DB-->>S: user_record
    deactivate DB

    S->>S: verify_password(input, hash)

    alt Mật khẩu không đúng
        S-->>API: Error (Invalid Credentials)
        API-->>BFF: 401 Unauthorized
        BFF-->>UI: Hiển thị lỗi thông tin đăng nhập
    else Mật khẩu hợp lệ
        S->>S: create_access_token(user_id)
        S-->>API: TokenSchema (JWT)
        deactivate S

        API-->>BFF: 200 OK
        deactivate API

        BFF->>BFF: store_cookie(session)
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
    participant API as API Router
    participant S as Service (Logic)
    participant DB as Database

    KH->>UI: Nhập email yêu cầu
    activate UI
    UI->>BFF: requestPasswordReset(email)
    activate BFF

    BFF->>API: POST /auth/forgot-password
    activate API

    API->>S: request_password_reset(email)
    activate S

    S->>DB: get_user_by_email(email)
    activate DB
    DB-->>S: user_record
    deactivate DB

    opt Người dùng tồn tại
        S->>S: generate_reset_token()
        S->>DB: save_reset_token(user_id, token)
        activate DB
        DB-->>S: success
        deactivate DB
        S->>S: send_reset_email(email, token)
    end

    S-->>API: Success Message
    deactivate S

    API-->>BFF: 200 OK
    deactivate API

    BFF-->>UI: Hiển thị thông báo
    deactivate BFF

    UI-->>KH: Thông báo kiểm tra email
    deactivate UI
```
**Hình 3.10: Sơ đồ tuần tự chức năng Quên mật khẩu**

### 3.11. Đặt lại mật khẩu

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service (Logic)
    participant DB as Database

    KH->>UI: Nhập mật khẩu mới
    activate UI
    UI->>BFF: resetPassword(token, newPass)
    activate BFF

    BFF->>API: POST /auth/reset-password
    activate API

    API->>S: reset_password(token, newPass)
    activate S

    S->>DB: validate_reset_token(token)
    activate DB
    DB-->>S: user_record
    deactivate DB

    S->>S: hash_password(newPass)
    S->>DB: update_password(user_id, hashedPass)
    activate DB
    DB-->>S: success
    deactivate DB

    S-->>API: Success Message
    deactivate S

    API-->>BFF: 200 OK
    deactivate API

    BFF-->>UI: Chuyển hướng Đăng nhập
    deactivate BFF

    UI-->>KH: Chuyển hướng đăng nhập
    deactivate UI
```
**Hình 3.11: Sơ đồ tuần tự chức năng Đặt lại mật khẩu**

### 3.12. Thay đổi mật khẩu khi đã đăng nhập

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant UI as Giao diện
    participant BFF as Server Action
    participant API as API Router
    participant S as Service (Logic)
    participant DB as Database

    KH->>UI: Nhập mật khẩu cũ & mới
    activate UI
    UI->>BFF: changePassword(old, new)
    activate BFF

    BFF->>API: POST /auth/change-password
    activate API

    API->>S: change_password(user_id, old, new)
    activate S

    S->>DB: get_user_password(user_id)
    activate DB
    DB-->>S: current_hash
    deactivate DB

    S->>S: verify_password(old, current_hash)

    alt Mật khẩu cũ sai
        S-->>API: Error (Wrong Password)
        API-->>BFF: 400 Bad Request
        BFF-->>UI: Hiển thị lỗi
    else Hợp lệ
        S->>S: hash_password(new)
        S->>DB: update_password(user_id, new_hash)
        activate DB
        DB-->>S: success
        deactivate DB
        S-->>API: Success
        deactivate S
        API-->>BFF: 200 OK
        deactivate API
        BFF-->>UI: Success
        deactivate BFF
        UI-->>KH: Thông báo thành công
        deactivate UI
    end
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
    participant S as Service (Logic)
    participant DB as Database

    KH->>UI: Sửa thông tin & Lưu
    activate UI
    UI->>BFF: updateProfile(data)
    activate BFF

    BFF->>API: PUT /users/me
    activate API

    API->>S: update_current_user(user_id, data)
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

    KH->>UI: Nhấn Đăng xuất
    activate UI
    UI->>BFF: logout()
    activate BFF

    BFF->>BFF: delete_cookie(session)
    BFF-->>UI: Chuyển hướng Đăng nhập
    deactivate BFF

    UI-->>KH: Trang đăng nhập
    deactivate UI
```
**Hình 3.14: Sơ đồ tuần tự chức năng Đăng xuất**
