---
phase: improvement
title: Kế hoạch Cải tiến UI/UX - Booking Wizard
description: Roadmap tinh chỉnh giao diện Booking Wizard dựa trên báo cáo đánh giá chuyên sâu
feature: booking-wizard
status: draft
created: 2025-12-13
---

# Kế hoạch Triển khai Cải tiến UI/UX: Booking Wizard

**Mục tiêu:** Đạt chuẩn "Premium Minimal UX" - Tối giản, trực quan, nhất quán trên mọi thiết bị.
**Nguồn:** Dựa trên báo cáo `docs/ai/reviews/ui-review-booking-wizard.md`.

---

## Phase 1: Critical UX & Data Feedback (Ưu tiên Cao)
*Mục tiêu: Đảm bảo người dùng hiểu rõ trạng thái hệ thống và thao tác được trên mobile.*

### Nhiệm vụ 1.1: Fix Mobile Selection State (U-01)
- [ ] **File:** `src/features/booking-wizard/components/step-services/service-card.tsx`
- [ ] **Mô tả:** Checkbox hiện đang ẩn và chỉ hiện khi hover. Trên mobile không có hover -> User không thấy checkbox.
- [ ] **Action:** Cập nhật logic class `opacity`:
  - Hiện tại: `!isSelected && "opacity-0 group-hover:opacity-100"`
  - Mới: `!isSelected && "opacity-0 sm:group-hover:opacity-100"` (hoặc luôn hiển thị border rõ hơn khi selected).
  - Đảm bảo `Card` có border highlight rõ ràng khi `isSelected`.

### Nhiệm vụ 1.2: Hiển thị Tên KTV Thực tế (U-06)
- [ ] **File:** `src/features/booking-wizard/components/step-payment/booking-summary.tsx`
- [ ] **Mô tả:** Hiện tại hiển thị hardcoded "KTV: Đã chọn".
- [ ] **Action:**
  - Sử dụng `staffId` từ store.
  - Cần logic để lấy tên KTV từ `staffId`.
  - **Giải pháp UI (để không gọi API mới):**
    - Truyền thêm `staffName` vào store khi chọn staff ở Step 2.
    - Hoặc (nếu store chỉ giữ ID) dùng list `availableStaff` (nếu có context) để lookup.
    - *Tạm thời:* Update store `useBookingStore` thêm field `staffName` hoặc lookup từ `staffList` mock data nếu có thể.

### Nhiệm vụ 1.3: Chuẩn hóa Typography (CS-01)
- [ ] **File:** Tất cả các file trong `components/step-*/*.tsx`
- [ ] **Mô tả:** Heading đang lộn xộn (`text-2xl`, `xl`, `lg`).
- [ ] **Action:** Thống nhất Typography System:
  - **Page Title:** `text-2xl font-bold` (đã có ở WizardHeader/StepTitle).
  - **Section Title:** `text-lg font-semibold` (Ví dụ: "Chọn ngày", "Thông tin khách hàng").
  - **Body:** `text-sm`.
  - **Muted:** `text-xs text-muted-foreground`.

---

## Phase 2: Layout & Visual Polish (Ưu tiên Trung bình)
*Mục tiêu: Giao diện sạch sẽ, thoáng đãng và responsive tốt hơn.*

### Nhiệm vụ 2.1: Thống nhất Container Padding (L-01)
- [x] **File:** `src/features/booking-wizard/components/booking-wizard.tsx`
- [x] **Mô tả:** `px-0 sm:px-4` làm content dính sát lề màn hình mobile.
- [x] **Action:** Đổi thành `px-4` (hoặc `container` class mặc định của shadcn đã có padding, kiểm tra lại wrapper). Đảm bảo `max-w-2xl` vẫn center.

### Nhiệm vụ 2.2: Cải thiện Layout PaymentStep (L-03)
- [x] **File:** `src/features/booking-wizard/components/step-payment/payment-step.tsx`
- [x] **Mô tả:** Grid chia 3 cột (2 cho form, 1 cho summary) trên desktop nhìn form hơi rộng và summary hơi chật.
- [x] **Action:**
  - Mobile: `grid-cols-1` (giữ nguyên).
  - Desktop (`lg`): Chuyển sang `grid-cols-5`. Form chiếm 3 phần (`lg:col-span-3`), Summary chiếm 2 phần (`lg:col-span-2`).

### Nhiệm vụ 2.3: Polish DatePicker UI (U-02)
- [x] **File:** `src/features/booking-wizard/components/step-time/date-picker.tsx`
- [x] **Mô tả:** Các nút ngày tháng có chiều rộng không đều nhau khi nội dung thay đổi (VD: "CN" vs "Thứ 2").
- [x] **Action:** Thêm `min-w-[4.5rem]` hoặc `w-[4.5rem]` vào class của button ngày để chúng đều tăm tắp.

### Nhiệm vụ 2.4: Đồng bộ Icon Size (CS-05)
- [x] **File:** `booking-summary.tsx`, `service-card.tsx`, `hold-timer.tsx`
- [x] **Mô tả:** Icon đang dùng lẫn lộn `size-3`, `size-4`, `w-3 h-3`.
- [x] **Action:** Find & Replace toàn bộ về chuẩn `size-4` (16px) cho các icon thông thường. `size-3.5` cho các chi tiết phụ siêu nhỏ.

---

## Phase 3: Accessibility & Micro-interactions (Ưu tiên Thấp)
*Mục tiêu: Đạt chuẩn a11y và trải nghiệm người dùng tinh tế.*

### Nhiệm vụ 3.1: Accessibility cho Timer (U-05)
- [x] **File:** `src/features/booking-wizard/components/step-time/hold-timer.tsx`
- [x] **Action:** Thêm attribute `role="timer"` và `aria-live="polite"` vào container đếm ngược để Screen Reader đọc được.

### Nhiệm vụ 3.2: Auto-focus Form (U-04)
- [x] **File:** `src/features/booking-wizard/components/step-payment/customer-form.tsx`
- [x] **Action:** Thêm prop `autoFocus` vào input "Họ và tên" để user có thể gõ ngay khi vào bước 4.

### Nhiệm vụ 3.3: Dọn dẹp UI rác (S-01, U-03)
- [x] **File:** `technician-step.tsx`, `time-slots.tsx`
- [x] **Action:**
  - Xóa divider text dư thừa trong `TechnicianStep`.
  - Format code, xóa double line breaks.

---

## Quy trình Kiểm thử & Verification

Sau khi thực hiện mỗi Phase, chạy lệnh sau để đảm bảo chất lượng:

1.  **Linting:** `npm run lint` (Phải pass 100%).
2.  **Build:** `npm run build` (Không có lỗi type/compile).
3.  **Manual Check:** Mở trình duyệt (Mobile view & Desktop view) tại `/booking` để verify các thay đổi UI.

---
*Kế hoạch được tạo tự động bởi UI/UX Specialist Agent.*
