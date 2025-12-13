
# 📋 BÁO CÁO KIỂM TOÁN DIALOG - Frontend Synapse

**Ngày đánh giá:** 2025-12-13
**Phiên bản:** 1.0
**Trạng thái:** Đánh giá hoàn tất

---

## 1. TỔNG QUAN KIỂM TOÁN

### 1.1 Phạm Vi Kiểm Toán

| Thống kê | Số lượng |
|----------|----------|
| **Tổng file chứa Dialog** | 12 files |
| **Dialog primitives (shadcn/ui)** | 2 files (`dialog.tsx`, `alert-dialog.tsx`) |
| **Custom Dialog components** | 2 files (`confirm-dialog.tsx`, `delete-confirm-dialog.tsx`) |
| **Feature-specific Dialogs** | 8 files |
| **Lượt sử dụng ConfirmDialog** | 2 nơi (auth feature) |
| **Lượt sử dụng DeleteConfirmDialog** | 11 nơi |
| **Lượt sử dụng Dialog primitive** | 6 nơi |
| **Lượt sử dụng AlertDialog** | 3 nơi |

### 1.2 Điểm Đánh Giá Tổng Thể

| Tiêu chí | Điểm (1-10) | Ghi chú |
|----------|-------------|---------|
| **Tính nhất quán** | 6/10 | Nhiều pattern khác nhau |
| **Khả năng tái sử dụng** | 7/10 | Có shared components nhưng chưa đủ |
| **Rủi ro UX** | Medium | 2 cancel dialogs khác nhau |
| **Khả năng bảo trì** | 6/10 | Import paths không thống nhất |

---

## 2. PHÂN LOẠI DIALOG HIỆN TẠI

### 2.1 Kiến Trúc Dialog Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SHARED UI LAYER (Primitives)                     │
├──────────────────────────────┬──────────────────────────────────────┤
│  @/shared/ui/dialog.tsx      │  @/shared/ui/alert-dialog.tsx        │
│  - Dialog, DialogContent     │  - AlertDialog, AlertDialogContent   │
│  - DialogHeader/Footer       │  - AlertDialogAction/Cancel          │
│  - DialogTitle/Description   │  - AlertDialogHeader/Footer          │
│  → Dismissible (X button)    │  → Non-dismissible by click outside  │
└──────────────────────────────┴──────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CUSTOM COMPONENTS LAYER                          │
├──────────────────────────────┬──────────────────────────────────────┤
│  confirm-dialog.tsx          │  delete-confirm-dialog.tsx           │
│  - Variants: success/info/   │  - AlertDialog-based                 │
│    warning/error             │  - Loading state                     │
│  - Dialog-based              │  - Entity name/label                 │
│  - Icon + color theming      │  - Additional warning                │
│  → Use case: Thông báo       │  → Use case: Xác nhận xóa            │
└──────────────────────────────┴──────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FEATURE-SPECIFIC DIALOGS                         │
├─────────────────────────────────────────────────────────────────────┤
│  - cancel-dialog.tsx (appointments)                                 │
│  - cancel-booking-dialog.tsx (customer-dashboard) ← TRÙNG LẶP      │
│  - walk-in-booking-dialog.tsx                                       │
│  - booking-dialog.tsx (multi-step wizard in dialog)                 │
│  - create-skill-dialog.tsx                                          │
│  - edit-service-dialog.tsx (wrapper → Sheet)                        │
│  - channel-config-dialog.tsx                                        │
│  - add-shift-dialog.tsx (sử dụng Sheet thay Dialog!)                │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Bảng Phân Loại Chi Tiết

| File | Base Component | Use Case | Có loading? | Có form? | Có icon? |
|------|----------------|----------|-------------|----------|----------|
| `confirm-dialog.tsx` | Dialog | Thông báo/xác nhận | ❌ | ❌ | ✅ |
| `delete-confirm-dialog.tsx` | AlertDialog | Xác nhận xóa | ✅ | ❌ | ❌ |
| `cancel-dialog.tsx` | Dialog | Hủy appointment | ✅ | ✅ (reason) | ✅ |
| `cancel-booking-dialog.tsx` | AlertDialog | Hủy booking | ✅ | ✅ (reason) | ❌ |
| `walk-in-booking-dialog.tsx` | AlertDialog | Tạo appointment | ✅ | ✅ (full form) | ❌ |
| `booking-dialog.tsx` | Dialog | Multi-step wizard | ✅ | ✅ (steps) | ❌ |
| `create-skill-dialog.tsx` | Dialog | Tạo skill | ❌ | ✅ | ❌ |
| `channel-config-dialog.tsx` | Dialog | Config kênh | ✅ | ✅ | ❌ |
| `add-shift-dialog.tsx` | **Sheet** | Tạo ca làm | ❌ | ✅ | ❌ |
| `edit-service-dialog.tsx` | **Sheet** (wrapper) | Sửa service | - | - | - |

---

## 3. VẤN ĐỀ PHÁT HIỆN

### 🔴 CRITICAL - Auth Dialog State Management Bug

#### Issue D-00: ConfirmDialog trong Auth có lỗi logic nghiêm trọng

**Vị trí:** `register-form.tsx:206-229`, `forgot-password-form.tsx:119-142`

**Phân tích chi tiết:**

```tsx
// register-form.tsx:206-213
<ConfirmDialog
  open={state?.status === "success"}  // ❌ VẤN ĐỀ: Derived từ state
  onOpenChange={(open) => {
    if (!open) {
      form.reset(); // Reset form khi đóng
    }
  }}
  // ...
  primaryAction={{
    label: "Đã hiểu",
    onClick: () => {
      // ❌ onClick trống - không thay đổi state!
    },
  }}
/>
```

**Các vấn đề phát hiện:**

| # | Vấn đề | Mức độ | Chi tiết |
|---|--------|--------|----------|
| **A-01** | **Không thể đóng Dialog** | 🔴 Critical | `open` được derive từ `state?.status === "success"`. Khi bấm "Đã hiểu", `onClick` trống không thay đổi `state`, nên `open` vẫn là `true` → Dialog không đóng được! |
| **A-02** | **onOpenChange không đủ** | 🔴 Critical | Dù có `onOpenChange`, nhưng vì `open` derive từ state và state không được reset, dialog sẽ mở lại ngay lập tức |
| **A-03** | **primaryAction.onClick trống** | 🟡 Medium | Comment nói "redundant" nhưng thực tế cần gọi action để reset state |
| **A-04** | **Toast + Dialog cùng lúc** | 🟡 Medium | `useEffect` hiển thị toast, đồng thời Dialog cũng mở → redundant feedback |
| **A-05** | **Thiếu cơ chế dismiss state** | 🔴 Critical | Cần một cách để reset `state` về `undefined` sau khi user acknowledge |

**Root Cause Analysis:**

```
┌─────────────────────────────────────────────────────────────┐
│                    LUỒNG HIỆN TẠI (BUG)                     │
├─────────────────────────────────────────────────────────────┤
│ 1. User submit form                                         │
│ 2. registerAction() returns { status: "success" }          │
│ 3. state?.status === "success" → Dialog opens              │
│ 4. Toast.success() also shows (from useEffect)             │
│ 5. User clicks "Đã hiểu"                                    │
│ 6. primaryAction.onClick() runs (empty function!)          │
│ 7. state KHÔNG thay đổi → vẫn là "success"                 │
│ 8. Dialog vẫn open vì open={state?.status === "success"}   │
│ 9. ∞ INFINITE LOOP - User không thể thoát!                 │
└─────────────────────────────────────────────────────────────┘
```

**Phiên bản cũ (đã bị xóa) hoạt động đúng:**
```tsx
// Phiên bản cũ dùng separate state
const [showCheckEmailDialog, setShowCheckEmailDialog] = useState(false);
const dismissedStateRef = useRef<typeof state>(null);

// Dialog open dựa trên local state
<ConfirmDialog
  open={showCheckEmailDialog}  // ✅ Controlled by local state
  onOpenChange={(open) => {
    if (!open) {
      setShowCheckEmailDialog(false);  // ✅ Actually closes
      dismissedStateRef.current = state;
    }
  }}
/>
```

**Khuyến nghị sửa lỗi:**

```tsx
// Option 1: Thêm local state để control dialog
const [dialogOpen, setDialogOpen] = useState(false);

useEffect(() => {
  if (state?.status === "success") {
    setDialogOpen(true);  // Open on success
  }
}, [state]);

<ConfirmDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  primaryAction={{
    label: "Đã hiểu",
    onClick: () => setDialogOpen(false),  // ✅ Actually closes
  }}
/>

// Option 2: Sử dụng useReducer để reset action state
// (Phức tạp hơn, cần custom hook)
```

---

### 🔴 HIGH PRIORITY - Trùng lặp Logic

#### Issue D-01: Hai Cancel Dialog riêng biệt

| Thuộc tính | `cancel-dialog.tsx` | `cancel-booking-dialog.tsx` |
|------------|---------------------|----------------------------|
| **Vị trí** | `appointments/components/sheet/` | `customer-dashboard/components/booking/` |
| **Base** | Dialog | AlertDialog |
| **Lines** | 193 | 108 |
| **Reason input** | Optional | Required |
| **Policy warning** | Chi tiết, có emoji | Đơn giản |
| **Info display** | Service, Customer, Date, Time | Service, Time (basic) |
| **Cancel button text** | "Quay lại" | "Đóng" |
| **Confirm button text** | "Xác nhận hủy" | "Xác nhận hủy" |

**Rủi ro:**
- UX không nhất quán giữa Admin và Customer view
- Bảo trì khó khăn khi thay đổi chính sách hủy
- Duplicate business logic (2 giờ policy)

**Khuyến nghị:** Tạo `shared/ui/custom/cancel-appointment-dialog.tsx` với props để phân biệt admin/customer mode.

---

### 🟡 MEDIUM PRIORITY - Import Paths Không Thống Nhất

| Module | Import Path | File |
|--------|-------------|------|
| staff-table | `"@/shared/ui"` | ✅ Barrel export |
| staff-actions | `"@/shared/ui/custom/delete-confirm-dialog"` | ⚠️ Direct import |
| customer-table | `"@/shared/ui"` | ✅ Barrel export |
| customer-actions | `"@/shared/ui/custom/delete-confirm-dialog"` | ⚠️ Direct import |
| service-actions | `"@/shared/ui/custom/delete-confirm-dialog"` | ⚠️ Direct import |
| schedule-editor | `"@/shared/ui"` | ✅ Barrel export |

**Phát hiện:** 6/11 nơi sử dụng import trực tiếp thay vì barrel export.

**Khuyến nghị:** Chuẩn hóa tất cả import về `"@/shared/ui"`.

---

### 🟡 MEDIUM PRIORITY - Sử Dụng Sai Base Component

#### Issue D-02: WalkInBookingDialog dùng AlertDialog cho Form

```tsx
// walk-in-booking-dialog.tsx:59
<AlertDialog open={open} onOpenChange={onOpenChange}>
  <AlertDialogContent>
    // ... Contains a full form (AppointmentForm)
  </AlertDialogContent>
</AlertDialog>
```

**Vấn đề:**
- `AlertDialog` được thiết kế cho confirmation, không phải form input
- Thiếu `AlertDialogAction` và `AlertDialogCancel` buttons (vi phạm accessibility)
- Không có close button (X) như Dialog chuẩn

**Khuyến nghị:** Chuyển sang `Dialog` hoặc `Sheet` component.

---

### 🟡 MEDIUM PRIORITY - Naming Convention Không Nhất Quán

| File | Tên Component | Thực Chất |
|------|---------------|-----------|
| `add-shift-dialog.tsx` | AddShiftDialog | Sử dụng **Sheet** (slide-in panel) |
| `edit-service-dialog.tsx` | EditServiceDialog | Wrapper cho **ServiceSheet** |

**Vấn đề:** Tên file có suffix `-dialog` nhưng thực tế dùng Sheet component → gây nhầm lẫn.

**Khuyến nghị:**
- Rename `add-shift-dialog.tsx` → `add-shift-sheet.tsx`
- Rename `edit-service-dialog.tsx` → `edit-service-sheet-wrapper.tsx` hoặc remove wrapper entirely

---

### 🟢 LOW PRIORITY - Thiếu Variants Cho ConfirmDialog

| Variant | Có sẵn | Sử dụng |
|---------|--------|---------|
| success | ✅ | ❌ (chưa thấy) |
| info | ✅ | ✅ (auth) |
| warning | ✅ | ❌ |
| error | ✅ | ❌ |

**Khuyến nghị:** Tài liệu hóa use cases cho từng variant và cân nhắc thêm variant `destructive` riêng.

---

### 🟢 LOW PRIORITY - DialogContent Styling Không Đồng Nhất

| Dialog | max-width | padding | gap | Đặc biệt |
|--------|-----------|---------|-----|----------|
| confirm-dialog | `sm:max-w-[400px]` | `p-6` | `gap-6` | `border-none shadow-2xl backdrop-blur-xl` |
| delete-confirm | (mặc định) | (mặc định) | (mặc định) | - |
| cancel-dialog | `sm:max-w-md` | (mặc định) | (mặc định) | - |
| booking-dialog | `sm:max-w-lg md:max-w-4xl` | `p-0` | `gap-0` | Complex layout |
| channel-config | `sm:max-w-[425px]` | (mặc định) | (mặc định) | - |

**Vấn đề:** 5 cách viết max-width khác nhau. Không có design system token.

**Khuyến nghị:** Định nghĩa size tokens: `dialog-sm`, `dialog-md`, `dialog-lg`, `dialog-xl`.

---

## 4. MA TRẬN SỬ DỤNG

### 4.1 ConfirmDialog Usage

| Feature | File | Variant | Use Case | Status |
|---------|------|---------|----------|--------|
| auth | `register-form.tsx` | info | Email verification sent | 🔴 **BUG: Không đóng được** |
| auth | `forgot-password-form.tsx` | info | Password reset sent | 🔴 **BUG: Không đóng được** |

### 4.2 DeleteConfirmDialog Usage

| Feature | File | Entity Name |
|---------|------|-------------|
| staff | `staff-table.tsx` | nhân viên |
| staff | `staff-actions.tsx` | nhân viên |
| settings | `schedule-editor.tsx` | ca làm việc |
| settings | `operating-hours-form.tsx` | lịch làm việc |
| settings | `exceptions-view-manager.tsx` | ngoại lệ |
| services | `skill-actions.tsx` | kỹ năng |
| services | `service-actions.tsx` | dịch vụ |
| resources | `resource-actions.tsx` | tài nguyên |
| customers | `customer-table.tsx` | khách hàng |
| customers | `customer-actions.tsx` | khách hàng |
| appointments | `appointments-page.tsx` | lịch hẹn |

### 4.3 Custom Dialogs Usage (Feature-Specific)

| Dialog | Used In | Count |
|--------|---------|-------|
| CancelDialog | AppointmentSheet, EventPopover | 2 |
| CancelBookingDialog | BookingCard | 1 |
| WalkInBookingDialog | AppointmentsPage | 1 |
| BookingDialog | ServiceCard (customer-dashboard) | 1 |
| CreateSkillDialog | SkillsSection | 1 |
| ChannelConfigDialog | NotificationsSettings | 1 |
| AddShiftDialog | StaffScheduling | 1 |

---

## 5. KHUYẾN NGHỊ HỢP NHẤT

### 5.1 Tạo Dialog Mới Cho Shared Use Cases

#### Đề Xuất 1: `CancelConfirmDialog` (Hợp nhất cancel-dialog + cancel-booking-dialog)

```typescript
interface CancelConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Entity Info
  entityType: "appointment" | "booking";
  entityId: string;

  // Display Info
  serviceName: string;
  customerName?: string; // Cho admin view
  scheduledTime: Date;

  // Policy
  policyHours?: number; // Default: 2
  lateFeePercent?: number; // Default: 50

  // Features
  requireReason?: boolean; // Default: false
  showDetailedInfo?: boolean; // Default: true

  // Callbacks
  onConfirm: (reason?: string) => Promise<void>;
  onSuccess?: () => void;
}
```

#### Đề Xuất 2: `FormDialog` (Cho complex forms)

```typescript
interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Header
  title: string;
  description?: string;

  // Content
  children: React.ReactNode;

  // Size
  size?: "sm" | "md" | "lg" | "xl" | "full";

  // Footer
  showFooter?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}
```

### 5.2 Chuẩn Hóa Import Paths

```typescript
// ❌ Không nên
import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";

// ✅ Nên dùng
import { DeleteConfirmDialog } from "@/shared/ui";
```

### 5.3 Định Nghĩa Design Tokens

```css
/* Thêm vào design system */
--dialog-width-sm: 400px;
--dialog-width-md: 512px;
--dialog-width-lg: 700px;
--dialog-width-xl: 900px;
```

---

## 6. CHECKLIST HÀNH ĐỘNG

### 🔴 CRITICAL - Sửa ngay lập tức

- [ ] **D-00/A-01:** Fix Auth ConfirmDialog - Thêm local state để control dialog open/close
- [ ] **D-00/A-02:** Fix đồng thời cả `register-form.tsx` và `forgot-password-form.tsx`
- [ ] **D-00/A-04:** Xem xét loại bỏ Toast khi có Dialog (tránh duplicate feedback)

### Must-Do (Trước Production)

- [ ] **D-01:** Hợp nhất 2 cancel dialogs thành 1 shared component
- [ ] **D-02:** Chuyển `WalkInBookingDialog` từ AlertDialog sang Dialog
- [ ] Chuẩn hóa tất cả import paths về barrel export

### Should-Do (Cho Consistency)

- [ ] Rename `-dialog.tsx` files đang dùng Sheet
- [ ] Thêm icon cho `DeleteConfirmDialog` (warning icon)
- [ ] Định nghĩa size tokens cho DialogContent

### Nice-to-Have

- [ ] Tạo `FormDialog` wrapper component
- [ ] Tài liệu hóa Dialog usage guidelines
- [ ] Thêm Storybook stories cho tất cả dialogs

---

## 7. KẾT LUẬN

Hệ thống Dialog hiện tại có nền tảng tốt với 2 shared components (`ConfirmDialog`, `DeleteConfirmDialog`) được sử dụng rộng rãi. Tuy nhiên, có **3 vấn đề chính** cần giải quyết:

1. 🔴 **CRITICAL: Auth Dialog không đóng được** - Bug logic trong `register-form.tsx` và `forgot-password-form.tsx` khiến user bị kẹt trong dialog
2. **Trùng lặp logic Cancel Dialog** giữa admin và customer views
3. **Import paths không nhất quán** gây khó khăn cho refactoring

**Ưu tiên số 1:** Sửa bug Auth Dialog ngay lập tức vì ảnh hưởng trực tiếp đến onboarding flow của user mới.

Sau khi giải quyết các vấn đề CRITICAL và HIGH priority, hệ thống sẽ đạt mức **8/10** về tính nhất quán và khả năng bảo trì.

---

*Báo cáo được tạo bởi AI Audit System*
