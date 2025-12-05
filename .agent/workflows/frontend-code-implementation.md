---
description: Frontend Code Implementation Workflow (Theme‑aware)
---

# Frontend Code Implementation – Theme‑Aware

> **Goal**: Hỗ trợ người dùng nhanh chóng triển khai mã frontend dựa trên theme đã định nghĩa trong `frontend/src/app/globals.css` và các quy chuẩn UX/UI.

## 1️⃣ Phân tích yêu cầu người dùng
- Trích xuất các thông tin chính từ yêu cầu: loại component, chức năng, phong cách (minimal, elegant, dark mode, …).
- Xác định **không cần** tìm theme vì đã có trong `globals.css`.

## 2️⃣ Xác định theme hiện có
- Đọc file `frontend/src/app/globals.css` để lấy các biến CSS, màu sắc, font, spacing.
- Lưu các token vào biến **`themeTokens`** để dùng trong các component.

## 3️⃣ Nghiên cứu quy chuẩn UX/UI
- Sử dụng workflow **UI/UX Pro Max** để tìm các domain liên quan (style, ux, color, typography) **trừ** domain `theme`.
- Chạy lệnh ví dụ (được tự động hoá trong script):
```bash
python3 .shared/ui-ux-pro-max/scripts/search.py "<keyword>" --domain style
python3 .shared/ui-ux-pro-max/scripts/search.py "<keyword>" --domain ux
```
- Tổng hợp kết quả thành **`uxGuidelines`**.

## 4️⃣ Thiết kế & triển khai component
1. **Tạo file component** (ví dụ `ComponentName.tsx`) trong thư mục phù hợp.
2. **Áp dụng themeTokens**:
   - Sử dụng `className="bg-primary/80 text-primary-foreground"` hoặc các custom property `var(--color-primary)` đã định nghĩa.
   - Đảm bảo `font-family` và `spacing` khớp với `globals.css`.
3. **Áp dụng UX guidelines**:
   - Thêm `cursor-pointer` cho mọi phần tử có thể click.
   - Đặt `transition-colors duration-200` cho hover.
   - Kiểm tra contrast (≥4.5:1) cho text và background.
   - Đảm bảo `focus-visible` và `aria‑label` cho accessibility.
4. **Kiểm tra responsive** với các breakpoint đã định nghĩa trong theme (`sm`, `md`, `lg`, `xl`).

## 5️⃣ Kiểm thử & xác nhận chất lượng
- Chạy **Pre‑Delivery Checklist** (cùng với UI/UX Pro Max) để xác nhận:
  - Không có emoji làm icon.
  - Tất cả icon dùng SVG chuẩn.
  - Hover không gây layout shift.
  - Cursor pointer, transition, contrast, accessibility đều đạt.
- Kiểm thử trên **dark & light mode** bằng cách chuyển class `dark` trên `<html>`.

## 6️⃣ Ghi chú & tài liệu
- Ghi lại **themeTokens** đã dùng và nguồn UX guideline trong comment đầu file component.
- Cập nhật `README.md` hoặc tài liệu nội bộ để các thành viên khác biết cách tái sử dụng theme.

---

**Lưu ý**: Nếu người dùng muốn tùy chỉnh theme, chỉ cần sửa `globals.css` và chạy lại workflow để cập nhật các component.
