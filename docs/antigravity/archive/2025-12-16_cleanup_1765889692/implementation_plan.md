# Kế hoạch Triển khai: Thiết Kế Lại Staff Scheduling (Version 2.0)

**Ngày tạo**: 2025-12-16
**Trạng thái**: 🟡 ĐANG CHỜ DUYỆT
**Tham khảo**: Giao diện `features/appointments` (Calendar pattern)

---

## 1. Yêu Cầu Nghiệp Vụ (Requirements)

### 1.1. Khu vực điều hướng
- ✅ Bộ chọn **Tuần/Tháng** (view switcher)
- ✅ **Date Navigator**: Trước | Hôm nay | Sau + DatePicker
- ✅ Bộ lọc theo **Nhân viên** (multi-select)
- ✅ Bộ lọc theo **Vai trò** (admin/receptionist/technician)

### 1.2. Dữ liệu nền
- ✅ Danh sách **Ca làm việc** (Master Data)
- ✅ Danh sách **Nhân viên** (từ API/Mock)
- ✅ Phân biệt **DRAFT** vs **PUBLISHED**

### 1.3. Khu vực hiển thị chính
- ✅ **Week View**: Grid ma trận (Hàng = Nhân viên, Cột = Ngày)
- ✅ **Month View**: Grid tháng tổng quan (mỗi ô hiển thị tổng số ca)
- ✅ Mỗi ô hiển thị: Ca + Trạng thái (DRAFT có viền nét đứt)
- ✅ Hỗ trợ **nhiều ca/ngày** cho 1 nhân viên

### 1.4. Chỉnh sửa lịch
- ✅ Click ô trống → **Sheet chọn ca**
- ✅ Click ca → **Sheet chi tiết** (xem/xóa/đổi trạng thái)
- ✅ Tùy chọn trạng thái: **DRAFT** ↔ **PUBLISHED**

### 1.5. Thao tác hàng loạt
- ✅ **Chọn nhiều ô** (Selection Mode)
- ✅ **Áp dụng ca cho nhiều ô** cùng lúc
- ✅ **Công bố lịch hàng loạt** (DRAFT → PUBLISHED)

### 1.6. Ràng buộc hiển thị
- ✅ Phân biệt **DRAFT** (opacity thấp, viền nét đứt) vs **PUBLISHED**
- ⚠️ Cảnh báo khi lịch liên quan đến booking (future)
- ⚠️ Trạng thái khóa chỉnh sửa (future)

### 1.7. Thông tin hỗ trợ
- ✅ **Legend** (Chú giải màu ca làm việc)
- ✅ **Toast notifications** (thành công/lỗi)

---

## 2. Kiến Trúc Tham Khảo (Appointments Pattern)

```
appointments/
├── components/
│   ├── appointments-page.tsx       # Main page orchestrator
│   ├── toolbar/
│   │   ├── view-switcher.tsx       # Tabs: Day|Week|Month|...
│   │   ├── date-navigator.tsx      # [<] [Today] [>] + DatePicker
│   │   ├── filter-bar.tsx          # Staff/Status filters
│   │   └── index.ts
│   ├── calendar/
│   │   ├── week-view.tsx           # Grid tuần
│   │   ├── month-view.tsx          # Grid tháng
│   │   └── ...
│   ├── sheet/
│   │   ├── appointment-sheet.tsx   # Create/Edit sheet
│   │   └── ...
│   └── selection/
│       └── ...                     # Selection mode
├── hooks/
│   ├── use-calendar-navigation.ts
│   └── ...
├── types.ts
└── constants.ts
```

---

## 3. Cấu Trúc Mới Cho Staff Scheduling

```
features/staff/
├── components/
│   ├── scheduling/
│   │   ├── index.ts                        # Public exports
│   │   ├── staff-scheduling-page.tsx       # Main orchestrator
│   │   │
│   │   ├── toolbar/
│   │   │   ├── index.ts
│   │   │   ├── view-switcher.tsx           # Tabs: Tuần | Tháng
│   │   │   ├── date-navigator.tsx          # [<] [Hôm nay] [>]
│   │   │   ├── staff-filter.tsx            # Multi-select nhân viên
│   │   │   └── action-bar.tsx              # Buttons: Quản lý ca, Công bố
│   │   │
│   │   ├── calendar/
│   │   │   ├── index.ts
│   │   │   ├── week-view.tsx               # Grid tuần (Staff × Days)
│   │   │   ├── month-view.tsx              # Grid tháng tổng quan
│   │   │   ├── schedule-cell.tsx           # Ô đơn lẻ (hiển thị ca)
│   │   │   └── shift-chip.tsx              # Component hiển thị 1 ca
│   │   │
│   │   ├── sheets/
│   │   │   ├── index.ts
│   │   │   ├── add-schedule-sheet.tsx      # Thêm ca cho 1 slot
│   │   │   ├── schedule-detail-sheet.tsx   # Chi tiết + Edit + Delete
│   │   │   └── shift-manager-sheet.tsx     # CRUD Master Data ca
│   │   │
│   │   ├── selection/
│   │   │   ├── index.ts
│   │   │   ├── selection-toolbar.tsx       # Floating bar khi chọn nhiều
│   │   │   └── use-selection.ts            # Hook quản lý selection
│   │   │
│   │   └── legend/
│   │       └── shift-legend.tsx            # Chú giải màu
│   │
│   └── staff-page.tsx                      # (Existing) Tab container
│
├── hooks/
│   ├── use-schedule-navigation.ts          # Week/Month navigation
│   ├── use-schedule-filters.ts             # Filter state
│   └── use-schedules.ts                    # Data fetching + mutations
│
├── model/
│   ├── types.ts                            # Types
│   ├── constants.ts                        # View configs, labels
│   ├── shifts.ts                           # Mock shifts
│   └── schedules.ts                        # Mock schedules
│
└── actions.ts                              # Server actions
```

---

## 4. Types (Phù hợp DB Design 100%)

```typescript
// ============================================================================
// ENUMS & BASIC TYPES
// ============================================================================

export type ScheduleViewType = 'week' | 'month';
export type ScheduleStatus = 'DRAFT' | 'PUBLISHED';

// ============================================================================
// SHIFT (Master Data - DB: shifts)
// ============================================================================

export interface Shift {
  id: string;
  name: string;           // "Ca Sáng", "Ca Chiều"
  startTime: string;      // "08:00"
  endTime: string;        // "12:00"
  colorCode: string;      // "#D97706"
}

// ============================================================================
// SCHEDULE (Transaction - DB: staff_schedules)
// ============================================================================

export interface Schedule {
  id: string;
  staffId: string;        // FK → staff_profiles
  shiftId: string;        // FK → shifts
  workDate: string;       // "2025-12-16"
  status: ScheduleStatus;
}

export interface ScheduleWithShift extends Schedule {
  shift: Shift;
}

// ============================================================================
// UI TYPES
// ============================================================================

export interface ScheduleFilters {
  staffIds: string[];
  roles: Role[];
  status?: ScheduleStatus;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ScheduleCell {
  staffId: string;
  date: Date;
  schedules: ScheduleWithShift[];
}

// Selection Mode
export interface SelectedSlot {
  staffId: string;
  date: string;  // "yyyy-MM-dd"
}
```

---

## 5. Kế Hoạch Triển Khai Chi Tiết

### Phase 1: Foundation (Nền tảng) - 20 phút

| # | Task | File | Mô tả |
|:---:|:---|:---|:---|
| 1.1 | Tạo thư mục | - | Tạo cấu trúc thư mục mới |
| 1.2 | Types & Constants | `model/*.ts` | Cập nhật types, view configs, labels |
| 1.3 | Hook Navigation | `use-schedule-navigation.ts` | Week/Month nav, date range calculation |
| 1.4 | Hook Filters | `use-schedule-filters.ts` | Filter state management |
| 1.5 | Hook Data | `use-schedules.ts` | CRUD schedules (mock) |

### Phase 2: Toolbar (Thanh công cụ) - 15 phút

| # | Task | File | Mô tả |
|:---:|:---|:---|:---|
| 2.1 | View Switcher | `toolbar/view-switcher.tsx` | Tabs: Tuần \| Tháng |
| 2.2 | Date Navigator | `toolbar/date-navigator.tsx` | Prev/Today/Next + DatePicker |
| 2.3 | Staff Filter | `toolbar/staff-filter.tsx` | Multi-select nhân viên & vai trò |
| 2.4 | Action Bar | `toolbar/action-bar.tsx` | Buttons: Quản lý ca, Công bố |
| 2.5 | Toolbar Index | `toolbar/index.ts` | Exports |

### Phase 3: Calendar Views (Lịch) - 30 phút

| # | Task | File | Mô tả |
|:---:|:---|:---|:---|
| 3.1 | Shift Chip | `calendar/shift-chip.tsx` | Component hiển thị 1 ca |
| 3.2 | Schedule Cell | `calendar/schedule-cell.tsx` | Ô chứa nhiều ca |
| 3.3 | Week View | `calendar/week-view.tsx` | Grid Staff × Days |
| 3.4 | Month View | `calendar/month-view.tsx` | Grid tháng tổng quan |
| 3.5 | Calendar Index | `calendar/index.ts` | Exports |

### Phase 4: Sheets (Form) - 20 phút

| # | Task | File | Mô tả |
|:---:|:---|:---|:---|
| 4.1 | Add Schedule Sheet | `sheets/add-schedule-sheet.tsx` | Chọn ca cho slot |
| 4.2 | Detail Sheet | `sheets/schedule-detail-sheet.tsx` | View/Edit/Delete/Status |
| 4.3 | Shift Manager | `sheets/shift-manager-sheet.tsx` | CRUD Master Data |
| 4.4 | Sheets Index | `sheets/index.ts` | Exports |

### Phase 5: Selection Mode (Chọn nhiều) - 15 phút

| # | Task | File | Mô tả |
|:---:|:---|:---|:---|
| 5.1 | Use Selection | `selection/use-selection.ts` | Hook quản lý selection |
| 5.2 | Selection Toolbar | `selection/selection-toolbar.tsx` | Floating action bar |
| 5.3 | Selection Index | `selection/index.ts` | Exports |

### Phase 6: Integration (Tích hợp) - 15 phút

| # | Task | File | Mô tả |
|:---:|:---|:---|:---|
| 6.1 | Legend | `legend/shift-legend.tsx` | Chú giải màu |
| 6.2 | Main Page | `staff-scheduling-page.tsx` | Orchestrator |
| 6.3 | Staff Page | `staff-page.tsx` | Tích hợp vào Tab |
| 6.4 | Index | `scheduling/index.ts` | Public exports |

### Phase 7: Verify - 10 phút

| # | Task |
|:---:|:---|
| 7.1 | `pnpm lint` |
| 7.2 | `pnpm build` |
| 7.3 | Test UI trên browser |

---

## 6. Tổng Thời Gian Ước Tính

| Phase | Thời gian |
|:---|:---:|
| Phase 1: Foundation | 20 phút |
| Phase 2: Toolbar | 15 phút |
| Phase 3: Calendar Views | 30 phút |
| Phase 4: Sheets | 20 phút |
| Phase 5: Selection Mode | 15 phút |
| Phase 6: Integration | 15 phút |
| Phase 7: Verify | 10 phút |
| **Tổng** | **~125 phút (~2 giờ)** |

---

## 7. Wireframe UI

### 7.1. Week View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Tuần|Tháng]  [<] [Hôm nay] [>] 16/12 - 22/12/2025  [🎨 Legend]  [⚙️ Quản lý ca] [📢 Công bố] │
│ [Lọc: Tất cả ▾]  [Vai trò: Tất cả ▾]                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│              │    T2     │    T3     │    T4     │    T5     │    T6     │  │
│              │   16/12   │   17/12   │   18/12   │   19/12   │   20/12   │  │
├──────────────┼───────────┼───────────┼───────────┼───────────┼───────────┼──┤
│ 👤 Nguyễn A  │ ┌───────┐ │ ┌───────┐ │           │ ┌───────┐ │ ┌───────┐ │  │
│ KTV          │ │Ca Sáng│ │ │Ca Sáng│ │    ➕     │ │Ca Tối │ │ │Ca Sáng│ │  │
│              │ └───────┘ │ ├───────┤ │           │ └───────┘ │ └───────┘ │  │
│              │           │ │Ca Chiều│ │           │           │           │  │
│              │           │ └───────┘ │           │           │           │  │
├──────────────┼───────────┼───────────┼───────────┼───────────┼───────────┼──┤
│ 👤 Trần B    │ ┌·······┐ │           │ ┌───────┐ │ ┌───────┐ │           │  │
│ Lễ tân       │ │Ca Chiều│ │    ➕     │ │Ca Sáng│ │ │Ca Sáng│ │    ➕     │  │
│              │ │ DRAFT │ │           │ └───────┘ │ └───────┘ │           │  │
│              │ └·······┘ │           │           │           │           │  │
└──────────────┴───────────┴───────────┴───────────┴───────────┴───────────┴──┘
  Legend: ● Ca Sáng (8-12h)  ● Ca Chiều (13-17h)  ● Ca Tối (17-21h)
          [---] DRAFT (nháp)  [═══] PUBLISHED (đã công bố)
```

### 7.2. Month View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Tuần|Tháng]  [<] [Hôm nay] [>] Tháng 12, 2025                              │
├─────────────────────────────────────────────────────────────────────────────┤
│   T2     T3     T4     T5     T6     T7     CN                              │
├──────┬──────┬──────┬──────┬──────┬──────┬──────┤
│  1   │  2   │  3   │  4   │  5   │  6   │  7   │
│ ●3   │ ●5   │ ●4   │ ●2   │ ●6   │      │      │  ← Số ca trong ngày
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│  8   │  9   │  10  │  11  │  12  │  13  │  14  │
│ ●4   │ ●3   │ ●5   │ ●4   │ ●3   │      │      │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│ ...  │      │      │      │      │      │      │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┘
```

### 7.3. Selection Mode

```
╔══════════════════════════════════════════════════════════════════════════════╗
║ Đã chọn 5 ô  │ [Áp dụng Ca Sáng ▾] [Công bố tất cả] [Xóa tất cả] [✕ Hủy]    ║
╚══════════════════════════════════════════════════════════════════════════════╝

Grid với các ô được chọn có highlight ring-2 ring-primary
```

---

## 8. So sánh với Version 1.0

| Tiêu chí | Version 1.0 | Version 2.0 |
|:---|:---|:---|
| View modes | Week only | Week + Month |
| Filters | Không | Staff + Role |
| Selection Mode | Không | Có |
| Batch Actions | Không | Công bố / Áp dụng ca hàng loạt |
| Shift Manager | Không | Có (CRUD Master Data) |
| Legend | Không | Có |
| Số files | 7 | ~20 |
| LOC ước tính | ~350 | ~800-1000 |

---

## 9. Tiêu chí Hoàn thành (DoD)

- [ ] Week View hoạt động (hiển thị, thêm, xóa, sửa trạng thái)
- [ ] Month View hoạt động (hiển thị tổng quan)
- [ ] Date Navigator hoạt động (prev/next/today/datepicker)
- [ ] View Switcher hoạt động (Week ↔ Month)
- [ ] Staff Filter hoạt động (multi-select)
- [ ] Selection Mode hoạt động (chọn nhiều, batch actions)
- [ ] Shift Manager hoạt động (CRUD shifts)
- [ ] Legend hiển thị đúng
- [ ] Types phù hợp DB 100%
- [ ] `pnpm lint` pass
- [ ] `pnpm build` pass
