# Kế hoạch Triển khai: Phân tích và Tái cấu trúc Hệ thống CSS/Tailwind (Antigravity)

## 1. Mục tiêu (Objectives)
- **Chuẩn hóa Token:** Đảm bảo toàn bộ hệ thống màu sắc, spacing, typography được định nghĩa qua CSS Variables trong `globals.css` và map vào Tailwind theme.
- **Giảm ghi đè lặp lại:** Chuyển các tổ hợp class lặp lại nhiều lần vào `alertVariants`, `buttonVariants` hoặc `@layer utilities`.
- **Tăng tính nhất quán:** Sử dụng variants cho các trạng thái `success`, `warning`, `info` thay vì viết thủ công class.
- **Tối ưu hóa Tailwind v4:** Tận dụng các tính năng mới của v4 (CSS-first config, auto-apply base styles).

## 2. Phạm vi (Scope)
- `frontend/src/app/globals.css`: Trung tâm quản lý token và utilities.
- `frontend/src/shared/ui/`: Cập nhật các component nền tảng (Alert, Button, Badge, Input, v.v.).
- `frontend/src/shared/ui/custom/`: Refactor các component phức tạp (DataTable, FormTabs).
- `frontend/src/features/`: Quét và thay thế các đoạn mã CSS ghi đè thủ công.

## 3. Các bước thực hiện (Execution Steps)

### Giai đoạn 1: Chuẩn hóa System Tokens & Utilities
- Rà soát `globals.css`.
- Đảm bảo các biến `--alert-*` và `--status-*` được map đầy đủ vào `@theme`.
- Thêm các utility class cho các pattern phổ biến (ví dụ: `flex-center`, `absolute-center`, hoặc các pattern shadow luxury).

### Giai đoạn 2: Cải tiến Base UI Components (Variants)
- **Alert**: Thêm `success`, `warning`, `info`.
- **Badge**: Đồng bộ variants với Alert.
- **Button**: Chuẩn hóa các variant `soft`, `ghost`, `outline` để tránh phải thêm class ngoài.
- **Input**: Đảm bảo style focus đồng nhất qua `focus-premium`.

### Giai đoạn 3: Refactor Features & Layouts
- Quét toàn bộ `src/features` để tìm các đoạn code có style chồng chéo.
- Thay thế các đoạn CSS "hardcoded" bằng các component variants mới.
- Đặc biệt ưu tiên refactor `LoginForm`, `Hero`, `DataTable`.

### Giai đoạn 4: Kiểm tra & Tối ưu
- Chạy `pnpm lint` và `pnpm build`.
- Kiểm tra tính tương thích Dark mode.
- Đảm bảo không có Regression (lỗi hiển thị mới).

## 4. Rủi ro & Giải pháp (Risks & Mitigations)
- **Rủi ro:** Làm vỡ giao diện ở những chỗ không test kỹ.
- **Giải pháp:** Thực hiện thay đổi từng bước nhỏ (Atomic updates), kiểm tra trực quan sau mỗi bước.
- **Rủi ro:** Xung đột giữa các utility mới và cũ.
- **Giải pháp:** Sử dụng `tailwind-merge` (`cn` helper) một cách triệt để.

## 5. Định nghĩa Hoàn thành (Definition of Done)
- Không còn các đoạn ghi đè màu sắc (bg-green-50, text-green-800...) thủ công cho Alert/Badge.
- Mã nguồn gọn gàng hơn, số lượng class trong JSX giảm ít nhất 20% ở các file được refactor.
- Build thành công không có lỗi CSS.
