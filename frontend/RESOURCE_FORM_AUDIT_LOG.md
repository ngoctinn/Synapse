# AUDIT LOG: Kiểm tra Code Interface & UI/UX
## File: `resource-form.tsx`
**Ngày kiểm tra:** 2025-12-12
**Baseline tham chiếu:** `staff-form.tsx`, Design System (`input.tsx`, `select.tsx`, `design-system.types.ts`)

---

## I. Vấn đề Interface & Props Naming

| ID | Vị trí (File/Component) | Mô tả chi tiết sự bất nhất | Loại lỗi | Yêu cầu chỉnh sửa |
|----|-------------------------|----------------------------|----------|-------------------|
| UI-001 | `resource-form.tsx:96-97` | **Icon size không đồng nhất:** Sử dụng `className="size-4"` cho icon trong Input, trong khi `staff-form.tsx:107` sử dụng `size={18}` prop trực tiếp trên Lucide icon. | Props Naming | Thống nhất dùng `size={18}` hoặc `className="size-4"` cho toàn bộ project. Ưu tiên `size={18}` vì tường minh hơn. |
| UI-002 | `resource-form.tsx:116` | **Tương tự UI-001:** `<Barcode className="size-4" />` thay vì `size={18}`. | Props Naming | Đổi thành `<Barcode size={18} />` |
| UI-003 | `resource-form.tsx:145` | **Tương tự UI-001:** `<Box className="size-4" />` thay vì `size={18}`. | Props Naming | Đổi thành `<Box size={18} />` |
| UI-004 | `resource-form.tsx:190, 208, 232, 255` | **Lặp lại lỗi UI-001:** Các icon `Activity`, `Clock`, `Users` dùng `className="size-4"`. | Props Naming | Đổi tất cả thành `size={18}` |
| UI-005 | `resource-form.tsx:29-33` | **Props interface không đầy đủ:** Thiếu `isLoading?: boolean` và `disabled?: boolean` trong `ResourceFormProps` để xử lý trạng thái form. | Props Naming | Bổ sung props: `isLoading?: boolean; disabled?: boolean;` |

---

## II. Vấn đề Design System Compliance

| ID | Vị trí (File/Component) | Mô tả chi tiết sự bất nhất | Loại lỗi | Yêu cầu chỉnh sửa |
|----|-------------------------|----------------------------|----------|-------------------|
| DS-001 | `resource-form.tsx:78` | **Hardcoded màu sắc:** Sử dụng `bg-yellow-100 text-yellow-700` trực tiếp thay vì sử dụng CSS variable của Design System. | Style | Đổi thành sử dụng semantic token: `bg-warning/10 text-warning` hoặc tạo biến mới `--badge-coming-soon-bg/fg`. |
| DS-002 | `resource-form.tsx:63` | **Hardcoded background:** `bg-muted/30 hover:bg-muted/50` không nhất quán với chuẩn `bg-muted/20` được sử dụng trong `staff-form.tsx:88`. | Style | Thống nhất thành `bg-muted/20` hoặc sử dụng semantic token. |
| DS-003 | `resource-form.tsx:65` | **Size không chuẩn hóa:** `size-20` cho avatar container, trong khi `staff-form.tsx:89` dùng `size-12`. | Style | Thống nhất kích thước Avatar upload section giữa các form (nên dùng `size-16` cho tài nguyên hoặc `size-12` nếu muốn đồng bộ). |
| DS-004 | `resource-form.tsx:189` | **Hardcoded màu thông báo:** `bg-blue-50 text-blue-700 border-blue-100` không thuộc Design System. | Style | Đổi thành: `bg-info/10 text-info border-info/20` hoặc sử dụng Alert component chuẩn. |
| DS-005 | `resource-form.tsx:49, 52` | **Spacing không nhất quán:** `className="space-y-4"` trong TabsContent, trong khi `staff-form.tsx:69` dùng thêm `border rounded-lg bg-card p-4`. | Style | Thêm styling wrapper cho TabsContent: `className="space-y-4 border rounded-lg bg-card p-4"` |
| DS-006 | `resource-form.tsx:61, 87, 107, 194` | **Gap/spacing không đồng nhất:** Sử dụng nhiều giá trị `gap-6`, `gap-4` không nhất quán. `staff-form.tsx` nhất quán dùng `gap-4`. | Style | Thống nhất dùng `gap-4` cho các grid và `space-y-4` cho vertical spacing trong form. |
| DS-007 | `resource-form.tsx:93, 113, 132, 169, 200, 229, 252, 278` | **FormLabel không có dấu `*` cho required fields:** Các field bắt buộc đang inline `<span className="text-destructive">*</span>` thay vì dùng pattern chuẩn. | Style | Tạo component `RequiredMark` hoặc prop `required` cho FormLabel để tự động hiển thị dấu `*`. |
| DS-008 | `resource-form.tsx:65` | **Border style không chuẩn:** `border-2 border-dashed` thay vì chuẩn `border border-dashed` trong `staff-form.tsx:89`. | Style | Thống nhất dùng `border border-dashed`. |

---

## III. Vấn đề Logic UI (Trạng thái chưa xử lý)

| ID | Vị trí (File/Component) | Mô tả chi tiết sự bất nhất | Loại lỗi | Yêu cầu chỉnh sửa |
|----|-------------------------|----------------------------|----------|-------------------|
| LG-001 | `resource-form.tsx:35-57` | **Không có Loading State:** Form không xử lý trạng thái khi `groups` đang loading hoặc rỗng (`groups.length === 0`). | Logic UI | Thêm kiểm tra: `if (groups.length === 0) return <EmptyState message="Chưa có nhóm tài nguyên" />` hoặc Skeleton component. |
| LG-002 | `resource-form.tsx:150-156` | **Empty State trong Select:** Không có fallback UI khi `groups` rỗng trong SelectContent. | Logic UI | Thêm: `{groups.length === 0 && <SelectItem value="__empty" disabled>Chưa có nhóm</SelectItem>}` |
| LG-003 | `resource-form.tsx:281-282` | **Props TagInput không sử dụng:** `options={[]}` và `selectedIds={[]}` luôn truyền mảng rỗng, không có logic để load tags có sẵn. | Logic UI | Review lại business logic: Nếu có tags có sẵn từ API, cần truyền vào `options`. |
| LG-004 | `resource-form.tsx:139` | **Select không có `value` binding:** Sử dụng `defaultValue={field.value}` thay vì `value={field.value}` sẽ không reactive khi form reset. | Logic UI | Đổi thành `value={field.value}` để đảm bảo controlled component. |
| LG-005 | `resource-form.tsx:203` | **Tương tự LG-004:** Select "Trạng thái" dùng `defaultValue`. | Logic UI | Đổi thành `value={field.value}`. |
| LG-006 | `resource-form.tsx:245-268, 271-298` | **Conditional render chưa hoàn chỉnh:** Khi switch giữa ROOM/EQUIPMENT, animation chỉ có `animate-in` mà không có `animate-out`. | Logic UI | Cân nhắc sử dụng `AnimatePresence` từ Framer Motion hoặc CSS transition group để xử lý exit animation. |
| LG-007 | `resource-form.tsx:36` | **useFormContext không có fallback:** Nếu component được render ngoài FormProvider sẽ crash. | Logic UI | Thêm kiểm tra: `const form = useFormContext(); if (!form) throw new Error("ResourceForm phải được wrap trong FormProvider")` |

---

## IV. Vấn đề Accessibility (a11y)

| ID | Vị trí (File/Component) | Mô tả chi tiết sự bất nhất | Loại lỗi | Yêu cầu chỉnh sửa |
|----|-------------------------|----------------------------|----------|-------------------|
| A11Y-001 | `resource-form.tsx:63-85` | **Thiếu role và aria-label:** Block upload image không có `role="img"` hoặc `aria-label` mô tả. | Accessibility | Thêm `role="figure"` và `aria-label="Khu vực tải ảnh tài nguyên"`. |
| A11Y-002 | `resource-form.tsx:95-100` | **Input không có aria-describedby:** Khi có lỗi validation, screen reader không biết liên kết với FormMessage. | Accessibility | Shadcn/UI Form đã xử lý, nhưng cần verify trong runtime. |
| A11Y-003 | `resource-form.tsx:78` | **Badge "Sắp ra mắt" không có role:** Text badge không có ARIA role phù hợp. | Accessibility | Thêm `role="status"` hoặc `aria-live="polite"`. |
| A11Y-004 | `resource-form.tsx:189-192` | **Info box không có role:** Thông báo cảnh báo config không có ARIA role. | Accessibility | Đổi thành sử dụng Alert component với `role="alert"` hoặc thêm `role="note"`. |

---

## V. Vấn đề Cấu trúc & Code Quality

| ID | Vị trí (File/Component) | Mô tả chi tiết sự bất nhất | Loại lỗi | Yêu cầu chỉnh sửa |
|----|-------------------------|----------------------------|----------|-------------------|
| CQ-001 | `resource-form.tsx:59-184, 186-301` | **Nested function declarations:** `renderGeneralInfo()` và `renderConfigInfo()` được định nghĩa bên trong component, tạo lại mỗi render. | Code Quality | Di chuyển ra ngoài component hoặc dùng `useMemo`/extract thành sub-components. |
| CQ-002 | `resource-form.tsx:2, 25` | **Blank import line:** Có dòng trống không cần thiết trong import block (line 2) và sau Textarea (line 25). | Code Quality | Xóa dòng trống thừa trong import section. |
| CQ-003 | `resource-form.tsx:27` | **Import type không tách biệt:** `ResourceGroup` được import mà không dùng `import type`. | Code Quality | Đổi thành `import type { ResourceGroup } from "../types"` |
| CQ-004 | `resource-form.tsx:284-285` | **Empty callback functions:** `onSelectedChange={() => {}}` và `onNewTagsChange` handler không làm gì với `selectedIds`. | Code Quality | Review logic: Nếu không cần `selectedIds`, consider dùng simplified TagInput variant. |

---

## Tổng kết

| Loại lỗi | Số lượng | Mức độ ưu tiên |
|----------|----------|----------------|
| Props Naming | 5 | Trung bình |
| Style (Design System) | 8 | Cao |
| Logic UI | 7 | Cao |
| Accessibility | 4 | Trung bình |
| Code Quality | 4 | Thấp |
| **TỔNG** | **28** | - |

---

## Khuyến nghị ưu tiên

1. **Ưu tiên 1 (Cao):** Sửa LG-001, LG-002, LG-004, LG-005 - Ảnh hưởng trực tiếp đến UX và data integrity.
2. **Ưu tiên 2 (Cao):** Sửa DS-001, DS-004 - Hardcoded color gây khó maintain và không theo Dark Mode.
3. **Ưu tiên 3 (Trung bình):** Sửa UI-001 đến UI-005 - Thống nhất naming convention toàn project.
4. **Ưu tiên 4 (Thấp):** Sửa CQ-001 đến CQ-004 - Improve maintainability nhưng không ảnh hưởng UX.
