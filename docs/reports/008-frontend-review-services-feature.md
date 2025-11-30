# Báo Cáo Đánh Giá Frontend: Services Feature

**Ngày:** 30/11/2025
**Người thực hiện:** AI Agent
**Phạm vi:** `frontend/src/features/services`

---

## 1. Tổng Quan
Module `services` được tổ chức khá tốt theo kiến trúc Feature-Sliced Design (FSD). Có `index.ts` đóng vai trò Public API, tách biệt rõ ràng giữa Server Actions, UI Components và Types. Tuy nhiên, vẫn còn một số vấn đề về bảo mật (validation tại server) và Clean Code cần khắc phục.

## 2. Chi Tiết Đánh Giá

### 2.1. Kiến Trúc & Tuân Thủ FSD
- **[ĐẠT] Public API**: Module có file `index.ts` export đúng các thành phần cần thiết (`CreateServiceDialog`, `ServiceTable`, `actions`, `types`).
- **[ĐẠT] Phân chia trách nhiệm**:
  - `actions.ts`: Xử lý logic server-side.
  - `components/`: Chứa UI logic.
  - `types.ts`: Định nghĩa kiểu dữ liệu.

### 2.2. Next.js 16 & Clean Code
- **[VI PHẠM] Thiếu Validation tại Server Action (`actions.ts`)**:
  - Các hàm `createService`, `updateService` nhận dữ liệu thô và gửi thẳng đến API backend mà không kiểm tra lại bằng Zod.
  - **Rủi ro**: Nếu hacker bypass client-side validation, dữ liệu rác có thể được gửi lên server.
  - **Khắc phục**: Import schema từ `service-form.tsx` (hoặc tách ra file riêng) và validate ngay đầu hàm server action.

- **[VI PHẠM] Sử dụng `any` (`service-form.tsx`)**:
  - Dòng 54: `resolver: zodResolver(serviceSchema) as any`.
  - **Khắc phục**: Fix type cho `zodResolver` hoặc kiểm tra lại phiên bản thư viện để tránh dùng `any`.

- **[CẢI THIỆN] Comments tiếng Anh (`actions.ts`)**:
  - Các comment như `// 1. Get existing service` nên được chuyển sang Tiếng Việt để đồng bộ với quy tắc dự án.

- **[CẢI THIỆN] Xử lý lỗi (`actions.ts`)**:
  - Hàm `cloneService` chỉ `console.error` và trả về message chung chung. Nên log structured error và trả về chi tiết hơn nếu cần (hoặc giữ nguyên message cho user nhưng log kỹ hơn cho dev).

### 2.3. UX/UI & "WOW" Factors
- **[ĐẠT] Trực quan hóa thời gian**: Tính năng hiển thị thanh thời gian (Phục vụ + Nghỉ) trong `ServiceForm` rất tốt, mang lại trải nghiệm cao cấp.
- **[ĐẠT] Responsive**: `ServiceTable` ẩn bớt cột trên mobile.
- **[ĐỀ XUẤT] Micro-animations**:
  - Thêm hiệu ứng transition khi mở/đóng `CreateServiceDialog`.
  - Thêm hiệu ứng hover nhẹ cho các hàng trong bảng (đã có `hover:bg-slate-50/50` nhưng có thể làm mượt hơn).
  - Thêm loading state dạng skeleton cho bảng khi đang fetch dữ liệu (hiện tại chưa thấy xử lý loading state của bảng, chỉ có empty state).

- **[ĐỀ XUẤT] Empty State cao cấp hơn**:
  - Thay vì icon `Plus` đơn giản, có thể dùng một hình minh họa SVG nhỏ (illustration) để làm giao diện sinh động hơn.

## 3. Kế Hoạch Hành Động (Refactor Plan)

### Bước 1: Tăng cường bảo mật & Type Safety
1.  Tách `serviceSchema` ra file `schemas.ts` (hoặc để trong `types.ts` nếu dùng `zod-to-ts` nhưng tốt nhất là file riêng hoặc `schemas.ts` trong cùng thư mục).
2.  Cập nhật `actions.ts`: Import schema và thực hiện `schema.parse(data)` trước khi gọi API.
3.  Xóa `as any` trong `service-form.tsx`.

### Bước 2: Chuẩn hóa Code & Comments
1.  Dịch toàn bộ comment trong `actions.ts` sang Tiếng Việt.
2.  Refactor `getServices` để xử lý query string gọn gàng hơn (ví dụ dùng `URLSearchParams` nếu phức tạp hơn, hiện tại string template vẫn ổn nhưng cần chú ý mở rộng).

### Bước 3: Nâng cấp UX
1.  Thêm Skeleton Loading cho `ServiceTable`.
2.  Cập nhật Empty State với thiết kế đẹp hơn.

---
**Kết luận**: Module đạt khoảng 80% tiêu chuẩn. Cần ưu tiên fix lỗi validation server-side ngay lập tức.
