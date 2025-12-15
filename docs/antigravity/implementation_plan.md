# Kế Hoạch Triển Khai: Kiểm Toán Tính Nhất Quán Frontend (Synapse)

**Ngày tạo**: 2025-12-15
**Trạng thái**: ⏳ CHỜ PHÊ DUYỆT
**Vai trò**: Front-end Architect & UX/UI Auditor

---

## 1. Vấn Đề (Problem)

### 1.1. Tổng Quan Kiến Trúc Hiện Tại

Dự án Synapse sử dụng **Next.js 15** với kiến trúc **Feature-Sliced Design (FSD)**:
- **15 Feature modules** độc lập (`admin`, `appointments`, `auth`, `billing`, `booking-wizard`, `chat`, `customer-dashboard`, `customers`, `landing-page`, `notifications`, `resources`, `reviews`, `services`, `settings`, `staff`)
- **Shared UI library** tại `shared/ui/` (55+ components Shadcn/UI + 31 custom components)
- **Shared hooks** tại `shared/hooks/` (11 hooks)
- **Shared lib** tại `shared/lib/` (validations, utils, supabase)

### 1.2. Đánh Giá Điểm Mạnh ✅

| Lĩnh Vực | Điểm Mạnh | Chi Tiết |
|----------|-----------|----------|
| **Barrel Exports** | Tốt | `shared/ui/index.ts` export 295 dòng, đóng vai trò Public API rõ ràng |
| **CRUD Actions Pattern** | Nhất quán | `*-actions.tsx` pattern giống nhau (staff, customer, resource, service) |
| **Delete Dialog** | Đã chuẩn hóa | Sử dụng `DeleteConfirmDialog` + `useDeleteAction` hook |
| **Sheet Pattern** | Khá nhất quán | `*-sheet.tsx` pattern với `useActionState` + `react-hook-form` |
| **Table Pattern** | Tốt | Sử dụng `DataTable` component chung từ `shared/ui/custom` |
| **Validation Library** | Đã được refactor | `shared/lib/validations/` với primitives, messages, index |

### 1.3. Các Vấn Đề Phát Hiện ⚠️

#### A. Import Path Không Nhất Quán

| Pattern | Files Sử Dụng | Vấn đề |
|---------|---------------|--------|
| `@/shared/ui` | Phần lớn | ✅ Đúng chuẩn |
| `@/shared/ui/dropdown-menu` | staff-actions, resource-actions | ⚠️ Deep import |
| `@/shared/ui/custom/table-row-actions` | Tất cả *-actions | ⚠️ Deep import |
| `@/shared/ui/dialog` | confirm-dialog.tsx (internal) | ✅ OK cho file nội bộ |

**Khuyến nghị**: `TableRowActions` và `DropdownMenu*` nên được export qua `@/shared/ui` chính.

#### B. Dialog System Phức Tạp

Hệ thống có **4 loại Dialog**:
1. `Dialog` (Radix primitive) - Base component
2. `AlertDialog` (Radix primitive) - Cho destructive actions
3. `ConfirmDialog` (custom) - 4 variants (success/info/warning/error)
4. `DeleteConfirmDialog` (custom) - Specialization của AlertDialog

**Đánh giá**:
- ✅ `DeleteConfirmDialog` được sử dụng nhất quán qua `useDeleteAction`
- ⚠️ `ConfirmDialog` chưa được sử dụng rộng rãi (chỉ export nhưng ít import trong features)
- ⚠️ Một số feature vẫn tự xây dựng dialog riêng

#### C. Form Schema Pattern Chưa Thống Nhất Hoàn Toàn

| Feature | Schema Location | Sử dụng shared validations? |
|---------|-----------------|----------------------------|
| `customers` | `model/schemas.ts` | ⚠️ Cần verify |
| `staff` | `model/schemas.ts` | ⚠️ Cần verify |
| `customer-dashboard` | `schemas.ts`, `schemas/booking-schema.ts` | ⚠️ 2 files |
| `booking-wizard` | `schemas.ts` | ⚠️ Cần verify |
| `resources` | `schemas.ts` | ⚠️ Cần verify |
| `services` | `schemas.ts` | ⚠️ Cần verify |
| `auth` | `schemas.ts` | ⚠️ Cần verify |

#### D. Naming Convention Lệch Pha

| Admin Modules | Customer Portal |
|---------------|-----------------|
| `snake_case` (phone_number, date_of_birth) | `camelCase` (phone, dateOfBirth) |

**Đánh giá**: Đây là **design decision có chủ đích** (Backend compatible vs UX friendly), không phải bug.

#### E. Component Duplication Tiềm Năng

| Component Type | Locations | Vấn đề |
|----------------|-----------|--------|
| Form layouts | Mỗi feature có *-form.tsx riêng | ⚠️ Có thể có duplicated styling |
| Filter components | `staff-filter`, `service-filter` | ⚠️ Cần kiểm tra pattern |
| Trigger components | `create-*-trigger.tsx` | ⚠️ Có pattern nhưng chưa abstracted |

---

## 2. Mục Đích (Goal)

1. **Chuẩn hóa Import Paths**: Tất cả components sử dụng `@/shared/ui` barrel export
2. **Document Dialog System**: Làm rõ khi nào dùng Dialog nào
3. **Verify Schema Integration**: Đảm bảo tất cả schemas import từ `shared/lib/validations`
4. **Identify Reusable Patterns**: Xác định candidates cho shared components mới
5. **Không Breaking Changes**: Chỉ refactor internal, không đổi public API

---

## 3. Ràng Buộc (Constraints)

- **Backward Compatible**: Không thay đổi behavior hiện tại
- **Không thay đổi kiến trúc FSD**: Chỉ cải thiện nội bộ
- **Tuân thủ Design System**: Sử dụng components từ `shared/ui`
- **Localization**: Giữ nguyên Tiếng Việt
- **Build phải pass**: Mọi thay đổi phải qua `pnpm lint` và `pnpm build`

---

## 4. Chiến Lược (Strategy)

### Giai Đoạn 1: Deep Audit (Phân tích chi tiết)
1. Kiểm tra từng schema file → xác nhận sử dụng shared validations
2. Kiểm tra import paths trong tất cả features
3. Document dialog usage patterns

### Giai Đoạn 2: Barrel Export Consolidation
1. Thêm `TableRowActions` vào `shared/ui/index.ts`
2. Thêm các `DropdownMenu*` components còn thiếu
3. Update các import paths trong features

### Giai Đoạn 3: Schema Consistency
1. Update các schema files để import từ shared validations
2. Remove duplicated validation logic

### Giai Đoạn 4: Documentation
1. Tạo COMPONENT_PATTERNS.md
2. Document Dialog Decision Tree

---

## 5. Danh Sách Files Cần Kiểm Tra

### Priority 0: Barrel Export Updates
| File | Thao tác |
|------|----------|
| `shared/ui/index.ts` | Review & possibly ADD exports |

### Priority 1: Deep Import Violations
| Feature | Files cần kiểm tra |
|---------|-------------------|
| `staff` | `staff-actions.tsx` |
| `customers` | `customer-actions.tsx` |
| `resources` | `resource-actions.tsx` |
| `services` | `service-actions.tsx`, `skill-actions.tsx` |

### Priority 2: Schema Files
| File | Cần verify sử dụng shared validations |
|------|--------------------------------------|
| `customers/model/schemas.ts` | ✓ |
| `customer-dashboard/schemas.ts` | ✓ |
| `booking-wizard/schemas.ts` | ✓ |
| `staff/model/schemas.ts` | ✓ |
| `auth/schemas.ts` | ✓ |
| `resources/schemas.ts` | ✓ |
| `services/schemas.ts` | ✓ |

---

## 6. Rủi Ro & Biện Pháp Giảm Thiểu

| Rủi Ro | Biện Pháp |
|--------|----------|
| Break existing imports | Thêm exports, không xóa |
| TypeScript errors | Chạy build sau mỗi thay đổi |
| Form behavior change | Không thay đổi schema logic, chỉ import path |

---

## 7. Tiêu Chí Hoàn Thành (Definition of Done)

- [ ] Hoàn thành Deep Audit cho tất cả features
- [ ] Tất cả `*-actions.tsx` import từ `@/shared/ui` (không deep import)
- [ ] Tất cả schema files đã được verified
- [ ] Tạo báo cáo chi tiết về component consistency
- [ ] `pnpm lint` pass
- [ ] `pnpm build` pass
- [ ] Document Dialog Decision Tree

---

## 8. Báo Cáo Sơ Bộ

### Điểm Đánh Giá Tổng Thể: **7.5/10** ⭐

| Tiêu chí | Điểm | Ghi chú |
|----------|------|---------|
| Component Reuse | 8/10 | Sử dụng tốt DataTable, DeleteConfirmDialog |
| Import Pattern | 6/10 | Có deep imports cần fix |
| Form Pattern | 8/10 | useActionState + react-hook-form nhất quán |
| Validation | 7/10 | Shared library tồn tại, cần verify adoption |
| Naming | 8/10 | Có convention rõ ràng (snake vs camel) |
| Documentation | 6/10 | Cần thêm pattern documentation |

---

**⏸️ DỪNG LẠI - Chờ phê duyệt từ User trước khi tiến hành Giai đoạn 2**

### Câu Hỏi Cho User:

1. **Ưu tiên cao nhất là gì?**
   - [ ] Fix deep imports (nhanh, an toàn)
   - [ ] Verify schema consistency (trung bình)
   - [ ] Tạo documentation (dài hạn)

2. **Có muốn tôi tạo `COMPONENT_PATTERNS.md` để document các patterns hiện có?**

3. **Có feature nào cần ưu tiên kiểm tra trước không?**
