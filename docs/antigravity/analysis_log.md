# 📋 Analysis Log - Badge/Tag Consistency Audit

**Thời gian phân tích**: 2025-12-15 16:43 - 16:55
**Người thực hiện**: Agent (Antigravity Workflow)

---

## 1. Phạm Vi Phân Tích

### Files được scan:
- `shared/ui/badge.tsx` - Core Badge component
- 28+ files sử dụng Badge trong `features/`
- 2 custom Badge components

### Pattern tìm kiếm:
```
<Badge.*className=
Badge\s+variant=.*className=
```

---

## 2. Phát Hiện Chi Tiết

### 2.1. className Overrides (10 trường hợp)

| File | Line | Override | Root Cause |
|------|------|----------|------------|
| `exceptions-panel.tsx` | 166 | `text-[10px] px-1.5 h-5 font-normal` | Thiếu size variant phù hợp |
| `notification-list.tsx` | 46 | `h-6 w-6 rounded-full p-0 flex...` | Sử dụng Badge sai mục đích (counter) |
| `permission-matrix.tsx` | 77 | `rounded-md px-3 py-1` | Muốn shape khác rounded-full |
| `skill-table.tsx` | 81 | `font-mono` | Muốn monospace font |
| `resource-table.tsx` | 95 | `gap-1.5 font-medium border shadow-sm` | Custom styling cho type badge |
| `resource-table.tsx` | 117 | `shadow-sm` | Decorative shadow |
| `customer-table.tsx` | 133 | `uppercase font-bold tracking-wider` | Custom tier styling |
| `customer-sheet.tsx` | 149 | `gap-1.5 animate-in zoom-in-50` | Animation |
| `customer-sheet.tsx` | 156 | `gap-1.5` | Gap override |
| `notification-popover.tsx` | 52 | `h-5 px-1.5 min-w-[20px]` | Counter sizing |
| `invoice-details.tsx` | 108 | `text-[10px]` | Size override |
| `filter-bar.tsx` | 166,216,265 | `ml-2` | Spacing |
| `filter-bar.tsx` | 332,352,372,387 | `gap-1 pr-1` | Chip styling |

### 2.2. Custom Badge Components

| Component | Status | Notes |
|-----------|--------|-------|
| `InvoiceStatusBadge` | ✅ Good | Sử dụng variant system đúng cách |
| `ChannelStatusBadge` | ⚠️ Refactored | Đã migrate sang preset system |

### 2.3. Inline Constants

| File | Constant | Action |
|------|----------|--------|
| `customer-table.tsx` | `TIER_STYLES` | ✅ Removed (sử dụng preset) |
| `exceptions-panel.tsx` | `getBadgeVariant()` | ✅ Removed (sử dụng preset) |

---

## 3. Dependencies Affected

```
shared/ui/badge.tsx
├── features/settings/operating-hours/exceptions-panel.tsx
├── features/settings/notifications/components/notification-list.tsx
├── features/settings/notifications/components/channel-status-badge.tsx
├── features/staff/components/permissions/permission-matrix.tsx
├── features/services/components/skill-table.tsx
├── features/resources/components/resource-table.tsx
├── features/customers/components/customer-list/customer-table.tsx
├── features/customers/components/customer-sheet.tsx
├── features/notifications/components/notification-popover.tsx
├── features/billing/components/sheet/invoice-details.tsx
└── features/appointments/components/toolbar/filter-bar.tsx
```

---

## 4. Quyết Định Thiết Kế

### 4.1. Giữ nguyên Shape mặc định (rounded-full)
- Không thêm shape variant
- Badge với rounded-md cần sử dụng size sm thay vì override

### 4.2. Không thêm font variant
- Loại bỏ font-mono override
- Badge code vẫn dùng font mặc định

### 4.3. Mở rộng Preset System
Thêm 12 presets mới:
- `resource-room`, `resource-equipment`
- `exception-holiday`, `exception-maintenance`, `exception-special`, `exception-custom`
- `channel-connected`, `channel-disconnected`
- `skill`

---

## 5. Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Visual regression | Low | Size md/sm thay thế className overrides |
| Breaking API | None | Chỉ thêm presets, không thay đổi variants |
| Performance | None | Không tăng bundle size đáng kể |
