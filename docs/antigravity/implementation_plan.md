# Kế Hoạch Triển Khai: Refactor Validation System (Frontend)

**Ngày tạo**: 2025-12-15
**Trạng thái**: ⏳ CHỜ PHÊ DUYỆT

---

## 1. Vấn Đề (Problem)

### 1.1. Logic Validation Bị Phân Mảnh
Validation logic được viết lặp lại ở nhiều nơi với các biến thể khác nhau:

| Trường | File | Logic |
|--------|------|-------|
| **Phone** | `customers/model/schemas.ts` | `min(10).max(15)` - kiểm tra độ dài |
| **Phone** | `customer-dashboard/schemas.ts` | Regex VN: `/(84\|0[3\|5\|7\|8\|9])+([0-9]{8})\b/` |
| **Phone** | `booking-wizard/schemas.ts` | Regex VN giống trên nhưng có `g` flag |
| **Phone** | `staff/model/schemas.ts` | `min(10)` - chỉ kiểm tra min |

### 1.2. Quy Tắc Nghiệp Vụ Lệch Pha
| Trường | File | Logic |
|--------|------|-------|
| **date_of_birth** | `customers/model/schemas.ts` | `date <= new Date()` (không được lớn hơn hiện tại) |
| **dateOfBirth** | `customer-dashboard/schemas.ts` | `year >= 1900 && year <= currentYear` (thêm giới hạn năm 1900) |

### 1.3. Không Nhất Quán Về Naming Convention
- **Admin modules** (customers, staff): sử dụng `snake_case` (`phone_number`, `date_of_birth`)
- **Customer Portal** (customer-dashboard): sử dụng `camelCase` (`phone`, `dateOfBirth`)

### 1.4. Không Có Shared Validation Library
- Không tồn tại file `shared/lib/validations.ts` hoặc tương đương
- Mỗi feature tự định nghĩa schema riêng biệt
- Thông báo lỗi không đồng nhất (VD: "Số điện thoại ít nhất 10 số" vs "Số điện thoại không hợp lệ")

---

## 2. Mục Đích (Goal)

1. **Tập trung hóa (Centralization)**: Tạo thư viện validation chung tại `shared/lib/validations.ts`
2. **Nhất quán (Consistency)**: Thống nhất quy tắc nghiệp vụ cho phone, email, date, v.v.
3. **Tái sử dụng (Reusability)**: Các feature chỉ compose từ building blocks chung
4. **Dễ bảo trì (Maintainability)**: Thay đổi quy tắc 1 lần, áp dụng toàn bộ
5. **Localization**: Thông báo lỗi tiếng Việt chuẩn hóa

---

## 3. Ràng Buộc (Constraints)

- **Zod**: Tiếp tục sử dụng Zod làm validation library
- **Naming Convention**:
  - Admin modules: `snake_case` (phù hợp API Backend)
  - Customer Portal: `camelCase` (nếu bắt buộc) - nhưng logic validate phải giống nhau
- **Backward Compatible**: Không làm break các form đang hoạt động
- **Type-Safe**: Export type inference từ schema

---

## 4. Chiến Lược (Strategy)

### 4.1. Thiết Kế Thư Viện Validation Chung

```
shared/lib/validations/
├── index.ts              # Public API
├── primitives.ts         # Atomic validators (phone, email, date, etc.)
├── messages.ts           # Thông báo lỗi tiếng Việt chuẩn hóa
└── presets.ts            # Pre-built schemas (personInfo, contactInfo, etc.)
```

### 4.2. Quy Tắc Nghiệp Vụ Chuẩn Hóa

| Trường | Quy Tắc Thống Nhất |
|--------|-------------------|
| **Phone (VN)** | Regex: `/^(0|\+84)(3\|5\|7\|8\|9)[0-9]{8}$/` |
| **Email** | `z.string().email()` - Zod built-in |
| **Date of Birth** | `year >= 1900 && date <= today` |
| **Full Name** | `min(2).max(100)` - không chứa số/ký tự đặc biệt |
| **Password** | `min(8)` - có thể thêm regex uppercase/number sau |
| **Color Code** | `/^#([A-Fa-f0-9]{6}\|[A-Fa-f0-9]{3})$/` |

---

## 5. Giải Pháp Chi Tiết (Solution)

### Giai Đoạn 1: Tạo Shared Validation Library
**Files cần tạo:**
- `frontend/src/shared/lib/validations/index.ts`
- `frontend/src/shared/lib/validations/primitives.ts`
- `frontend/src/shared/lib/validations/messages.ts`

### Giai Đoạn 2: Refactor Feature Schemas
**Files cần sửa:**
1. `features/customers/model/schemas.ts` - Import từ shared
2. `features/customer-dashboard/schemas.ts` - Import từ shared
3. `features/booking-wizard/schemas.ts` - Import từ shared
4. `features/staff/model/schemas.ts` - Import từ shared
5. `features/auth/schemas.ts` - Import từ shared (password, email)

### Giai Đoạn 3: Xử Lý Naming Convention
- Tạo helper function để transform `snake_case` ↔ `camelCase` schema
- Hoặc tạo 2 phiên bản schema cho cùng 1 entity (admin vs customer-facing)

### Giai Đoạn 4: Verify & Test
- Chạy `pnpm lint` và `pnpm build`
- Test thủ công các form chính

---

## 6. Danh Sách Files Ảnh Hưởng

| File | Thao tác | Độ ưu tiên |
|------|----------|-----------|
| `shared/lib/validations/index.ts` | **CREATE** | P0 |
| `shared/lib/validations/primitives.ts` | **CREATE** | P0 |
| `shared/lib/validations/messages.ts` | **CREATE** | P0 |
| `features/customers/model/schemas.ts` | MODIFY | P1 |
| `features/customer-dashboard/schemas.ts` | MODIFY | P1 |
| `features/booking-wizard/schemas.ts` | MODIFY | P1 |
| `features/staff/model/schemas.ts` | MODIFY | P2 |
| `features/auth/schemas.ts` | MODIFY | P2 |
| `features/services/schemas.ts` | REVIEW | P3 |
| `features/resources/schemas.ts` | REVIEW | P3 |

---

## 7. Rủi Ro & Biện Pháp Giảm Thiểu

| Rủi Ro | Biện Pháp |
|--------|----------|
| Break form đang hoạt động | Áp dụng từng file, test ngay sau mỗi thay đổi |
| Naming conflict (snake vs camel) | Tạo 2 phiên bản export rõ ràng |
| Thông báo lỗi khác với trước | Document rõ để QA biết |

---

## 8. Tiêu Chí Hoàn Thành (Definition of Done)

- [ ] Thư viện `shared/lib/validations` đã được tạo
- [ ] Tất cả phone validation dùng chung 1 regex
- [ ] Tất cả date_of_birth validation dùng chung 1 logic
- [ ] `pnpm lint` pass
- [ ] `pnpm build` pass
- [ ] Không có lỗi TypeScript

---

**⏸️ DỪNG LẠI - Chờ phê duyệt từ User trước khi tiến hành Giai đoạn 2**
