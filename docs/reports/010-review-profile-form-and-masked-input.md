# Báo Cáo Đánh Giá: Profile Form & Masked Date Input

**Ngày:** 30/11/2025
**Người thực hiện:** Antigravity (AI Agent)
**Phạm vi:**
- `frontend/src/shared/ui/custom/masked-date-input.tsx`
- `frontend/src/features/customer-dashboard/components/profile-form.tsx`
- `frontend/src/shared/ui/custom/birthday-picker.tsx`
- `frontend/src/features/customer-dashboard/schemas.ts`

---

## 1. Strategic Review (Phân Tích Chiến Lược)

### 1.1. Logic & Luồng Dữ Liệu
- **Masked Date Input**:
  - **Ưu điểm**: Tự động format `DD/MM/YYYY` giúp chuẩn hóa dữ liệu đầu vào.
  - **Vấn đề**: Logic `replace(/\D/g, "")` quá chặt chẽ, ngăn người dùng tự nhập dấu `/`. Điều này có thể gây khó chịu nếu người dùng quen gõ ngày tháng theo thói quen (ví dụ: gõ `12/` thay vì `12`).
  - **Validation**: Logic kiểm tra ngày/tháng/năm hợp lệ (ví dụ: 30/02) đã có nhưng chưa xử lý triệt để các trường hợp năm quá xa (ví dụ: năm 1000 hay 3000) ngay tại component này, dù Schema có check.

- **Profile Form**:
  - **Validation**: Sử dụng `zod` là chuẩn. Tuy nhiên, hàm `validateField` đang sử dụng `as any` để pick field từ schema (`profileSchema.pick({ [name]: true } as any)`). Đây là **Type Unsafe**, có thể gây lỗi runtime nếu tên field không khớp.
  - **Date Handling**: Việc chuyển đổi giữa `Date` object (state) và `string` (form data/schema) đang được xử lý thủ công (`toISOString().split('T')[0]`). Cần đảm bảo múi giờ không làm lệch ngày.

### 1.2. Bảo Mật & Hiệu Năng
- **Bảo Mật**: Form sử dụng `useActionState` (Server Actions) là đúng chuẩn Next.js 15, giúp bảo vệ logic backend.
- **Hiệu Năng**:
  - `validateField` tạo ra một schema mới mỗi lần gõ phím (onChange). Với form nhỏ thì không sao, nhưng về nguyên tắc nên cache lại schema hoặc dùng library như `react-hook-form` để tối ưu re-render.
  - `BirthdayPicker` re-render khi `dateOfBirth` thay đổi là bình thường.

---

## 2. Frontend Review (Tiêu Chuẩn FSD & Next.js)

### 2.1. Tuân Thủ FSD (Feature-Sliced Design)
- **Cấu trúc**:
  - `profile-form.tsx` nằm trong `features/customer-dashboard/components` -> **Đúng**.
  - `masked-date-input.tsx` nằm trong `shared/ui/custom` -> **Đúng**.
- **Imports**: Sử dụng alias `@/` tốt. Không thấy vi phạm deep import nghiêm trọng.

### 2.2. Next.js 16 & Clean Code
- **Server Actions**: Sử dụng `useActionState` chuẩn.
- **Client Components**: Khai báo `"use client"` đầy đủ.
- **Naming**: Tên biến rõ ràng (`isDateInvalid`, `handleAvatarSelect`).
- **Comments**: Code hiện tại thiếu comments giải thích nghiệp vụ phức tạp (ví dụ: logic masking trong `masked-date-input`). Cần bổ sung comments tiếng Việt.
- **Hardcoded Strings**: Các chuỗi hiển thị như "Thành công", "Lỗi", "Vui lòng kiểm tra lại thông tin" đang hardcode. Nên tách ra file constants hoặc i18n để dễ quản lý.

### 2.3. UX/UI (Trải Nghiệm & Giao Diện)
- **Animations**: Sử dụng `framer-motion` cho hiệu ứng xuất hiện (`opacity`, `y`) và hover avatar -> **Tốt**, tạo cảm giác mượt mà.
- **Feedback**: Hiển thị lỗi ngay bên dưới input (`errors.fullName`, v.v.) -> **Tốt**.
- **Input Masking**: Như đã đề cập, việc cấm gõ `/` làm giảm trải nghiệm tự nhiên. Nên cho phép gõ `/` nhưng vẫn đảm bảo format đúng.

---

## 3. Đề Xuất Cải Tiến (Action Plan)

### 3.1. Refactor Logic (Ưu tiên cao)
1.  **Type-Safe Validation**: Viết lại hàm `validateField` để không dùng `as any`. Sử dụng `keyof ProfileInput` để đảm bảo type safety.
2.  **Masked Input UX**: Sửa regex trong `masked-date-input.tsx` để cho phép nhập `/` hoặc tự động thêm `/` thông minh hơn (không chặn người dùng xóa).
3.  **Date Limits**: Thêm props `minDate`, `maxDate` cho `MaskedDateInput` và `BirthdayPicker` để chặn nhập năm không hợp lệ ngay từ UI (đồng bộ với Schema).

### 3.2. Clean Code & Maintainability
1.  **Constants**: Đưa các thông báo lỗi/thành công ra file `constants.ts` hoặc `locale.ts`.
2.  **Comments**: Bổ sung comments tiếng Việt giải thích logic masking và validation.

### 3.3. UX Enhancement
1.  **Shake Animation**: Thêm hiệu ứng rung (shake) khi submit form lỗi để gây chú ý.
2.  **Success State**: Khi lưu thành công, có thể hiển thị confetti hoặc checkmark animation rõ hơn ngoài toast.

---

**Kết luận**: Codebase hiện tại có chất lượng khá tốt, tuân thủ kiến trúc. Các vấn đề chủ yếu nằm ở trải nghiệm nhập liệu (Date Input) và tối ưu hóa Type Safety.
