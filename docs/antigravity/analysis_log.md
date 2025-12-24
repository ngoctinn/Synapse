# Nhật ký Phân tích Tác động: Giao diện Sidebar & Header

## 1. Chia nhỏ Nhiệm vụ (SPLIT)
- [ ] Task 1: Cập nhật `AdminHeader` - Thêm shadow và tinh chỉnh blur.
- [ ] Task 2: Cập nhật `AdminSidebar` - Thêm `shadow-premium-md` và tinh chỉnh border/background.
- [ ] Task 3: Đồng bộ trạng thái Expand/Collapse của Sidebar với Header (đảm bảo shadow không bị lỗi layout).

## 2. Phân tích Tác động (ANALYZE)
- **File bị ảnh hưởng**:
  - `frontend/src/features/admin/components/header.tsx`: Ảnh hưởng đến toàn bộ các trang quản trị.
  - `frontend/src/features/admin/components/sidebar.tsx`: Ảnh hưởng đến menu điều hướng.
- **Tác động UX/UI**:
  - **Tích cực**: Giao diện cảm giác có "chiều sâu" hơn, các thành phần điều hướng tách biệt rõ ràng với nội dung.
  - **Rủi ro**: Shadow có thể bị chồng chéo (overlap) nếu không xử lý đúng z-index.
- **Khả năng duy trì**: Sử dụng các Tailwind class hiện có trong `globals.css` nên rất dễ bảo trì.

## 3. Quyết định Kỹ thuật
- Sử dụng `shadow-premium-sm` cho Header để tránh cảm giác nặng nề ở phía trên.
- Sử dụng `shadow-premium-md` cho Sidebar vì đây là khối điều hướng chính cần sự ổn định thị giác.
- Giữ nguyên `backdrop-blur-md` vì đây là mức độ mờ vừa phải, không gây lag trên các thiết bị yếu.
