# Báo Cáo Đánh Giá Frontend - Customer Dashboard

**Ngày:** 30/11/2025
**Người đánh giá:** AI Agent
**Phạm vi:** `frontend/src/features/customer-dashboard`

---

## 1. Tổng Quan
Module `customer-dashboard` chịu trách nhiệm hiển thị thông tin cá nhân, lịch hẹn và lịch sử điều trị của khách hàng. Mã nguồn hiện tại tuân thủ cơ bản kiến trúc FSD và Next.js 16, tuy nhiên vẫn còn tồn tại việc sử dụng dữ liệu giả (mock data) và một số vấn đề về Clean Code.

## 2. Đánh Giá Chi Tiết

### 2.1. Kiến Trúc & FSD (Feature-Sliced Design)
- **Cấu trúc thư mục**: Hợp lý, phân chia rõ ràng `components`, `services`, `types`.
- **Public API (`index.ts`)**:
  - **Trạng thái**: ⚠️ Cảnh báo nhẹ.
  - **Chi tiết**: File `index.ts` đang export toàn bộ các component con (`export *`). Điều này làm giảm tính đóng gói của module.
  - **Đề xuất**: Chỉ export Container chính (ví dụ: `DashboardPage` hoặc các widget chính) và các type/action cần thiết.
- **Deep Imports**: Không phát hiện vi phạm nghiêm trọng. Các import đều sử dụng alias `@/features` hoặc `@/shared`.

### 2.2. Chất Lượng Mã Nguồn (Clean Code & Next.js 16)
- **Server Actions (`actions.ts`)**:
  - ✅ Sử dụng đúng chuẩn `"use server"`.
  - ✅ Sử dụng `revalidatePath` để cập nhật cache.
  - ⚠️ **Vấn đề**: `prevState` đang để kiểu `any`. Cần định nghĩa type rõ ràng (ví dụ: `ActionState`).
  - ⚠️ **Vấn đề**: Logic upload ảnh (`avatarFile`) hiện tại chỉ là mock (log ra console). Cần implement logic upload thực tế hoặc comment TODO rõ ràng.

- **Data Fetching (`services/api.ts`)**:
  - ✅ Sử dụng `createClient` từ shared lib để lấy session an toàn.
  - ⚠️ **Vấn đề**: Trộn lẫn giữa Real API (`getCustomerProfile`, `updateCustomerProfile`) và Mock Data (`getCustomerAppointments`, `getCustomerTreatments`).
  - ⚠️ **Vấn đề**: Thực hiện map thủ công `snake_case` <-> `camelCase` trong code. Điều này dễ gây lỗi và khó bảo trì. Nên sử dụng utility chung hoặc cấu hình serializer.
  - ⚠️ **Vấn đề**: Sử dụng `console.log` và `console.error` thay vì Logger chuẩn.
  - ⚠️ **Vấn đề**: `cache: 'no-store'` có thể gây ảnh hưởng hiệu năng nếu gọi quá nhiều. Cần cân nhắc `next: { tags: [...] }` để revalidate theo yêu cầu.

- **Components**:
  - ✅ `ProfileForm` sử dụng `useActionState` đúng chuẩn Next.js 15/16.
  - ✅ `AppointmentList` xử lý tốt các trạng thái (empty state, status badges).
  - ⚠️ **Vấn đề**: `ProfileForm` xử lý `dateOfBirth` bằng hidden input (`dateOfBirth_display`) hơi thủ công.

### 2.3. UX/UI & "WOW" Factor
- **Hiện tại**:
  - Giao diện sạch sẽ, sử dụng Shadcn UI.
  - Có hover effect trên các card lịch hẹn.
  - Đã bản địa hóa Tiếng Việt tốt.
- **Điểm cần cải thiện (Premium)**:
  - **Micro-animations**: Danh sách lịch hẹn (`AppointmentList`) hiện ra ngay lập tức. Nên thêm hiệu ứng `stagger` (xuất hiện lần lượt) để tạo cảm giác mượt mà.
  - **Loading States**: Khi submit form profile, button chỉ hiện text "Đang lưu...". Nên có spinner hoặc hiệu ứng loading đẹp hơn.
  - **Feedback**: Toast notification đã có nhưng cần đảm bảo style đồng bộ với theme "Premium".

---

## 3. Kế Hoạch Hành Động (Refactor Plan)

Để nâng cấp module này, cần thực hiện các bước sau (theo thứ tự ưu tiên):

1.  **Refactor `services/api.ts`**:
    -   Tách logic mapping case ra utility riêng hoặc sử dụng thư viện (như `humps` hoặc cấu hình Pydantic/FastAPI để trả về camelCase).
    -   Loại bỏ `console.log`.
    -   Chuẩn hóa xử lý lỗi.

2.  **Type Safety & Clean Code**:
    -   Định nghĩa type cho `prevState` trong `actions.ts`.
    -   Xóa bỏ hoặc đánh dấu rõ ràng các phần Mock Data cần thay thế.

3.  **Nâng cấp UX/UI**:
    -   Thêm animation cho `AppointmentList` (dùng `framer-motion` nếu có, hoặc CSS animation).
    -   Cải thiện loading state của button submit.

4.  **Tối ưu hóa FSD**:
    -   Review lại `index.ts`, chỉ export những gì thực sự cần thiết cho bên ngoài (Public API).

---

**Lệnh tiếp theo:**
Chạy workflow refactor với báo cáo này:
`@/frontend-refactor docs/reports/009-frontend-review-customer-dashboard.md`
