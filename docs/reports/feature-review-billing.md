# BÁO CÁO ĐÁNH GIÁ CHẤT LƯỢNG TÍNH NĂNG

## Thông tin chung
- **Module:** `frontend/src/features/billing`
- **Ngày đánh giá:** 2025-12-13
- **Người đánh giá:** AI Review Agent
- **Phạm vi:** Quản lý hóa đơn và thanh toán (Invoices & Payments)

---

## MỤC LỤC

1. [Tổng quan Module](#1-tổng-quan-module)
2. [Phân tích Kiến trúc (Architecture)](#2-phân-tích-kiến-trúc-architecture)
3. [Vấn đề về Code Quality](#3-vấn-đề-về-code-quality)
4. [Vấn đề về UX/Accessibility](#4-vấn-đề-về-uxaccessibility)
5. [Vấn đề về Performance](#5-vấn-đề-về-performance)
6. [Vấn đề về Business Logic](#6-vấn-đề-về-business-logic)
7. [Tổng hợp và Khuyến nghị](#7-tổng-hợp-và-khuyến-nghị)

---

## 1. Tổng quan Module

### Cấu trúc file
```
billing/
├── components/
│   ├── billing-page.tsx          (152 dòng - 6.1KB)
│   ├── invoice-table.tsx         (101 dòng - 2.5KB)
│   ├── invoice-status-badge.tsx  (16 dòng - 422B)
│   └── sheet/
│       ├── invoice-sheet.tsx     (52 dòng - 1.4KB)
│       ├── invoice-details.tsx   (131 dòng - 5.0KB)
│       └── payment-form.tsx      (165 dòng - 4.9KB)
├── actions.ts                     (159 dòng - 5.8KB)
├── types.ts                       (79 dòng - 1.6KB)
├── schemas.ts                     (14 dòng - 411B)
├── constants.ts                   (26 dòng - 825B)
└── mock-data.ts                   (132 dòng - 3.0KB)
```

### Chức năng
- **BillingPage**: Dashboard hiển thị metrics và danh sách hóa đơn.
- **InvoiceTable**: Bảng danh sách hóa đơn với filter.
- **InvoiceSheet**: Side panel chi tiết hóa đơn + form thanh toán.
- **actions.ts**: Server Actions xử lý CRUD hóa đơn và thanh toán.
- **Mock data**: Giả lập 3 hóa đơn mẫu với nhiều trạng thái.

---

## 2. Phân tích Kiến trúc (Architecture)

### ✅ Điểm mạnh
| Tiêu chí | Đánh giá |
|----------|----------|
| Feature-Sliced Design | Tuân thủ tốt - tách biệt components, actions, types |
| Type Safety | Types đầy đủ cho Invoice, Payment, Filters |
| Separation of Concerns | UI components tách biệt khỏi business logic |
| Constants Management | Centralized labels và colors |

### ⚠️ Điểm cần cải thiện

| ID | Vị trí | Mô tả | Mức độ |
|----|--------|-------|--------|
| ARCH-01 | `actions.ts:3` | **Cross-module dependency** | Import `MOCK_APPOINTMENTS`, `MOCK_CUSTOMERS`, `MOCK_SERVICES` từ module khác (`appointments`). Vi phạm module independence. | **Trung bình** |
| ARCH-02 | `actions.ts:66` | **Direct mutation of mock data** | `MOCK_INVOICES.unshift(newInvoice)` mutate global array. Trong production sẽ gây race condition. | **Nhẹ** |
| ARCH-03 | `types.ts:53-63` | **Unused type** | `CreateInvoicePayload` được định nghĩa nhưng không được sử dụng trong `actions.ts`. Action `createInvoice` chỉ nhận `bookingId`. | **Nhẹ** |

---

## 3. Vấn đề về Code Quality

### 🔴 Mức độ Nghiêm trọng

| ID | File:Line | Vấn đề | Chi tiết |
|----|-----------|--------|----------|
| CQ-01 | `actions.ts:136` | **Console.log in production code** | `console.log(\`[Loyalty] Customer...\`)` sẽ xuất hiện trong production. Nên dùng proper logging service hoặc loại bỏ. |

**Trích dẫn code (CQ-01):**
```tsx
// actions.ts:136
console.log(`[Loyalty] Customer ${invoice.customerId} earned ${pointsEarned} points`);
// ← Nên thay bằng logger.info() hoặc remove
```

### 🟠 Mức độ Trung bình

| ID | File:Line | Vấn đề | Chi tiết |
|----|-----------|--------|----------|
| CQ-02 | `payment-form.tsx:43-44` | **ESLint disable with any type** | Sử dụng `as any` để bypass type error của `zodResolver`. Đây là workaround không an toàn. |
| CQ-03 | `billing-page.tsx:44-63` | **Duplicated data fetching logic** | Logic fetch invoices và metrics bị duplicate trong `loadData()` và `handleUpdate()`. |
| CQ-04 | `actions.ts:70-72` | **Generic error handling** | Catch block chỉ return generic message "Lỗi khi tạo hóa đơn" mà không log error gốc. Khó debug. |

**Trích dẫn code (CQ-02):**
```tsx
// payment-form.tsx:43-44
resolver: zodResolver(createPaymentSchema) as any,
// ← Workaround không an toàn, cần fix type definition
```

**Trích dẫn code (CQ-03):**
```tsx
// billing-page.tsx:44-63 - Duplicated logic
const handleUpdate = () => {
  loadData();  // ← Call loadData first
  if (selectedInvoice) {
    startTransition(async () => {
      const res = await getInvoices();  // ← Then fetch again inside
      // ...
    })
  }
};
```

### 🟢 Mức độ Nhẹ

| ID | File:Line | Vấn đề | Chi tiết |
|----|-----------|--------|----------|
| CQ-05 | `billing-page.tsx:46-52` | **Verbose comment** | Comment dài giải thích logic update selectedInvoice. Nên refactor thành function có tên rõ ràng. |
| CQ-06 | `invoice-details.tsx:54` | **Fallback logic** | `item.serviceName || item.productName` - nên có type guard hoặc ensure data consistency. |
| CQ-07 | `mock-data.ts:42` | **Inconsistent naming** | `serviceName: "Sáp vuốt tóc"` cho PRODUCT type. Nên dùng `productName` thay vì `serviceName`. |

---

## 4. Vấn đề về UX/Accessibility

### 🟠 Mức độ Trung bình

| ID | File:Line | Vấn đề | Chi tiết |
|----|-----------|--------|----------|
| UX-01 | `billing-page.tsx:138` | **Loading state inconsistency** | `isLoading={isPending && invoices.length === 0}` - chỉ show loading khi list rỗng. Khi refresh data, user không thấy indicator. |
| UX-02 | `invoice-table.tsx:56` | **Hardcoded color classes** | `text-warning` và `text-success` - nên dùng design tokens hoặc CSS variables. |
| UX-03 | `payment-form.tsx:97` | **No input formatting** | Input số tiền không có format (VD: 1,000,000). User phải nhập số thuần. |
| UX-04 | `billing-page.tsx:97,113,125` | **Hardcoded colors** | `text-orange-600`, `text-green-600` - vi phạm design system. |

**Trích dẫn code (UX-01):**
```tsx
// billing-page.tsx:138
isLoading={isPending && invoices.length === 0}
// ← Khi refresh, isPending=true nhưng invoices.length > 0 → không show loading
```

### 🟢 Mức độ Nhẹ

| ID | File:Line | Vấn đề | Chi tiết |
|----|-----------|--------|----------|
| UX-05 | `invoice-sheet.tsx:31` | **Fixed width** | `w-[400px] sm:w-[540px]` - có thể quá hẹp cho nội dung dài. |
| UX-06 | `payment-form.tsx:77-82` | **Success message placement** | Message "Hóa đơn đã được thanh toán đầy đủ" nằm ở vị trí form. Nên hiển thị ở header hoặc prominent location. |

---

## 5. Vấn đề về Performance

### 🟢 Mức độ Nhẹ

| ID | File:Line | Vấn đề | Chi tiết |
|----|-----------|--------|----------|
| PERF-01 | `billing-page.tsx:21-24` | **Parallel fetching** | Sử dụng `Promise.all` để fetch song song - đây là best practice. ✅ |
| PERF-02 | `invoice-details.tsx:15-18` | **Function recreation** | `formatCurrency` được tạo mới mỗi lần render. Nên move ra ngoài component hoặc useMemo. |

---

## 6. Vấn đề về Business Logic

### 🔴 Mức độ Nghiêm trọng

| ID | File:Line | Vấn đề | Chi tiết |
|----|-----------|--------|----------|
| BIZ-01 | `actions.ts:38-44` | **Hardcoded discount logic** | Discount rates (5%, 10%) được hardcode. Nên lưu trong config hoặc database. |
| BIZ-02 | `actions.ts:135-136` | **Loyalty points calculation** | Logic tính điểm (`finalAmount / 10000`) không có validation hoặc rounding policy rõ ràng. |

**Trích dẫn code (BIZ-01):**
```tsx
// actions.ts:38-44
if (customer.membershipLevel === 'gold') {
  discountAmount = amount * 0.05;  // ← Hardcoded 5%
  discountReason = "Gold Member (5%)";
} else if (customer.membershipLevel === 'platinum') {
  discountAmount = amount * 0.10;  // ← Hardcoded 10%
  discountReason = "Platinum Member (10%)";
}
// Nên: const DISCOUNT_RATES = { gold: 0.05, platinum: 0.10 }
```

### 🟠 Mức độ Trung bình

| ID | File:Line | Vấn đề | Chi tiết |
|----|-----------|--------|----------|
| BIZ-03 | `actions.ts:114` | **Overpayment validation** | Chỉ check `amount > remaining` nhưng không handle edge case (VD: floating point precision). |
| BIZ-04 | `actions.ts:16` | **Status validation** | Chỉ check `status !== "completed"` nhưng không xử lý các status khác như "cancelled". |
| BIZ-05 | `payment-form.tsx:54-59` | **Client-side validation duplication** | Validation `amount > remainingAmount` đã có ở server (actions.ts:114) nhưng lại duplicate ở client. |

---

## 7. Tổng hợp và Khuyến nghị

### Bảng tổng hợp theo mức độ

| Mức độ | Số lượng | IDs |
|--------|----------|-----|
| 🔴 Nghiêm trọng | 3 | CQ-01, BIZ-01, BIZ-02 |
| 🟠 Trung bình | 10 | ARCH-01, CQ-02, CQ-03, CQ-04, UX-01, UX-02, UX-03, UX-04, BIZ-03, BIZ-04, BIZ-05 |
| 🟢 Nhẹ | 8 | ARCH-02, ARCH-03, CQ-05, CQ-06, CQ-07, UX-05, UX-06, PERF-02 |

### Khuyến nghị ưu tiên

#### 1. 🔴 Ngay lập tức: Remove console.log
```diff
// actions.ts:136
- console.log(`[Loyalty] Customer ${invoice.customerId} earned ${pointsEarned} points`);
+ // TODO: Integrate with loyalty service
```

#### 2. 🔴 Ngay lập tức: Extract discount config
```tsx
// constants.ts
export const MEMBERSHIP_DISCOUNTS = {
  gold: { rate: 0.05, label: "Gold Member (5%)" },
  platinum: { rate: 0.10, label: "Platinum Member (10%)" },
} as const;

// actions.ts
const discount = MEMBERSHIP_DISCOUNTS[customer.membershipLevel];
if (discount) {
  discountAmount = amount * discount.rate;
  discountReason = discount.label;
}
```

#### 3. 🟠 Sớm: Fix type safety in payment-form
```tsx
// payment-form.tsx - Remove 'as any'
import type { Resolver } from "react-hook-form";
resolver: zodResolver(createPaymentSchema) as Resolver<CreatePaymentFormValues>
```

#### 4. 🟠 Sớm: Refactor duplicated fetch logic
```tsx
// billing-page.tsx
const refreshData = useCallback(async () => {
  startTransition(async () => {
    const [invRes, metricRes] = await Promise.all([
      getInvoices(),
      getBillingMetrics(),
    ]);
    if (invRes.status === "success") setInvoices(invRes.data);
    if (metricRes.status === "success") setMetrics(metricRes.data);

    // Update selected invoice if exists
    if (selectedInvoice && invRes.data) {
      const updated = invRes.data.find(i => i.id === selectedInvoice.id);
      if (updated) setSelectedInvoice(updated);
    }
  });
}, [selectedInvoice]);
```

#### 5. 🟠 Sớm: Replace hardcoded colors
```diff
// invoice-table.tsx:56
- className={item.paidAmount < item.finalAmount ? "text-warning" : "text-success"}
+ className={item.paidAmount < item.finalAmount ? "text-[var(--status-warning-foreground)]" : "text-[var(--status-success-foreground)]"}
```

#### 6. 🟢 Khi rảnh: Add currency input formatting
Sử dụng thư viện như `react-number-format` hoặc custom Input component với format VND.

---

### Điểm chất lượng tổng thể

| Tiêu chí | Điểm (1-10) |
|----------|-------------|
| Kiến trúc | 7/10 |
| Code Quality | 6/10 |
| UX/Accessibility | 7/10 |
| Performance | 8/10 |
| Business Logic | 6/10 |
| **Trung bình** | **6.8/10** |

---

*Báo cáo được tạo tự động. Vui lòng review và xác nhận trước khi thực hiện các thay đổi.*
