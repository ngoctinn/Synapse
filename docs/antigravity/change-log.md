# Antigravity Change Log: CSS/Tailwind Refactor

## Tóm tắt thay đổi
Đã thực hiện tái cấu trúc hệ thống CSS/Tailwind nhằm loại bỏ việc ghi đè class thủ công, chuẩn hóa Tokens và cải thiện tính nhất quán giữa Light/Dark mode.

## Chi tiết thay đổi

### 1. Hệ thống Tokens và Utilities (`globals.css`)
- **Tokens:** Map đầy đủ các biến `--alert-*` và `--status-*` vào Tailwind `@theme`.
- **Utilities:**
    - Thêm `.shadow-premium-primary`, `.shadow-premium-lg` cho các hiệu ứng cao cấp.
    - Thêm `.text-gradient-premium` cho các tiêu đề quan trọng.
    - Thêm `.btn-hero` để chuẩn hóa các nút lớn trên Landing page.
    - Thêm `.bg-blob` cho các hiệu ứng nền decor.
    - Thêm `.table-first-cell-padding` và `.table-last-cell-padding` cho DataTable.
    - Thêm hệ thống `.indicator-online`, `.indicator-offline`, `.indicator-busy`.

### 2. Base UI Components nâng cấp
- **Alert.tsx:** Bổ sung các variant: `success`, `warning`, `info`. Các variant này tự động sử dụng màu sắc từ theme tokens.
- **Badge.tsx:** Đồng bộ các variant `success`, `warning`, `info`, `destructive` với theme tokens (loại bỏ hardcoded emerald/amber/red).
- **Button.tsx:** Bổ sung các variant: `success`, `warning`, `outline-success`, `outline-warning`.

### 3. Refactor Features
- **LoginForm.tsx:** Chuyển sang sử dụng `Alert` variant thay vì ghi đè màu thủ công.
- **Hero.tsx:** Thu gọn JSX bằng cách sử dụng các utility class mới (`.text-gradient-premium`, `.btn-hero`, v.v.).
- **DataTable.tsx:** Chuẩn hóa padding bằng utility class thay vì hardcoded `pl-6`/`pr-6`.
- **HoldTimer.tsx:** Chuyển sang sử dụng `Badge` component với variant động.
- **ChatWindow.tsx:** Sử dụng `.indicator-online`/`.indicator-offline`.

## Đánh giá Bảo mật & Tuân thủ
- **Bảo mật:** Không phát hiện rò rỉ secret hoặc lỗi bảo mật CSS.
- **Tuân thủ:**
    - Tuân thủ chuẩn Tailwind v4 (CSS-first).
    - Tuân thủ quy tắc viết code của dự án (OKLCH, Tiếng Việt).
    - Cải thiện đáng kể khả năng bảo trì giao diện.

---
*Người thực hiện: Antigravity Agent*
*Ngày: 2025-12-18*

# Antigravity Change Log: Frontend Clean Code Refactor

## Tóm tắt thay đổi
Đã thực hiện tái cấu trúc "Clean Code" cho Frontend: xóa bỏ các comments trang trí thừa, giảm nesting, tách logic phức tạp ra khỏi components.

## Chi tiết thay đổi

### 1. Xóa Comments Thừa & Trang Trí (`features/**`)
- Xóa bỏ các headers dạng `==== ROLE CONFIG ====` trong:
    - `features/staff/model/types.ts`
    - `features/staff/model/constants.ts`
    - `features/settings/operating-hours/types.ts`
    - `features/appointments/components/calendar/month-view.tsx`
    - `features/appointments/components/calendar/week-view.tsx`
    - `features/appointments/components/calendar/day-view.tsx`

### 2. Refactor Components (Giảm Nesting & Tách File)
- **MonthView.tsx:**
    - Tách component con `DayCellComponent` ra thành file riêng `day-cell.tsx`.
    - Định nghĩa lại `DayModel` interface.
- **WeekView.tsx:**
    - Tách logic tính toán vị trí sự kiện (event positioning) ra custom hook `useWeekEventLayout`.
    - Tách thuật toán cốt lõi ra `layout-utils.ts` để tái sử dụng.
- **DayView.tsx:**
    - Loại bỏ logic lặp lại, tái sử dụng `calculateEventLayout` từ `layout-utils.ts`.
    - Component trở nên gọn gàng hơn (< 200 dòng).

### 3. Verification
- `pnpm lint`: Passed.
- `pnpm build`: Passed.

## Đánh giá
- **Độ phức tạp:** Giảm đáng kể độ phức tạp nhận thức (cognitive complexity) của các file View.
- **Tính tái sử dụng:** Logic layout sự kiện giờ đây có thể tái sử dụng dễ dàng.
- **Tuân thủ:** Đạt tiêu chuẩn Clean Code và Single Responsibility.

---
*Người thực hiện: Antigravity Agent*
*Ngày: 2025-12-18* (Refactor Session 2)

# Antigravity Change Log: Code Review & Duplicate Cleanup

## Tóm tắt thay đổi
Đã thực hiện review code toàn bộ `features/` và xử lý các vấn đề: loại bỏ logic trùng lặp, xóa mã chết, gộp file phân mảnh.

## Chi tiết thay đổi

### 1. Xử lý Logic Trùng Lặp

#### 1.1. `formatCurrency` Duplicates
- **Đã sửa:** `billing/components/sheet/invoice-details.tsx`
  - Xóa định nghĩa local `formatCurrency`, import từ `@/shared/lib/utils`
- **Đã đổi tên:** `appointments/components/dashboard/metrics-cards.tsx`
  - Đổi `formatCurrency` → `formatCompactCurrency` (logic khác: abbreviated format cho metrics)

#### 1.2. `STATUS_TO_PRESET` Duplicates
- **Tạo mới:** `appointments/constants.ts` → `STATUS_TO_BADGE_PRESET`
- **Đã refactor:**
  - `appointments/components/event/event-card.tsx`: Xóa local, import từ constants
  - `appointments/components/sheet/appointment-sheet.tsx`: Xóa local, import từ constants
- **Export thêm:** `appointments/index.ts` → `STATUS_TO_BADGE_PRESET`

### 2. Xóa Mã Chết (Dead Code)
- **Xóa folder:** `customer-dashboard/schemas/` (chứa `booking-schema.ts` không được sử dụng)

### 3. Xóa File Rác (Session trước)
- `bash.exe.stackdump`
- `frontend/build_err.log`, `build_error.log`, `build_output.txt`, `lint_report.txt`, `tsc_errors.txt`
- **Cập nhật:** `.gitignore` - thêm patterns cho `*.log`, `*.stackdump`

### 4. Gộp Mock Data (Session trước)
- Gộp `customer-dashboard/mocks.ts` → `services/mock-data.ts`

### 5. Verification
- `pnpm lint`: Passed (0 errors, 0 warnings)
- `pnpm build`: Passed

## Đánh giá
- **Bảo mật:** Không phát hiện rò rỉ secret
- **Tuân thủ:** Đạt chuẩn DRY (Don't Repeat Yourself)
- **Tác động:** Giảm code trùng lặp, cải thiện maintainability

---
*Người thực hiện: Antigravity Agent*
*Ngày: 2025-12-18* (Refactor Session 3 - Code Review)

# Antigravity Change Log: Staff Feature Deep Review

## Tóm tắt thay đổi
Đã phân tích chuyên sâu feature `staff` (43 files) và sửa các vấn đề về type safety, clean code.

## Chi tiết thay đổi

### 1. Type Safety Fixes

#### 1.1. Sửa `any` types trong `staff-sheet.tsx`
- **Thêm type alias:**
  ```typescript
  type StaffFormValues = StaffCreateFormValues | StaffUpdateFormValues;
  ```
- **Sửa `role` type cast (Line 91):**
  - Trước: `role: staff?.user.role as any`
  - Sau: `role: staff?.user.role === 'customer' ? 'technician' : staff?.user.role || 'technician'`
- **Sửa `onSubmit` function:**
  - Trước: `function onSubmit(data: any)`
  - Sau: `function onSubmit(data: StaffFormValues)` với type-safe FormData handling

### 2. Clean Code
- **Xóa `console.log`** trong `actions.ts` Line 137

### 3. Index.ts Enhancement
- **Thêm exports cho:**
  - Components: `StaffSheet`, `StaffFilter`, `StaffSchedulingPage`
  - Hooks: `useScheduleFilters`, `useScheduleNavigation`, `useSchedules`
- **Cải thiện DX:** External consumers giờ có thể import từ `@/features/staff`

### 4. Verification
- `pnpm lint`: Passed (0 errors, 0 warnings)
- `pnpm build`: Passed

## Đánh giá
- **Type Safety:** Cải thiện đáng kể, loại bỏ 2 eslint-disable
- **Clean Code:** Xóa debug log
- **DX (Developer Experience):** Index.ts now exports đầy đủ public API

---
*Người thực hiện: Antigravity Agent*
*Ngày: 2025-12-18* (Refactor Session 4 - Staff Deep Review)

# Antigravity Change Log: Comment Cleanup

## Tóm tắt thay đổi
Đã xóa toàn bộ decorative comments dạng `// ====...` và section headers trong `features/`.

## Chi tiết thay đổi

### 1. Xóa Decorative Section Comments

**Pattern đã xóa:**
```
// ============================================
// TYPES
// ============================================
```

**Files đã xử lý (appointments/components/):**
- `event/event-card.tsx` - 3 sections
- `event/event-popover.tsx` - 2 sections
- `dashboard/metrics-cards.tsx` - 3 sections
- `toolbar/date-navigator.tsx` - 2 sections
- `toolbar/view-switcher.tsx` - 3 sections
- `toolbar/filter-bar.tsx` - 3 sections
- `dnd/droppable-slot.tsx` - 2 sections
- `dnd/draggable-event-card.tsx` - 2 sections
- `dnd/calendar-dnd-context.tsx` - 4 sections
- `calendar/agenda-view.tsx` - 3 sections
- `calendar/time-grid.tsx` - 3 sections
- `calendar/date-header.tsx` - 2 sections
- `timeline/timeline-header.tsx` - 3 sections
- `timeline/resource-timeline.tsx` - 2 sections
- `sheet/conflict-warning.tsx` - 3 sections
- `sheet/appointment-sheet.tsx` - 3 sections
- `calendar/empty-state.tsx` - 2 sections

**Files khác:**
- `settings/operating-hours/constants.ts`
- `staff/components/scheduling/calendar/month-view.tsx`

### 2. Verification
- `pnpm lint`: Passed (0 errors, 0 warnings)
- `pnpm build`: Passed

## Đánh giá
- **Code Quality:** Giảm noise, tăng readability
- **Maintainability:** Dễ đọc hơn khi không có decorative comments
- **Consistency:** Tuân thủ best practice "code should be self-documenting"

---
*Người thực hiện: Antigravity Agent*
*Ngày: 2025-12-18* (Refactor Session 5 - Comment Cleanup)

# Antigravity Change Log: Features Deep Review Session 6

## Tóm tắt
Rà soát `services`, `booking-wizard`, `customers`, `settings`. Sửa type safety và clean code.

## Chi tiết

### 1. `customers/components/customer-sheet.tsx`
- Thêm `CustomerFormData` union type
- Giảm `eslint-disable` từ 3 → 1 (giữ zodResolver - giới hạn thư viện)
- Type-safe onSubmit với number check

### 2. `settings/operating-hours/actions.ts`
- Xóa `console.log` debug
- Prefix `_config` cho unused param

### Verification
- `pnpm lint`: Passed
- `pnpm build`: Passed

---
*Người thực hiện: Antigravity Agent*
*Ngày: 2025-12-19* (Session 6 - Features Deep Review)
