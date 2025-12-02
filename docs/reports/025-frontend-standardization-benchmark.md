# Báo Cáo Đánh Giá & Chuẩn Hóa Frontend (Benchmark: Staff Page)

**Ngày:** 02/12/2025
**Người thực hiện:** AI Assistant
**Mục tiêu:** Thiết lập trang `Staff` (/admin/staff) làm chuẩn mực thiết kế (Benchmark) và đánh giá độ lệch chuẩn của các trang khác.

---

## 1. Định Nghĩa Chuẩn Mực (The Benchmark)

Dựa trên phân tích `src/app/(admin)/admin/staff/page.tsx` và các components liên quan, chuẩn mực thiết kế cho trang quản lý dạng danh sách (List View) được định nghĩa như sau:

### 1.1. Cấu Trúc Trang (Page Layout)
*   **Container**: Full height `h-[calc(100vh-6rem)]`, Flex column, nền trắng `bg-white`.
*   **Header**:
    *   Chiều cao cố định, `flex items-center justify-between`.
    *   Padding `px-4 py-3`, border bottom `border-b`.
    *   **Title**: `text-lg font-semibold`.
    *   **Actions**: Nút hành động chính (VD: "Thêm nhân viên") nằm bên phải.
*   **Content Area**: `flex-1 overflow-hidden p-0` (để Table tự scroll bên trong).

### 1.2. Bảng Dữ Liệu (Data Table)
*   **Component**: Sử dụng `Table` từ `shared/ui/table`.
*   **Header**: Sticky `top-0`, `z-10`, nền `bg-background`.
*   **Rows**: Sử dụng `AnimatedTableRow` cho hiệu ứng xuất hiện.
*   **Columns**:
    *   **Avatar + Info**: Avatar `h-9 w-9` + Tên (`font-medium`) + Subtext (`text-xs text-muted-foreground`).
    *   **Badge**: Sử dụng `Badge` cho trạng thái/vai trò.
    *   **Status Indicator**: Badge có hiệu ứng "ping" cho trạng thái Active (`animate-ping`).
*   **Pagination**: Component `PaginationControls` đặt tại `px-4 pb-4` dưới cùng.
*   **Empty State**: Component `DataTableEmptyState` với icon và mô tả rõ ràng.
*   **Loading**: `Skeleton` mô phỏng cấu trúc bảng (Header + Rows).

### 1.3. Hành Động (Actions)
*   **Row Actions**: Sử dụng `DropdownMenu` với nút trigger là `Button variant="ghost"` icon `MoreHorizontal`.
*   **Icons**: Lucide React icons (`Pencil`, `Trash2`, `KeyRound`).

---

## 2. Đánh Giá Độ Lệch Chuẩn (Gap Analysis)

### 2.1. Trang Dịch Vụ (/admin/services)
*   **Đánh giá**: **ĐẠT CHUẨN CAO (95%)**.
*   **Điểm tốt**:
    *   Tuân thủ hoàn toàn cấu trúc Layout và Table của Benchmark.
    *   Sử dụng đúng các components `AnimatedTableRow`, `Badge`, `PaginationControls`.
*   **Điểm vượt trội (Cần cập nhật ngược lại Benchmark)**:
    *   **Logic Phân trang**: Sử dụng URL Search Params (`?page=1`) để quản lý state, hỗ trợ bookmark/share link. (Trang Staff hiện đang hardcode `page={1}`).
    *   **Data Fetching**: Sử dụng `Promise.all` để fetch song song dữ liệu (Services + Skills).
*   **Điểm lệch**:
    *   `ServiceTableSkeleton` có cấu trúc hơi khác `StaffTableSkeleton` (thiếu skeleton cho header row).

### 2.2. Trang Lịch Hẹn (/admin/appointments)
*   **Đánh giá**: **CHƯA ĐẠT (0%)**.
*   **Tình trạng**: Placeholder ("Tính năng đang được phát triển").
*   **Hành động**: Cần implement mới hoàn toàn dựa trên Benchmark.

### 2.3. Trang Tin Nhắn (/admin/messages) & Thông Báo (/admin/notifications)
*   **Đánh giá**: **CHƯA ĐẠT (0%)**.
*   **Tình trạng**: Placeholder.

### 2.4. Trang Tổng Quan (/admin/overview)
*   **Đánh giá**: **N/A (Dashboard Pattern)**.
*   **Nhận xét**: Không áp dụng chuẩn Table, nhưng tuân thủ tốt Design System (Spacing, Colors, Cards).

---

## 3. Kế Hoạch Hành Động (Action Plan)

### Giai đoạn 1: Chuẩn hóa Logic (Critical)
*   **Refactor `StaffPage`**: [x] Đã hoàn thành. Cập nhật logic phân trang của trang Benchmark để khớp với "Best Practice" từ trang Services (sử dụng URL Search Params).

### Giai đoạn 2: Đồng bộ UI (Minor)
*   **Standardize Skeletons**: [x] Đã hoàn thành. Tạo component `DataTableSkeleton` chung và áp dụng cho Staff/Services.

### Giai đoạn 3: Triển khai các trang còn thiếu
*   **Implement `AppointmentsPage`**: [x] Đã hoàn thành. Xây dựng dựa trên cấu trúc của `StaffPage` với dữ liệu mẫu.
*   **Implement `MessagesPage`**: [ ] Chưa thực hiện (Cần Benchmark riêng).

---

## 4. Kết Luận
Trang `Staff` là chuẩn mực tuyệt vời về **Giao diện (UI)**, nhưng trang `Services` lại là chuẩn mực tốt hơn về **Logic (Implementation)**. Cần kết hợp ưu điểm của cả hai để tạo ra "Golden Standard" thực sự.
