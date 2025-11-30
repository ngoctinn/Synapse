---
description: Quản lý Commit và Pull Requests chuyên nghiệp
---

1. **Kiểm tra Trạng thái Git**:
   - Chạy `git status` để xem các file đã thay đổi.
   - Chạy `git diff` để review lại lần cuối.

2. **Stage Changes**:
   - Chọn lọc các file cần commit (tránh commit file rác, .env, etc.).
   - Chạy `git add <files>`.

3. **Tạo Commit Message**:
   - Tuân thủ Conventional Commits: `type(scope): description`.
   - Type: feat, fix, docs, style, refactor, test, chore.
   - Description: Ngắn gọn, súc tích, tiếng Anh hoặc tiếng Việt (theo quy định dự án).

4. **Push & PR (Nếu cần)**:
   - Chạy `git push`.
   - Nếu cần tạo PR, sử dụng GitHub CLI (`gh pr create`) hoặc hướng dẫn người dùng tạo PR.
