# Sequence Diagrams - Hệ Thống Synapse

Tài liệu này mô tả các luồng nghiệp vụ cốt lõi của hệ thống Synapse dưới dạng biểu đồ tuần tự (Sequence Diagram) đơn giản, tập trung vào tương tác giữa các vai trò người dùng và hệ thống.

## 1. Luồng Đặt Lịch Hẹn (Booking Flow)
Quy trình quan trọng nhất để đảm bảo không bị trùng lịch (Double Booking).

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontFamily': 'Times New Roman'}}}%%
sequenceDiagram
    autonumber
    actor User as Khách hàng / Lễ tân
    participant FE as Frontend (App/Web)
    participant BE as Backend API
    participant DB as Database

    Note over User, FE: Giai đoạn 1: Tìm kiếm khung giờ

    User->>FE: Chọn Dịch vụ & Kỹ thuật viên & Ngày
    FE->>BE: Gọi API lấy Slot trống (Get Available Slots)
    BE->>DB: Query lịch nhân viên & phòng
    DB-->>BE: Trả về dữ liệu lịch đã có

    Note right of BE: Thuật toán tìm khoảng trống<br/>trừ đi lịch bận & giờ nghỉ

    BE-->>FE: Danh sách các khung giờ khả dụng (Available Slots)
    FE-->>User: Hiển thị các giờ có thể đặt

    Note over User, FE: Giai đoạn 2: Xác nhận đặt

    User->>FE: Chọn khung giờ cụ thể & Bấm "Đặt lịch"
    FE->>BE: Gửi yêu cầu Đặt lịch (Create Appointment)

    Note right of BE: KHÓA (Lock) bản ghi để check trùng lần cuối

    alt Giờ vẫn còn trống
        BE->>DB: Tạo lịch hẹn (Status: Confirmed)
        DB-->>BE: Success
        BE-->>FE: Trả về thông tin vé đặt
        FE-->>User: Hiển thị thông báo thành công & Gửi Email/Zalo
    else Đã bị người khác đặt trước đó 1 giây
        BE-->>FE: Lỗi Conflict (409)
        FE-->>User: Thông báo: "Giờ này vừa có người đặt, vui lòng chọn giờ khác"
    end
```

## 2. Luồng Phục Vụ & Thanh Toán (Service & Payment Flow)
Quy trình diễn ra khi khách hàng đến Spa sử dụng dịch vụ.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontFamily': 'Times New Roman'}}}%%
sequenceDiagram
    autonumber
    actor Customer as Khách hàng
    actor Recep as Lễ tân
    actor Tech as Kỹ thuật viên
    participant System as Hệ thống Synapse

    Note over Customer, System: Bước 1: Check-in

    Customer->>Recep: Khách đến Spa
    Recep->>System: Tìm lịch hẹn & Bấm "Check-in"
    System-->>Recep: Cập nhật trạng thái: "Đã đến" (Arrived)
    System->>Tech: Gửi thông báo: "Khách của bạn đã đến!"

    Note over Customer, System: Bước 2: Thực hiện dịch vụ

    Tech->>Customer: Mời khách vào phòng
    Tech->>System: Bấm "Bắt đầu" trên app (Start Service)
    System-->>Recep: Dashboard hiển thị: "Đang phục vụ" (In-Progress)

    loop Trong quá trình làm
        Tech->>System: (Tùy chọn) Ghi chú tình trạng da/sức khỏe
    end

    Tech->>System: Bấm "Hoàn thành" (Finish)
    System-->>Recep: Thông báo: Dịch vụ kết thúc, chờ thanh toán

    Note over Customer, System: Bước 3: Thanh toán (Check-out)

    Customer->>Recep: Ra quầy thanh toán
    Recep->>System: Xem hóa đơn tạm tính
    Recep->>Customer: Xác nhận các dịch vụ & phụ thu (nếu có)
    Recep->>System: Xác nhận Thanh toán
    System->>System: Tích điểm khách hàng
    System-->>Recep: In hóa đơn & Hoàn tất quy trình
```

## 3. Luồng Xử Lý Hủy & Vắng Mặt (Cancel & No-Show Flow)
Quy trình xử lý khi lịch hẹn thay đổi hoặc khách không đến.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontFamily': 'Times New Roman'}}}%%
sequenceDiagram
    autonumber
    actor User as Khách hàng
    actor Admin as Lễ tân / Quản lý
    participant System as Hệ thống Synapse
    participant Job as Background Worker (Cron)

    rect rgb(255, 240, 240)
        Note right of User: Trường hợp A: Khách chủ động hủy
        User->>System: Yêu cầu Hủy lịch (qua App/Link)
        System->>System: Kiểm tra chính sách hủy (VD: trước 2 tiếng)
        alt Hủy hợp lệ
            System->>System: Cập nhật trạng thái: Cancelled
            System->>User: Thông báo hủy thành công
            System->>Admin: Thông báo slot đã trống
        else Hủy quá sát giờ
            System->>User: Từ chối hủy online (Vui lòng gọi Hotline)
        end
    end

    rect rgb(240, 240, 255)
        Note right of Job: Trường hợp B: Khách vắng mặt (No-Show)
        Job->>System: Chạy quét định kỳ (mỗi 15 phút)
        System->>System: Tìm các lịch quá giờ hẹn > 30p<br/>mà chưa Check-in
        System->>System: Cập nhật trạng thái: No-Show
        System->>User: Gửi thông báo phí phạt (nếu có)
        System->>Admin: Cảnh báo danh sách No-Show
    end
```
