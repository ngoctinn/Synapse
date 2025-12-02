# Kế Hoạch Chuẩn Hóa Frontend (Benchmark: Trang Nhân Viên)

## 1. Tổng Quan
Tài liệu này phác thảo các tiêu chuẩn thiết kế được đúc kết từ **Trang Nhân Viên** (`/admin/staff`) để áp dụng cho toàn bộ ứng dụng, cụ thể là ưu tiên tính năng **Dịch Vụ** trước.

## 2. Tiêu Chuẩn Bố Cục Trang
**Tham chiếu**: `frontend/src/app/(admin)/admin/staff/page.tsx`

- **Container Gốc**:
  ```tsx
  <div className="h-[calc(100vh-6rem)] flex flex-col bg-white">
  ```
- **Phần Header**:
  ```tsx
  <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
    <h1 className="text-lg font-semibold">{PageTitle}</h1>
    {Actions}
  </div>
  ```
- **Khu Vực Nội Dung**:
  ```tsx
  <div className="flex-1 overflow-hidden p-0">
    {/* Bảng hoặc Nội dung */}
  </div>
  ```

## 3. Tiêu Chuẩn Component Bảng
**Tham chiếu**: `frontend/src/features/staff/components/staff-list/staff-table.tsx`

- **Wrapper**: `h-full flex flex-col gap-4`
- **Vùng Cuộn (Scroll Area)**: `flex-1 overflow-auto bg-background border relative`
- **Phần tử Bảng**: `w-full caption-bottom text-sm min-w-[800px]`
- **Header**:
  - `sticky top-0 z-10 bg-background shadow-sm`
  - `TableRow` với `hover:bg-transparent border-b-0`
  - `TableHead` background phải là `bg-background` để che nội dung khi cuộn.
- **Hàng (Rows)**: Sử dụng `AnimatedTableRow` cho hiệu ứng xuất hiện.
- **Ô (Cells)**:
  - Padding cột đầu tiên: `pl-6`
  - Padding cột cuối cùng: `pr-6`
  - Kích thước Avatar: `h-9 w-9`
- **Badges (Nhãn trạng thái)**:
  - Trạng thái (Hoạt động): `bg-emerald-500/10 text-emerald-700 border-emerald-500/20` với hiệu ứng ping.
  - Trạng thái (Ẩn/Không hoạt động): `bg-slate-500/10 text-slate-600 border-slate-500/20`.

## 4. Tiêu Chuẩn Modal/Dialog
**Tham chiếu**: `frontend/src/features/staff/components/invite-staff-modal.tsx`

- **Nút Kích Hoạt**: `size="sm" className="h-9 text-xs shadow-sm"`
- **Nội Dung Dialog**: `sm:max-w-[425px]` (cho form đơn giản) hoặc `sm:max-w-5xl` (cho form phức tạp như Dịch vụ).
- **Bố Cục Form**: `space-y-4`
- **Footer**: `DialogFooter` với thứ tự nút nhất quán (Hủy -> Xác nhận).

## 5. Kế Hoạch Hành Động cho Tính Năng Dịch Vụ
Các component sau trong `frontend/src/features/services` cần được refactor để khớp với tiêu chuẩn này:

1.  **Bố Cục Trang**: Cập nhật `frontend/src/app/(admin)/admin/services/page.tsx` (hoặc tương đương) để khớp với cấu trúc trang Nhân viên.
2.  **ServiceTable**:
    -   Đảm bảo header `sticky` với `bg-background`.
    -   Sử dụng `AnimatedTableRow`.
    -   Khớp padding (`pl-6`, `pr-6`).
    -   Cập nhật style cho Badge trạng thái.
3.  **ServiceActions**: Đảm bảo style của dropdown menu nhất quán (nếu sử dụng).
4.  **ServiceForm**:
    -   Đảm bảo kích thước `DialogContent` phù hợp.
    -   Khớp style của các nút bấm.

## 6. Các Bước Tiếp Theo
-   [ ] Refactor `ServiceTable`
-   [ ] Refactor bố cục `ServicePage`
-   [ ] Kiểm tra style của `ServiceForm`
