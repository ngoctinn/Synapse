# Báo Cáo Đánh Giá UX/UI Phân Hệ Nhân Sự (Staff Feature)

## 1. Tổng Quan & Mục Tiêu
Đánh giá toàn diện trải nghiệm người dùng (UX) và giao diện (UI) của tính năng Quản lý Nhân sự, tập trung vào:
- **Tính nhất quán:** So với Design System và các quy tắc "Premium UI".
- **Hiệu quả:** Tốc độ thao tác của người dùng (Lễ tân/Admin).
- **Trải nghiệm:** Các vi tương tác (micro-interactions) và phản hồi hệ thống.

---

## 2. Kết Quả Nghiên Cứu (Researcher Workflow)

### 2.1. Phân Tích Codebase Hiện Tại
- **Cấu trúc Form (`StaffForm`):**
    - *Hiện trạng:* Sử dụng `Tabs` cho chế độ "Update" và `Linear` (dọc) cho chế độ "Create".
    - *Đánh giá:* Rất tốt. Tách biệt rõ ràng nhu cầu "nhập nhanh" (Create) và "quản lý chi tiết" (Update). Việc thêm `HRInfo` vào luồng Create (vừa thực hiện) đảm bảo tính đầy đủ dữ liệu.
- **Tương tác Bảng (`StaffTable`):**
    - *Hiện trạng:* Sử dụng thư viện `DataTable` custom, hỗ trợ chọn nhiều, xóa hàng loạt. Action bar nổi khi chọn.
    - *Điểm mạnh:* UX hiện đại, giảm nhiễu khi không tương tác.
    - *Cần cải thiện:* Nút "Xem lịch" (`Calendar` icon) trong row cần tooltip rõ ràng hơn (đã có nhưng cần kiểm tra độ trễ).
- **Lịch làm việc (`StaffScheduler`):**
    - *Hiện trạng:* Custom Grid View, hỗ trợ "Paint Mode" (Tô lịch) và Drag & Drop cơ bản.
    - *Vấn đề tiềm ẩn:*
        - Trên mobile, grid có thể bị chật chội.
        - "Paint Mode" là tính năng mạnh mẽ nhưng có thể gây nhầm lẫn nếu không có hướng dẫn rõ ràng (Onboarding).
        - Màu sắc các ca làm việc cần độ tương phản tốt để đảm bảo Accessibility.

### 2.2. So Sánh Best Practices (External Research)
- **Shadcn/ui Calendar:** Component chuẩn chỉ hỗ trợ DatePicker/RangePicker.
- **Resource Scheduler Pattern:**
    - Các hệ thống CRM Spa hàng đầu (Fresha, Mindbody) thường dùng dạng "Timeline View" ngang cho Lịch làm việc.
    - *Hiện tại:* Synapse đang dùng Grid View (Ngày x Nhân viên). Đây là cách tiếp cận tốt cho việc *phân ca* (Shift Planning), khác với *đặt hẹn* (Appointment Booking).
    - **Kết luận:** Giữ nguyên mô hình Grid cho "Plan", dùng Timeline cho "Booking".

---

## 3. Brainstorming & Ý Tưởng Cải Tiến (Brainstormer Workflow)

### Vấn đề 1: Thao tác xếp lịch lặp lại tốn thời gian
- **Ý tưởng A:** Tính năng "Copy Week" (Sao chép tuần trước). *Trạng thái: Đang phát triển (Mock).* -> **Cần ưu tiên triển khai.**
- **Ý tưởng B:** "Auto-fill" dựa trên hợp đồng lao động (thứ 2-6).
- **Quyết định:** Triển khai **Ý tựởng A** trước vì tính linh hoạt cao hơn.

### Vấn đề 2: Nhận biết nhân viên trong danh sách
- **Ý tưởng:** Avatar hiện tại là placeholder hoặc ảnh upload chưa có crop.
- **Đề xuất:** Tích hợp thư viện crop ảnh hoặc dùng UI "Initials" (Chữ cái đầu tên) với màu nền rực rỡ (Vibrant Colors) thay vì xám nhạt để tạo cảm giác "Premium". -> *Đã có Initials, cần review bảng màu.*

### Vấn đề 3: Phản hồi khi thao tác (Feedback)
- **Ý tưởng:** Khi "Tô lịch" thành công, cần hiệu ứng visual (flash nhẹ hoặc tick xanh) ngoài Toast notification.
- **Đề xuất:** Thêm animation nhẹ vào ô grid khi thay đổi trạng thái.

---

## 4. Kế Hoạch Hành Động (Action Plan)

Dựa trên đánh giá, đề xuất các tác vụ tiếp theo:

### Ngắn hạn (Immediate Polish)
1.  **Staff Scheduler Polish:**
    - Thêm empty state cho Grid nếu không có nhân viên.
    - Tinh chỉnh màu sắc của các Shift (Ca sáng/chiều) để dễ phân biệt hơn.
    - Fix lỗi (nếu có) về `key` trong vòng lặp Grid.
2.  **Avatar Enhancements:**
    - Update logic `AvatarFallback` để dùng màu `color_code` của nhân viên làm nền (thay vì màu ngẫu nhiên), giúp nhất quán nhận diện giữa Bảng và Lịch.

### Dài hạn (Features)
1.  **Copy Schedule Feature:** Implement logic backend thật.
2.  **Mobile View Optimization:** Chuyển Grid thành dạng List hoặc Stacked Card trên mobile.

## 5. Kết luận
Giao diện hiện tại đạt khoảng **85%** tiêu chuẩn Premium UX. Các tính năng cốt lõi (Create, Update, View) đều mượt mà. Điểm nghẽn chính nằm ở tính năng nâng cao (Xếp lịch nhanh) cần hoàn thiện logic để mang lại giá trị thực sự.
