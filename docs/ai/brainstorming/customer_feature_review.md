# Đánh giá Chuyên sâu & Brainstorming: Tính năng Khách hàng (CRM)

## 1. Xác định Vấn đề (Problem Definition)

### Hiện trạng
- **Mô hình dữ liệu**: Đã có `Customer` với `loyalty_points`, `membership_tier`, `allergies`, `medical_notes`.
- **Giao diện hiện tại (`CustomerForm`)**: Tập trung vào việc nhập liệu cơ bản (CRUD). Thiếu các thông tin thiết yếu cho nghiệp vụ CRM như: lịch sử đặt hẹn, hạng thành viên, và thống kê chi tiêu.
- **Quy trình Lễ tân (`receptionist_flows.md`)**: Yêu cầu xử lý nhanh cho khách vãng lai (Walk-in) và nhận diện khách hàng VIP/có lưu ý y tế khi check-in. Giao diện hiện tại chưa hỗ trợ tối ưu cho các luồng này.
- **Trải nghiệm**: Form hiện tại dạng cuộn dài, chưa phân nhóm thông tin logic (Ví dụ: Tách biệt thông tin cá nhân và thông tin y tế/thành viên).

### Mục tiêu
- Nâng cấp module Khách hàng từ "Danh bạ" đơn giản thành "Hồ sơ Customer 360".
- Đảm bảo Lễ tân có cái nhìn toàn diện về khách hàng ngay lập tức (Instant Insight).
- Tối ưu hóa giao diện cho cả tốc độ (Create) và độ sâu (View Detail).

## 2. Brainstorming (Tạo ý tưởng)

### Ý tưởng 1: Customer 360 Dashboard (Trong Sheet/Dialog)
- Chuyển `CustomerSheet` thành một giao diện Tabs đa chiều:
  - **Tab Hồ sơ**: Thông tin cá nhân & Liên hệ.
  - **Tab Y tế**: Tiền sử bệnh, Dị ứng (Highlight đỏ), Ghi chú điều trị.
  - **Tab Lịch sử**: Danh sách các lần đặt hẹn trước đây & Trạng thái (No-show, Completed).
  - **Tab Thành viên**: Hạng thẻ, Điểm tích lũy, Lịch sử đổi điểm.

### Ý tưởng 2: Quick Create Mode (Chế độ tạo nhanh)
- Khi Lễ tân tạo đơn Walk-in, họ không cần nhập hết Address/Medical Notes.
- Tạo một biến thể form "Lite" chỉ cần Tên + SĐT để chốt lịch nhanh. Các thông tin khác bổ sung sau.

### Ý tưởng 3: Visual Alerts (Cảnh báo trực quan)
- Hiển thị "Badges" màu sắc ngay trên danh sách khách hàng (`CustomerList`) hoặc Header của Sheet:
  - 🔴 **Allergy Alert**: Nếu trường `allergies` có dữ liệu.
  - 👑 **VIP/Gold**: Hiển thị icon vương miện cho hạng thành viên.
  - ⚠️ **Bad Reputation**: Cảnh báo nếu khách hay bùng lịch (No-show rate cao).

### Ý tưởng 4: Smart Segmentation (Phân khúc thông minh) - *Advanced*
- Tự động gắn tag khách hàng: "Khách mới", "Sắp mất (Churn risk)", "Chi tiêu cao".

## 3. Phân tích & Đánh giá (Analysis)

| Ý tưởng | Ưu điểm (Pros) | Nhược điểm (Cons) | Tính khả thi |
| :--- | :--- | :--- | :--- |
| **1. Customer 360** | Cung cấp đầy đủ thông tin, hỗ trợ upsell và CSKH tốt hơn. | Tăng độ phức tạp UI, cần fetch thêm data (History). | Cao |
| **2. Quick Create** | Tối ưu cho quy trình Walk-in, giảm thời gian chờ của khách. | Có thể dẫn đến dữ liệu thiếu sót nếu không nhắc bổ sung. | Trung bình |
| **3. Visual Alerts** | Giúp nhân viên nhận biết ngay vấn đề quan trọng (An toàn y tế). | Cần thiết kế icon/màu sắc tinh tế để không gây rối. | Cao |
| **4. Segmentation** | Hỗ trợ Marketing cực tốt. | Logic backend phức tạp, chưa cần thiết cho giai đoạn MVP. | Thấp |

## 4. Đề xuất Thực thi (Proposal)

Dựa trên phân tích, đề xuất triển khai **Phương án "Hybrid 360 + Alerts"**:

### Bước 1: Refactor CustomerForm sang dạng Tabs (Ưu tiên cao)
- **Mục đích**: Giảm độ dài form, tổ chức thông tin khoa học.
- **Triển khai**:
  - Dùng `Tabs` component của Shadcn.
  - **Tab 1 - Thông tin chung**: Tên, SĐT, Email, Nhóm khách hàng (Mới).
  - **Tab 2 - Sức khỏe & Ghi chú**: Allergies, Medical Notes. (Đưa các trường `allergies` vào đây).
  - **Tab 3 - Membership**: Hiển thị Hạng thẻ (Read-only) & Điểm.

### Bước 2: Tích hợp Visual Indicators
- Cập nhật `CustomerSheet` header để hiển thị ngay: Tên + Hạng thẻ (Badge) + Icon Cảnh báo (nếu có dị ứng).
- Refactor `CustomerForm` phần `Allergies`: Giữ style cảnh báo đỏ nhưng chuẩn hóa component.

### Bước 3: Cải thiện UX nhập liệu
- Thêm trường `preferred_staff_id` (Nhân viên ưa thích) vào form - quan trọng cho Spa.
- Thêm `loyalty_points` (chỉ hiển thị/điều chỉnh bởi Admin) để quản lý thủ công ban đầu.

### Mã nguồn liên quan cần sửa đổi:
- `frontend/src/features/customers/components/customer-form.tsx` (Chính)
- `frontend/src/features/customers/components/customer-sheet.tsx` (Header)
- `frontend/src/features/customers/model/schemas.ts` (Thêm validation cho field mới)
