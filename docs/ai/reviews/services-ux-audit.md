# Services Feature UX Audit Data

## 1. Vấn đề Hiện tại (Current Issues)

### A. Layout & Grid System
- **2-Column Split (Chia 2 cột):**
  - Tại `service-time-price-info.tsx`, các trường `duration` và `buffer_time` đang dùng `grid-cols-2`.
  - **Vấn đề:** Trong các form nhập liệu phức tạp hoặc trên màn hình nhỏ/drawer, việc chia cột không nhất quán làm giảm tính "scannability" (khả năng đọc lướt) của người dùng. Flow đọc mắt phải nhảy zic-zac.
- **Form Navigation:**
  - Chế độ "Create" dùng khổ dọc (Vertical Stack).
  - Chế độ "Update" dùng Tabs (Horizontal Tabs).
  - **Vấn đề:** Sự không nhất quán này gây nhầm lẫn (Cognitive Friction). Người dùng phải học 2 giao diện cho cùng 1 dữ liệu.

### B. Component Specifics
- **Tag Input (Overlapping):**
  - Tại `service-resources-info.tsx`, `TagInput` cho "Kỹ năng yêu cầu" bị báo cáo là chồng chéo (overlapping).
  - Nguyên nhân khả nghi: CSS `flex-wrap` không xử lý tốt khi số lượng tag nhiều hoặc tên tag dài, hoặc chiều cao container bị cố định.
- **Image Upload:**
  - Chiếm quá nhiều diện tích (`h-[200px]`, `w-full`). Đẩy các trường quan trọng (Tên) xuống quá sâu.
- **Color Selection:**
  - `ColorSwatchGroup` không có label rõ ràng cho từng màu, chỉ là các ô tròn. Khó gỡ lỗi accessibility.

### C. Form UX Best Practices Violations
1.  **Thiếu Grouping Visual:** Các nhóm thông tin (Basic, Time, Resource) chỉ ngăn cách bằng khoảng trắng hoặc tiêu đề nhỏ, thiếu visual container (Card/Border) để phân tách rõ ràng.
2.  **Actions Placement:** Nút "Quản lý kỹ năng" nằm chen ngang header của field, gây rối thị giác.

## 2. Đề xuất Refactor (Recommendations)

### A. Standardize Layout (Linear Layout)
- **Quy tắc mới:** Chuyển toàn bộ Form về **Single Column Layout** (1 cột) mặc định.
- Lý do:
  - Tối ưu cho Mobile/Tablet/Sidebar Drawer.
  - Tăng tốc độ hoàn thành form (Form completion rate) nhờ flow đọc tuyến tính từ trên xuống dưới.
  - Loại bỏ cognitive load khi mắt phải điều hướng trái-phải.

### B. Component Visual Fixes
- **Tag Input:**
  - Review lại CSS `flex-wrap gap-2`.
  - Đảm bảo `min-height` linh hoạt thay vì fixed height.
- **Image Upload:**
  - Chuyển sang layout "Thumbnail bên trái, Button bên phải" hoặc giảm chiều cao xuống `h-40` để tiết kiệm không gian ngang.
- **Tách biệt Read/Write:**
  - Sử dụng chung layout (Vertical Stack hoặc Tabs) cho cả Create và Update để nhất quán. Khuyến nghị: **Vertical Stack with Scroll Spy** hoặc **Tabs** cho cả hai nếu form quá dài. Tuy nhiên với form này, Vertical Stack là đủ.

### C. Refactor Plan
1.  **Unify Form Container:** Xóa bỏ sự phân biệt layout Create/Update. Dùng chung 1 cấu trúc.
2.  **Fix Grid:** Chuyển `grid-cols-2` thành `flex-col space-y-4` trong `service-time-price-info.tsx`.
3.  **Optimize Components:** Sửa `TagInput` và `ImageUpload`.
