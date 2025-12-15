# Kế Hoạch Đánh Giá & Cải Thiện Hệ Thống Table

> **Ngày tạo:** 2025-12-15
> **Trạng thái:** 🟡 CHỜ PHÊ DUYỆT
> **Vai trò:** UX/UI Reviewer & Front-end Design System Specialist

---

## 1. VẤN ĐỀ (Problem Statement)

### 1.1. Phạm Vi Đánh Giá
Hệ thống **Synapse** hiện có **7 bảng dữ liệu (DataTable)** được sử dụng trong các module khác nhau:

| # | Component | Vị trí | Tính năng |
|---|-----------|--------|-----------|
| 1 | `CustomerTable` | `features/customers/` | Selection, Sort, Pagination, Actions |
| 2 | `StaffTable` | `features/staff/` | Selection, Sort, Pagination, Actions |
| 3 | `ServiceTable` | `features/services/` | Selection, Sort, Pagination, Actions |
| 4 | `SkillTable` | `features/services/` | Selection, Pagination, Actions |
| 5 | `ResourceTable` | `features/resources/` | Selection, Actions |
| 6 | `InvoiceTable` | `features/billing/` | View action only |
| 7 | `DataTable` (Shared) | `shared/ui/custom/` | Core component |

### 1.2. Các Thành Phần Liên Quan
- **Core Table Components:** `table.tsx` (base Shadcn), `data-table.tsx` (wrapper)
- **Supporting Components:**
  - `animated-table-row.tsx` - Row với animation
  - `data-table-empty-state.tsx` - Empty state
  - `data-table-skeleton.tsx` - Loading skeleton
  - `table-action-bar.tsx` - Floating action bar
  - `table-row-actions.tsx` - Row-level actions
  - `pagination-controls.tsx` - Phân trang
- **Hooks:** `use-table-params.ts`, `use-table-selection.ts`
- **Types:** `design-system.types.ts` (SelectionConfig, SortConfig)

---

## 2. MỤC ĐÍCH (Objectives)

### 2.1. Mục Tiêu Chính
| Mục tiêu | Mô tả | Độ ưu tiên |
|----------|-------|------------|
| **Consistency** | Đảm bảo tất cả tables sử dụng cùng patterns và styles | 🔴 Cao |
| **Usability** | Cải thiện trải nghiệm đọc, lọc, sắp xếp dữ liệu | 🔴 Cao |
| **Accessibility** | Đảm bảo keyboard navigation, screen reader support | 🟠 Trung bình |
| **Performance** | Tối ưu render, tránh re-render không cần thiết | 🟠 Trung bình |
| **Maintainability** | Giảm code duplication, DRY principles | 🟢 Thấp |

### 2.2. Deliverables
1. **Báo cáo đánh giá chi tiết** với danh sách issues và severity
2. **Recommendations** cho từng vấn đề phát hiện
3. **Code changes** (nếu được duyệt) để fix các inconsistencies

---

## 3. PHÂN TÍCH SƠ BỘ (Initial Analysis)

### 3.1. ✅ Điểm Mạnh Hiện Tại

| Khía cạnh | Đánh giá | Chi tiết |
|-----------|----------|----------|
| **Architecture** | ⭐⭐⭐⭐ | Có core `DataTable` component tái sử dụng tốt |
| **Selection System** | ⭐⭐⭐⭐ | `useTableSelection` hook được thiết kế gọn gàng |
| **URL State** | ⭐⭐⭐⭐ | `useTableParams` sync state với URL params |
| **Type Safety** | ⭐⭐⭐⭐ | Generic types cho Column và DataTable |
| **Localization** | ⭐⭐⭐⭐⭐ | Toàn bộ UI text bằng Tiếng Việt |
| **Action Bar** | ⭐⭐⭐⭐ | Floating action bar UX hiện đại |

### 3.2. ⚠️ Vấn Đề Phát Hiện

#### **Mức Độ: CAO (Critical)**

| ID | Vấn đề | File ảnh hưởng | Mô tả |
|----|--------|----------------|-------|
| T-001 | **Inconsistent Action Column Header** | Multiple tables | Một số dùng "Hành động", số khác dùng "Thao tác", hoặc "" (empty) |
| T-002 | **Inconsistent Sort Implementation** | `ResourceTable`, `InvoiceTable` | Không có sort support mặc dù DataTable hỗ trợ |
| T-003 | **Missing Pagination** | `ResourceTable`, `InvoiceTable` | Không có phân trang mặc dù DataTable hỗ trợ |
| T-004 | **Dialog Pattern Inconsistency** | `service-table.tsx`, `resource-table.tsx`, `skill-table.tsx` | Sử dụng `AlertDialog` inline thay vì `DeleteConfirmDialog` wrapper |

#### **Mức Độ: TRUNG BÌNH (Medium)**

| ID | Vấn đề | File ảnh hưởng | Mô tả |
|----|--------|----------------|-------|
| T-005 | **Empty State Icon Inconsistency** | Multiple tables | Một số dùng animated icons, số khác dùng Lucide icons |
| T-006 | **Loading Overlay Duplication** | `CustomerTable`, `StaffTable`, `ResourceTable` | Copy-paste loading overlay thay vì component chung |
| T-007 | **Typography Inconsistency** | Multiple tables | Mix giữa `text-sm`, `text-lg font-serif`, styles khác nhau cho tên entities |
| T-008 | **DataTableEmptyState Hardcoded Colors** | `data-table-empty-state.tsx` | Sử dụng hardcoded `bg-blue-50`, `text-blue-500` thay vì CSS variables |

#### **Mức Độ: THẤP (Low)**

| ID | Vấn đề | File ảnh hưởng | Mô tả |
|----|--------|----------------|-------|
| T-009 | **Deep Imports** | Some feature tables | Một số import trực tiếp từ `@/shared/ui/custom/*` thay vì barrel export |
| T-010 | **Missing variant prop** | `SkillTable` | Không truyền `variant` prop cho DataTable |
| T-011 | **Skeleton Config Mismatch** | Various `*TableSkeleton` | Column counts không match với actual columns |

### 3.3. 📊 Ma Trận So Sánh Chi Tiết

| Feature | CustomerTable | StaffTable | ServiceTable | SkillTable | ResourceTable | InvoiceTable |
|---------|--------------|------------|--------------|------------|---------------|--------------|
| **Selection** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Sorting** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Pagination** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Row Click** | ✅ Edit | ✅ Edit | ✅ Edit | ❌ | ✅ Edit | ❌ |
| **Empty State** | ✅ Animated | ✅ Animated | ✅ Plus icon | ✅ Plus icon | ✅ Box icon | ❌ |
| **Skeleton** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Bulk Delete** | ✅ DeleteConfirm | ✅ DeleteConfirm | ✅ AlertDialog | ✅ AlertDialog | ✅ AlertDialog | ❌ |
| **Variant** | ✅ | ✅ | ✅ | ❌ default | ✅ | ❌ default |
| **Loading Overlay** | ✅ Custom | ✅ Custom | ❌ | ❌ | ✅ Custom | ❌ |

---

## 4. RÀNG BUỘC (Constraints)

### 4.1. Phải Tuân Thủ
- ❌ **KHÔNG** thay đổi logic nghiệp vụ hoặc cấu trúc dữ liệu
- ❌ **KHÔNG** thay đổi API contracts hoặc response schemas
- ✅ Tuân thủ Design System hiện tại (colors, typography, spacing)
- ✅ Đảm bảo Accessibility (WCAG 2.1 AA)
- ✅ Tuân thủ FSD Import patterns (barrel exports)

### 4.2. Technical Constraints
- React 19 với Server Components
- Next.js 15+ App Router
- Tailwind CSS + Shadcn/UI
- TypeScript strict mode

---

## 5. CHIẾN LƯỢC (Strategy)

### 5.1. Phương Pháp Tiếp Cận
```
Phase 1: AUDIT        → Đánh giá chi tiết từng table, ghi log findings
Phase 2: STANDARDIZE  → Chuẩn hóa shared components (EmptyState, LoadingOverlay)
Phase 3: FIX-CRITICAL → Fix các issues mức CAO
Phase 4: FIX-MEDIUM   → Fix các issues mức TRUNG BÌNH
Phase 5: VERIFY       → Chạy lint/build, manual testing
```

### 5.2. Ưu Tiên Sửa Chữa

| Thứ tự | Issue IDs | Effort | Impact |
|--------|-----------|--------|--------|
| 1 | T-004 | Medium | High - Pattern consistency |
| 2 | T-001 | Low | High - UX consistency |
| 3 | T-008 | Low | Medium - Theme support |
| 4 | T-006 | Medium | Medium - DRY code |
| 5 | T-005, T-007 | Medium | Medium - Visual consistency |
| 6 | T-009 | Low | Low - Code quality |
| 7 | T-002, T-003 | Medium | Low - Optional features |

---

## 6. GIẢI PHÁP ĐỀ XUẤT (Proposed Solutions)

### 6.1. T-001: Standardize Action Column Header
```tsx
// Đề xuất: Thống nhất sử dụng "Hành động" cho tất cả tables
{
  header: "Hành động",
  className: "pr-6 text-right",
  cell: (item) => <EntityActions ... />
}
```

### 6.2. T-004: Migrate to DeleteConfirmDialog Pattern
```tsx
// Từ: AlertDialog inline (verbose)
<AlertDialog open={showBulkDeleteDialog} ...>
  <AlertDialogContent>...</AlertDialogContent>
</AlertDialog>

// Đến: DeleteConfirmDialog (consistent)
<DeleteConfirmDialog
  open={showBulkDeleteDialog}
  onOpenChange={setShowBulkDeleteDialog}
  onConfirm={handleBulkDelete}
  isDeleting={isPending}
  entityName={`${selection.selectedCount} dịch vụ`}
/>
```

### 6.3. T-006: Create Shared Loading Overlay
```tsx
// shared/ui/custom/table-loading-overlay.tsx
interface TableLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function TableLoadingOverlay({
  isVisible,
  message = "Đang xử lý..."
}: TableLoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[2px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        {message}
      </p>
    </div>
  );
}
```

### 6.4. T-008: Fix DataTableEmptyState Theme Colors
```tsx
// Từ: Hardcoded colors
<div className="p-4 rounded-full bg-blue-50 mb-4">
  <Icon className="w-10 h-10 text-blue-500" />
</div>

// Đến: CSS Variables
<div className="p-4 rounded-full bg-primary/10 mb-4">
  <Icon className="w-10 h-10 text-primary" />
</div>
```

---

## 7. DANH SÁCH TASKS

| Task | Mô tả | Est. Effort |
|------|-------|-------------|
| TASK-01 | Fix T-008: Cập nhật `data-table-empty-state.tsx` với theme colors | 10 min |
| TASK-02 | Fix T-001: Thống nhất header "Hành động" trong tất cả tables | 15 min |
| TASK-03 | Fix T-004: Migrate `ServiceTable`, `ResourceTable`, `SkillTable` sang `DeleteConfirmDialog` | 30 min |
| TASK-04 | Create `TableLoadingOverlay` component và refactor usages | 30 min |
| TASK-05 | Fix T-009: Update deep imports to barrel exports | 15 min |
| TASK-06 | Fix T-010, T-011: Add missing props và correct skeleton configs | 15 min |
| TASK-07 | Run lint & build verification | 10 min |

**Tổng thời gian ước tính:** ~2 giờ

---

## 8. QUYẾT ĐỊNH CẦN XÁC NHẬN

> ⚠️ **CẦN PHẢN HỒI TỪ NGƯỜI DÙNG:**

1. **Có đồng ý với danh sách issues đã phát hiện?**
   - [ ] Đồng ý toàn bộ
   - [ ] Cần bổ sung/điều chỉnh

2. **Có muốn thực hiện fix ngay các issues?**
   - [ ] Thực hiện tất cả (Full refactor)
   - [ ] Chỉ fix Critical issues (T-001, T-004)
   - [ ] Chỉ cần báo cáo, không fix

3. **Có cần thêm features mới cho tables không được hỗ trợ?**
   - [ ] Thêm Sort cho ResourceTable, InvoiceTable
   - [ ] Thêm Pagination cho ResourceTable, InvoiceTable
   - [ ] Không cần, giữ nguyên scope hiện tại

---

**⏸️ DỪNG TẠI ĐÂY - ĐANG CHỜ PHÊ DUYỆT TỪ NGƯỜI DÙNG**
