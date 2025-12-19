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
    participant BFF as Server Action
    participant SUPA as Supabase Auth
    participant API as API Router
    participant S as CustomerService
    participant DB as Database

    KH->>UI: Nhập thông tin đăng ký
    activate UI
    UI->>BFF: registerUser(payload)
    activate BFF

    BFF->>SUPA: signUp(email, password, metadata)
    activate SUPA
    alt Đăng ký thất bại
        SUPA-->>BFF: Error (địa chỉ thư điện tử đã tồn tại)
        BFF-->>UI: Hiển thị thông báo lỗi
    else Đăng ký thành công
        SUPA-->>BFF: User (id, email)
        deactivate SUPA

        Note over BFF,DB: Tạo hồ sơ khách hàng
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

        BFF-->>UI: Đăng ký thành công
        deactivate BFF

        UI-->>KH: Hiển thị thông báo kiểm tra thư điện tử
        deactivate UI
    end
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
    participant BFF as Server Action
    participant SUPA as Supabase Auth

    ND->>UI: Nhập thông tin đăng nhập
    activate UI
    UI->>BFF: login(credentials)
    activate BFF

    BFF->>SUPA: signInWithPassword(email, password)
    activate SUPA

    alt Thông tin không hợp lệ
        SUPA-->>BFF: Error (thông tin đăng nhập không chính xác)
        BFF-->>UI: Hiển thị thông báo lỗi
    else Xác thực thành công
        SUPA-->>BFF: Session (JWT)
        deactivate SUPA

        BFF->>BFF: Lưu Cookie phiên đăng nhập
        BFF-->>UI: Chuyển hướng theo vai trò
        deactivate BFF

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
    participant BFF as Server Action
    participant SUPA as Supabase Auth

    ND->>UI: Nhập địa chỉ thư điện tử
    activate UI
    UI->>BFF: forgotPasswordAction(email)
    activate BFF

    BFF->>SUPA: resetPasswordForEmail(email)
    activate SUPA
    SUPA-->>BFF: OK
    deactivate SUPA

    BFF-->>UI: Hiển thị thông báo
    deactivate BFF

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
    participant BFF as Server Action
    participant SUPA as Supabase Auth

    ND->>UI: Nhấp liên kết đặt lại và nhập mật khẩu mới
    activate UI
    UI->>BFF: updatePasswordAction(newPassword)
    activate BFF

    BFF->>SUPA: updateUser({ password: newPassword })
    activate SUPA
    SUPA-->>BFF: OK (đã cập nhật)
    deactivate SUPA

    BFF-->>UI: Thông báo thành công
    deactivate BFF

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
    participant BFF as Server Action
    participant API as API Router
    participant S as UserService
    participant DB as Database

    ND->>UI: Sửa thông tin và lưu
    activate UI
    UI->>BFF: updateProfile(data)
    activate BFF

    BFF->>API: PUT /users/me
    activate API

    API->>S: update_profile(current_user, data)
    activate S

    S->>DB: UPDATE users SET ... WHERE id = ?
    activate DB
    DB-->>S: updated_user
    deactivate DB

    S-->>API: UserSchema
    deactivate S

    API-->>BFF: 200 OK
    deactivate API

    BFF-->>UI: Cập nhật trạng thái
    deactivate BFF

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
    participant BFF as Server Action
    participant SUPA as Supabase Auth

    ND->>UI: Chọn đăng xuất
    activate UI
    UI->>BFF: logoutAction()
    activate BFF

    BFF->>SUPA: signOut()
    activate SUPA
    SUPA-->>BFF: OK
    deactivate SUPA

    BFF->>BFF: Xóa Cookie phiên đăng nhập
    BFF-->>UI: Chuyển hướng trang đăng nhập
    deactivate BFF

    UI-->>ND: Hiển thị trang đăng nhập
    deactivate UI
```
**Hình 3.7: Sơ đồ tuần tự chức năng Đăng xuất**
