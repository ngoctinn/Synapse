---
description: Chuyển đổi Screenshot/Design thành UI Production và tạo Visual Assets
---

1. **Phân tích Thiết kế**:
   - Phân tích yêu cầu UI (từ mô tả hoặc hình ảnh).
   - Xác định các component cần thiết (Button, Card, Input, etc.).
   - Kiểm tra thư viện Shadcn UI hiện có trong `frontend/src/shared/ui`.

2. **Chuẩn bị Assets (Nếu cần)**:
   - Nếu cần hình ảnh minh họa, icon, hoặc assets visual, sử dụng `generate_image` để tạo.
   - Lưu assets vào thư mục thích hợp (ví dụ: `frontend/public/images`).

3. **Triển khai Component**:
   - Tạo file component mới trong `frontend/src/features/.../components/` hoặc `frontend/src/shared/components/`.
   - Sử dụng Tailwind CSS để style theo đúng thiết kế (Pixel-perfect).
   - Đảm bảo Responsive (Mobile, Tablet, Desktop).

4. **Tích hợp vào Page**:
   - Import component vào page tương ứng.
   - Kiểm tra hiển thị trên trình duyệt (nếu có thể).

5. **Tinh chỉnh Thẩm mỹ**:
   - Thêm micro-animations (hover, transition).
   - Đảm bảo màu sắc, spacing tuân thủ Design System.
