# Change Log - Table System Refactor

> **Ngày:** 2025-12-15
> **Phiên:** Table System UX/UI Consistency Fixes

---

## Tóm Tắt

Refactor hệ thống Table để đảm bảo tính nhất quán về UX/UI trên toàn bộ dự án Synapse.

---

## Thay Đổi Chi Tiết

### 1. `shared/ui/custom/data-table-empty-state.tsx`
**Issue:** T-008 - Hardcoded colors
**Thay đổi:**
- `bg-white/50` → `bg-background/50`
- `border-slate-300` → `border-border`
- `bg-blue-50` → `bg-primary/10`
- `text-blue-500` → `text-primary`
- `text-slate-900` → `text-foreground`
- `text-slate-500` → `text-muted-foreground`

**Lý do:** Sử dụng CSS variables để hỗ trợ dark mode và theme customization.

---

### 2. `features/services/components/service-table.tsx`
**Issues:** T-001, T-004
**Thay đổi:**
- Header `"Thao tác"` → `"Hành động"` (consistency)
- Thêm `className: "pr-6 text-right"` (alignment)
- Thay `AlertDialog` inline (31 dòng) → `DeleteConfirmDialog` (7 dòng)
- Xóa imports không cần thiết của AlertDialog components

**Lý do:** Giảm code duplication, tuân thủ COMPONENT_PATTERNS.md

---

### 3. `features/services/components/skill-table.tsx`
**Issues:** T-001, T-004, T-010
**Thay đổi:**
- Header `"Thao tác"` → `"Hành động"`
- Thêm `className: "pr-6 text-right"`
- Thay `AlertDialog` inline → `DeleteConfirmDialog`
- Thêm `variant` prop vào interface và component
- Xóa imports không cần thiết

**Lý do:** Consistency với các tables khác

---

### 4. `features/resources/components/resource-table.tsx`
**Issues:** T-004
**Thay đổi:**
- Thay `AlertDialog` inline → `DeleteConfirmDialog`
- Cập nhật `className` cho action column: `"pr-6"` → `"pr-6 text-right"`
- Xóa imports không cần thiết của AlertDialog components

**Lý do:** Tuân thủ pattern chuẩn DeleteConfirmDialog

---

### 5. `features/billing/components/invoice-table.tsx`
**Issue:** T-001
**Thay đổi:**
- Header `""` (empty) → `"Hành động"`
- Thêm `className: "pr-6 text-right"`

**Lý do:** Tất cả tables nên có action header nhất quán

---

## Files Đã Sửa

| File | Lines Changed | Issues Fixed |
|------|---------------|--------------|
| `data-table-empty-state.tsx` | 6 | T-008 |
| `service-table.tsx` | -10 (đã giảm~35 LOC) | T-001, T-004 |
| `skill-table.tsx` | -14 (đã giảm~30 LOC) | T-001, T-004, T-010 |
| `resource-table.tsx` | -17 (đã giảm~28 LOC) | T-004 |
| `invoice-table.tsx` | 2 | T-001 |

**Tổng cộng:** ~93 dòng code được loại bỏ/cải thiện

---

## Verification

| Check | Status |
|-------|--------|
| `pnpm lint` | ✅ Pass (0 errors) |
| `pnpm build` | ✅ Pass (Exit code: 0) |

---

## Pattern Áp Dụng

### Trước (Pattern Cũ - Không Nhất Quán)
```tsx
<AlertDialog open={showDialog} onOpenChange={setShowDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Xóa {count} items?</AlertDialogTitle>
      <AlertDialogDescription>
        Hành động này không thể hoàn tác...
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete} disabled={isPending}>
        {isPending ? "Đang xóa..." : `Xóa ${count} mục`}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Sau (Pattern Chuẩn - Nhất Quán)
```tsx
<DeleteConfirmDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  onConfirm={handleDelete}
  isDeleting={isPending}
  entityName={`${count} items`}
/>
```

---

## Remaining Issues (Không Trong Scope)

| ID | Vấn đề | Status |
|----|--------|--------|
| T-002 | Missing Sort trong ResourceTable, InvoiceTable | ⏸️ Deferred |
| T-003 | Missing Pagination trong ResourceTable, InvoiceTable | ⏸️ Deferred |
| T-006 | Loading Overlay Duplication | ⏸️ Deferred |
| T-007 | Typography Inconsistency | ⏸️ Deferred |
