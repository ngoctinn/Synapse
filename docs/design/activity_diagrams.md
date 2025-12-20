# Tổng hợp Sơ đồ Hoạt động (Activity Diagrams) - Synapse

Tài liệu này mô tả các luồng nghiệp vụ cấp hệ thống (Business Process Flows), tập trung vào tương tác giữa các tác nhân và trách nhiệm của hệ thống.

---

## 1. Phân hệ Xác thực (Authentication)

### 1.1. Quy trình Đăng ký tài khoản khách hàng (A1.1)
Mô tả luồng nghiệp vụ từ khi khách hàng tạo tài khoản đến khi kích hoạt.

```mermaid
flowchart TD
    subgraph KhachHang ["Khách hàng"]
        Start([Bắt đầu]) --> Input[Nhập thông tin Đăng ký]
        ClickLink[Click Link xác thực trong Email]
    end

    subgraph HeThong ["Hệ thống"]
        Input --> CreateProfile[Khởi tạo Hồ sơ người dùng\nTrạng thái: Chờ kích hoạt]
        CreateProfile --> SendEmail[Gửi Email xác thực]
        SendEmail --> Notify[Hiển thị thông báo kiểm tra Email]

        ClickLink --> Verify{Kiểm tra Token}
        Verify -- "[Hợp lệ]" --> Activate[Kích hoạt tài khoản]
        Verify -- "[Không hợp lệ]" --> Error[Hiển thị thông báo lỗi]

        Activate --> Redirect[Chuyển hướng trang Đăng nhập]
    end

    Redirect --> End([Kết thúc])
    Error --> End
```

### 1.2. Quy trình Đăng nhập hệ thống (A1.2)
Mô tả luồng xác thực người dùng và điều hướng theo vai trò.

```mermaid
flowchart TD
    subgraph NguoiDung ["Người dùng"]
        Start([Bắt đầu]) --> Input[Nhập Email và Mật khẩu]
    end

    subgraph HeThong ["Hệ thống"]
        Input --> Auth{Xác thực thông tin}
        Auth -- "[Thông tin sai]" --> ShowError[Hiển thị thông báo lỗi]
        Auth -- "[Thông tin đúng]" --> Access[Cấp quyền truy cập]

        Access --> RoleCheck[Điều hướng về Dashboard tương ứng]
    end

    RoleCheck --> End([Kết thúc])
    ShowError --> End
```

---

## 2. Phân hệ Khách hàng (Customer)

### 2.1. Quy trình Đặt lịch hẹn trực tuyến (A2.4, A2.5)
Mô tả quy trình tìm kiếm và xác nhận lịch hẹn từ phía khách hàng.

```mermaid
flowchart TD
    subgraph KhachHang ["Khách hàng"]
        Start([Bắt đầu]) --> SelectService[Chọn Dịch vụ & Ngày]
        SelectSlot[Chọn khung giờ & Nhân viên]
        ConfirmBooking[Xác nhận đặt lịch]
        Pay[Thực hiện thanh toán đặt cọc]
        JoinWaitlist[Đăng ký vào Danh sách chờ]
    end

    subgraph HeThong ["Hệ thống"]
        SelectService --> Search[Tính toán các khung giờ khả dụng]
        Search --> SlotAvailability{Có chỗ trống?}

        SlotAvailability -- "[Hết chỗ]" --> Suggest[Đề xuất tham gia danh sách chờ]
        SlotAvailability -- "[Còn chỗ]" --> ShowSlots[Hiển thị danh sách khung giờ]

        Suggest --> JoinWaitlist
        JoinWaitlist --> End([Kết thúc])

        ShowSlots --> SelectSlot
        SelectSlot --> Hold[Giữ chỗ tạm thời]
        Hold --> ConfirmBooking

        ConfirmBooking --> Policy{Yêu cầu đặt cọc?}
        Policy -- "[Có]" --> Pay
        Policy -- "[Không]" --> CreateBooking[Tạo lịch hẹn: Đã xác nhận]

        Pay --> PayVerify{Thành công?}
        PayVerify -- "[Có]" --> CreateBooking
        PayVerify -- "[Không]" --> Release[Hủy giữ chỗ & Báo lỗi]

        CreateBooking --> SendNoti[Gửi thông báo xác nhận]
    end

    SendNoti --> End
    Release --> End
```

### 2.2. Quy trình Hủy lịch hẹn (A3.2)
Kiểm soát hành vi hủy lịch theo chính sách của Spa.

```mermaid
flowchart TD
    subgraph KhachHang ["Khách hàng"]
        Start([Bắt đầu]) --> SelectBooking[Chọn lịch hẹn cần hủy]
        SelectBooking --> RequestCancel[Gửi yêu cầu hủy]
        FinalConfirm{Xác nhận lần cuối?}
    end

    subgraph HeThong ["Hệ thống"]
        RequestCancel --> PolicyCheck{Trong thời hạn cho phép?}

        PolicyCheck -- "[Quá hạn]" --> Alert[Thông báo lỗi chính sách]
        PolicyCheck -- "[Hợp lệ]" --> Terms[Hiển thị điều kiện hoàn phí]

        Terms --> FinalConfirm
        FinalConfirm -- "[Đồng ý]" --> UpdateStatus[Hủy lịch & Giải phóng tài nguyên]
        UpdateStatus --> SendCancelNoti[Gửi xác nhận hủy thành công]
    end

    SendCancelNoti --> End([Kết thúc])
    Alert --> End
    FinalConfirm -- "[Không]" --> End
```

### 2.3. Quy trình Gửi yêu cầu Bảo hành (A3.6)
Mô tả luồng xử lý khi khách hàng yêu cầu hỗ trợ cho dịch vụ đã hoàn thành.

```mermaid
flowchart TD
    subgraph KhachHang ["Khách hàng"]
        Start([Bắt đầu]) --> SelectService[Chọn dịch vụ đã hoàn thành]
        SelectService --> RequestWarranty[Gửi yêu cầu bảo hành]
    end

    subgraph HeThong ["Hệ thống"]
        RequestWarranty --> Eligibility{Còn hạn bảo hành?}
        Eligibility -- "[Hết hạn]" --> Ineligible[Thông báo không đủ điều kiện]
        Eligibility -- "[Còn hạn]" --> ShowForm[Hiển thị Form yêu cầu]
    end

    subgraph QuanLy ["Quản lý"]
        ShowForm --> InputDetail[Nhập chi tiết lỗi & Hình ảnh]
        InputDetail --> Review{Xem xét yêu cầu}

        Review -- "[Từ chối]" --> Reject[Gửi phản hồi từ chối]
        Review -- "[Chấp thuận]" --> Approve[Tạo Booking bảo hành 0đ]
    end

    Approve --> End([Kết thúc])
    Reject --> End
    Ineligible --> End
```

---

## 3. Phân hệ Lễ tân (Receptionist)

### 3.1. Quy trình Tiếp đón & Check-in (B1.4)
Mô tả quy trình nghiệp vụ khi khách hàng đến Spa.

```mermaid
flowchart TD
    subgraph LeTan ["Lễ tân"]
        Start([Bắt đầu]) --> CustomerArrive[Tiếp đón khách hàng]
        CustomerArrive --> SearchBooking[Tìm lịch hẹn trên hệ thống]
        SearchBooking --> ExecuteCI[Thực hiện Check-in]
        WarnCustomer[Thông báo gói hết buổi & Tư vấn mua thêm]
        ConfirmBuy{Khách đồng ý mua?}
    end

    subgraph HeThong ["Hệ thống"]
        ExecuteCI --> TypeCheck{Sử dụng liệu trình?}

        TypeCheck -- "[Không]" --> ActiveBooking[Bắt đầu phục vụ]

        TypeCheck -- "[Có]" --> SessionCheck{Còn buổi không?}
        SessionCheck -- "[Còn buổi]" --> AutoDebit[Trừ 1 buổi vào Thẻ liệu trình]
        SessionCheck -- "[Hết buổi]" --> WarnCustomer

        ConfirmBuy -- "[Có]" --> NewPackage[Tạo đơn hàng mới]
        ConfirmBuy -- "[Không]" --> ManualInvoice[Chuyển sang thanh toán lẻ]

        AutoDebit --> ActiveBooking
        NewPackage --> ActiveBooking
        ManualInvoice --> ActiveBooking

        ActiveBooking --> NotifyKTV[Thông báo cho Kỹ thuật viên]
    end

    NotifyKTV --> End([Kết thúc])
```

### 3.2. Quy trình Thanh toán & Checkout (B1.5)
Mô tả quy trình tất toán dịch vụ và áp dụng khuyến mãi.

```mermaid
flowchart TD
    subgraph LeTan ["Lễ tân"]
        Start([Bắt đầu]) --> FinishService[Đánh dấu hoàn thành dịch vụ]
        InputVoucher[Nhập mã khuyến mãi - nếu có]
        FinalConfirm[Xác nhận thanh toán]
    end

    subgraph HeThong ["Hệ thống"]
        FinishService --> CreateInvoice[Khởi tạo hóa đơn tạm tính]
        CreateInvoice --> InputVoucher

        InputVoucher --> VoucherCheck{Kiểm tra mã C8}
        VoucherCheck -- "[Hợp lệ]" --> ApplyDiscount[Áp dụng giảm giá]
        VoucherCheck -- "[Không hợp lệ]" --> ShowVoucherError[Thông báo mã lỗi]

        ApplyDiscount --> ShowTotal[Hiển thị tổng tiền]
        ShowVoucherError --> ShowTotal

        ShowTotal --> FinalConfirm
        FinalConfirm --> BillPAID[Ghi nhận trạng thái: Đã thanh toán]
        BillPAID --> SendEInvoice[Gửi hóa đơn điện tử cho khách]
    end

    SendEInvoice --> End([Kết thúc])
```

---

## 4. Phân hệ Quản trị (Admin)

### 4.1. Quy trình Cấu hình Lịch hoạt động & Ngày nghỉ (C1, C2)
Hợp nhất luồng quản lý thời gian vận hành của Spa.

```mermaid
flowchart TD
    subgraph QuanTri ["Quản trị viên"]
        Start([Bắt đầu]) --> SelectConfig[Chọn Cấu hình Lịch]
        Choice{Chọn loại thay đổi}
        EditHours[Chỉnh sửa giờ hoạt động định kỳ]
        AddHoliday[Thêm ngày nghỉ lễ/bảo trì]
    end

    subgraph HeThong ["Hệ thống"]
        Choice -- "[Giờ định kỳ]" --> EditHours
        Choice -- "[Ngày ngoại lệ]" --> AddHoliday

        EditHours --> ValidTime{Giờ mở < Giờ đóng?}
        ValidTime -- "[Sai]" --> ShowTimeError[Báo lỗi logic giờ]
        ValidTime -- "[Đúng]" --> SaveConfig[Lưu cấu hình hệ thống]

        AddHoliday --> ConflictCheck{Có Booking tồn tại?}
        ConflictCheck -- "[Có]" --> AlertConflict[Cảnh báo lịch hẹn bị ảnh hưởng]
        ConflictCheck -- "[Không]" --> SaveConfig

        SaveConfig --> SyncSolver[Cập nhật dữ liệu cho Availability Engine]
    end

    SyncSolver --> End([Kết thúc])
    ShowTimeError --> EditHours
    AlertConflict --> End
```

### 4.2. Quy trình Quản lý Master Data (C4, C5, C7)
Luồng nghiệp vụ khi thay đổi dữ liệu nhân sự, dịch vụ hoặc tài nguyên.

```mermaid
flowchart TD
    subgraph QuanTri ["Quản trị viên"]
        Start([Bắt đầu]) --> Manage[Truy cập mục Quản lý Master Data]
        Manage --> ExecuteAction[Thực hiện Thêm/Sửa/Vô hiệu hóa]
    end

    subgraph HeThong ["Hệ thống"]
        ExecuteAction --> RelationCheck{Có liên kết dịch vụ/nhân sự?}

        RelationCheck -- "[Có liên kết]" --> HardConstraint{Có Booking tương lai?}
        HardConstraint -- "[Có]" --> Block[Cảnh báo: Phải xử lý Booking trước]
        HardConstraint -- "[Không]" --> ProcessUpdate[Cập nhật trạng thái dữ liệu]

        RelationCheck -- "[Không]" --> ProcessUpdate

        ProcessUpdate --> NotifyChange[Thông báo cập nhật thành công]
    end

    NotifyChange --> End([Kết thúc])
    Block --> End
```

---
*Lưu ý: Các sơ đồ trên tập trung vào luồng nghiệp vụ cấp cao để đối chiếu với Sequence Diagram và Use Case.*
