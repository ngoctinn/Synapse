---
phase: planning
title: Lập kế hoạch Dự án & Phân rã Nhiệm vụ - Refactor Frontend Layout
description: Kế hoạch di chuyển và refactor layout components
---

# Lập kế hoạch Dự án & Phân rã Nhiệm vụ

## Các Mốc quan trọng
**Các điểm kiểm tra chính là gì?**

- [ ] Mốc 1: Hoàn thành di chuyển Header/Footer sang `features/layout`.
- [ ] Mốc 2: Cập nhật toàn bộ import và xác nhận ứng dụng chạy ổn định.

## Phân rã Nhiệm vụ
**Công việc cụ thể nào cần được thực hiện?**

### Giai đoạn 1: Chuẩn bị & Di chuyển
- [ ] Nhiệm vụ 1.1: Tạo thư mục `frontend/src/features/layout`.
- [ ] Nhiệm vụ 1.2: Di chuyển `frontend/src/shared/ui/custom/header` sang `frontend/src/features/layout/components/header`.
- [ ] Nhiệm vụ 1.3: Di chuyển Footer (nếu có) hoặc tạo placeholder nếu chưa có nhưng cần thiết.

### Giai đoạn 2: Refactor & Update Imports
- [ ] Nhiệm vụ 2.1: Cập nhật các đường dẫn import trong `Header` (nếu nó import từ relative path cũ).
- [ ] Nhiệm vụ 2.2: Tìm và thay thế tất cả các import `Header` trong toàn bộ dự án (ví dụ: trong `app/layout.tsx`).
- [ ] Nhiệm vụ 2.3: Tạo `index.ts` cho `features/layout` để export public components.

### Giai đoạn 3: Kiểm tra
- [ ] Nhiệm vụ 3.1: Chạy thử ứng dụng, kiểm tra hiển thị Header/Footer.
- [ ] Nhiệm vụ 3.2: Kiểm tra các chức năng trong Header (Dropdown, Navigation).

## Các Phụ thuộc
**Cái gì cần xảy ra theo thứ tự nào?**

- Di chuyển trước, sau đó mới update import.

## Thời gian & Ước tính
**Khi nào mọi thứ sẽ hoàn thành?**

- Ước tính: 30 phút - 1 giờ.

## Rủi ro & Giảm thiểu
**Điều gì có thể đi sai hướng?**

- **Rủi ro**: Sót import dẫn đến lỗi build.
- **Giảm thiểu**: Sử dụng search toàn project để tìm các reference cũ.
