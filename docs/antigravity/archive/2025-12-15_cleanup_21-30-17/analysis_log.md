# Analysis Log - Table System Review

> **Ngày:** 2025-12-15
> **Phiên:** Table System UX/UI Audit

---

## Files Đã Phân Tích

| File                                                             | Type    | Findings                                                     |
| ---------------------------------------------------------------- | ------- | ------------------------------------------------------------ |
| `shared/ui/table.tsx`                                            | Core    | ✅ Base Shadcn component, chuẩn                              |
| `shared/ui/custom/data-table.tsx`                                | Wrapper | ✅ Well-designed generic component                           |
| `shared/ui/custom/data-table-empty-state.tsx`                    | Support | ⚠️ T-008: Hardcoded blue colors                              |
| `shared/ui/custom/data-table-skeleton.tsx`                       | Support | ✅ OK                                                        |
| `shared/ui/custom/table-action-bar.tsx`                          | Support | ✅ Good floating bar UX                                      |
| `shared/ui/custom/table-row-actions.tsx`                         | Support | ✅ OK                                                        |
| `shared/ui/custom/animated-table-row.tsx`                        | Support | ✅ OK                                                        |
| `shared/ui/custom/pagination-controls.tsx`                       | Support | ✅ OK                                                        |
| `shared/hooks/use-table-params.ts`                               | Hook    | ✅ Good URL state management                                 |
| `shared/hooks/use-table-selection.ts`                            | Hook    | ✅ Clean selection logic                                     |
| `features/customers/components/customer-list/customer-table.tsx` | Feature | ✅ Good reference implementation                             |
| `features/staff/components/staff-list/staff-table.tsx`           | Feature | ✅ Good, has loading overlay                                 |
| `features/services/components/service-table.tsx`                 | Feature | ⚠️ T-004: AlertDialog inline                                 |
| `features/services/components/skill-table.tsx`                   | Feature | ⚠️ T-004: AlertDialog inline, T-010: missing variant         |
| `features/resources/components/resource-table.tsx`               | Feature | ⚠️ T-002, T-003, T-004: Missing sort/pagination, AlertDialog |
| `features/billing/components/invoice-table.tsx`                  | Feature | ⚠️ T-002, T-003: Missing sort/pagination, no empty state     |

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

| Table         | Current Header | Should Be   |
| ------------- | -------------- | ----------- |
| CustomerTable | "Hành động"    | ✅          |
| StaffTable    | "Hành động"    | ✅          |
| ServiceTable  | "Thao tác"     | "Hành động" |
| SkillTable    | "Thao tác"     | "Hành động" |
| ResourceTable | "Hành động"    | ✅          |
| InvoiceTable  | "" (empty)     | "Hành động" |

---

## Dialog Pattern Comparison

| Table         | Pattern Used          | Should Use            |
| ------------- | --------------------- | --------------------- |
| CustomerTable | `DeleteConfirmDialog` | ✅                    |
| StaffTable    | `DeleteConfirmDialog` | ✅                    |
| ServiceTable  | `AlertDialog` inline  | `DeleteConfirmDialog` |
| SkillTable    | `AlertDialog` inline  | `DeleteConfirmDialog` |
| ResourceTable | `AlertDialog` inline  | `DeleteConfirmDialog` |
| InvoiceTable  | N/A (no delete)       | N/A                   |

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

---

# Analysis Log - Resources Module Clean Code

> **Ngày:** 2025-12-15
> **Phiên:** Resources clean-up (types/actions/components)

---

## Files Đã Phân Tích

| File                                  | Findings                                                                                                                                                                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resources/actions.ts`                | Manual number parsing for `capacity/setupTime` bỏ qua case `0`; logic trùng với zod coerce; tags parse ok nhưng default `[]` khi JSON parse fail. In-memory mock, no persistence.                                                    |
| `resources/schemas.ts`                | Đã dùng `z.coerce` + default `setupTime: 0`; `capacity` optional `min(0)` nên tạo phòng với `0` bị từ chối.                                                                                                                          |
| `resources/types.ts`                  | Type basic, `capacity` optional; `Resource` chưa có `groupId` bắt buộc nên cần đồng bộ với schema (schema yêu cầu).                                                                                                                  |
| `resources/data/mocks.ts`             | Mock ngắn, không include `status` cho maintenance task? (có), ok.                                                                                                                                                                    |
| `components/resource-page.tsx`        | 3 wrapper components lặp `use(resourcesPromise)`, `use(groupsPromise)`; có thể gom hook để giảm lặp. Tabs state trong client component.                                                                                              |
| `components/resource-sheet.tsx`       | `React.useActionState(manageResource)` + FormData builder. `defaultValues` trùng với reset logic; có thể tách `getDefaultValues(mode, resource)`. No client validation message mapping.                                              |
| `components/resource-form.tsx`        | Conditional render theo group.type; TagInput dùng `selectedIds=[]` + `newTags=field.value`, `onSelectedChange` noop -> hơi lạ nhưng vẫn hoạt động. Capacity input type=number nhưng form value có thể là string; rely on zod coerce. |
| `components/resource-table.tsx`       | Bulk delete gọi deleteResource tuần tự, không batch; loading overlay trống; columns inline. Uses DeleteConfirmDialog (ok).                                                                                                           |
| `components/resource-actions.tsx`     | Extra menu item placeholder.                                                                                                                                                                                                         |
| `components/resource-filter.tsx`      | Filter uses `useFilterParams`, ok.                                                                                                                                                                                                   |
| `components/resource-toolbar.tsx`     | Search param hook, ok.                                                                                                                                                                                                               |
| `components/maintenance-timeline.tsx` | Timeline grid ok; task map memo good.                                                                                                                                                                                                |

## Rủi Ro/Hạn Chế Hiện Tại

- `manageResource` parse thủ công: `if (rawData.capacity)` bỏ qua giá trị `0`, dễ lệch validation.
- Form reset logic lặp, dễ thiếu field mới. `ResourceSheet` defaultValues + reset thân hàm.
- Type/schema mismatch: schema yêu cầu `groupId` bắt buộc, nhưng `Resource` interface cho phép undefined → dễ sai khi tiêu thụ type.
- TagInput API chưa rõ: selectedIds luôn rỗng, chỉ dùng newTags → khó mở rộng chọn tag có sẵn.
- Bulk delete tuần tự; overlay không hiển thị spinner; nhưng chấp nhận được cho mock.

## Cơ Hội Dọn Dẹp (Non-breaking)

1. Gom `buildResourceFormData` + bỏ parse thủ công; rely on zod coerce (giải quyết case 0).
2. Tạo `getDefaultResourceValues(mode, resource)` để dùng chung cho `defaultValues` + `reset`.
3. Cập nhật `Resource` type: `groupId` bắt buộc, `setupTime` default 0. Đảm bảo các usages phù hợp.
4. Đơn giản hóa wrapper components trong `resource-page.tsx` bằng hook dùng chung (reduce duplication, giữ Suspense UI).
5. (Optional) Thêm loading indicator trong bulk delete overlay.

---
