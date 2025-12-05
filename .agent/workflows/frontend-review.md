---
description: Đánh giá mã nguồn Frontend theo tiêu chuẩn FSD và Next.js 16, đề xuất cải tiến UX/UI cao cấp, sử dụng dữ liệu UI/UX chung (không bao gồm màu sắc).
---

1. **Chuẩn bị & Nạp Ngữ Cảnh**:
   - **QUY TẮC BẤT DI BẤT DỊCH**: Workflow này là **READ‑ONLY**. Không thực thi lệnh `run_command` hay chỉnh sửa code, ngoại trừ việc tạo file báo cáo.
   - Đọc quy tắc tại `.agent/rules/frontend.md` để nắm vững tiêu chuẩn Feature‑Sliced Design (FSD) và Next.js 16.
   - Xác định phạm vi đánh giá: `frontend/src/app`, `frontend/src/features`, `frontend/src/shared`.
   - **Tải dữ liệu UI/UX chung** từ `.shared/ui-ux-pro-max/data`:
     - `typography.csv`, `ux‑guidelines.csv` → dùng để đề xuất font, nguyên tắc UX.
     - `data/stacks/<stack>.csv` (ví dụ `html‑tailwind.csv`) → lấy các token CSS/utility hợp lệ cho stack hiện tại.

2. **Kiểm Tra Tuân Thủ Kiến Trúc (FSD)**:
   - **Cấu trúc thư mục**: Kiểm tra các module trong `features` và `shared` có file `index.ts` (Public API) không.
   - **Deep Imports**: Dùng `grep` để phát hiện import vi phạm quy tắc đóng gói (ví dụ: import từ file nội bộ thay vì qua `index.ts`).
   - **Thin Pages**: Kiểm tra `src/app` xem các page có chứa logic nghiệp vụ không (nên chuyển xuống `features`).
   - **Stack‑specific token check**: Đọc `data/stacks/<stack>.csv` và so sánh các class Tailwind được dùng trong code với danh sách cho phép.

3. **Kiểm Tra Cú Pháp Next.js 16 & Clean Code (Tiếng Việt)**:
   - **Async APIs**: Chạy script `search.py` với domain `codebase` để phát hiện các hàm async chưa `await` (ví dụ `params`, `searchParams`, `cookies()`, `headers()`).
   - **Server Actions**: Dùng `grep -R "useActionState" frontend/src` để kiểm tra Server Actions đã tách riêng.
   - **Data Fetching**: Dùng `grep -R "useEffect" frontend/src` để phát hiện fetch client‑side gây waterfall.
   - **Comments & Naming**:
     - Tuân thủ nguyên tắc: *Code nói cách làm, Comment nói lý do*.
     - **Nguyên tắc Vàng**: Không comment những gì code đã nói (tránh comment dư thừa).
     - **Giải thích “Why”**: Comment chỉ giải thích bối cảnh, quy tắc nghiệp vụ, hoặc lý do chọn giải pháp.
     - **Tên biến/Hàm**: Đặt tên mô tả rõ ràng, giảm nhu cầu comment.
     - **Tags chuẩn**: TODO, FIXME, HACK, DEPRECATED để dễ tìm kiếm.
     - **Không comment code cũ**: Xóa dead code, để Git quản lý lịch sử.
     - **Cảnh báo hậu quả**: Khi đoạn code có tác động lớn, thêm cảnh báo trong comment.

4. **Đề Xuất Cải Tiến UX/UI Cao Cấp (Brainstorming)**:
   - Thực hiện quy trình **Brainstormer** (`.agent/workflows/brainstormer.md`).
   - **Sử dụng dữ liệu UI/UX**:
     - **Typography**: Đọc `typography.csv` → gợi ý font pairings, kích thước, line‑height.
     - **UX Guidelines**: Đọc `ux‑guidelines.csv` → kiểm tra các quy tắc như micro‑animations, cursor‑pointer, contrast.
   - Đề xuất **Micro‑animations**, **hover effects**, **focus-visible** và **accessibility** dựa trên các guideline.

5. **Nghiên Cứu & Tối Ưu Hóa (Researcher)**:
   - Thực hiện quy trình **Researcher** (`.agent/workflows/researcher.md`).
   - Nếu cần thông tin sâu hơn, chạy `search.py` với domain `ux` hoặc `performance` để lấy best‑practice.
   - Đề xuất giải pháp tối ưu hiệu năng (Core Web Vitals) và giảm bundle size.

6. **Tổng Hợp & Lưu Báo Cáo**:
   - **Xác định tên file**:
     - Kiểm tra thư mục `docs/reports/` để tìm số thứ tự tiếp theo (Ví dụ: `001`, `002` → `003`).
     - Đặt tên file theo định dạng: `docs/reports/[SỐ_THỨ_TỰ]-[TÊN_TÀI_LIỆU].md` (Ví dụ: `docs/reports/003-review-login-form.md`).
   - **Nội dung báo cáo**:
     - **Vi phạm kiến trúc/Code**: Liệt kê chi tiết và file liên quan.
     - **Đánh giá UX/UI**: Bao gồm font, micro‑animation đề xuất (trích xuất từ CSV), không đề cập tới màu sắc.
     - **Kế hoạch hành động**: Các bước cụ thể để refactor và cải thiện (Input cho workflow Refactor).

7. **Kết Thúc**:
   - Thông báo cho người dùng: "Báo cáo đã hoàn tất. Để thực hiện sửa đổi, hãy chạy workflow `/frontend‑refactor` và cung cấp đường dẫn file báo cáo này."
