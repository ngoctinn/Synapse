# Frontend Features Deep Review Plan - Staff Feature

## Mục tiêu
Phân tích chuyên sâu feature `staff` (43 files) để tìm các vấn đề code quality, type safety, và duplications.

---

## 1. TỔNG QUAN FEATURE STAFF

### Cấu trúc thư mục
```
staff/
├── actions.ts              (5.9KB) - Server Actions
├── index.ts                (225B)  - Public API (thiếu nhiều export)
├── model/
│   ├── constants.ts        (3.7KB)
│   ├── mocks.ts            (8.6KB)
│   ├── schedules.ts        (3.3KB)
│   ├── schemas.ts          (1KB)
│   ├── shifts.ts           (0.9KB)
│   └── types.ts            (2.9KB)
├── hooks/
│   ├── use-schedule-filters.ts
│   ├── use-schedule-navigation.ts
│   └── use-schedules.ts
└── components/
    ├── staff-form.tsx      (367 lines) ⚠️ LỚN
    ├── staff-sheet.tsx     (174 lines)
    ├── staff-page.tsx      (7KB)
    ├── staff-filter.tsx
    ├── create-staff-trigger.tsx
    ├── invite-staff-trigger.tsx
    ├── staff-list/
    ├── permissions/
    └── scheduling/         (21 files) ⚠️ LỚN
```

---

## 2. VẤN ĐỀ PHÁT HIỆN

### 2.1. Type Safety Issues 🔴

| File | Line | Vấn đề |
|------|------|--------|
| `staff-sheet.tsx` | 91 | `as any` type assertion cho role |
| `staff-sheet.tsx` | 104 | `function onSubmit(data: any)` |

**Nguyên nhân**: Union types giữa `StaffCreateFormValues` và `StaffUpdateFormValues`.

### 2.2. Console.log còn sót 🟠

| File | Line | Code |
|------|------|------|
| `actions.ts` | 137 | `console.log(\`[Batch Update] Created...`)` |

### 2.3. File lớn cần chia nhỏ 🟡

| File | Lines | Vấn đề |
|------|-------|--------|
| `staff-form.tsx` | 367 | Chứa 3 render functions lớn |

### 2.4. Index.ts không export đầy đủ 🟡

Hiện tại `index.ts` chỉ export:
- `StaffPage`
- `MOCK_STAFF`
- `model/*` (schemas, types, constants)

**Thiếu export:**
- Hooks (`useScheduleFilters`, `useSchedules`, `useScheduleNavigation`)
- Components scheduling (`StaffSchedulingPage`, etc.)

### 2.5. Eslint-disable comments

| File | Line | Reason |
|------|------|--------|
| `staff-sheet.tsx` | 90, 103 | `@typescript-eslint/no-explicit-any` |
| `scheduling/calendar/week-view.tsx` | 106 | `@next/next/no-img-element` |

---

## 3. KẾ HOẠCH THỰC THI

### Phase 1: Fix Type Safety (High Priority)
- [ ] **Task 1.1**: Sửa `any` type trong `staff-sheet.tsx`
  - Tạo union type đúng cách cho onSubmit
  - Sử dụng type narrowing thay vì `as any`

### Phase 2: Clean Code (Medium Priority)
- [ ] **Task 2.1**: Xóa `console.log` trong `actions.ts`
- [ ] **Task 2.2**: Thêm exports vào `index.ts` cho hooks và scheduling components

### Phase 3: Refactor Large File (Low Priority)
- [ ] **Task 3.1**: Tách `staff-form.tsx` thành 3 files:
  - `staff-form-general.tsx`
  - `staff-form-professional.tsx`
  - `staff-form-hr.tsx`
  - `staff-form.tsx` (container)

---

## 4. ƯU TIÊN

| Priority | Task | Ảnh hưởng |
|----------|------|-----------|
| 🔴 High | Task 1.1 | Type safety, giảm eslint-disable |
| 🟠 Medium | Task 2.1, 2.2 | Clean code, DX |
| 🟡 Low | Task 3.1 | Maintainability |
