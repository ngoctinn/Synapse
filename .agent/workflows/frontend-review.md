---
description: Đánh giá mã nguồn Frontend theo tiêu chuẩn FSD và Next.js 16, đề xuất cải tiến UX/UI cao cấp.
---

1. **Chuẩn bị & Nạp Ngữ Cảnh**:
   - **QUY TẮC BẤT DI BẤT DỊCH**: Workflow này là **READ-ONLY**. Tuyệt đối KHÔNG thực thi mã (run_command) hay chỉnh sửa code (write_to_file, replace_file_content) ngoại trừ việc tạo file báo cáo.
   - Đọc kỹ quy tắc tại `.agent/rules/frontend.md` để nắm vững tiêu chuẩn Feature-Sliced Design (FSD) và Next.js 16.
   - Xác định phạm vi đánh giá: `frontend/src/app`, `frontend/src/features`, `frontend/src/shared`.

2. **Kiểm Tra Tuân Thủ Kiến Trúc (FSD)**:
   - **Cấu trúc thư mục**: Kiểm tra xem các module trong `features` và `shared` có file `index.ts` (Public API) không.
   - **Deep Imports**: Quét mã nguồn để phát hiện các import vi phạm quy tắc đóng gói (ví dụ: import từ file nội bộ thay vì qua `index.ts`).
   - **Thin Pages**: Kiểm tra `src/app` xem các page có chứa logic nghiệp vụ không (nên chuyển xuống `features`).

3. **Kiểm Tra Cú Pháp Next.js 16 & Clean Code (Tiếng Việt)**:
   - **Async APIs**: Kiểm tra việc sử dụng `params`, `searchParams`, `cookies()`, `headers()` có `await` không.
   - **Server Actions**: Kiểm tra xem Server Actions có được tách riêng và sử dụng `useActionState` không.
   - **Data Fetching**: Kiểm tra xem có `useEffect` nào đang fetch data client-side gây waterfall không.
   - **Comments & Naming**:
     - Đảm bảo toàn bộ comments giải thích nghiệp vụ (Why) bằng **Tiếng Việt**.
     - Tên biến/hàm phải rõ nghĩa (Clean Code).

4. **Đề Xuất Cải Tiến UX/UI Cao Cấp (Brainstorming)**:
   - Thực hiện quy trình **Brainstormer** (.agent/workflows/brainstormer.md):
     - Đánh giá giao diện hiện tại dựa trên tiêu chuẩn "Premium" & "WOW factor".
     - Đề xuất thêm các **Micro-animations** (hover, transition, loading states) để tăng tính tương tác.
     - Đảm bảo màu sắc, typography tuân thủ design system và tạo cảm giác hiện đại, sang trọng.

5. **Nghiên Cứu & Tối Ưu Hóa (Researcher)**:
   - Thực hiện quy trình **Researcher** (.agent/workflows/researcher.md):
     - Tìm kiếm các pattern tốt nhất (Best Practices) cho các vấn đề tìm thấy.
     - Đề xuất giải pháp tối ưu hiệu năng (Core Web Vitals).

6. **Tổng Hợp & Lưu Báo Cáo**:
   - **Xác định tên file**:
     - Kiểm tra thư mục `docs/reports/` để tìm số thứ tự tiếp theo (Ví dụ: `001`, `002` -> `003`).
     - Đặt tên file theo định dạng: `docs/reports/[SỐ_THỨ_TỰ]-[TÊN_TÀI_LIỆU].md` (Ví dụ: `docs/reports/003-review-login-form.md`).
   - **Nội dung báo cáo**:
     - **Vi phạm kiến trúc/Code**: Liệt kê chi tiết và file liên quan.
     - **Đánh giá UX/UI**: Nhận xét về độ "mượt", thẩm mỹ và các điểm cần nâng cấp để đạt chuẩn cao cấp.
     - **Kế hoạch hành động**: Các bước cụ thể để refactor và cải thiện (Input cho workflow Refactor).

7. **Kết Thúc**:
   - Thông báo cho người dùng: "Báo cáo đã hoàn tất. Để thực hiện sửa đổi, hãy chạy workflow `/frontend-refactor` và cung cấp đường dẫn file báo cáo này."
