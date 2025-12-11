---
phase: planning
title: Kế hoạch Triển khai Giao diện Quản lý Lịch hẹn
description: Phân rã nhiệm vụ chi tiết, ước tính nỗ lực và lộ trình triển khai
feature: appointment-management-ui
status: draft
created: 2024-12-11
total_effort: 10-12 ngày
---

# Kế hoạch Triển khai: Giao diện Quản lý Lịch hẹn

## 📋 Tổng quan

**Phạm vi**: Xây dựng hoàn chỉnh module quản lý lịch hẹn cho Admin Panel
**Ước tính tổng**: 10-12 ngày làm việc
**Độ ưu tiên**: Cao (Core feature)

---

## 🎯 Các Mốc quan trọng (Milestones)

- [x] **M0**: Requirements & Design Documentation ✅
- [x] **M1**: Foundation - Types, Schemas, Mock Data, Basic Layout ✅ (2024-12-11)
- [ ] **M2**: Calendar Views - Day, Week, Month, Agenda (3 ngày)
- [ ] **M3**: Resource Timeline - Staff/Room Timeline (2 ngày)
- [ ] **M4**: Drag & Drop - Move, Resize, Create by drag (2 ngày)
- [ ] **M5**: Forms & Sheets - CRUD, Recurrence, Conflict (2 ngày)
- [ ] **M6**: Polish - Dashboard, Filters, Mobile, Testing (1-2 ngày)

---

## 📝 Phân rã Nhiệm vụ Chi tiết

### 🏗️ Giai đoạn 1: Nền tảng (Foundation)
**Ước tính: 2 ngày**

#### Task 1.1: Cấu trúc Module & Types
**Effort**: 0.5 ngày | **Priority**: P0

- [x] Tạo cấu trúc thư mục theo design doc ✅
- [x] Tạo `types.ts` với interfaces: `Appointment`, `CalendarEvent`, `TimelineResource`, `CalendarViewConfig`, `RecurrenceConfig`, `ConflictInfo`, `AppointmentFilters` ✅
- [x] Tạo `constants.ts`: ✅
  - Status colors mapping
  - View configuration defaults
  - Time slot intervals
  - Vietnamese status labels

**Files cần tạo:**
```
features/appointments/
├── index.ts
├── types.ts
├── constants.ts
```

#### Task 1.2: Schemas & Validation
**Effort**: 0.25 ngày | **Priority**: P0

- [x] Tạo `schemas.ts` với Zod schemas: ✅
  - `appointmentFormSchema` (tạo/sửa)
  - `appointmentFilterSchema`
  - `recurrenceSchema`

**Files cần tạo:**
```
features/appointments/
├── schemas.ts
```

#### Task 1.3: Mock Data
**Effort**: 0.25 ngày | **Priority**: P1

- [x] Tạo `mock-data.ts`: ✅
  - 23 appointments mẫu (đa dạng status, thời gian)
  - 5 Staff (KTV)
  - 5 Rooms
  - 8 Services

**Files cần tạo:**
```
features/appointments/
├── mock-data.ts
```

#### Task 1.4: Server Actions
**Effort**: 0.5 ngày | **Priority**: P0

- [x] Tạo `actions.ts` với Server Actions (Mock): ✅
  - `getAppointments(dateRange, filters)` - Fetch appointments
  - `getAppointmentById(id)` - Fetch single
  - `createAppointment(data)` - Create
  - `updateAppointment(id, data)` - Update
  - `deleteAppointment(id)` - Delete
  - `checkConflicts(staffId, timeRange)` - Conflict check
  - `getAppointmentMetrics(date)` - Dashboard metrics

**Files cần tạo:**
```
features/appointments/
├── actions.ts
```

#### Task 1.5: Basic Layout & Page Container
**Effort**: 0.5 ngày | **Priority**: P0

- [x] Cập nhật `appointments-page.tsx` với layout chuẩn: ✅
  - Header với title
  - Metrics Cards (4 cards)
  - Toolbar với ViewSwitcher
  - Placeholder cho Calendar Area
- [x] Ensure responsive grid layout ✅

**Files cần sửa:**
```
features/appointments/components/
├── appointments-page.tsx
```

---

### 📅 Giai đoạn 2: Calendar Views
**Ước tính: 3 ngày**

#### Task 2.1: Calendar State Hook
**Effort**: 0.5 ngày | **Priority**: P0

- [ ] Tạo `use-calendar-state.ts`:
  - State: `currentView`, `currentDate`, `zoomLevel`, `densityMode`
  - Actions: `setView`, `goToDate`, `goToToday`, `goNextPeriod`, `goPrevPeriod`
  - Derived: `dateRange` (computed from view + date)

**Files cần tạo:**
```
features/appointments/hooks/
├── index.ts
├── use-calendar-state.ts
```

#### Task 2.2: Date Navigator & View Switcher
**Effort**: 0.5 ngày | **Priority**: P0

- [ ] Tạo `toolbar/view-switcher.tsx`:
  - Tabs/ToggleGroup: Ngày | Tuần | Tháng | Danh sách | Timeline
  - Icons cho mỗi view
- [ ] Tạo `toolbar/date-navigator.tsx`:
  - Nút Previous/Next (ChevronLeft/Right)
  - Nút "Hôm nay"
  - Hiển thị: "Tháng 12, 2024" hoặc "Tuần 50, 2024"
  - DatePicker trigger

**Files cần tạo:**
```
features/appointments/components/toolbar/
├── index.ts
├── view-switcher.tsx
├── date-navigator.tsx
```

#### Task 2.3: Time Grid Component (Shared)
**Effort**: 0.5 ngày | **Priority**: P0

- [ ] Tạo `calendar/time-grid.tsx`:
  - Cột giờ bên trái (08:00, 09:00, ...)
  - Chia theo interval (15min/30min/60min)
  - Đường kẻ ngang cho mỗi giờ
  - Current time indicator (đường đỏ)
  - Props: `startHour`, `endHour`, `interval`

**Files cần tạo:**
```
features/appointments/components/calendar/
├── index.ts
├── time-grid.tsx
```

#### Task 2.4: Day View
**Effort**: 0.5 ngày | **Priority**: P0

- [ ] Tạo `calendar/day-view.tsx`:
  - Single column với TimeGrid
  - Event positioning dựa trên time
  - Overlapping events side-by-side
  - Click empty slot → Create event trigger

**Files cần tạo:**
```
features/appointments/components/calendar/
├── day-view.tsx
```

#### Task 2.5: Week View
**Effort**: 0.5 ngày | **Priority**: P0

- [ ] Tạo `calendar/week-view.tsx`:
  - 7 columns (T2-CN hoặc CN-T7)
  - Header row với ngày
  - Highlight "Hôm nay"
  - TimeGrid shared
  - Horizontal scroll nếu cần

**Files cần tạo:**
```
features/appointments/components/calendar/
├── week-view.tsx
├── date-header.tsx
```

#### Task 2.6: Month View
**Effort**: 0.5 ngày | **Priority**: P1

- [ ] Tạo `calendar/month-view.tsx`:
  - Grid 7 columns × 5-6 rows
  - Mỗi ô hiển thị tối đa 2-3 events
  - "+X more" link → Popover với full list
  - Ngày ngoài tháng (prev/next) mờ

**Files cần tạo:**
```
features/appointments/components/calendar/
├── month-view.tsx
```

#### Task 2.7: Agenda View
**Effort**: 0.5 ngày | **Priority**: P1

- [ ] Tạo `calendar/agenda-view.tsx`:
  - List view theo ngày
  - Sticky date headers
  - Swipe actions (mobile)
  - Empty states cho ngày rỗng

**Files cần tạo:**
```
features/appointments/components/calendar/
├── agenda-view.tsx
```

#### Task 2.8: Calendar View Router
**Effort**: 0.25 ngày | **Priority**: P0

- [ ] Tạo `calendar/calendar-view.tsx`:
  - Switch giữa các views dựa trên `currentView`
  - AnimatePresence cho transitions
  - Pass props đúng cho mỗi view

**Files cần tạo:**
```
features/appointments/components/calendar/
├── calendar-view.tsx
```

---

### 🕐 Giai đoạn 3: Resource Timeline
**Ước tính: 2 ngày**

#### Task 3.1: Timeline Layout
**Effort**: 0.5 ngày | **Priority**: P1

- [ ] Tạo `timeline/resource-timeline.tsx`:
  - Sticky left column (tên resources)
  - Sticky top header (thước thời gian)
  - Scrollable content area
  - Zoom controls integration

**Files cần tạo:**
```
features/appointments/components/timeline/
├── index.ts
├── resource-timeline.tsx
├── timeline-header.tsx
```

#### Task 3.2: Timeline Row
**Effort**: 0.5 ngày | **Priority**: P1

- [ ] Tạo `timeline/timeline-row.tsx`:
  - Single row cho mỗi resource
  - Events positioned horizontally
  - Gap visualization
  - Overlap handling

**Files cần tạo:**
```
features/appointments/components/timeline/
├── timeline-row.tsx
```

#### Task 3.3: Zoom Control
**Effort**: 0.25 ngày | **Priority**: P2

- [ ] Tạo `toolbar/zoom-control.tsx`:
  - Slider hoặc buttons: 15m | 30m | 1h | 4h
  - Keyboard shortcuts (+/-)

**Files cần tạo:**
```
features/appointments/components/toolbar/
├── zoom-control.tsx
```

#### Task 3.4: Timeline Integration
**Effort**: 0.25 ngày | **Priority**: P1

- [ ] Tích hợp timeline vào CalendarView router
- [ ] Thêm view option "Timeline" vào ViewSwitcher
- [ ] Resource type selector (Staff/Room) trong FilterBar

---

### 🖱️ Giai đoạn 4: Drag & Drop
**Ước tính: 2 ngày**

#### Task 4.1: DnD Context Setup
**Effort**: 0.5 ngày | **Priority**: P0

- [ ] Tạo `dnd/calendar-dnd-context.tsx`:
  - @dnd-kit DndContext wrapper
  - Sensors configuration (keyboard + pointer)
  - Collision detection
  - Modifiers (grid snapping)

**Files cần tạo:**
```
features/appointments/components/dnd/
├── index.ts
├── calendar-dnd-context.tsx
```

#### Task 4.2: Draggable Event Card
**Effort**: 0.5 ngày | **Priority**: P0

- [ ] Tạo `event/event-card.tsx`:
  - useDraggable integration
  - Visual states: default, hover, dragging, conflict
  - Content: time, title, staff, status icon
  - Color coding theo service

**Files cần tạo:**
```
features/appointments/components/event/
├── index.ts
├── event-card.tsx
```

#### Task 4.3: Drag Overlay
**Effort**: 0.25 ngày | **Priority**: P0

- [ ] Tạo `dnd/drag-overlay.tsx`:
  - DragOverlay component từ @dnd-kit
  - Ghost effect (original position, 30% opacity)
  - Elevated card (shadow, scale)
  - Time tooltip khi kéo

**Files cần tạo:**
```
features/appointments/components/dnd/
├── drag-overlay.tsx
```

#### Task 4.4: Drop Zones & Highlighting
**Effort**: 0.25 ngày | **Priority**: P0

- [ ] Tạo `dnd/drop-zone.tsx`:
  - useDroppable integration
  - Highlight valid drop zones
  - Restricted zones (past, break time)
  - Visual feedback (border, background)

**Files cần tạo:**
```
features/appointments/components/dnd/
├── drop-zone.tsx
```

#### Task 4.5: useDnD Hook
**Effort**: 0.5 ngày | **Priority**: P0

- [ ] Tạo `hooks/use-calendar-dnd.ts`:
  - Handle onDragStart, onDragEnd, onDragOver
  - Calculate new time from drop position
  - Optimistic update
  - Rollback on error
  - Conflict validation

**Files cần tạo:**
```
features/appointments/hooks/
├── use-calendar-dnd.ts
```

#### Task 4.6: Resize Handles (Stretch goal)
**Effort**: 0.5 ngày | **Priority**: P2

- [ ] Tạo `event/resize-handles.tsx`:
  - Top/bottom handles cho resize
  - Drag to resize logic
  - Minimum duration constraint

**Files cần tạo:**
```
features/appointments/components/event/
├── resize-handles.tsx
```

---

### 📋 Giai đoạn 5: Forms & Sheets
**Ước tính: 2 ngày**

#### Task 5.1: Event Popover
**Effort**: 0.25 ngày | **Priority**: P0

- [ ] Tạo `event/event-popover.tsx`:
  - HoverCard trigger trên EventCard
  - Quick info: Khách, SĐT, Dịch vụ, KTV
  - Quick actions: Xem, Sửa, Check-in, Hủy

**Files cần tạo:**
```
features/appointments/components/event/
├── event-popover.tsx
```

#### Task 5.2: Appointment Sheet
**Effort**: 0.5 ngày | **Priority**: P0

- [ ] Tạo `sheet/appointment-sheet.tsx`:
  - Sheet (Drawer) từ phải
  - View mode: Chi tiết đầy đủ
  - Edit mode: Form
  - Header với Close button
  - Footer với action buttons

**Files cần tạo:**
```
features/appointments/components/sheet/
├── index.ts
├── appointment-sheet.tsx
```

#### Task 5.3: Appointment Form
**Effort**: 0.5 ngày | **Priority**: P0

- [ ] Tạo `sheet/appointment-form.tsx`:
  - Combobox Khách hàng (searchable)
  - Multi-select Dịch vụ (auto-calculate duration)
  - Select KTV (filtered by skills)
  - Select Phòng/Giường
  - DatePicker + TimePicker
  - Textarea Ghi chú
  - Zod validation
  - useActionState for submission

**Files cần tạo:**
```
features/appointments/components/sheet/
├── appointment-form.tsx
```

#### Task 5.4: Recurrence Builder
**Effort**: 0.5 ngày | **Priority**: P2

- [ ] Tạo `sheet/recurrence-builder.tsx`:
  - Frequency selector
  - Interval input
  - Day checkboxes (T2-CN)
  - End condition radio group
  - Natural language preview

**Files cần tạo:**
```
features/appointments/components/sheet/
├── recurrence-builder.tsx
```

#### Task 5.5: Conflict Detection Hook
**Effort**: 0.25 ngày | **Priority**: P0

- [ ] Tạo `hooks/use-conflict-detection.ts`:
  - Real-time validation
  - Check overlap với existing events
  - Return conflict info for UI display

**Files cần tạo:**
```
features/appointments/hooks/
├── use-conflict-detection.ts
```

#### Task 5.6: Conflict Warning UI
**Effort**: 0.25 ngày | **Priority**: P0

- [ ] Tạo `sheet/conflict-warning.tsx`:
  - Inline warning trong form
  - Alert component với severity
  - Option to override (cho Admin)

**Files cần tạo:**
```
features/appointments/components/sheet/
├── conflict-warning.tsx
```

---

### ✨ Giai đoạn 6: Polish & Integration
**Ước tính: 1-2 ngày**

#### Task 6.1: Metrics Cards
**Effort**: 0.5 ngày | **Priority**: P1

- [ ] Tạo `dashboard/metrics-cards.tsx`:
  - 4 cards: Hôm nay, Chờ xác nhận, Tỷ lệ lấp đầy, Doanh thu
  - Number animation
  - Status colors
  - Trend indicators (optional)

**Files cần tạo:**
```
features/appointments/components/dashboard/
├── index.ts
├── metrics-cards.tsx
```

#### Task 6.2: Filter Bar
**Effort**: 0.5 ngày | **Priority**: P1

- [ ] Tạo `toolbar/filter-bar.tsx`:
  - Multi-select: KTV
  - Select: Dịch vụ
  - Multi-select: Trạng thái
  - Search input
  - Applied filters chips
  - Clear all button

**Files cần tạo:**
```
features/appointments/components/toolbar/
├── filter-bar.tsx
```

#### Task 6.3: Empty States
**Effort**: 0.25 ngày | **Priority**: P1

- [ ] Tạo empty state cho:
  - Ngày không có lịch hẹn
  - Filter không có kết quả
  - Tải dữ liệu thất bại

#### Task 6.4: Mobile Optimization
**Effort**: 0.5 ngày | **Priority**: P1

- [ ] Agenda view as default on mobile
- [ ] Bottom sheet thay vì side panel
- [ ] Touch gestures (swipe to navigate)
- [ ] Responsive toolbar (collapsed filters)

#### Task 6.5: Keyboard Navigation
**Effort**: 0.25 ngày | **Priority**: P2

- [ ] Arrow keys để navigate giữa events
- [ ] Enter để mở chi tiết
- [ ] Escape để đóng sheet
- [ ] Tab navigation

#### Task 6.6: Final Integration & Testing
**Effort**: 0.5 ngày | **Priority**: P0

- [ ] Export tất cả components qua index.ts
- [ ] Tích hợp hoàn chỉnh vào appointments-page.tsx
- [ ] Smoke test tất cả user flows
- [ ] Fix lint errors
- [ ] Verify build success

---

## 📊 Các Phụ thuộc

### Phụ thuộc nội bộ (Internal)
| Task | Phụ thuộc vào |
|------|---------------|
| Task 2.x (Views) | Task 1.x (Foundation) |
| Task 3.x (Timeline) | Task 2.1, 2.2, 2.3 |
| Task 4.x (DnD) | Task 2.4, 2.5, EventCard |
| Task 5.x (Forms) | Task 1.2 (Schemas), Task 1.4 (Actions) |
| Task 6.x (Polish) | Tất cả tasks trước |

### Phụ thuộc bên ngoài (External)
| Phụ thuộc | Module | Loại | Trạng thái |
|-----------|--------|------|------------|
| Staff data | `features/staff` | Read | ✅ Có sẵn |
| Service data | `features/services` | Read | ✅ Có sẵn |
| Resource data | `features/resources` | Read | ✅ Có sẵn |
| Customer data | `features/customers` | Read | ✅ Có sẵn |
| Operating hours | `features/settings` | Read | ✅ Có sẵn |
| Backend API | FastAPI | Read/Write | ⏳ Cần phát triển |

---

## ⏱️ Lịch trình Đề xuất

| Ngày | Giai đoạn | Tasks |
|------|-----------|-------|
| D1 | Foundation | 1.1, 1.2, 1.3, 1.4 |
| D2 | Foundation + Views | 1.5, 2.1, 2.2 |
| D3 | Views | 2.3, 2.4, 2.5 |
| D4 | Views | 2.6, 2.7, 2.8 |
| D5 | Timeline | 3.1, 3.2, 3.3 |
| D6 | Timeline + DnD | 3.4, 4.1, 4.2 |
| D7 | DnD | 4.3, 4.4, 4.5 |
| D8 | Forms | 5.1, 5.2, 5.3 |
| D9 | Forms | 5.4, 5.5, 5.6 |
| D10 | Polish | 6.1, 6.2, 6.3 |
| D11-12 | Polish + Buffer | 6.4, 6.5, 6.6 + Bug fixes |

---

## ⚠️ Rủi ro & Giảm thiểu

### Rủi ro Kỹ thuật
| Rủi ro | Xác suất | Tác động | Giảm thiểu |
|--------|----------|----------|------------|
| @dnd-kit performance với nhiều events | Trung bình | Cao | Virtualization, memo optimization |
| Conflict detection complexity | Thấp | Trung bình | Algorithm rõ ràng, unit tests |
| Recurrence (RRULE) edge cases | Trung bình | Thấp | Sử dụng library rrule.js nếu cần |

### Rủi ro Resource
| Rủi ro | Xác suất | Tác động | Giảm thiểu |
|--------|----------|----------|------------|
| Backend API chưa sẵn sàng | Cao | Cao | Mock data, define API contract trước |
| Design iterations | Trung bình | Trung bình | Rapid prototyping, early feedback |

---

## 📦 Deliverables

### Code Deliverables
1. Module hoàn chỉnh `features/appointments`
2. Types, Schemas đầy đủ
3. Server Actions cho CRUD
4. 5 Calendar views (Day, Week, Month, Agenda, Timeline)
5. Drag & Drop với visual feedback
6. Form với validation và conflict detection
7. Dashboard với metrics
8. Responsive design (Mobile/Tablet/Desktop)

### Documentation Deliverables
1. Requirements doc ✅
2. Design doc ✅
3. Planning doc ✅ (this file)
4. Implementation notes (during development)
5. Testing doc (after implementation)

---

## 🚀 Bước Tiếp Theo

1. **Review tài liệu** - Đọc lại 3 docs (Requirements, Design, Planning)
2. **Clarify Questions** - Xác nhận các câu hỏi mở (Calendar library choice)
3. **Begin M1** - Bắt đầu Giai đoạn 1 với Task 1.1

---

**Sẵn sàng triển khai? Chạy `/execute-plan` để bắt đầu!**
