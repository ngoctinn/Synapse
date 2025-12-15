# Giao Thức Vận Hành: Gemini CLI × Antigravity

Tài liệu này định nghĩa quy trình kỹ thuật 8 giai đoạn nghiêm ngặt cho mọi tác vụ kỹ thuật trong dự án Synapse.

**Vị trí lưu trữ tài liệu:** Tất cả tài liệu phát sinh trong quá trình làm việc được lưu trữ tập trung tại thư mục `docs/antigravity/`:
*   Kế hoạch: `docs/antigravity/implementation_plan.md`
*   Tiến độ: `docs/antigravity/dashboard.md`
*   Nhật ký thay đổi: `docs/antigravity/change-log.md`
*   Nhật ký phân tích: `docs/antigravity/analysis_log.md`

## 1. THINK (Tư duy Kiến trúc)
- **Đầu vào:** Yêu cầu người dùng / Báo cáo lỗi.
- **Hành động:** Suy luận cấp cao, thu thập yêu cầu và xây dựng chiến lược.
- **Đầu ra:** Cập nhật `docs/antigravity/implementation_plan.md`.
- **Ràng buộc:** KHÔNG sinh mã nguồn (no code generation).

## 2. SPLIT (Chia nhỏ & Lên kế hoạch)
- **Đầu vào:** Kế hoạch triển khai đã duyệt.
- **Hành động:** Chia nhỏ tác vụ thành các sub-tasks nguyên tử, dễ quản lý.
- **Đầu ra:** Cập nhật danh sách `todo` qua công cụ CLI và `docs/antigravity/dashboard.md`.
- **Ràng buộc:** Các tác vụ nên độc lập nhau nếu có thể.

## 3. ANALYZE (Đánh giá Tác động)
- **Đầu vào:** Tác vụ nguyên tử được chọn.
- **Hành động:** `codebase_investigator` hoặc `search_file_content`. Lập bản đồ phụ thuộc.
- **Đầu ra:** Ghi chú vào `docs/antigravity/analysis_log.md`.

## 4. DIFF (Đề xuất Thay đổi)
- **Đầu vào:** Ngữ cảnh phân tích.
- **Hành động:** Tạo các thay đổi chạy thử (dry-run) hoặc mã giả (pseudo-code).
- **Đầu ra:** Một bản diff trực quan hoặc kế hoạch thay đổi chi tiết.

## 5. APPLY (Thực thi)
- **Đầu vào:** Đề xuất (DIFF) đã được duyệt.
- **Hành động:** `replace`, `write_file`, hoặc `run_shell_command`.
- **Đầu ra:** Hệ thống tập tin đã được sửa đổi.

## 6. VERIFY (Đảm bảo Chất lượng)
- **Đầu vào:** Codebase đã sửa đổi.
- **Hành động:**
  - Frontend: `cd frontend` && `pnpm lint`, `pnpm build`.
  - Backend: `source backend/venv/Scripts/activate` && `ruff check` (hoặc tương đương).
- **Ràng buộc:** Nếu FAIL -> Tự động Rollback (hoàn tác) & Cập nhật Dashboard.

## 7. AUDIT (Bảo mật & Tuân thủ)
- **Đầu vào:** Code đã được xác minh (Verified code).
- **Hành động:** Kiểm tra secrets, lỗ hổng bảo mật và tuân thủ style guide.
- **Đầu ra:** Ghi nhận vào `docs/antigravity/change-log.md`.

## 8. REPORT (Báo cáo)
- **Đầu vào:** Quy trình hoàn tất.
- **Hành động:** Cập nhật `docs/antigravity/dashboard.md` (Mark Complete) và tạo báo cáo tóm tắt.
- **Đầu ra:** Thông báo cho người dùng.