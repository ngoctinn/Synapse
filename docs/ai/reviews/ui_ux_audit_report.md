# Báo cáo Tổng hợp Đánh giá Giao diện & Clean Code - Dự án Synapse

**Người thực hiện:** Chuyên gia Đánh giá Frontend (GitHub Copilot)
**Ngày báo cáo:** 22/12/2025
**Đối tượng:** Toàn bộ hệ thống Frontend (Next.js + shadcn/ui)

---

## 1. Tổng quan về Hệ thống Style (Tailwind CSS)

### 1.1. Sự bất nhất về Design System
- **Bo góc (Border Radius):** Tồn tại sự pha trộn không quy tắc giữa `rounded-md`, `rounded-lg`, `rounded-xl` và `rounded-2xl`. 
    - *Câu hỏi:* Tại sao Chat dùng `2xl`, Card dùng `xl`, Button dùng `md`? Quy chuẩn nào cho sự phân cấp này?
- **Màu sắc & Opacity:** Lạm dụng các giá trị opacity cứng (`/10`, `/40`, `/90`) thay vì định nghĩa các biến màu cụ thể trong `tailwind.config.js`.
    - *Câu hỏi:* Việc này có gây khó khăn cho việc duy trì độ tương phản (Accessibility) và quản lý Dark Mode không?
- **Font chữ:** Sự xuất hiện đột ngột của `font-serif` trong Chat và Service Table.
    - *Câu hỏi:* Tại sao lại pha trộn Serif và Sans-serif mà không có hướng dẫn cụ thể trong Design Specification?

### 1.2. Hiệu ứng & Chuyển động
- **Lạm dụng Animation:** Landing Page và Chat sử dụng rất nhiều hiệu ứng (`bg-blob`, `glass-card`, `animate-shimmer`).
    - *Câu hỏi:* Liệu các hiệu ứng này có thực sự cần thiết cho một ứng dụng quản lý vận hành (B2B) hay đang gây xao nhãng và tốn tài nguyên?

---

## 2. Kiến trúc Component & Clean Code

### 2.1. Vấn đề "God Components"
- Các file như `AppointmentForm`, `CustomerForm`, `StaffForm` đều vượt quá 300 dòng code.
    - *Câu hỏi:* Tại sao không tách nhỏ các Tab hoặc Section thành các sub-components để dễ quản lý và kiểm thử?

### 2.2. Sự thiếu nhất quán trong Pattern xử lý
- **Xử lý Bảng (Tables):** Một số bảng dùng `useTableSelection` và `useBulkAction`, số khác lại dùng vòng lặp `for...of` thủ công hoặc không hỗ trợ chọn hàng loạt.
- **Xử lý Form:** Sự pha trộn giữa `useActionState` (React 19) và `useTransition` truyền thống.
- **Hành động Xóa:** Một số nơi dùng `DeleteConfirmDialog` (đẹp, đồng bộ), nơi khác lại dùng `window.confirm` (cũ kỹ).
    - *Câu hỏi:* Tại sao không chuẩn hóa các pattern này thành một bộ "Base Components" hoặc "Custom Hooks" dùng chung cho toàn dự án?

### 2.3. Quản lý Dữ liệu & Logic
- **Logic rò rỉ vào UI:** Việc tính toán ngày tháng, định dạng tiền tệ, và logic nghiệp vụ (như tính % tiến độ) nằm rải rác trong hàm `render` của component.
    - *Câu hỏi:* Tại sao không chuyển các logic này về tầng Service hoặc sử dụng các Utility functions tập trung?

---

## 3. Trải nghiệm Người dùng (UX) & Bản địa hóa

### 3.1. Thuật ngữ & Ngôn ngữ
- Tồn tại các thuật ngữ tiếng Anh chưa được chuyển ngữ: "Walk-in", "CREATE", "UPDATE", "COMPLETED", "ROOM", "EQUIPMENT".
    - *Câu hỏi:* Điều này có vi phạm cam kết "100% tiếng Việt" trong tài liệu thiết kế không?

### 3.2. Phản hồi người dùng (Feedback)
- Thiếu trạng thái Loading rõ ràng khi thực hiện các hành động quan trọng (Xóa, Điểm danh, Lưu cài đặt).
    - *Câu hỏi:* Người dùng sẽ cảm thấy thế nào nếu nhấn nút mà không thấy phản hồi ngay lập tức từ giao diện?

---

## 4. Danh sách Câu hỏi Phản biện theo Feature (Tóm tắt)

| Feature | Câu hỏi trọng tâm |
|---------|-------------------|
| **Booking Wizard** | Tại sao Step 1 dùng Floating Summary còn các bước khác dùng Footer cố định? Tại sao không có Progress Bar? |
| **Appointments** | Tại sao không có tính năng Drag & Drop để đổi giờ hẹn? Tại sao render cả 24h dù spa chỉ làm việc 12h? |
| **Admin** | Tại sao Breadcrumb lại hardcode map thay vì lấy từ route config? |
| **Auth** | Tại sao đăng ký xong không tự động đăng nhập mà bắt người dùng nhập lại thông tin? |
| **Billing** | Tại sao logic load dữ liệu bị lặp lại và không có cơ chế cache? |
| **Customer Dashboard** | Tại sao form Profile lại quá rộng (max-w-5xl) gây khó điền trên màn hình lớn? |
| **Chat** | Tại sao lại dùng font Serif và bo góc 2xl khác biệt hoàn toàn với phần còn lại? |
| **Audit Logs** | Tại sao lại hiển thị JSON thô cho người dùng cuối? |
| **Services** | Tại sao lại dùng hiệu ứng Shimmer khi hover vào thanh thời gian? |
| **Settings** | Tại sao Exceptions thì auto-save còn Schedule thì phải nhấn nút Save? |
| **Warranty** | Tại sao lại gửi tên khách hàng sang bên thứ ba (DiceBear) để lấy avatar? |
| **Waitlist** | Tại sao lại dùng `window.confirm` thay vì Dialog của hệ thống? |

---

**Kết luận:** Dự án Synapse có một bộ khung công nghệ hiện đại và giao diện bắt mắt. Tuy nhiên, sự thiếu nhất quán trong việc áp dụng các pattern thiết kế và lập trình đang tạo ra một lượng "nợ kỹ thuật" đáng kể. Cần một đợt refactor tổng thể để đồng bộ hóa trải nghiệm người dùng và làm sạch mã nguồn trước khi mở rộng thêm các tính năng mới.

