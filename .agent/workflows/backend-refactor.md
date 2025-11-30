---
description: Thực hiện Refactor mã nguồn Backend dựa trên báo cáo đánh giá từ /backend-review.
---

1. **Tiếp Nhận Báo Cáo**:
   - Yêu cầu người dùng cung cấp đường dẫn đến file báo cáo đánh giá (được tạo từ `/backend-review`).
   - Đọc kỹ nội dung báo cáo để hiểu các vấn đề cần khắc phục.

2. **Lập Kế Hoạch Thực Thi**:
   - Phân tích các thay đổi cần thiết.
   - Xác định thứ tự ưu tiên (Kiến trúc -> Logic -> Syntax -> Docs).
   - Đảm bảo không phá vỡ các tính năng hiện có (Regression Check).

3. **Thực Thi Refactor (An Toàn)**:
   - **Kiến trúc**: Di chuyển file, sửa imports theo chuẩn Modular Monolith.
   - **Logic/Syntax**: Chuyển đổi sang Async, cập nhật Type Hinting, Pydantic V2.
   - **Clean Code**: Tách hàm, thêm Guard Clauses, bổ sung Comments Tiếng Việt.
   - **Lưu ý**: Thực hiện từng bước nhỏ, kiểm tra kỹ sau mỗi thay đổi.

4. **Kiểm Tra & Hoàn Tất**:
   - Chạy lại server (`uvicorn`) để đảm bảo không có lỗi khởi động.
   - Cập nhật trạng thái trong file báo cáo.
   - Thông báo cho người dùng đã hoàn tất.
