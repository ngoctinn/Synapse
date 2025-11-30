---
description: Tự động cập nhật tài liệu dự án
---

1. **Quét Thay đổi Codebase**:
   - Xác định các module hoặc tính năng vừa được cập nhật.
   - Kiểm tra xem tài liệu API, sơ đồ kiến trúc, hay hướng dẫn sử dụng có bị lỗi thời không.

2. **Cập nhật API Docs**:
   - Nếu có endpoint mới, đảm bảo Docstring (Python) chuẩn Markdown.
   - Cập nhật file `docs/api/` (nếu quản lý thủ công).

3. **Cập nhật Architecture Docs**:
   - Nếu có thay đổi về cấu trúc thư mục hoặc luồng dữ liệu, cập nhật `docs/ai/design/`.

4. **Đồng bộ `docs.md`**:
   - Đảm bảo file `docs.md` (Tóm tắt dự án) phản ánh đúng trạng thái hiện tại.

5. **Commit Tài liệu**:
   - Thực hiện commit riêng cho việc cập nhật tài liệu: `docs: update documentation for ...`
