# 🗺️ Lộ Trình Phát Triển Giao Diện Frontend Synapse 2025

> **Cập nhật:** 11/12/2025
> **Phiên bản:** 1.0
> **Trạng thái:** Draft → In Review

---

## 📋 Tổng Quan Hiện Trạng

### Các Module Giao Diện Đã Triển Khai

| Module                  | Trạng thái     | Mức độ hoàn thiện | Ghi chú                                                               |
| ----------------------- | -------------- | ----------------- | --------------------------------------------------------------------- |
| **Landing Page**        | ✅ Có          | ~85%              | Hero, Services, Features, Testimonials, CTA đã có; thiếu Pricing, FAQ |
| **Auth**                | ✅ Có          | ~90%              | Login, Register, Forgot/Reset Password đầy đủ                         |
| **Admin Layout**        | ✅ Có          | ~80%              | Sidebar, Header hoạt động; thiếu breadcrumb động                      |
| **Staff Management**    | ✅ Có          | ~85%              | CRUD, Scheduler, Permissions; có một số vấn đề UX                     |
| **Customer Management** | ✅ Có          | ~75%              | CRUD cơ bản; bulk delete mock; search chưa kết nối                    |
| **Services**            | ✅ Có          | ~85%              | CRUD, Skills tab; wizard tạo mới; search chưa kết nối                 |
| **Resources**           | ✅ Có          | ~80%              | CRUD, Maintenance timeline; search chưa kết nối                       |
| **Appointments**        | ⚠️ Placeholder | ~5%               | Chỉ có placeholder "Đang phát triển"                                  |
| **Customer Dashboard**  | ✅ Có          | ~70%              | Booking dialog, Profile; thiếu lịch sử, đánh giá                      |
| **Notifications**       | ✅ Có          | ~60%              | Popover + List với mock; chưa kết nối API                             |
| **Settings**            | ⚠️ Partial     | ~30%              | Chỉ có Notifications settings                                         |
| **Chat/Chatbot**        | ⚠️ Placeholder | ~10%              | Có folder nhưng chưa triển khai                                       |
| **Billing/Payments**    | ❌ Chưa có     | 0%                | Theo thiết kế cần Invoice, Payment                                    |
| **Reviews**             | ❌ Chưa có     | 0%                | Theo thiết kế cần Review sau booking                                  |
| **Reports/Analytics**   | ❌ Chưa có     | 0%                | Theo thiết kế Admin cần báo cáo doanh thu                             |

---

## 🔍 Phân Tích Gap (Thiết kế vs Hiện trạng)

### So sánh với Sequence Diagrams

| Luồng thiết kế                           | Giao diện hiện có                      | Gap                                    |
| ---------------------------------------- | -------------------------------------- | -------------------------------------- |
| **3.15-16: Xem dịch vụ**                 | ✅ Landing + Services Page             | Đầy đủ                                 |
| **3.21-22: Đặt lịch (Smart Scheduling)** | ⚠️ BookingDialog có nhưng dùng mock    | Thiếu kết nối API Availability Solver  |
| **3.24: Chatbot tư vấn**                 | ❌ Chưa triển khai                     | Cần Chat UI + AI integration           |
| **3.25: Hủy lịch hẹn**                   | ⚠️ Không thấy trong Customer Dashboard | Thiếu nút/dialog hủy lịch              |
| **3.26: Lịch sử đặt lịch**               | ⚠️ Có `appointment-list.tsx`           | Cần kiểm tra hoàn thiện                |
| **3.28: Đánh giá dịch vụ**               | ❌ Chưa triển khai                     | Cần Review UI sau booking              |
| **3.31: Dashboard Lễ tân**               | ⚠️ `appointments-page.tsx` placeholder | **GAP LỚN** - cần Calendar view        |
| **3.34: Walk-in booking**                | ❌ Chưa triển khai                     | Thiếu form tạo nhanh cho Lễ tân        |
| **3.35: Check-in**                       | ❌ Chưa triển khai                     | Thiếu action check-in trên Appointment |
| **3.37: Thanh toán**                     | ❌ Chưa triển khai                     | Thiếu Invoice/Payment UI               |
| **3.39-40: KTV xem lịch + ghi chú**      | ⚠️ Staff Scheduler có                  | Thiếu treatment notes UI               |
| **3.42: Admin quản lý dịch vụ**          | ✅ Services Page                       | Đầy đủ                                 |
| **3.44: Admin quản lý tài nguyên**       | ✅ Resources Page                      | Đầy đủ                                 |
| **3.47: Admin phân ca**                  | ✅ Staff Scheduler                     | Đầy đủ (cần kiểm tra constraint)       |
| **3.53: Báo cáo doanh thu**              | ❌ Chưa triển khai                     | Cần Analytics/Reports page             |

### Vấn đề UX/UI Phát hiện (từ đánh giá trước)

| Vấn đề                                  | Module                               | Mức độ   |
| --------------------------------------- | ------------------------------------ | -------- |
| Ô tìm kiếm không kết nối logic lọc      | Staff, Customer, Services, Resources | **High** |
| Delete không refresh bảng               | Staff, Customer                      | **High** |
| Bulk delete là mock (Customer)          | Customer                             | **High** |
| Thiếu validation endTime > startTime    | Staff Scheduler (ShiftForm)          | **High** |
| Pending state không disable form        | Staff, Customer Sheet                | Medium   |
| Image placeholder khi URL rỗng          | Landing Services                     | Medium   |
| prefers-reduced-motion chưa áp dụng đều | Landing, Booking Dialog              | Low      |

---

## 🎯 Lộ Trình Phát Triển (Theo Ưu Tiên)

### Phase 1: Khắc Phục Lỗi Quan Trọng (P0) - Sprint 1-2

**Mục tiêu:** Đảm bảo các tính năng hiện có hoạt động đúng

| Task | Module                            | Chi tiết                                            | Ước lượng |
| ---- | --------------------------------- | --------------------------------------------------- | --------- |
| 1.1  | Staff/Customer/Services/Resources | Kết nối ô tìm kiếm với URL params + server action   | 2d        |
| 1.2  | Staff/Customer                    | Trigger refetch sau delete (đơn lẻ + bulk)          | 1d        |
| 1.3  | Customer                          | Triển khai bulk delete thật (thay mock)             | 0.5d      |
| 1.4  | Staff Scheduler                   | Thêm validation endTime > startTime trong ShiftForm | 0.5d      |
| 1.5  | All Sheets/Forms                  | Disable form khi isPending (fieldset disabled)      | 1d        |
| 1.6  | Landing Services                  | Thêm fallback image placeholder                     | 0.5d      |

**Tổng:** ~5.5 ngày

---

### Phase 2: Hoàn Thiện Module Appointments (P1) - Sprint 3-5

**Mục tiêu:** Xây dựng giao diện Lịch hẹn cho Admin/Lễ tân theo thiết kế

| Task | Sequence Ref | Chi tiết                                                                       | Ước lượng |
| ---- | ------------ | ------------------------------------------------------------------------------ | --------- |
| 2.1  | 3.31         | **Appointment Calendar View** (Day/Week/Month) sử dụng BigCalendar hoặc custom | 5d        |
| 2.2  | 3.34         | **Walk-in Booking Form** - Tạo nhanh lịch cho khách vãng lai                   | 2d        |
| 2.3  | 3.35         | **Check-in Action** - Button + status update trên Appointment card             | 1d        |
| 2.4  | -            | **Appointment Details Sheet** - Xem chi tiết, sửa, hủy                         | 2d        |
| 2.5  | 3.25         | **Cancel Booking Dialog** với policy check (trước 2h)                          | 1d        |
| 2.6  | -            | **Filter/Search cho Appointments** - theo ngày, trạng thái, KTV                | 1.5d      |
| 2.7  | -            | **Real-time status indicators** (Pending/Confirmed/In-Progress)                | 1d        |

**Tổng:** ~13.5 ngày

**Components cần tạo:**

```
features/appointments/components/
├── appointment-calendar.tsx       # Calendar view chính
├── appointment-card.tsx           # Card hiển thị trong calendar
├── appointment-details-sheet.tsx  # Chi tiết + actions
├── walk-in-booking-dialog.tsx     # Tạo nhanh cho khách vãng lai
├── cancel-booking-dialog.tsx      # Xác nhận hủy + policy
├── appointment-filter.tsx         # Bộ lọc
├── check-in-button.tsx            # Action check-in
└── appointment-status-badge.tsx   # Badge trạng thái
```

---

### Phase 3: Billing & Payments (P1) - Sprint 6-7

**Mục tiêu:** Xây dựng giao diện thanh toán theo thiết kế

| Task | Sequence Ref | Chi tiết                                       | Ước lượng |
| ---- | ------------ | ---------------------------------------------- | --------- |
| 3.1  | 3.37         | **Invoice Generator** - Tạo hóa đơn từ booking | 2d        |
| 3.2  | 3.37         | **Payment Form** - Chọn phương thức, xác nhận  | 2d        |
| 3.3  | -            | **Invoice List/History** cho Admin             | 1.5d      |
| 3.4  | -            | **Receipt Preview & Print**                    | 1d        |
| 3.5  | -            | **Payment Status Tracking**                    | 1d        |

**Tổng:** ~7.5 ngày

**Components cần tạo:**

```
features/billing/
├── components/
│   ├── invoice-generator.tsx
│   ├── payment-form.tsx
│   ├── invoice-table.tsx
│   ├── invoice-preview.tsx
│   └── payment-status-badge.tsx
├── actions.ts
├── schemas.ts
└── types.ts
```

---

### Phase 4: Customer Dashboard Enhancement (P2) - Sprint 8-9

**Mục tiêu:** Hoàn thiện trải nghiệm khách hàng

| Task | Sequence Ref | Chi tiết                                        | Ước lượng |
| ---- | ------------ | ----------------------------------------------- | --------- |
| 4.1  | 3.21-22      | **Kết nối Booking Dialog với API** thay mock    | 3d        |
| 4.2  | 3.26         | **Booking History Page** với filter, pagination | 2d        |
| 4.3  | 3.25         | **Cancel Booking từ Customer Dashboard**        | 1d        |
| 4.4  | 3.28         | **Review/Rating UI** sau khi hoàn thành booking | 2d        |
| 4.5  | -            | **Treatment Progress Tracker** (Gói liệu trình) | 2d        |
| 4.6  | -            | **Loyalty Points Display**                      | 0.5d      |

**Tổng:** ~10.5 ngày

**Components cần tạo/cập nhật:**

```
features/customer-dashboard/components/
├── booking/
│   └── (update) steps/* - kết nối API thật
├── booking-history.tsx           # Lịch sử đặt lịch
├── review-form.tsx               # Form đánh giá
├── treatment-progress.tsx        # Theo dõi liệu trình
└── loyalty-card.tsx              # Hiển thị điểm tích lũy
```

---

### Phase 5: Analytics & Reports (P2) - Sprint 10-11

**Mục tiêu:** Dashboard báo cáo cho Admin

| Task | Sequence Ref | Chi tiết                                                 | Ước lượng |
| ---- | ------------ | -------------------------------------------------------- | --------- |
| 5.1  | 3.53         | **Revenue Dashboard** - Biểu đồ doanh thu theo thời gian | 3d        |
| 5.2  | -            | **Staff Performance Metrics** - KPIs nhân viên           | 2d        |
| 5.3  | -            | **Service Popularity Report**                            | 1.5d      |
| 5.4  | -            | **Customer Insights** - Top customers, retention         | 2d        |
| 5.5  | -            | **Export Reports** (PDF/Excel)                           | 1.5d      |

**Tổng:** ~10 ngày

**Components cần tạo:**

```
features/analytics/
├── components/
│   ├── revenue-chart.tsx
│   ├── staff-performance-table.tsx
│   ├── service-popularity-chart.tsx
│   ├── customer-insights.tsx
│   ├── date-range-picker.tsx
│   └── export-button.tsx
├── actions.ts
└── types.ts
```

---

### Phase 6: Chat & AI Integration (P3) - Sprint 12-13

**Mục tiêu:** Tích hợp Chatbot tư vấn

| Task | Sequence Ref | Chi tiết                                      | Ước lượng |
| ---- | ------------ | --------------------------------------------- | --------- |
| 6.1  | 3.24         | **Chat Widget UI** - Floating button + panel  | 2d        |
| 6.2  | 3.24         | **Message Thread Component**                  | 1.5d      |
| 6.3  | 3.24         | **AI Response Streaming**                     | 2d        |
| 6.4  | 3.24         | **Quick Actions trong Chat** (đặt lịch nhanh) | 2d        |
| 6.5  | -            | **Chat History**                              | 1d        |

**Tổng:** ~8.5 ngày

---

### Phase 7: Notifications & Real-time (P3) - Sprint 14

**Mục tiêu:** Kết nối thông báo với backend + Zalo/SMS

| Task | Chi tiết                                  | Ước lượng |
| ---- | ----------------------------------------- | --------- |
| 7.1  | Kết nối Notification API thay mock        | 1.5d      |
| 7.2  | WebSocket/SSE cho real-time notifications | 2d        |
| 7.3  | Notification Settings UI mở rộng          | 1d        |
| 7.4  | Push Notification permission              | 0.5d      |

**Tổng:** ~5 ngày

---

### Phase 8: Settings & System (P3) - Sprint 15

| Task | Chi tiết                    | Ước lượng |
| ---- | --------------------------- | --------- |
| 8.1  | Operating Hours Settings UI | 2d        |
| 8.2  | Spa Profile Settings        | 1d        |
| 8.3  | User Preferences            | 1d        |
| 8.4  | Audit Log Viewer (Admin)    | 2d        |

**Tổng:** ~6 ngày

---

## 📊 Tổng Kết Timeline

| Phase | Tên                      | Sprints | Ngày ước lượng | Độ ưu tiên |
| ----- | ------------------------ | ------- | -------------- | ---------- |
| 1     | Khắc phục lỗi quan trọng | 1-2     | 5.5d           | **P0**     |
| 2     | Module Appointments      | 3-5     | 13.5d          | **P1**     |
| 3     | Billing & Payments       | 6-7     | 7.5d           | **P1**     |
| 4     | Customer Dashboard       | 8-9     | 10.5d          | **P2**     |
| 5     | Analytics & Reports      | 10-11   | 10d            | **P2**     |
| 6     | Chat & AI                | 12-13   | 8.5d           | **P3**     |
| 7     | Notifications            | 14      | 5d             | **P3**     |
| 8     | Settings & System        | 15      | 6d             | **P3**     |

**Tổng cộng:** ~66.5 ngày (~3.5 tháng với 1 developer full-time)

---

## ✅ Checklist Tuân Thủ Thiết Kế

### UX Consistency (theo ui-ux-synapse.md)

- [ ] Icons sử dụng Lucide nhất quán
- [ ] Cursor pointer cho tất cả interactive elements
- [ ] Hover states rõ ràng
- [ ] Ngôn ngữ Tiếng Việt
- [ ] Touch target ≥ 44px trên mobile
- [ ] Focus-visible states cho accessibility
- [ ] prefers-reduced-motion support

### Next.js Optimization

- [ ] Sử dụng `next/image` cho tất cả hình ảnh
- [ ] Server Components mặc định
- [ ] `'use client'` chỉ khi cần hooks
- [ ] Streaming với Suspense boundaries

### Layout Responsiveness

- [ ] Mobile-first approach
- [ ] Kiểm tra tablet breakpoint
- [ ] Không horizontal scroll không mong muốn
- [ ] Skeleton loading states

---

## 🔗 Tài Liệu Liên Quan

- [Architecture V2](../design/architecture_v2.md)
- [Data Specification](../design/data_specification.md)
- [Sequence Diagrams](../design/sequence_diagrams.md)
- [Customer Identity Redesign](../planning/customer_identity_redesign.md)
- [UI/UX Workflow](../../.agent/workflows/ui-ux-synapse.md)

---

## 📝 Changelog

| Ngày       | Phiên bản | Thay đổi                                     |
| ---------- | --------- | -------------------------------------------- |
| 11/12/2025 | 1.0       | Tạo lộ trình ban đầu dựa trên đánh giá UI/UX |
