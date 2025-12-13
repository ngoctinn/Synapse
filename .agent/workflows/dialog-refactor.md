---
description: Refactor Dialog system theo báo cáo kiểm toán - Fix Auth bugs, chuẩn hóa imports
---

# Dialog Refactor Workflow

**Tham chiếu:**
- `docs/ai/reviews/dialog-audit-report.md` - Báo cáo kiểm toán Dialog
- `docs/ai/planning/dialog-refactor-plan.md` - Kế hoạch chi tiết

## Prerequisites

// turbo
1. Verify build baseline: `cd frontend && pnpm build`

---

## Phase 1: Fix Auth Dialogs (CRITICAL - D-00)

### Task 1.1: Refactor register-form.tsx

2. Open file: `frontend/src/features/auth/components/register-form.tsx`

3. Replace imports:
   - Remove: `import { ConfirmDialog } from "@/shared/ui";`
   - Remove: `Mail` from lucide-react imports
   - Add: `import { useRouter } from "next/navigation";`

4. Add router inside component:
   `const router = useRouter();`

5. Replace useEffect (lines 41-47) with:
```tsx
useEffect(() => {
  if (state?.status === "success") {
    showToast.success("Đăng ký thành công", state.message);
    router.push("/login?registered=true");
  } else if (state?.status === "error") {
    showToast.error("Đăng ký thất bại", state.message);
  }
}, [state, router]);
```

6. Remove `handleResend` function (lines 61-70)

7. Remove entire `<ConfirmDialog ... />` block (lines 206-229)

### Task 1.2: Refactor forgot-password-form.tsx

8. Open file: `frontend/src/features/auth/components/forgot-password-form.tsx`

9. Replace imports:
   - Remove: `import { ConfirmDialog } from "@/shared/ui";`
   - Remove: `useRef, useState` from React imports
   - Remove: `Mail` from lucide-react imports
   - Add: `import { useRouter } from "next/navigation";`

10. Add router inside component:
    `const router = useRouter();`

11. Replace useEffect (lines 36-42) with:
```tsx
useEffect(() => {
  if (state?.status === "success") {
    showToast.success("Đã gửi yêu cầu", state.message);
    router.push("/login?password_reset=true");
  } else if (state?.status === "error") {
    showToast.error("Gửi yêu cầu thất bại", state.message);
  }
}, [state, router]);
```

12. Remove `handleResend` function (lines 53-65)

13. Remove entire `<ConfirmDialog ... />` block (lines 119-142)

### Task 1.3: Update login-form.tsx with Alert banners

14. Open file: `frontend/src/features/auth/components/login-form.tsx`

15. Add Alert import:
```tsx
import { Alert, AlertDescription } from "@/shared/ui/alert";
```

16. Extract query params after existing `returnUrl`:
```tsx
const registered = searchParams.get("registered");
const passwordReset = searchParams.get("password_reset");
```

17. Add Alert banners after heading div, before Form:
```tsx
{registered && (
  <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
    <AlertDescription>
      Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.
    </AlertDescription>
  </Alert>
)}
{passwordReset && (
  <Alert className="mb-4 border-blue-200 bg-blue-50 text-blue-800">
    <AlertDescription>
      Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.
    </AlertDescription>
  </Alert>
)}
```

### Verification Phase 1

// turbo
18. Run lint: `cd frontend && pnpm lint`

// turbo
19. Run build: `cd frontend && pnpm build`

---

## Phase 2: Chuẩn hóa Import Paths

### Task 2.1-2.6: Fix imports

20. For each file, replace:
    `import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";`
    With:
    `import { DeleteConfirmDialog } from "@/shared/ui";`

Files to update:
- `frontend/src/features/staff/components/staff-list/staff-actions.tsx`
- `frontend/src/features/customers/components/customer-actions.tsx`
- `frontend/src/features/services/components/skill-actions.tsx`
- `frontend/src/features/services/components/service-actions.tsx`
- `frontend/src/features/resources/components/resource-actions.tsx`
- `frontend/src/features/settings/operating-hours/components/exceptions-view-manager.tsx`
- `frontend/src/features/appointments/components/appointments-page.tsx`

### Verification Phase 2

// turbo
21. Run lint: `cd frontend && pnpm lint`

// turbo
22. Run build: `cd frontend && pnpm build`

---

## Phase 3: Fix WalkInBookingDialog (D-02)

### Task 3.1: Convert AlertDialog to Dialog

23. Open file: `frontend/src/features/appointments/components/walk-in-booking-dialog.tsx`

24. Replace imports:
```tsx
// Before:
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

// After:
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
```

25. Replace JSX components:
    - `<AlertDialog>` → `<Dialog>`
    - `<AlertDialogContent>` → `<DialogContent>`
    - `<AlertDialogHeader>` → `<DialogHeader>`
    - `<AlertDialogTitle>` → `<DialogTitle>`
    - `<AlertDialogDescription>` → `<DialogDescription>`

### Verification Phase 3

// turbo
26. Run lint: `cd frontend && pnpm lint`

// turbo
27. Run build: `cd frontend && pnpm build`

---

## Final Verification

// turbo
28. Start dev server: `cd frontend && pnpm dev`

29. Manual test:
    - Navigate to /register, submit form → Should redirect to /login with green alert
    - Navigate to /forgot-password, submit → Should redirect to /login with blue alert
    - Test WalkInBookingDialog opens and closes properly with X button

30. Update dialog-refactor-plan.md: Mark all tasks as [x] complete

---

## Rollback (if needed)

```bash
git checkout -- frontend/src/features/auth/
git checkout -- frontend/src/features/appointments/components/walk-in-booking-dialog.tsx
git checkout -- frontend/src/features/staff/components/staff-list/staff-actions.tsx
git checkout -- frontend/src/features/customers/components/customer-actions.tsx
git checkout -- frontend/src/features/services/components/skill-actions.tsx
git checkout -- frontend/src/features/services/components/service-actions.tsx
git checkout -- frontend/src/features/resources/components/resource-actions.tsx
git checkout -- frontend/src/features/settings/operating-hours/components/exceptions-view-manager.tsx
git checkout -- frontend/src/features/appointments/components/appointments-page.tsx
```
