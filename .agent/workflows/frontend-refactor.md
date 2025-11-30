---
description: Thực hiện Refactor mã nguồn Frontend dựa trên báo cáo đánh giá từ /frontend-review.
---

1. **Tiếp Nhận Báo Cáo**:
   - Yêu cầu người dùng cung cấp đường dẫn đến file báo cáo đánh giá (được tạo từ `/frontend-review`).
   - Đọc kỹ nội dung báo cáo để hiểu các vấn đề cần khắc phục và các đề xuất cải tiến.

2. **Lập Kế Hoạch Thực Thi**:
   - Phân tích các thay đổi cần thiết dựa trên "Kế hoạch hành động" trong báo cáo.
   - Xác định các file cần chỉnh sửa, tạo mới hoặc xóa.
   - Nếu cần thiết, chia nhỏ các tác vụ lớn thành các bước nhỏ hơn.

3. **Thực Thi Refactor (An Toàn)**:
   - Thực hiện từng thay đổi một cách tuần tự.
   - Sau mỗi nhóm thay đổi quan trọng, hãy kiểm tra lại (nếu có thể) hoặc review lại code vừa sửa.
   - Tuân thủ nghiêm ngặt các quy tắc trong `.agent/rules/frontend.md` (FSD, Next.js 16, Clean Code).
   - **Lưu ý**: Nếu gặp lỗi trong quá trình refactor, hãy dừng lại và báo cáo cho người dùng, hoặc sử dụng workflow `/debug` để xử lý.

4. **Kiểm Tra & Hoàn Tất**:
   - Đảm bảo không còn lỗi cú pháp hoặc vi phạm kiến trúc đã được nêu trong báo cáo.
   - Cập nhật trạng thái trong file báo cáo (nếu cần) để đánh dấu các mục đã hoàn thành.
   - Thông báo cho người dùng đã hoàn tất quá trình refactor.
