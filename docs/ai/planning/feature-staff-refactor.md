---
title: Staff Feature Refactoring Plan
status: Draft
priority: High
assignee: AI
---

# Staff Feature Refactoring Plan

## 1. Task Decomposition

### Phase 1: Setup & Cleanup
- [ ] Create `constants.ts` and move `roleConfig`, `MODULES`, `ROLES` there.
- [ ] Review `types.ts` and ensure all types are exported and used.

### Phase 2: Staff List Refactor
- [ ] Refactor `StaffTable` to improve Badge styling and spacing.
- [ ] Add "Role" filter dropdown to `StaffPage` (or `StaffTable` toolbar).
- [ ] Improve `StaffActions` dropdown menu visuals.

### Phase 3: Schedule Grid Refactor
- [ ] Refactor `ScheduleGrid` layout to use cleaner CSS Grid or Table.
- [ ] Improve "Shift" card styling (rounded corners, better colors).
- [ ] Add "Add Shift" icon button instead of text.
- [ ] Highlight "Today" column.

### Phase 4: Permission Matrix Refactor
- [ ] Improve `PermissionMatrix` table styling (row hover, sticky header).
- [ ] Ensure "Admin" disabled state is visually clear (e.g., lock icon).

### Phase 5: Verification
- [ ] Verify all interactions (Add, Edit, Delete, Drag & Drop).
- [ ] Check responsiveness on smaller screens.

## 2. Dependencies
- None.

## 3. Effort Estimates
- Setup: 0.5h
- Staff List: 1h
- Schedule Grid: 2h
- Permission Matrix: 1h
- Verification: 0.5h
- **Total:** ~5 hours

## 4. Execution Order
1. Setup
2. Staff List
3. Permission Matrix
4. Schedule Grid (Most complex)
