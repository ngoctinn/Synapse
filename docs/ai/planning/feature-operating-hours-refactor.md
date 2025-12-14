---
phase: planning
title: Kế Hoạch Xây Dựng Operating Hours UI
description: Phân rã nhiệm vụ chi tiết với lint/build verification sau mỗi bước
feature: operating-hours-ui
status: ready
created: 2025-12-14
estimated-time: 2-3 giờ
references:
  - docs/research/operating-hours-design.md (Database Schema)
  - docs/research/operating-hours-uxui.md (UX/UI Patterns)
---

# Kế Hoạch Xây Dựng Operating Hours UI

## Tài Liệu Tham Chiếu Bắt Buộc

> ⚠️ **QUAN TRỌNG:** Trước khi implement mỗi component, PHẢI đọc lại 2 tài liệu:
> 1. **Database Schema:** `docs/research/operating-hours-design.md`
> 2. **UX/UI Patterns:** `docs/research/operating-hours-uxui.md`

---

## Tổng Quan Quy Trình

```
Phase 1: Cleanup          → Xóa toàn bộ code cũ
Phase 2: Foundation       → Types, mocks, actions (tham chiếu DB schema)
Phase 3: Components       → Build UI (tham chiếu UX patterns)
Phase 4: Integration      → Kết nối vào settings-page
Phase 5: Verification     → Lint, Build, Test UI
```

---

## Phase 1: Cleanup

### Task 1.1: Xóa thư mục operating-hours cũ
**Thời gian:** 5 phút

```bash
cd frontend
rm -rf src/features/settings/operating-hours/
```

### Task 1.2: Tạm comment imports trong settings-page.tsx
**Thời gian:** 5 phút

Comment out các dòng import liên quan đến operating-hours để build không lỗi tạm thời.

### Task 1.3: Verification
```bash
cd frontend && pnpm lint
```
**Expected:** Có thể có warnings về unused variables (OK)

---

## Phase 2: Foundation

### 📖 Tham Chiếu: `docs/research/operating-hours-design.md` - Section 2.1, 4.2

### Task 2.1: Tạo cấu trúc thư mục
```bash
mkdir -p frontend/src/features/settings/operating-hours
```

### Task 2.2: Implement `types.ts`
**Thời gian:** 10 phút
**Tham chiếu:**
- Database schema: `regular_operating_hours`, `exception_dates`
- UX doc: Section 5 (Type Definitions)

```typescript
// Mapping trực tiếp từ database schema

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const DAY_LABELS: Record<DayOfWeek, string> = {
  1: "Thứ Hai",
  2: "Thứ Ba",
  3: "Thứ Tư",
  4: "Thứ Năm",
  5: "Thứ Sáu",
  6: "Thứ Bảy",
  7: "Chủ Nhật",
};

export interface TimeSlot {
  start: string; // "HH:mm" - maps to open_time
  end: string;   // "HH:mm" - maps to close_time
}

export interface DaySchedule {
  dayOfWeek: DayOfWeek; // maps to day_of_week
  label: string;
  isOpen: boolean;      // inverse of is_closed
  timeSlots: TimeSlot[]; // multiple periods (period_number)
}

export type ExceptionType = "HOLIDAY" | "MAINTENANCE" | "SPECIAL_HOURS" | "CUSTOM";

export interface ExceptionDate {
  id: string;
  date: Date;           // maps to exception_date
  type: ExceptionType;  // maps to exception_type
  reason: string;       // maps to reason
  isClosed: boolean;    // maps to is_closed
  openTime?: string;    // maps to open_time (when isClosed=false)
  closeTime?: string;   // maps to close_time (when isClosed=false)
}

export interface OperatingHoursConfig {
  weeklySchedule: DaySchedule[];
  exceptions: ExceptionDate[];
}
```

### Task 2.3: Implement `mocks.ts`
**Thời gian:** 10 phút

```typescript
import { DaySchedule, ExceptionDate, OperatingHoursConfig } from "./types";

// Mock data phản ánh cấu trúc database
export const MOCK_WEEKLY_SCHEDULE: DaySchedule[] = [
  { dayOfWeek: 1, label: "Thứ Hai", isOpen: true, timeSlots: [{ start: "08:00", end: "12:00" }, { start: "13:30", end: "21:00" }] },
  { dayOfWeek: 2, label: "Thứ Ba", isOpen: true, timeSlots: [{ start: "08:00", end: "21:00" }] },
  { dayOfWeek: 3, label: "Thứ Tư", isOpen: true, timeSlots: [{ start: "08:00", end: "21:00" }] },
  { dayOfWeek: 4, label: "Thứ Năm", isOpen: true, timeSlots: [{ start: "08:00", end: "21:00" }] },
  { dayOfWeek: 5, label: "Thứ Sáu", isOpen: true, timeSlots: [{ start: "08:00", end: "21:00" }] },
  { dayOfWeek: 6, label: "Thứ Bảy", isOpen: true, timeSlots: [{ start: "09:00", end: "18:00" }] },
  { dayOfWeek: 7, label: "Chủ Nhật", isOpen: false, timeSlots: [] },
];

export const MOCK_EXCEPTIONS: ExceptionDate[] = [
  { id: "1", date: new Date("2025-12-24"), type: "SPECIAL_HOURS", reason: "Giáng sinh (về sớm)", isClosed: false, openTime: "09:00", closeTime: "16:00" },
  { id: "2", date: new Date("2025-12-25"), type: "HOLIDAY", reason: "Lễ Giáng sinh", isClosed: true },
  { id: "3", date: new Date("2026-01-01"), type: "HOLIDAY", reason: "Tết Dương Lịch", isClosed: true },
];

export const MOCK_OPERATING_HOURS: OperatingHoursConfig = {
  weeklySchedule: MOCK_WEEKLY_SCHEDULE,
  exceptions: MOCK_EXCEPTIONS,
};
```

### Task 2.4: Implement `actions.ts`
**Thời gian:** 5 phút

```typescript
"use server";

import { ActionResponse } from "@/shared/lib/action-response";
import { MOCK_OPERATING_HOURS } from "./mocks";
import { OperatingHoursConfig } from "./types";

export async function getOperatingHours(): Promise<ActionResponse<OperatingHoursConfig>> {
  // TODO: Replace with real API call to /api/operating-hours
  return { status: "success", data: MOCK_OPERATING_HOURS };
}

export async function updateOperatingHours(
  config: OperatingHoursConfig
): Promise<ActionResponse> {
  // TODO: Replace with real API call
  console.log("Saving config:", config);
  return { status: "success", message: "Đã lưu cấu hình thành công" };
}
```

### Task 2.5: Implement `index.ts`
**Thời gian:** 2 phút

```typescript
// Public API
export * from "./types";
export { getOperatingHours, updateOperatingHours } from "./actions";
// Components will be added in Phase 3
```

### Task 2.6: Verification
```bash
cd frontend && pnpm lint
```
**Expected:** Pass (files standalone, không import bởi settings-page)

---

## Phase 3: Components

### 📖 Tham Chiếu: `docs/research/operating-hours-uxui.md` - Section 4, 6

### Task 3.1: Implement `day-row.tsx`
**Thời gian:** 25 phút
**Tham chiếu UX:** Section 4.1 (Weekly Schedule wireframe)

```typescript
// Component cho 1 row = 1 ngày
// Props: day, onChange, onCopy, onPaste, isCopySource

// Sử dụng Shared UI:
// - Switch (toggle open/closed)
// - TimeRangeInput (multiple slots)
// - Button (actions)
// - Tooltip (copy hints)
```

**Nếu cần tra cú pháp:**
```
mcp_shadcn_view_items_in_registries({ items: ["@shadcn/switch"] })
```

### Task 3.2: Implement `weekly-schedule.tsx`
**Thời gian:** 20 phút
**Tham chiếu UX:** Section 4.1

```typescript
// Container cho 7 DayRow
// Props: schedule, onChange

// Sử dụng Shared UI:
// - SurfaceCard, CardHeader, CardContent, CardTitle, CardDescription
// - Button (Copy to all)

// Logic:
// - Map 7 days → DayRow
// - Handle copy state
// - Handle "Copy to all" with confirmation
```

### Task 3.3: Implement `exception-sheet.tsx`
**Thời gian:** 25 phút
**Tham chiếu UX:** Section 4.3 (Sheet wireframe)
**Tham chiếu Pattern:** `service-sheet.tsx`, `staff-sheet.tsx`

```typescript
// Sheet form cho add/edit exception
// Props: open, onOpenChange, exception?, onSave

// Form fields (theo UX wireframe):
// 1. DatePicker - Chọn ngày
// 2. Select - Loại (HOLIDAY, MAINTENANCE, SPECIAL_HOURS, CUSTOM)
// 3. Input - Lý do
// 4. Switch - Đóng cửa cả ngày
// 5. TimeRangeInput - Giờ hoạt động (conditional)

// Sử dụng shared UI:
// - Sheet, SheetContent, SheetHeader, SheetFooter
// - Form, Field
// - DatePicker, Select, Input, Switch, TimeRangeInput
// - Button
```

**Nếu cần tra cú pháp:**
```
mcp_shadcn_get_item_examples_from_registries({ registries: ["@shadcn"], query: "sheet-demo" })
```

### Task 3.4: Implement `exceptions-panel.tsx`
**Thời gian:** 25 phút
**Tham chiếu UX:** Section 4.2 (Exceptions wireframe)

```typescript
// Main container cho exceptions tab
// Props: exceptions, onAdd, onEdit, onDelete

// Layout (theo UX wireframe):
// - Desktop: Grid 2 cột (1fr 300px)
// - Mobile: Stack (calendar hidden)

// Left: List card
// - CardHeader: Title + "Thêm ngày" button
// - CardContent: List of exception items

// Right: Mini calendar (lg:block only)
// - Calendar với modifiers highlight exception dates

// Sử dụng shared UI:
// - SurfaceCard, CardHeader, CardContent
// - Badge (status)
// - Button (actions)
// - Calendar (readonly)
// - Empty (empty state)
```

### Task 3.5: Update `index.ts` với exports
**Thời gian:** 2 phút

```typescript
// Thêm exports
export { WeeklySchedule } from "./weekly-schedule";
export { ExceptionsPanel } from "./exceptions-panel";
export { ExceptionSheet } from "./exception-sheet";
```

### Task 3.6: Verification
```bash
cd frontend && pnpm lint
```
**Expected:** ✅ Pass

---

## Phase 4: Integration

### Task 4.1: Update settings-page.tsx
**Thời gian:** 20 phút

1. **Update imports:**
```typescript
import {
  WeeklySchedule,
  ExceptionsPanel,
  ExceptionSheet,
  OperatingHoursConfig,
  ExceptionDate,
  getOperatingHours,
  updateOperatingHours,
} from "../operating-hours";
```

2. **Update TabsContent Schedule:**
```tsx
<TabsContent value="schedule">
  <PageContent>
    <WeeklySchedule
      schedule={config.weeklySchedule}
      onChange={handleScheduleChange}
    />
  </PageContent>
</TabsContent>
```

3. **Update TabsContent Exceptions:**
```tsx
<TabsContent value="exceptions">
  <PageContent>
    <ExceptionsPanel
      exceptions={config.exceptions}
      onAdd={() => setSheetOpen(true)}
      onEdit={(ex) => { setEditingException(ex); setSheetOpen(true); }}
      onDelete={handleDeleteException}
    />
    <ExceptionSheet
      open={sheetOpen}
      onOpenChange={setSheetOpen}
      exception={editingException}
      onSave={handleSaveException}
    />
  </PageContent>
</TabsContent>
```

4. **Update handlers** để match new types

### Task 4.2: Verification
```bash
cd frontend && pnpm lint && pnpm build
```
**Expected:** ✅ Pass lint AND build

---

## Phase 5: Verification

### Task 5.1: Visual Testing
1. `pnpm dev`
2. Navigate `/dashboard/settings`
3. Test Tab "Lịch làm việc":
   - [ ] Toggle ngày On/Off
   - [ ] Thêm/Xóa time slot
   - [ ] Copy lịch sang ngày khác
   - [ ] Copy to all (với confirmation)
4. Test Tab "Ngày ngoại lệ":
   - [ ] Xem danh sách exceptions
   - [ ] Xem mini calendar (desktop)
   - [ ] Thêm ngày nghỉ mới
   - [ ] Sửa ngày nghỉ
   - [ ] Xóa ngày nghỉ

### Task 5.2: Mobile Testing
- [ ] Resize browser ≤ 768px
- [ ] Kiểm tra responsive layout
- [ ] Calendar hidden trên mobile

### Task 5.3: Final Build
```bash
cd frontend && pnpm lint && pnpm build
```
**Expected:** ✅ Zero errors

---

## Checklist Tổng Kết

### Phase 1: Cleanup
- [ ] Xóa `operating-hours/` cũ
- [ ] Comment imports tạm thời

### Phase 2: Foundation (Tham chiếu DB Schema)
- [ ] Đọc `docs/research/operating-hours-design.md`
- [ ] Tạo `types.ts`
- [ ] Tạo `mocks.ts`
- [ ] Tạo `actions.ts`
- [ ] Tạo `index.ts`
- [ ] `pnpm lint` ✅

### Phase 3: Components (Tham chiếu UX Patterns)
- [ ] Đọc `docs/research/operating-hours-uxui.md`
- [ ] Implement `day-row.tsx`
- [ ] Implement `weekly-schedule.tsx`
- [ ] Implement `exception-sheet.tsx`
- [ ] Implement `exceptions-panel.tsx`
- [ ] Update `index.ts`
- [ ] `pnpm lint` ✅

### Phase 4: Integration
- [ ] Update `settings-page.tsx` imports
- [ ] Update TabsContent
- [ ] Update handlers
- [ ] `pnpm lint && pnpm build` ✅

### Phase 5: Verification
- [ ] Test UI desktop
- [ ] Test UI mobile
- [ ] Final `pnpm build` ✅

---

## MCP Tools Reference

Khi gặp lỗi cú pháp hoặc cần tra cứu:

```typescript
// Tra cứu component Shadcn
mcp_shadcn_view_items_in_registries({ items: ["@shadcn/sheet", "@shadcn/calendar"] })

// Xem ví dụ
mcp_shadcn_get_item_examples_from_registries({ registries: ["@shadcn"], query: "sheet-demo" })

// Tra Next.js docs
mcp_next-devtools_nextjs_docs({ action: "search", query: "server actions" })
```

---

## Ước Tính Thời Gian

| Phase | Thời gian |
|-------|-----------|
| Phase 1: Cleanup | 10 phút |
| Phase 2: Foundation | 30 phút |
| Phase 3: Components | 100 phút |
| Phase 4: Integration | 20 phút |
| Phase 5: Verification | 20 phút |
| **TỔNG** | **~3 giờ** |
