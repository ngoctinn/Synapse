# Báo Cáo Đánh Giá Frontend & UX (Brainstorming & Research)

## 1. Tổng Quan
Báo cáo này tập trung vào việc đánh giá trải nghiệm người dùng (UX) và tính tiện dụng (Usability) của các thành phần quản lý dữ liệu chính: **Bảng dữ liệu (Data Tables)** và **Luồng Thêm mới (Create Flows)**. Đặc biệt phân tích trường hợp module `Services` và `Staff`.

## 2. Phân Tích Hiện Trạng (Diagnosis)

### 2.1. Bảng Dữ Liệu (`ServiceTable`, `StaffTable`)
*   **Điểm tốt**:
    *   Giao diện sạch, sử dụng Avatar/Badge hợp lý để trực quan hóa dữ liệu.
    *   Gộp các thông tin liên quan (Duration + Buffer) vào một cột để tiết kiệm không gian.
    *   Selection & Bulk Actions hoạt động tốt.
*   **Vấn đề (Pain Points)**:
    *   **Quá tải thông tin (Information Overload)**: Khi số lượng thuộc tính tăng lên (ví dụ: muốn xem nhanh `Description` hoặc `Equipment List` của dịch vụ), bảng hiện tại không có chỗ hiển thị.
    *   **Thiếu tùy biến**: Người dùng không thể ẩn/hiện cột theo nhu cầu cá nhân (ví dụ: Lễ tân chỉ quan tâm Giá/Thời lượng, Quản lý quan tâm Setup Time/Kỹ năng).
    *   **Horizontal Constraint**: Trên màn hình laptop nhỏ, bảng có thể bị chật chội.

### 2.2. Luồng Thêm Mới (`CreateServiceDialog`)
*   **Cấu trúc**: Sử dụng `Dialog` (Modal) chứa `ServiceForm` với `Tabs` (Thông tin chung, Cấu hình).
*   **Vấn đề (Pain Points)**:
    *   **Dialog quá tải**: Form Dịch vụ rất phức tạp (bao gồm Upload ảnh, Duration Picker, Time Visualizer, Equipment Timeline Editor). Nhồi nhét tất cả vào một Modal (max-height `90vh`) tạo cảm giác chật chội và phải cuộn nhiều trong một khung nhỏ.
    *   **Ngữ cảnh**: Modal che khuất toàn bộ dữ liệu phía sau, làm mất ngữ cảnh nếu người dùng muốn tham chiếu danh sách hiện có.
    *   **Click Fatigue**: Việc tách Tabs trong Modal làm người dùng không nhìn thấy tổng thể các trường cần nhập, dễ bỏ sót.

## 3. Nghiên Cứu & Đề Xuất (Brainstorming & Research)

Dựa trên nghiên cứu các mẫu thiết kế SaaS hiện đại (Linear, Supabase, Vercel), dưới đây là các giải pháp đề xuất:

### 3.1. Giải Pháp Cho Bảng Dữ Liệu "Nhiều Thuộc Tính"

**Option A: Column Visibility Control (Data Grid Pattern)**
*   **Mô tả**: Thêm nút "Cột hiển thị" trên thanh công cụ. Người dùng có thể bật/tắt các cột ít quan trọng.
*   **Ưu điểm**: Linh hoạt cho nhiều vai trò người dùng khác nhau.
*   **Code**: Tích hợp `DataTableViewOptions` của Shadcn/TanStack Table.

**Option B: Expandable Rows (Master-Detail Pattern)**
*   **Mô tả**: Thêm nút mũi tên `>` ở đầu mỗi hàng. Khi bấm, hàng mở rộng xuống dưới để hiển thị chi tiết phụ (Mô tả, Danh sách thiết bị, Lịch sử thay đổi) mà không cần cột riêng.
*   **Ưu điểm**: Giữ bảng gọn gàng nhưng vẫn truy cập được dữ liệu sâu. Phù hợp nhất cho `Description` hoặc `Timeline`.

**Option C: Hover Cards / Popovers**
*   **Mô tả**: Hover vào tên dịch vụ để hiện popup chứa mô tả/ảnh lớn. Hover vào Kỹ năng để hiện danh sách đầy đủ.
*   **Ưu điểm**: Nhanh, không cần click.

### 3.2. Giải Pháp Cho Luồng "Thêm Mới" Phức Tạp

**Option A: Side Sheet (Drawer) - ĐỀ XUẤT CHÍNH**
*   **Mô tả**: Thay vì Modal ở giữa, sử dụng một Panel trượt ra từ bên phải màn hình (Full height).
*   **Tại sao chuẩn UX hiện đại?**:
    *   **Không gian dọc tối đa**: Tốt cho các Form dài như `ServiceForm`.
    *   **Context**: Người dùng vẫn cảm thấy mình đang ở trang "Danh sách", không bị "bắt cóc" sang trang khác.
    *   **Edit/Create thống nhất**: Dễ dàng dùng chung cho cả Tạo mới và Chỉnh sửa (click vào row -> slide panel ra).
*   **Tham khảo**: Cách Linear xử lý new issue hoặc task details.

**Option B: Wizard Dialog (Progressive Disclosure)**
*   **Mô tả**: Chia Form thành các bước tuần tự: "Cơ bản" -> "Giá & Thời gian" -> "Tài nguyên".
*   **Ưu điểm**: Giảm tải nhận thức (Cognitive Load). Mỗi bước chỉ tập trung vào một nhóm thông tin.
*   **Nhược điểm**: Chậm hơn nếu người dùng muốn edit nhanh một trường ở bước 3.

**Option C: Inline Editing**
*   **Mô tả**: Cho phép sửa trực tiếp Giá, Tên ngay trên bảng (như Excel).
*   **Ưu điểm**: Cực nhanh cho các chỉnh sửa nhỏ.

## 4. Kế Hoạch Hành Động (Action Plan)

Để nâng cấp UX lên chuẩn "Premium", tôi đề xuất quy trình sau:

1.  **Refactor `CreateServiceDialog` thành `CreateServiceSheet`**:
    *   Chuyển từ `Dialog` sang `Sheet` (Shadcn UI).
    *   Tăng độ rộng Sheet lên `w-[600px]` hoặc `w-[800px]` (tùy độ rộng màn hình).
    *   Loại bỏ Tabs nếu không gian đủ rộng, hoặc giữ Tabs nhưng hiển thị thoáng hơn.

2.  **Nâng cấp `DataTable`**:
    *   Thêm component `DataTableViewOptions` để ẩn/hiện cột.
    *   Thêm tính năng **Row Expansion** cho bảng Services để xem nhanh mô tả và timeline thiết bị.

3.  **Visual Polish**:
    *   Sử dụng **Sticky Footer** trong Sheet cho nút "Lưu" để luôn nhìn thấy action.
    *   Thêm **Validation Feedback** tức thì.

## 5. Kết Luận
Việc chuyển từ **Modal** sang **Side Sheet** cho các form phức tạp (như Service, Staff Edit) là bước đi đúng đắn nhất để nâng cao tính tiện dụng và thẩm mỹ cho Synapse. Kết hợp với **Column Visibility** cho bảng sẽ giải quyết triệt để vấn đề quá tải thông tin.
