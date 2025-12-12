---
phase: requirements
title: Phase 2 - Hoàn Thiện Module Appointments
description: Xây dựng giao diện Lịch hẹn cho Admin/Lễ tân theo thiết kế
status: active
priority: P1
estimated_days: 13.5
created_at: 2025-12-11
---

# Phase 2: Hoàn Thiện Module Appointments (P1)

## Tuyên bố Vấn đề

**Chúng ta đang giải quyết vấn đề gì?**

Module Appointments đã có cấu trúc React components hoàn chỉnh (Calendar, Timeline, Sheet, Toolbar) nhưng:
1. Chưa kết nối Backend API thật - 100% Mock data
2. Thiếu một số tính năng quan trọng theo sequence diagrams
3. Một số UX flows chưa hoàn thiện

**Hiện trạng đã có:**
- ✅ `appointments-page.tsx` - Container chính với Dashboard metrics
- ✅ `CalendarView` - Router cho Day/Week/Month/Agenda/Timeline views
- ✅ `AppointmentSheet` - Chi tiết + Form tạo/sửa
- ✅ `DateNavigator` + `ViewSwitcher` - Toolbar hoàn chỉnh
- ✅ `actions.ts` - Server Actions với Mock data
- ✅ `types.ts` - TypeScript interfaces đầy đủ
- ✅ `schemas.ts` - Zod validation

**Còn thiếu/cần cải thiện:**
- ⚠️ Walk-in Booking Form (tạo nhanh cho khách vãng lai)
- ⚠️ Check-in/No-Show actions trực tiếp từ Calendar
- ⚠️ Cancel Booking với policy check (trước 2h)
- ⚠️ Filter/Search UI
- ⚠️ Real-time status indicators
- ❌ Backend API endpoints (nằm ngoài scope Frontend)

---

## Mục tiêu & Mục đích

**Mục tiêu chính:**
- [x] Hoàn thiện UI/UX theo thiết kế sequence diagrams
- [x] Thêm các tính năng còn thiếu (Walk-in, Check-in, Cancel)
- [x] Cải thiện UX với Filter, Search, Status indicators
- [x] Đảm bảo consistency với các module khác

**Phi mục tiêu (Nằm ngoài phạm vi):**
- ❌ Tạo Backend API (sẽ làm riêng)
- ❌ Real-time updates với WebSocket (Phase 7)
- ❌ Tích hợp Zalo/SMS notifications (Phase 7)

---

## Phân Tích Hiện Trạng (Scout Results)

### Components Đã Có

```
features/appointments/
├── components/
│   ├── appointments-page.tsx      ✅ Container chính (270 LOC)
│   ├── calendar/
│   │   ├── calendar-view.tsx      ✅ Router (149 LOC)
│   │   ├── day-view.tsx           ✅ Xem theo ngày
│   │   ├── week-view.tsx          ✅ Xem theo tuần
│   │   ├── month-view.tsx         ✅ Xem theo tháng
│   │   ├── agenda-view.tsx        ✅ Danh sách
│   │   └── time-grid.tsx          ✅ Grid giờ
│   ├── sheet/
│   │   ├── appointment-sheet.tsx  ✅ Chi tiết (11KB)
│   │   ├── appointment-form.tsx   ✅ Form tạo/sửa (18KB)
│   │   └── conflict-warning.tsx   ✅ Cảnh báo xung đột
│   ├── toolbar/
│   │   ├── date-navigator.tsx     ✅ Điều hướng ngày
│   │   └── view-switcher.tsx      ✅ Chuyển đổi view
│   ├── timeline/
│   │   └── ...                    ✅ Timeline view
│   ├── event/
│   │   └── ...                    ✅ Event cards
│   └── dnd/
│       └── ...                    ✅ Drag & Drop
├── actions.ts                     ✅ Server Actions (474 LOC)
├── types.ts                       ✅ TypeScript (287 LOC)
├── schemas.ts                     ✅ Zod validation
├── mock-data.ts                   ✅ Mock data (15KB)
└── hooks/
    └── use-calendar-state.ts      ✅ State management
```

### Tính Năng Đã Có
1. ✅ **Calendar Views** - Day/Week/Month/Agenda/Timeline working
2. ✅ **Event Click** - Mở AppointmentSheet khi click
3. ✅ **Create Appointment** - Button "Tạo lịch hẹn" → Sheet
4. ✅ **Date Navigation** - Prev/Next/Today buttons
5. ✅ **Dashboard Metrics** - Today stats inline
6. ✅ **Drag & Drop** - Có cấu trúc DnD

### Tính Năng Còn Thiếu
1. ⚠️ **Walk-in Quick Form** - Dialog riêng cho khách vãng lai
2. ⚠️ **Check-in Button** - Action trực tiếp từ event card
3. ⚠️ **Cancel with Policy** - Dialog với chính sách hủy
4. ⚠️ **Filter Bar** - Filter by Staff/Service/Status
5. ⚠️ **Search** - Tìm kiếm lịch hẹn
6. ⚠️ **Status Badges** - Visual indicators cho trạng thái

---

## Câu Chuyện Người Dùng (User Stories)

### US-2.2: Lễ tân tạo lịch nhanh cho khách vãng lai
> Là một **Lễ tân**, tôi muốn **tạo nhanh lịch hẹn cho khách vãng lai** mà **không cần nhập đầy đủ thông tin**.

**Tiêu chí chấp nhận:**
- [ ] Có button "Walk-in" riêng biệt
- [ ] Dialog đơn giản: Tên + SĐT + Dịch vụ + KTV
- [ ] Tự động chọn thời gian = NOW
- [ ] Validate SĐT format Việt Nam

### US-2.3: Lễ tân check-in khách hàng
> Là một **Lễ tân**, tôi muốn **đánh dấu khách đã đến** để **cập nhật trạng thái lịch hẹn**.

**Tiêu chí chấp nhận:**
- [ ] Có button Check-in trên event card
- [ ] Chỉ hiện khi status = "confirmed" và thời gian gần đến
- [ ] Cập nhật status → "in_progress"
- [ ] Toast thông báo thành công

### US-2.5: Lễ tân hủy lịch với policy
> Là một **Lễ tân**, tôi muốn **hủy lịch hẹn với cảnh báo chính sách** để **tránh hủy sát giờ**.

**Tiêu chí chấp nhận:**
- [ ] Dialog xác nhận hủy
- [ ] Hiển thị policy: "Hủy trước 2 giờ miễn phí"
- [ ] Cảnh báo nếu hủy sát giờ
- [ ] Cho phép nhập lý do hủy

### US-2.6: Admin lọc lịch hẹn
> Là một **Admin**, tôi muốn **lọc lịch hẹn theo KTV/Dịch vụ/Trạng thái** để **dễ quản lý**.

**Tiêu chí chấp nhận:**
- [ ] Filter bar với multi-select
- [ ] Lọc theo: Staff, Service, Status
- [ ] URL sync với filter params
- [ ] Clear all filters button

---

## Tiêu Chí Thành Công

| Metric | Mục tiêu | Cách đo |
|--------|----------|---------|
| Tính năng hoàn thiện | 100% US | Checklist pass |
| UI Consistency | 100% | So sánh với Services/Staff |
| Lint/Type Clean | 0 errors | `pnpm lint && pnpm type-check` |
| Loading States | Đầy đủ | Skeleton cho mọi async action |

---

## Ràng Buộc

- Giữ nguyên cấu trúc component hiện có
- Sử dụng Mock data (Backend sẽ làm riêng)
- Tuân thủ Design System (tokens, không hardcode colors)
- Tiếng Việt cho tất cả UI text
