---
description: Đánh giá chuyên sâu về thiết kế giao diện, bố cục và chi tiết thành phần UI để đạt chuẩn Premium.
---

1. **Chuẩn bị & Nạp Ngữ Cảnh**:
   - **QUY TẮC BẤT DI BẤT DỊCH**: Workflow này là **READ-ONLY**. Tuyệt đối KHÔNG thực thi mã hay chỉnh sửa code.
   - Xác định phạm vi đánh giá: File/Folder/Component được chỉ định.
   - Đọc các file liên quan (tsx, css, tailwind config) để hiểu cấu trúc hiện tại.

2. **Phân Tích Bố Cục & Cấu Trúc (Layout & Structure)**:
   - **Grid & Spacing**: Kiểm tra hệ thống lưới, khoảng cách (padding, margin) giữa các phần tử. Có nhất quán không? Có tuân thủ nguyên tắc "White Space" để tạo cảm giác thoáng đãng không?
   - **Alignment**: Kiểm tra sự căn chỉnh của các thành phần (text, button, input).
   - **Visual Hierarchy**: Kiểm tra phân cấp thông tin. Các yếu tố quan trọng có nổi bật không?
   - **Responsiveness**: Kiểm tra bố cục trên các kích thước màn hình khác nhau (nếu có thể suy luận từ code).

3. **Đánh Giá Chi Tiết Thành Phần (Component Details)**:
   - **Typography**: Font size, font weight, line height, letter spacing. Có dễ đọc và phân cấp rõ ràng không?
   - **Colors & Contrast**: Kiểm tra bảng màu, độ tương phản. Có tuân thủ Design System không?
   - **Shadows & Borders**: Kiểm tra độ sâu (depth), bo góc (radius). Có tạo cảm giác hiện đại, mềm mại không?
   - **States**: Kiểm tra các trạng thái Hover, Active, Focus, Disabled. Có phản hồi rõ ràng cho người dùng không?

4. **Đánh Giá Thẩm Mỹ & "Premium" Factor**:
   - **Micro-animations**: Đề xuất các hiệu ứng chuyển động nhỏ (framer-motion) để tăng trải nghiệm.
   - **Consistency**: Đảm bảo sự đồng nhất giữa các trang và thành phần.
   - **WOW Factor**: Đề xuất các điểm nhấn thiết kế để tạo ấn tượng mạnh (glassmorphism, gradient, etc.).

5. **Tổng Hợp & Lưu Báo Cáo**:
   - **Xác định tên file**:
     - Kiểm tra thư mục `docs/reports/` để tìm số thứ tự tiếp theo.
     - Đặt tên file: `docs/reports/[SỐ_THỨ_TỰ]-design-review-[TÊN_THÀNH_PHẦN].md`.
   - **Nội dung báo cáo**:
     - **Phân tích hiện trạng**: Mô tả chi tiết các vấn đề tìm thấy về bố cục, màu sắc, chi tiết.
     - **Đề xuất cải tiến**: Các giải pháp cụ thể để nâng cấp giao diện lên mức "Premium".
     - **Mockup/Reference (nếu có)**: Mô tả ý tưởng hình ảnh hoặc tham khảo.

6. **Kết Thúc**:
   - Thông báo cho người dùng: "Báo cáo đánh giá thiết kế chuyên sâu đã hoàn tất. Vui lòng xem tại [đường dẫn file]."
