# Kế Hoạch Refactor Hệ Thống Badge

> **Tham chiếu:** `badge-system-audit-report.md`
> **Trạng thái:** Chưa bắt đầu
> **Ước tính:** 5-6 giờ

---

## 📋 TASK LIST

### ✅ Phase 1: Mở rộng Core Badge (Ưu tiên: Thấp)

- [ ] **Task 1.1:** Thêm size variants vào `shared/ui/badge.tsx`
  ```typescript
  size: {
    xs: "text-[10px] px-1.5 py-0 h-4",
    sm: "text-xs px-2 py-0.5 h-5",
    md: "text-xs px-2.5 py-0.5 h-6", // default
    lg: "text-sm px-3 py-1 h-7",
  }
  ```

- [ ] **Task 1.2:** Export type `BadgeVariant` để các module khác sử dụng
  ```typescript
  export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]
  ```

---

### 🔴 Phase 2: Fix Booking Wizard (Ưu tiên: Cao)

- [ ] **Task 2.1:** Sửa `booking-wizard/components/step-technician/staff-list.tsx`
  - **Dòng 53:** Đổi từ `variant="secondary" className="bg-green-100..."`
  - **Thành:** `variant="success" size="xs"` (sau khi có size)
  - Hoặc: `variant="success"` + giữ nguyên nếu chưa có size

**Code hiện tại:**
```tsx
<Badge variant="secondary" className="text-[10px] h-5 font-normal px-2 bg-green-100 text-green-700 hover:bg-green-100">
  Có chỗ hôm nay
</Badge>
```

**Code mới:**
```tsx
<Badge variant="success" className="text-[10px] h-5">
  Có chỗ hôm nay
</Badge>
```

---

### 🔴 Phase 3: Fix Profile Avatar (Ưu tiên: Cao)

- [ ] **Task 3.1:** Sửa `customer-dashboard/components/profile-avatar.tsx`
  - **Dòng 61-63:** Thay thế inline span bằng Badge component

**Code hiện tại:**
```tsx
<span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
  {user.membershipTier || PROFILE_LABELS.DEFAULT_TIER}
</span>
```

**Code mới:**
```tsx
import { Badge } from "@/shared/ui/badge"
// ...
<Badge variant="soft">
  {user.membershipTier || PROFILE_LABELS.DEFAULT_TIER}
</Badge>
```

---

### 🟡 Phase 4: Refactor Appointments Status (Ưu tiên: Trung bình)

- [ ] **Task 4.1:** Tạo mapping trong `appointments/constants.ts`
  ```typescript
  import type { BadgeVariant } from "@/shared/ui/badge"
  import type { AppointmentStatus } from "./types"

  export const STATUS_TO_BADGE_VARIANT: Record<AppointmentStatus, NonNullable<BadgeVariant>> = {
    PENDING: "warning",
    CONFIRMED: "info",
    IN_PROGRESS: "default",
    COMPLETED: "success",
    CANCELLED: "destructive",
    NO_SHOW: "secondary",
  }
  ```

- [ ] **Task 4.2:** Update `appointments/components/event/event-card.tsx`
  - **Dòng 166-172:** Thay thế inline color bằng variant mapping

**Code hiện tại:**
```tsx
<Badge
  variant="secondary"
  className={cn("text-[10px] gap-1", statusConfig.color, statusConfig.bgColor)}
>
```

**Code mới:**
```tsx
import { STATUS_TO_BADGE_VARIANT } from "../../constants"
// ...
<Badge variant={STATUS_TO_BADGE_VARIANT[event.status]} className="text-[10px] gap-1">
```

- [ ] **Task 4.3:** Update `appointments/components/sheet/appointment-sheet.tsx`
  - **Dòng 171-176:** Tương tự event-card

---

### 🟡 Phase 5: Cleanup Staff Module (Ưu tiên: Trung bình)

- [ ] **Task 5.1:** Đơn giản hóa `staff/model/constants.ts`
  - Loại bỏ trường `className` khỏi ROLE_CONFIG (không cần thiết)

**Code hiện tại:**
```typescript
export const ROLE_CONFIG: Record<Role, {
  label: string;
  variant: "..." | "...";
  className?: string
}> = {
  admin: { label: "Quản trị viên", variant: "purple" },
  // ...
}
```

**Code mới:**
```typescript
export const ROLE_CONFIG: Record<Role, { label: string; variant: BadgeVariant }> = {
  admin: { label: "Quản trị viên", variant: "purple" },
  receptionist: { label: "Lễ tân", variant: "info" },
  technician: { label: "Kỹ thuật viên", variant: "warning" },
  customer: { label: "Khách hàng", variant: "secondary" },
}
```

- [ ] **Task 5.2:** Update `staff/components/staff-list/staff-table.tsx`
  - **Dòng 192-201:** Loại bỏ className override cho Role Badge
  - **Dòng 211-218, 223-228:** Đơn giản hóa Skill Badge

**Role Badge - Code mới:**
```tsx
<Badge variant={ROLE_CONFIG[staff.user.role]?.variant || "outline"}>
  {ROLE_CONFIG[staff.user.role]?.label || staff.user.role}
</Badge>
```

**Skill Badge - Code mới:**
```tsx
<Badge variant="secondary">
  {skill.name}
</Badge>
```

---

### 🟢 Phase 6: Cleanup Minor Overrides (Ưu tiên: Thấp)

- [ ] **Task 6.1:** `chat/components/chat-sidebar.tsx` (Line 72)
  - Giảm bớt override, giữ lại những gì cần thiết

- [ ] **Task 6.2:** `resources/components/maintenance-timeline.tsx` (Line 212)
  - Sử dụng size variant nếu có

- [ ] **Task 6.3:** `services/components/skill-table.tsx` (Line 81)
  - Đơn giản hóa className

---

## 🧪 VALIDATION CHECKLIST

Sau mỗi phase:
- [ ] Run `pnpm lint` - không có errors mới
- [ ] Run `pnpm build` - build thành công
- [ ] Visual check các màn hình liên quan
- [ ] Commit với message rõ ràng

---

## 📝 GIT COMMIT MESSAGES

```
Phase 1: feat(ui): add size variants to Badge component
Phase 2: refactor(booking): use success Badge variant for availability
Phase 3: refactor(profile): replace inline badge with Badge component
Phase 4: refactor(appointments): normalize status to Badge variants
Phase 5: refactor(staff): simplify Badge usage, remove className overrides
Phase 6: chore(ui): cleanup minor Badge overrides
```

---

## 🚨 ROLLBACK PLAN

Nếu có vấn đề sau refactor:
1. Revert commit tương ứng
2. Badge cũ vẫn hoạt động do chỉ là cleanup
3. Không có breaking changes về API

