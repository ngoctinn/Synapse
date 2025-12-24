# Nhật ký Phân tích: Đồng bộ hóa Design System

## Phân tích tác động
Việc thay đổi kích thước Button và Radius của Card có thể ảnh hưởng đến:
- **Layout Alignment**: Các grid có thể bị xê dịch nhẹ do Button cao hơn (36px -> 40px).
- **WhitespaceBalance**: Card bo góc lớn hơn (8px -> 12px) cần nhiều không gian trống (padding) bên trong hơn để trông cân đối.
- **Tính nhất quán**: Sửa thiếu một chỗ sẽ khiến giao diện trông "khớp khểnh".

## Danh sách 100 vấn đề cần Refactor (Tóm lược)

### Nhóm 1: Ghi đè Kích thước Button (h-9, px-4, size="sm")
1.  **Appointments**: `view-switcher.tsx` dùng `size="sm"` (h-8 -> h-9 mới).
2.  **Appointments**: `appointments-page.tsx` nút filter dùng `h-9`.
3.  **Customers**: `customer-filter.tsx` nút reset dùng `h-9`.
4.  **Staff**: `staff-page.tsx` nút thêm mới dùng `h-9`.
5.  **Staff**: `scheduling/toolbar/view-switcher.tsx` dùng `size="sm"`.
6.  **Services**: `service-filter.tsx` nút tìm kiếm dùng `h-9`.
7.  **Resources**: `resource-toolbar.tsx` nút action dùng `h-9`.
8.  **Waitlist**: `create-waitlist-trigger.tsx` dùng `h-9`.
9.  **Warranty**: `warranty-page.tsx` nút lọc dùng `h-9`.
10. **Treatments**: `treatments-page.tsx` nút in báo cáo dùng `h-9`.
11. **Landing Page**: `cta-section.tsx` dùng `px-8 h-12` (cần kiểm tra lại độ đậm).
12. **Notification**: `notification-bell.tsx` dùng `h-9 w-9` (cần đổi sang `size="icon"` mặc định).
... (Và 30+ vị trí tương tự khác đang sử dụng h-9)

### Nhóm 2: Radius cũ cho Card (rounded-lg thay vì rounded-xl/surface-card)
13. **Dashboard**: `recent-appointments.tsx` dùng `rounded-lg border`.
14. **Appointments**: `appointments-page.tsx` container khung dùng `rounded-lg`.
15. **Staff**: `staff-page.tsx` danh sách nhân viên dùng `rounded-lg`.
16. **Staff**: `scheduling/calendar/week-view.tsx` các ô lịch dùng `rounded-lg`.
17. **Reviews**: `review-card.tsx` dùng `rounded-lg shadow-sm`.
18. **Booking Wizard**: `summary-step.tsx` khung tóm tắt dùng `rounded-lg`.
19. **Booking Wizard**: `booking-success.tsx` màn hình thành công dùng `rounded-lg`.
20. **Treatments**: `treatment-sheet.tsx` phần chi tiết dùng `rounded-lg`.
21. **Settings**: `exceptions-panel.tsx` khung ngoại lệ dùng `rounded-lg`.
22. **Services**: `service-basic-info.tsx` khung bao quanh form dùng `rounded-lg`.
... (Và 20+ vị trí card/header/section khác cần nâng cấp lên rounded-xl)

### Nhóm 3: Typography & Paragraph Spacing (line-height & leading-*)
23. **Booking Wizard**: `service-card.tsx` mô tả dùng `line-clamp` nhưng thiếu `line-height` tối ưu.
24. **Landing Page**: `hero.tsx` title dùng `leading-tight` (có thể quá chật cho tiếng Việt).
25. **Landing Page**: `features.tsx` mô tả tính năng dùng `leading-normal`.
26. **Notifications**: `notification-item.tsx` nội dung thông báo dùng `leading-snug`.
27. **Chat**: `chat-window.tsx` tin nhắn dùng `leading-normal`.
28. **Customer Dashboard**: `appointment-timeline.tsx` nội dung timeline.
29. **Admin**: `header.tsx` tên user dùng `leading-none` (dễ bị mất dấu nếu chữ g, y).
30. **Dashboard**: `recent-appointments.tsx` nhãn vai trò dùng `leading-none`.
... (Và 20+ vị trí văn bản dài cần áp dụng .prose-vi hoặc leading-relaxed)

### Nhóm 4: Padding & Ghi đè thủ công
31. **Input**: Nhiều nơi dùng `pl-10` thủ công thay vì dùng prop của `Input`.
32. **Dialog**: `cancel-dialog.tsx` dùng `p-6` thủ công (nên dùng class utility chung).
33. **StatsCards**: `stats-cards.tsx` dùng `p-4`, cần nâng lên `p-6` cho thoáng.
34. **ServiceCard**: `service-card.tsx` có `pr-6` có thể gây lệch text.
35. **Form**: `staff-general-info.tsx` dùng `gap-4` (tiếng Việt cần gap-6 cho thoáng hơn).
... (Và danh sách tiếp tục được liệt kê trong quá trình refactor)

---
**Ghi chú**: Tổng số vị trí cần điều chỉnh ước tính khoảng 110-120 điểm. Tôi sẽ thực hiện theo từng module `features/`.
