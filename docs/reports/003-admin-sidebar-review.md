# Báo cáo Đánh giá Sidebar Component (Layout & Frontend Review)

**Ngày thực hiện:** 07/12/2025
**Phạm vi:** `features/admin/components/sidebar.tsx`, `sidebar-item.tsx`, `constants.ts`

---

## 1. Kết quả Đánh Giá FSD & Clean Code

### ✅ Điểm tốt
- **Public API:** `features/admin/index.ts` export đúng chuẩn, không leak chi tiết nội bộ.
- **Tách Constants:** Danh sách menu `SIDEBAR_ITEMS` được tách ra file `constants.ts`, giúp dễ cấu hình.
- **Component Granularity:** Việc tách `SidebarItem` (trên 170 dòng) khỏi `AdminSidebar` là quyết định đúng đắn, giúp file `sidebar.tsx` rất gọn (~60 dòng).
- **Type Safety:** Định nghĩa type `SidebarItem` rõ ràng, hỗ trợ nested items.

### ⚠️ Điểm cần cải thiện
- **Logic Phức Tạp trong `SidebarItem`:** Component này đang xử lý cả 3 trạng thái:
  1.  Collapsed (Dropdown Menu).
  2.  Expanded & Has Submenu (Collapsible).
  3.  Expanded & Single Item (Link).
  -> *Việc nhồi nhét logic này khiến JSX bị phân mảnh (Fragmented JSX).*

- **Import Cycle Tiềm Ẩn:** `SidebarItem` import type từ `../constants`, trong khi constant lại define type ngay trong đó. (Hiện tại ko sao, nhưng nên tách `types.ts` riêng).

---

## 2. Kết quả Đánh Giá Layout & UX

### ✅ Điểm tốt
- **Animation:** Sử dụng `motion-safe:hover:translate-x-1`, `active:scale-[0.98]` tạo cảm giác native app rất tốt.
- **Tree View Line:** Đường kẻ nối submenu (Vertical line) được vẽ bằng pseudo-elements (`before`, `after`) rất tinh tế.
- **Responsive:** Xử lý tốt trạng thái `[collapsible=icon]` (Thu gọn thành icon).

### ⚠️ Điểm cần cải thiện (Layout Polish)

| Mức Độ | Vấn Đề | Giải Pháp |
|--------|--------|-----------|
| **Thấp** | **Overflow Text** | `SidebarMenuButton` chưa có `truncate` cho text. Nếu tên menu dài sẽ vỡ layout khi sidebar mở. |
| **Thấp** | **Keyboard Focus** | Drodown Menu (`state === "collapsed"`) chưa đồng bộ style focus ring với Sidebar Menu Button thường. |
| **Thấp** | **Active State Mismatch** | Logic `isActive` cho Submenu dùng `startsWith` có thể highlight nhầm nếu các route trùng prefix (ví dụ `/staff` và `/staff-logs`). |

---

## 3. Đề xuất hành động

1.  **Refactor `SidebarItem`**: Chia nhỏ thành 3 sub-components nội bộ để dễ đọc:
    *   `SidebarItem collapsed` (Dropdown)
    *   `SidebarItem expanded-nested` (Collapsible)
    *   `SidebarItem expanded-single` (Link)
    *   *Tuy nhiên, với độ dài 170 dòng hiện tại, việc tách này là "Nice to have", chưa phải khẩn cấp.*

2.  **Fix Active State**:
    *   Sửa logic check active chính xác hơn (Exact match cho leaf nodes).

3.  **UI Polish**:
    *   Thêm `truncate` vào span chứa title.
    *   Thêm tooltip cho button single item khi sidebar expanded (hiện tại chỉ có khi collapsed).

Bạn có muốn tôi thực hiện **UI Polish** (Mục 3) để hoàn thiện chi tiết không?
