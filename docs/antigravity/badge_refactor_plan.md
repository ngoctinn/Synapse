# Kế Hoạch Refactor Badge Component

> **Ngày tạo:** 2025-12-15
> **Trạng thái:** 🟡 CHỜ PHÊ DUYỆT
> **Mục tiêu:** Cải thiện visual clarity của Badge theo style reference

---

## 1. PHÂN TÍCH REFERENCE STYLE

### 1.1. Đặc Điểm Style Reference

Từ hình ảnh reference, tôi nhận thấy các đặc điểm sau:

| Đặc điểm | Reference Style | Current Style |
|----------|-----------------|---------------|
| **Background opacity** | ~20-30% (rõ ràng) | 15% (nhạt) |
| **Border** | Có border cùng tone màu | Không có (transparent) |
| **Border radius** | Full rounded (pill shape) | ✅ Đã có |
| **Icon** | Có icon bên trái | ✅ Đã hỗ trợ |
| **Color palette** | 12+ màu distinct | 8 màu semantic |
| **Text weight** | Medium/Semibold | ✅ Medium |
| **Padding** | Generous (px-3 py-1.5) | Compact (px-2.5 py-0.5) |

### 1.2. Color Palette từ Reference

```
┌─────────────────────────────────────────────────────────────────┐
│  🔴 Red (Images, Trashed)     │  bg: #FEE2E2  text: #DC2626    │
│  🟢 Green (Articles, Chennai) │  bg: #D1FAE5  text: #059669    │
│  💗 Pink (Favourites)         │  bg: #FCE7F3  text: #DB2777    │
│  🔵 Blue (Videos, Read Later) │  bg: #DBEAFE  text: #2563EB    │
│  🟡 Yellow (Music, Trashed)   │  bg: #FEF3C7  text: #D97706    │
│  🟣 Purple ("Design")         │  bg: #EDE9FE  text: #7C3AED    │
│  🩵 Teal (404 Links)          │  bg: #CCFBF1  text: #0D9488    │
│  ⚪ Gray (Links, Hidden)       │  bg: #F3F4F6  text: #4B5563    │
│  🧡 Orange (Highlighted)      │  bg: #FFEDD5  text: #EA580C    │
│  🩷 Rose (Emma's Bookmarks)   │  bg: #FFE4E6  text: #E11D48    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. ĐỀ XUẤT THAY ĐỔI

### 2.1. Cập Nhật Base Style

**Hiện tại:**
```tsx
"inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium..."
```

**Đề xuất:**
```tsx
"inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold..."
```

**Thay đổi:**
- `px-2.5 py-0.5` → `px-3 py-1` (padding generous hơn)
- `font-medium` → `font-semibold` (text đậm hơn, dễ đọc)

### 2.2. Cập Nhật Variant Colors

#### A. SEMANTIC VARIANTS (Dùng cho trạng thái)

| Variant | Current | Proposed |
|---------|---------|----------|
| **success** | `bg-success/15 text-success` | `bg-emerald-100 text-emerald-700 border-emerald-200` |
| **warning** | `bg-warning/15 text-warning` | `bg-amber-100 text-amber-700 border-amber-200` |
| **destructive** | `bg-destructive/15 text-destructive` | `bg-red-100 text-red-700 border-red-200` |
| **info** | `bg-info/15 text-info` | `bg-blue-100 text-blue-700 border-blue-200` |

#### B. CATEGORY VARIANTS (Mới - cho tags/categories)

```tsx
// === CATEGORY COLORS (Distinct, vibrant) ===
rose: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
pink: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
fuchsia: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950 dark:text-fuchsia-300 dark:border-fuchsia-800",
purple: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
violet: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
indigo: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
blue: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
sky: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
cyan: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
teal: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
emerald: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
green: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
lime: "bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-950 dark:text-lime-300 dark:border-lime-800",
yellow: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
amber: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
orange: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
red: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
stone: "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700",
neutral: "bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700",
```

### 2.3. Mapping Use Cases → Variants

| Use Case trong Synapse | Variant Đề Xuất |
|------------------------|-----------------|
| **Appointment - Pending** | `amber` |
| **Appointment - Confirmed** | `blue` |
| **Appointment - In Progress** | `violet` |
| **Appointment - Completed** | `emerald` |
| **Appointment - Cancelled** | `red` |
| **Appointment - No Show** | `stone` |
| **Role - Admin** | `purple` |
| **Role - Receptionist** | `sky` |
| **Role - Technician** | `cyan` |
| **Tier - Silver** | `neutral` |
| **Tier - Gold** | `amber` |
| **Tier - Platinum** | `violet` |
| **Resource - Available** | `emerald` |
| **Resource - In Use** | `orange` |
| **Resource - Maintenance** | `red` |
| **Invoice - Unpaid** | `amber` |
| **Invoice - Paid** | `emerald` |
| **Invoice - Refunded** | `red` |
| **Skills/Tags** | `blue` |
| **Category Tags** | Cycle through colors |

---

## 3. CODE IMPLEMENTATION

### 3.1. Updated Badge Variants

```tsx
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1.5 [&>svg]:pointer-events-none transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        // === CORE VARIANTS ===
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground border-border",
        outline:
          "text-foreground border-border bg-transparent",

        // === SEMANTIC STATUS (Clear & Distinct) ===
        success:
          "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
        warning:
          "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        destructive:
          "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
        info:
          "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",

        // === COLOR PALETTE (12 distinct colors) ===
        rose: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
        pink: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
        purple: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
        violet: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
        indigo: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
        blue: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
        sky: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
        cyan: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
        teal: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
        emerald: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
        green: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
        lime: "bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-950 dark:text-lime-300 dark:border-lime-800",
        yellow: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
        amber: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        orange: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
        red: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
        gray: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",

        // === SPECIAL VARIANTS ===
        glass:
          "border-white/20 bg-white/80 text-foreground backdrop-blur-md shadow-sm dark:bg-black/40 dark:text-white",
      },
      size: {
        xs: "text-[10px] px-2 py-0.5 h-5 [&>svg]:size-3",
        sm: "text-[11px] px-2.5 py-0.5 h-6 [&>svg]:size-3",
        md: "text-xs px-3 py-1 h-7 [&>svg]:size-3.5",
        lg: "text-sm px-4 py-1.5 h-8 [&>svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)
```

### 3.2. Updated Preset Mappings

```tsx
const BADGE_PRESETS: Record<BadgePreset, PresetConfig> = {
  // === APPOINTMENT STATUS ===
  "appointment-pending": { variant: "amber", label: "Chờ xác nhận" },
  "appointment-confirmed": { variant: "blue", label: "Đã xác nhận" },
  "appointment-in-progress": { variant: "violet", label: "Đang thực hiện", withIndicator: true, indicatorPulse: true },
  "appointment-completed": { variant: "emerald", label: "Hoàn thành" },
  "appointment-cancelled": { variant: "red", label: "Đã hủy" },
  "appointment-no-show": { variant: "gray", label: "Không đến" },

  // === ROLES ===
  "role-admin": { variant: "purple", label: "Quản trị viên" },
  "role-receptionist": { variant: "sky", label: "Lễ tân" },
  "role-technician": { variant: "cyan", label: "Kỹ thuật viên" },
  "role-customer": { variant: "gray", label: "Khách hàng" },

  // === TIERS ===
  "tier-silver": { variant: "gray", label: "Silver" },
  "tier-gold": { variant: "amber", label: "Gold" },
  "tier-platinum": { variant: "violet", label: "Platinum" },

  // === RESOURCE STATUS ===
  "resource-available": { variant: "emerald", label: "Sẵn sàng", withIndicator: true },
  "resource-in-use": { variant: "orange", label: "Đang sử dụng" },
  "resource-maintenance": { variant: "red", label: "Bảo trì" },

  // === RESOURCE TYPE ===
  "resource-room": { variant: "blue", size: "sm", label: "Phòng" },
  "resource-equipment": { variant: "teal", size: "sm", label: "Thiết bị" },

  // === INVOICE ===
  "invoice-unpaid": { variant: "amber", label: "Chưa thanh toán" },
  "invoice-paid": { variant: "emerald", label: "Đã thanh toán" },
  "invoice-refunded": { variant: "red", label: "Đã hoàn tiền" },

  // === EXCEPTION TYPES ===
  "exception-holiday": { variant: "red", size: "xs", label: "Nghỉ lễ" },
  "exception-maintenance": { variant: "gray", size: "xs", label: "Bảo trì" },
  "exception-special": { variant: "violet", size: "xs", label: "Giờ đặc biệt" },
  "exception-custom": { variant: "outline", size: "xs", label: "Tùy chỉnh" },

  // === CHANNEL STATUS ===
  "channel-connected": { variant: "emerald", label: "Đã kết nối" },
  "channel-disconnected": { variant: "gray", label: "Chưa kết nối" },

  // === GENERIC ===
  "tag": { variant: "blue", size: "sm" },
  "count": { variant: "violet", size: "xs" },
  "new": { variant: "emerald", label: "Mới", size: "sm" },
  "skill": { variant: "cyan", size: "sm" },
}
```

---

## 4. VISUAL COMPARISON

### Before vs After

```
BEFORE (opacity 15%, no border):
┌──────────────────┐
│  Hoàn thành      │  → Màu nhạt, khó nhìn
└──────────────────┘

AFTER (solid bg, visible border):
┌──────────────────┐
│ ✓ Hoàn thành     │  → Màu rõ ràng, dễ phân biệt
└──────────────────┘
```

### Color Swatch Preview

```
🔴 red        ████████  Cancelled, Maintenance, Refunded
🟠 orange     ████████  In Use
🟡 amber      ████████  Pending, Gold, Unpaid  
🟢 emerald    ████████  Completed, Available, Paid, Connected
🔵 blue       ████████  Confirmed, Tags
🩵 sky        ████████  Receptionist
💎 cyan       ████████  Technician, Skills
💜 violet     ████████  In Progress, Platinum, Count
🟣 purple     ████████  Admin
⚪ gray       ████████  No Show, Silver, Inactive
```

---

## 5. MIGRATION CHECKLIST

### 5.1. Files Cần Cập Nhật

| # | File | Changes |
|---|------|---------|
| 1 | `shared/ui/badge.tsx` | Update variants & presets |
| 2 | `features/appointments/constants.ts` | Remove custom color configs |
| 3 | `features/appointments/components/event/event-card.tsx` | Use presets |
| 4 | `features/appointments/components/sheet/appointment-sheet.tsx` | Use presets |
| 5 | `features/customers/components/customer-history.tsx` | Remove STATUS_Map |
| 6 | `features/customer-dashboard/components/appointment-list.tsx` | Use presets |
| 7 | `features/customer-dashboard/components/treatment-list.tsx` | Update statusMap |
| 8 | `features/billing/components/invoice-status-badge.tsx` | Use presets |
| 9 | `features/billing/constants.ts` | Remove INVOICE_STATUS_COLORS |
| 10 | `features/resources/components/resource-table.tsx` | Use presets |
| 11 | `features/staff/model/constants.ts` | Simplify ROLE_CONFIG |
| 12 | `features/landing-page/components/service-card.tsx` | Update Badge styling |

### 5.2. Backwards Compatibility

**Deprecated variants to keep temporarily:**
- `gold`, `platinum` → Map to `amber`, `violet`
- `status-active`, `status-inactive` → Map to `emerald`, `gray`
- `soft` → Map to `blue` with lower opacity

---

## 6. TIMELINE

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| **Phase 1** | Update `badge.tsx` với variants mới | 30 min |
| **Phase 2** | Update tất cả presets | 20 min |
| **Phase 3** | Migrate appointment components | 30 min |
| **Phase 4** | Migrate billing components | 15 min |
| **Phase 5** | Migrate other components | 30 min |
| **Phase 6** | Testing & verification | 20 min |
| **TOTAL** | | ~2.5 hours |

---

## 7. ACCEPTANCE CRITERIA

- [ ] Tất cả Badge có màu sắc rõ ràng, dễ phân biệt
- [ ] Dark mode hoạt động đúng
- [ ] Không có hardcoded color overrides trong components
- [ ] Tất cả status badges sử dụng preset system
- [ ] `pnpm lint` pass
- [ ] `pnpm build` pass
- [ ] Visual regression test pass

---

**⏸️ DỪNG TẠI ĐÂY - CHỜ PHÊ DUYỆT TRƯỚC KHI TIẾP TỤC**

Xin hãy xác nhận:
1. Color palette có phù hợp không?
2. Có muốn thêm/bớt variants nào không?
3. Có muốn tôi bắt đầu implement ngay không?
