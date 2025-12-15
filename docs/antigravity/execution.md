---
description: Hướng dẫn chi tiết thực thi quy trình Antigravity cho Agent
---

# Quy Trình Thực Thi Antigravity

Quy trình này thực thi nghiêm ngặt giao thức được định nghĩa tại `docs/antigravity/antigravity-protocol.md`.

## Giai đoạn 1: THINK (Tư duy Kiến trúc)
1.  Đọc kỹ yêu cầu.
2.  Kiểm tra file `docs/antigravity/implementation_plan.md`. Nếu chưa có, tạo mới.
3.  Cập nhật kế hoạch với: **Vấn đề**, **Mục đích**, **Ràng buộc**, **Chiến lược**, **Giải pháp**.
4.  **DỪNG LẠI** và xin ý kiến người dùng.

## Giai đoạn 2: SPLIT (Chia nhỏ)
1.  Sau khi được duyệt, chia nhỏ kế hoạch thành các task nhỏ.
2.  Thêm task vào "Active Workflow Tracker" trong `docs/antigravity/dashboard.md`.
3.  Sử dụng tool `write_todos` để quản lý danh sách việc cần làm.

## Giai đoạn 3: ANALYZE (Phân tích)
1.  Dùng `codebase_investigator` hoặc `search_file_content` để hiểu code liên quan.
2.  Ghi lại các phát hiện (dependencies, file ảnh hưởng) vào `docs/antigravity/analysis_log.md` (tạo mới nếu chưa có).

## Giai đoạn 4: DIFF (Đề xuất)
1.  Trình bày chi tiết thay đổi sẽ thực hiện (tên file, nội dung sửa đổi).
2.  Viết mã giả hoặc kế hoạch chi tiết.

## Giai đoạn 5: APPLY (Thực thi)
1.  Thực hiện thay đổi code (`write_file`, `replace`).
2.  Tuân thủ quy tắc:
    *   **Frontend**: `cd frontend` trước khi chạy lệnh. Dùng `pnpm`.
    *   **Backend**: Kích hoạt venv `source backend/venv/Scripts/activate`.

## Giai đoạn 6: VERIFY (Kiểm tra)
1.  **Frontend**:
    *   `cd frontend && pnpm lint`
    *   `cd frontend && pnpm build` (Kiểm tra An toàn kiểu dữ liệu)
2.  **Backend**:
    *   Chạy kiểm tra cú pháp/linting backend.
3.  Nếu lỗi: Sửa ngay lập tức.

## Giai đoạn 7: AUDIT (Kiểm toán)
1.  Review lại code (không hardcode bí mật, đúng quy ước).
2.  Ghi lại thay đổi vào `docs/antigravity/change-log.md`.

## Giai đoạn 8: REPORT (Báo cáo)
1.  Cập nhật trạng thái task thành **HOÀN THÀNH** trong `docs/antigravity/dashboard.md`.
2.  Báo cáo tóm tắt cho người dùng.