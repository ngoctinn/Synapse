---
phase: testing
title: Kế hoạch Kiểm thử Admin Dashboard
description: Các trường hợp kiểm thử
---

## Kiểm thử Thủ công (Manual Testing)

### Desktop View
1.  Truy cập `/admin/overview`.
2.  Kiểm tra Sidebar hiển thị bên trái, đầy đủ các mục menu.
3.  Kiểm tra Header hiển thị bên trên, avatar và lời chào đúng.
4.  Scroll nội dung chính, Sidebar và Header phải giữ nguyên (hoặc Header sticky tùy thiết kế).

### Mobile View
1.  Thu nhỏ trình duyệt (< 768px).
2.  Sidebar phải ẩn đi.
3.  Nút Hamburger menu xuất hiện trên Header.
4.  Bấm Hamburger -> Sidebar mở ra (Drawer/Sheet).

## Kiểm thử Tự động (Optional)
- Snapshot testing cho `AdminSidebar` và `AdminHeader`.
