# Tổng hợp Sơ đồ Hoạt động (Activity Diagrams) - Synapse

Tài liệu này mô tả chi tiết các luồng quy trình nghiệp vụ (Business Process Flows) của hệ thống, bao phủ toàn bộ các Ca sử dụng (Use Cases) và Sơ đồ tuần tự (Sequence Diagrams) đã thiết kế.

---

## 1. Phân hệ Xác thực (Authentication)

### 1.1. Quy trình Đăng ký & Kích hoạt (A1.1)
Mô tả quy trình khách hàng tạo tài khoản và xác thực qua email.

```mermaid
activityDiagram
    start
    :Khách hàng nhập thông tin Đăng ký\n(Email, Tên, Mật khẩu);
    :Hệ thống tiếp nhận yêu cầu Đăng ký;
    :Tạo User & Customer Profile (Trạng thái: PENDING);
    :Gửi Email xác thực;
    :Hiển thị thông báo: "Vui lòng kiểm tra email";

    :Khách hàng click Link xác thực;
    :Hệ thống kiểm tra Token hợp lệ?;
    if (Hợp lệ?) then (Có)
        :Kích hoạt Tài khoản (Status: ACTIVE);
        :Chuyển hướng đến trang Đăng nhập;
    else (Không/Hết hạn)
        :Báo lỗi: Link không hợp lệ hoặc hết hạn;
    endif
    stop
```

### 1.2. Quy trình Đăng nhập & Phân quyền (A1.2)

```mermaid
activityDiagram
    start
    :Người dùng nhập Email & Mật khẩu;
    :Xác thực thông tin đăng nhập;
    if (Thành công?) then (Có)
        :Cấp quyền truy cập (Session/Role);
        :Chuyển hướng đến Dashboard phù hợp;
    else (Thất bại)
        :Báo lỗi: Sai thông tin hoặc tài khoản bị khóa;
    endif
    stop
```

---

## 2. Phân hệ Khách hàng (Customer)

### 2.1. Quy trình Đặt lịch Thông minh (Smart Booking Flow) (A2.4, A2.5)
Bao gồm tìm kiếm khung giờ (Algorithm) và hoàn tất đặt hẹn.

```mermaid
activityDiagram
    start
    :Khách hàng chọn Dịch vụ & Ngày mong muốn;
    :Hệ thống thu thập dữ liệu khả dụng\n(KTV, Tài nguyên, Lịch hẹn);
    partition "Thuật toán SISF (Optimization)" {
        :Kiểm tra Ràng buộc Cứng (RCPSP Hard Constraints);
        :Vòng lặp tối ưu hóa Đa mục tiêu\n(Fairness, Preference, Utilization);
        :Lựa chọn phương án tối ưu (Jain's Fairness Index);
    }
    if (Có khung giờ trống?) then (Có)
        :Hiển thị danh sách khung giờ (Slots);
        :Khách hàng chọn Slot;
        :Khách hàng chọn KTV (Tùy chọn);
        :Hệ thống giữ chỗ (Temporary Hold);

        partition "Thanh toán/Đặt cọc" {
            if (Cần đặt cọc?) then (Có)
                :Chuyển sang cổng thanh toán;
                if (Thanh toán thành công?) then (Có)
                    :Xác nhận Booking;
                else (Thất bại/Hủy)
                    :Hủy giữ chỗ;
                    stop
                endif
            else (Không)
                :Tự động xác nhận;
            endif
        }

        :Tạo Booking (Status: CONFIRMED);
        :Gửi Email/Notif xác nhận;
    else (Không)
        :Gợi ý ngày khác hoặc Tham gia Waitlist (A2.6);
        if (Chọn Waitlist?) then (Có)
            :Thêm vào Danh sách chờ;
        endif
    endif
    stop
```

### 2.2. Quy trình Hủy lịch hẹn (A3.2)

```mermaid
activityDiagram
    start
    :Khách hàng chọn Lịch hẹn (Status: CONFIRMED);
    :Yêu cầu hủy lịch;
    :Hệ thống kiểm tra Chính sách thời gian;
    if (Quá thời hạn hủy (2a)?) then (Có)
        :Hiển thị thông báo lỗi (Violation);
        :Hướng dẫn liên hệ Hotline hỗ trợ;
        stop
    else (Không)
        :Hiển thị điều kiện hoàn tiền/phí (nếu có);
        :Khách hàng xác nhận lần cuối;
        :Cập nhật trạng thái: CANCELLED;
        :Giải phóng KTV & Tài nguyên;
        :Gửi thông báo xác nhận hủy;
    endif
    stop
```

### 2.3. Quy trình Gửi yêu cầu Bảo hành (Warranty Request) (A3.6)

```mermaid
activityDiagram
    start
    :Khách hàng xem Lịch sử Booking;
    :Chọn Booking đã hoàn thành (COMPLETED);
    :Hệ thống kiểm tra Chính sách bảo hành;
    note right: Check: Service có bảo hành? \nCheck: Thời gian <= Thời hạn bảo hành?

    if (Đủ điều kiện?) then (Có)
        :Hiển thị Form yêu cầu bảo hành;
        :Khách hàng nhập Lý do & Hình ảnh (nếu có);
        :Gửi yêu cầu;
        :Hệ thống tạo Ticket Bảo hành (PENDING);
        :Thông báo cho CSKH/Quản lý;

        partition "Xử lý nội bộ" {
            :Quản lý xem xét yêu cầu;
            if (Chấp thuận?) then (Có)
                :Tạo Booking 0đ (Loại: Bảo hành);
                :Thông báo lịch hẹn cho khách;
                :Update Ticket: APPROVED;
            else (Từ chối)
                :Gửi phản hồi từ chối;
                :Update Ticket: REJECTED;
            endif
        }
    else (Không)
        :Thông báo: Không đủ điều kiện bảo hành;
    endif
    stop
```

---

## 3. Phân hệ Lễ tân (Receptionist)

### 3.1. Quy trình Check-in & Trừ liệu trình (Service Usage) (B1.4, C6)
Mô tả xử lý khi khách đến, bao gồm logic xử lý gói liệu trình (Punch Card).

```mermaid
activityDiagram
    start
    :Khách hàng đến Spa;
    :Lễ tân tìm Booking trên Dashboard (B1.1);
    :Lễ tân bấm "Check-in";

    if (Booking thuộc Gói liệu trình?) then (Có)
        :Hệ thống kiểm tra số buổi còn lại;
        if (Còn buổi?) then (Có)
            :Trừ 1 buổi (used_sessions += 1);
            :Đánh dấu Booking Item: "Đã trừ";
            note right: Auto Punch Logic
        else (Hết buổi)
            :Cảnh báo: Gói đã hết buổi;
            :Yêu cầu thanh toán lẻ hoặc Mua gói mới;
            if (Khách đồng ý mua/trả lẻ?) then (Có)
                :Cập nhật Booking Item (Chuyển sang trả phí);
            else (Không)
                :Hủy Check-in;
                stop
            endif
        endif
    endif

    :Cập nhật trạng thái Booking: IN_PROGRESS;
    :Thông báo KTV chuẩn bị;
    :Khách hàng sử dụng dịch vụ;
    stop
```

### 3.2. Quy trình Thanh toán & Checkout (B1.5, C8)
Bao gồm áp dụng khuyến mãi.

```mermaid
activityDiagram
    start
    :Lễ tân chọn Booking "IN_PROGRESS";
    :Bấm "Hoàn thành dịch vụ";
    :Cập nhật trạng thái: COMPLETED;

    partition "Billing" {
        :Tạo Invoice nháp;
        :Load các Item chưa thanh toán;

        if (Có mã khuyến mãi?) then (Có)
            :Nhập Voucher Code (C8);
            :Validate Code (Hạn dùng, Điều kiện);
            if (Hợp lệ?) then (Có)
                :Trừ tiền (Discount);
            endif
        endif

        :Hiển thị Tổng tiền phải trả;
        :Khách hàng thanh toán (Tiền mặt/Thẻ/CK);
        :Lễ tân xác nhận "Đã thanh toán";
    }

    :Cập nhật Invoice: PAID;
    :Gửi Hóa đơn điện tử (Email);
    stop
```

### 3.3. Quy trình Tái lập lịch tự động (Auto Rescheduling) (B1.8)

```mermaid
activityDiagram
    start
    :Sự kiện: KTV/Phòng báo nghỉ đột xuất (Unavailable);
    :Hệ thống quét các Booking bị ảnh hưởng (Conflict);

    while (Còn Booking conflict?) is (Có)
        :Lấy thông tin Booking (Khách, Dịch vụ, Giờ);
        partition "Reschedule Solver" {
            :Tìm KTV thay thế (Cùng Skill);
            if (Tìm thấy KTV?) then (Có)
                :Gán KTV mới;
                :Log thay đổi (Change Log);
                :Notify: "Đã đổi sang KTV X";
            else (Không)
                :Tìm Giờ khác trong ngày (Same KTV);
                if (Tìm thấy?) then (Có)
                    :Đề xuất giờ mới cho Khách;
                    if (Khách đồng ý?) then (Có)
                        :Dời lịch;
                    else (Không)
                         :Đánh dấu: "Cần xử lý thủ công";
                    endif
                else (Không)
                     :Đánh dấu: "Critical Conflict";
                endif
            endif
        }
    endwhile

    :Lễ tân nhận danh sách "Cần xử lý thủ công";
    :Lễ tân gọi điện thương lượng với khách;
    stop
```

---

## 4. Phân hệ Quản trị (Admin)

### 4.1. Quản lý Tài nguyên & Cấu hình (C4, C7)
Quy trình chung cho thiết lập dữ liệu nền (Master Data).

```mermaid
activityDiagram
    start
    :Admin truy cập trang Quản lý (Resource/Staff);
    :Thực hiện Thêm/Sửa/Xóa;

    if (Hành động ảnh hưởng lịch?) then (Có)
        :Hệ thống check Dependencies (Booking tồn tại?);
        if (Có Booking xung đột?) then (Có)
            :Cảnh báo: "Không thể xóa vì có Booking";
            :Yêu cầu: Hủy/Dời Booking trước;
            stop
        else (Không)
            :Thực hiện cập nhật DB;
        endif
    else (Không)
        :Cập nhật DB;
    endif

    :Cập nhật Cache/Search Index của Bộ giải (Solver);
    stop
```

---
*Các sơ đồ trên đảm bảo phủ kín các luồng nghiệp vụ trong tài liệu Use Case và Sequence Diagrams.*
