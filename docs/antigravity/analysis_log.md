# Analysis Log - Code Review Features

## Session: 2025-12-18

### 1. formatCurrency Duplicate Analysis

**File 1**: `billing/components/sheet/invoice-details.tsx` (Line 14-17)
```typescript
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
```
- **Vấn đề**: Định nghĩa local, giống y hệt shared utils
- **Hành động**: Xóa, import từ `@/shared/lib/utils`

**File 2**: `appointments/components/dashboard/metrics-cards.tsx` (Line 103-111)
```typescript
const formatCurrency = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toLocaleString("vi-VN");
};
```
- **Vấn đề**: Định nghĩa local KHÁC với shared (có abbreviated format)
- **Quyết định**: GIỮ NGUYÊN vì logic khác (abbreviated format cho metrics dashboard)
- **Giải pháp tốt hơn**: Đổi tên thành `formatCompactCurrency` để tránh nhầm lẫn

### 2. STATUS_TO_PRESET Duplicate Analysis

3 nơi định nghĩa mapping giống nhau:
- `appointments/components/sheet/appointment-sheet.tsx` (Line 47)
- `appointments/components/event/event-card.tsx` (Line 31)
- `billing/components/invoice-status-badge.tsx` (Line 8)

**Quyết định**: Tạo file constants chung cho STATUS mapping

### 3. Customer Dashboard Structure Analysis

Hiện tại:
- `schemas.ts` (root) - ProfileSchema
- `schemas/booking-schema.ts` - BookingSchema
- `constants.ts` (root) - re-exports + PROFILE_* constants
- `constants/nav-items.ts` - NAV_ITEMS

**Quyết định**:
- Gộp `schemas/booking-schema.ts` vào `schemas.ts`
- Xóa thư mục `schemas/`
- Giữ nguyên pattern constants/ (barrel export hợp lý)
