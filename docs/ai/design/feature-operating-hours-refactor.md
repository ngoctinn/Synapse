---
phase: design
title: Thiết kế Xây Dựng Lại Operating Hours UI (Clean Slate)
description: Xóa hoàn toàn code cũ, viết lại từ đầu với thiết kế tối giản
feature: operating-hours-refactor
status: approved
created: 2025-12-14
updated: 2025-12-14
---

# Thiết Kế: Xây Dựng Lại Operating Hours UI

> ⚠️ **CHIẾN LƯỢC: XÓA HOÀN TOÀN, VIẾT LẠI TỪ ĐẦU**
> Không giữ lại bất kỳ file nào từ `operating-hours/` cũ.

---

## 1. Cấu Trúc File Mới (Clean Slate)

```
operating-hours/
├── index.ts                      # Public exports
├── actions.ts                    # Server Actions (viết mới)
├── types.ts                      # Type definitions (match DB schema)
├── mocks.ts                      # Mock data mới
├── weekly-schedule.tsx           # Component: Lịch 7 ngày
├── day-row.tsx                   # Component: 1 row = 1 ngày
├── exceptions-panel.tsx          # Component: Danh sách ngày ngoại lệ
└── exception-sheet.tsx           # Component: Sheet thêm/sửa ngoại lệ
```

**Tổng: 8 files** (giảm từ 26 files = -69%)

---

## 2. Component Architecture

### 2.1. Tích hợp vào `settings-page.tsx`

```tsx
// settings-page.tsx sẽ import trực tiếp
import { WeeklySchedule, ExceptionsPanel } from "@/features/settings/operating-hours"

// Trong TabsContent
<TabsContent value="schedule">
  <PageContent>
    <WeeklySchedule
      schedule={config.weeklySchedule}
      onChange={handleScheduleChange}
    />
  </PageContent>
</TabsContent>

<TabsContent value="exceptions">
  <PageContent>
    <ExceptionsPanel
      exceptions={config.exceptions}
      onAdd={handleAddException}
      onEdit={handleEditException}
      onDelete={handleDeleteException}
    />
  </PageContent>
</TabsContent>
```

### 2.2. Component: `WeeklySchedule`

**File:** `weekly-schedule.tsx`
**Trách nhiệm:** Hiển thị 7 ngày, cho phép toggle on/off và chỉnh giờ

```tsx
interface WeeklyScheduleProps {
  schedule: DaySchedule[];
  onChange: (schedule: DaySchedule[]) => void;
}

export function WeeklySchedule({ schedule, onChange }: WeeklyScheduleProps) {
  // State cho copy functionality
  const [copySource, setCopySource] = useState<number | null>(null);

  return (
    <SurfaceCard>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Lịch làm việc</CardTitle>
          <CardDescription>Cấu hình giờ mở cửa cho từng ngày</CardDescription>
        </div>
        {copySource !== null && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Đang sao chép từ {DAY_LABELS[copySource]}
            </span>
            <Button variant="secondary" size="sm" onClick={handleCopyToAll}>
              Áp dụng tất cả
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCopySource(null)}>
              Hủy
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {schedule.map((day, index) => (
          <DayRow
            key={day.dayOfWeek}
            day={day}
            onChange={(updated) => handleDayChange(index, updated)}
            onCopy={() => setCopySource(day.dayOfWeek)}
            onPaste={copySource !== null ? () => handlePaste(index) : undefined}
            isCopySource={copySource === day.dayOfWeek}
          />
        ))}
      </CardContent>
    </SurfaceCard>
  );
}
```

### 2.3. Component: `DayRow`

**File:** `day-row.tsx`
**Trách nhiệm:** Một row cho một ngày, toggle + time inputs

```tsx
interface DayRowProps {
  day: DaySchedule;
  onChange: (day: DaySchedule) => void;
  onCopy: () => void;
  onPaste?: () => void;
  isCopySource?: boolean;
}

export function DayRow({ day, onChange, onCopy, onPaste, isCopySource }: DayRowProps) {
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-lg border transition-colors",
      day.isOpen ? "bg-card" : "bg-muted/30",
      isCopySource && "ring-2 ring-primary"
    )}>
      {/* Toggle */}
      <Switch
        checked={day.isOpen}
        onCheckedChange={(checked) => onChange({ ...day, isOpen: checked })}
      />

      {/* Day Label */}
      <span className="w-20 font-medium">{day.label}</span>

      {/* Time Slots or Closed */}
      <div className="flex-1">
        {day.isOpen ? (
          <div className="flex flex-wrap gap-2 items-center">
            {day.timeSlots.map((slot, i) => (
              <TimeRangeInput
                key={i}
                startTime={slot.start}
                endTime={slot.end}
                onStartTimeChange={(v) => updateSlot(i, 'start', v)}
                onEndTimeChange={(v) => updateSlot(i, 'end', v)}
                onRemove={day.timeSlots.length > 1 ? () => removeSlot(i) : undefined}
              />
            ))}
            <Button variant="ghost" size="sm" onClick={addSlot}>
              <Plus className="w-4 h-4 mr-1" /> Thêm ca
            </Button>
          </div>
        ) : (
          <span className="text-muted-foreground">Đóng cửa</span>
        )}
      </div>

      {/* Copy/Paste Actions */}
      <div className="flex gap-1">
        {onPaste ? (
          <Button variant="outline" size="sm" onClick={onPaste}>
            <ClipboardPaste className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={onCopy}>
            <Copy className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
```

### 2.4. Component: `ExceptionsPanel`

**File:** `exceptions-panel.tsx`
**Trách nhiệm:** Danh sách ngày ngoại lệ + Mini calendar (readonly)

```tsx
interface ExceptionsPanelProps {
  exceptions: ExceptionDate[];
  onAdd: () => void;
  onEdit: (exception: ExceptionDate) => void;
  onDelete: (id: string) => void;
}

export function ExceptionsPanel({ exceptions, onAdd, onEdit, onDelete }: ExceptionsPanelProps) {
  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6">
      {/* Left: List */}
      <SurfaceCard>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Ngày ngoại lệ</CardTitle>
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" /> Thêm ngày
          </Button>
        </CardHeader>
        <CardContent>
          {exceptions.length === 0 ? (
            <Empty description="Chưa có ngày ngoại lệ" />
          ) : (
            <div className="space-y-2">
              {exceptions
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map(ex => (
                  <div key={ex.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Badge variant={ex.isClosed ? "destructive" : "secondary"}>
                        {ex.isClosed ? "Đóng cửa" : "Giờ đặc biệt"}
                      </Badge>
                      <div>
                        <p className="font-medium">{format(ex.date, "dd/MM/yyyy")}</p>
                        <p className="text-sm text-muted-foreground">{ex.reason}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(ex)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(ex.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </SurfaceCard>

      {/* Right: Mini Calendar (Desktop) */}
      <div className="hidden lg:block">
        <SurfaceCard>
          <CardHeader>
            <CardTitle className="text-base">Tổng quan</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              modifiers={{ exception: exceptions.map(e => e.date) }}
              modifiersClassNames={{ exception: "bg-destructive/20 text-destructive" }}
              className="rounded-md"
            />
          </CardContent>
        </SurfaceCard>
      </div>
    </div>
  );
}
```

### 2.5. Component: `ExceptionSheet`

**File:** `exception-sheet.tsx`
**Trách nhiệm:** Form thêm/sửa ngày ngoại lệ

```tsx
interface ExceptionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exception?: ExceptionDate; // undefined = create mode
  onSave: (data: ExceptionDate) => void;
}

export function ExceptionSheet({ open, onOpenChange, exception, onSave }: ExceptionSheetProps) {
  const isEditMode = !!exception;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditMode ? "Sửa" : "Thêm"} ngày ngoại lệ</SheetTitle>
          <SheetDescription>
            Cấu hình ngày nghỉ lễ hoặc giờ hoạt động đặc biệt
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <Field label="Ngày" required>
            <DatePicker value={date} onChange={setDate} />
          </Field>

          <Field label="Loại" required>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOLIDAY">Nghỉ lễ</SelectItem>
                <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
                <SelectItem value="SPECIAL_HOURS">Giờ đặc biệt</SelectItem>
                <SelectItem value="CUSTOM">Khác</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Lý do" required>
            <Input
              placeholder="VD: Tết Nguyên Đán, Bảo trì hệ thống..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Field>

          <Field label="Trạng thái">
            <div className="flex items-center gap-2">
              <Switch checked={isClosed} onCheckedChange={setIsClosed} />
              <span>{isClosed ? "Đóng cửa cả ngày" : "Hoạt động giờ khác"}</span>
            </div>
          </Field>

          {!isClosed && (
            <Field label="Giờ hoạt động">
              <TimeRangeInput
                startTime={openTime}
                endTime={closeTime}
                onStartTimeChange={setOpenTime}
                onEndTimeChange={setCloseTime}
              />
            </Field>
          )}
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave}>
            {isEditMode ? "Cập nhật" : "Thêm"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

---

## 3. Type Definitions

**File:** `types.ts`

```typescript
// Match với database schema từ docs/research/operating-hours-design.md

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
  start: string; // "HH:mm"
  end: string;
}

export interface DaySchedule {
  dayOfWeek: DayOfWeek;
  label: string;
  isOpen: boolean;
  timeSlots: TimeSlot[];
}

export type ExceptionType = "HOLIDAY" | "MAINTENANCE" | "SPECIAL_HOURS" | "CUSTOM";

export interface ExceptionDate {
  id: string;
  date: Date;
  type: ExceptionType;
  reason: string;
  isClosed: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface OperatingHoursConfig {
  weeklySchedule: DaySchedule[];
  exceptions: ExceptionDate[];
}
```

---

## 4. Shared UI Components Sử Dụng

| Component | Source | Mục đích |
|-----------|--------|----------|
| `SurfaceCard` | `@/shared/components/layout/page-layout` | Container chính |
| `CardHeader`, `CardContent`, `CardTitle` | `@/shared/ui/card` | Card structure |
| `Button` | `@/shared/ui/button` | Actions |
| `Switch` | `@/shared/ui/switch` | Toggle open/closed |
| `Badge` | `@/shared/ui/badge` | Status display |
| `Calendar` | `@/shared/ui/calendar` | Mini calendar |
| `Sheet`, `SheetContent`, ... | `@/shared/ui/sheet` | Exception form |
| `Select`, `SelectItem` | `@/shared/ui/select` | Dropdown |
| `Input` | `@/shared/ui/input` | Text input |
| `TimeRangeInput` | `@/shared/ui/custom/time-range-input` | Time selection |
| `DatePicker` | `@/shared/ui/custom/date-picker` | Date selection |
| `Empty` | `@/shared/ui/empty` | Empty state |
| `Field` | `@/shared/ui/field` | Form field wrapper |

---

## 5. Files Cần XÓA (Toàn Bộ Folder Cũ)

```bash
# XÓA TOÀN BỘ thư mục operating-hours cũ
rm -rf frontend/src/features/settings/operating-hours/
```

**Danh sách cụ thể 26 files bị xóa:**
- `actions.ts`
- `constants.ts`
- `index.ts`
- `components/bulk-action-toolbar.tsx`
- `components/day-schedule-row.tsx`
- `components/exception-form.tsx`
- `components/exception-list-item.tsx`
- `components/exception-sheet.tsx`
- `components/exceptions-calendar.tsx`
- `components/exceptions-filter-bar.tsx`
- `components/exceptions-view-manager.tsx`
- `components/schedule-editor.tsx`
- `components/smart-tooltip.tsx`
- `components/year-view-grid.tsx`
- `hooks/use-calendar-selection.ts`
- `hooks/use-exception-filters.ts`
- `hooks/use-exception-view-logic.ts`
- `hooks/use-time-slots.ts`
- `model/constants.ts`
- `model/mocks.ts`
- `model/types.ts`
- `utils/bulk-operations.ts`
- `utils/grouping.ts`
- `utils/schedule-utils.ts`
- `utils/style-helpers.ts`
- `utils/time-validation.ts`

---

## 6. Quyết Định Thiết Kế

| Quyết định | Lý do |
|-----------|-------|
| Xóa toàn bộ, viết lại | Code cũ quá phức tạp, không thể refactor hiệu quả |
| Flat structure (không subfolder) | 8 files không cần phân chia thêm |
| No Year View | Quá phức tạp, use case không cần |
| No Drag Selection | Simple click-to-add đủ dùng |
| No Bulk Actions | Rarely needed, thêm complexity |
| Calendar readonly | Chỉ để overview, không interactive |
| Sheet for forms | Nhất quán với các feature khác (Staff, Service) |
