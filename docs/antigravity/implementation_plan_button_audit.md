# Implementation Plan: Button Cancel/Hủy Audit

> **Ngày tạo:** 2025-12-16
> **Phiên:** Button UX Consistency

---

## 1. Vấn đề

- Các button "Hủy", "Cancel", "Xóa" không đồng nhất về variant
- Một số dùng `variant="outline"`, một số dùng `variant="ghost"`, một số dùng `variant="secondary"`
- Hover effects không rõ ràng, không phản ánh tính chất hành động (nguy hiểm vs trung tính)

## 2. Mục đích

- **Button hành động nguy hiểm** (Xóa, Hủy đơn, Remove): Nên dùng `variant="destructive"` hoặc `variant="outline"` với màu đỏ
- **Button đóng dialog/hủy thao tác** (Đóng, Hủy form): Dùng `variant="outline"` hoặc `variant="ghost"`
- Hover effects cần phản ánh tính chất của action

## 3. Phân loại Button

### A. Destructive Actions (Hành động nguy hiểm)
Cần màu đỏ/destructive:
- Xóa (Delete)
- Hủy đơn hàng/cuộc hẹn (Cancel booking)
- Remove item

### B. Cancel/Close Actions (Đóng/Hủy thao tác)
Giữ neutral:
- Đóng dialog
- Hủy (form cancellation)
- Quay lại

## 4. Chiến lược

1. Tìm tất cả Button có text "Hủy", "Xóa", "Cancel", "Delete", "Remove"
2. Phân loại theo ngữ cảnh
3. Áp dụng variant phù hợp:
   - Destructive action: `variant="destructive"` hoặc `variant="outline"` + className destructive
   - Close/cancel: `variant="outline"` hoặc `variant="ghost"`

## 5. Ràng buộc

- Không thay đổi Button component core
- Chỉ thay đổi variant usage tại các feature components
- Phải giữ hover effect đồng nhất

---

## Pending User Approval

Xác nhận chiến lược trước khi thực hiện?
