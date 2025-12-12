---
description: Milestone M2 - Fix Critical UX Bugs (3 ngày)
---

# 🔴 M2: Fix Critical UX Bugs (3 ngày)

## Issues: C5, H3, H4, H5

---

### Task 2.1: Search URL Sync (C5)

**Mục tiêu:** Ô tìm kiếm sync với URL params và filter data.

**Làm gì:**
1. Tạo/verify hook `useSearchParam` trong `shared/hooks/`
2. Áp dụng cho Customers, Services, Resources pages
3. Đảm bảo actions filter theo search param

---

### Task 2.2: Shift Validation (H3)

**Mục tiêu:** ShiftForm phải validate endTime > startTime.

**Làm gì:**
1. Thêm Zod refine validation trong shift schema
2. Hiển thị error message tiếng Việt

---

### Task 2.3: Bulk Delete (H4)

**Mục tiêu:** Bulk delete hoạt động thực (không chỉ console.log).

**Làm gì:**
1. Implement `bulkDeleteCustomers` action
2. Connect UI với action, trigger refresh sau khi xóa

---

### Task 2.4: Form Pending State (H5)

**Mục tiêu:** Forms disabled khi đang submit.

**Làm gì:**
1. Audit tất cả form/sheet components
2. Thêm `disabled={isPending}` hoặc `<fieldset disabled={isPending}>`

---

### Verify
- Manual test từng feature
- Update Issue Tracker: C5, H3, H4, H5 = DONE

## Tiếp theo
→ `/04-m3-appointments-core`
