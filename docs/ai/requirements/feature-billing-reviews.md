---
phase: requirements
title: Tạo Mới Module Billing & Reviews
description: Yêu cầu chi tiết cho việc xây dựng các module hoàn toàn mới theo thiết kế database
version: 1.0
created_at: 2025-12-12
status: APPROVED
priority: P0-CRITICAL
estimated_effort: 6 days
---

# 📋 Yêu Cầu: Tạo Mới Module Billing & Reviews

## 1. Tuyên Bố Vấn Đề

### 1.1. Bối cảnh
Theo thiết kế database (`database_design.md`), hệ thống cần có các module:
- **Billing**: Quản lý hóa đơn và thanh toán
- **Reviews**: Đánh giá dịch vụ sau khi hoàn thành

Tuy nhiên, Frontend hiện tại **hoàn toàn thiếu** cả hai module này.

### 1.2. Gap Analysis

| Entity trong Database | Frontend Module | Trạng thái |
|:---|:---|:---:|
| `invoices` | ❌ Không có | **CRITICAL GAP** |
| `payments` | ❌ Không có | **CRITICAL GAP** |
| `reviews` | ❌ Không có | **GAP** |

---

## 2. Mục Tiêu

### 2.1. Mục Tiêu Chính
- ✅ Tạo module `features/billing` hoàn chỉnh
- ✅ Tạo module `features/reviews` hoàn chỉnh
- ✅ Integration với Appointments (trigger sau completed)

### 2.2. Phi Mục Tiêu
- ❌ Payment Gateway integration (VNPay, Momo) - Phase sau
- ❌ Invoice PDF export - Phase sau
- ❌ Review analytics/aggregation - Phase sau

---

## PART A: MODULE BILLING

### A.1. User Stories

#### US-B1: Tạo Hóa Đơn từ Booking
**Như một** Lễ tân
**Tôi muốn** tạo hóa đơn từ booking đã hoàn thành
**Để** khách hàng có thể thanh toán

**Acceptance Criteria:**
- [ ] AC-B1.1: Button "Tạo hóa đơn" xuất hiện khi booking status = "completed"
- [ ] AC-B1.2: Invoice được tạo với: booking_id, amount (sum of services), issued_at
- [ ] AC-B1.3: Invoice status mặc định = "UNPAID"
- [ ] AC-B1.4: Toast thông báo thành công

#### US-B2: Xem Danh Sách Hóa Đơn
**Như một** Admin/Lễ tân
**Tôi muốn** xem danh sách tất cả hóa đơn
**Để** theo dõi tình trạng thanh toán

**Acceptance Criteria:**
- [ ] AC-B2.1: Table hiển thị: ID, Khách hàng, Số tiền, Trạng thái, Ngày tạo
- [ ] AC-B2.2: Filter theo status (UNPAID, PAID, REFUNDED)
- [ ] AC-B2.3: Search theo tên khách hàng hoặc mã hóa đơn
- [ ] AC-B2.4: Pagination
- [ ] AC-B2.5: Click row → xem chi tiết

#### US-B3: Xử Lý Thanh Toán
**Như một** Lễ tân
**Tôi muốn** ghi nhận thanh toán cho hóa đơn
**Để** hoàn tất giao dịch

**Acceptance Criteria:**
- [ ] AC-B3.1: Form chọn phương thức (CASH, CARD, TRANSFER)
- [ ] AC-B3.2: Input số tiền (có thể thanh toán một phần)
- [ ] AC-B3.3: Input mã giao dịch (cho CARD/TRANSFER)
- [ ] AC-B3.4: Khi thanh toán đủ → invoice status = "PAID"
- [ ] AC-B3.5: Lưu payment record với timestamp

#### US-B4: Xem Chi Tiết Hóa Đơn
**Như một** Lễ tân hoặc Khách hàng
**Tôi muốn** xem chi tiết hóa đơn
**Để** kiểm tra thông tin trước khi thanh toán

**Acceptance Criteria:**
- [ ] AC-B4.1: Hiển thị thông tin khách hàng
- [ ] AC-B4.2: Hiển thị danh sách dịch vụ với giá
- [ ] AC-B4.3: Hiển thị tổng tiền
- [ ] AC-B4.4: Hiển thị lịch sử thanh toán (nếu có)
- [ ] AC-B4.5: Preview có thể in

---

### A.2. Data Models (theo database_design.md)

```typescript
// types.ts
export type InvoiceStatus = 'UNPAID' | 'PAID' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER';

export interface Invoice {
  id: string;
  booking_id: string;
  amount: number;
  status: InvoiceStatus;
  issued_at: string;

  // Joined data
  booking?: Booking;
  customer?: Customer;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  method: PaymentMethod;
  transaction_ref?: string;
  gateway_info?: Record<string, unknown>;
  transaction_time: string;
}

export interface InvoiceCreateInput {
  booking_id: string;
}

export interface PaymentCreateInput {
  invoice_id: string;
  amount: number;
  method: PaymentMethod;
  transaction_ref?: string;
}
```

---

### A.3. Component Structure

```
features/billing/
├── index.ts
├── types.ts
├── schemas.ts
├── actions.ts
├── constants.ts
└── components/
    ├── billing-page.tsx           # Main page với table + actions
    ├── invoice-table.tsx          # DataTable cho invoices
    ├── invoice-sheet.tsx          # Detail view
    ├── invoice-generator.tsx      # Create invoice from booking
    ├── payment-form.tsx           # Payment processing form
    ├── payment-history.tsx        # List of payments for invoice
    └── invoice-status-badge.tsx   # Status indicator
```

---

### A.4. Actions

```typescript
// actions.ts
export async function getInvoices(filters?: InvoiceFilters): Promise<ActionResponse<PaginatedResponse<Invoice>>>;
export async function getInvoice(id: string): Promise<ActionResponse<Invoice>>;
export async function createInvoice(bookingId: string): Promise<ActionResponse<Invoice>>;
export async function processPayment(input: PaymentCreateInput): Promise<ActionResponse<Payment>>;
export async function refundInvoice(id: string, reason: string): Promise<ActionResponse<Invoice>>;
```

---

## PART B: MODULE REVIEWS

### B.1. User Stories

#### US-R1: Đánh Giá Dịch Vụ
**Như một** Khách hàng
**Tôi muốn** đánh giá dịch vụ sau khi hoàn thành
**Để** chia sẻ trải nghiệm và giúp Spa cải thiện

**Acceptance Criteria:**
- [ ] AC-R1.1: Prompt đánh giá xuất hiện sau **booking completed VÀ invoice PAID**
- [ ] AC-R1.2: Form có star rating (1-5)
- [ ] AC-R1.3: Form có text comment (optional)
- [ ] AC-R1.4: Một booking chỉ được đánh giá một lần (unique constraint)
- [ ] AC-R1.5: Toast thông báo thành công
- [ ] AC-R1.6: **Không hiển thị prompt nếu chưa thanh toán**

#### US-R2: Xem Đánh Giá Của Tôi
**Như một** Khách hàng
**Tôi muốn** xem lịch sử đánh giá của mình
**Để** theo dõi feedback đã gửi

**Acceptance Criteria:**
- [ ] AC-R2.1: List đánh giá trong customer dashboard
- [ ] AC-R2.2: Hiển thị: Dịch vụ, Ngày, Rating, Comment
- [ ] AC-R2.3: Có thể edit comment (không edit rating)

#### US-R3: Xem Đánh Giá Dịch Vụ (Admin)
**Như một** Admin
**Tôi muốn** xem tất cả đánh giá
**Để** monitor chất lượng dịch vụ

**Acceptance Criteria:**
- [ ] AC-R3.1: Table đánh giá với filter
- [ ] AC-R3.2: Filter theo rating (1-5)
- [ ] AC-R3.3: Filter theo dịch vụ
- [ ] AC-R3.4: Sort theo ngày (mới nhất/cũ nhất)

---

### B.2. Data Models

```typescript
// types.ts
export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  created_at: string;

  // Joined data
  booking?: Booking;
  customer?: Customer;
}

export interface ReviewCreateInput {
  booking_id: string;
  rating: number;
  comment?: string;
}

export interface ReviewUpdateInput {
  comment?: string;
}
```

---

### B.3. Component Structure

```
features/reviews/
├── index.ts
├── types.ts
├── schemas.ts
├── actions.ts
└── components/
    ├── review-form.tsx            # Star rating + comment form
    ├── review-card.tsx            # Single review display
    ├── review-list.tsx            # List of reviews
    ├── star-rating.tsx            # Reusable star component
    ├── review-prompt.tsx          # Prompt after booking complete
    └── reviews-admin-page.tsx     # Admin view all reviews
```

---

### B.4. Actions

```typescript
// actions.ts
export async function createReview(input: ReviewCreateInput): Promise<ActionResponse<Review>>;
export async function getReviews(filters?: ReviewFilters): Promise<ActionResponse<PaginatedResponse<Review>>>;
export async function getBookingReview(bookingId: string): Promise<ActionResponse<Review | null>>;
export async function updateReview(id: string, input: ReviewUpdateInput): Promise<ActionResponse<Review>>;
export async function getMyReviews(): Promise<ActionResponse<Review[]>>;
```

---

## 3. Integration Points

### 3.1. Billing ↔ Appointments
```
Booking "completed" → Show "Tạo hóa đơn" button
Invoice "PAID" → Trigger loyalty points update
```

### 3.2. Reviews ↔ Appointments
```
Booking "completed" AND Invoice "PAID" → Show review prompt
OR: Booking "completed" after 24h → Send review reminder
```

### 3.3. Reviews ↔ Customer Dashboard
```
Customer dashboard → "Lịch sử đánh giá" section
Booking history → "Đánh giá" badge if not reviewed
```

---

## 4. Tiêu Chí Thành Công

| Metric | Target | Cách đo |
|:---|:---|:---|
| Billing CRUD | All operations work | Manual testing |
| Payment Processing | Correct status changes | Unit tests |
| Review Creation | Works after booking | E2E test |
| Star Rating UX | Intuitive | User feedback |

---

## 5. UI/UX Requirements

### 5.1. Invoice Preview
- Clean, printable layout
- Company logo & info
- Customer info
- Service breakdown with prices
- Total amount
- Payment status

### 5.2. Star Rating Component
- 5 stars, clickable
- Hover preview
- Animated fill
- Accessible (keyboard navigation)
- Show numeric value

### 5.3. Review Prompt
- Non-intrusive modal/sheet
- "Nhắc tôi sau" option
- "Không đánh giá" option
- Quick 1-tap rating

---

## 6. Dependencies

- `@/features/appointments` - Booking data
- `@/features/customers` - Customer data
- `@/shared/ui` - Dialog, Sheet, Table, Form components

---

## 7. Risks

| Risk | Likelihood | Impact | Mitigation |
|:---|:---:|:---:|:---|
| Orphan invoices (booking deleted) | Low | Medium | Soft delete, cascade |
| Duplicate reviews | Medium | Low | Unique constraint |
| Payment race conditions | Low | High | Transaction handling |

---

## 8. Ràng Buộc Nghiệp Vụ (Business Constraints)

### 8.1. Discount Policy
- **GOLD member**: Giảm 5% tổng hóa đơn
- **PLATINUM member**: Giảm 10% tổng hóa đơn
- **Quy tắc**: Không cộng dồn nhiều loại giảm giá
- **Invoice amount** = sum(services.price) - discount_amount

### 8.2. Treatment Package Usage
- Khi booking_item có `treatment_id` → `original_price = 0`
- Tự động tăng `customer_treatments.used_sessions += 1`
- Warning nếu gói sắp hết (còn 1 buổi)
- Block booking nếu gói đã expired hoặc used_sessions >= total_sessions

### 8.3. Payment Policy
- Chấp nhận: Tiền mặt (CASH), Thẻ (CARD), Chuyển khoản (TRANSFER)
- Partial payment được phép: `remaining_amount = invoice.amount - sum(payments.amount)`
- Invoice status chỉ = "PAID" khi `remaining_amount = 0`
- Refund chỉ Admin mới có quyền thực hiện

### 8.4. Review Policy
- Chỉ được review khi: Booking "completed" **VÀ** Invoice "PAID"
- Mỗi booking chỉ được 1 review (unique constraint)
- Không thể xóa review, chỉ có thể edit comment
- Rating (1-5) không thể thay đổi sau khi submit

### 8.5. Loyalty Points
- Công thức: `points = floor(paid_amount / 10,000)`
- Cộng điểm sau khi Invoice "PAID"
- Upgrade membership tier tự động:
  - 0-499 điểm: SILVER
  - 500-1999 điểm: GOLD
  - 2000+ điểm: PLATINUM

---

## 9. User Stories Bổ Sung

### US-B5: Sử Dụng Gói Liệu Trình
**Như một** Lễ tân
**Tôi muốn** áp dụng buổi liệu trình khi tạo hóa đơn
**Để** khách không phải trả tiền lại nếu đã mua gói

**Acceptance Criteria:**
- [ ] AC-B5.1: Hiển thị gói liệu trình còn hạn của khách (status = ACTIVE, used < total)
- [ ] AC-B5.2: Chọn treatment_id khi tạo booking_item
- [ ] AC-B5.3: Service price = 0 nếu dùng liệu trình
- [ ] AC-B5.4: Tự động tăng used_sessions + 1
- [ ] AC-B5.5: Warning nếu gói sắp hết (còn 1 buổi)
- [ ] AC-B5.6: Block nếu gói đã expired

---

### US-B6: Tích Điểm Thành Viên
**Như một** Hệ thống
**Tôi muốn** tự động tích điểm sau thanh toán
**Để** khách có động lực quay lại

**Acceptance Criteria:**
- [ ] AC-B6.1: Points = floor(paid_amount / 10,000)
- [ ] AC-B6.2: Cập nhật customer.loyalty_points sau Invoice PAID
- [ ] AC-B6.3: Check và upgrade membership_tier nếu đạt ngưỡng
- [ ] AC-B6.4: Hiển thị điểm vừa tích được trên receipt
- [ ] AC-B6.5: Toast thông báo "Bạn vừa nhận được X điểm"

---

### US-B7: Áp Dụng Giảm Giá Membership
**Như một** Hệ thống
**Tôi muốn** tự động áp dụng discount theo membership tier
**Để** khách VIP được hưởng quyền lợi

**Acceptance Criteria:**
- [ ] AC-B7.1: Đọc customer.membership_tier khi tạo invoice
- [ ] AC-B7.2: GOLD → discount 5%, PLATINUM → discount 10%
- [ ] AC-B7.3: Hiển thị dòng "Giảm giá thành viên: -X đ" trên invoice
- [ ] AC-B7.4: final_amount = subtotal - discount_amount

---

## 10. Câu Hỏi Mở (Open Questions)

| # | Câu hỏi | Trả lời | Người quyết định |
|:---|:---|:---|:---|
| Q1 | Có cho phép thanh toán trước (đặt cọc) không? | Chưa - Phase sau | Product |
| Q2 | Loyalty points có expire không? | Không expire | Product |
| Q3 | Review có moderation (kiểm duyệt) không? | Không, hiển thị ngay | Product |
| Q4 | Có gửi email invoice không? | Có, sau khi PAID | Product |
| Q5 | Refund có hoàn điểm loyalty không? | Có, trừ points tương ứng | Product |
| Q6 | Khách có thể xem invoice online không? | Có, trong Customer Dashboard | Product |

