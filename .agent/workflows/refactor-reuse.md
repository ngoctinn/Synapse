---
description: Tách mã nguồn lặp lại thành Shared Components và Custom Hooks để tái sử dụng.
---

1.  **Phân Tích & Phát Hiện (Discovery)**:
    - Quét các file hiện tại hoặc các file được chỉ định.
    - **UI Reuse**: Tìm các đoạn JSX/TSX có cấu trúc và CSS giống nhau được lặp lại nhiều nơi (ví dụ: các nút bấm có style riêng, bảng dữ liệu, card thông tin).
    - **Logic Reuse**: Tìm các đoạn logic `useState`, `useEffect` hoặc các hàm xử lý sự kiện tương tự nhau (ví dụ: logic chọn hàng, logic phân trang, logic fetch data).

2.  **Đề Xuất Giải Pháp (Proposal)**:
    - Định nghĩa tên cho Component mới (ví dụ: `SharedDataTable`, `ActionCard`) hoặc Hook mới (ví dụ: `useTableSelection`, `usePagination`).
    - Xác định vị trí lưu trữ:
        - Components: `frontend/src/shared/ui` hoặc `frontend/src/shared/components`.
        - Hooks: `frontend/src/shared/hooks`.

3.  **Thực Hiện Tách (Extraction)**:
    - Tạo file mới cho Component/Hook tại vị trí đã định.
    - Chuyển mã nguồn gốc vào file mới, đảm bảo truyền đúng `props` và `arguments`.
    - Đảm bảo Component/Hook mới tuân thủ Clean Code và có Type Safety (TypeScript) đầy đủ.

4.  **Tích Hợp Ngược (Integration)**:
    - Thay thế các đoạn mã cũ tại các file gốc bằng cách import và sử dụng Component/Hook mới vừa tạo.
    - Kiểm tra đảm bảo tính năng hoạt động y hệt như trước (Regression Test).
