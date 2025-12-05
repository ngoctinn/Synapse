# Báo cáo Đánh giá Frontend: Features/Resources

**Ngày:** 05/12/2025
**Người thực hiện:** Antigravity
**Phiên bản:** 1.0

## 1. Tổng quan
Báo cáo này đánh giá module `frontend/src/features/resources` dựa trên tiêu chuẩn Feature-Sliced Design (FSD), Next.js 16 và các nguyên tắc UX/UI cao cấp của dự án Synapse.

## 2. Vi phạm Kiến trúc & Code (Architecture & Code Quality)

### 2.1. Feature-Sliced Design (FSD)
- **[CRITICAL] Thiếu Public API (`index.ts`):** Thư mục `frontend/src/features/resources` hiện không có file `index.ts`.
    - **Vấn đề:** Các module khác có thể phải import sâu vào bên trong (deep import), vi phạm quy tắc đóng gói của FSD.
    - **Khắc phục:** Tạo file `index.ts` và export các thành phần cần thiết (ví dụ: `ResourceTable`, `MaintenanceTimeline`, `getResources`...).

### 2.2. Code Quality & Best Practices
- **Inline SVG Icon (`ResourceTable`):** Component `EditIcon` đang được định nghĩa inline trong `ResourceTable`.
    - **Khắc phục:** Sử dụng `Pencil` từ `lucide-react` hoặc shared icon component để đảm bảo nhất quán và giảm code thừa.
- **Image Optimization (`MaintenanceTimeline`):** Sử dụng thẻ `<img>` thay vì component `Image` của Next.js cho hình ảnh tài nguyên.
    - **Khắc phục:** Chuyển sang sử dụng `next/image` để tối ưu hóa hiệu năng tải trang.
- **Hardcoded Colors (`MaintenanceTimeline`):** Các màu trạng thái (`bg-blue-500`, `bg-green-500`...) đang được hardcode thay vì sử dụng CSS variables hoặc token từ theme hệ thống (`text-primary`, `bg-destructive`...).
    - **Khắc phục:** Sử dụng các class semantic của Tailwind (ví dụ: `text-blue-600` thay vì `text-blue-700`, hoặc define custom variants cho status).

## 3. Đánh giá UX/UI (User Experience & User Interface)

### 3.1. Resource Table
- **Cột "Chi tiết":** Logic render cho `ROOM` và `EQUIPMENT` đang bị trộn lẫn, gây khó đọc.
- **Badge:** Đã sử dụng Badge tốt cho trạng thái và loại.
- **Action Buttons:** Nút xóa có confirm dialog là rất tốt (tuân thủ quy tắc "Confirmation Dialogs").

### 3.2. Maintenance Timeline
- **Typography:** Sử dụng `font-serif` cho tiêu đề "Lịch Bảo Trì". Cần xác nhận lại xem dự án có sử dụng font serif cho tiêu đề các section con hay không (thường chỉ dùng cho Main Headings trong các theme Luxury).
- **Responsive:** Container có `min-w-[800px]` sẽ gây scroll ngang trên tablet/mobile.
    - **Đề xuất:** Xem xét layout dạng Card hoặc List cho mobile view thay vì table timeline.
- **Tương tác:** Các task item hiển thị dạng button là tốt, nhưng cần thêm hover tooltip để xem chi tiết nhanh mà không cần click.

## 4. Kế hoạch hành động (Action Plan)

1.  **Refactor Structure:**
    - Tạo `frontend/src/features/resources/index.ts`.
    - Export `ResourceTable`, `MaintenanceTimeline`, `actions`.

2.  **Refactor Components:**
    - **MaintenanceTimeline:**
        - Thay `img` bằng `next/image`.
        - Thay thế hardcoded colors bằng semantic tokens.
        - Review lại `font-serif`.
    - **ResourceTable:**
        - Thay `EditIcon` nội bộ bằng `lucide-react`.

3.  **UI Enhancements:**
    - Cải thiện hiển thị cột "Chi tiết" trong bảng.
    - Thêm Tooltip cho các item trong Timeline.

---
## 5. Trạng thái Refactor (Updated at 2025-12-05)

- [x] Đã tạo `frontend/src/features/resources/index.ts` export Public API.
- [x] **ResourceTable:** Đã thay thế Inline SVG bằng `Pencil` icon từ `lucide-react`. Đã tách logic render cột "Chi tiết" để code sạch hơn.
- [x] **MaintenanceTimeline:**
    - Đã chuyển sang `next/image`.
    - Đã thay thế hardcoded colors bằng semantic tokens (`bg-[color]/10`).
    - Đã thêm `Tooltip` hiển thị chi tiết task.
- [x] Đã kiểm tra build (`next build`).

*Quá trình refactor hoàn tất.*
