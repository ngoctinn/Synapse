---
phase: planning
title: Lập kế hoạch Dự án & Phân rã Nhiệm vụ - Customer Dashboard (Frontend First)
description: Chia nhỏ công việc thành các nhiệm vụ khả thi và ước tính thời gian cho Customer Dashboard, ưu tiên Frontend và Mock Data
---

# Lập kế hoạch Dự án & Phân rã Nhiệm vụ

## Các Mốc quan trọng
**Các điểm kiểm tra chính là gì?**

- [x] Mốc 1: Hoàn thiện cấu trúc Layout và Mock Data.
- [x] Mốc 2: Hoàn thiện giao diện các trang chức năng (Lịch hẹn, Liệu trình, Hồ sơ) với dữ liệu giả.
- [x] Mốc 3: Review và tinh chỉnh UI/UX.

## Phân rã Nhiệm vụ
**Công việc cụ thể nào cần được thực hiện?**

### Giai đoạn 1: Setup & Mock Data
- [x] Nhiệm vụ 1.1: Định nghĩa TypeScript Interfaces cho `User`, `Appointment`, `Treatment`.
- [x] Nhiệm vụ 1.2: Tạo file `mock-data.ts` chứa dữ liệu mẫu cho các interface trên.
- [x] Nhiệm vụ 1.3: Tạo Mock Service (hoặc Server Actions trả về mock data) để mô phỏng việc gọi API.

### Giai đoạn 2: Frontend UI Structure
- [x] Nhiệm vụ 2.1: Tạo Layout `app/(dashboard)/layout.tsx` và Sidebar/Mobile Menu cho Customer.
- [x] Nhiệm vụ 2.2: Tạo trang Dashboard Home `app/(dashboard)/page.tsx` hiển thị thông tin tóm tắt từ mock data.

### Giai đoạn 3: Feature Implementation (UI Components)
- [x] Nhiệm vụ 3.1: Implement trang Lịch hẹn `app/(dashboard)/appointments/page.tsx` và component hiển thị danh sách (dùng mock data).
- [x] Nhiệm vụ 3.2: Implement trang Liệu trình `app/(dashboard)/treatments/page.tsx` và component hiển thị thẻ (dùng mock data).
- [x] Nhiệm vụ 3.3: Implement trang Hồ sơ `app/(dashboard)/profile/page.tsx` và form cập nhật (mock submit).

### Giai đoạn 4: Polish & Responsive
- [x] Nhiệm vụ 4.1: Xử lý các trạng thái Loading (Skeleton) và Empty.
- [x] Nhiệm vụ 4.2: Review và tinh chỉnh UI trên Mobile (Responsive).

## Các Phụ thuộc
**Cái gì cần xảy ra theo thứ tự nào?**

- Mock Data (Giai đoạn 1) cần có trước để làm UI (Giai đoạn 2, 3).

## Thời gian & Ước tính
**Khi nào mọi thứ sẽ hoàn thành?**

- Giai đoạn 1: 0.5 giờ
- Giai đoạn 2: 1.5 giờ
- Giai đoạn 3: 3 giờ
- Giai đoạn 4: 1 giờ
- **Tổng cộng**: ~6 giờ làm việc.

## Rủi ro & Giảm thiểu
**Điều gì có thể đi sai hướng?**

- **Rủi ro**: Cấu trúc Mock Data khác xa với API thực tế sau này.
- **Giảm thiểu**: Tham khảo kỹ Schema DB dự kiến (dù chưa làm Backend) để định nghĩa Interface sát nhất có thể.
