# 📋 KẾ HOẠCH REFACTOR DIALOG - Frontend Synapse

**Ngày tạo:** 2025-12-13
**Tham chiếu:** `docs/ai/reviews/dialog-audit-report.md`
**Trạng thái:** Chờ thực thi

---

## 1. TỔNG QUAN

### Mục Tiêu

1. Sửa bug CRITICAL trong Auth Dialogs (D-00)
2. Chuẩn hóa import paths cho DeleteConfirmDialog
3. Cải thiện WalkInBookingDialog (D-02)

### Nguyên Tắc Clean Code

- **Đơn giản hơn là phức tạp** - Ưu tiên redirect thay vì managed dialogs
- **Một nguồn sự thật** - State chỉ nên được quản lý ở một nơi
- **Tái sử dụng** - Sử dụng hooks và patterns đã có sẵn trong dự án
- **Kiểm tra sau mỗi bước** - Build + Lint sau mỗi thay đổi

---

## 2. PHASE 1: SỬA BUG CRITICAL - AUTH DIALOGS

### Issue D-00: ConfirmDialog không đóng được

**Files ảnh hưởng:**
- `frontend/src/features/auth/components/register-form.tsx`
- `frontend/src/features/auth/components/forgot-password-form.tsx`

### Giải Pháp Được Chọn: **Redirect Pattern (Tối giản)**

**Lý do:**
1. Không cần state management phức tạp
2. User được redirect về login page - UX tốt hơn
3. Có thể show banner trên login page dựa theo query params
4. Ít code = ít bug

### Task 1.1: Refactor register-form.tsx

**Trước:**
```tsx
// BUG: Dialog không đóng được
<ConfirmDialog
  open={state?.status === "success"}  // Derived từ state
  onOpenChange={(open) => {...}}
  primaryAction={{
    label: "Đã hiểu",
    onClick: () => {},  // TRỐNG - không close được!
  }}
/>
```

**Sau:**
```tsx
// CLEAN: Redirect sau success, không cần dialog
useEffect(() => {
  if (state?.status === "success") {
    showToast.success("Đăng ký thành công", state.message);
    router.push("/login?registered=true");
  } else if (state?.status === "error") {
    showToast.error("Đăng ký thất bại", state.message);
  }
}, [state, router]);
// Xóa hoàn toàn <ConfirmDialog />
```

**Thay đổi chi tiết:**
1. ❌ Xóa import `ConfirmDialog` và `Mail` icon
2. ✅ Thêm `useRouter` từ `next/navigation`
3. ✅ Cập nhật `useEffect` để redirect
4. ❌ Xóa `handleResend` function
5. ❌ Xóa toàn bộ JSX `<ConfirmDialog ... />`

### Task 1.2: Refactor forgot-password-form.tsx

**Thay đổi tương tự như Task 1.1:**
1. ❌ Xóa import `ConfirmDialog`, `Mail`, `useRef`, `useState`
2. ✅ Thêm `useRouter`
3. ✅ Cập nhật `useEffect` để redirect với `router.push("/login?password_reset=true")`
4. ❌ Xóa `handleResend` function
5. ❌ Xóa toàn bộ JSX `<ConfirmDialog ... />`

### Task 1.3: Cập nhật login-form.tsx để hiển thị thông báo

**Thêm vào login-form.tsx:**
```tsx
import { Alert, AlertDescription } from "@/shared/ui/alert";

// Trong component:
const registered = searchParams.get("registered");
const passwordReset = searchParams.get("password_reset");

// Trong JSX, trước form:
{registered && (
  <Alert variant="success" className="mb-4">
    <AlertDescription>
      Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.
    </AlertDescription>
  </Alert>
)}
{passwordReset && (
  <Alert variant="info" className="mb-4">
    <AlertDescription>
      Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.
    </AlertDescription>
  </Alert>
)}
```

### Verification 1: Build + Lint

```bash
cd frontend && pnpm lint && pnpm build
```

**Expected:** 0 errors, có thể có warnings không liên quan

---

## 3. PHASE 2: CHUẨN HÓA IMPORT PATHS

### Issue: Import paths không thống nhất

**Files ảnh hưởng (6 files):**
- `staff/components/staff-list/staff-actions.tsx`
- `customers/components/customer-actions.tsx`
- `services/components/skill-actions.tsx`
- `services/components/service-actions.tsx`
- `resources/components/resource-actions.tsx`
- `settings/operating-hours/components/exceptions-view-manager.tsx`

### Task 2.1-2.6: Chuẩn hóa imports

**Trước:**
```tsx
import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";
```

**Sau:**
```tsx
import { DeleteConfirmDialog } from "@/shared/ui";
```

### Verification 2: Build + Lint

```bash
cd frontend && pnpm lint && pnpm build
```

---

## 4. PHASE 3: CẢI THIỆN WALKINBOOKINGDIALOG

### Issue D-02: Sử dụng AlertDialog cho Form

**File:** `frontend/src/features/appointments/components/walk-in-booking-dialog.tsx`

### Giải Pháp: Chuyển từ AlertDialog sang Dialog

**Trước:**
```tsx
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

// JSX
<AlertDialog open={open} onOpenChange={onOpenChange}>
  <AlertDialogContent>
    ...
  </AlertDialogContent>
</AlertDialog>
```

**Sau:**
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

// JSX
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-xl">
    ...
  </DialogContent>
</Dialog>
```

### Lý do:
1. `Dialog` có nút X để đóng (accessibility)
2. Semantic đúng - Form input dùng Dialog, không phải AlertDialog
3. Đúng pattern của shadcn/ui

### Verification 3: Build + Lint

```bash
cd frontend && pnpm lint && pnpm build
```

---

## 5. CHECKLIST THỰC THI

### Phase 1: Auth Dialogs (CRITICAL)
- [x] Task 1.1: Refactor `register-form.tsx`
- [x] Task 1.2: Refactor `forgot-password-form.tsx`
- [x] Task 1.3: Cập nhật `login-form.tsx` với Alert banners
- [x] Verification 1: `pnpm lint && pnpm build` ✓

### Phase 2: Import Paths
- [x] Task 2.1: `staff-actions.tsx`
- [x] Task 2.2: `customer-actions.tsx`
- [x] Task 2.3: `skill-actions.tsx`
- [x] Task 2.4: `service-actions.tsx`
- [x] Task 2.5: `resource-actions.tsx`
- [x] Task 2.6: `exceptions-view-manager.tsx`
- [x] Task 2.7: `appointments-page.tsx`
- [x] Verification 2: `pnpm lint && pnpm build` ✓

### Phase 3: WalkInBookingDialog
- [x] Task 3.1: Chuyển từ AlertDialog sang Dialog
- [x] Verification 3: `pnpm lint && pnpm build` ✓

---

## 6. ROLLBACK PLAN

Nếu có vấn đề sau refactor:

```bash
# Revert changes
git checkout -- frontend/src/features/auth/
git checkout -- frontend/src/features/appointments/components/walk-in-booking-dialog.tsx
```

---

## 7. ESTIMATED TIME

| Phase | Tasks | Time |
|-------|-------|------|
| Phase 1 | 3 tasks + verify | 15 phút |
| Phase 2 | 6 tasks + verify | 10 phút |
| Phase 3 | 1 task + verify | 5 phút |
| **Total** | **10 tasks** | **30 phút** |

---

## 8. SUCCESS CRITERIA

1. ✅ `pnpm lint` pass với 0 errors
2. ✅ `pnpm build` thành công
3. ✅ Auth flow hoạt động: Register → Redirect → Login page hiện Alert
4. ✅ Forgot Password flow hoạt động: Submit → Redirect → Login page hiện Alert
5. ✅ WalkInBookingDialog có nút X để đóng
6. ✅ Tất cả DeleteConfirmDialog imports đều từ barrel export

---

*Kế hoạch được tạo dựa trên báo cáo kiểm toán tại `docs/ai/reviews/dialog-audit-report.md`*
