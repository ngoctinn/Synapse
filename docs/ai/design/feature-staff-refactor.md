---
title: Staff Feature Refactoring Design
status: Draft
priority: High
assignee: AI
---

# Staff Feature Refactoring Design

## 1. Architecture Changes
- **No major architectural changes.** The feature already follows the Modular Monolith / Feature-Sliced Design approach.
- **Refactoring:**
    - Extract `roleConfig` to `frontend/src/features/staff/constants.ts`.
    - Extract `Shift` types if not already in `types.ts`.
    - Componentize `ScheduleGrid` cells and rows further if needed.

## 2. Data Model / Schema Changes
- No database schema changes required for this UI refactor.

## 3. API / Interface Design
- **Staff List:**
    - Ensure `StaffActions` uses proper dropdowns.
- **Permissions:**
    - `PermissionMatrix` should accept `initialPermissions` and `onSave` props to be more pure/dumb if possible, or keep it smart but cleaner.

## 4. Component Design
### 4.1. StaffTable (`staff-table.tsx`)
- **Visuals:**
    - Use `Table` component from Shadcn.
    - **Badges:** Use "outline" variant for skills, "default/secondary/destructive" for roles.
    - **Avatar:** Ensure consistent size (e.g., `h-9 w-9`).
    - **Hover Effects:** Add `hover:bg-muted/50` to rows.
- **Interactions:**
    - Click on row -> View Details (optional, or just Edit).

### 4.2. ScheduleGrid (`schedule-grid.tsx`)
- **Visuals:**
    - Replace raw `div` grid with a more semantic structure or a cleaner CSS Grid.
    - **Headers:** Sticky headers for dates.
    - **Cells:** Clearer distinction between "Work", "Off", and "Empty".
    - **Current Day:** Highlight the current day column.
- **Interactions:**
    - Drag and drop shifts (already implemented, needs polish).
    - Click empty cell -> Add Shift Modal.

### 4.3. PermissionMatrix (`permission-matrix.tsx`)
- **Visuals:**
    - Alternating row colors for readability.
    - Sticky header for Roles.
    - **Checkboxes:** Center aligned.

## 5. Security & Performance
- Ensure `use client` is used appropriately.
- Optimize `ScheduleGrid` rendering (memoization) if the list grows large.
