---
description: Quy trình chuyên sâu để đánh giá, phản biện và nâng cấp nội dung Khóa luận tốt nghiệp (KLTN) đạt chuẩn học thuật cao.
---

# Quy Trình Review và Điều Chỉnh KLTN (KLTN Refinement Workflow)

Quy trình này được thiết kế để nâng cấp chất lượng khóa luận từ mức "đạt" lên mức "xuất sắc", tập trung vào tính biện luận, chiều sâu lý thuyết và văn phong học thuật.

## 1. Khởi Tạo & Phân Tích Tổng Quan (Initialization & Analysis)

**Mục tiêu:** Hiểu rõ ngữ cảnh, cấu trúc hiện tại và xác định các điểm yếu bề mặt.

1.  **Đọc và định vị nội dung:**
    *   Sử dụng `view_file` để đọc chương hoặc phần cần xử lý.
    *   Xác định vị trí của phần đó trong tổng thể khóa luận (liên kết với các chương trước/sau).
2.  **Đánh giá sơ bộ (Initial Audit):**
    *   Kiểm tra văn phong: Có bị văn nói, lặp từ, hay dùng từ thiếu chính xác không?
    *   Kiểm tra cấu trúc: Các mục có được sắp xếp logic không?

## 2. Đánh Giá Chuyên Sâu & Phản Biện (Deep Dive Critique)

**Mục tiêu:** Tìm ra các lỗ hổng lý thuyết và thiếu sót trong lập luận.

1.  **Kích hoạt Agent Nghiên Cứu:**
    *   Sử dụng `@/researcher` (hoặc tư duy tương tự) để đối chiếu nội dung với chuẩn kiến thức hiện tại.
2.  **Kiểm tra 3 tiêu chí cốt lõi:**
    *   **Theoretical Depth (Chiều sâu lý thuyết):** Định nghĩa có đi kèm phân tích không? Có trích dẫn các mô hình kinh điển không?
    *   **Currency (Tính cập nhật):** Công nghệ/số liệu có mới nhất (2024-2025) không?
    *   **Accuracy (Tính chính xác):** Các khẳng định có bằng chứng hoặc trích dẫn không?
3.  **Tạo Báo cáo Đánh giá (Critique Report):**
    *   Liệt kê ưu/nhược điểm cụ thể.
    *   Đánh giá mức độ thuyết phục của lập luận.

## 3. Lập Chiến Lược Cải Thiện (Strategy & Proposal)

**Mục tiêu:** Đưa ra các lựa chọn định hướng trước khi viết lại.

1.  **Brainstorming giải pháp:**
    *   Sử dụng `@/brainstormer` để đề xuất 3 hướng tiếp cận khác nhau. Ví dụ:
        *   *Option A: Problem-Solution Driven* (Tập trung vào giải quyết vấn đề thực tiễn).
        *   *Option B: Academic Deep Dive* (Tập trung vào mô hình lý thuyết hàn lâm).
        *   *Option C: Modern Engineering* (Tập trung vào kỹ thuật và hiệu suất).
2.  **Trình bày đề xuất cho User:**
    *   Tạo file báo cáo ngắn gọn (ví dụ: `docs/reports/ChapterX_Proposal.md`).
    *   Dùng `notify_user` để người dùng chọn hướng đi.

## 4. Thực Thi Viết Lại (Execution & Rewriting)

**Mục tiêu:** Tạo ra nội dung mới chất lượng cao dựa trên hướng đã chọn.

1.  **Viết lại nội dung (Drafting):**
    *   Sử dụng văn phong trang trọng, khách quan (Objective Tone).
    *   Áp dụng cấu trúc: **Khẳng định (Claim) -> Lý do (Reasoning) -> Bằng chứng (Evidence) -> Liên hệ (Link)**.
    *   Tích hợp các từ khóa chuyên ngành (Terminology) chính xác.
2.  **Cập nhật tài liệu:**
    *   Dùng `replace_file_content` hoặc `multi_replace_file_content` để cập nhật vào file gốc `docs/baocaokltn.md`.

## 5. Rà Soát & Hoàn Thiện (Final Polish)

**Mục tiêu:** Đảm bảo tính nhất quán và thẩm mỹ.

1.  **Kiểm tra định dạng:** Markdown headers, bullet points, bold/italic.
2.  **Kiểm tra trích dẫn:** Đảm bảo các trích dẫn [x] khớp với danh mục tài liệu tham khảo.
3.  **Self-Correction:** Đọc lại một lần nữa để đảm bảo mạch văn trôi chảy giữa các đoạn.

---

**Lưu ý:** Luôn ưu tiên chất lượng lập luận hơn là độ dài. Một đoạn văn ngắn nhưng sắc sảo giá trị hơn một trang viết lan man.
