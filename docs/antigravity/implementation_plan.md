# Kế hoạch Thực thi: Nâng cấp Hiệu ứng Thị giác Sidebar & Header (Premium Design)

## 1. Mục tiêu
- Nâng cấp Sidebar và Header của trang Admin để có hiệu ứng "nổi" (elevation) và vật liệu (material) đồng nhất với các card hiện tại.
- Đảm bảo giao diện hiện đại, sạch sẽ nhưng vẫn giữ được sự đơn giản và dễ sử dụng.

## 2. Phân tích Hiện trạng
- **Sidebar**: Đang dùng `bg-background` phẳng, không shadow, gắn sát lề.
- **Header**: Đã có `backdrop-blur` nhưng chưa có shadow để tạo chiều sâu khi trôi trên nội dung.
- **Background**: `bg-muted/50` cung cấp độ tương phản tốt với các card trắng (`bg-background`).

## 3. Giải pháp Thiết kế
- **Sidebar**:
  - Thêm shadow cao cấp (`shadow-premium-md`).
  - Sử dụng border mảnh (`border-r`) hoặc để Sidebar là một khối nổi (Floating Sidebar) nếu thiết kế cho phép. Tuy nhiên, để giữ sự gọn gàng, chúng ta sẽ bắt đầu bằng việc thêm shadow và tinh chỉnh vật liệu.
  - Tinh chỉnh `SidebarHeader` để đồng nhất với Header chính.
- **Header**:
  - Thêm shadow (`shadow-premium-sm`) để tạo hiệu ứng tách lớp rõ ràng hơn khi scroll.
  - Tăng cường hiệu ứng Glassmorphism.

## 4. Các bước Thực hiện
1. **Tinh chỉnh CSS (nếu cần)**: Kiểm tra lại các utility shadows trong `globals.css`.
2. **Refactor AdminHeader**: Thêm shadow và tinh chỉnh class backdrop.
3. **Refactor AdminSidebar**: Thêm shadow, border và tinh chỉnh hiệu ứng chuyển cảnh.
4. **Kiểm tra Layout**: Đảm bảo sự kết nối giữa Sidebar và Header mượt mà.

## 5. Rủi ro & Giải pháp
- **Rủi ro**: Hiệu ứng quá đà gây rối mắt.
- **Giải pháp**: Sử dụng các giá trị shadow mờ và opacity thấp để giữ sự tinh tế.
