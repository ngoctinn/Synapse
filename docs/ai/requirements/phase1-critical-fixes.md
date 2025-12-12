---
phase: requirements
title: Phase 1 - Khắc Phục Lỗi Quan Trọng (P0)
description: Đảm bảo các tính năng hiện có hoạt động đúng trước khi phát triển tính năng mới
status: draft
priority: P0
estimated_days: 2-3
created_at: 2025-12-11
---

# Phase 1: Khắc Phục Lỗi Quan Trọng (P0)

## Tuyên bố Vấn đề

**Chúng ta đang giải quyết vấn đề gì?**

Hệ thống Frontend hiện tại có một số lỗi UX và code quality ảnh hưởng đến trải nghiệm người dùng:

1. **Search không hoạt động** tại trang Dịch vụ (ServicesPage) - Input có UI nhưng không có logic xử lý
2. **Thiếu Validation thời gian** - ShiftForm cho phép `endTime <= startTime`
3. **Image không có Fallback** - ServiceCard hiển thị lỗi khi URL ảnh rỗng
4. **Hardcoded Colors** - Một số component dùng màu cố định thay vì design tokens
5. **TypeScript Workarounds** - Sử dụng `@ts-expect-error` thay vì sửa type

**Ai bị ảnh hưởng?**
- Admin/Lễ tân khi tìm kiếm dịch vụ
- Admin khi tạo ca làm việc với thời gian không hợp lệ
- Khách hàng xem Landing Page với ảnh lỗi

**Tình huống hiện tại:**
- Các module khác (Customer, Staff, Resources) đã có Search hoạt động đúng
- Lint đã pass với 0 errors, 2 warnings nhỏ

---

## Mục tiêu & Mục đích

**Mục tiêu chính:**
- [x] Đảm bảo 100% tính năng Search hoạt động nhất quán
- [x] Loại bỏ các lỗi validation có thể gây ra dữ liệu không hợp lệ
- [x] Cải thiện UX với image fallback
- [x] Tuân thủ Design System 100%

**Phi mục tiêu (Nằm ngoài phạm vi):**
- ❌ Kết nối Backend API thật (sẽ làm ở Phase sau)
- ❌ Tạo module mới (Billing, Reviews, Analytics)
- ❌ Refactor kiến trúc lớn

---

## Câu chuyện Người dùng & Trường hợp Sử dụng

### US-1: Admin tìm kiếm Dịch vụ
> Là một **Admin**, tôi muốn **tìm kiếm dịch vụ theo tên** để **nhanh chóng tìm được dịch vụ cần chỉnh sửa**.

**Tiêu chí chấp nhận:**
- [ ] Input search có `onChange` handler
- [ ] URL params được cập nhật khi gõ (debounce 300ms)
- [ ] Danh sách dịch vụ được lọc theo search query
- [ ] Có loading indicator khi đang search

### US-2: Admin tạo Ca làm việc hợp lệ
> Là một **Admin**, tôi muốn **được cảnh báo khi nhập thời gian kết thúc trước thời gian bắt đầu** để **tránh tạo ca làm việc không hợp lệ**.

**Tiêu chí chấp nhận:**
- [ ] Hiển thị lỗi validation khi `endTime <= startTime`
- [ ] Form không thể submit khi có lỗi
- [ ] Thông báo lỗi bằng tiếng Việt rõ ràng

### US-3: Khách hàng xem Dịch vụ
> Là một **Khách hàng**, tôi muốn **xem hình ảnh dịch vụ hoặc placeholder** để **trang web luôn hiển thị đẹp**.

**Tiêu chí chấp nhận:**
- [ ] Hiển thị placeholder image khi `image_url` rỗng hoặc null
- [ ] Không có lỗi console khi ảnh load thất bại
- [ ] Placeholder có style nhất quán với design system

---

## Tiêu chí Thành công

| Metric | Mục tiêu | Cách đo |
|--------|----------|---------|
| Search hoạt động | 100% modules | Kiểm tra thủ công 4 trang |
| Validation pass | 0 lỗi logic | Submit form với dữ liệu không hợp lệ |
| Image fallback | 100% cards | Xóa URL ảnh và kiểm tra |
| Lint clean | 0 errors | `pnpm lint` |
| TypeScript clean | 0 errors | `pnpm type-check` |

---

## Ràng buộc & Giả định

**Ràng buộc kỹ thuật:**
- Giữ nguyên cấu trúc component hiện tại
- Sử dụng hook `useSearchParam` đã có sẵn
- Tuân thủ Zod validation pattern hiện tại

**Giả định:**
- Các module khác (Customer, Staff, Resources) là reference chuẩn
- Design tokens trong `globals.css` đã đầy đủ
- User không dùng reduced motion (nhưng vẫn support)

---

## Phạm vi Chi tiết

### Task 1.1: Kết nối Search Input - ServicesPage
**File:** `frontend/src/features/services/components/services-page.tsx`
**Reference:** `frontend/src/features/customers/components/customers-page.tsx`

**Thay đổi cần làm:**
1. Import `useSearchParam` hoặc tự implement logic search
2. Thêm `onChange` handler cho Input
3. Truyền search query xuống `ServiceListWrapper`
4. Cập nhật action `getServices` call với search param

### Task 1.4: Validation ShiftForm
**File:** `frontend/src/features/staff/components/scheduling/shift-form.tsx`

**Thay đổi cần làm:**
1. Thêm Zod `.refine()` để validate `endTime > startTime`
2. Thêm thông báo lỗi tiếng Việt

```typescript
const formSchema = z.object({
  // ... existing fields
}).refine(
  (data) => data.endTime > data.startTime,
  {
    message: "Giờ kết thúc phải sau giờ bắt đầu",
    path: ["endTime"],
  }
);
```

### Task 1.6: Image Fallback - ServiceCard
**File:** `frontend/src/features/landing-page/components/service-card.tsx`

**Thay đổi cần làm:**
1. Thêm fallback URL khi `image_url` rỗng
2. Thêm `onError` handler cho Image component
3. Sử dụng placeholder từ design system

---

## Câu hỏi & Các mục Mở

- [x] Hook `useSearchParam` có hỗ trợ multi-params không? → Đã confirm: Có
- [ ] Có cần skeleton loading khi search không? → Recommend: Có
- [ ] Placeholder image sử dụng local hay external URL? → Đề xuất: Local SVG
