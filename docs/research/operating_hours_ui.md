# Nghiên cứu & Đề xuất: Giao diện Cấu hình Thời gian Hoạt động (Spa Operating Hours UI)

## 1. Tổng quan Hiện trạng
Hệ thống hiện tại đã có cấu trúc cơ bản cho việc cấu hình thời gian hoạt động, bao gồm:
- **Cấu trúc Modular**: Tách biệt rõ ràng giữa `OperatingHoursForm`, `DayScheduleRow`, và `ExceptionsCalendar`.
- **Chức năng cơ bản**:
  - Bật/Tắt trạng thái mở cửa cho từng ngày.
  - Cấu hình giờ bắt đầu/kết thúc (đang hỗ trợ nhiều slot trong model, nhưng UI hiển thị 1 slot).
  - Quản lý ngày ngoại lệ (Lễ, Bảo trì, Tùy chỉnh) qua lịch.
- **Giao diện**: Sử dụng `shadcn/ui` và `framer-motion` cho hiệu ứng chuyển động mượt mà.

## 2. Phân tích & So sánh với Best Practices

### Điểm mạnh
- **Trực quan hóa trạng thái**: Sử dụng Switch và hiệu ứng mờ (opacity) cho ngày đóng cửa giúp người dùng dễ nhận biết.
- **Tách biệt Ngoại lệ**: Tab riêng cho "Ngày nghỉ & Ngoại lệ" giúp giao diện chính không bị rối.
- **Clean Code**: Code tuân thủ nguyên tắc component nhỏ, dễ bảo trì.

### Điểm cần cải thiện (Dựa trên Best Practices)
2.  **Thao tác Hàng loạt (Bulk Actions)**:
    - *Hiện tại*: Phải cấu hình từng ngày một.
    - *Best Practice*: Cần có chức năng **"Sao chép cho tất cả các ngày"** hoặc **"Áp dụng cho T2-T6"** để tiết kiệm thời gian.
3.  **Trực quan hóa Lịch trình (Visual Schedule)**:
    - *Hiện tại*: Chỉ là danh sách các input.
    - *Best Practice*: Một biểu đồ hoặc lưới thời gian (Time Grid) hiển thị tổng quan tuần sẽ giúp người dùng dễ hình dung khoảng trống hoặc sai sót.
4.  **Validation**:
    - Cần đảm bảo `Giờ kết thúc > Giờ bắt đầu`.
    - Cảnh báo nếu các ca làm việc (slots) bị chồng chéo.

## 3. Đề xuất Cải tiến

### A. Nâng cấp Component `TimeInput`
Thay thế `TimeInput` hiện tại bằng một component `TimeInput` custom đồng bộ với `shadcn/ui` và `framer-motion`. 
- Validate định dạng HH:mm ngay lập tức.
- Hiển thị lỗi ngay bên dưới input nếu giờ không hợp lệ.
- Hiển thị tooltip khi hover để gợi ý định dạng HH:mm.
- Hiển thị placeholder HH:mm.
- Hiển thị icon để chọn giờ/phút.



### B. Thêm chức năng "Sao chép cấu hình"
Thêm nút action trong `DayScheduleRow` hoặc header:
- "Sao chép xuống dòng dưới".
- "Áp dụng cho tất cả các ngày trong tuần".

### C. Cải thiện UX cho `ExceptionsCalendar`
Hiển thị lịch cả năm, không chỉ là tháng hiện tại.
bỏ cột ngày nghỉ và ngoại lệ ra khỏi lịch.
những ngày đặt biệt có màu sắc rõ ràng, khi hover hiển thị thông tin chi tiết.
khi chọn ngày sẽ mở form để cấu hình ngày.





### D. Validation & Feedback
- Hiển thị lỗi ngay bên dưới input nếu giờ không hợp lệ.
- Toast notification khi lưu thành công cần chi tiết hơn (ví dụ: "Đã cập nhật lịch cho 5 ngày").


