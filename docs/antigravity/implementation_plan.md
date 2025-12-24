# Kế hoạch Thực thi: Đồng bộ hóa Hệ thống Thiết kế (Design System)

## 1. Vấn đề (Problem)
Sau khi thiết lập các tiêu chuẩn UX/UI mới cho thị trường Việt Nam (Premium Vietnamese Design System), nhiều component trong codebase vẫn đang sử dụng các style "cũ" (hardcoded overrides) như `h-9`, `px-4`, `rounded-lg` cho card, gây ra sự thiếu nhất quán và không tối ưu cho hiển thị tiếng Việt.

## 2. Mục đích (Objectives)
- Đồng bộ hóa toàn bộ 100% các thành phần UI với tiêu chuẩn mới.
- Loại bỏ các class ghi đè (overrides) không cần thiết để tận dụng style mặc định đã được tối ưu.
- Đảm bảo trải nghiệm "Premium" nhất quán xuyên suốt ứng dụng.

## 3. Ràng buộc (Constraints)
- Giữ nguyên logic nghiệp vụ.
- Không phá vỡ layout hiện tại trong khi nâng cấp kích thước.
- Đảm bảo Dark Mode vẫn hoạt động hoàn hảo.
- Tuân thủ quy tắc `cd frontend` và `pnpm`.

## 4. Chiến lược thực hiện (Strategy)
Audit và Refactor theo từng nhóm thành phần:
1.  **Nhóm Button**: Xóa bỏ `h-9`, `px-4` và các class liên quan đến padding/height thủ công.
2.  **Nhóm Card/Container**: Nâng cấp từ `rounded-lg` lên `rounded-xl` hoặc sử dụng class `.surface-card`.
3.  **Nhóm Typography**: Loại bỏ `leading-` không cần thiết, áp dụng `.prose-vi` cho vùng nội dung văn bản dài.
4.  **Nhóm Input & Form**: Đồng bộ chiều cao `h-10` và padding.

## 5. Danh sách Task (SPLIT)

### Phase 1: Chuẩn hóa Button (40+ vị trí)
- [ ] Refactor `features/appointments` buttons.
- [ ] Refactor `features/customers` buttons.
- [ ] Refactor `features/staff` buttons.
- [ ] Refactor `features/services` buttons.
- [ ] Refactor `shared/components`.

### Phase 2: Chuẩn hóa Card & Container (30+ vị trí)
- [ ] Thay thế `rounded-lg border` bằng `.surface-card` trong các trang Dashboard.
- [ ] Cập nhật `rounded-xl` cho các thành phần `Card`.
- [ ] Tối ưu hóa `padding` (`p-6`) cho các card chính.

### Phase 3: Chuẩn hóa Typography & Spacing (30+ vị trí)
- [ ] Rà soát và loại bỏ `leading-normal`, `leading-snug` nơi không cần thiết.
- [ ] Áp dụng `.prose-vi` cho các mô tả dịch vụ, chính sách, liệu trình.
- [ ] Kiểm tra font-size của Breadcrumb và Header.

## 6. Giải pháp chi tiết (Solutions)
- Sử dụng `grep` để tìm chính xác các mẫu class cần thay thế.
- Ưu tiên sử dụng class utility của Design System thay vì Tailwind thủ công.
- Kiểm tra trực quan bằng `pnpm build` để đảm bảo không lỗi kiểu dữ liệu.

---
**Agent Notes**: Kế hoạch này sẽ thực hiện refactor hàng loạt nhưng có kiểm soát. Tôi sẽ bắt đầu rà soát từng module.
