# Nghiên Cứu UX/UI: Cấu Hình Giờ Hoạt Động Spa

**Ngày:** 2025-12-14
**Phiên bản:** 2.0
**Dự án:** Synapse CRM
**Tham chiếu:** `docs/research/operating-hours-design.md` (Database Schema)

---

## 1. Mục Tiêu Nghiên Cứu

### 1.1. Câu Hỏi Cần Trả Lời
1. UI pattern nào phù hợp nhất cho việc cấu hình lịch làm việc 7 ngày/tuần?
2. Làm sao hiển thị và quản lý ngày ngoại lệ (lễ, bảo trì) một cách trực quan?
3. Làm sao đảm bảo tính nhất quán với các feature khác trong project (Services, Staff)?
4. Những yêu cầu accessibility nào cần tuân thủ?

### 1.2. Tham Chiếu Database Schema
Theo `docs/research/operating-hours-design.md`, hệ thống sử dụng 2 bảng SQL:

| Bảng | Mục đích | Trường chính |
|------|----------|--------------|
| `regular_operating_hours` | Lịch tuần chuẩn | `day_of_week`, `open_time`, `close_time`, `period_number` |
| `exception_dates` | Ngày ngoại lệ | `exception_date`, `type`, `reason`, `is_closed`, `open_time`, `close_time` |

**Key insight:** `period_number` cho phép **nhiều ca/ngày** (split-shift, VD: nghỉ trưa).

---

## 2. Best Practices Từ Ngành (Industry Research)

### 2.1. Cấu Hình Lịch Tuần

| Pattern | Mô tả | Ưu điểm | Áp dụng |
|---------|-------|---------|---------|
| **List View 7 ngày** | Hiển thị từng ngày dọc xuống | Dễ quét mắt, familiar | ✅ Sử dụng |
| **Toggle Switch** | Bật/Tắt ngày làm việc | Intuitive, one-click | ✅ Sử dụng |
| **Time Range Input** | Chọn giờ mở-đóng | Chuẩn industry | ✅ Sử dụng |
| **"Add Shift" button** | Thêm ca làm việc | Hỗ trợ split-shift | ✅ Sử dụng |
| **Copy functionality** | Sao chép lịch sang ngày khác | Tiết kiệm thời gian | ✅ Sử dụng |
| Grid calendar | Click-drag để chọn giờ | Phức tạp, không cần thiết | ❌ Không dùng |

**Nguồn:** Calendly, Cal.com, Zoho Bookings

### 2.2. Quản Lý Ngày Ngoại Lệ

| Pattern | Mô tả | Ưu điểm | Áp dụng |
|---------|-------|---------|---------|
| **List View** | Danh sách ngày sắp tới | Dễ quản lý CRUD | ✅ Sử dụng |
| **Mini Calendar** | Tổng quan tháng (readonly) | Visual overview | ✅ Sử dụng (sidebar) |
| **Sheet/Dialog form** | Form thêm/sửa ngoại lệ | Nhất quán với project | ✅ Sử dụng Sheet |
| **Badge status** | Hiển thị loại (Lễ/Bảo trì/Đặc biệt) | Quick recognition | ✅ Sử dụng |
| Year-wide view | Xem cả năm 12 tháng | Quá phức tạp | ❌ Không dùng |
| Drag selection | Kéo chọn nhiều ngày | Overkill cho use case | ❌ Không dùng |
t
**Nguồn:** Zendesk Business Hours, Google Business Profile

### 2.3. Accessibility Requirements (WCAG 2.1)

| Yêu cầu | Implementation |
|---------|----------------|
| Keyboard navigation | Tất cả interactive elements phải focus được |
| ARIA labels | Date picker, time input phải có label rõ ràng |
| Color contrast | Đảm bảo contrast ratio >= 4.5:1 |
| Error messages | Thông báo lỗi clear và accessible |
| Focus indicators | Visible focus ring cho tất cả buttons |

---

## 3. Patterns Nhất Quán Với Project

### 3.1. Sheet Pattern (Tham chiếu: `service-sheet.tsx`, `staff-sheet.tsx`)

Cấu trúc Sheet chuẩn trong project:

```
Sheet
├── SheetContent (className="w-full sm:max-w-md p-0 gap-0 flex flex-col")
│   ├── SheetHeader
│   │   ├── SheetTitle
│   │   └── SheetDescription
│   ├── div.sheet-scroll-area
│   │   └── Form > form > Fields...
│   └── SheetFooter
│       ├── Button variant="ghost" (Hủy)
│       └── Button type="submit" (Lưu)
```

**Áp dụng:** Form thêm/sửa ngày ngoại lệ sẽ dùng pattern này.

### 3.2. SurfaceCard Pattern (Tham chiếu: `settings-page.tsx`)

Cấu trúc Card chuẩn:

```
SurfaceCard
├── CardHeader (flex-row items-center justify-between)
│   ├── div > CardTitle + CardDescription
│   └── Actions (Button)
└── CardContent
    └── Content...
```

**Áp dụng:** Container cho Weekly Schedule và Exceptions List.

### 3.3. Form Field Pattern

```tsx
<Field label="..." required>
  <Input / Select / Switch / DatePicker />
</Field>
```

---

## 4. Đề Xuất Thiết Kế UI

### 4.1. Tab "Lịch Làm Việc" (Weekly Schedule)

```
┌─────────────────────────────────────────────────────────────┐
│ SurfaceCard                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ CardHeader                                              │ │
│ │  Lịch làm việc                    [Copy actions nếu có] │ │
│ │  Cấu hình giờ mở cửa cho từng ngày trong tuần          │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ CardContent                                             │ │
│ │                                                         │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ [Switch] Thứ Hai   │ 08:00 - 12:00 │ 13:30 - 21:00 │ │ │
│ │ │                    │ [+ Thêm ca]   │               │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ [Switch] Thứ Ba    │ 08:00 - 21:00 │ [Copy]        │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ ...                                                     │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ [    ] Chủ Nhật    │ Đóng cửa                       │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Toggle Switch → Bật/tắt ngày
- TimeRangeInput → Chỉnh giờ start/end
- "+ Thêm ca" → Thêm time slot mới (split-shift)
- "Copy" → Cho phép paste sang ngày khác

### 4.2. Tab "Ngày Ngoại Lệ" (Exceptions)

**Desktop (lg:grid-cols-[1fr_300px]):**

```
┌────────────────────────────────────┬─────────────────────────┐
│ SurfaceCard (Danh sách)            │ SurfaceCard (Calendar)  │
│ ┌────────────────────────────────┐ │ ┌─────────────────────┐ │
│ │ Ngày ngoại lệ    [+ Thêm ngày] │ │ │ Tổng quan          │ │
│ └────────────────────────────────┘ │ └─────────────────────┘ │
│ ┌────────────────────────────────┐ │ ┌─────────────────────┐ │
│ │ [Badge:Lễ] 01/01/2026          │ │ │   Tháng 12 2025     │ │
│ │ Tết Dương Lịch     [Edit][Del] │ │ │ ┌─┬─┬─┬─┬─┬─┬─┐     │ │
│ └────────────────────────────────┘ │ │ │ │ │ │ │ │ │ │     │ │
│ ┌────────────────────────────────┐ │ │ │ │ │●│ │ │ │ │     │ │
│ │ [Badge:Đặc biệt] 24/12/2025    │ │ │ │ │ │ │●│ │ │ │     │ │
│ │ Giáng sinh (09:00-16:00) [E][D]│ │ │ └─┴─┴─┴─┴─┴─┴─┘     │ │
│ └────────────────────────────────┘ │ │ ● = Có exception     │ │
│                                    │ └─────────────────────┘ │
└────────────────────────────────────┴─────────────────────────┘
```

**Mobile (stack):**
- Calendar ẩn trên mobile (`hidden lg:block`)
- Chỉ hiện List view

### 4.3. Sheet "Thêm/Sửa Ngày Ngoại Lệ"

```
┌──────────────────────────────────────────┐
│ SheetHeader                              │
│ ┌──────────────────────────────────────┐ │
│ │ Thêm ngày ngoại lệ                   │ │
│ │ Cấu hình ngày nghỉ lễ hoặc giờ đặc...│ │
│ └──────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│ sheet-scroll-area                        │
│ ┌──────────────────────────────────────┐ │
│ │ Ngày *                               │ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │ [DatePicker: 01/01/2026]         │ │ │
│ │ └──────────────────────────────────┘ │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ Loại *                               │ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │ [Select: Nghỉ lễ ▼]              │ │ │
│ │ └──────────────────────────────────┘ │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ Lý do *                              │ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │ Tết Dương Lịch                   │ │ │
│ │ └──────────────────────────────────┘ │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ Trạng thái                           │ │
│ │ [Switch] Đóng cửa cả ngày            │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ Giờ hoạt động (nếu không đóng cửa)  │ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │ [09:00] - [16:00]                │ │ │
│ │ └──────────────────────────────────┘ │ │
│ └──────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│ SheetFooter                              │
│            [Hủy bỏ]  [Thêm ngày]         │
└──────────────────────────────────────────┘
```

---

## 5. Type Definitions (Mapping từ Database)

Dựa trên schema trong `docs/research/operating-hours-design.md`:

```typescript
// ===== WEEKLY SCHEDULE =====
type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const DAY_LABELS: Record<DayOfWeek, string> = {
  1: "Thứ Hai",
  2: "Thứ Ba",
  3: "Thứ Tư",
  4: "Thứ Năm",
  5: "Thứ Sáu",
  6: "Thứ Bảy",
  7: "Chủ Nhật",
};

interface TimeSlot {
  start: string; // "HH:mm" format
  end: string;
}

interface DaySchedule {
  dayOfWeek: DayOfWeek;
  label: string;
  isOpen: boolean;
  timeSlots: TimeSlot[]; // Hỗ trợ nhiều ca (period_number trong DB)
}

// ===== EXCEPTIONS =====
type ExceptionType = "HOLIDAY" | "MAINTENANCE" | "SPECIAL_HOURS" | "CUSTOM";

interface ExceptionDate {
  id: string;
  date: Date;
  type: ExceptionType;
  reason: string;
  isClosed: boolean;
  openTime?: string; // Chỉ dùng khi isClosed = false
  closeTime?: string;
}

// ===== CONFIG =====
interface OperatingHoursConfig {
  weeklySchedule: DaySchedule[];
  exceptions: ExceptionDate[];
}
```

---

## 6. Shared UI Components Cần Sử Dụng

| Component | Source | Mục đích |
|-----------|--------|----------|
| `SurfaceCard` | `@/shared/components/layout/page-layout` | Container chính |
| `CardHeader`, `CardContent`, `CardTitle`, `CardDescription` | `@/shared/ui/card` | Card structure |
| `Button` | `@/shared/ui/button` | Actions |
| `Switch` | `@/shared/ui/switch` | Toggle open/closed |
| `Badge` | `@/shared/ui/badge` | Status display (Lễ, Bảo trì...) |
| `Calendar` | `@/shared/ui/calendar` | Mini calendar readonly |
| `Sheet`, `SheetContent`, `SheetHeader`, `SheetFooter` | `@/shared/ui/sheet` | Form container |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` | `@/shared/ui/select` | Dropdown chọn loại |
| `Input` | `@/shared/ui/input` | Text input (reason) |
| `TimeRangeInput` | `@/shared/ui/custom/time-range-input` | Chọn giờ mở-đóng |
| `DatePicker` | `@/shared/ui/custom/date-picker` | Chọn ngày |
| `Empty` | `@/shared/ui/empty` | Empty state |
| `Field` | `@/shared/ui/field` | Form field wrapper |
| `Form` | `@/shared/ui/form` | React Hook Form wrapper |

---

## 7. Kết Luận & Đề Xuất

### 7.1. UI Pattern Đề Xuất

| Thành phần | Pattern | Lý do |
|------------|---------|-------|
| Lịch tuần | **List View + Toggle + TimeRangeInput** | Đơn giản, familiar, industry standard |
| Ngày ngoại lệ | **List + Mini Calendar** | Visual overview + easy CRUD |
| Form thêm/sửa | **Sheet** | Nhất quán với Services, Staff |
| Status | **Badge** | Quick recognition |

### 7.2. Không Sử Dụng

| Pattern | Lý do |
|---------|-------|
| Year-wide calendar view | Quá phức tạp, không cần thiết cho Spa đơn lẻ |
| Drag-to-select | Overkill, thêm complexity không cần thiết |
| Bulk actions | Rarely needed, có thể add later nếu cần |
| Complex filters | Danh sách exceptions thường nhỏ (<50 items) |

### 7.3. Tham Chiếu Quan Trọng Khi Implement

1. **Database Schema:** `docs/research/operating-hours-design.md` (Section 2.1)
2. **Sheet Pattern:** `frontend/src/features/services/components/service-sheet.tsx`
3. **Page Layout:** `frontend/src/features/settings/components/settings-page.tsx`
4. **Shared UI:** `frontend/src/shared/ui/index.ts`
