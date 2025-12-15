# 📝 Change Log - Badge/Tag Consistency Refactor

## [2025-12-15] Badge UI Consistency Audit & Refactor

### ✅ Completed Tasks

#### 1. Badge Component Enhancement
**File**: `shared/ui/badge.tsx`
- Thêm 12 presets mới:
  - `resource-room`, `resource-equipment` - cho Resource type badges
  - `exception-holiday`, `exception-maintenance`, `exception-special`, `exception-custom` - cho Exception types
  - `channel-connected`, `channel-disconnected` - cho Channel status
  - `skill` - cho Skill tags

#### 2. Loại bỏ className Overrides

| File | Thay đổi |
|------|----------|
| `exceptions-panel.tsx` | `className="text-[10px]..."` → `preset="exception-*"` |
| `notification-list.tsx` | Custom counter → `preset="count"` |
| `permission-matrix.tsx` | `className="rounded-md..."` → `size="sm"` |
| `skill-table.tsx` | `className="font-mono"` → removed |
| `resource-table.tsx` | Multiple overrides → `preset="resource-*"`, `preset="tag"` |
| `customer-table.tsx` | `className="uppercase..."` → `preset="tier-*"` |
| `customer-sheet.tsx` | Animation/gap overrides → standard props |
| `notification-popover.tsx` | Counter override → `preset="count"` |
| `invoice-details.tsx` | `className="text-[10px]"` → `size="xs"` |
| `filter-bar.tsx` | Multiple overrides → `preset="count"`, `preset="tag"` |

#### 3. Cleanup Unused Code
- Removed `TIER_STYLES` constant từ `customer-table.tsx`
- Removed `getBadgeVariant()` function từ `exceptions-panel.tsx`
- Removed unused imports (`EXCEPTION_TYPE_VARIANTS`, `ExceptionType`)

#### 4. Component Migration
**File**: `channel-status-badge.tsx`
- Refactored từ `variant` + `className` → `preset` system
- Removed `cn` import (không còn cần thiết)
- Simplified component code

### 📊 Metrics

| Metric | Before | After |
|--------|--------|-------|
| className overrides | 14 | 0 |
| Custom Badge components | 2 | 1 (InvoiceStatusBadge) |
| Inline constants | 2 | 0 |
| Badge presets | 27 | 39 |

### ✅ Verification
- `pnpm lint`: ✅ Pass (0 errors)
- `pnpm build`: ✅ Pass (Exit code 0)

### Breaking Changes
**None** - Tất cả thay đổi đều backward compatible.
