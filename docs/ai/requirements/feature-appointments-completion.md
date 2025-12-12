---
phase: requirements
title: Hoàn Thiện Module Appointments
description: Yêu cầu chi tiết cho việc xây dựng module Appointments từ placeholder thành production-ready
version: 1.0
created_at: 2025-12-12
status: APPROVED
priority: P0-CRITICAL
estimated_effort: 12 days
---

# 📋 Yêu Cầu: Hoàn Thiện Module Appointments

## 1. Tuyên Bố Vấn Đề

### 1.1. Bối cảnh
Module **Appointments** (Lịch hẹn) là **nghiệp vụ cốt lõi** của hệ thống CRM Spa Synapse, nhưng hiện tại:
- Chỉ có ~5% implementation (placeholder)
- Data fetching sử dụng anti-pattern (useEffect waterfall)
- `createAppointment` không persist data
- Thiếu các workflows nghiệp vụ quan trọng

### 1.2. Gap Analysis với Thiết Kế

| Sequence Diagram | Mô tả | Trạng thái |
|:---|:---|:---:|
| 3.31 | Dashboard Lễ tân với Calendar | ❌ Placeholder |
| 3.34 | Walk-in Booking | ❌ Không có |
| 3.35 | Check-in Action | ❌ Không có |
| 3.25 | Hủy lịch hẹn | ❌ Không có |

---

## 2. Mục Tiêu

### 2.1. Mục Tiêu Chính
- ✅ Calendar View hoạt động đầy đủ (Day/Week/Month/Agenda)
- ✅ CRUD Appointments hoàn chỉnh
- ✅ Walk-in Booking cho Lễ tân
- ✅ Check-in/No-show Actions
- ✅ Cancel Booking với Policy

### 2.2. Phi Mục Tiêu
- ❌ Real-time sync (WebSocket) - Phase sau
- ❌ Recurring appointments - Phase sau
- ❌ Drag-drop reschedule - Phase sau
- ❌ Integration với Payment - Phase sau

---

## 3. User Stories

### Epic: Appointments Calendar

#### US-A1: Xem Lịch Hẹn
**Như một** Lễ tân/Admin
**Tôi muốn** xem lịch hẹn theo ngày/tuần/tháng
**Để** tôi có thể quản lý slot và phân bổ nhân viên

**Acceptance Criteria:**
- [ ] AC-A1.1: Calendar hiển thị tất cả appointments trong khoảng thời gian
- [ ] AC-A1.2: Có thể chuyển đổi view (Day/Week/Month/Agenda)
- [ ] AC-A1.3: Events màu sắc theo service hoặc status
- [ ] AC-A1.4: Click vào event → mở detail sheet
- [ ] AC-A1.5: Navigation prev/next/today hoạt động

#### US-A2: Tạo Lịch Hẹn
**Như một** Lễ tân
**Tôi muốn** tạo lịch hẹn cho khách hàng
**Để** khách có lịch cố định và KTV được phân công

**Acceptance Criteria:**
- [ ] AC-A2.1: Form chọn khách hàng (search existing hoặc tạo mới)
- [ ] AC-A2.2: Form chọn dịch vụ (multi-select)
- [ ] AC-A2.3: Form chọn KTV (filter theo skill yêu cầu của service)
- [ ] AC-A2.4: Form chọn ngày giờ (DatePicker + TimePicker)
- [ ] AC-A2.5: **Kiểm tra xung đột bao gồm cả buffer_time của service**
- [ ] AC-A2.6: **Auto-allocate hoặc manual chọn Resource (Phòng/Thiết bị)**
- [ ] AC-A2.7: Toast thông báo thành công/thất bại
- [ ] AC-A2.8: Calendar refresh sau khi tạo
- [ ] AC-A2.9: **Duration hiển thị = service.duration + service.buffer_time**

#### US-A3: Walk-in Booking (Khách vãng lai)
**Như một** Lễ tân
**Tôi muốn** tạo nhanh lịch cho khách đến không hẹn trước
**Để** tiết kiệm thời gian và khách không phải chờ

**Acceptance Criteria:**
- [ ] AC-A3.1: Quick form với ít field nhất có thể
- [ ] AC-A3.2: Thời gian mặc định = now
- [ ] AC-A3.3: Có thể tạo khách hàng mới inline (chỉ cần phone + name)
- [ ] AC-A3.4: Status mặc định = "in_progress"
- [ ] AC-A3.5: Button "Tạo nhanh" nổi bật trên toolbar

---

### Epic: Appointments Actions

#### US-A4: Check-in Khách
**Như một** Lễ tân
**Tôi muốn** check-in khách khi họ đến
**Để** KTV biết khách đã sẵn sàng

**Acceptance Criteria:**
- [ ] AC-A4.1: Button "Check-in" visible khi status = "confirmed"
- [ ] AC-A4.2: Click → chuyển status thành "in_progress"
- [ ] AC-A4.3: Ghi lại check_in_time
- [ ] AC-A4.4: Toast thông báo
- [ ] AC-A4.5: UI update real-time (không cần refresh)

#### US-A5: Đánh dấu No-show
**Như một** Lễ tân
**Tôi muốn** đánh dấu khách không đến
**Để** giải phóng slot và track no-show rate

**Acceptance Criteria:**
- [ ] AC-A5.1: Button "Không đến" visible khi status = "confirmed" VÀ **thời gian đã qua >= 15 phút**
- [ ] AC-A5.2: Click → chuyển status thành "no_show"
- [ ] AC-A5.3: Confirmation dialog trước khi mark với warning
- [ ] AC-A5.4: Toast thông báo
- [ ] AC-A5.5: **Ghi lại timestamp để tính no-show rate**

#### US-A6: Hủy Lịch Hẹn
**Như một** Lễ tân hoặc Khách hàng
**Tôi muốn** hủy lịch hẹn với lý do
**Để** giải phóng slot cho khách khác

**Acceptance Criteria:**
- [ ] AC-A6.1: Button "Hủy" visible khi status NOT IN ("cancelled", "completed", "no_show")
- [ ] AC-A6.2: Dialog yêu cầu nhập lý do
- [ ] AC-A6.3: Warning nếu hủy trong vòng 2 giờ trước hẹn
- [ ] AC-A6.4: Lưu cancel_reason vào database
- [ ] AC-A6.5: Chuyển status thành "cancelled"

---

### Epic: Appointments Filtering

#### US-A7: Lọc và Tìm kiếm
**Như một** Lễ tân/Admin
**Tôi muốn** lọc lịch hẹn theo nhiều tiêu chí
**Để** tìm nhanh thông tin cần thiết

**Acceptance Criteria:**
- [ ] AC-A7.1: Filter theo KTV (multi-select)
- [ ] AC-A7.2: Filter theo dịch vụ (multi-select)
- [ ] AC-A7.3: Filter theo status (multi-select)
- [ ] AC-A7.4: Search theo tên/phone khách hàng
- [ ] AC-A7.5: Filters sync với URL params
- [ ] AC-A7.6: Clear all filters button

---

### Epic: Resource & Multi-Service

#### US-A8: Multi-Service Booking
**Như một** Lễ tân
**Tôi muốn** đặt nhiều dịch vụ trong một appointment
**Để** khách không phải book nhiều lần

**Acceptance Criteria:**
- [ ] AC-A8.1: Cho phép chọn nhiều services trong cùng booking
- [ ] AC-A8.2: Duration tự động tính = sum(duration) + sum(buffer_time) - buffer_time_cuối
- [ ] AC-A8.3: Các service được thực hiện liên tiếp (sequential timeline)
- [ ] AC-A8.4: Có thể assign khác KTV cho mỗi service (nếu skill khác)
- [ ] AC-A8.5: Hiển thị timeline preview trước khi confirm

#### US-A9: Resource Allocation
**Như một** Hệ thống
**Tôi muốn** tự động kiểm tra và phân bổ phòng/thiết bị
**Để** tránh double-booking resources

**Acceptance Criteria:**
- [ ] AC-A9.1: Đọc `service_resource_requirements` để biết service cần resource gì
- [ ] AC-A9.2: Check room availability (cùng slot, cùng room chưa ai dùng)
- [ ] AC-A9.3: Check equipment availability
- [ ] AC-A9.4: Warning nếu không có resource available
- [ ] AC-A9.5: Suggest alternative slots hoặc alternative resources
- [ ] AC-A9.6: Lưu resource_id vào booking_item

---

## 4. Tiêu Chí Thành Công

| Metric | Target | Cách đo |
|:---|:---|:---|
| Calendar Views Working | 4/4 | Manual testing |
| CRUD Operations | All pass | Unit tests |
| Conflict Detection | 100% accurate | Test cases |
| Mobile Responsive | Yes | Viewport testing |
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse |

---

## 5. UI/UX Requirements

### 5.1. Calendar View
- Grid-based layout cho Day/Week view
- Events có đủ thông tin: Khách, Dịch vụ, KTV, Thời gian
- Color coding theo status hoặc service
- Hover để xem quick info (popover)
- Click để xem full details (sheet)

### 5.2. Appointment Form
- Multi-step wizard HOẶC single form với sections
- Real-time validation
- Conflict warning trước khi submit
- Loading state khi submit

### 5.3. Quick Actions
- Check-in: Button màu xanh lá
- No-show: Button màu xám
- Cancel: Button màu đỏ (destructive)
- Tất cả có confirmation dialog

---

## 6. Data Requirements

### 6.1. Appointment Entity (theo database_design.md)
```typescript
interface Appointment {
  id: string;
  customer_id: string;
  staff_id: string;
  service_id: string;
  resource_id?: string;
  start_time: Date;
  end_time: Date;
  duration: number;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
  notes?: string;
  internal_notes?: string;
  cancel_reason?: string;
  check_in_time?: Date;
  created_at: Date;
  updated_at: Date;
  created_by: string;
}
```

### 6.2. Calendar Event (UI representation)
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  status: AppointmentStatus;
  staffId: string;
  staffName: string;
  resourceId?: string;
  appointment: Appointment; // Full data
}
```

---

## 7. Dependencies

### 7.1. Internal Dependencies
- `@/features/customers` - Customer selection
- `@/features/services` - Service selection
- `@/features/staff` - Staff selection
- `@/features/resources` - Room selection
- `@/shared/ui` - Date/TimePickers, Sheets, Dialogs

### 7.2. External Dependencies
- date-fns - Date manipulation
- Zod - Validation

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|:---|:---:|:---:|:---|
| Conflict detection edge cases | High | High | Comprehensive test suite |
| Calendar performance với nhiều events | Medium | Medium | Virtualization, pagination |
| Time zone issues | Medium | High | Sử dụng UTC internally |
| Mobile UX khó dùng | Medium | Medium | Responsive design từ đầu |

---

## 9. Open Questions

| # | Câu hỏi | Trả lời | Người quyết định |
|:---|:---|:---|:---|
| Q1 | Conflict check có tính buffer_time không? | Có | Product |
| Q2 | No-show sau bao lâu? | 15 phút | Product |
| Q3 | Khách có quyền hủy bao lâu trước? | 2 giờ | Product |
| Q4 | Có gửi notification khi status change? | Phase sau | Product |

