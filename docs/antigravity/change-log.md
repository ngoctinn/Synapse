# Antigravity Change Log: CSS/Tailwind Refactor

## Tóm tắt thay đổi
Đã thực hiện tái cấu trúc hệ thống CSS/Tailwind nhằm loại bỏ việc ghi đè class thủ công, chuẩn hóa Tokens và cải thiện tính nhất quán giữa Light/Dark mode.

## Chi tiết thay đổi

### 1. Hệ thống Tokens và Utilities (`globals.css`)
- **Tokens:** Map đầy đủ các biến `--alert-*` và `--status-*` vào Tailwind `@theme`.
- **Utilities:**
    - Thêm `.shadow-premium-primary`, `.shadow-premium-lg` cho các hiệu ứng cao cấp.
    - Thêm `.text-gradient-premium` cho các tiêu đề quan trọng.
    - Thêm `.btn-hero` để chuẩn hóa các nút lớn trên Landing page.
    - Thêm `.bg-blob` cho các hiệu ứng nền decor.
    - Thêm `.table-first-cell-padding` và `.table-last-cell-padding` cho DataTable.
    - Thêm hệ thống `.indicator-online`, `.indicator-offline`, `.indicator-busy`.

### 2. Base UI Components nâng cấp
- **Alert.tsx:** Bổ sung các variant: `success`, `warning`, `info`. Các variant này tự động sử dụng màu sắc từ theme tokens.
- **Badge.tsx:** Đồng bộ các variant `success`, `warning`, `info`, `destructive` với theme tokens (loại bỏ hardcoded emerald/amber/red).
- **Button.tsx:** Bổ sung các variant: `success`, `warning`, `outline-success`, `outline-warning`.

### 3. Refactor Features
- **LoginForm.tsx:** Chuyển sang sử dụng `Alert` variant thay vì ghi đè màu thủ công.
- **Hero.tsx:** Thu gọn JSX bằng cách sử dụng các utility class mới (`.text-gradient-premium`, `.btn-hero`, v.v.).
- **DataTable.tsx:** Chuẩn hóa padding bằng utility class thay vì hardcoded `pl-6`/`pr-6`.
- **HoldTimer.tsx:** Chuyển sang sử dụng `Badge` component với variant động.
- **ChatWindow.tsx:** Sử dụng `.indicator-online`/`.indicator-offline`.

## Đánh giá Bảo mật & Tuân thủ
- **Bảo mật:** Không phát hiện rò rỉ secret hoặc lỗi bảo mật CSS.
- **Tuân thủ:**
    - Tuân thủ chuẩn Tailwind v4 (CSS-first).
    - Tuân thủ quy tắc viết code của dự án (OKLCH, Tiếng Việt).
    - Cải thiện đáng kể khả năng bảo trì giao diện.

---
*Người thực hiện: Antigravity Agent*
*Ngày: 2025-12-18*
