# Kế Hoạch Kiểm Toán Badge/Tag Components

> **Ngày tạo:** 2025-12-15
> **Trạng thái:** 🟡 CHỜ PHÊ DUYỆT
> **Vai trò:** UI Consistency Auditor & Design System Specialist

---

## 1. VẤN ĐỀ (Problem Statement)

### 1.1. Phạm Vi Đánh Giá

Hệ thống **Synapse** hiện có nhiều component Badge/Tag được sử dụng xuyên suốt toàn bộ frontend với mục đích hiển thị trạng thái, nhãn, tag, và các thông tin phân loại.

**Design System Component Chuẩn:**

- `badge.tsx` tại `@/shared/ui/badge`
- Hỗ trợ **15 variants** (core + semantic + role + tier + status + visual effects)
- Hỗ trợ **4 sizes** (xs, sm, md, lg)
- Hỗ trợ **24 presets** cho các use cases phổ biến
- Hỗ trợ indicator dot với pulse animation

### 1.2. Thống Kê Sử Dụng

| Module               | File Count   | Badge Usages   |
| -------------------- | ------------ | -------------- |
| `appointments`       | 7 files      | ~18 usages     |
| `staff`              | 2 files      | ~6 usages      |
| `customers`          | 4 files      | ~7 usages      |
| `customer-dashboard` | 4 files      | ~6 usages      |
| `resources`          | 3 files      | ~6 usages      |
| `services`           | 2 files      | ~4 usages      |
| `billing`            | 3 files      | ~4 usages      |
| `settings`           | 4 files      | ~5 usages      |
| `landing-page`       | 4 files      | ~5 usages      |
| `chat`               | 1 file       | ~1 usage       |
| `notifications`      | 1 file       | ~1 usage       |
| `booking-wizard`     | 1 file       | ~1 usage       |
| `shared/ui/custom`   | 1 file       | ~2 usages      |
| **TỔNG CỘNG**        | **37 files** | **~66 usages** |

---

## 2. MỤC ĐÍCH (Objectives)

### 2.1. Mục Tiêu Chính

| Mục tiêu      | Mô tả                           | Deliverable                           |
| ------------- | ------------------------------- | ------------------------------------- |
| **Inventory** | Liệt kê toàn bộ Badge/Tag usage | Ma trận so sánh chi tiết              |
| **Compare**   | So sánh với design system chuẩn | Bảng phân tích sai lệch               |
| **Classify**  | Phân loại các inconsistencies   | Severity levels (Critical/Medium/Low) |
| **Document**  | Ghi nhận findings               | Analysis log                          |

### 2.2. Không Bao Gồm (Out of Scope)

- ❌ Thay đổi logic nghiệp vụ
- ❌ Refactor code
- ❌ Sửa lỗi
- ❌ Đề xuất giải pháp

---

## 3. PHÂN TÍCH SƠ BỘ (Initial Analysis)

### 3.1. ✅ Điểm Mạnh - Tuân Thủ Design System

| Pattern                | Files    | Đánh giá              |
| ---------------------- | -------- | --------------------- |
| Sử dụng preset         | 12 files | ⭐⭐⭐⭐⭐ Đúng chuẩn |
| Sử dụng variant + size | 15 files | ⭐⭐⭐⭐ Tốt          |
| Sử dụng withIndicator  | 3 files  | ⭐⭐⭐⭐⭐ Đúng chuẩn |

### 3.2. ⚠️ Vấn Đề Phát Hiện

#### **Mức Độ: CAO (Critical)**

| ID    | Vấn đề                                  | Files                                                                | Mô tả                                                                                                         |
| ----- | --------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| B-001 | **Custom className override colors**    | `event-card.tsx`, `appointment-sheet.tsx`                            | Sử dụng `className={cn(statusConfig.bgColor, statusConfig.color)}` thay vì preset, ghi đè styling của variant |
| B-002 | **Hardcoded color maps thay vì preset** | `customer-history.tsx`, `appointment-list.tsx`, `treatment-list.tsx` | Tự định nghĩa `STATUS_Map` với variant mappings thay vì dùng badge presets                                    |
| B-003 | **Duplicate status mappings**           | `appointment-list.tsx`                                               | Có cả lowercase và UPPERCASE keys trong statusMap                                                             |

#### **Mức Độ: TRUNG BÌNH (Medium)**

| ID    | Vấn đề                             | Files                                                | Mô tả                                                                             |
| ----- | ---------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| B-004 | **Missing size prop**              | `service-table.tsx` (skills), `customer-history.tsx` | Một số Badge không có size prop, dựa vào default                                  |
| B-005 | **Inline styling thay vì variant** | `service-card.tsx`                                   | `className="shadow-sm backdrop-blur-md border animate-pulse"` với warning variant |
| B-006 | **className ghi đè border**        | `tag-input.tsx`                                      | `className="gap-1 pr-1 border-dashed"`                                            |
| B-007 | **Inconsistent filter badge**      | `appointments-filter.tsx`                            | Badge làm counter với custom positioning `absolute -top-1 -right-1`               |

#### **Mức Độ: THẤP (Low)**

| ID    | Vấn đề                                     | Files                      | Mô tả                                                               |
| ----- | ------------------------------------------ | -------------------------- | ------------------------------------------------------------------- |
| B-008 | **Không sử dụng semantic presets có sẵn**  | `invoice-status-badge.tsx` | Dùng constants INVOICE_STATUS_COLORS thay vì presets invoice-\*     |
| B-009 | **Resource status không dùng preset**      | `resource-table.tsx`       | Có preset resource-available, resource-maintenance nhưng không dùng |
| B-010 | **Treatment status variant thiếu options** | `treatment-list.tsx`       | statusMap chỉ có 3 variants (default, secondary, destructive)       |

### 3.3. 📊 Ma Trận Sử Dụng Chi Tiết

#### Theo Pattern Sử Dụng

| Pattern                                    | Count | Files       | Compliance    |
| ------------------------------------------ | ----- | ----------- | ------------- |
| `preset="..."`                             | 17    | Nhiều files | ✅ Đúng chuẩn |
| `variant="..." size="..."`                 | 28    | Nhiều files | ✅ Đúng chuẩn |
| `variant={STATUS_MAP[key]}`                | 8     | 6 files     | ⚠️ Cần review |
| `variant="..." className={...}` (override) | 6     | 4 files     | ❌ Sai lệch   |
| `preset="..." (với icon)`                  | 5     | 3 files     | ✅ Đúng chuẩn |

#### Theo Semantic Use Cases

| Use Case               | Pattern Đúng             | Pattern Sai               | Files Sai                             |
| ---------------------- | ------------------------ | ------------------------- | ------------------------------------- |
| **Appointment Status** | `preset="appointment-*"` | Custom className colors   | event-card.tsx, appointment-sheet.tsx |
| **Invoice Status**     | `preset="invoice-*"`     | variant={COLORS[status]}  | invoice-status-badge.tsx              |
| **Resource Status**    | `preset="resource-*"`    | variant={status.variant}  | resource-table.tsx                    |
| **Role Badge**         | `preset="role-*"`        | ROLE_CONFIG[role].variant | staff-table.tsx                       |
| **Tier Badge**         | `preset="tier-*"`        | ✅ Đúng                   | customer-table.tsx                    |
| **Channel Status**     | `preset="channel-*"`     | ✅ Đúng                   | channel-status-badge.tsx              |
| **Generic Tag**        | `preset="tag"`           | ✅ Đúng                   | filter-bar.tsx, resource-table.tsx    |
| **Counter**            | `preset="count"`         | ✅ Đúng                   | notification-list.tsx, filter-bar.tsx |

---

## 4. DANH MỤC CHI TIẾT CÁC SAI LỆCH

### 4.1. B-001: Custom className Override Colors

**Files:**

- `features/appointments/components/event/event-card.tsx` (line 166-169)
- `features/appointments/components/sheet/appointment-sheet.tsx` (line 171-175)

**Hiện tại:**

```tsx
<Badge
  variant="secondary"
  className={cn(statusConfig.bgColor, statusConfig.color)}
>
```

**Vấn đề:**

- Dùng `variant="secondary"` rồi ghi đè bằng className
- `statusConfig.bgColor` và `statusConfig.color` là Tailwind classes (vd: `bg-amber-50`, `text-amber-600`)
- Không tận dụng Badge presets `appointment-*` đã có sẵn

**Chuẩn (Design System):**

```tsx
<Badge preset={`appointment-${status.toLowerCase()}`}>
```

---

### 4.2. B-002: Hardcoded Status Maps

**Files:**

- `features/customers/components/customer-history.tsx` (line 77-81)
- `features/customer-dashboard/components/appointment-list.tsx` (line 17-27)
- `features/customer-dashboard/components/treatment-list.tsx` (line 15-19)

**Hiện tại:**

```tsx
const STATUS_Map: Record<string, "success" | "destructive" | "warning"> = {
  COMPLETED: "success",
  CANCELLED: "destructive",
  PENDING: "warning",
}
// ...
<Badge variant={STATUS_Map[item.status]}>
```

**Vấn đề:**

- Duplicate định nghĩa variant mapping
- Không nhất quán giữa các files
- Không có label - phải hardcode text content

---

### 4.3. B-003: Duplicate Status Keys

**File:** `features/customer-dashboard/components/appointment-list.tsx`

**Hiện tại:**

```tsx
const statusMap = {
  pending: { label: "Đang chờ", variant: "warning" },
  PENDING: { label: "Đang chờ", variant: "warning" },
  // ... duplicate entries for both cases
};
```

**Vấn đề:**

- Cùng một status có 2 keys (lowercase + UPPERCASE)
- Maintenance overhead khi cần update

---

### 4.4. B-005: Inline Styling Override

**File:** `features/landing-page/components/service-card.tsx` (line 44-50)

**Hiện tại:**

```tsx
<Badge
  variant="warning"
  className="shadow-sm backdrop-blur-md border animate-pulse"
>
  Phổ biến
</Badge>
```

**Vấn đề:**

- Thêm shadow, backdrop-blur, animate-pulse không thuộc design system
- Có thể cân nhắc tạo variant mới nếu pattern này lặp lại

---

### 4.5. B-008: Không Sử Dụng Invoice Presets

**File:** `features/billing/components/invoice-status-badge.tsx`

**Hiện tại:**

```tsx
// constants.ts
export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, BadgeVariant> = {
  UNPAID: "warning",
  PAID: "success",
  REFUNDED: "destructive",
};

// component
<Badge variant={INVOICE_STATUS_COLORS[status]}>
  {INVOICE_STATUS_LABELS[status]}
</Badge>;
```

**Chuẩn (Design System):**

```tsx
// badge.tsx đã có:
"invoice-unpaid": { variant: "warning", label: "Chưa thanh toán" },
"invoice-paid": { variant: "success", label: "Đã thanh toán" },
"invoice-refunded": { variant: "destructive", label: "Đã hoàn tiền" },

// Component chỉ cần:
<Badge preset={`invoice-${status.toLowerCase()}`} />
```

---

## 5. RÀNG BUỘC (Constraints)

1. **Chỉ ghi nhận, không sửa code** trong bước này
2. **Không đề xuất refactor** - đây là task audit
3. **Dựa trên design system `badge.tsx`** làm source of truth
4. **Đánh giá objective** - không cần prioritize fixes

---

## 6. KẾ HOẠCH HÀNH ĐỘNG (Action Plan)

| Phase      | Mô tả                  | Output                               |
| ---------- | ---------------------- | ------------------------------------ |
| ✅ THINK   | Tạo kế hoạch này       | `implementation_plan_badge_audit.md` |
| ⏳ SPLIT   | Phân chia tasks        | Todo list                            |
| ⏳ ANALYZE | Rà soát toàn bộ usages | `analysis_log.md`                    |
| ⏳ REPORT  | Tổng hợp findings      | `dashboard.md` update                |

---

## 7. TÓM TẮT FINDINGS

| Metric                      | Số lượng  |
| --------------------------- | --------- |
| Tổng số Badge usages        | ~66       |
| Tuân thủ design system      | ~50 (76%) |
| Cần review (Medium)         | ~10 (15%) |
| Sai lệch rõ ràng (Critical) | ~6 (9%)   |

### Phân Loại Sai Lệch:

| Loại                                 | Count | Mức độ      |
| ------------------------------------ | ----- | ----------- |
| Override className với custom colors | 6     | 🔴 Critical |
| Không dùng preset có sẵn             | 4     | 🟡 Medium   |
| Duplicate status mappings            | 3     | 🟡 Medium   |
| Inline styling không chuẩn           | 2     | 🟢 Low      |

---

**⏸️ DỪNG TẠI ĐÂY - CHỜ PHÊ DUYỆT TRƯỚC KHI TIẾP TỤC**

Xin hãy xác nhận:

1. Kế hoạch này có đúng với yêu cầu không?
2. Có cần điều chỉnh phạm vi không?
3. Có muốn tôi tiếp tục ghi chi tiết vào `analysis_log.md` không?
