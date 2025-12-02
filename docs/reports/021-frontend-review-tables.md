# Báo Cáo Review Frontend: Service & Staff Tables

**Ngày:** 02/12/2025
**Người thực hiện:** Antigravity
**Phạm vi:**
- `frontend/src/features/services/components/service-table.tsx`
- `frontend/src/features/staff/components/staff-list/staff-table.tsx`
- Các component liên quan (`ServiceActions`, `StaffActions`)

## 1. Đánh Giá Kiến Trúc (FSD & Clean Code)

### 1.1. Tuân thủ FSD
- **Trạng thái:** ✅ Đạt chuẩn.
- **Chi tiết:**
  - Cả `features/services` và `features/staff` đều có `index.ts` đóng vai trò Public API.
  - Các component được tổ chức gọn gàng trong thư mục `components`.
  - Không phát hiện Deep Imports vi phạm quy tắc đóng gói.

### 1.2. Code Quality & Next.js 16
- **Trạng thái:** ⚠️ Cần lưu ý nhỏ.
- **Chi tiết:**
  - **Async/Await:** Sử dụng tốt `useTransition` trong các Actions để xử lý trạng thái loading.
  - **Naming:** Tên biến rõ ràng, dễ hiểu.
  - **Consistency (Tính nhất quán):**
    - `ServiceTable` có logic fallback tự động cập nhật URL (`router.push`) khi không có `onPageChange` được truyền vào.
    - `StaffTable` **KHÔNG** có logic này (chỉ gọi `onPageChange` mặc định rỗng). Điều này có thể gây ra lỗi nếu `StaffTable` được sử dụng độc lập mà không có handler bên ngoài.
    - **Khuyến nghị:** Đồng bộ hóa logic phân trang giữa hai bảng để đảm bảo hành vi nhất quán.

## 2. Đánh Giá Layout & Responsive (Trọng tâm)

### 2.1. ServiceTable (`service-table.tsx`)
- **Trạng thái:** ✅ Tốt.
- **Ưu điểm:**
  - **Responsive:** Hiện tại đang ẩn bớt cột trên mobile. (Lưu ý: Nếu muốn đồng bộ trải nghiệm cuộn ngang như StaffTable bên dưới, cần điều chỉnh lại).
  - **Mobile Layout:** Cột "Tên dịch vụ" hiển thị thông minh cả tên và giá.
  - **Sticky Header:** `sticky top-0` hoạt động tốt với `backdrop-blur`.

### 2.2. StaffTable (`staff-table.tsx`)
- **Trạng thái:** ⚠️ **Cần cải thiện Responsive.**
- **Vấn đề:**
  - **Thiếu Horizontal Scroll:** Trên mobile, bảng có thể bị vỡ layout hoặc co kéo nội dung quá mức do cố gắng hiển thị hết.
  - **Yêu cầu:** **KHÔNG ẩn cột**. Cần thiết lập thanh cuộn ngang (Horizontal Scroll) để người dùng có thể vuốt xem toàn bộ thông tin các cột (Vai trò, Kỹ năng, Trạng thái) trên điện thoại.

## 3. Đánh Giá UX/UI & "Premium" Feel

### 3.1. Màu Sắc & Design System (Mới)
- **Vấn đề:** Đang sử dụng nhiều **Hardcoded Colors** (màu cứng) thay vì biến của Design System (Shadcn/Tailwind Theme).
  - Ví dụ: `bg-white`, `text-slate-500`, `bg-emerald-50`, `text-emerald-700`.
- **Yêu cầu:** Chuyển đổi toàn bộ sang Semantic Colors để hỗ trợ Dark Mode và nhất quán giao diện.
  - `bg-white` -> `bg-background` hoặc `bg-card`.
  - `text-slate-500` -> `text-muted-foreground`.
  - `border-slate-200` -> `border-border`.
  - Các màu trạng thái (Emerald/Slate) -> Nên dùng `Badge` variants (default, secondary, outline, destructive) hoặc định nghĩa biến màu status trong `globals.css` nếu cần thiết.

### 3.2. Đề Xuất Cải Tiến (Brainstorming)
1.  **Responsive với Horizontal Scroll:**
    - Đảm bảo container bao ngoài `Table` có thuộc tính `overflow-x-auto`.
    - Thiết lập `min-width` cho `Table` (ví dụ: `min-w-[800px]`) để đảm bảo các cột không bị ép quá nhỏ, kích hoạt thanh cuộn ngang khi màn hình bé hơn.

2.  **Cải thiện Header Background:**
    - Thống nhất dùng `bg-background` (hoặc `bg-background/95`) cho cả hai bảng.

3.  **Mobile Actions:**
    - Vẫn giữ nguyên các nút thao tác, người dùng sẽ cuộn ngang để tiếp cận cột "Hành động".

## 4. Kế Hoạch Hành Động (Action Plan)

Để nâng cấp và sửa lỗi, hãy chạy workflow `/frontend-refactor` với các nhiệm vụ sau:

1.  **Refactor `StaffTable`:**
    - **Responsive:** Thêm `overflow-x-auto` cho wrapper của bảng. Đặt `min-w-[800px]` (hoặc kích thước phù hợp) cho `Table` để kích hoạt cuộn ngang trên mobile.
    - **Màu sắc:** Thay thế toàn bộ hardcoded colors (`bg-white`, `text-slate-...`) bằng các class semantic (`bg-background`, `text-muted-foreground`...).
    - **Logic:** Đồng bộ logic phân trang (URL params) giống `ServiceTable`.

2.  **Refactor `ServiceTable`:**
    - **Màu sắc:** Thay thế toàn bộ hardcoded colors bằng semantic colors tương tự StaffTable.
    - **Responsive:** Cân nhắc chuyển sang dùng cuộn ngang (bỏ ẩn cột) để đồng bộ trải nghiệm với StaffTable.

---
*Báo cáo này được tạo tự động bởi Antigravity Agent.*
