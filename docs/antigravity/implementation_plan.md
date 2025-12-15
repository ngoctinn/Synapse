# 🎯 Kế Hoạch: UI Consistency Audit - Badge/Tag Components

**Ngày tạo**: 2025-12-15
**Trạng thái**: 📋 ĐANG PHÂN TÍCH
**Độ ưu tiên**: TRUNG BÌNH

---

## 1. Vấn Đề (Problem Statement)

Hệ thống frontend Synapse hiện có **nhiều biến thể không đồng nhất** của các thành phần Badge/Tag, xuất phát từ:
- Nhiều module/feature được phát triển theo các timeline khác nhau
- Thiếu enforcement nghiêm ngặt về việc sử dụng Design System
- Sự xuất hiện của các `className` overrides tùy ý

### 1.1. Các Vấn Đề Cụ Thể Được Phát Hiện

| # | File | Vấn đề | Mức độ |
|---|------|--------|--------|
| A1 | `exceptions-panel.tsx:166` | Override size/font: `className="text-[10px] px-1.5 h-5 font-normal"` | 🔴 Critical |
| A2 | `notification-list.tsx:46` | Override layout: `className="h-6 w-6 rounded-full p-0 flex items-center justify-center"` - Badge dùng sai mục đích (icon counter) | 🔴 Critical |
| A3 | `permission-matrix.tsx:77` | Override shape: `className="rounded-md px-3 py-1"` thay đổi từ rounded-full | 🟡 Medium |
| A4 | `skill-table.tsx:81` | Override font: `className="font-mono"` | 🟢 Low |
| A5 | `resource-table.tsx:95,117` | Override shadow: `className="shadow-sm"` / `"gap-1.5 font-medium border shadow-sm"` | 🟡 Medium |
| A6 | `customer-table.tsx:133` | Override font: `className="uppercase font-bold tracking-wider"` | 🟡 Medium |
| A7 | `customer-sheet.tsx:149,156` | Override animation/gap: `className="gap-1.5 animate-in zoom-in-50"` | 🟢 Low |
| A8 | `notification-popover.tsx:52` | Override sizing: `className="h-5 px-1.5 min-w-[20px] justify-center"` | 🟡 Medium |
| A9 | `invoice-details.tsx:108` | Override font-size: `className="text-[10px]"` | 🟡 Medium |
| A10 | `filter-bar.tsx:166,216,265,387` | Multiple inconsistent usages, some with `className="ml-2"`, `"gap-1 pr-1"` | 🟢 Low |

### 1.2. Custom Badge Components (Scope Creep)

| File | Component | Đánh giá |
|------|-----------|----------|
| `invoice-status-badge.tsx` | `InvoiceStatusBadge` | ✅ **TỐT** - Sử dụng variant system đúng cách |
| `channel-status-badge.tsx` | `ChannelStatusBadge` | ⚠️ **CẦN XEM XÉT** - Có thể migrate sang preset system |

### 1.3. Constants/Config Patterns Được Phát Hiện

| Feature | File | Pattern | Đánh giá |
|---------|------|---------|----------|
| Billing | `constants.ts` | `INVOICE_STATUS_COLORS` | ✅ Đúng chuẩn |
| Staff | `model/constants.ts` | `ROLE_CONFIG` | ✅ Đúng chuẩn, có variant mapping |
| Operating Hours | `constants.ts` | `EXCEPTION_TYPE_VARIANTS` | ✅ Đúng chuẩn |
| Customers | `customer-table.tsx` | `TIER_STYLES` (inline) | ⚠️ Nên move ra constants file |

---

## 2. Mục Đích (Goals)

### 2.1. Mục tiêu Chính
1. **Loại bỏ tất cả className overrides** làm thay đổi visual identity của Badge
2. **Mở rộng Design System** (badge.tsx) để đáp ứng các use case hợp lệ
3. **Đảm bảo Backward Compatibility** - không thay đổi hành vi nghiệp vụ

### 2.2. Mục tiêu Phụ
1. Migrate custom badge components sang preset system (nếu phù hợp)
2. Chuẩn hóa các constants pattern sang một vị trí tập trung
3. Tài liệu hóa Badge usage guidelines

---

## 3. Ràng Buộc (Constraints)

- ❌ **KHÔNG** thay đổi hành vi nghiệp vụ (functional behavior)
- ❌ **KHÔNG** thay đổi thông tin hiển thị (labels, text content)
- ✅ **CHỈ** thay đổi tầng UI và component library
- ✅ **ĐẢM BẢO** backward compatibility hoàn toàn
- ✅ **TUÂN THỦ** chuẩn màu oklch, font, spacing của Design System

---

## 4. Chiến Lược (Strategy)

### Phase 1: Mở rộng Badge Component (LOW RISK)
- Thêm các size variants còn thiếu (nếu cần)
- Thêm các shape variants (rounded-md option)
- Thêm `mono` variant hoặc prop cho font-mono styling

### Phase 2: Tạo Presets Mới (LOW RISK)
- `"code"` preset cho skill codes
- `"counter"` preset cho notification counts
- `"tier-*"` presets đã có sẵn, chỉ cần sử dụng

### Phase 3: Refactor Usage Sites (MEDIUM RISK)
- Từng file một, thay thế className overrides
- Chạy lint + build sau mỗi file
- Output: Zero className overrides cho Badge

### Phase 4: Cleanup & Documentation (LOW RISK)
- Move inline TIER_STYLES constants
- Update COMPONENT_PATTERNS.md
- Add Badge usage examples

---

## 5. Giải Pháp Chi Tiết (Solution)

### 5.1. Badge Component Enhancements

```tsx
// ĐỀ XUẤT: Thêm vào badgeVariants
const badgeVariants = cva(
  "...",
  {
    variants: {
      variant: { /* existing */ },
      size: { /* existing */ },
      // NEW: Shape variants
      shape: {
        pill: "", // default rounded-full (no change needed)
        rounded: "rounded-md",
        square: "rounded-sm",
      },
      // NEW: Font variants
      font: {
        default: "",
        mono: "font-mono",
        bold: "font-bold tracking-wider uppercase",
      },
    },
  }
);
```

### 5.2. New Presets

```tsx
const BADGE_PRESETS = {
  // existing...

  // === CODE/TECHNICAL ===
  "code": { variant: "outline", size: "sm", font: "mono" },

  // === COUNTERS ===
  "counter": { variant: "info", size: "xs" }, // Already exists via "count"
  "counter-pill": { variant: "info", size: "xs", shape: "pill" },

  // === EXCEPTION TYPES ===
  "exception-holiday": { variant: "destructive", label: "Nghỉ lễ" },
  "exception-maintenance": { variant: "secondary", label: "Bảo trì" },
  "exception-special": { variant: "default", label: "Giờ đặc biệt" },
};
```

### 5.3. Migration Examples

```tsx
// BEFORE (exceptions-panel.tsx:166)
<Badge variant={getBadgeVariant(exception.type)} className="text-[10px] px-1.5 h-5 font-normal">

// AFTER
<Badge preset={`exception-${exception.type.toLowerCase()}`} size="xs">

// BEFORE (skill-table.tsx:81)
<Badge variant="outline" size="sm" className="font-mono">

// AFTER
<Badge preset="code">
```

---

## 6. Task Breakdown

| Task ID | Mô tả | Ước lượng | Dependencies |
|---------|-------|-----------|--------------|
| T1 | Mở rộng Badge variants (shape, font) | 15 phút | - |
| T2 | Thêm presets mới | 10 phút | T1 |
| T3 | Refactor exceptions-panel.tsx | 5 phút | T2 |
| T4 | Refactor notification-list.tsx (counter) | 5 phút | T2 |
| T5 | Refactor permission-matrix.tsx | 5 phút | T1 |
| T6 | Refactor skill-table.tsx | 3 phút | T2 |
| T7 | Refactor resource-table.tsx | 5 phút | T1 |
| T8 | Refactor customer-table.tsx | 5 phút | T2 |
| T9 | Refactor các files còn lại | 10 phút | T2 |
| T10 | Migrate ChannelStatusBadge | 5 phút | T2 |
| T11 | Move TIER_STYLES to constants | 5 phút | - |
| T12 | Update documentation | 10 phút | T1-T11 |
| T13 | Final lint + build verification | 5 phút | T12 |

**Tổng thời gian ước lượng**: ~90 phút

---

## 7. Rủi Ro & Mitigation

| Rủi ro | Xác suất | Tác động | Giải pháp |
|--------|----------|----------|-----------|
| Breaking changes | Thấp | Cao | Thực hiện từng file, chạy lint/build ngay |
| Visual regression | Trung bình | Trung bình | So sánh UI trước/sau bằng screenshot |
| Missed edge cases | Thấp | Thấp | Grep search kỹ lưỡng |

---

## 8. Quyết Định Cần Xác Nhận Từ Người Dùng

> ⏸️ **CHỜ DUYỆT**: Trước khi thực thi, cần xác nhận:

1. **Có nên thêm `shape` và `font` variants mới vào Badge không?**
   - Ưu điểm: Flexibility cao hơn, giảm className overrides
   - Nhược điểm: Tăng API surface của component

2. **Mức độ ưu tiên**: Thực hiện FULL (tất cả tasks) hay PARTIAL (chỉ critical issues A1, A2)?

3. **Có muốn migrate `ChannelStatusBadge` thành preset không?**
   - Component này có icon và logic đặc thù

---

**📌 TRẠNG THÁI**: Đang chờ phê duyệt kế hoạch trước khi bắt đầu Giai đoạn 2 (SPLIT).
