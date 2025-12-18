# Nhật ký Phân tích: CSS/Tailwind Refactor

## 1. Khảo sát Hệ thống Token (`globals.css`)
- **Phát hiện:** Dự án đã có hệ thống OKLCH tokens rất tốt cho `primary`, `secondary`, `alert-success`, `status-pending`, v.v.
- **Vấn đề:** Các component hiện tại (`Badge`, `Alert`) chưa sử dụng triệt để các token này mà vẫn dùng hardcoded Tailwind colors (ví dụ: `bg-emerald-100`).

## 2. Rà soát UI Components (`shared/ui/`)
- **Alert.tsx:**
    - Chỉ có variant `default` và `destructive`.
    - Cần bổ sung `success`, `warning`, `info` sử dụng các biến `--alert-*`.
- **Badge.tsx:**
    - Có hệ thống preset và variant đồ sộ nhưng đang sử dụng hardcoded colors.
    - Cần chuyển sang sử dụng theme variables để đảm bảo đồng bộ với `globals.css` và dễ bảo trì Dark mode.
- **Button.tsx:**
    - Cấu trúc tốt, nhưng cần kiểm tra xem variant `soft` có đồng bộ với hệ thống màu mới không.

## 3. Phân tích Feature Components
- **LoginForm.tsx:**
    - Đang ghi đè thủ công class cho Alert dựa trên trạng thái `registered` hoặc `passwordReset`.
    - Sau khi nâng cấp `Alert`, cần chuyển sang dùng `variant="success"` hoặc `variant="info"`.
- **Hero.tsx (Landing Page):**
    - Chứa nhiều tổ hợp class phức tạp cho hiệu ứng shadow và gradient.
    - Có thể tách thành các utility class `@layer utilities` trong `globals.css` (ví dụ: `.shadow-premium-primary`).
- **DataTable.tsx:**
    - Nhiều logic hiển thị padding (`pl-6`, `pr-6`) nằm trực tiếp trong JSX.
    - Nên được chuẩn hóa qua các utility hoặc config chung để tránh lặp lại logic `index === 0`.

## 4. Tác động lên Dark Mode
- Việc chuyển từ hardcoded colors (`bg-emerald-100 dark:bg-emerald-950`) sang CSS variables (`bg-alert-success`) sẽ giúp quản lý Dark mode tập trung hoàn toàn tại `globals.css`.
- Điều này giảm rủi ro quên cập nhật Dark mode khi thêm component mới.

## 5. Kết luận & Ưu tiên
1. **Ưu tiên 1:** Đồng bộ hóa `Alert` và `Badge` với theme tokens.
2. **Ưu tiên 2:** Thay thế các đoạn code "hardcoded logic" tại Features bằng các variant mới.
3. **Ưu tiên 3:** Tinh gọn `globals.css` bằng cách gom các hiệu ứng premium thành utilities.
