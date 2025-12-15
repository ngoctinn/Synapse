# Kế Hoạch Triển Khai: Sheet Component Standardization (Synapse)

**Ngày tạo**: 2025-12-15
**Cập nhật**: 2025-12-15 15:17
**Trạng thái**: ✅ ĐÃ PHÊ DUYỆT - ĐANG THỰC THI
**Vai trò**: Front-end Auditor & UI Consistency Specialist

---

## 1. Vấn Đề (Problem)

### 1.1. Tổng Quan Component Sheet

Hệ thống Sheet trong Synapse có **9 files** sử dụng Sheet component:

| # | File | Feature | Tuân thủ |
|---|------|---------|----------|
| 1 | `customer-sheet.tsx` | Customers | 75% |
| 2 | `service-sheet.tsx` | Services | 83% |
| 3 | `staff-sheet.tsx` | Staff | 83% |
| 4 | `resource-sheet.tsx` | Resources | 83% |
| 5 | `appointment-sheet.tsx` | Appointments | 92% |
| 6 | `invoice-sheet.tsx` | Billing | **33%** ❌ |
| 7 | `exception-sheet.tsx` | Settings | 83% |
| 8 | `add-shift-dialog.tsx` | Staff (Scheduling) | **33%** ❌ |
| 9 | `mobile-user-sheet.tsx` | Shared Layout | 50% |

### 1.2. Các Vấn Đề Cụ Thể

#### A. Import Pattern Không Nhất Quán (78% vi phạm)

**Deep Import (SAI):**
```tsx
import { Sheet, SheetContent } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
```

**Barrel Import (ĐÚNG theo COMPONENT_PATTERNS.md):**
```tsx
import { Sheet, SheetContent, Button } from "@/shared/ui";
```

#### B. SheetContent className Không Thống Nhất

| File | Vấn đề |
|------|--------|
| `invoice-sheet.tsx` | `w-[400px] sm:w-[540px]` - Fixed width, không theo pattern |
| `customer-sheet.tsx` | Có thêm `transition-all duration-300` |

#### C. Scroll Area Pattern

| File | Cách xử lý |
|------|-----------|
| Đa số | `<div className="sheet-scroll-area">` ✅ |
| `invoice-sheet.tsx` | `<ScrollArea>` component ❌ |
| `add-shift-dialog.tsx` | Inline `overflow-y-auto` ❌ |

#### D. Tên File Bất Nhất

- `add-shift-dialog.tsx` dùng Sheet nhưng tên là "Dialog"

---

## 2. Mục Đích (Goal)

1. **Refactor Import Paths**: 8 files → Barrel Import `@/shared/ui`
2. **Standardize SheetContent className**: Pattern nhất quán
3. **Standardize Scroll Area**: Sử dụng `sheet-scroll-area` class
4. **Fix Naming**: Rename `add-shift-dialog.tsx` → `add-shift-sheet.tsx`
5. **Update Documentation**: Cập nhật COMPONENT_PATTERNS.md với Sheet Size Variants

---

## 3. Ràng Buộc (Constraints)

- ✅ Không thay đổi behavior/logic
- ✅ Backward compatible
- ✅ Build phải pass (`pnpm lint`, `pnpm build`)
- ✅ Giữ nguyên Tiếng Việt

---

## 4. Chiến Lược (Strategy)

### Phase 1: Import Refactoring (Ưu tiên Cao)
Chuyển tất cả Deep Imports sang Barrel Imports.

### Phase 2: Structure Standardization (Ưu tiên Trung bình)
Fix `invoice-sheet.tsx` và `add-shift-dialog.tsx`.

### Phase 3: Cleanup & Documentation (Ưu tiên Thấp)
Loại bỏ className override thừa, cập nhật docs.

---

## 5. Task Breakdown

### Phase 1: Import Refactoring

| Task | File | Trạng thái |
|------|------|------------|
| P1-01 | `customer-sheet.tsx` | ⏳ |
| P1-02 | `service-sheet.tsx` | ⏳ |
| P1-03 | `staff-sheet.tsx` | ⏳ |
| P1-04 | `resource-sheet.tsx` | ⏳ |
| P1-05 | `exception-sheet.tsx` | ⏳ |
| P1-06 | `invoice-sheet.tsx` | ⏳ |
| P1-07 | `add-shift-dialog.tsx` | ⏳ |
| P1-08 | `mobile-user-sheet.tsx` | ⏳ |

### Phase 2: Structure Standardization

| Task | Description | Trạng thái |
|------|-------------|------------|
| P2-01 | Fix `invoice-sheet.tsx` pattern | ⏳ |
| P2-02 | Fix `add-shift-dialog.tsx` scroll+footer | ⏳ |
| P2-03 | Rename `add-shift-dialog.tsx` → `add-shift-sheet.tsx` | ⏳ |
| P2-04 | Update import in `staff-scheduler.tsx` | ⏳ |

### Phase 3: Documentation

| Task | Description | Trạng thái |
|------|-------------|------------|
| P3-01 | Add Sheet Size Variants to COMPONENT_PATTERNS.md | ⏳ |

---

## 6. Rủi Ro & Biện Pháp

| Rủi Ro | Biện Pháp |
|--------|----------|
| Break imports | Thêm exports trước, refactor sau |
| TypeScript errors | Build check sau mỗi phase |
| Rename file | Update tất cả imports trước khi rename |

---

## 7. Definition of Done

- [ ] Tất cả 8 Sheet files sử dụng Barrel Import
- [ ] `invoice-sheet.tsx` theo pattern chuẩn
- [ ] `add-shift-sheet.tsx` (renamed) theo pattern chuẩn
- [ ] `pnpm lint` pass
- [ ] `pnpm build` pass
- [ ] COMPONENT_PATTERNS.md cập nhật Sheet Size Variants
- [ ] change-log.md ghi nhận thay đổi

---

**✅ PLAN APPROVED - PROCEEDING TO PHASE 2: SPLIT**
