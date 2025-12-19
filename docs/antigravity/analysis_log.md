# Nhật Ký Phân Tích (Analysis Log) - Synapse

## 1. Phạm vi thay đổi
Thay đổi tập trung vào 3 tài liệu thiết kế chính:
- `usecase.md`: Thay đổi lớn về cấu trúc (format bảng) và nội dung (tinh giản/bổ sung).
- `data_specification.md`: Đồng bộ lại schema và các quy tắc nghiệp vụ.
- `database_design.md`: Khớp SQL schema với các yêu cầu mới.

## 2. Phân tích chi tiết

### 2.1. Loại bỏ Proficiency Level của Skill
- **Vấn đề**: Tài liệu cũ yêu cầu mức độ thành thạo (1-3).
- **Phát hiện**:
    - `data_specification.md` (Bảng 3.5, 3.8) có trường `proficiency_level`.
    - `database_design.md` đã loại bỏ trường này nhưng vẫn cần rà soát lại script SQL.
- **Tác động**: Đơn giản hóa bài toán OR-Tools (không cần trọng số cho kỹ năng).

### 2.2. Chuyển Chatbot AI sang Live Chat kèm Script
- **Vấn đề**: Chatbot AI quá phức tạp để triển khai hiệu quả ở mức đề tài/giai đoạn 1.
- **Phát hiện**: Use case A2.7 hiện tại mô tả AI tự động.
- **Tác động**: Sửa đổi A2.7 và B1.6 để đồng bộ. Hệ thống sẽ có giao diện Chat nhưng phía sau là Lễ tân tiếp nhận hoặc tin nhắn tự động.

### 2.3. Loại bỏ Vật tư tiêu hao (Consumables)
- **Vấn đề**: Ngành Spa quản lý vật tư rất phức tạp (lượng tinh dầu hao hụt per session).
- **Phát hiện**: Hiện tại trong `database_design.md` chưa có bảng vật tư, nhưng cần đảm bảo không xuất hiện trong đặc tả.

### 2.4. Bổ sung Rescheduling & Staff Commission
- **Tác động Use Case**: Cần thêm Use Case cho Lễ tân (Xử lý sự cố lịch) và Quản trị viên (Xem báo cáo hoa hồng).
- **Tác động Database**:
    - Bảng `staff_profiles` đã có `commission_rate`.
    - Cần rà soát logic OR-Tools có hỗ trợ re-scheduling hay không (thông số input/output).

### 2.5. Chuẩn hóa Use Case (Học thuật)
- **Vấn đề**: Use case hiện tại viết theo lối liệt kê, chứa chi tiết UI ("nhấn nút", "màn hình").
- **Tác động**: Cần viết lại toàn bộ theo format bảng đã cung cấp, sử dụng ngôn ngữ trừu tượng ("Actor yêu cầu...", "Hệ thống xác nhận...").

## 3. Rủi ro và Giải pháp
- **Rủi ro**: Lạc mất thông tin quan trọng khi viết lại use case.
- **Giải pháp**: Giữ lại các mã Use Case (A1.1, B1.1...) để tham chiếu chéo.
