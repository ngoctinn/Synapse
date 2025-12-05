# Báo Cáo Đánh Giá Frontend: Table Components

**Ngày:** 2025-12-05
**Đối Tượng:** Các thành phần bảng dữ liệu (`ServiceTable`, `SkillTable`, `StaffTable`, `PermissionMatrix`).

## 1. Tổng Quan & Cấu Trúc (FSD)
- **Tuân thủ:** Các bảng được đặt đúng vị trí trong `features/*/components`.
- **Public API:** Các module `staff`, `services` đều có `index.ts`, tuân thủ đóng gói tốt.
- **Dependency:** Các bảng đều tái sử dụng `shared/ui/table` và `shared/ui/custom/*` (EmptyState, Skeleton, Pagination), cho thấy tư duy tái sử dụng tốt.

## 2. Đánh Giá UI/UX & Tính Nhất Quán (Consistency)

### 2.1. Điểm Tốt
- **Micro-interactions:** Sử dụng `AnimatedTableRow` tạo cảm giác mượt mà khi load dữ liệu (trừ `PermissionMatrix`).
- **Empty States:** Sử dụng thống nhất `DataTableEmptyState` với hình ảnh/icon minh họa.
- **Visual Hierarchy:** Badge và Avatar được sử dụng hợp lý để làm nổi bật thông tin quan trọng.

### 2.2. Điểm Không Đồng Nhất (Cần Fix)
| Tiêu chí | Service/Skill/Staff Table | Permission Matrix | Vấn đề |
| :--- | :--- | :--- | :--- |
| **Header Height** | `--header-height` | `--staff-header-height` | Sử dụng biến CSS khác nhau gây khó khăn khi bảo trì global layout. |
| **Padding Cột Đầu** | `pl-8` | `pl-6` | Lệch lạc visual khi chuyển giữa các tab. |
| **Row Animation** | Có (`AnimatedTableRow`) | Không | Trải nghiệm không đồng bộ. |
| **Cấu trúc Sticky** | `top-[var(--header-height-mobile,109px)] md:top-[var(--header-height,57px)]` | Tương tự nhưng dùng biến `staff-*` | Logic sticky bị lặp lại (Duplicate Code) và hardcode giá trị fallback. |

### 2.3. Đánh Giá Code (Next.js 16/Clean Code)
- **Duplicate Logic:** Logic tính toán sticky header và cấu trúc `<table>` bao bọc bên trong thẻ `div` với class phức tạp được copy-paste ở tất cả các file.
- **Manual Table Construction:** Hiện tại đang dựng table thủ công thay vì dùng một wrapper component `DataTable` chung, dẫn đến rủi ro "quên" cập nhật style ở 1 chỗ khi thay đổi design system.

## 3. Kiến Nghị Cải Tiến (Implementation Plan)

### Ngắn hạn (Refactor Consistency)
1.  **Unify Padding:** Thống nhất `pl-8` cho tất cả các bảng (chuẩn Spacious Premium).
2.  **Unify Header Variables:** Thay thế toàn bộ `--staff-header-height` bằng `--header-height` trong global CSS hoặc component, đảm bảo đồng bộ hệ nhúng.
3.  **Apply Animation:** Áp dụng `AnimatedTableRow` cho `PermissionMatrix` (nếu không ảnh hưởng hiệu năng render số lượng lớn items).

### Dài hạn (New Component)
- Xây dựng component `DataTable` (hoặc `SmartTable`) trong `shared/ui/custom`:
    - Nhận vào `columns` và `data` (giống TanStack Table nhưng đơn giản hóa cho UI hiện tại).
    - Tự động xử lý Sticky Header, Pagination, Empty State.
    - Giảm thiểu boilerplate code trong các feature components.

## 4. Kết Luận
Thiết kế hiện tại đẹp và hiện đại (Premium feel), tuy nhiên việc triển khai thủ công từng bảng dẫn đến nợ kỹ thuật nhỏ về tính nhất quán. Cần thực hiện **Refactor Ngắn hạn** ngay để đảm bảo trải nghiệm người dùng liền mạch.
