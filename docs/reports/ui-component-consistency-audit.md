# BÁO CÁO KIỂM TOÁN TÍNH NHẤT QUÁN COMPONENT UI

**Ngày kiểm toán**: 2025-12-13
**Phạm vi**: `frontend/src/` (React/Tailwind/Shadcn)
**Phương pháp**: Quét toàn bộ mã nguồn, phân tích className, props, cấu trúc JSX

---

## TÓM TẮT ĐIỀU HÀNH

| Mức độ | Số lượng vấn đề |
|--------|-----------------|
| 🔴 **Nghiêm trọng** (Critical) | 4 |
| 🟠 **Cao** (High) | 6 |
| 🟡 **Trung bình** (Medium) | 8 |
| 🟢 **Thấp** (Low) | 5 |

**Tổng cộng**: 23 vấn đề cần xử lý

---

## PHẦN I: COMPONENT TRÙNG LẶP (DUPLICATE COMPONENTS)

### 🔴 CRITICAL-001: Dialog Component Trùng Lặp

**Vị trí**:
- `shared/ui/dialog.tsx` (145 dòng) - Base Shadcn Dialog
- `shared/ui/custom/dialog.tsx` (116 dòng) - Custom Dialog Wrapper

**Mô tả vấn đề**:
- Có 2 Dialog components với mục đích khác nhau nhưng cùng tên export confusion
- `index.ts` line 26 export `CustomDialog as Dialog` ghi đè primitive Dialog
- Developer có thể import nhầm, gây conflict khi cần primitive Dialog

**Dẫn chứng code**:
```typescript
// shared/ui/index.ts line 26
export { CustomDialog as Dialog } from "./custom/dialog"

// Nhưng cũng export DialogContent, DialogHeader từ primitive
export { DialogContent, DialogHeader, ... } from "./dialog"
```

**Ảnh hưởng**:
- Khó debug khi component không hoạt động như mong đợi
- Có thể gây lỗi runtime khi mix primitive và custom Dialog

**Khuyến nghị**: Đổi tên CustomDialog thành `AlertDialog` hoặc `ConfirmDialog` để phân biệt rõ ràng.

---

### 🔴 CRITICAL-002: Sonner/Toast Component Trùng Lặp

**Vị trí**:
- `shared/ui/sonner.tsx` (41 dòng) - Shadcn Toaster wrapper
- `shared/ui/custom/sonner.tsx` (152 dòng) - Custom Toast với variants

**Mô tả vấn đề**:
- 2 cách sử dụng Toast hoàn toàn khác nhau
- `sonner.tsx` sử dụng theme từ next-themes
- `custom/sonner.tsx` tạo hoàn toàn custom UI với `toast.custom()`

**Dẫn chứng code**:
```typescript
// shared/ui/sonner.tsx - Export Toaster component
export { Toaster }

// shared/ui/custom/sonner.tsx - Export showToast helper
export const showToast = {
  success: (title, description) => toast.custom(...)
}
```

**Ảnh hưởng**:
- Developer không biết sử dụng cái nào
- Giao diện toast không thống nhất trong app

**Khuyến nghị**: Hợp nhất thành một file duy nhất, sử dụng custom toast cho tất cả.

---

### 🔴 CRITICAL-003: StatusBadge vs Badge với Status Variants

**Vị trí**:
- `shared/ui/badge.tsx` - Có variants `status-active`, `status-inactive` (line 39-42)
- `shared/ui/custom/status-badge.tsx` - Component riêng biệt (đã đánh dấu @deprecated)

**Dẫn chứng code**:
```typescript
// badge.tsx line 38-42
// Status variants (mới thêm để thay thế StatusBadge)
"status-active": "border-primary/20 bg-primary/5 text-primary...",
"status-inactive": "border-border/50 bg-muted/50 text-muted-foreground",

// status-badge.tsx line 14
/** @deprecated Sử dụng `Badge` với `variant="status-active"` */
export function StatusBadge({...
```

**Vấn đề phát hiện thêm - Feature-specific StatusBadges**:
- `features/settings/notifications/components/channel-status-badge.tsx`
- `features/billing/components/invoice-status-badge.tsx`

**Ảnh hưởng**:
- 4 cách khác nhau để hiển thị trạng thái
- Boilerplate code, khó maintain

**Khuyến nghị**:
1. Xóa `custom/status-badge.tsx`
2. Refactor các feature-specific badges để dùng `Badge` component + utility functions

---

### 🔴 CRITICAL-004: AlertDialog Raw vs DeleteConfirmDialog

**Vị trí sử dụng AlertDialog raw** (nên dùng DeleteConfirmDialog):
- `features/staff/components/staff-list/staff-table.tsx` (line 337-372)
- `features/settings/operating-hours/components/schedule-editor.tsx` (line 157-171)
- `features/settings/operating-hours/components/operating-hours-form.tsx`
- `features/customers/components/customer-list/customer-table.tsx`

**Vị trí có DeleteConfirmDialog sẵn**:
- `shared/ui/custom/delete-confirm-dialog.tsx` (163 dòng, đầy đủ tính năng)

**Mô tả vấn đề**:
- Có shared component `DeleteConfirmDialog` rất đầy đủ (loading state, i18n, customizable)
- Nhưng nhiều nơi vẫn viết AlertDialog raw với boilerplate code giống nhau

**Dẫn chứng code**:
```typescript
// staff-table.tsx line 337-372 - Viết tay 35 dòng
<AlertDialog open={showBulkDeleteConfirm}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>...</AlertDialogTitle>
      <AlertDialogDescription>...</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Hủy</AlertDialogCancel>
      <AlertDialogAction className="bg-destructive...">
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// Có thể thay bằng 1 dòng:
<DeleteConfirmDialog {...dialogProps} onConfirm={handleBulkDelete} />
```

**Ảnh hưởng**:
- ~100-150 dòng code dư thừa
- Inconsistent UI/UX giữa các delete dialogs
- Khó đảm bảo i18n, accessibility nhất quán

**Khuyến nghị**: Thay thế tất cả AlertDialog raw cho delete bằng DeleteConfirmDialog.

---

## PHẦN II: ICON SIZING KHÔNG NHẤT QUÁN

### 🟠 HIGH-001: Hai Convention Icon Size Khác Nhau

**Vị trí**: Toàn bộ `features/` (quét được 150+ instances)

**Convention 1** - Tailwind arbitrary values (cũ):
```tsx
// 68+ files sử dụng pattern này
<Calendar className="h-4 w-4" />
<Plus className="mr-2 h-4 w-4" />
<Loader2 className="mr-2 h-4 w-4 animate-spin" />
```

**Convention 2** - Tailwind size utility (mới, preferred):
```tsx
// 30+ files sử dụng pattern này
<Search className="size-4 text-muted-foreground" />
<Save className="size-4" />
<ChevronRight className="size-4" />
```

**Files sử dụng MIX cả 2**:
- `features/staff/components/staff-page.tsx`
- `features/auth/components/login-form.tsx`
- `features/appointments/components/sheet/appointment-sheet.tsx`

**Khuyến nghị**:
- Chuẩn hóa sang `size-4` cho icons 16px
- Tạo lint rule hoặc search-replace

---

### 🟠 HIGH-002: Icon Margin Không Nhất Quán

**Pattern 1** - Sử dụng `mr-2`:
```tsx
// 47+ instances
<Plus className="mr-2 h-3.5 w-3.5" />
<Save className="mr-2 h-4 w-4" />
```

**Pattern 2** - Sử dụng `startContent` prop của Button:
```tsx
// 12+ instances (đúng cách)
<Button startContent={<Save className="size-4" />}>Lưu</Button>
```

**Vấn đề**: Button component có prop `startContent` để xử lý margin tự động, nhưng nhiều nơi vẫn dùng `mr-2` thủ công.

**Vị trí không nhất quán**:
- `features/staff/components/permissions/bulk-save-bar.tsx` - dùng `mr-2`
- `features/staff/components/staff-sheet.tsx` - dùng `startContent` ✓
- `features/settings/operating-hours/components/exception-sheet.tsx` - mix cả 2

**Khuyến nghị**: Sử dụng `startContent` prop thống nhất.

---

## PHẦN III: FORM COMPONENT PATTERNS KHÔNG ĐỒNG BỘ

### 🟠 HIGH-003: Tabs Component Import Khác Nhau Giữa Forms

**Vị trí**:
- `features/services/components/service-form.tsx` - Dùng `FormTabs` custom
- `features/customers/components/customer-form.tsx` - Dùng `Tabs` primitive
- `features/resources/components/resource-form.tsx` - Dùng `Tabs` primitive

**Dẫn chứng code**:
```typescript
// service-form.tsx
import { FormTabs, FormTabsContent } from "@/shared/ui/custom/form-tabs"
<FormTabs tabs={SERVICE_FORM_TABS} defaultValue="basic">

// customer-form.tsx & resource-form.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
<Tabs defaultValue="general" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
```

**Ảnh hưởng**:
- FormTabs có thể có styling khác với Tabs primitive
- Khó maintain khi cần update styling

**Khuyến nghị**: Chọn một approach và áp dụng nhất quán.

---

### 🟠 HIGH-004: Input Height Không Thống Nhất

**Pattern tìm thấy**:
```tsx
// service-form.tsx - Hardcode h-10
<Input className="h-10 text-sm" {...field} />
<DurationPicker className="h-10 text-sm" />

// customer-form.tsx - Không specify height
<Input placeholder="0912 345 678" {...field} className="font-medium" />

// resource-form.tsx - Không specify height
<Input placeholder="Ví dụ: R-VIP-01" {...field} />
```

**Vấn đề**:
- Một số forms hardcode `h-10`
- Một số dựa vào default của Input component
- Input component có default `h-9` (from button size default)

**Khuyến nghị**: Xác định form input height standard (9 hoặc 10) và apply nhất quán.

---

### 🟠 HIGH-005: Required Field Indicator Không Nhất Quán

**Pattern 1** - Inline HTML:
```tsx
// Nhiều files
<FormLabel>Tên dịch vụ <span className="text-destructive">*</span></FormLabel>
<FormLabel>Số điện thoại <span className="text-destructive ml-0.5">*</span></FormLabel>
```

**Pattern 2** - Có custom component nhưng không dùng:
```tsx
// shared/ui/custom/required-mark.tsx tồn tại nhưng không được import
export function RequiredMark() { ... }
```

**Vị trí phát hiện**:
- `service-form.tsx` line 102 - inline span
- `customer-form.tsx` line 56 - inline span với ml-0.5
- `resource-form.tsx` line 90 - inline span

**Khuyến nghị**: Import và sử dụng `RequiredMark` component thống nhất.

---

### 🟠 HIGH-006: Optional Field Label Pattern Không Đồng Bộ

**Vị trí**: `customer-form.tsx` line 156
```tsx
<FormLabel>
  Email <span className="text-muted-foreground font-normal text-xs ml-1">(Tùy chọn)</span>
</FormLabel>
```

**Vấn đề**: Pattern này chỉ xuất hiện ở 1 chỗ, các form khác không có.

**Khuyến nghị**: Tạo `OptionalMark` component hoặc chuẩn hóa cách đánh dấu optional fields.

---

## PHẦN IV: CSS CLASS PATTERNS KHÔNG NHẤT QUÁN

### 🟡 MEDIUM-001: bg-destructive Hardcode vs Button Variant

**Vị trí có hardcode CSS** (27+ instances):
```tsx
// staff-table.tsx line 358
className="bg-destructive text-destructive-foreground hover:bg-destructive/90"

// resources/resource-table.tsx, services/skill-table.tsx - same pattern
```

**Vấn đề**: Button component có `variant="destructive"` nhưng nhiều nơi hardcode className.

**Files ảnh hưởng**:
- `features/staff/components/staff-list/staff-table.tsx`
- `features/services/components/service-table.tsx`
- `features/services/components/skill-table.tsx`
- `features/resources/components/resource-table.tsx`
- `features/settings/operating-hours/components/exceptions-view-manager.tsx`

**Khuyến nghị**: Sử dụng `<Button variant="destructive">` thay vì hardcode className.

---

### 🟡 MEDIUM-002: Text Size Inconsistency

**Quét phát hiện**:
- `text-sm` sử dụng: 185+ instances
- `text-xs` sử dụng: 145+ instances

**Vấn đề**: Một số components dùng cả hai trong cùng context:
```tsx
// exception-form.tsx
<Label className="text-xs font-semibold">  // Label dùng text-xs
<span className="text-sm font-medium">     // Span cùng level dùng text-sm
```

**Khuyến nghị**: Xác định typography scale rõ ràng: labels dùng size nào, helper text dùng size nào.

---

### 🟡 MEDIUM-003: Color Token vs Raw Color

**Patterns phát hiện**:

**Sử dụng design tokens** ✓:
```tsx
text-muted-foreground
bg-primary/10
text-destructive
```

**Sử dụng raw Tailwind colors** ✗:
```tsx
// channel-status-badge.tsx line 17
"border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"

// step-confirm.tsx line 22
"text-orange-600 dark:text-orange-400"

// step-confirm.tsx line 49
"text-green-600"
```

**Vị trí**:
- `features/settings/notifications/components/channel-status-badge.tsx`
- `features/customer-dashboard/components/booking/steps/step-confirm.tsx`
- `features/notifications/components/notification-bell.tsx`

**Khuyến nghị**: Thay raw colors bằng semantic tokens (success, warning, info).

---

### 🟡 MEDIUM-004: Transition Duration Không Thống Nhất

**Patterns phát hiện**:
```tsx
// Có nơi dùng duration-200
"transition-all duration-200"

// Có nơi dùng duration-300
"transition-colors duration-300"

// Có nơi dùng duration-150
"transition-opacity duration-150"

// Có nơi dùng duration-500
"transition-all duration-500"
```

**Khuyến nghị**: Chuẩn hóa animation durations theo design system.

---

### 🟡 MEDIUM-005: Border Radius Naming Mix

**Patterns**:
```tsx
// Sử dụng rounded-lg (preferred)
className="rounded-lg border p-4"

// Sử dụng rounded-md
className="rounded-md px-2 py-1"

// Sử dụng rounded-xl
className="rounded-xl shadow-lg"

// Sử dụng rounded-full (chips/badges)
className="rounded-full px-3 py-1"
```

**Vấn đề**: Không có quy tắc rõ ràng khi nào dùng `lg`, `md`, hay `xl`.

---

### 🟡 MEDIUM-006: Gap vs Space-y/x Mixing

**Patterns**:
```tsx
// Flex with gap
className="flex items-center gap-2"

// Flex with space-x
className="flex items-center space-x-4"

// Grid with gap
className="grid gap-4"
```

**Vấn đề**: Một số nơi dùng `gap`, một số dùng `space-x/y` cho cùng mục đích.

**Khuyến nghị**: Ưu tiên `gap` vì làm việc tốt với cả Flex và Grid.

---

### 🟡 MEDIUM-007: Shadow Variants Không Chuẩn Hóa

**Patterns phát hiện**:
```tsx
// Custom shadows
shadow-[0_0_10px_rgba(var(--primary),0.1)]
shadow-[0_0_8px_rgba(var(--primary),0.6)]
shadow-[1px_0_0_0_rgba(0,0,0,0.05)]

// Tailwind shadows
shadow-sm
shadow-md
shadow-lg
shadow-2xl
```

**Vị trí custom shadows**:
- `shared/ui/badge.tsx`
- `shared/ui/custom/status-badge.tsx`
- `features/staff/components/scheduling/schedule-grid.tsx`

**Khuyến nghị**: Định nghĩa custom shadow tokens trong tailwind.config.

---

### 🟡 MEDIUM-008: Animation Classes Ad-hoc

**Patterns**:
```tsx
// Standard Tailwind
"animate-spin"
"animate-pulse"

// Custom animations
"animate-in fade-in zoom-in-95 duration-200"
"animate-in slide-in-from-top-2 fade-in duration-200"
```

**Vấn đề**: Không có animation constants/utilities, mỗi nơi tự viết.

---

## PHẦN V: PROPS NAMING VÀ API INCONSISTENCY

### 🟢 LOW-001: Loading State Prop Naming

**Patterns**:
```tsx
// Button component (button.tsx)
isLoading?: boolean
loading?: boolean  // @deprecated

// Các component khác
isPending
isSubmitting
isDeleting
```

**Khuyến nghị**: Chuẩn hóa sang `isPending` (React 19 convention) hoặc `isLoading`.

---

### 🟢 LOW-002: Mode Prop Naming

**Files sử dụng `mode`**:
```tsx
// service-form.tsx, customer-form.tsx, resource-form.tsx
mode: "create" | "update"
```

**Files có thể dùng khác**:
```tsx
// Một số nơi dùng isEditing, isUpdateMode
const isUpdateMode = mode === "update"
```

**Vấn đề**: Consistent nhưng có intermediate variables không cần thiết.

---

### 🟢 LOW-003: Event Handler Naming

**Patterns phát hiện**:
```tsx
// On-prefix
onOpenChange, onChange, onClick

// Handle-prefix (internal handlers)
handleDelete, handleSubmit, handleEdit

// Confirm/Cancel specific
onConfirm
```

**Khuyến nghị**: Đây là pattern tốt, giữ nguyên.

---

### 🟢 LOW-004: Import Path Inconsistency

**Pattern mong muốn** (theo index.ts documentation):
```tsx
// ✅ ĐÚNG
import { Button, Dialog, Badge } from "@/shared/ui"
```

**Pattern thực tế** (nhiều files):
```tsx
// ❌ Import trực tiếp
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Badge } from "@/shared/ui/badge"
```

**Vị trí**: Hầu hết files trong `features/`

**Khuyến nghị**: Refactor sang barrel import từ `@/shared/ui` cho consistency.

---

### 🟢 LOW-005: Component Export Style

**Pattern 1** - Named function:
```tsx
export function ServiceForm() { }
```

**Pattern 2** - Arrow + forwardRef:
```tsx
const Button = React.forwardRef<...>()
Button.displayName = "Button"
export { Button }
```

**Vấn đề**: Không critical nhưng inconsistent style.

---

## PHẦN VI: CÁC VẤN ĐỀ KHÁC

### Deprecated Components Chưa Xóa

**Vị trí**:
- `shared/ui/custom/status-badge.tsx` - Đã đánh dấu @deprecated nhưng vẫn export trong `index.ts`
- `shared/ui/button.tsx` - Props `loading`, `leftIcon`, `rightIcon` deprecated nhưng vẫn support

**Khuyến nghị**: Lên kế hoạch removal trong version tiếp theo.

---

## KẾ HOẠCH HÀNH ĐỘNG ĐỀ XUẤT

### Phase 1: Quick Wins (1-2 ngày)
1. ✅ Xóa `StatusBadge` deprecated, update imports
2. ✅ Replace all `h-4 w-4` with `size-4`
3. ✅ Replace all manual `mr-2` icons with `startContent` prop

### Phase 2: Component Consolidation (3-5 ngày)
1. ✅ Hợp nhất Dialog components, rename CustomDialog
2. ✅ Hợp nhất Sonner/Toast
3. ✅ Thay thế AlertDialog raw bằng DeleteConfirmDialog
4. ✅ Refactor feature-specific StatusBadges

### Phase 3: Standards Enforcement (2-3 ngày)
1. ✅ Chuẩn hóa Form tabs pattern
2. ✅ Chuẩn hóa Input height
3. ✅ Replace raw colors với design tokens
4. ✅ Implement ESLint rules cho patterns

### Phase 4: Documentation (1 ngày)
1. ✅ Update component documentation
2. ✅ Create usage guidelines
3. ✅ Add Storybook examples

---

## PHỤ LỤC: FILE REFERENCES

### Files có nhiều vấn đề nhất (cần ưu tiên review):
1. `features/staff/components/staff-list/staff-table.tsx` - 5 issues
2. `features/settings/operating-hours/components/exception-form.tsx` - 4 issues
3. `features/services/components/service-form.tsx` - 3 issues
4. `features/customers/components/customer-form.tsx` - 3 issues

### Shared components cần cập nhật:
1. `shared/ui/index.ts` - Clean up exports
2. `shared/ui/custom/status-badge.tsx` - Remove
3. `shared/ui/custom/dialog.tsx` - Rename
4. `shared/ui/sonner.tsx` + `shared/ui/custom/sonner.tsx` - Merge

---

*Báo cáo được tạo tự động bởi UI Component Consistency Auditor*
