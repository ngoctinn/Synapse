---
description: Quy trình phát triển giao diện người dùng mới (Frontend-Only) độc lập với Backend, đảm bảo chuẩn FSD và Premium UI.
---

1. **Chuẩn bị & Phân Tích Yêu Cầu**:
   - **Mục tiêu**: Xác định rõ màn hình/tính năng cần xây dựng.
   - **Quy tắc**: Đọc kỹ `.agent/rules/frontend.md` để tuân thủ Feature-Sliced Design (FSD).
   - **Phạm vi**: Chỉ làm việc trong `frontend/src`. Tuyệt đối KHÔNG sửa đổi Backend.

2. **Thiết Kế Dữ Liệu Giả (Mock Data Strategy)**:
   - **Nguyên tắc**: "Frontend First" - Phát triển giao diện trước khi có API.
   - **Hành động**:
     - Định nghĩa **TypeScript Interfaces/Types** rõ ràng cho dữ liệu tại `features/[tên-feature]/model/types.ts` (hoặc `schemas.ts`).
     - Tạo dữ liệu mẫu (Mock Data) tại `features/[tên-feature]/model/mocks.ts`. Dữ liệu phải phong phú, sát thực tế để test các trường hợp (dài, ngắn, trống).
     - **Lưu ý**: KHÔNG import hay phụ thuộc vào bất kỳ model nào của Backend.

3. **Xây Dựng Components (Atomic & FSD)**:
   - **Cấu trúc**: Phân chia component theo FSD:
     - `shared/ui`: Các thành phần UI cơ bản (Button, Input...) dùng chung.
     - `features/[tên-feature]/components`: Các component nghiệp vụ cụ thể.
   - **Styling**:
     - Sử dụng **Tailwind CSS** và **Shadcn/UI**.
     - Tuân thủ Design System (Màu sắc, Typography, Spacing).
     - Đảm bảo tính thẩm mỹ "Premium" & "WOW factor".

4. **Lắp Ráp Giao Diện (Page Assembly)**:
   - **Vị trí**: Tạo page mới trong `app/(admin)/...` hoặc `app/(public)/...`.
   - **Logic**:
     - Import Mock Data và truyền vào Components.
     - Sử dụng `useActionState` (nếu cần form) hoặc React State thông thường để giả lập tương tác.
     - Đảm bảo **Thin Page**: Page chỉ làm nhiệm vụ layout và truyền dữ liệu, logic nằm ở Feature/Widget.

5. **Tinh Chỉnh & Hiệu Ứng (Micro-interactions)**:
   - **Brainstormer**: Thêm các hiệu ứng nhỏ để tăng trải nghiệm:
     - Hover states mượt mà.
     - Transitions khi mở/đóng modal, dropdown.
     - Loading skeletons đẹp mắt.
   - Sử dụng `framer-motion` cho các animation phức tạp hơn nếu cần.

6. **Tự Đánh Giá & Refactor (Self-Correction)**:
   - **Mục tiêu**: Đảm bảo chất lượng mã nguồn đạt chuẩn ngay từ đầu (tương tự quy trình `/frontend-refactor`).
   - **Hành động**:
     - **Review Kiến Trúc**: Kiểm tra lại cấu trúc thư mục FSD. Đảm bảo không có "Deep Imports" (import xuyên module không qua `index.ts`).
     - **Review Code**:
       - Đảm bảo Async/Await đúng chỗ (Next.js 16).
       - Tên biến/hàm rõ nghĩa (Clean Code).
       - **Comment giải thích nghiệp vụ bằng Tiếng Việt**.
     - **Thực Thi Refactor Ngay**:
       - Nếu thấy code rườm rà -> Tách hàm/component ngay.
       - Nếu thấy hardcode -> Chuyển sang constants hoặc mock data.
       - Tuân thủ nghiêm ngặt các quy tắc trong `.agent/rules/frontend.md`.

7. **Kết Thúc**:
   - Thông báo cho người dùng: "Giao diện đã được tạo hoàn tất với dữ liệu giả và đã qua bước tự kiểm tra (Self-Refactor). Vui lòng kiểm tra và duyệt trước khi tích hợp Backend."
