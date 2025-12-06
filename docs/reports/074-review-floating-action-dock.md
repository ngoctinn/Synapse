# Frontend Review: Floating Action Dock

**Ngày:** 2025-12-06
**Người thực hiện:** Antigravity
**Module:** `frontend/src/features/settings/operating-hours/components/floating-action-dock.tsx`

---

## 1. Tổng Quan
Component `FloatingActionDock` đóng vai trò là thanh công cụ thao tác nổi (Floating Action Bar) trong chế độ xem Lịch (Calendar View). Nó xuất hiện khi người dùng chọn một hoặc nhiều ngày, cung cấp các hành động nhanh như:
- Đặt trạng thái Đóng cửa/Mở cửa.
- Đặt giờ nhanh (Time Range).
- Gán nhãn sự kiện (Ngày lễ, Bảo trì...).

Mục tiêu của báo cáo này là đánh giá chất lượng mã nguồn và đề xuất giải pháp đồng bộ hóa các thao tác này với chế độ xem Danh sách (List View).

## 2. Phân Tích Kiến Trúc (FSD & Clean Code)

### 2.1. Tuân thủ Feature-Sliced Design (FSD)
- **Vị trí:** `components` nội bộ của feature `operating-hours`. Hợp lệ.
- **Imports:** Sử dụng các shared UI components (`Button`, `Popover`, `TimeInput`) và icons (`lucide-react`). Không có deep imports vi phạm.
- **Phạm vi:** Component chỉ chứa logic UI, các hành động được delegate ngược ra ngoài thông qua prop `onAction`. Thiết kế tốt (Dumb Component).

### 2.2. Chất Lượng Mã Nguồn (Code Quality)
> [!WARNING]
> **Các vấn đề cần Refactor ngay:**

1.  **Sử Dụng `any` Type:**
    - `payload?: any` trong `FloatingActionDockProps`.
    - `TooltipButton` nhận props kiểu `any`.
    - **Tác động:** Mất type safety, khó bảo trì khi payload thay đổi.
    - **Giải pháp:** Định nghĩa Discriminated Union cho `ActionPayload`.

2.  **Magic Strings:**
    - Các giá trị action `'lock'`, `'time'`, `'type'`, `'clear'` được hardcode rải rác.
    - **Giải pháp:** Tạo Enum hoặc Constant `dockActions` để chia sẻ giữa component và container.

3.  **Component Định Nghĩa Nội Bộ:**
    - `TooltipButton` được định nghĩa trong cùng file.
    - **Giải pháp:** Nên tách ra file riêng nếu tái sử dụng, hoặc giữ nguyên nhưng phải type đầy đủ.

4.  **Hardcoded Colors:**
    - `bg-primary`, `bg-foreground/95`.
    - Cần kiểm tra lại với Design System để đảm bảo nhất quán với `TableActionBar`.

## 3. UI/UX & Đồng Bộ Hóa (List View Sync)

### 3.1. Đánh giá UI hiện tại
- **Ưu điểm:** Animation mượt mà (`framer-motion`), hiệu ứng blur (`backdrop-blur-md`) tạo cảm giác Premium.
- **Nhược điểm:**
    - Vị trí `fixed bottom-6` có thể che mất nội dung footer hoặc pagination nếu danh sách dài (trong trường hợp List View).
    - Logic hiển thị count "ngày đã chọn" hơi cứng nhắc với text.

### 3.2. Đề Xuất Đồng Bộ Với List View (`ExceptionsTable`)
Hiện tại, `ExceptionsTable` (chế độ xem danh sách) sử dụng `TableActionBar` tiêu chuẩn, nhưng **thiếu các chức năng thao tác nhanh** mà Dock đang có (chỉ có nút Xóa). Để đồng bộ trải nghiệm người dùng, đề xuất như sau:

#### Phương Án: Hợp Nhất Logic Thao Tác (Recommended)
Tận dụng prop `extraActions` của `TableActionBar` để đưa các nút chức năng từ Dock vào Table.

1.  **Tách Component `QuickActionsGroup`:**
    - Tách phần nút "Đóng cửa", "Giờ", "Nhãn" từ `FloatingActionDock` ra thành một component riêng `OperatingHoursActions`.
    - Component này nhận vào `onAction` handler.

2.  **Tái Sử Dụng Trong List View:**
    - Trong `ExceptionsTable`, truyền `OperatingHoursActions` vào slot `extraActions` của `TableActionBar`.
    - Kết quả: Người dùng tick chọn nhiều dòng trong bảng -> Thanh Action Bar hiện lên -> Có đầy đủ nút Đóng/Mở/Gán nhãn như bên Lịch.

3.  **Refactor Container:**
    - `ExceptionsViewManager` (hoặc container cha) cần xử lý `onAction` thống nhất cho cả 2 view. Logic xử lý "Gán giờ cho N ngày đã chọn" là giống hệt nhau về mặt dữ liệu.

## 4. Kế Hoạch Hành Động (Refactoring Plan)

### Bước 1: Type Safety & Constants
- Tạo `src/features/settings/operating-hours/model/action-types.ts`:
  ```typescript
  export type DockActionType = 'lock' | 'time' | 'type' | 'clear';
  export type DockActionPayload = {
      type: DockActionType;
      data?: { start: string; end: string } | string; // TimeRange or LabelType
  };
  ```
- Refactor `FloatingActionDock` để dùng types này.

### Bước 2: Extract Sub-Components
- Tách `TooltipButton` và các Popover (Time, Label) ra thành `OperatingHoursActions`.
- Đảm bảo component này chỉ render các nút, không bao gồm wrapper "Dock".

### Bước 3: Integrate vào List View
- Sửa `ExceptionsTable.tsx`:
  - Import `OperatingHoursActions`.
  - Truyền vào `TableActionBar` qua prop `extraActions`.
  - Kết nối handler `onAction` của Table với logic update dữ liệu.

### Bước 4: Clean Up
- Xóa code trùng lặp trong `FloatingActionDock`.
- Đồng bộ style (màu sắc, border radius) giữa Dock và TableActionBar để trải nghiệm liền mạch khi chuyển view.

---
*Báo cáo này phục vụ workflow `/frontend-refactor`. Vui lòng tham chiếu đường dẫn file này khi thực hiện sửa đổi.*
