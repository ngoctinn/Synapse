# UI Component Audit - Action Checklist

## 🔴 CRITICAL (Xử lý ngay)

- [ ] **CRITICAL-001**: Rename `CustomDialog` → `ConfirmDialog` hoặc `PromptDialog`
  - File: `shared/ui/custom/dialog.tsx`
  - Update: `shared/ui/index.ts` line 26

- [ ] **CRITICAL-002**: Merge Sonner components
  - Files: `shared/ui/sonner.tsx` + `shared/ui/custom/sonner.tsx`
  - Action: Giữ custom sonner, xóa primitive wrapper

- [ ] **CRITICAL-003**: Remove deprecated StatusBadge
  - Delete: `shared/ui/custom/status-badge.tsx`
  - Update: `shared/ui/index.ts` (remove export line 33)
  - Migrate: `features/` files sử dụng → `Badge variant="status-active"`

- [ ] **CRITICAL-004**: Replace raw AlertDialogs
  - Files:
    - `features/staff/components/staff-list/staff-table.tsx`
    - `features/settings/operating-hours/components/schedule-editor.tsx`
    - `features/settings/operating-hours/components/operating-hours-form.tsx`
    - `features/customers/components/customer-list/customer-table.tsx`
  - Action: Import và sử dụng `DeleteConfirmDialog`

## 🟠 HIGH (Xử lý trong sprint này)

- [ ] **HIGH-001**: Standardize icon size → `size-4`
  - Tool: `grep -r "h-4 w-4" frontend/src/features/ | wc -l` (~68 files)
  - Replace: `h-4 w-4` → `size-4`

- [ ] **HIGH-002**: Use `startContent` prop instead of `mr-2`
  - Pattern: `<Icon className="mr-2 ..." />` → `startContent={<Icon />}`
  - Files: ~47 instances

- [ ] **HIGH-003**: Standardize Form Tabs
  - Decision: Use `FormTabs` or primitive `Tabs`?
  - Sync: service-form, customer-form, resource-form

- [ ] **HIGH-004**: Standardize Input height
  - Decision: `h-9` (default) or `h-10`?
  - Apply: All form inputs

- [ ] **HIGH-005**: Use `RequiredMark` component
  - Import from: `@/shared/ui/custom/required-mark`
  - Replace: Inline `<span className="text-destructive">*</span>`

- [ ] **HIGH-006**: Create `OptionalMark` component
  - Base on: Pattern từ customer-form.tsx line 156

## 🟡 MEDIUM (Backlog)

- [ ] MEDIUM-001: Replace hardcoded destructive styles with Button variant
- [ ] MEDIUM-002: Standardize text sizes (text-sm vs text-xs)
- [ ] MEDIUM-003: Replace raw colors with design tokens
- [ ] MEDIUM-004: Standardize transition durations
- [ ] MEDIUM-005: Define border radius usage guide
- [ ] MEDIUM-006: Prefer `gap` over `space-x/y`
- [ ] MEDIUM-007: Add shadow tokens to tailwind config
- [ ] MEDIUM-008: Create animation utility classes

## 🟢 LOW (Nice to have)

- [ ] LOW-001: Standardize loading state prop naming
- [ ] LOW-002: Clean up intermediate mode variables
- [ ] LOW-003: Document event handler naming conventions
- [ ] LOW-004: Migrate to barrel imports from `@/shared/ui`
- [ ] LOW-005: Standardize export style

---

## Quick Reference Commands

```bash
# Find all h-4 w-4 patterns
grep -rn "h-4 w-4" frontend/src/features/ --include="*.tsx"

# Find all mr-2 with icons
grep -rn "mr-2 h-" frontend/src/features/ --include="*.tsx"

# Find all StatusBadge usages
grep -rn "StatusBadge" frontend/src/ --include="*.tsx"

# Find raw color usages
grep -rn "emerald-\|green-\|orange-" frontend/src/features/ --include="*.tsx"
```

---

*Generated: 2025-12-13*
