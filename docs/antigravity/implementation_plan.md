# Kế hoạch Triển khai: Tối ưu hóa Code module Services

## 1. Vấn đề (Problem)
- Module `frontend/src/features/services` cần được làm sạch và tối ưu hóa theo tiêu chuẩn Clean Code của dự án Antigravity.
- Có khả năng tồn tại các comment thừa, import không sử dụng, hoặc cấu trúc code chưa tối ưu cho việc đọc hiểu của Agent.

## 2. Mục đích (Goal)
- Loại bỏ nhiễu (noise) từ code: comment dư thừa, dead code.
- Chuẩn hóa formatting và structure.
- Đảm bảo tuân thủ FSD (Feature-Sliced Design) và quy tắc "Clean Context".
- Tăng khả năng bảo trì và hiệu suất xử lý của Agent khi làm việc với module này.

## 3. Ràng buộc (Constraints)
- **Tuyệt đối không** thay đổi logic nghiệp vụ.
- Giữ nguyên các định danh (tên hàm, biến, type) được export để đảm bảo tương thích ngược.
- Code sau khi sửa phải chạy được ngay (`pnpm build` pass).

## 4. Chiến lược (Strategy)
- **Phân tích (Analyze)**: Đọc nội dung các file chính để xác định điểm cần cải thiện.
- **Tối ưu từng file (Refactor)**:
    - `actions.ts`: Review Server Actions, error handling.
    - `types.ts`, `schemas.ts`: Sắp xếp, format.
    - `components/`: Review UI logic, imports, remove redundant comments.
- **Kiểm tra (Verify)**: Lint và Build.

## 5. Giải pháp (Solution) Chi tiết
1.  **Giai đoạn 1: Scout & Analyze**
    - Đọc `actions.ts`, `schemas.ts`, `types.ts`.
    - Liệt kê các file trong `components`.
2.  **Giai đoạn 2: Refactor Core Files**
    - Clean `actions.ts`.
    - Clean `types.ts` & `schemas.ts`.
3.  **Giai đoạn 3: Refactor Components**
    - Duyệt qua các component chính và làm sạch.
4.  **Giai đoạn 4: verify**
    - Chạy `pnpm lint` và `pnpm build`.
