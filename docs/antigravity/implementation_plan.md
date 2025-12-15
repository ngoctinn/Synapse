# Kế Hoạch Triển Khai: Form Import Standardization (Synapse)

**Ngày tạo**: 2025-12-15
**Cập nhật**: 2025-12-15 15:30
**Trạng thái**: ✅ ĐÃ PHÊ DUYỆT - ĐANG THỰC THI
**Vai trò**: Front-end Auditor & UI Consistency Specialist

---

## 1. Vấn Đề (Problem)

### 1.1. Phân Tích Tổng Quan

Hệ thống có **15 form components** với **93% vi phạm** barrel import convention.

| Metric | Giá trị |
|--------|---------|
| Tổng forms | 15 |
| Deep Import (SAI) | 14 (93%) |
| Barrel Import (ĐÚNG) | 1 (7%) |

### 1.2. Files Vi Phạm

| # | Form | Feature | Trạng thái |
|---|------|---------|------------|
| 1 | `customer-form.tsx` | customers | ❌ Deep Import |
| 2 | `staff-form.tsx` | staff | ❌ Deep Import |
| 3 | `service-form.tsx` | services | ❌ Deep Import |
| 4 | `resource-form.tsx` | resources | ❌ Deep Import |
| 5 | `skill-form.tsx` | services | ❌ Deep Import |
| 6 | `shift-form.tsx` | staff | ❌ Cần kiểm tra |
| 7 | `review-form.tsx` | reviews | ❌ Cần kiểm tra |
| 8 | `payment-form.tsx` | billing | ❌ Deep Import |
| 9 | `profile-form.tsx` | customer-dashboard | ❌ Deep Import |
| 10 | `login-form.tsx` | auth | ❌ Deep Import |
| 11 | `register-form.tsx` | auth | ❌ Deep Import |
| 12 | `forgot-password-form.tsx` | auth | ❌ Cần kiểm tra |
| 13 | `update-password-form.tsx` | auth | ❌ Cần kiểm tra |
| 14 | `booking-wizard/customer-form.tsx` | booking-wizard | ❌ Cần kiểm tra |
| 15 | `appointment-form.tsx` | appointments | ✅ Barrel Import |

---

## 2. Mục Đích (Goal)

1. **Refactor Import Paths**: 14 forms → Barrel Import `@/shared/ui`
2. **Không Breaking Changes**: Chỉ thay đổi import, không đổi logic
3. **Build phải pass**: `pnpm lint` và `pnpm build`

---

## 3. Ràng Buộc (Constraints)

- ✅ Không thay đổi behavior/logic
- ✅ Backward compatible
- ✅ Build phải pass
- ✅ Giữ nguyên Tiếng Việt

---

## 4. Task Breakdown

### Batch 1: Core Entity Forms (4 files)
| Task | File | Priority |
|------|------|----------|
| F1-01 | `customers/components/customer-form.tsx` | High |
| F1-02 | `staff/components/staff-form.tsx` | High |
| F1-03 | `services/components/service-form.tsx` | High |
| F1-04 | `resources/components/resource-form.tsx` | High |

### Batch 2: Auth Forms (4 files)
| Task | File | Priority |
|------|------|----------|
| F2-01 | `auth/components/login-form.tsx` | Medium |
| F2-02 | `auth/components/register-form.tsx` | Medium |
| F2-03 | `auth/components/forgot-password-form.tsx` | Medium |
| F2-04 | `auth/components/update-password-form.tsx` | Medium |

### Batch 3: Other Forms (6 files)
| Task | File | Priority |
|------|------|----------|
| F3-01 | `services/components/skill-form.tsx` | Low |
| F3-02 | `staff/components/scheduling/shift-form.tsx` | Low |
| F3-03 | `billing/components/sheet/payment-form.tsx` | Low |
| F3-04 | `customer-dashboard/components/profile-form.tsx` | Low |
| F3-05 | `reviews/components/review-form.tsx` | Low |
| F3-06 | `booking-wizard/.../customer-form.tsx` | Low |

---

## 5. Definition of Done

- [ ] Tất cả 14 forms sử dụng Barrel Import
- [ ] `pnpm lint` pass
- [ ] `pnpm build` pass
- [ ] change-log.md ghi nhận thay đổi
- [ ] dashboard.md cập nhật

---

**✅ PLAN APPROVED - PROCEEDING TO EXECUTION**
