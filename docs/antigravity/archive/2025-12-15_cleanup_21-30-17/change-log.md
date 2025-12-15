# Antigravity Change Log - Appointments Module

> **Module:** Appointments
> **Workflow:** Gap Analysis & UX Improvements
> **Ngày bắt đầu:** 2025-12-15

---

## Session: 2025-12-15

### 📊 Gap Analysis Summary

| Aspect                         | Score      | Notes                           |
| ------------------------------ | ---------- | ------------------------------- |
| UX/UI vs Design                | 7.5/10     | Tốt                             |
| TypeScript vs Database         | 6/10       | Legacy fields gây inconsistency |
| Requirements vs Implementation | 6/10       | ~60% User Stories hoàn thiện    |
| API Contract                   | 3/10       | Mock data only                  |
| **Overall**                    | **5.6/10** | Cần cải thiện trước production  |

---

### ✅ Phát Hiện Quan Trọng: Buffer Time Logic

**Định nghĩa đúng của `buffer_time`:**

- Buffer time là thời gian nghỉ dành cho **KHÁCH SAU** (dọn dẹp phòng, chuẩn bị)
- **KHÔNG** tính vào duration của booking hiện tại
- Nếu khách làm **nhiều dịch vụ liên tiếp** → có thể **bỏ qua buffer** giữa các dịch vụ của chính họ

**Ý nghĩa cho hệ thống:**

- Duration hiển thị = Tổng thời gian dịch vụ (không cộng buffer)
- Buffer time chỉ quan trọng khi kiểm tra **conflict với KHÁCH KHÁC**
- Backend cần tính buffer khi booking slot cho khách tiếp theo

---

### ✅ Completed Tasks

#### TASK-01: Verify No-show 15min Rule

- **Status:** ✅ Already Correct
- **Finding:** `event-popover.tsx` line 98-100
  ```tsx
  const canMarkNoShow = event.status === "CONFIRMED" && minutesSinceStart > 15;
  ```

#### TASK-02: Buffer Time Data Model

- **Status:** ✅ DONE
- **File:** `mock-data.ts`
- **Change:** Thêm `buffer_time` vào MockService interface và data
- **Note:** Buffer time được giữ lại trong data model cho future conflict detection với khách khác

#### TASK-03: Duration Display (Reverted)

- **Status:** ✅ Reverted to correct logic
- **File:** `appointment-form.tsx`
- **Change:**
  - Duration chỉ tính service.duration (không cộng buffer)
  - FormDescription hiển thị đơn giản: "Tổng thời lượng: X phút"
  - Conflict check sử dụng totalDuration (không buffer)

---

### 📝 Final Code State

**MockService Interface:**

```typescript
export interface MockService {
  id: string;
  name: string;
  duration: number;
  buffer_time: number; // Dành cho conflict detection với khách khác
  price: number;
  color: string;
  category: string;
}
```

**Duration Calculation Logic:**

```tsx
// Buffer time là thời gian nghỉ dành cho KHÁCH SAU (dọn dẹp, chuẩn bị)
// Không tính vào duration của booking hiện tại
// Nếu khách làm nhiều dịch vụ liên tiếp → có thể bỏ qua buffer giữa các dịch vụ
const totalDuration = useMemo(() => {
  return (watchedServiceIds || []).reduce((acc, serviceId) => {
    const service = availableServices.find((s) => s.id === serviceId);
    return acc + (service?.duration || 0);
  }, 0);
}, [watchedServiceIds, availableServices]);
```

---

### 🔍 Verification Results

| Check        | Status  | Notes                                |
| ------------ | ------- | ------------------------------------ |
| `pnpm lint`  | ✅ PASS | 0 errors, 23 warnings (unrelated)    |
| `pnpm build` | ✅ PASS | Compiled in 90s, all pages generated |

---

### 📌 Deferred Items

| Item                                | Reason                         | Priority |
| ----------------------------------- | ------------------------------ | -------- |
| Backend API                         | Focus UX first (user decision) | P2       |
| Buffer time conflict với khách khác | Backend implementation         | P2       |
| Working hours from settings         | Minor UX improvement           | P1       |

---

_Audit completed by Antigravity Workflow_
_Updated: 2025-12-15 18:35_

---

# Antigravity Change Log - Resources Module

> **Module:** Resources
> **Workflow:** Clean Code (non-breaking)
> **Ngày bắt đầu:** 2025-12-15

---

## Session: 2025-12-15

### ✅ Changes

- `resources/actions.ts`: Gom hàm `buildResourcePayload`, bỏ parse thủ công số để không bỏ qua giá trị 0; giữ validation bằng zod.
- `resources/types.ts`: Đồng bộ type với schema (`groupId` bắt buộc), tránh hiểu lầm optional.
- `components/resource-sheet.tsx`: Tạo helper `getDefaultResourceValues` dùng chung cho `defaultValues` và `reset`, giảm trôi field mới.
- `components/resource-page.tsx`: Thêm helper `useActionData` để tái sử dụng xử lý `use(promise)` và lỗi; giảm lặp wrapper.
- `components/resource-table.tsx`: Overlay bulk delete hiển thị spinner + nhãn “Đang xử lý...” để rõ trạng thái.

### 🔍 Verification

- Chưa chạy `pnpm lint` / `pnpm build` cho thay đổi Resources (mock-only, không đổi behavior). Nên chạy sau khi gom các refactor khác.

### 📌 Ghi chú

- Hành vi giữ nguyên (mock data, in-memory). Không đổi API surface.
- Cần cân nhắc thêm fallback/tag handling khi tích hợp backend thật.

_Audit updated: 2025-12-15 19:20_
