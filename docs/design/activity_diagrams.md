# Tổng hợp Sơ đồ Hoạt động (Activity Diagrams) - Synapse

Tài liệu này mô tả các luồng nghiệp vụ cấp hệ thống (Business Process Flows), tập trung vào sự phối hợp giữa tác nhân và trách nhiệm của hệ thống, tuân thủ nghiêm ngặt các tiêu chuẩn UML cho báo cáo học thuật.

---

## 1. Phân hệ Xác thực (Authentication)

### 1.1. Quy trình Đăng ký tài khoản khách hàng (A1.1)
Mô tả luồng từ khi người dùng đăng ký đến khi kích hoạt tài khoản thành công.

```mermaid
flowchart TD
    subgraph KhachHang ["Khách hàng"]
        Start([Bắt đầu]) --> Input[Nhập Email, Mật khẩu, Họ tên]
        ClickLink[Nhấp vào liên kết xác thực]
    end

    subgraph HeThong ["Hệ thống"]
        Input --> CreateAcct[Khởi tạo tài khoản & Hồ sơ khách hàng]
        CreateAcct --> SendEmail[Gửi thư điện tử xác thực]
        SendEmail --> ShowInfo[Yêu cầu kiểm tra hòm thư]

        ClickLink --> ValidateToken{Kiểm tra tính hợp lệ}
        ValidateToken -- "[Token đúng]" --> Activate[Kích hoạt tài khoản]
        ValidateToken -- "[Token sai/Hết hạn]" --> ShowError[Hiển thị báo lỗi xác thực]

        Activate --> Forward[Chuyển hướng về trang Đăng nhập]
    end

    Forward --> End([Kết thúc])
    ShowError --> End
```

### 1.2. Quy trình Đăng nhập hệ thống (A1.2)
Xác thực danh tính người dùng và phân quyền truy cập.

```mermaid
flowchart TD
    subgraph NguoiDung ["Người dùng"]
        Start([Bắt đầu]) --> InputLogin[Nhập Email và Mật khẩu]
    end

    subgraph HeThong ["Hệ thống"]
        InputLogin --> AuthCheck{Xác thực thông tin}
        AuthCheck -- "[Sai thông tin]" --> LoginFail[Thông báo lỗi đăng nhập]
        AuthCheck -- "[Thông tin khớp]" --> GetRole[Xác định quyền hạn truy cập]

        GetRole --> RedirectHome[Điều hướng về trang chủ theo vai trò]
    end

    RedirectHome --> End([Kết thúc])
    LoginFail --> End
```

---

## 2. Phân hệ Khách hàng (Customer)

### 2.1. Quy trình Đặt lịch hẹn trực tuyến (A2.4, A2.5)
Quy trình nghiệp vụ cốt lõi cho phép khách hàng chủ động đặt lịch dịch vụ.

```mermaid
flowchart TD
    subgraph KhachHang ["Khách hàng"]
        Start([Bắt đầu]) --> Browse[Chọn dịch vụ & Ngày mong muốn]
        SelectOption[Chọn khung giờ & Kỹ thuật viên]
        Confirm[Xác nhận thông tin đặt lịch]
        Pay[Thanh toán tiền đặt cọc]
        Waitlist[Đồng ý tham gia Danh sách chờ]
    end

    subgraph HeThong ["Hệ thống"]
        Browse --> GetSlots[Hệ thống tính toán khung giờ khả dụng]
        GetSlots --> CheckAvailability{Còn chỗ trống?}

        CheckAvailability -- "[Hết chỗ]" --> OfferWaitlist[Gợi ý tham gia Danh sách chờ]
        CheckAvailability -- "[Còn chỗ]" --> DisplaySlots[Hiển thị danh sách khung giờ]

        OfferWaitlist --> Waitlist
        Waitlist --> EndWait([Kết thúc])

        DisplaySlots --> SelectOption
        SelectOption --> HoldSlot[Giữ chỗ tạm thời]
        HoldSlot --> Confirm

        Confirm --> DepositReq{Yêu cầu đặt cọc?}
        DepositReq -- "[Có]" --> Pay
        DepositReq -- "[Không]" --> TreatmentCheck{Sử dụng liệu trình?}

        TreatmentCheck -- "[Có]" --> ValidTreatment{Còn buổi?}
        ValidTreatment -- "[Hết/Hết hạn]" --> ShowTreatError[Thông báo lỗi liệu trình]
        ValidTreatment -- "[Còn buổi]" --> CommitBooking[Ghi nhận lịch hẹn: Chờ phục vụ]

        TreatmentCheck -- "[Không]" --> CommitBooking

        Pay --> PayStatus{Cổng thanh toán phản hồi?}
        PayStatus -- "[Thành công]" --> CommitBooking
        PayStatus -- "[Thất bại]" --> ReleaseSlot[Hủy giữ chỗ & Báo lỗi thanh toán]

        CommitBooking --> SendConfirm[Gửi Email xác nhận đặt lịch]
    end

    SendConfirm --> End([Kết thúc])
    ReleaseSlot --> End
```

### 2.2. Quy trình Hủy lịch hẹn (A3.2)
Kiểm soát hành vi hủy lịch dựa trên chính sách vận hành của doanh nghiệp.

```mermaid
flowchart TD
    subgraph KhachHang ["Khách hàng"]
        Start([Bắt đầu]) --> PickBooking[Chọn lịch hẹn muốn hủy]
        ConfirmCancel{Xác nhận hủy lịch?}
    end

    subgraph HeThong ["Hệ thống"]
        PickBooking --> PolicyCheck{Trong thời hạn quy định?}

        PolicyCheck -- "[Quá hạn]" --> Deny[Từ chối hủy & Yêu cầu Hotline]
        PolicyCheck -- "[Hợp lệ]" --> ShowTerms[Hiển thị phí hủy & Chính sách hoàn tiền]

        ShowTerms --> ConfirmCancel
        ConfirmCancel -- "[Đồng ý]" --> MarkCancel[Cập nhật trạng thái: Đã hủy]
        ConfirmCancel -- "[Không]" --> EndCancel([Kết thúc])

        MarkCancel --> FreeResources[Giải phóng KTV & Tài nguyên]
        FreeResources --> Notify[Gửi xác nhận hủy thành công]
    end

    Notify --> End([Kết thúc])
    Deny --> End
```

### 2.3. Quy trình Gửi yêu cầu Bảo hành (A3.6)
Tiếp nhận và xử lý khiếu nại về chất lượng dịch vụ.

```mermaid
flowchart TD
    subgraph KhachHang ["Khách hàng"]
        Start([Bắt đầu]) --> Detail[Chọn dịch vụ đã thực hiện]
        Detail --> SubmitReq[Nhập phản hồi & Đính kèm hình ảnh]
    end

    subgraph HeThong ["Hệ thống"]
        SubmitReq --> CheckWarranty{Trong hạn bảo hành?}
        CheckWarranty -- "[Hết hạn]" --> NotifyExpired[Thông báo không được bảo hành]
        CheckWarranty -- "[Trong hạn]" --> CreateTicket[Tạo yêu cầu bảo hành: Trạng thái chờ]
    end

    subgraph QuanLy ["Quản lý"]
        CreateTicket --> ReviewTicket{Phê duyệt yêu cầu?}
        ReviewTicket -- "[Chấp thuận]" --> GrantWarranty[Tạo lịch hẹn bảo hành miễn phí]
        ReviewTicket -- "[Từ chối]" --> RefuseWarranty[Gửi email lý do từ chối]
    end

    GrantWarranty --> End([Kết thúc])
    RefuseWarranty --> End
    NotifyExpired --> End
```

---

## 3. Phân hệ Lễ tân (Receptionist)

### 3.1. Quy trình Tiếp đón & Check-in (B1.4)
Nghiệp vụ khi khách hàng có mặt tại Spa để thực hiện dịch vụ.

```mermaid
flowchart TD
    subgraph LeTan ["Lễ tân"]
        Start([Bắt đầu]) --> Welcome[Tiếp đón & Chào mừng khách]
        Welcome --> FindBooking[Tra cứu lịch hẹn]
        FindBooking --> ConfirmCI[Xác nhận khách đã đến]
        Consult[Tư vấn mua thêm/Gia hạn gói]
        AgreeBuy{Khách hàng mua thêm?}
    end

    subgraph HeThong ["Hệ thống"]
        ConfirmCI --> CheckUsage{Đặt theo liệu trình?}

        CheckUsage -- "[Dịch vụ lẻ]" --> Ready[Phân bổ tài nguyên vào phòng]

        CheckUsage -- "[Thẻ liệu trình]" --> SessionLeft{Còn số buổi?}
        SessionLeft -- "[Còn buổi]" --> DeductSession[Trừ 01 buổi vào thẻ]
        SessionLeft -- "[Hết buổi]" --> Consult

        AgreeBuy -- "[Đồng ý]" --> NewSale[Tạo hóa đơn mua gói mới]
        AgreeBuy -- "[Từ chối]" --> ChangeToManual[Chuyển thành khách lẻ thanh toán lẻ]

        DeductSession --> Ready
        NewSale --> Ready
        ChangeToManual --> Ready

        Ready --> NotifyKTV[Thông báo chuẩn bị phục vụ cho KTV]
    end

    NotifyKTV --> End([Kết thúc])
```

### 3.2. Quy trình Thanh toán & Checkout (B1.5)
Tất toán dịch vụ, áp dụng mã khuyến mãi và xuất hóa đơn.

```mermaid
flowchart TD
    subgraph LeTan ["Lễ tân"]
        Start([Bắt đầu]) --> ServiceDone[Xác nhận dịch vụ hoàn tất]
        ServiceDone --> InputCoupon[Nhập mã khuyến mãi - nếu có]
        InputCoupon --> FinalPay[Thực hiện thu tiền & Tất toán]
    end

    subgraph HeThong ["Hệ thống"]
        ServiceDone --> CalcTotal[Hệ thống tính tổng chi phí sơ bộ]

        InputCoupon --> couponVerify{Kiểm tra mã C8}
        couponVerify -- "[Hợp lệ]" --> ApplyDiscount[Tính lại giá sau giảm]
        couponVerify -- "[Hết hạn/Sai]" --> ErrorCoupon[Thông báo mã lỗi]

        ApplyDiscount --> FinalPay
        ErrorCoupon --> FinalPay

        FinalPay --> RecordTrans[Ghi nhận doanh thu & Đóng lịch hẹn]
        RecordTrans --> PrintBill[Xuất hóa đơn điện tử cho khách]
    end

    PrintBill --> End([Kết thúc])
```

---

## 4. Phân hệ Quản trị (Admin)

### 4.1. Quy trình Bảo trì Tài nguyên & Xử lý sự cố (C7, B1.8)
Đảm bảo tính linh hoạt khi tài nguyên (phòng, thiết bị) bị hỏng hoặc cần bảo trì định kỳ.

```mermaid
flowchart TD
    subgraph QuanTri ["Quản trị viên"]
        Start([Bắt đầu]) --> SelectRes[Chọn Tài nguyên cần bảo trì]
        SelectRes --> SetSchedule[Thiết lập mốc thời gian bảo trì]
    end

    subgraph HeThong ["Hệ thống"]
        SetSchedule --> ConflictCheck{Ảnh hưởng Booking hiện có?}

        ConflictCheck -- "[Có xung đột]" --> AutoSolve[Kích hoạt bộ giải thuật dời lịch B1.8]
        ConflictCheck -- "[Không]" --> SaveSchedule[Lưu bản ghi Lịch bảo trì]

        AutoSolve --> Result{Tìm được phương án thay thế?}
        Result -- "[Thành công]" --> Reschedule[Tự động điều chuyển & Gửi thông báo]
        Result -- "[Thất bại]" --> NotifyReception[Báo cho Lễ tân xử lý thủ công]

        Reschedule --> SaveSchedule
        SaveSchedule --> Sync[Cập nhật trạng thái khả dụng tương lai]
    end

    Sync --> End([Kết thúc])
    NotifyReception --> End
```

### 4.2. Quy trình Cấu hình Lịch Spa & Ngày nghỉ (C1, C2)
Quản lý thời gian vận hành tổng quát của toàn hệ thống.

```mermaid
flowchart TD
    subgraph QuanTri ["Quản trị viên"]
        Start([Bắt đầu]) --> Menu[Truy cập Cấu hình giờ Spa]
        Menu --> ChoiceReq{Loại thay đổi?}
        Daily[Sửa giờ mở cửa thường lệ]
        Holiday[Thêm ngày nghỉ lễ/đặc biệt]
    end

    subgraph HeThong ["Hệ thống"]
        ChoiceReq -- "[Giờ cung định]" --> Daily
        ChoiceReq -- "[Ngày ngoại lệ]" --> Holiday

        Daily --> ValidValue{Giờ mở < Giờ đóng?}
        ValidValue -- "[Sai]" --> ShowTimeError[Báo lỗi logic thời gian]
        ValidValue -- "[Đúng]" --> CommitGlobal[Cập nhật cấu hình toàn cục]

        Holiday --> ImpackCheck{Xử lý Booking hiện có?}
        ImpackCheck -- "[Hủy hàng loạt]" --> MassCancel[Hủy lịch & Xin lỗi khách hàng]
        ImpackCheck -- "[Dời lịch thủ công]" --> CommitGlobal

        CommitGlobal --> Refresh[Đồng bộ Availability Engine mới]
    end

    Refresh --> End([Kết thúc])
    ShowTimeError --> Daily
    MassCancel --> End
```

### 4.3. Quy trình Quản lý Master Data (C4, C5, C9)
Cập nhật dữ liệu nền tảng (Nhân sự, Dịch vụ).

```mermaid
flowchart TD
    subgraph QuanTri ["Quản trị viên"]
        Start([Bắt đầu]) --> MasterList[Mở danh sách quản lý]
        MasterList --> ExecuteAction[Thêm/Sửa/Vô hiệu hóa]
    end

    subgraph HeThong ["Hệ thống"]
        ExecuteAction --> Dependencies{Có ràng buộc nghiệp vụ?}

        Dependencies -- "[Đang có Booking]" --> Blocked[Cảnh báo không thể thực hiện]
        Dependencies -- "[Không]" --> UpdateSuccess[Cập nhật trạng thái dữ liệu]

        UpdateSuccess --> LogSys[Lưu nhật ký hệ thống]
    end

    LogSys --> End([Kết thúc])
    Blocked --> End
```

---

## 5. Các quy tắc tuân thủ (UML Compliance)
1. **Swimlanes (subgraph):** Phân định rõ trách nhiệm giữa các Actor và System.
2. **Hành vi nghiệp vụ:** Tuyệt đối không dùng thuật ngữ kỹ thuật (SQL, JSON, Request).
3. **Guard Conditions:** Mọi điểm rẽ nhánh đều có điều kiện mô tả trong ngoặc vuông `[ ]`.
4. **Action Naming:** Đặt tên hành động theo góc nhìn tác nhân (đã làm gì).
5. **Start/End Node:** Một điểm khởi đầu và kết thúc rõ ràng cho toàn quy trình.
