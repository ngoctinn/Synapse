# Analysis Log - Table System Review

> **Ngày:** 2025-12-15
> **Phiên:** Table System UX/UI Audit

---

## Files Đã Phân Tích

| File | Type | Findings |
|------|------|----------|
| `shared/ui/table.tsx` | Core | ✅ Base Shadcn component, chuẩn |
| `shared/ui/custom/data-table.tsx` | Wrapper | ✅ Well-designed generic component |
| `shared/ui/custom/data-table-empty-state.tsx` | Support | ⚠️ T-008: Hardcoded blue colors |
| `shared/ui/custom/data-table-skeleton.tsx` | Support | ✅ OK |
| `shared/ui/custom/table-action-bar.tsx` | Support | ✅ Good floating bar UX |
| `shared/ui/custom/table-row-actions.tsx` | Support | ✅ OK |
| `shared/ui/custom/animated-table-row.tsx` | Support | ✅ OK |
| `shared/ui/custom/pagination-controls.tsx` | Support | ✅ OK |
| `shared/hooks/use-table-params.ts` | Hook | ✅ Good URL state management |
| `shared/hooks/use-table-selection.ts` | Hook | ✅ Clean selection logic |
| `features/customers/components/customer-list/customer-table.tsx` | Feature | ✅ Good reference implementation |
| `features/staff/components/staff-list/staff-table.tsx` | Feature | ✅ Good, has loading overlay |
| `features/services/components/service-table.tsx` | Feature | ⚠️ T-004: AlertDialog inline |
| `features/services/components/skill-table.tsx` | Feature | ⚠️ T-004: AlertDialog inline, T-010: missing variant |
| `features/resources/components/resource-table.tsx` | Feature | ⚠️ T-002, T-003, T-004: Missing sort/pagination, AlertDialog |
| `features/billing/components/invoice-table.tsx` | Feature | ⚠️ T-002, T-003: Missing sort/pagination, no empty state |

---

## Dependencies Map

```
DataTable (shared)
├── Table, TableHeader, TableBody, TableRow, TableCell, TableHead (shadcn)
├── Checkbox (shadcn)
├── AnimatedTableRow
├── DataTableSkeleton
├── PaginationControls
└── design-system.types (SelectionConfig, SortConfig)

Feature Tables
├── DataTable
├── DataTableEmptyState
├── DataTableSkeleton
├── TableActionBar
├── useTableParams
├── useTableSelection
├── DeleteConfirmDialog OR AlertDialog (inconsistent!)
└── Feature-specific Actions components
```

---

## Action Column Header Values

| Table | Current Header | Should Be |
|-------|---------------|-----------|
| CustomerTable | "Hành động" | ✅ |
| StaffTable | "Hành động" | ✅ |
| ServiceTable | "Thao tác" | "Hành động" |
| SkillTable | "Thao tác" | "Hành động" |
| ResourceTable | "Hành động" | ✅ |
| InvoiceTable | "" (empty) | "Hành động" |

---

## Dialog Pattern Comparison

| Table | Pattern Used | Should Use |
|-------|--------------|------------|
| CustomerTable | `DeleteConfirmDialog` | ✅ |
| StaffTable | `DeleteConfirmDialog` | ✅ |
| ServiceTable | `AlertDialog` inline | `DeleteConfirmDialog` |
| SkillTable | `AlertDialog` inline | `DeleteConfirmDialog` |
| ResourceTable | `AlertDialog` inline | `DeleteConfirmDialog` |
| InvoiceTable | N/A (no delete) | N/A |

---

## Execution Plan

### Phase 1: Fix Shared Components
- [ ] T-008: Update `data-table-empty-state.tsx` theme colors

### Phase 2: Fix Feature Tables
- [ ] T-001: Standardize headers in ServiceTable, SkillTable, InvoiceTable
- [ ] T-004: Migrate ServiceTable to DeleteConfirmDialog
- [ ] T-004: Migrate SkillTable to DeleteConfirmDialog
- [ ] T-004: Migrate ResourceTable to DeleteConfirmDialog
- [ ] T-010: Add variant prop to SkillTable

### Phase 3: Verify
- [ ] pnpm lint
- [ ] pnpm build
