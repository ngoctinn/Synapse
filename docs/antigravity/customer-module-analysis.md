# Phân Tích: Customer Module vs Database Schema

**Ngày phân tích**: 16/12/2025
**Module**: `frontend/src/features/customers`
**Reference**: `docs/design/data_specification.md`

---

## 1. Tổng Quan Phân Tích

### 1.1 Database Schema (2 bảng tách biệt)

Theo `data_specification.md`, khách hàng được quản lý qua **2 bảng riêng biệt**:

#### Bảng `users`

| Cột          | Kiểu         | Null  | Mô tả               |
| ------------ | ------------ | ----- | ------------------- |
| id           | UUID         | Không | Khóa chính          |
| email        | VARCHAR(255) | Không | UNIQUE              |
| full_name    | VARCHAR(255) | Có    | Họ tên              |
| phone_number | VARCHAR(50)  | Có    | SĐT                 |
| avatar_url   | TEXT         | Có    | Ảnh đại diện        |
| role         | user_role    | Không | Mặc định 'customer' |
| is_active    | BOOLEAN      | Không | TRUE                |
| deleted_at   | TIMESTAMPTZ  | Có    | Soft delete         |
| created_at   | TIMESTAMPTZ  | Không | -                   |
| updated_at   | TIMESTAMPTZ  | Không | -                   |

#### Bảng `customer_profiles` (1:1 với users)

| Cột                | Kiểu            | Null  | Mô tả             |
| ------------------ | --------------- | ----- | ----------------- |
| user_id            | UUID            | Không | PK + FK users     |
| loyalty_points     | INTEGER         | Có    | Default 0         |
| membership_tier    | membership_tier | Có    | Default SILVER    |
| gender             | gender          | Có    | -                 |
| date_of_birth      | DATE            | Có    | -                 |
| address            | TEXT            | Có    | -                 |
| allergies          | TEXT            | Có    | -                 |
| medical_notes      | TEXT            | Có    | -                 |
| preferred_staff_id | UUID            | Có    | FK staff_profiles |

### 1.2 Frontend Type Hiện Tại

```typescript
// model/types.ts
interface Customer {
  id: string; // ❓ users.id hay riêng?
  phone_number: string; // ⚠️ DB cho phép NULL
  full_name: string; // ✅ OK
  email: string | null; // ✅ OK
  user_id: string | null; // ❌ THỪA - nhầm lẫn với id

  avatar_url: string | null; // ✅ OK
  is_active: boolean; // ✅ OK

  loyalty_points: number; // ✅ OK
  membership_tier: MembershipTier; // ✅ OK
  gender: Gender | null; // ✅ OK
  date_of_birth: string | null; // ✅ OK
  address: string | null; // ✅ OK
  allergies: string | null; // ✅ OK
  medical_notes: string | null; // ✅ OK
  preferred_staff_id: string | null; // ✅ OK

  created_at: string; // ✅ OK
  updated_at: string; // ✅ OK
}
```

---

## 2. Chi Tiết Sai Lệch

### 2.1 🔴 CRITICAL Issues

| #   | Issue                      | Frontend                          | Database                         | Impact                    |
| --- | -------------------------- | --------------------------------- | -------------------------------- | ------------------------- |
| 1   | Field `user_id` thừa       | `user_id: string \| null`         | Không có trong response          | Gây nhầm lẫn với `id`     |
| 2   | `phone_number` là required | `phone_number: string` (NOT NULL) | `phone_number: VARCHAR(50) NULL` | Form sẽ reject valid data |

### 2.2 🟡 MEDIUM Issues

| #   | Issue              | Frontend | Database                  | Impact                                      |
| --- | ------------------ | -------- | ------------------------- | ------------------------------------------- |
| 3   | Thiếu `deleted_at` | Không có | `deleted_at: TIMESTAMPTZ` | Không filter được soft-deleted              |
| 4   | Thiếu `role`       | Không có | `role: user_role`         | Có thể cần để distinguish staff vs customer |

### 2.3 ✅ Đã Đồng Nhất

- `full_name`, `email`, `avatar_url`, `is_active`
- `loyalty_points`, `membership_tier`, `gender`, `date_of_birth`
- `address`, `allergies`, `medical_notes`, `preferred_staff_id`
- `created_at`, `updated_at`

### 2.4 ⚠️ Cần Xác Nhận với Backend

| Item                   | Question                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `gender` enum          | DB spec không định nghĩa rõ values. Frontend dùng MALE/FEMALE/OTHER có đúng không? |
| API response structure | Backend trả về flatten hay nested (user + profile)?                                |

---

## 3. Phân Tích Schema Validation

### 3.1 File `model/schemas.ts`

```typescript
export const customerSchema = z.object({
  full_name: fullNameRequired, // ✅ OK
  email: emailOptional, // ✅ OK
  phone_number: phoneVNRequired, // ⚠️ DB cho NULL nhưng form bắt buộc
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(), // ✅ OK
  date_of_birth: dateOfBirthOptional, // ✅ OK
  address: z.string().optional().nullable(), // ✅ OK
  allergies: z.string().optional().nullable(), // ✅ OK
  medical_notes: z.string().optional().nullable(), // ✅ OK
  preferred_staff_id: z.string().optional().nullable(), // ✅ OK
  membership_tier: z
    .enum(["SILVER", "GOLD", "PLATINUM"])
    .optional()
    .default("SILVER"), // ✅ OK
  loyalty_points: z.coerce.number().min(0).optional().default(0), // ✅ OK
});
```

**Nhận xét**: Schema validation khá tốt, chỉ có 1 điểm cần xem xét:

- `phone_number` được set là REQUIRED trong form, nhưng DB cho phép NULL. Đây là **business decision hợp lý** (SPA cần SĐT để liên lạc khách hàng).

---

## 4. Phân Tích Mock Data

### 4.1 File `model/mocks.ts`

```typescript
{
  id: "cust-1",          // ✅ OK - ID riêng của customer
  user_id: "user-1",     // ❌ THỪA - nên loại bỏ
  ...
}
```

**Vấn đề**: Mock data có cả `id` và `user_id`. Trong thực tế DB:

- `users.id` = UUID của user
- `customer_profiles.user_id` = FK trỏ về `users.id`

Khi query JOIN, chỉ cần 1 field `id` (từ users) là đủ.

---

## 5. Phân Tích Actions

### 5.1 File `actions.ts`

```typescript
export async function getCustomers(
  page,
  limit
): Promise<ActionResponse<CustomerListResponse>>;
export async function manageCustomer(
  prevState,
  formData
): Promise<ActionResponse>;
export async function deleteCustomer(id): Promise<ActionResponse>;
```

**Đánh giá**:

- ✅ Pattern tốt: Dùng `manageCustomer` để handle cả create và update
- ⚠️ Chưa có logic tách payload cho users vs customer_profiles
- ⚠️ Cần thêm mapper khi kết nối API thực

---

## 6. Kết Luận

### 6.1 Mức Độ Đồng Nhất: **85%**

| Hạng mục | Đánh giá                                         |
| -------- | ------------------------------------------------ |
| Types    | 🟡 Cần sửa nhỏ (loại bỏ `user_id` thừa)          |
| Enums    | ✅ Đồng nhất                                     |
| Schema   | ✅ Phù hợp (phone required là business decision) |
| Mock     | 🟡 Cần cleanup field thừa                        |
| Actions  | 🟡 Cần chuẩn bị cho API thực                     |

### 6.2 Quyết Định Đề Xuất

**KHÔNG CẦN REFACTOR LỚN** - Chỉ cần các thay đổi nhỏ:

1. **Loại bỏ `user_id`** khỏi `Customer` interface (dùng `id` thôi)
2. **Cập nhật mock data** để không còn `user_id`
3. **Thêm comment** giải thích mapping giữa UI types và DB tables
4. **(Optional)** Tạo utility types cho API layer khi kết nối backend

---

## 7. Dependencies & Impact

```
model/types.ts ──affects──> model/mocks.ts
                ──affects──> components/customer-sheet.tsx (reset form)
                ──affects──> components/customer-table.tsx (display)
```

---

## 8. Files Analyzed

- `frontend/src/features/customers/model/types.ts` ✓
- `frontend/src/features/customers/model/schemas.ts` ✓
- `frontend/src/features/customers/model/mocks.ts` ✓
- `frontend/src/features/customers/actions.ts` ✓
- `frontend/src/features/customers/components/customer-form.tsx` ✓
- `frontend/src/features/customers/components/customer-sheet.tsx` ✓
- `docs/design/data_specification.md` ✓
