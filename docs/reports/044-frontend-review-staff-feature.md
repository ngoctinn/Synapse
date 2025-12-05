# Báo Cáo Đánh Giá Frontend: Staff Feature

**Ngày:** 05/12/2025
**Người thực hiện:** AI Assistant
**Phạm vi:**
- `frontend/src/features/staff/components/staff-list/staff-table.tsx`
- `frontend/src/features/staff/components/permissions`
- `frontend/src/features/staff/components/scheduling`
- `frontend/src/app/(admin)/admin/staff/page.tsx`

---

## 1. Đánh Giá Kiến Trúc (FSD & Modular Monolith)

### ✅ Điểm Tốt
- **Cấu trúc thư mục:** Tuân thủ tốt FSD. Các component được chia nhỏ vào các thư mục con (`permissions`, `scheduling`, `staff-list`) hợp lý.
- **Public API:** `frontend/src/features/staff/index.ts` export đầy đủ các component cần thiết, đảm bảo tính đóng gói.
- **Thin Page:** `page.tsx` rất gọn, chỉ thực hiện data fetching (parallel fetching) và truyền props xuống `StaffPage`. Logic UI được tách biệt hoàn toàn.
- **Server Actions:** Các hành động (actions) được định nghĩa trong `actions.ts` với `use server`, tách biệt logic server khỏi client components.

### ⚠️ Cần Cải Thiện
- **Type Safety:**
    - `frontend/src/features/staff/components/staff-page.tsx`: Prop `initialSchedules` đang dùng `any[]`.
    - `frontend/src/features/staff/actions.ts`: Hàm `updateSchedule` nhận tham số `schedule: any`.
    - **Khuyến nghị:** Định nghĩa và sử dụng type `Schedule` chính xác từ `types.ts` để đảm bảo type safety.

---

## 2. Chất Lượng Mã Nguồn (Clean Code & Next.js 16)

### ✅ Điểm Tốt
- **Async/Await:** Sử dụng đúng chuẩn Next.js 15+ trong `page.tsx` (`await searchParams`, `await` các promise data fetching).
- **Optimistic Updates:** `staff-scheduler.tsx` và `permission-matrix.tsx` đều cài đặt cập nhật lạc quan (optimistic UI) giúp trải nghiệm người dùng mượt mà.
- **Feedback:** Sử dụng `sonner` để hiển thị thông báo (toast) cho người dùng.

### ⚠️ Vấn đề & Refactor
1.  **Hardcoded Sticky Header Offset:**
    - Các file `staff-table.tsx`, `permission-matrix.tsx`, `schedule-grid.tsx` đều sử dụng `top-[52px]` cho sticky header.
    - **Rủi ro:** Nếu chiều cao header chính thay đổi, layout sẽ bị vỡ hoặc chồng chéo.
    - **Giải pháp:** Sử dụng CSS variable (ví dụ: `top-[var(--header-height)]`) hoặc một hằng số được định nghĩa chung.

2.  **Inconsistent Server Action Usage:**
    - `permission-matrix.tsx` sử dụng `useTransition` để quản lý trạng thái pending khi gọi server action.
    - `staff-scheduler.tsx` gọi trực tiếp `await updateSchedule(...)` mà không dùng `useTransition`.
    - **Giải pháp:** Nên thống nhất sử dụng `useTransition` cho tất cả các gọi server action để quản lý trạng thái loading/pending đồng nhất.

3.  **Mock Data:**
    - Vẫn còn sử dụng `MOCK_SHIFTS` và mock data trong `actions.ts` (`getPermissions`, `getSchedules`).
    - **Lưu ý:** Cần kế hoạch thay thế bằng dữ liệu thật từ DB khi backend sẵn sàng.

---

## 3. Đánh Giá UI/UX (Premium & Detail)

### ✅ Điểm Sáng
- **Bulk Save Bar:** Component `BulkSaveBar` trong Permissions rất hữu ích, giúp người dùng biết mình đã thay đổi gì và có thể lưu/hoàn tác hàng loạt.
- **Paint Mode:** Chế độ "Tô" (Paintbrush) trong Scheduler là một tính năng UX tuyệt vời cho việc xếp lịch nhanh.
- **Visual Feedback:** `AnimatedTableRow` và các hiệu ứng hover, pulse animation cho trạng thái hoạt động rất tốt.

### 💡 Đề Xuất Cải Tiến
1.  **Responsive Table/Grid:**
    - `min-w-[800px]` (StaffTable) và `min-w-[1000px]` (ScheduleGrid) gây scroll ngang trên màn hình nhỏ.
    - **Đề xuất:** Xem xét chế độ hiển thị dạng Card cho mobile/tablet hoặc tối ưu độ rộng cột.

2.  **Sticky Header Context:**
    - Header của `StaffPage` (`TabsList`, `SearchInput`, `Filter`) cũng nên sticky để khi scroll xuống xem danh sách dài, người dùng vẫn có thể thao tác lọc/tìm kiếm. Hiện tại code đã có `sticky top-0` nhưng cần kiểm tra kỹ tương tác với `top-[52px]` của các bảng bên dưới.

3.  **Empty States:**
    - `StaffTable` đã có `DataTableEmptyState`. Cần đảm bảo `ScheduleGrid` cũng có trạng thái hiển thị tốt khi chưa có lịch làm việc nào.

---

## 4. Kế Hoạch Hành Động (Refactor Plan)

Để thực hiện sửa đổi, hãy chạy workflow `/frontend-refactor` với các nhiệm vụ sau:

1.  [x] **Fix Types:** Thay thế `any` bằng `Schedule` type trong `StaffPage` và `actions.ts`.
2.  [x] **Standardize Sticky Offsets:** Thay thế `top-[52px]` bằng biến hoặc tính toán động dựa trên layout hiện tại.
3.  [x] **Unify Server Action Calls:** Refactor `staff-scheduler.tsx` để sử dụng `useTransition`.
4.  [x] **Review Mobile Responsiveness:** Kiểm tra và tinh chỉnh hiển thị trên màn hình nhỏ.

---
*Báo cáo được tạo tự động bởi AI Assistant.*
