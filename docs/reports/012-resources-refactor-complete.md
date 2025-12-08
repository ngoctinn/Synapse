# Báo Cáo Refactor: Resources Feature

## 1. Mục Tiêu
Đồng nhất trải nghiệm người dùng (UX) và Codebase giữa tính năng `Resources` và `Staff` mới refactor.

## 2. Các Thay Đổi Thực Hiện

### A. UI/UX Consistency (Sheet vs Dialog)
- **Trước**: Sử dụng `Dialog` (Modal giữa màn hình) cho việc Thêm/Sửa tài nguyên.
- **Sau**: Chuyển sang sử dụng `Sheet` (Drawer trượt từ phải) kích thước `sm:max-w-md`.
- **Lợi ích**:
  - Đồng nhất với `Staff Feature` và `Service Feature`.
  - Giữ ngữ cảnh người dùng tốt hơn (vẫn nhìn thấy danh sách phía sau).
  - Phù hợp với form nhập liệu dài.

### B. Form Refactoring (Layout & Fields)
- **Single Column Layout**: Chuyển đổi toàn bộ Grid 2 cột sang 1 cột vertical stack.
  - Tối ưu cho scanning pattern.
  - Tránh vỡ layout trên mobile.
- **Image Placeholder**: Thêm UI placeholder cho hình ảnh tài nguyên (Feature Parity với Staff Avatar).
- **Styling**: Cập nhật `Input`, `Select`, `Textarea` background thành `bg-background` để nổi bật trên nền Sheet.

### C. Code Organization
- Renamed `resource-dialog.tsx` -> `resource-sheet.tsx`.
- Updated `ResourceTable` và `ResourceToolbar` để sử dụng component mới.
- Updated Public API (`index.ts`).

## 3. Note cho Dev
- Logic `createResource`/`updateResource` hiện vẫn đang dùng mô hình `Promise` + `toast` trực tiếp bên Client Component (`useState`).
- **TODO Future**: Nâng cấp lên `useActionState` (Server Actions hook) giống như `StaffSheet` để handle loading/error state chuẩn React 19 hơn.

## 4. Kết Quả Review
- [x] UI đồng nhất (Premium Standard).
- [x] Form dễ đọc, dễ thao tác.
- [x] Không còn code rác (Dialog cũ).
