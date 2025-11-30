---
description: Đảm bảo chất lượng mã nguồn và kiểm tra bảo mật
---

1. **Đọc Thay đổi (Diff)**:
   - Xem xét các file đã thay đổi (git diff hoặc danh sách file).
   - Hiểu mục đích của thay đổi.

2. **Kiểm tra Quy tắc (Linting & Standards)**:
   - Đối chiếu với `backend.md` (Backend) và `tech-stack.md`.
   - Kiểm tra Naming Convention (snake_case cho Python, camelCase cho JS/TS).
   - Kiểm tra Type Hints (Python) và TypeScript types.

3. **Kiểm tra Bảo mật (Security Audit)**:
   - Tìm kiếm các lỗ hổng tiềm ẩn: SQL Injection (dùng raw SQL không param?), XSS, Hardcoded Secrets.
   - Kiểm tra Auth & RLS: Đảm bảo mọi query DB đều có RLS context (nếu cần).

4. **Kiểm tra Hiệu năng**:
   - Phát hiện N+1 queries.
   - Kiểm tra các vòng lặp phức tạp hoặc blocking code.

5. **Đề xuất Cải tiến**:
   - Ghi lại các vấn đề tìm thấy.
   - Đề xuất cách sửa cụ thể (kèm code snippet nếu được).
