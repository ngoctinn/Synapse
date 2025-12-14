# Báo Cáo Kiểm Toán Hệ Thống Badge - Dự Án Synapse

> **Ngày tạo:** 2025-12-14
> **Mục tiêu:** Rà soát, phân tích và xây dựng kế hoạch hợp nhất hệ thống Badge

---

## 📊 TỔNG QUAN THỐNG KÊ

| Chỉ số | Số lượng |
|--------|----------|
| **Tổng import Badge chuẩn** | 29 files |
| **Sử dụng `<Badge>`** | 50+ instances |
| **Badge wrappers (custom)** | 2 components |
| **Overrides phát hiện** | 15+ cases |
| **Files có badge-like inline** | 5 files |

---

## 🏗️ KIẾN TRÚC BADGE HIỆN TẠI

### 1. Core Badge Component (`shared/ui/badge.tsx`)

**Variants đã định nghĩa:**
```typescript
variant: {
  // Base variants
  default, secondary, destructive, outline,
  // Semantic variants
  success, warning, info, soft,
  // Role colors
  purple, indigo,
  // Visual effects
  glass, "glass-light",
  // Status variants (mới thêm)
  "status-active", "status-inactive"
}
```

**Props mở rộng:**
- `withIndicator` - Hiển thị dot indicator
- `indicatorPulse` - Animation pulse
- `indicatorColor` - Màu indicator custom

✅ **Đánh giá:** Core component đã được thiết kế tốt với hệ thống variants phong phú.

---

## 🔍 PHÂN TÍCH CHI TIẾT THEO MODULE

### 2.1. Billing Module

#### `invoice-status-badge.tsx` ✅ Chuẩn
```tsx
// ĐÃ CHUẨN: Sử dụng mapping variant đúng cách
<Badge variant={INVOICE_STATUS_COLORS[status]}>
  {INVOICE_STATUS_LABELS[status]}
</Badge>

// Constants mapping đúng type
const INVOICE_STATUS_COLORS: Record<InvoiceStatus, BadgeVariant> = {
  UNPAID: "warning",
  PAID: "success",
  REFUNDED: "destructive",
}
```

**Trạng thái:** ✅ Tuân thủ - Mẫu tốt để học hỏi

---

### 2.2. Settings/Notifications Module

#### `channel-status-badge.tsx` ✅ Chuẩn
```tsx
// ĐÃ CHUẨN: Component wrapper đúng cách
<Badge variant={isConnected ? "success" : "secondary"}>
  {icon} {label}
</Badge>
```

**Trạng thái:** ✅ Tuân thủ

---

### 2.3. Staff Module

#### `staff-table.tsx` ⚠️ CẦN REFACTOR

**Vấn đề 1: Role Badge có override className**
```tsx
// HIỆN TẠI - Override className
<Badge
  variant={ROLE_CONFIG[staff.user.role]?.variant || "outline"}
  className={cn(
    "rounded-md px-2.5 py-1 font-medium border-transparent text-xs",
    ROLE_CONFIG[staff.user.role]?.className || "bg-muted text-muted-foreground"
  )}
>
```

**Đề xuất:**
- Loại bỏ className override
- ROLE_CONFIG chỉ cần variant, không cần className

**Vấn đề 2: Skill Badge có override lặp lại**
```tsx
// HIỆN TẠI - Override style 3 lần giống nhau
<Badge
  variant="secondary"
  className="text-xs px-2.5 py-1 bg-secondary/50 hover:bg-secondary/70 text-secondary-foreground border-transparent rounded-md"
>
```

**Đề xuất:**
- Tạo variant mới `"skill"` hoặc `"tag"` trong core Badge

---

### 2.4. Booking Wizard Module

#### `staff-list.tsx` ❌ VI PHẠM NGHIÊM TRỌNG

```tsx
// SAI: Override hoàn toàn để có màu khác
<Badge variant="secondary" className="text-[10px] h-5 font-normal px-2 bg-green-100 text-green-700 hover:bg-green-100">
  Có chỗ hôm nay
</Badge>
```

**Vấn đề:**
- Dùng variant `secondary` nhưng override thành màu xanh green
- Không nhất quán với design system
- Hardcode màu trực tiếp

**Đề xuất:**
- Sử dụng variant `success` có sẵn (đã đúng ngữ nghĩa "available")

---

### 2.5. Customer Module

#### `customer-table.tsx` ⚠️ CẦN REFACTOR

**Vấn đề: TIER_STYLES thiếu semantic mapping**
```tsx
const TIER_STYLES: Record<string, "secondary" | "warning" | "default" | "outline"> = {
  SILVER: "secondary",
  GOLD: "warning",
  PLATINUM: "default",
}

<Badge variant={TIER_STYLES[c.membership_tier] || "outline"} className="text-[10px] uppercase font-bold tracking-wider">
```

**Đề xuất:**
- Thêm variant `"gold"`, `"platinum"`, `"silver"` vào core Badge hoặc
- Tự tin dùng các semantic hiện có (warning=gold là hợp lý)
- Loại bỏ override className, sizes nên nhất quán

---

### 2.6. Profile Avatar (inline badge-like)

#### `profile-avatar.tsx` ❌ KHÔNG DÙNG BADGE COMPONENT

```tsx
// SAI: Tự build inline thay vì dùng Badge
<span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
  {user.membershipTier}
</span>
```

**Đề xuất:**
- Thay bằng `<Badge variant="soft">{user.membershipTier}</Badge>`

---

### 2.7. Appointments Module

#### `event-card.tsx` ⚠️ CẦN REFACTOR

```tsx
// HIỆN TẠI: Dynamic color override từ statusConfig
<Badge
  variant="secondary"
  className={cn("text-[10px] gap-1", statusConfig.color, statusConfig.bgColor)}
>
```

**Vấn đề:**
- Dùng variant cố định `secondary` nhưng override màu động
- `statusConfig` có riêng hệ màu không map về Badge variants

**Đề xuất:**
- Tạo mapping từ appointment status → badge variant
- Loại bỏ inline color/bgColor

#### `appointment-sheet.tsx` ⚠️ TƯƠNG TỰ
```tsx
<Badge variant="secondary" className={cn(statusConfig.bgColor, statusConfig.color)}>
```

---

### 2.8. Chat Module

#### `chat-sidebar.tsx` ⚠️ CẦN REFACTOR

```tsx
<Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-normal bg-secondary/50 text-secondary-foreground border-transparent">
```

**Đề xuất:**
- Tạo size variant (sm, md) thay vì override liên tục

---

### 2.9. Resources Module

#### `maintenance-timeline.tsx` ⚠️ CẦN REFACTOR

```tsx
<Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4.5 font-normal bg-muted/50 border-muted-foreground/20">
```

**Đề xuất:**
- Tạo size `xs` hoặc `sm` trong Badge

---

## 📋 TÓM TẮT VẤN ĐỀ PHÁT HIỆN

### Loại A: Override hoàn toàn style (Nghiêm trọng) ❌
| File | Vị trí | Mô tả |
|------|--------|-------|
| `booking-wizard/staff-list.tsx` | Line 53 | Override `secondary` → green |
| `profile-avatar.tsx` | Line 61 | Inline thay vì Badge component |
| `event-card.tsx` | Line 168 | Dynamic color override |
| `appointment-sheet.tsx` | Line 173 | Dynamic color override |

### Loại B: Override size/spacing (Trung bình) ⚠️
| File | Vị trí | Mô tả |
|------|--------|-------|
| `staff-table.tsx` | Lines 194-198, 214, 225 | Override rounded, padding |
| `chat-sidebar.tsx` | Line 72 | Override size |
| `maintenance-timeline.tsx` | Line 212 | Override size h-4.5 |
| `skill-table.tsx` | Line 81 | Override style |

### Loại C: Constants không nhất quán
| Module | Constant | Vấn đề |
|--------|----------|--------|
| Staff | `ROLE_CONFIG` | Có `className` thừa |
| Customers | `TIER_STYLES` | Inline trong component |
| Appointments | `APPOINTMENT_STATUS_CONFIG` | Có `color`, `bgColor` riêng |

---

## 🛠️ KẾ HOẠCH REFACTOR CHI TIẾT

### Phase 1: Mở rộng Core Badge (1 ngày)

#### 1.1. Thêm Size Variants
```typescript
// Đề xuất thêm vào badge.tsx
size: {
  xs: "text-[10px] px-1.5 py-0 h-4",
  sm: "text-xs px-2 py-0.5 h-5",
  md: "text-xs px-2.5 py-0.5 h-6", // default
  lg: "text-sm px-3 py-1 h-7",
}
```

#### 1.2. Thêm Semantic Variants (nếu cần)
```typescript
// Chỉ thêm nếu thực sự cần thiết
"available": "border-transparent bg-success/15 text-success",
"tag": "border-transparent bg-secondary/50 text-secondary-foreground hover:bg-secondary/70",
```

---

### Phase 2: Refactor Appointments Status (2 ngày)

#### 2.1. Tạo mapping mới
```typescript
// appointments/constants.ts
export const STATUS_TO_BADGE_VARIANT: Record<AppointmentStatus, BadgeVariant> = {
  PENDING: "warning",
  CONFIRMED: "info",
  IN_PROGRESS: "default",
  COMPLETED: "success",
  CANCELLED: "destructive",
  NO_SHOW: "secondary",
}
```

#### 2.2. Update EventCard và AppointmentSheet
```tsx
// BEFORE
<Badge variant="secondary" className={cn(statusConfig.color, statusConfig.bgColor)}>

// AFTER
<Badge variant={STATUS_TO_BADGE_VARIANT[event.status]} size="sm">
```

---

### Phase 3: Refactor Staff Module (1 ngày)

#### 3.1. Đơn giản hóa ROLE_CONFIG
```typescript
// BEFORE
export const ROLE_CONFIG = {
  admin: { label: "Quản trị viên", variant: "purple", className: "..." },
  ...
}

// AFTER
export const ROLE_CONFIG: Record<Role, { label: string; variant: BadgeVariant }> = {
  admin: { label: "Quản trị viên", variant: "purple" },
  receptionist: { label: "Lễ tân", variant: "info" },
  technician: { label: "Kỹ thuật viên", variant: "warning" },
  customer: { label: "Khách hàng", variant: "secondary" },
}
```

#### 3.2. Update staff-table.tsx
```tsx
// BEFORE
<Badge variant={...} className={cn("rounded-md px-2.5 py-1...", ...)}>

// AFTER
<Badge variant={ROLE_CONFIG[role].variant} size="sm">
```

---

### Phase 4: Refactor Booking Wizard (0.5 ngày)

```tsx
// BEFORE
<Badge variant="secondary" className="...bg-green-100 text-green-700...">

// AFTER
<Badge variant="success" size="xs">
  Có chỗ hôm nay
</Badge>
```

---

### Phase 5: Refactor inline badge-like elements (0.5 ngày)

#### `profile-avatar.tsx`
```tsx
// BEFORE
<span className="inline-flex items-center rounded-full bg-primary/10...">

// AFTER
<Badge variant="soft" size="sm">
```

---

### Phase 6: Standardize Customer Tier (0.5 ngày)

Di chuyển TIER_STYLES ra constants riêng:
```typescript
// customers/constants.ts
export const TIER_BADGE_VARIANTS: Record<MembershipTier, BadgeVariant> = {
  SILVER: "secondary",
  GOLD: "warning",
  PLATINUM: "info", // hoặc custom variant nếu cần
}
```

---

## ✅ CHECKLIST SAU REFACTOR

| Task | Trạng thái |
|------|------------|
| Core Badge có size variants | ⬜ |
| Appointments dùng mapping variant thay vì inline color | ⬜ |
| Staff table không override className | ⬜ |
| Booking wizard dùng `success` variant | ⬜ |
| Profile avatar dùng `<Badge>` component | ⬜ |
| Tất cả constants được centralize | ⬜ |
| Build pass không lỗi | ⬜ |
| Visual regression test | ⬜ |

---

## 🎯 ƯU TIÊN THỰC HIỆN

1. **Cao** 🔴 - Booking wizard (override sai ngữ nghĩa)
2. **Cao** 🔴 - Profile avatar (không dùng component)
3. **Trung bình** 🟡 - Appointments status mapping
4. **Trung bình** 🟡 - Staff table cleanup
5. **Thấp** 🟢 - Size variants (enhancement)
6. **Thấp** 🟢 - Constants consolidation

---

## 📁 FILES LIÊN QUAN

### Files cần sửa trực tiếp:
1. `shared/ui/badge.tsx` - Thêm size variants
2. `booking-wizard/components/step-technician/staff-list.tsx`
3. `customer-dashboard/components/profile-avatar.tsx`
4. `appointments/constants.ts`
5. `appointments/components/event/event-card.tsx`
6. `appointments/components/sheet/appointment-sheet.tsx`
7. `staff/model/constants.ts`
8. `staff/components/staff-list/staff-table.tsx`

### Files đã chuẩn (không cần sửa):
1. `billing/components/invoice-status-badge.tsx` ✅
2. `settings/notifications/components/channel-status-badge.tsx` ✅

---

**Ước tính thời gian tổng:** 5-6 giờ làm việc
**Rủi ro thấp:** Các thay đổi chủ yếu là cleanup, không ảnh hưởng logic

