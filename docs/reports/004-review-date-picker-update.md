# Báo Cáo Đánh Giá Frontend: Date Picker & Birthday Picker

**Ngày:** 30/11/2025
**Người thực hiện:** Antigravity (AI Agent)
**Đối tượng:** `frontend/src/shared/ui/custom/date-picker.tsx`
**Yêu cầu:** Tách riêng xử lý cho "Ngày sinh" (Birthday Picker), và nâng cấp UX/UI chuẩn Premium.

---

## 1. Phân Tích & Thay Đổi Yêu Cầu
- **Yêu cầu mới:** User muốn xử lý "Riêng" cho ngày sinh (không phải "ring-6").
- **Ý nghĩa:** Cần một component hoặc biến thể chuyên biệt cho việc chọn ngày sinh, vì hành vi người dùng khi chọn ngày sinh khác hẳn với chọn lịch hẹn (cần lướt nhanh về quá khứ xa).

## 2. Đề Xuất Giải Pháp: Tách Component (Separation of Concerns)

Thay vì nhồi nhét quá nhiều logic vào `DatePicker` chung, ta sẽ tạo thêm một component chuyên biệt: **`BirthdayPicker`**.

### 2.1. Component Mới: `src/shared/ui/custom/birthday-picker.tsx`
- **Mục đích:** Chỉ dùng để chọn ngày sinh.
- **Đặc điểm "Premium" & "Riêng":**
  - **Default View:** Khi mở ra, có thể hiển thị ngay danh sách Năm (Year View) hoặc giao diện cuộn (Scroll Wheel) thay vì lịch tháng hiện tại.
  - **Year Range:** Tự động cấu hình từ 1900 đến Năm hiện tại (không có tương lai).
  - **Placeholder:** "Chọn ngày sinh" (mặc định).
  - **Icon:** Có thể dùng icon Bánh sinh nhật hoặc User thay vì Calendar để phân biệt.

### 2.2. Cải Tiến UX/UI (Chung cho cả 2)
- **Visuals:**
  - Thêm hiệu ứng `ring-2 ring-primary/20` khi active (giữ nguyên từ đề xuất trước).
  - **Glassmorphism:** `PopoverContent` có nền mờ sang trọng.
- **Localization:** Fix lỗi hiển thị tháng tiếng Anh (như báo cáo trước).
- **Clearable:** Thêm nút xóa.

## 3. Kế Hoạch Hành Động (Refactor Plan)

### Bước 1: Refactor `DatePicker` (Gốc)
- **File:** `frontend/src/shared/ui/custom/date-picker.tsx`
- **Nhiệm vụ:**
  - Fix lỗi ngôn ngữ (Localization).
  - Thêm nút Clear (X).
  - Cải thiện Style (Ring, Animation).
  - Giữ logic tổng quát cho việc chọn ngày thường.

### Bước 2: Tạo Mới `BirthdayPicker`
- **File:** `frontend/src/shared/ui/custom/birthday-picker.tsx` (New)
- **Nhiệm vụ:**
  - Wrap `DatePicker` hoặc implement riêng sử dụng `Calendar`.
  - Cấu hình sẵn: `fromYear={1900}`, `toYear={new Date().getFullYear()}`.
  - **UX Nâng cao:**
    - Override `captionLayout="dropdown-buttons"` (nếu thư viện hỗ trợ tốt hơn) hoặc custom header để chọn năm nhanh hơn.
    - Thêm prop `defaultMonth` là 20 năm trước để tiện chọn hơn (UX Tip: ít người sinh năm nay dùng app).

### Bước 3: Export Public API
- **File:** `frontend/src/shared/ui/custom/index.ts`
- **Nhiệm vụ:** Export thêm `BirthdayPicker`.

---
**Lưu ý:** Để thực hiện, hãy chạy workflow `/frontend-refactor` và cung cấp đường dẫn file báo cáo này: `docs/reports/004-review-date-picker-update.md`.
