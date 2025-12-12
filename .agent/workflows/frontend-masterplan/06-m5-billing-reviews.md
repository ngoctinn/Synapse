---
description: Milestone M5 - Tạo Module Billing & Reviews (6 ngày)
---

# 🔴 M5: Billing & Reviews (6 ngày)

## Issues: C6, C7
## Tham khảo: `docs/ai/requirements/feature-billing-reviews.md`

⚠️ **QUAN TRỌNG:** Đọc Section 8 (Ràng Buộc Nghiệp Vụ) trước khi implement!

---

### Task 5.1: Module Billing (C6)

**Mục tiêu:** Tạo module billing hoàn chỉnh theo FSD.

**Làm gì:**
1. Tạo folder structure: `features/billing/` với types, schemas, actions, components
2. Implement US-B1 → US-B4 (invoice CRUD, payment)
3. Implement US-B5 (treatment usage), US-B6 (loyalty points), US-B7 (membership discount)
4. Tạo route `/admin/billing`

**Business Rules:**
- Invoice tính discount theo membership tier
- Partial payment cho phép
- Loyalty points cộng khi PAID

---

### Task 5.2: Module Reviews (C7)

**Mục tiêu:** Tạo module reviews hoàn chỉnh.

**Làm gì:**
1. Tạo folder structure: `features/reviews/`
2. Implement US-R1 → US-R3 (create, view my reviews, admin view)
3. Star rating component với 1-5 stars
4. Tạo route `/admin/reviews`

**Business Rules:**
- Chỉ review khi booking COMPLETED VÀ invoice PAID
- Unique: 1 booking = 1 review
- Không xóa được, chỉ edit comment

---

### Verify
- Billing: invoice CRUD, payment, loyalty points
- Reviews: star rating, unique constraint
- Update Issue Tracker: C6, C7 = DONE

## Tiếp theo
→ `/07-m6-medium-priority`
