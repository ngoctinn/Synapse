# Refactor Frontend Plan

## 1. Objectives

- **Clean Comments**: Remove decorative comments (`====`, `----`) and redundant "what" comments.
- **Reduce File Size**: Split files > 400 lines (no specific large files identified yet, but will split logic where appropriate).
- **Single Responsibility**: Split large components/types into separate files.
- **Clean JSX**: Reduce nesting, improve readability.
- **Tailwind**: Use `cn()`, reduce overriding.

## 2. Analysis

- **Target Directories**: `frontend/src/features`, `frontend/src/app` (excluding `shared/ui`).
- **Identified Files**:
    - `features/staff/model/types.ts`: Contains decorative comments.
    - `features/appointments/components/calendar/month-view.tsx`: Contains decorative comments and sub-component `DayCellComponent`.

## 3. Plan

### Step 1: Feature `staff`
- [ ] Refactor `features/staff/model/types.ts`.

### Step 2: Feature `appointments`
- [ ] Refactor `features/appointments/components/calendar/month-view.tsx`.
- [ ] Extract `DayCellComponent` to `features/appointments/components/calendar/day-cell.tsx`.

### Step 3: Scan & Refactor Others
- [ ] Search for other occurrences of `====` and `----` and refactor.

### Step 4: Verify
- [ ] Run `pnpm lint`.
- [ ] Run `pnpm build` (optional check).

## 4. Safety
- [ ] Use `cn()` for class merging.
- [ ] Maintain original logic.
