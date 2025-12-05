# Báo cáo Đánh giá Frontend: Staff Feature

**Ngày:** 2025-12-05
**Người thực hiện:** AI Assistant
**Phạm vi:** `frontend/src/features/staff` và `frontend/src/app/(admin)/admin/staff`

## 1. Tổng quan & Kiến trúc (FSD)

### 1.1. Cấu trúc Thư mục & Public API
- **Tuân thủ**: Module `staff` có file `index.ts` export các component cần thiết (`StaffPage`, `InviteStaffModal`, `StaffTable`, v.v.).
- **Vấn đề**:
  - Component `StaffPage` (`frontend/src/features/staff/components/staff-page.tsx`) được thiết kế để làm view chính (có Tabs: Danh sách, Phân quyền, Lịch làm việc) nhưng **KHÔNG ĐƯỢC SỬ DỤNG** trong route chính.
  - Route `frontend/src/app/(admin)/admin/staff/page.tsx` đang tự triển khai lại logic hiển thị danh sách và header, bỏ qua cấu trúc Tabs của `StaffPage`.

### 1.2. Logic & Data Fetching
- **Duplication**: Logic fetch `getStaffList` và `getSkills` bị lặp lại giữa `StaffPage` và `page.tsx`.
- **Thin Pages**: `page.tsx` hiện tại chứa khá nhiều logic UI (Sticky Header, Layout) nên được chuyển xuống feature component.

## 2. Đánh giá UI/UX (Premium Standards)

### 2.1. Staff Page (`page.tsx` hiện tại)
- **Ưu điểm**:
  - Sticky Header với hiệu ứng Glassmorphism (`bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`) trông hiện đại và cao cấp.
  - Sử dụng `Suspense` cho loading state.
- **Nhược điểm**:
  - Chỉ hiển thị danh sách nhân viên, thiếu các tính năng "Phân quyền" và "Lịch làm việc" mà `StaffPage` cung cấp.

### 2.2. Staff Page Component (`staff-page.tsx`)
- **Ưu điểm**:
  - Cấu trúc Tabs rõ ràng, hỗ trợ mở rộng tính năng.
- **Nhược điểm**:
  - Header đơn giản, chưa có hiệu ứng Sticky và Glassmorphism như `page.tsx`.
  - Layout chưa được tối ưu cho trải nghiệm "tràn viền" (full height) mượt mà.

### 2.3. Components Con (`StaffTable`, `InviteStaffModal`)
- **StaffTable**:
  - UI tốt: `AnimatedTableRow`, `Avatar`, `Badge` (có tooltip cho danh sách kỹ năng dài).
  - UX tốt: Pagination tích hợp.
- **InviteStaffModal**:
  - Sử dụng `useActionState` (Next.js 15) chuẩn.
  - Form validation với Zod tốt.

## 3. Đề xuất Cải tiến (Action Plan)

### 3.1. Hợp nhất `StaffPage` và `page.tsx`
Mục tiêu: Sử dụng `StaffPage` làm view chính để tận dụng tính năng Tabs, đồng thời mang giao diện Premium Header từ `page.tsx` vào.

1.  **Refactor `StaffPage`**:
    - Chuyển logic Sticky Header từ `page.tsx` vào `StaffPage`.
    - Đảm bảo `TabsList` nằm trong Sticky Header để luôn truy cập được khi cuộn.
    - Nhận data từ props (hoặc fetch nội bộ nếu giữ Server Component pattern).

2.  **Update `page.tsx`**:
    - Chỉ giữ lại logic fetch data (nếu cần thiết để pass props) hoặc gọi trực tiếp `<StaffPage />`.
    - Loại bỏ code UI thừa.

### 3.2. Nâng cấp UI/UX
- **Micro-animations**: Thêm animation khi chuyển Tab (slide-in/fade-in).
- **Glassmorphism**: Áp dụng hiệu ứng mờ cho Header của `StaffPage`.
- **Responsive**: Kiểm tra hiển thị Tabs trên mobile (có thể cần chuyển thành Select hoặc scrollable list).

## 4. Kết luận
Cần thực hiện Refactor để đồng bộ hóa code và giao diện. Việc này sẽ giúp code gọn gàng hơn (tuân thủ FSD) và mang lại trải nghiệm người dùng đầy đủ hơn (có thêm tính năng Phân quyền và Lịch làm việc).

---
**Khuyến nghị tiếp theo**: Chạy workflow `/frontend-refactor` với input là báo cáo này để thực hiện các thay đổi.
