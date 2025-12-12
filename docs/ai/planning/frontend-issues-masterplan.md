---
phase: planning
title: Master Plan - Giải quyết 32 Vấn đề Frontend
description: Kế hoạch chi tiết để khắc phục tất cả issues từ báo cáo đánh giá toàn diện Frontend
version: 1.0
created_at: 2025-12-12
status: DRAFT
---

# 🗺️ MASTER PLAN: Giải Quyết Toàn Bộ Vấn Đề Frontend Synapse

> **Tổng số vấn đề:** 32 issues (7 Critical, 10 High, 10 Medium, 5 Low)
> **Ước tính tổng thời gian:** ~25 ngày làm việc
> **Người thực hiện:** 1 Developer Full-time

---

## 📋 Tóm Tắt Các Mốc Quan Trọng

| Milestone | Mô tả | Issues | Thời gian | Trạng thái |
|:---|:---|:---:|:---:|:---:|
| **M1** | Foundation & Response Standardization | C4, M10 | 2d | [ ] Pending |
| **M2** | Fix Critical UX Bugs | C5, H3, H4, H5 | 3d | [ ] Pending |
| **M3** | Appointments Module Core | C1, C2, C3 | 8d | [ ] Pending |
| **M4** | Appointments Actions & Workflows | H1, H6, H7 | 4d | [ ] Pending |
| **M5** | Missing Modules (Billing, Reviews) | C6, C7 | 6d | [ ] Pending |
| **M6** | Medium Priority Enhancements | M1-M9, H8-H10 | 5d | [ ] Pending |
| **M7** | Low Priority Polish | L1-L5 | 2d | [ ] Pending |

---

## 🔴 PHASE 1: FOUNDATION (Milestone M1)

### Mục tiêu
Chuẩn hóa Response Type và Infrastructure trước khi sửa các vấn đề khác.

---

### Task 1.1: Chuẩn hóa ActionResponse Type (C4)

**Issue:** Response Type không nhất quán giữa các modules

**Phụ thuộc:** Không có

**Ước tính:** 4 giờ

**Chi tiết thực hiện:**

```
1. Kiểm tra `@/shared/lib/action-response.ts` đã có sẵn
2. Refactor `auth/actions.ts`:
   - loginAction → sử dụng createSuccessResponse/createErrorResponse
   - registerAction → tương tự
   - forgotPasswordAction → tương tự
   - updatePasswordAction → tương tự
3. Refactor `customers/actions.ts`:
   - Thay ActionState bằng ActionResponse<T>
   - getCustomers → ActionResponse<CustomerListResponse>
   - manageCustomer → ActionResponse<Customer>
   - deleteCustomer → ActionResponse<null>
4. Refactor `resources/actions.ts`:
   - Tương tự customers
5. Refactor `staff/actions.ts`:
   - Tương tự customers
6. Update tất cả các form sử dụng actions để handle response mới
```

**Files cần sửa:**
- [ ] `frontend/src/features/auth/actions.ts`
- [ ] `frontend/src/features/customers/actions.ts`
- [ ] `frontend/src/features/resources/actions.ts`
- [ ] `frontend/src/features/staff/actions.ts`
- [ ] `frontend/src/features/settings/operating-hours/actions.ts`
- [ ] `frontend/src/features/settings/notifications/actions.ts`
- [ ] `frontend/src/features/customer-dashboard/actions.ts`

**Acceptance Criteria:**
- [ ] Tất cả Server Actions trả về `ActionResponse<T>`
- [ ] Không còn `{ success: boolean, message: string }` riêng lẻ
- [ ] UI vẫn hoạt động bình thường sau refactor

---

### Task 1.2: Loại bỏ Deprecated Props trong DataTable (M10)

**Issue:** DataTable hỗ trợ cả Flat Props và Grouped Config, gây confusion

**Phụ thuộc:** Không có

**Ước tính:** 4 giờ

**Chi tiết thực hiện:**

```
1. Xóa tất cả deprecated props trong DataTable interface:
   - selectable → bắt buộc dùng selection object
   - isSelected, onToggleOne, onToggleAll, isAllSelected, isPartiallySelected
   - sortColumn, sortDirection, onSort
2. Update tất cả nơi sử dụng DataTable:
   - staff-table.tsx
   - customer-table.tsx (nếu có)
   - service-table.tsx (nếu có)
   - resource-table.tsx (nếu có)
3. Giữ nguyên Grouped Config: selection, sort
```

**Files cần sửa:**
- [ ] `frontend/src/shared/ui/custom/data-table.tsx`
- [ ] `frontend/src/features/staff/components/staff-list/staff-table.tsx`
- [ ] Các file table khác sử dụng DataTable

**Acceptance Criteria:**
- [ ] DataTable chỉ còn Grouped Config API
- [ ] Không có TypeScript errors
- [ ] Tất cả tables hoạt động bình thường

---

## 🔴 PHASE 2: FIX CRITICAL UX BUGS (Milestone M2)

### Mục tiêu
Sửa các lỗi UX quan trọng ảnh hưởng đến trải nghiệm người dùng.

---

### Task 2.1: Kết nối Search với URL Params (C5)

**Issue:** Ô tìm kiếm hiển thị nhưng không filter data

**Phụ thuộc:** Task 1.1

**Ước tính:** 6 giờ

**Chi tiết thực hiện:**

```
1. Tạo shared hook `useSearchParam.ts` (nếu chưa có):
   - Đọc/ghi search param từ URL
   - Debounce 300ms
   - Trim whitespace

2. Update StaffPage (đã có, verify)

3. Update CustomersPage:
   - Thêm useSearchParams
   - Kết nối Input với URL
   - Server Action filter theo search

4. Update ServicesPage:
   - Tương tự CustomersPage

5. Update ResourcesPage:
   - Tương tự CustomersPage
```

**Files cần sửa:**
- [ ] `frontend/src/shared/hooks/use-search-param.ts` (tạo mới nếu chưa có)
- [ ] `frontend/src/features/customers/components/customers-page.tsx`
- [ ] `frontend/src/features/services/components/services-page.tsx`
- [ ] `frontend/src/features/resources/components/resource-page.tsx`

**Acceptance Criteria:**
- [ ] Gõ vào search → URL cập nhật `?search=...`
- [ ] Reload trang → giữ nguyên search query
- [ ] Data được filter đúng

---

### Task 2.2: Fix Shift Validation (H3)

**Issue:** ShiftForm không kiểm tra endTime > startTime

**Phụ thuộc:** Không có

**Ước tính:** 2 giờ

**Chi tiết thực hiện:**

```
1. Mở staff/components/scheduling/add-shift-dialog.tsx (hoặc ShiftForm)
2. Thêm Zod validation:
   .refine((data) => data.endTime > data.startTime, {
     message: "Giờ kết thúc phải sau giờ bắt đầu",
     path: ["endTime"],
   })
3. Hiển thị error message trong form
```

**Files cần sửa:**
- [ ] `frontend/src/features/staff/components/scheduling/add-shift-dialog.tsx`
- [ ] Schema file tương ứng

**Acceptance Criteria:**
- [ ] Không thể submit ca có endTime <= startTime
- [ ] Hiển thị thông báo lỗi rõ ràng

---

### Task 2.3: Fix Bulk Delete Mock (H4)

**Issue:** Bulk delete chỉ console.log, không xóa thực

**Phụ thuộc:** Task 1.1

**Ước tính:** 3 giờ

**Chi tiết thực hiện:**

```
1. Trong customers/actions.ts:
   - Tạo bulkDeleteCustomers(ids: string[])
   - Sử dụng Promise.allSettled để xóa song song

2. Trong customer-table.tsx (nếu có):
   - Gọi action thực thay vì console.log
   - Refresh data sau khi xóa
   - Hiển thị toast kết quả
```

**Files cần sửa:**
- [ ] `frontend/src/features/customers/actions.ts`
- [ ] Customer table component

**Acceptance Criteria:**
- [ ] Chọn nhiều customers → Delete → Data thực sự bị xóa (trong mock array)
- [ ] Toast hiển thị số lượng đã xóa
- [ ] Table refresh

---

### Task 2.4: Disable Form khi Pending (H5)

**Issue:** User có thể click/nhập khi form đang submit

**Phụ thuộc:** Không có

**Ước tính:** 4 giờ

**Chi tiết thực hiện:**

```
1. Tìm tất cả form/sheet components
2. Wrap form trong <fieldset disabled={isPending}>
3. Hoặc: Truyền disabled={isPending} vào tất cả inputs và buttons

Các components cần check:
- CustomerSheet / CustomerForm
- StaffSheet / StaffForm
- ServiceSheet / ServiceForm
- ResourceSheet / ResourceForm
- Login/Register Forms
- BookingDialog
```

**Files cần sửa:**
- [ ] `frontend/src/features/customers/components/customer-sheet.tsx`
- [ ] `frontend/src/features/staff/components/staff-sheet.tsx`
- [ ] `frontend/src/features/staff/components/staff-form.tsx`
- [ ] `frontend/src/features/services/components/service-sheet.tsx`
- [ ] `frontend/src/features/resources/components/resource-sheet.tsx`
- [ ] `frontend/src/features/auth/components/login-form.tsx`
- [ ] `frontend/src/features/auth/components/register-form.tsx`
- [ ] `frontend/src/features/customer-dashboard/components/booking-dialog.tsx`

**Acceptance Criteria:**
- [ ] Khi isPending=true, tất cả inputs bị disabled
- [ ] Button submit hiển thị loading state
- [ ] Không thể double-submit

---

## 🔴 PHASE 3: APPOINTMENTS MODULE CORE (Milestone M3)

### Mục tiêu
Xây dựng lại module Appointments từ đầu với proper architecture.

---

### Task 3.1: Chuyển AppointmentsPage sang Server Component (C3)

**Issue:** Đang dùng useEffect để fetch (Data Waterfall)

**Phụ thuộc:** Task 1.1

**Ước tính:** 8 giờ

**Chi tiết thực hiện:**

```
1. Tạo Server Component wrapper:
   app/(dashboard)/appointments/page.tsx
   - Fetch data với Promise.all
   - Pass xuống Client Component

2. Refactor appointments-page.tsx:
   - Nhận data qua props thay vì fetch trong useEffect
   - Chỉ giữ client state (view, selectedEvent, isSheetOpen)

3. Tạo loading.tsx cho Suspense
```

**Files cần tạo/sửa:**
- [ ] `frontend/src/app/(dashboard)/appointments/page.tsx` (update)
- [ ] `frontend/src/features/appointments/components/appointments-page.tsx` (refactor)
- [ ] `frontend/src/app/(dashboard)/appointments/loading.tsx` (tạo mới)

**Acceptance Criteria:**
- [ ] Data được fetch ở Server Component
- [ ] Không còn useEffect fetch
- [ ] Loading skeleton hiển thị đúng

---

### Task 3.2: Implement createAppointment Persist (C2)

**Issue:** createAppointment không lưu data

**Phụ thuộc:** Task 3.1

**Ước tính:** 4 giờ

**Chi tiết thực hiện:**

```
1. Trong appointments/actions.ts:
   - Uncomment MOCK_APPOINTMENTS.push(newAppointment)
   - Hoặc: Tạo in-memory store tương tự services/actions.ts

2. Trong AppointmentSheet:
   - Gọi createAppointment action
   - Handle response
   - Trigger refresh

3. Thêm revalidatePath để refresh data
```

**Files cần sửa:**
- [ ] `frontend/src/features/appointments/actions.ts`
- [ ] `frontend/src/features/appointments/components/sheet/appointment-sheet.tsx`
- [ ] `frontend/src/features/appointments/components/sheet/appointment-form.tsx`

**Acceptance Criteria:**
- [ ] Tạo appointment → Data được lưu vào mock store
- [ ] Calendar hiển thị appointment mới
- [ ] Toast thông báo thành công

---

### Task 3.3: Hoàn thiện Calendar Views (C1)

**Issue:** Module chỉ có placeholder

**Phụ thuộc:** Task 3.1, 3.2

**Ước tính:** 24 giờ (3 ngày)

**Chi tiết thực hiện:**

```
Đã có sẵn:
- CalendarView component
- DayView, WeekView, MonthView, AgendaView
- TimelineView
- EventCard, EventPopover

Cần verify và fix:
1. Kiểm tra tất cả views render đúng
2. Kiểm tra event click mở sheet
3. Kiểm tra navigation (prev/next/today)
4. Kiểm tra ViewSwitcher hoạt động
5. Test trên mobile responsive
```

**Files cần kiểm tra:**
- [ ] `frontend/src/features/appointments/components/calendar/*`
- [ ] `frontend/src/features/appointments/components/event/*`
- [ ] `frontend/src/features/appointments/components/toolbar/*`

**Acceptance Criteria:**
- [ ] Tất cả views hiển thị events đúng
- [ ] Navigation hoạt động
- [ ] Click event → mở detail sheet
- [ ] Responsive trên mobile

---

## 🟠 PHASE 4: APPOINTMENTS WORKFLOWS (Milestone M4)

### Mục tiêu
Triển khai các luồng nghiệp vụ cho Appointments.

---

### Task 4.1: Walk-in Booking Form (H7)

**Issue:** Thiếu form tạo nhanh cho khách vãng lai

**Phụ thuộc:** Task 3.2

**Ước tính:** 8 giờ

**Chi tiết thực hiện:**

```
1. Tạo component walk-in-booking-dialog.tsx:
   - Dialog với form đơn giản
   - Chọn khách hàng (search/create mới)
   - Chọn dịch vụ
   - Chọn KTV
   - Thời gian mặc định = now

2. Thêm button "Tạo nhanh" vào toolbar
```

**Files cần tạo:**
- [ ] `frontend/src/features/appointments/components/walk-in-booking-dialog.tsx`
- [ ] Update `appointments-page.tsx` để thêm button trigger

**Acceptance Criteria:**
- [ ] Click "Tạo nhanh" → mở dialog
- [ ] Có thể tạo booking với ít thông tin nhất
- [ ] Booking được tạo với status "in_progress"

---

### Task 4.2: Check-in & No-show Actions (H6)

**Issue:** Thiếu action check-in/no-show

**Phụ thuộc:** Task 3.3

**Ước tính:** 6 giờ

**Chi tiết thực hiện:**

```
1. Trong EventPopover hoặc EventCard:
   - Thêm button "Check-in" (visible khi status = confirmed)
   - Thêm button "Không đến" (visible khi status = confirmed và time đã qua)

2. Actions đã có sẵn:
   - checkInAppointment(id)
   - markNoShow(id)

3. Connect UI với actions
```

**Files cần sửa:**
- [ ] `frontend/src/features/appointments/components/event/event-popover.tsx`
- [ ] `frontend/src/features/appointments/components/event/event-card.tsx`

**Acceptance Criteria:**
- [ ] Appointment confirmed → có button Check-in
- [ ] Click Check-in → status chuyển "in_progress"
- [ ] Appointment quá giờ → có button No-show
- [ ] Click No-show → status chuyển "no_show"

---

### Task 4.3: Cancel Booking với Policy (H1)

**Issue:** Thiếu nút hủy lịch hẹn trong Customer Dashboard

**Phụ thuộc:** Task 3.2

**Ước tính:** 6 giờ

**Chi tiết thực hiện:**

```
1. Tạo cancel-dialog.tsx:
   - Input lý do hủy
   - Kiểm tra policy (ví dụ: không hủy trước 2h)
   - Warning nếu hủy gần giờ hẹn

2. Thêm vào appointment-list trong customer-dashboard
3. Thêm vào EventPopover cho admin
```

**Files cần tạo/sửa:**
- [ ] `frontend/src/features/appointments/components/sheet/cancel-dialog.tsx` (verify)
- [ ] `frontend/src/features/customer-dashboard/components/appointment-list.tsx`
- [ ] `frontend/src/features/appointments/components/event/event-popover.tsx`

**Acceptance Criteria:**
- [ ] Có button "Hủy lịch" cho khách hàng
- [ ] Warning khi hủy gần giờ hẹn
- [ ] Yêu cầu nhập lý do
- [ ] Status chuyển "cancelled"

---

## 🔴 PHASE 5: MISSING MODULES (Milestone M5)

### Mục tiêu
Tạo các module hoàn toàn thiếu theo thiết kế.

---

### Task 5.1: Tạo Module Billing (C6)

**Issue:** Module billing không tồn tại

**Phụ thuộc:** Task 3.2

**Ước tính:** 24 giờ (3 ngày)

**Chi tiết thực hiện:**

```
1. Tạo cấu trúc thư mục:
   features/billing/
   ├── actions.ts
   ├── types.ts
   ├── schemas.ts
   ├── index.ts
   ├── constants.ts
   └── components/
       ├── invoice-generator.tsx
       ├── payment-form.tsx
       ├── invoice-table.tsx
       ├── invoice-preview.tsx
       └── payment-status-badge.tsx

2. Types theo database_design.md:
   - Invoice: id, booking_id, amount, status, issued_at
   - Payment: id, invoice_id, amount, method, transaction_ref

3. Actions:
   - createInvoice(bookingId)
   - getInvoices(filters)
   - processPayment(invoiceId, method, amount)
   - getPaymentHistory(invoiceId)

4. UI Components:
   - InvoiceGenerator: Tạo hóa đơn từ booking
   - PaymentForm: Chọn phương thức, xác nhận
   - InvoiceTable: Danh sách hóa đơn
```

**Files cần tạo:**
- [ ] `frontend/src/features/billing/types.ts`
- [ ] `frontend/src/features/billing/schemas.ts`
- [ ] `frontend/src/features/billing/actions.ts`
- [ ] `frontend/src/features/billing/constants.ts`
- [ ] `frontend/src/features/billing/index.ts`
- [ ] `frontend/src/features/billing/components/invoice-generator.tsx`
- [ ] `frontend/src/features/billing/components/payment-form.tsx`
- [ ] `frontend/src/features/billing/components/invoice-table.tsx`
- [ ] `frontend/src/features/billing/components/invoice-preview.tsx`
- [ ] `frontend/src/features/billing/components/payment-status-badge.tsx`
- [ ] `frontend/src/app/admin/billing/page.tsx`

**Acceptance Criteria:**
- [ ] Có thể tạo hóa đơn từ booking hoàn thành
- [ ] Có thể ghi nhận thanh toán
- [ ] Danh sách hóa đơn với filter status
- [ ] Preview hóa đơn trước khi in

---

### Task 5.2: Tạo Module Reviews (C7)

**Issue:** Module reviews không tồn tại

**Phụ thuộc:** Task 5.1 (sau khi có invoice → trigger review)

**Ước tính:** 16 giờ (2 ngày)

**Chi tiết thực hiện:**

```
1. Tạo cấu trúc thư mục:
   features/reviews/
   ├── actions.ts
   ├── types.ts
   ├── schemas.ts
   ├── index.ts
   └── components/
       ├── review-form.tsx
       ├── review-card.tsx
       ├── review-list.tsx
       └── star-rating.tsx

2. Types theo database_design.md:
   - Review: id, booking_id, customer_id, rating, comment, created_at

3. Actions:
   - createReview(bookingId, rating, comment)
   - getReviews(filters)
   - getBookingReview(bookingId)

4. Integration:
   - Sau khi booking completed → prompt review
   - Hiển thị trong customer-dashboard/appointments
```

**Files cần tạo:**
- [ ] `frontend/src/features/reviews/types.ts`
- [ ] `frontend/src/features/reviews/schemas.ts`
- [ ] `frontend/src/features/reviews/actions.ts`
- [ ] `frontend/src/features/reviews/index.ts`
- [ ] `frontend/src/features/reviews/components/review-form.tsx`
- [ ] `frontend/src/features/reviews/components/review-card.tsx`
- [ ] `frontend/src/features/reviews/components/review-list.tsx`
- [ ] `frontend/src/features/reviews/components/star-rating.tsx`

**Acceptance Criteria:**
- [ ] Sau booking hoàn thành → có thể đánh giá
- [ ] Form với 1-5 stars + comment
- [ ] Xem lịch sử đánh giá

---

## 🟡 PHASE 6: MEDIUM PRIORITY (Milestone M6)

### Module thiếu theo thiết kế

| Task | Issue | Mô tả | Ước tính |
|:---|:---|:---|:---:|
| 6.1 | H8 | Thêm UI quản lý `service_categories` | 4h |
| 6.2 | H9 | Thêm `proficiency_level` cho service skills | 2h |
| 6.3 | H10 | Hoàn thiện Operating Hours Settings | 4h |
| 6.4 | M1 | Thêm Pricing Section cho Landing Page | 4h |
| 6.5 | M2 | Thêm FAQ Section cho Landing Page | 3h |
| 6.6 | M3 | Fallback Image cho service cards | 1h |
| 6.7 | M4 | Dynamic Breadcrumb cho Admin | 4h |
| 6.8 | M5 | Kết nối Notifications với API | 6h |
| 6.9 | M7 | Treatment Progress UI | 6h |
| 6.10 | M8 | Loyalty Points Display | 2h |

**Tổng Phase 6:** ~36 giờ (4.5 ngày)

---

## 🔵 PHASE 7: LOW PRIORITY POLISH (Milestone M7)

| Task | Issue | Mô tả | Ước tính |
|:---|:---|:---|:---:|
| 7.1 | L1 | prefers-reduced-motion support | 2h |
| 7.2 | L2 | Thay input[type=date] bằng DatePicker | 2h |
| 7.3 | L3 | Thay hardcoded colors bằng semantic tokens | 3h |
| 7.4 | L4 | Implement callback URL cho login | 1h |
| 7.5 | L5 | Centralize Toast messages | 4h |

**Tổng Phase 7:** ~12 giờ (1.5 ngày)

---

## 📊 Timeline Tổng Hợp

```
Week 1:  [M1: Foundation] [M2: Fix Critical UX]
Week 2:  [M3: Appointments Core - Part 1]
Week 3:  [M3: Appointments Core - Part 2] [M4: Appointments Workflows]
Week 4:  [M5: Missing Modules - Billing]
Week 5:  [M5: Missing Modules - Reviews] [M6: Medium Priority - Part 1]
Week 6:  [M6: Medium Priority - Part 2] [M7: Low Priority]
```

**Tổng cộng:** ~6 tuần (30 ngày làm việc) với 1 developer

---

## 🚨 Rủi Ro & Giảm Thiểu

| Rủi ro | Xác suất | Tác động | Giảm thiểu |
|:---|:---:|:---:|:---|
| Backend chưa ready khi Frontend xong | Cao | Cao | Tiếp tục dùng Mock Data, chuẩn hóa Types |
| Thay đổi yêu cầu giữa chừng | Trung bình | Trung bình | Review từng milestone trước khi tiếp |
| Performance issues với Calendar | Trung bình | Cao | Virtualization cho event lists |
| Breaking changes khi refactor | Thấp | Cao | Chạy lint + test sau mỗi task |

---

## ✅ Checklist Hoàn Thành Từng Milestone

### Milestone M1 Checklist
- [ ] Tất cả actions dùng ActionResponse<T>
- [ ] DataTable chỉ còn Grouped Config
- [ ] Không có TypeScript errors
- [ ] Lint pass

### Milestone M2 Checklist
- [ ] Search works với URL params
- [ ] Shift validation works
- [ ] Bulk delete works
- [ ] Forms disabled khi pending

### Milestone M3 Checklist
- [ ] Appointments page uses Server Component fetching
- [ ] Create appointment persists data
- [ ] All calendar views render correctly
- [ ] Mobile responsive

### Milestone M4 Checklist
- [ ] Walk-in booking works
- [ ] Check-in action works
- [ ] No-show action works
- [ ] Cancel booking works với policy

### Milestone M5 Checklist
- [ ] Billing module complete
- [ ] Reviews module complete
- [ ] Integration với appointments

### Milestone M6 Checklist
- [ ] Service categories UI
- [ ] Proficiency level editable
- [ ] Operating hours complete
- [ ] Landing page sections complete
- [ ] Notifications connected
- [ ] Treatment progress UI
- [ ] Loyalty points display

### Milestone M7 Checklist
- [ ] reduced-motion support
- [ ] DatePicker consistent
- [ ] Semantic colors only
- [ ] Callback URL works
- [ ] Centralized toasts

---

## 📝 Changelog

| Ngày | Phiên bản | Thay đổi |
|:---|:---:|:---|
| 2025-12-12 | 1.0 | Tạo Master Plan từ báo cáo đánh giá |
