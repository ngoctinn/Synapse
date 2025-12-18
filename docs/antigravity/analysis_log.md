# Analysis Log - Staff Feature Deep Review

## Session: 2025-12-18 (Staff Feature)

### 1. Type Safety Analysis

#### Issue 1: `any` type cast for role (Line 91)
```typescript
role: staff?.user.role as any,
```

**Nguyên nhân:**
- `staff.user.role` có type `Role = 'admin' | 'receptionist' | 'technician' | 'customer'`
- Nhưng schema `staffUpdateSchema.role` chỉ accept: `'admin' | 'receptionist' | 'technician'`
- Thiếu type `'customer'` trong schema → Type mismatch

**Giải pháp:**
1. Filter ra `customer` trong schema (role của staff không thể là customer)
2. Hoặc tạo `StaffRole` type riêng trong types.ts

#### Issue 2: `any` in onSubmit (Line 104)
```typescript
function onSubmit(data: any) {...}
```

**Nguyên nhân:**
- Form có thể là `StaffCreateFormValues | StaffUpdateFormValues`
- Cần type union đúng cách

**Giải pháp:**
```typescript
type StaffFormValues = StaffCreateFormValues | StaffUpdateFormValues;
function onSubmit(data: StaffFormValues) {...}
```

**Vấn đề tiếp theo:** Line 114 `value as string` cũng cần sửa vì value có thể là:
- `string` (text fields)
- `number` (commission_rate)
- `string[]` (skill_ids)

**Giải pháp hoàn chỉnh:**
```typescript
function onSubmit(data: StaffCreateFormValues | StaffUpdateFormValues) {
  const formData = new FormData();
  formData.append("form_mode", mode);
  if (staff?.user_id) formData.append("staff_id", staff.user_id);

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === 'number') {
      formData.append(key, String(value));
    } else {
      formData.append(key, value);
    }
  });

  React.startTransition(() => dispatch(formData));
}
```

### 2. Console.log Analysis

**File:** `actions.ts` Line 137
```typescript
console.log(`[Batch Update] Created ${creates.length} schedules, Deleted ${deletes.length} schedules`)
```

**Đánh giá:** Debug log còn sót, nên xóa hoặc thay bằng structured logging.

### 3. Index.ts Export Analysis

**Hiện tại export:**
- `* from "./actions"` ✅
- `StaffPage` ✅
- `* from "./model/constants"` ✅
- `MOCK_STAFF` ✅
- `* from "./model/schemas"` ✅
- `* from "./model/types"` ✅

**Thiếu:**
- Hooks: `useScheduleFilters`, `useSchedules`, `useScheduleNavigation`
- Scheduling: `StaffSchedulingPage`, calendar components
- Other components: `StaffSheet`, `StaffForm`, `StaffFilter`

**Quyết định:** Thêm các exports cần thiết cho external consumption
