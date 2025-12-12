---
description: Milestone M1 - Chuẩn hóa Foundation và Response Types (2 ngày)
---

# 🔴 M1: Foundation (2 ngày)

## Issues: C4, M10

---

### Task 1.1: Chuẩn hóa ActionResponse (C4)

**Mục tiêu:** Tất cả Server Actions trả về `ActionResponse<T>` thống nhất.

**Làm gì:**
1. Verify file `shared/lib/action-response.ts` có `ActionResponse<T>`, `createSuccessResponse`, `createErrorResponse`
2. Refactor các files actions để sử dụng response chuẩn:
   - `auth/actions.ts`
   - `customers/actions.ts`
   - `resources/actions.ts`
   - `settings/*/actions.ts`
   - `customer-dashboard/actions.ts`

**Tham khảo:** `docs/ai/requirements/feature-frontend-standardization.md`

---

### Task 1.2: Dọn dẹp DataTable API (M10)

**Mục tiêu:** Loại bỏ deprecated flat props, giữ Grouped Config.

**Làm gì:**
1. Xóa deprecated props trong `shared/ui/custom/data-table.tsx`
2. Update các tables sử dụng DataTable

---

### Verify
- `pnpm lint` pass
- `pnpm tsc --noEmit` pass
- Update Issue Tracker: C4, M10 = DONE

## Tiếp theo
→ `/03-m2-ux-bugs`
