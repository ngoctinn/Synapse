# Sơ đồ Hoạt động (Activity Diagrams) - Synapse

Tài liệu này mô tả logic luồng xử lý của các tính năng phức tạp trong hệ thống, đặc biệt là các phần liên quan đến thuật toán tối ưu hóa.

## 1. Luồng Tìm kiếm khung giờ khả dụng (Smart Scheduling Search)

Sơ đồ này mô tả cách hệ thống xử lý các ràng buộc (Constraints) để đưa ra danh sách giờ trống cho khách hàng.

```mermaid
activityDiagram
    start
    :Nhận yêu cầu: Dịch vụ, Ngày, KTV (tùy chọn);
    :Truy xuất dữ liệu cơ bản;
    partition "Xử lý Ràng buộc (Constraint Solving)" {
        :Lấy giờ mở cửa Spa trong ngày;
        :Lấy lịch trực của toàn bộ nhân viên có kỹ năng phù hợp;
        :Lấy danh sách các lịch hẹn đã đặt (Booked slots);
        :Lấy danh sách các tài nguyên yêu cầu (Phòng/Thiết bị);
        :Chạy thuật toán OR-Tools CP-SAT;
        if (Tìm thấy khung giờ trống?) then (Có)
            :Tính toán các khung giờ tối ưu (Khít lịch);
        else (Không)
            :Đề xuất các ngày/giờ lân cận;
        endif
    }
    :Trả về danh sách khung giờ (Slots);
    stop
```

## 2. Luồng Tái lập lịch tự động (Automatic Rescheduling)

Mô tả cách hệ thống phản ứng khi có tài nguyên (Staff/Room) đột ngột không khả dụng.

```mermaid
activityDiagram
    start
    :Ghi nhận sự cố Tài nguyên (Staff/Room Off);
    :Xác định khoảng thời gian bị ảnh hưởng;
    :Truy vấn danh sách Bookings bị xung đột;
    :Khởi tạo Job tối ưu hóa lại (Reschedule Job);
    fork
        :Tìm KTV thay thế có cùng kỹ năng;
    fork again
        :Tìm phòng trống cùng loại;
    fork again
        :Tìm khung giờ trống gần nhất cho khách;
    end fork
    :Cân đối hàm mục tiêu (Objective Function);
    note right: Giảm thiểu sự thay đổi<br/>Tối đa hóa sự hài lòng
    if (Tìm được phương án thay thế?) then (Có)
        :Cập nhật trạng thái Booking;
        :Gửi thông báo thay đổi cho Khách & Nhân viên;
    else (Không)
        :Báo cho Lễ tân xử lý thủ công (Gọi điện);
    endif
    stop
```

## 3. Luồng Tính toán và Chốt hoa hồng (Monthly Commission Closing)

```mermaid
activityDiagram
    start
    :Admin chọn kỳ tính lương (Tháng/Năm);
    :Lấy danh sách Invoices đã thanh toán (PAID);
    :Duyệt qua từng Booking Item trong Invoice;
    while (Còn Item?) is (Có)
        :Xác định KTV thực hiện;
        :Lấy Tỷ lệ hoa hồng (rate) của KTV tại thời điểm đó;
        :Tính tiền hoa hồng = Giá trị dịch vụ * rate;
        :Cộng dồn vào tổng theo Staff_ID;
    endwhile (Hết Item)
    :Tạo bản ghi Báo cáo hoa hồng tạm tính;
    :Admin phê duyệt;
    :Lưu lịch sử chi trả;
    stop

## 4. Luồng Quản lý và Trừ buổi liệu trình (Treatment Punch Card)

Mô tả cách hệ thống quản lý gói nhiều buổi theo mô hình đơn giản và chính xác nhất.

```mermaid
activityDiagram
    start
    :Khách hàng mua Gói Combo (Liệu trình X buổi);
    :Thanh toán Invoice cho toàn bộ Gói;
    :Hệ thống khởi tạo Thẻ liệu trình (customer_treatments);
    note right: total_sessions = X<br/>used_sessions = 0
    repeat
        :Khách đặt lịch sử dụng dịch vụ trong Gói;
        :Hệ thống kiểm tra số buổi còn lại;
        if (Còn buổi trống? (used < total)) then (Có)
            :Tạo Booking (Gắn kèm treatment_id);
            :Khách đến Spa;
            :Lễ tân thực hiện **Check-in**;
            partition "Hành động Tự động" {
                :Tăng used_sessions thêm 1;
                :Đánh dấu Booking Item là 'Đã trừ buổi';
            }
            :KTV thực hiện dịch vụ;
        else (Hết buổi)
            :Thông báo khách cần mua thêm Gói mới;
            :Yêu cầu thanh toán lẻ nếu vẫn muốn làm;
        endif
    repeat while (Khách muốn làm tiếp?)
    :Đóng Thẻ liệu trình (Status = COMPLETED);
    stop
```

```

---
*Ghi chú: Các sơ đồ trên mô tả logic mức cao. Việc triển khai chi tiết nằm trong service layer của Backend.*
