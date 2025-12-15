# Change Log - Badge System Refactor

> **Ngày:** 2025-12-16
> **Phiên:** Badge/Tag Visual Consistency Improvements

---

## Tóm Tắt

Refactor hệ thống Badge/Tag để có màu sắc rõ ràng, vibrant hơn, thay thế kiểu opacity 15% bằng màu solid với border distinct.

---

## Thay Đổi Chi Tiết

### 1. `shared/ui/badge.tsx`

**Thay đổi chính:**

#### Base Styles
```tsx
// Before
"inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"

// After
"inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap"
```

#### Variant System (hoàn toàn mới)
17 color variants thay vì 5 cũ:

| Variant | Light Mode | Dark Mode |
|---------|------------|-----------|
| rose | bg-rose-100, text-rose-700, border-rose-200 | bg-rose-950, text-rose-300, border-rose-800 |
| pink | bg-pink-100, text-pink-700, border-pink-200 | bg-pink-950, text-pink-300, border-pink-800 |
| fuchsia | bg-fuchsia-100, text-fuchsia-700, border-fuchsia-200 | bg-fuchsia-950, text-fuchsia-300, border-fuchsia-800 |
| purple | bg-purple-100, text-purple-700, border-purple-200 | bg-purple-950, text-purple-300, border-purple-800 |
| violet | bg-violet-100, text-violet-700, border-violet-200 | bg-violet-950, text-violet-300, border-violet-800 |
| indigo | bg-indigo-100, text-indigo-700, border-indigo-200 | bg-indigo-950, text-indigo-300, border-indigo-800 |
| blue | bg-blue-100, text-blue-700, border-blue-200 | bg-blue-950, text-blue-300, border-blue-800 |
| sky | bg-sky-100, text-sky-700, border-sky-200 | bg-sky-950, text-sky-300, border-sky-800 |
| cyan | bg-cyan-100, text-cyan-700, border-cyan-200 | bg-cyan-950, text-cyan-300, border-cyan-800 |
| teal | bg-teal-100, text-teal-700, border-teal-200 | bg-teal-950, text-teal-300, border-teal-800 |
| emerald | bg-emerald-100, text-emerald-700, border-emerald-200 | bg-emerald-950, text-emerald-300, border-emerald-800 |
| green | bg-green-100, text-green-700, border-green-200 | bg-green-950, text-green-300, border-green-800 |
| lime | bg-lime-100, text-lime-700, border-lime-200 | bg-lime-950, text-lime-300, border-lime-800 |
| yellow | bg-yellow-100, text-yellow-700, border-yellow-200 | bg-yellow-950, text-yellow-300, border-yellow-800 |
| amber | bg-amber-100, text-amber-700, border-amber-200 | bg-amber-950, text-amber-300, border-amber-800 |
| orange | bg-orange-100, text-orange-700, border-orange-200 | bg-orange-950, text-orange-300, border-orange-800 |
| red | bg-red-100, text-red-700, border-red-200 | bg-red-950, text-red-300, border-red-800 |
| gray | bg-gray-100, text-gray-700, border-gray-200 | bg-gray-950, text-gray-300, border-gray-800 |

#### Presets Updated
```tsx
// Before → After
success: "default" → "emerald"
warning: "secondary" → "amber"
error: "destructive" → "red"
info: "info" → "sky"
pending: "outline" → "yellow"
confirmed: "default" → "blue"
completed: "default" → "emerald"
cancelled: "destructive" → "red"
```

#### New `getIndicatorColorClass()` Function
Updated để match 17 variants mới với CSS colors cho indicators.

---

### 2. `shared/ui/index.ts`

**Thêm exports:**
```tsx
export { Badge, badgeVariants, BADGE_PRESETS } from "./badge"
export type { BadgePreset, BadgeVariant } from "./badge"
```

---

### 3. `features/billing/components/invoice-status-badge.tsx`

**Before:**
```tsx
const INVOICE_STATUS_COLORS: Record<InvoiceStatus, BadgeVariant> = {
  pending: "outline",
  paid: "default",
  cancelled: "destructive",
  refunded: "secondary",
}

<Badge variant={INVOICE_STATUS_COLORS[status]}>{INVOICE_STATUS_LABELS[status]}</Badge>
```

**After:**
```tsx
const STATUS_TO_PRESET: Record<InvoiceStatus, BadgePreset> = {
  pending: "pending",
  paid: "success",
  cancelled: "cancelled",
  refunded: "warning",
}

<Badge preset={STATUS_TO_PRESET[status]} />
```

---

### 4. `features/staff/model/constants.ts`

**ROLE_CONFIG Updates:**
```tsx
// Before → After
admin: { badgeVariant: "info" } → { badgeVariant: "sky" }
manager: { badgeVariant: "info" } → { badgeVariant: "cyan" }
technician: { badgeVariant: "secondary" } → { badgeVariant: "gray" }
```

---

### 5. `features/appointments/components/event/event-card.tsx`

**Before:**
```tsx
const statusClasses = {
  booked: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  // ...
}
<Badge className={cn("text-[10px]", statusClasses[status])}>
```

**After:**
```tsx
const STATUS_TO_PRESET: Record<AppointmentStatus, BadgePreset> = {
  booked: "info",
  confirmed: "confirmed",
  in_progress: "warning",
  completed: "completed",
  cancelled: "cancelled",
  no_show: "error",
}
<Badge preset={STATUS_TO_PRESET[status]} className="text-[10px]">
```

---

### 6. `features/appointments/components/sheet/appointment-sheet.tsx`

**Removed:**
```tsx
import { APPOINTMENT_STATUS_CONFIG } from "../../model/constants"
```

**Changed:**
```tsx
// Before
<Badge variant={APPOINTMENT_STATUS_CONFIG[appointment.status]?.variant}>

// After
<Badge preset={appointment.status === "confirmed" ? "confirmed" : 
               appointment.status === "completed" ? "completed" :
               appointment.status === "cancelled" ? "cancelled" : 
               appointment.status === "in_progress" ? "warning" : "pending"}>
```

---

### 7. `features/customer-dashboard/components/appointment-list.tsx`

**Before (duplicate maps):**
```tsx
const statusMap: Record<AppointmentStatus, BadgeVariant> = {
  booked: "outline",
  confirmed: "secondary",
  // ...
}
const labelMap: Record<AppointmentStatus, string> = { ... }
// Another statusMap with uppercase labels!
```

**After (single function):**
```tsx
function getStatusPreset(status: AppointmentStatus): BadgePreset {
  const map: Record<AppointmentStatus, BadgePreset> = {
    booked: "pending",
    confirmed: "confirmed",
    in_progress: "warning",
    completed: "completed",
    cancelled: "cancelled",
    no_show: "error",
  }
  return map[status] ?? "pending"
}

<Badge preset={getStatusPreset(status)} />
```

---

### 8. `features/customer-dashboard/components/treatment-list.tsx`

**Updates:**
```tsx
// Before → After
active: { variant: "default" } → { variant: "violet" }
completed: { variant: "secondary" } → { variant: "emerald" }
expired: { variant: "destructive" } → { variant: "red" }
```

---

### 9. `features/customers/components/customer-history.tsx`

**Before (separate maps):**
```tsx
const STATUS_Map: Record<string, BadgeVariant> = { ... }
const STATUS_LABEL: Record<string, string> = { ... }
```

**After (unified map):**
```tsx
const STATUS_MAP: Record<AppointmentStatus, { variant: BadgeVariant; label: string }> = {
  booked: { variant: "yellow", label: "Đã đặt" },
  confirmed: { variant: "blue", label: "Đã xác nhận" },
  in_progress: { variant: "amber", label: "Đang thực hiện" },
  completed: { variant: "emerald", label: "Hoàn thành" },
  cancelled: { variant: "red", label: "Đã hủy" },
  no_show: { variant: "gray", label: "Vắng mặt" },
}
```

---

## Verification

- ✅ Lint: 0 errors (24 warnings pre-existing, unrelated)
- ✅ Type checks: All files pass
- ✅ No breaking changes to Badge API

---

## Design Rationale

1. **Solid colors thay opacity**: Dễ nhìn hơn, contrast tốt hơn
2. **Borders**: Phân biệt badges rõ ràng trên các nền khác nhau
3. **17 colors**: Đủ để cover mọi use case semantic
4. **Preset system**: Giảm duplicate, tăng consistency
5. **Dark mode support**: Inverted colors (950 bg) cho visibility
