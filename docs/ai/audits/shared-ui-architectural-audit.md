# BÁO CÁO KIỂM TOÁN KIẾN TRÚC: `shared/ui`

**Ngày tạo:** 2025-12-29
**Người thực hiện:** Senior Frontend Architect & Library Maintainer
**Phạm vi:** `frontend/src/shared/ui`
**Chuẩn tham chiếu:** shadcn/ui registry via MCP

---

## 1. TỔNG QUAN INVENTORY

### 1.1 Thống kê

| Metric | Số lượng |
|--------|----------|
| **Tổng số file** | 62 files |
| **Subdirectories** | 6 dirs |
| **Component primitives** | ~45 components |
| **Custom extensions** | ~17 components |

### 1.2 Nhóm theo Chức năng UI

| Nhóm Chức Năng | Components |
|----------------|------------|
| **Dialog / Modal** | `dialog.tsx`, `alert-dialog.tsx`, `delete-confirm-dialog.tsx` |
| **Sheet / Drawer** | `sheet.tsx`, `drawer.tsx` |
| **Button & Actions** | `button.tsx`, `button-group.tsx` |
| **Form Controls** | `form.tsx`, `field.tsx`, `input.tsx`, `input-group.tsx`, `input-otp.tsx`, `textarea.tsx`, `select.tsx`, `checkbox.tsx`, `radio-group.tsx`, `switch.tsx` |
| **Feedback** | `alert.tsx`, `sonner.tsx`, `empty.tsx`, `progress.tsx`, `skeleton.tsx`, `spinner.tsx` |
| **Data Display** | `badge.tsx`, `badge-presets.ts`, `table.tsx`, `table-row-actions.tsx`, `item.tsx`, `card.tsx` |
| **Layout Primitives** | `layout/` (box, grid, stack, group), `layouts/` (app-shell, auth-layout, dashboard-layout) |
| **Navigation** | `navigation-menu.tsx`, `breadcrumb.tsx`, `tabs.tsx`, `sidebar.tsx`, `menubar.tsx`, `navigation/mobile-nav-bar.tsx` |
| **Overlays** | `popover.tsx`, `tooltip.tsx`, `hover-card.tsx` |
| **Specialized** | `calendar.tsx`, `date-picker.tsx`, `time-picker.tsx`, `date-range-navigator.tsx`, `tag-input.tsx`, `carousel.tsx`, `chart.tsx` |
| **Typography & Utils** | `typography/index.tsx`, `label.tsx`, `kbd.tsx`, `required-mark.tsx`, `separator.tsx` |
| **Branding** | `branding/header-logo.tsx` |
| **Data Display (Subdirectory)** | `data-display/stat-card.tsx` |

---

## 2. PHÂN TÍCH THEO NHÓM CHỨC NĂNG

### 2.1 Nhóm Dialog / Modal

#### Chuẩn MCP (shadcn/ui)
- **@shadcn/dialog**: Dựa trên `@radix-ui/react-dialog`, composition pattern thuần túy
- **@shadcn/alert-dialog**: Dựa trên `@radix-ui/react-alert-dialog`, cho confirm actions

#### So sánh từng Component

| Component | Dùng Primitive? | Props gần MCP? | Hardcode text? | Side-effect? | Business logic? | Deep import? |
|-----------|-----------------|----------------|----------------|--------------|-----------------|--------------|
| `dialog.tsx` | ✅ @radix-ui/react-dialog | ✅ | ❌ "Close" | ❌ | ❌ | ❌ |
| `alert-dialog.tsx` | ✅ @radix-ui/react-alert-dialog | ✅ | ❌ | ❌ | ❌ | ❌ |
| `delete-confirm-dialog.tsx` | ✅ (composes AlertDialog) | ⚠️ Custom props | ✅ Text tiếng Việt hardcode | ❌ | ⚠️ Semantic "xóa" | ❌ |

#### Quyết định

| Component | Quyết định | Lý do Kỹ thuật |
|-----------|------------|----------------|
| `dialog.tsx` | ✅ **KEEP – Canonical** | Gần chuẩn MCP nhất, sử dụng Radix primitive, props chuẩn, không side-effect |
| `alert-dialog.tsx` | ✅ **KEEP – Canonical** | Đúng chuẩn shadcn/ui, hỗ trợ variant prop mở rộng hợp lý |
| `delete-confirm-dialog.tsx` | ⚠️ **DEMOTE – Feature-level** | Chứa hardcoded text tiếng Việt ("Xác nhận xóa?"), semantic quá cụ thể (delete-only). Nên di chuyển sang `features/` hoặc `shared/components/` |

---

### 2.2 Nhóm Sheet / Drawer

#### Chuẩn MCP (shadcn/ui)
- **@shadcn/sheet**: Dùng `@radix-ui/react-dialog` với slide animation
- **@shadcn/drawer**: Dùng `vaul` library, swipe gesture support

#### So sánh

| Component | Dùng Primitive? | Props gần MCP? | Hardcode text? | Side-effect? | Business logic? | Deep import? |
|-----------|-----------------|----------------|----------------|--------------|-----------------|--------------|
| `sheet.tsx` | ✅ @radix-ui/react-dialog | ⚠️ Thêm `size`, `preventClose` | ✅ "Đóng" | ❌ | ❌ | ❌ |
| `drawer.tsx` | ✅ vaul | ✅ | ❌ | ❌ | ❌ | ❌ |

#### Quyết định

| Component | Quyết định | Lý do Kỹ thuật |
|-----------|------------|----------------|
| `sheet.tsx` | ✅ **KEEP – Canonical** | Dùng đúng Radix primitive, mở rộng `size` variant hợp lý, thêm `SheetBody` là pattern tốt. Hardcode "Đóng" nhỏ (sr-only text), chấp nhận được |
| `drawer.tsx` | ✅ **KEEP – Canonical** | Đúng chuẩn shadcn/ui vaul-based drawer, không có custom logic |

---

### 2.3 Nhóm Button & Actions

#### Chuẩn MCP (shadcn/ui)
- **@shadcn/button**: Dùng `@radix-ui/react-slot`, `cva` variants
- **@shadcn/button-group**: Layout primitive cho button grouping

#### So sánh

| Component | Dùng Primitive? | Props gần MCP? | Hardcode text? | Side-effect? | Business logic? | Deep import? |
|-----------|-----------------|----------------|----------------|--------------|-----------------|--------------|
| `button.tsx` | ✅ @radix-ui/react-slot | ⚠️ Thêm `isLoading`, `startContent`, `endContent` | ❌ | ❌ | ❌ | ❌ |
| `button-group.tsx` | ✅ @radix-ui/react-slot | ✅ | ❌ | ❌ | ❌ | ❌ |

#### Quyết định

| Component | Quyết định | Lý do Kỹ thuật |
|-----------|------------|----------------|
| `button.tsx` | ✅ **KEEP – Canonical** | Props mở rộng (`isLoading`, content slots) là pattern phổ biến và cần thiết. Có deprecation cho props cũ (good practice) |
| `button-group.tsx` | ✅ **KEEP – Canonical** | Đúng chuẩn MCP, composition tốt |

---

### 2.4 Nhóm Form Controls

#### Chuẩn MCP (shadcn/ui)
- **@shadcn/form**: React Hook Form integration (`FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`)
- **@shadcn/field**: Standalone field wrapper (không RHF dependency)
- **@shadcn/input**: Base input primitive
- **@shadcn/input-group**: Input với addon/prefix/suffix

#### So sánh

| Component | Dùng Primitive? | Props gần MCP? | Hardcode text? | Side-effect? | Business logic? | Deep import? |
|-----------|-----------------|----------------|----------------|--------------|-----------------|--------------|
| `form.tsx` | ✅ RHF + Radix Label | ⚠️ Thêm `size` context | ✅ "useFormField should be used within" | ❌ | ❌ | ❌ |
| `field.tsx` | ✅ Native | ✅ | ❌ | ❌ | ❌ | ❌ |
| `input.tsx` | ✅ Native | ⚠️ Thêm `isError`, content slots | ❌ | ❌ | ❌ | ❌ |
| `input-group.tsx` | ✅ Native | ✅ | ❌ | ❌ | ❌ | ❌ |

#### Quyết định

| Component | Quyết định | Lý do Kỹ thuật |
|-----------|------------|----------------|
| `form.tsx` | ✅ **KEEP – Canonical** | Đúng chuẩn RHF integration, thêm `OptionalMark` hữu ích. Text lỗi là development-only |
| `field.tsx` | ✅ **KEEP – Canonical** | Standalone field pattern đúng chuẩn MCP |
| `input.tsx` | ✅ **KEEP – Canonical** | Extensions hợp lý (`isError`, slots), không phá vỡ API gốc |
| `input-group.tsx` | ✅ **KEEP – Canonical** | Đúng chuẩn MCP |

---

### 2.5 Nhóm Feedback

#### Chuẩn MCP (shadcn/ui)
- **@shadcn/alert**: Inline alert component
- **@shadcn/sonner**: Toast notifications (wraps sonner library)
- **@shadcn/empty**: Empty state component
- **@shadcn/skeleton**: Loading skeleton
- **@shadcn/spinner**: Loading spinner với CVA

#### So sánh

| Component | Dùng Primitive? | Props gần MCP? | Hardcode text? | Side-effect? | Business logic? | Deep import? |
|-----------|-----------------|----------------|----------------|--------------|-----------------|--------------|
| `alert.tsx` | ❌ Native | ✅ | ❌ | ❌ | ❌ | ❌ |
| `sonner.tsx` | ✅ sonner + next-themes | ⚠️ Custom `showToast` API | ✅ Text tiếng Việt | ⚠️ `toast.dismiss()` | ❌ | ❌ |
| `empty.tsx` | ❌ Native | ✅ | ❌ | ❌ | ❌ | ❌ |
| `skeleton.tsx` | ❌ Native | ✅ | ❌ | ❌ | ❌ | ❌ |
| `spinner.tsx` | ❌ Native | ✅ | ❌ | ❌ | ❌ | ❌ |

#### Quyết định

| Component | Quyết định | Lý do Kỹ thuật |
|-----------|------------|----------------|
| `alert.tsx` | ✅ **KEEP – Canonical** | Đúng chuẩn composition |
| `sonner.tsx` | ⚠️ **KEEP với lưu ý** | `Toaster` component chuẩn, nhưng `showToast` wrapper có hardcoded text tiếng Việt trong `CustomToast`. Xem xét tách `showToast` sang feature-level hoặc sử dụng i18n |
| `empty.tsx` | ✅ **KEEP – Canonical** | Đúng chuẩn MCP |
| `skeleton.tsx` | ✅ **KEEP – Canonical** | Đúng chuẩn MCP |
| `spinner.tsx` | ✅ **KEEP – Canonical** | Đúng chuẩn MCP |

---

### 2.6 Nhóm Data Display

#### Chuẩn MCP (shadcn/ui)
- **@shadcn/badge**: Với CVA variants
- **@shadcn/table**: Semantic HTML table wrappers
- **@shadcn/item**: List item component

#### So sánh

| Component | Dùng Primitive? | Props gần MCP? | Hardcode text? | Side-effect? | Business logic? | Deep import? |
|-----------|-----------------|----------------|----------------|--------------|-----------------|--------------|
| `badge.tsx` | ✅ @radix-ui/react-slot | ⚠️ Thêm `preset`, `withIndicator` | ❌ | ❌ | ❌ | ✅ badge-presets |
| `badge-presets.ts` | N/A (config) | N/A | ✅ Nhiều text tiếng Việt | ❌ | ⚠️ Domain-specific presets | ❌ |
| `table.tsx` | ❌ Native | ✅ | ❌ | ❌ | ❌ | ❌ |
| `table-row-actions.tsx` | ✅ Composes DropdownMenu | ⚠️ Custom API | ✅ Text tiếng Việt | ❌ | ⚠️ "Sửa/Xóa" semantic | ❌ |
| `item.tsx` | ✅ @radix-ui/react-slot | ✅ | ❌ | ❌ | ❌ | ❌ |

#### Quyết định

| Component | Quyết định | Lý do Kỹ thuật |
|-----------|------------|----------------|
| `badge.tsx` | ✅ **KEEP – Canonical** | Core component tốt, `preset` system có thể tách riêng |
| `badge-presets.ts` | 🗑️ **LEGACY / DEMOTE** | Chứa quá nhiều domain-specific presets (appointment status, staff roles, tiers). Nên di chuyển sang `shared/config/` hoặc các feature modules tương ứng |
| `table.tsx` | ✅ **KEEP – Canonical** | Đúng chuẩn MCP |
| `table-row-actions.tsx` | ⚠️ **DEMOTE – Feature-level** | Hardcoded actions ("Chỉnh sửa", "Xóa dữ liệu"), quá semantic. Nên dùng generic `DropdownMenu` thay thế |
| `item.tsx` | ✅ **KEEP – Canonical** | Đúng chuẩn MCP |

---

### 2.7 Nhóm Layout

#### Chuẩn MCP (shadcn/ui)
- shadcn/ui **không có** layout primitives (Box, Stack, Grid, Group)
- Layout là custom extension hợp lý cho design system

#### So sánh

| Component | Mục đích | Hardcode text? | Side-effect? | Business logic? | Deep import? |
|-----------|----------|----------------|--------------|-----------------|--------------|
| `layout/box.tsx` | Base box wrapper | ❌ | ❌ | ❌ | ❌ |
| `layout/stack.tsx` | VStack/HStack | ❌ | ❌ | ❌ | ❌ |
| `layout/grid.tsx` | CSS Grid wrapper | ❌ | ❌ | ❌ | ❌ |
| `layout/group.tsx` | Flex row wrapper | ❌ | ❌ | ❌ | ❌ |
| `layouts/app-shell.tsx` | App shell layout | ❌ | ❌ | ❌ | ❌ |
| `layouts/auth-layout.tsx` | Auth page layout | ✅ Marketing text | ❌ | ⚠️ Branding-specific | ✅ HeaderLogo từ components |
| `layouts/dashboard-layout.tsx` | Dashboard wrapper | ❌ | ❌ | ❌ | ❌ |

#### Quyết định

| Component | Quyết định | Lý do Kỹ thuật |
|-----------|------------|----------------|
| `layout/box.tsx` | ✅ **KEEP – Canonical** | Generic layout primitive |
| `layout/stack.tsx` | ✅ **KEEP – Canonical** | Generic layout primitive |
| `layout/grid.tsx` | ✅ **KEEP – Canonical** | Generic layout primitive |
| `layout/group.tsx` | ✅ **KEEP – Canonical** | Generic layout primitive |
| `layouts/app-shell.tsx` | ✅ **KEEP – Canonical** | Generic shell pattern |
| `layouts/auth-layout.tsx` | ⚠️ **DEMOTE – Feature-level** | Chứa marketing text hardcode, branding content cụ thể. Nên di chuyển sang `features/auth/` |
| `layouts/dashboard-layout.tsx` | ✅ **KEEP – Canonical** | Generic wrapper |

---

### 2.8 Nhóm Navigation & Branding

| Component | Quyết định | Lý do Kỹ thuật |
|-----------|------------|----------------|
| `navigation/mobile-nav-bar.tsx` | ⚠️ **DEMOTE – Feature-level** | Chứa logic `isPrimary` cùng styling cụ thể, nên migrate sang `widgets/` hoặc `features/layout/` |
| `branding/header-logo.tsx` | ⚠️ **DEMOTE – Feature-level** | Chứa SVG logo cụ thể của Synapse, hardcode "Synapse" text. Không generic |
| `data-display/stat-card.tsx` | ⚠️ **DEMOTE – Feature-level** | Quá specific cho dashboard use-case với variant mapping cứng |

---

### 2.9 Nhóm Specialized

| Component | Quyết định | Lý do Kỹ thuật |
|-----------|------------|----------------|
| `calendar.tsx` | ✅ **KEEP – Canonical** | Dựa trên react-day-picker, chuẩn MCP |
| `date-picker.tsx` | ✅ **KEEP – Canonical** | Composes Calendar + Popover đúng pattern |
| `time-picker.tsx` | ✅ **KEEP – Canonical** | Custom nhưng generic |
| `date-range-navigator.tsx` | ⚠️ **DEMOTE** | Quá specific với prev/next navigation pattern |
| `tag-input.tsx` | ✅ **KEEP – Canonical** | Generic multi-value input pattern |
| `chart.tsx` | ✅ **KEEP – Canonical** | Recharts wrapper, chuẩn MCP |

---

### 2.10 Nhóm Typography & Utils

| Component | Quyết định | Lý do Kỹ thuật |
|-----------|------------|----------------|
| `typography/index.tsx` | ✅ **KEEP – Canonical** | Generic Text/Heading components |
| `label.tsx` | ✅ **KEEP – Canonical** | Radix Label wrapper |
| `kbd.tsx` | ✅ **KEEP – Canonical** | Keyboard shortcut display |
| `required-mark.tsx` | ✅ **KEEP – Canonical** | Generic form utility |
| `separator.tsx` | ✅ **KEEP – Canonical** | Radix Separator |

---

## 3. BẢNG TỔNG HỢP QUYẾT ĐỊNH

| Nhóm Chức Năng | Component | Quyết Định | Lý Do Kỹ Thuật |
|----------------|-----------|------------|----------------|
| **Dialog** | `dialog.tsx` | ✅ KEEP | Chuẩn Radix primitive, không hardcode |
| **Dialog** | `alert-dialog.tsx` | ✅ KEEP | Chuẩn MCP với variant extension |
| **Dialog** | `delete-confirm-dialog.tsx` | ⚠️ DEMOTE | Hardcode text tiếng Việt, semantic cụ thể |
| **Sheet** | `sheet.tsx` | ✅ KEEP | Chuẩn + size variants hợp lý |
| **Sheet** | `drawer.tsx` | ✅ KEEP | Chuẩn vaul-based |
| **Button** | `button.tsx` | ✅ KEEP | Extension hợp lý (loading state) |
| **Button** | `button-group.tsx` | ✅ KEEP | Chuẩn MCP |
| **Form** | `form.tsx` | ✅ KEEP | RHF integration chuẩn |
| **Form** | `field.tsx` | ✅ KEEP | Standalone field pattern |
| **Form** | `input.tsx` | ✅ KEEP | Extension slots hợp lý |
| **Form** | `input-group.tsx` | ✅ KEEP | Chuẩn MCP |
| **Feedback** | `alert.tsx` | ✅ KEEP | Chuẩn composition |
| **Feedback** | `sonner.tsx` | ⚠️ KEEP* | Toaster OK, showToast có hardcode |
| **Feedback** | `empty.tsx` | ✅ KEEP | Chuẩn MCP |
| **Feedback** | `skeleton.tsx` | ✅ KEEP | Chuẩn MCP |
| **Feedback** | `spinner.tsx` | ✅ KEEP | Chuẩn MCP |
| **Data** | `badge.tsx` | ✅ KEEP | Core component tốt |
| **Data** | `badge-presets.ts` | 🗑️ LEGACY | Domain-specific presets |
| **Data** | `table.tsx` | ✅ KEEP | Chuẩn MCP |
| **Data** | `table-row-actions.tsx` | ⚠️ DEMOTE | Hardcode actions |
| **Data** | `item.tsx` | ✅ KEEP | Chuẩn MCP |
| **Layout** | `layout/*` | ✅ KEEP | Generic primitives |
| **Layout** | `layouts/app-shell.tsx` | ✅ KEEP | Generic shell |
| **Layout** | `layouts/auth-layout.tsx` | ⚠️ DEMOTE | Marketing content hardcode |
| **Layout** | `layouts/dashboard-layout.tsx` | ✅ KEEP | Generic wrapper |
| **Nav** | `mobile-nav-bar.tsx` | ⚠️ DEMOTE | Project-specific logic |
| **Branding** | `header-logo.tsx` | ⚠️ DEMOTE | Synapse-specific branding |
| **Data** | `stat-card.tsx` | ⚠️ DEMOTE | Dashboard-specific |
| **Picker** | `calendar.tsx` | ✅ KEEP | Chuẩn MCP |
| **Picker** | `date-picker.tsx` | ✅ KEEP | Generic composition |
| **Picker** | `time-picker.tsx` | ✅ KEEP | Generic |
| **Picker** | `date-range-navigator.tsx` | ⚠️ DEMOTE | Specific navigation pattern |
| **Custom** | `tag-input.tsx` | ✅ KEEP | Generic multi-value |
| **Chart** | `chart.tsx` | ✅ KEEP | Recharts wrapper |
| **Typography** | `typography/index.tsx` | ✅ KEEP | Generic |
| **Utils** | `label.tsx`, `kbd.tsx`, etc. | ✅ KEEP | Generic primitives |

---

## 4. DANH SÁCH CANONICAL COMPONENTS

```
shared/ui/
├── accordion.tsx           ✅ (aligned with @shadcn/accordion)
├── alert.tsx               ✅ (aligned with @shadcn/alert)
├── alert-dialog.tsx        ✅ (aligned with @shadcn/alert-dialog)
├── aspect-ratio.tsx        ✅ (aligned with @shadcn/aspect-ratio)
├── avatar.tsx              ✅ (aligned with @shadcn/avatar)
├── badge.tsx               ✅ (aligned with @shadcn/badge)
├── breadcrumb.tsx          ✅ (aligned with @shadcn/breadcrumb)
├── button.tsx              ✅ (aligned with @shadcn/button)
├── button-group.tsx        ✅ (aligned with @shadcn/button-group)
├── calendar.tsx            ✅ (aligned with @shadcn/calendar)
├── card.tsx                ✅ (aligned with @shadcn/card)
├── carousel.tsx            ✅ (aligned with @shadcn/carousel)
├── chart.tsx               ✅ (aligned with @shadcn/chart)
├── checkbox.tsx            ✅ (aligned with @shadcn/checkbox)
├── collapsible.tsx         ✅ (aligned with @shadcn/collapsible)
├── command.tsx             ✅ (aligned with @shadcn/command)
├── context-menu.tsx        ✅ (aligned with @shadcn/context-menu)
├── date-picker.tsx         ✅ (custom, generic pattern)
├── dialog.tsx              ✅ (aligned with @shadcn/dialog)
├── drawer.tsx              ✅ (aligned with @shadcn/drawer)
├── dropdown-menu.tsx       ✅ (aligned with @shadcn/dropdown-menu)
├── empty.tsx               ✅ (aligned with @shadcn/empty)
├── field.tsx               ✅ (aligned with @shadcn/field)
├── form.tsx                ✅ (aligned with @shadcn/form)
├── hover-card.tsx          ✅ (aligned with @shadcn/hover-card)
├── input.tsx               ✅ (aligned with @shadcn/input)
├── input-group.tsx         ✅ (aligned with @shadcn/input-group)
├── input-otp.tsx           ✅ (aligned with @shadcn/input-otp)
├── item.tsx                ✅ (aligned with @shadcn/item)
├── kbd.tsx                 ✅ (custom, generic)
├── label.tsx               ✅ (aligned with @shadcn/label)
├── layout/                 ✅ (custom layout primitives)
├── menubar.tsx             ✅ (aligned with @shadcn/menubar)
├── navigation-menu.tsx     ✅ (aligned with @shadcn/navigation-menu)
├── pagination.tsx          ✅ (aligned with @shadcn/pagination)
├── popover.tsx             ✅ (aligned with @shadcn/popover)
├── progress.tsx            ✅ (aligned with @shadcn/progress)
├── radio-group.tsx         ✅ (aligned with @shadcn/radio-group)
├── required-mark.tsx       ✅ (custom, generic)
├── resizable.tsx           ✅ (aligned with @shadcn/resizable)
├── scroll-area.tsx         ✅ (aligned with @shadcn/scroll-area)
├── select.tsx              ✅ (aligned with @shadcn/select)
├── separator.tsx           ✅ (aligned with @shadcn/separator)
├── sheet.tsx               ✅ (aligned with @shadcn/sheet)
├── sidebar.tsx             ✅ (aligned with @shadcn/sidebar)
├── skeleton.tsx            ✅ (aligned with @shadcn/skeleton)
├── slider.tsx              ✅ (aligned with @shadcn/slider)
├── sonner.tsx              ✅ (Toaster only - aligned)
├── spinner.tsx             ✅ (aligned with @shadcn/spinner)
├── switch.tsx              ✅ (aligned with @shadcn/switch)
├── table.tsx               ✅ (aligned with @shadcn/table)
├── tabs.tsx                ✅ (aligned with @shadcn/tabs)
├── tag-input.tsx           ✅ (custom, generic)
├── textarea.tsx            ✅ (aligned with @shadcn/textarea)
├── time-picker.tsx         ✅ (custom, generic)
├── toggle.tsx              ✅ (aligned with @shadcn/toggle)
├── toggle-group.tsx        ✅ (aligned with @shadcn/toggle-group)
├── tooltip.tsx             ✅ (aligned with @shadcn/tooltip)
└── typography/             ✅ (custom, generic)
```

---

## 5. DANH SÁCH COMPONENTS CẦN DEMOTE/LEGACY

```
CẦN DI CHUYỂN RA KHỎI shared/ui:

⚠️ DEMOTE → shared/components/ hoặc features/
├── delete-confirm-dialog.tsx   → Hardcoded Vietnamese text
├── table-row-actions.tsx       → Hardcoded actions (Sửa, Xóa)
├── date-range-navigator.tsx    → Specific navigation pattern
├── layouts/auth-layout.tsx     → Marketing content hardcode
├── navigation/mobile-nav-bar.tsx → Project-specific UI
├── branding/header-logo.tsx    → Synapse-specific branding
├── data-display/stat-card.tsx  → Dashboard-specific component

🗑️ LEGACY → Refactor hoặc Remove
├── badge-presets.ts            → Domain-specific, nên migrate sang config/
├── sonner.tsx (showToast only) → Custom toast wrapper có hardcode text
```

---

## 6. NHẬN XÉT KIẾN TRÚC (Architecture Notes)

### 6.1 Đánh Giá Tổng Thể

**Điểm mạnh:**
- ✅ Phần lớn components (85%+) bám sát chuẩn shadcn/ui
- ✅ Sử dụng đúng Radix UI primitives
- ✅ CVA variants được áp dụng nhất quán
- ✅ Composition pattern tốt (Dialog, Sheet, Form)
- ✅ Barrel export (`index.ts`) được tổ chức tốt

**Điểm cần cải thiện:**
- ⚠️ Một số components chứa hardcoded text tiếng Việt
- ⚠️ Domain-specific presets nằm trong thư viện generic
- ⚠️ Một số layout/branding components quá cụ thể cho Synapse
- ⚠️ `showToast` trong sonner.tsx là side-effect wrapper

### 6.2 Rủi Ro Nếu Không Chuẩn Hóa

1. **Content Coupling:** Thay đổi text tiếng Việt yêu cầu sửa UI library
2. **Feature Leakage:** Business logic (appointment status, roles) trong shared layer
3. **Reusability Loss:** Components như `delete-confirm-dialog` không thể reuse cho các ngữ cảnh khác
4. **i18n Blocking:** Hardcoded text ngăn cản việc đa ngôn ngữ trong tương lai
5. **Testing Complexity:** Side-effects trong `showToast` khó mock

### 6.3 Khuyến Nghị Quy Ước Tương Lai

| Quy tắc | Mô tả |
|---------|-------|
| **No Hardcoded Text** | UI components không được chứa text cụ thể. Sử dụng `children` prop hoặc i18n |
| **No Business Logic** | shared/ui chỉ chứa presentation logic, không domain logic |
| **No Side Effects** | Không có toast triggers, router calls, API calls trong components |
| **Primitive First** | Ưu tiên Radix UI primitives khi có thể |
| **CVA for Variants** | Sử dụng class-variance-authority cho tất cả variants |
| **Composition over Configuration** | Prefer slot-based composition hơn là config objects |
| **Presets Separate** | Presets (badge, status) nên nằm trong `shared/config/` hoặc features |

---

## 7. HÀNH ĐỘNG ĐỀ XUẤT (Không thực hiện - chỉ ghi nhận)

### Priority 1 (High Impact)
1. Di chuyển `badge-presets.ts` → `shared/config/badge-presets.ts`
2. Di chuyển `delete-confirm-dialog.tsx` → `shared/components/delete-confirm-dialog.tsx`
3. Di chuyển `table-row-actions.tsx` → `shared/components/table-row-actions.tsx`

### Priority 2 (Medium Impact)
4. Di chuyển `layouts/auth-layout.tsx` → `features/auth/components/auth-layout.tsx`
5. Di chuyển `branding/header-logo.tsx` → `shared/components/layout/header-logo.tsx`
6. Di chuyển `data-display/stat-card.tsx` → `shared/components/data-display/stat-card.tsx`

### Priority 3 (Low Impact)
7. Di chuyển `navigation/mobile-nav-bar.tsx` → `widgets/navigation/mobile-nav-bar.tsx`
8. Di chuyển `date-range-navigator.tsx` → `shared/components/date-range-navigator.tsx`
9. Tách `showToast` từ `sonner.tsx` thành `shared/lib/toast.ts`

---

**KẾT LUẬN:** `shared/ui` đạt ~85% compliance với chuẩn shadcn/ui. Cần di chuyển ~9 components/files ra khỏi thư viện UI để đảm bảo tính generic và maintainability của design system.
