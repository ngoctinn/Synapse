# Kế hoạch Triển khai: Tối ưu hóa UX/UI Feature Settings

## 1. Vấn đề (Problem)
- Module `frontend/src/features/settings` (đặc biệt là `operating-hours`) đang có cấu trúc phức tạp, file lớn (`exceptions-panel.tsx` ~11KB, `exception-sheet.tsx` ~9KB).
- UX hiện tại có thể gây khó khăn cho người dùng khi thao tác (cần kiểm tra cụ thể).
- Yêu cầu từ User: Giảm độ phức tạp, đơn giản hóa code và giao diện, loại bỏ animation thừa.

## 2. Mục đích (Goal)
- **Tối ưu UX**: Đơn giản hóa visual, giúp thao tác nhanh hơn.
- **Tối ưu Code**: Giảm dòng code thừa, flatten component structure.
- **Maintainability**: Tăng khả năng đọc hiểu và bảo trì.

## 3. Ràng buộc (Constraints)
- **Design System**: Sử dụng Shadcn/UI & Tailwind.
- **Language**: Tiếng Việt hoàn toàn.
- **Complexity**: Hạn chế component lồng nhau quá sâu, không dùng animation nặng.
- **Accessibility**: Đảm bảo tiêu chuẩn cơ bản.

## 4. Chiến lược (Strategy)
- **Phân tích (Analyze)**: Đánh giá chi tiết `operating-hours` và `notifications` để tìm điểm "thắt nút" (bottlenecks).
- **Thiết kế lại (Redesign/Simplification)**:
    - `OperatingHours`: Có thể chuyển từ dạng bảng phức tạp sang dạng list đơn giản hoặc grid thẻ.
    - `Exceptions`: Đơn giản hóa form thêm ngoại lệ.
- **Thực thi (Implementation)**:
    - Refactor `day-row.tsx`: Giảm logic inline.
    - Refactor `notifications`: Kiểm tra và dọn dẹp.
- **Kiểm tra (Verify)**: Đảm bảo không break logic setting hiện tại.

## 5. Giải pháp (Solution) Chi tiết
- **Giai đoạn 1: Analyze & Split**
    - Đọc nội dung 3 file lớn trong `operating-hours`.
    - Lên danh sách các component con cần merge hoặc tách nhẹ.
- **Giai đoạn 2: Refactor Operating Hours**
    - Tối ưu `weekly-schedule.tsx`.
    - Refactor `day-row.tsx` thành pure component nếu có thể.
    - Đơn giản hóa `exception-sheet.tsx` (có thể dùng Dialog thay Sheet nếu nhẹ hơn, hoặc tối ưu nội dung Sheet).
- **Giai đoạn 3: Refactor Notifications**
    - Review và cleanup.
- **Giai đoạn 4: Visual Polish**
    - Đảm bảo spacing, typography chuẩn (Inter/Shadcn).
    - Remove "fancy" effects.
