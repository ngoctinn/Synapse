# Báo Cáo Đánh Giá Frontend: Staff Feature

**Ngày:** 30/11/2025
**Người thực hiện:** Antigravity
**Phạm vi:** `frontend/src/features/staff`

---

## 1. Đánh Giá Kiến Trúc (FSD & Next.js 16)

### ✅ Điểm Tốt
- **Cấu trúc FSD**: Module `staff` tuân thủ tốt cấu trúc Feature-Sliced Design.
  - Có file `index.ts` đóng vai trò Public API, export rõ ràng các component và type cần thiết.
  - Không phát hiện "Deep Imports" từ các module khác vào nội bộ `staff`.
- **Thin Pages**: `src/app/(admin)/admin/staff/page.tsx` là một thin page điển hình, chỉ import `StaffPage` từ feature và render, không chứa logic nghiệp vụ.
- **Phân chia thư mục**: Các component được tổ chức hợp lý vào `components/`, `data/`, `permissions/`, `scheduling/`, `staff-list/`.

### ⚠️ Vi Phạm & Cần Cải Thiện

#### A. Data Fetching & Server Actions (Nghiêm trọng)
- **Vấn đề**: `invite-staff-modal.tsx` đang thực hiện gọi API trực tiếp từ Client Component (`fetch('/users/invite')`) bên trong hàm `onSubmit`.
  - **Vi phạm**: Next.js 16 khuyến khích sử dụng **Server Actions** cho các mutation (POST/PUT/DELETE) để tận dụng Progressive Enhancement và bảo mật tốt hơn.
  - **Hậu quả**: Lộ logic gọi API ở client, khó quản lý state loading/error tập trung, không tận dụng được `useActionState`.
- **Vấn đề**: `staff-table.tsx` đang sử dụng dữ liệu giả `MOCK_STAFF`.
  - **Cần làm**: Cần chuyển sang fetch data từ Server (thông qua Server Component cha hoặc `useQuery` nếu cần client-side filtering phức tạp, nhưng ưu tiên fetch tại Server Component `StaffPage` hoặc `page.tsx` rồi truyền xuống).
- **Vấn đề**: `staff-actions.tsx` có hàm `handleDelete` chỉ `console.log` và dùng `setTimeout` giả lập. Cần chuyển thành Server Action `deleteStaff`.

#### B. Clean Code & Localization
- **Hardcoded Strings**: Trong `invite-staff-modal.tsx` có các chuỗi cứng như "Bạn chưa đăng nhập", "Có lỗi xảy ra". Nên tách ra constant hoặc file config để dễ quản lý (dù đã là tiếng Việt).
- **TODOs**: Có comment `// TODO: Implement skills later` và `skill_ids: []` trong `invite-staff-modal.tsx`. Cần hoàn thiện logic này.
- **Comments**: Thiếu comments giải thích nghiệp vụ phức tạp (nếu có). Code hiện tại khá dễ hiểu nhưng nên thêm docstring cho các hàm quan trọng.

---

## 2. Đánh Giá UX/UI (Premium & WOW Factor)

### 🎨 Hiện Tại
- Giao diện sử dụng Shadcn UI, sạch sẽ và nhất quán với Design System.
- Bố cục `Tabs` trong `StaffPage` hợp lý.

### 🚀 Đề Xuất Cải Tiến (Brainstorming)
1.  **Micro-animations**:
    - Thêm hiệu ứng `motion.tr` (framer-motion) cho các hàng trong `StaffTable` khi render lần đầu (staggered fade-in).
    - Hover effect cho các hàng: Highlight nhẹ background và hiển thị rõ hơn các nút Action.
2.  **Loading States**:
    - Thay vì để trống hoặc loading spinner đơn điệu, hãy sử dụng **Skeleton UI** mô phỏng cấu trúc bảng khi đang tải dữ liệu thật.
3.  **Empty States**:
    - Thiết kế Empty State đẹp mắt hơn cho bảng nhân viên khi chưa có dữ liệu (kèm hình minh họa và nút "Mời nhân viên" to rõ).
4.  **Feedback**:
    - Cải thiện thông báo lỗi trong Modal. Hiện tại dùng `toast.error` là tốt, nhưng có thể highlight field bị lỗi đỏ rõ hơn (FormMessage đã có nhưng cần kiểm tra trải nghiệm thực tế).

---

## 3. Kế Hoạch Hành Động (Refactor Plan)

Để nâng cấp module này đạt chuẩn Production và Next.js 16, cần thực hiện các bước sau:

1.  **Tạo Server Actions**:
    - Tạo `frontend/src/features/staff/actions.ts`.
    - Implement `inviteStaff`, `deleteStaff`, `updateStaff` sử dụng `createClient` (Supabase) và `revalidatePath`.
2.  **Refactor Components**:
    - **`invite-staff-modal.tsx`**: Chuyển sang dùng `useActionState` (hoặc `useTransition` kết hợp Server Action) thay vì `fetch` thủ công.
    - **`staff-table.tsx`**: Nhận data từ props thay vì import `MOCK_STAFF`.
    - **`staff-page.tsx`**: Fetch data staff list tại đây (Server Component) và truyền xuống `StaffTable`.
3.  **Hoàn thiện tính năng**:
    - Xử lý logic `skills` trong form mời nhân viên.
    - Kết nối API thực tế.
4.  **Nâng cấp UI**:
    - Thêm Skeleton Loading.
    - Thêm Animation nhẹ nhàng.

---

**Lệnh thực thi tiếp theo:**
Chạy workflow `/frontend-refactor` và cung cấp đường dẫn file báo cáo này để tiến hành sửa đổi.
