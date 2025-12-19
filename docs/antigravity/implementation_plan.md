# Kế hoạch triển khai Antigravity (Implementation Plan) - Synapse

## 1. Phân tích bối cảnh
Sau khi thực hiện audit so khớp giữa Use Case (`usecase.md`) và Thiết kế (`architecture_v2.md`, `data_specification.md`, `database_design.md`), chúng tôi xác định các thay đổi cần thiết để đạt tới sự nhất quán cao và chuẩn hóa học thuật.

## 2. Các quyết định đã xác nhận
- **Chatbot (A2.7)**: Chuyển thành "Live Chat" kèm kịch bản trả lời tự động (Script-based).
- **Vật tư (Consumables)**: Loại bỏ hoàn toàn việc quản lý vật tư tiêu hao.
- **Kỹ năng (Skill Level)**: Loại bỏ hoàn toàn khái niệm `proficiency_level`. Chỉ quan tâm KTV có kỹ năng đó hay không.
- **Tính năng mới**: Bổ sung "Rescheduling" (Xử lý sự cố lịch) và "Staff Commission" (Tính hoa hồng KTV).

## 3. Checklist chuẩn hóa Use Case
- [x] Tên: Động từ + Danh từ (Tên hành động nghiệp vụ).
- [x] Không chi tiết UI (Không dùng từ "nút", "màn hình", "click").
- [x] Ngôn ngữ học thuật: "Hệ thống hiển thị...", "Actor tìm kiếm...", "Hệ thống xác nhận...".
- [x] Ranh giới Actor và System rõ ràng.
- [x] Luồng sự kiện: Có Luồng chính (Basic), Thay thế (Alternative) và Ngoại lệ (Exception) rõ ràng.

## 4. Danh sách nhiệm vụ thực thi (Task List)
- [x] **Cập nhật UseCase.md (Standardization)**: Áp dụng format học thuật, tinh giản AI thành Live Chat, thêm Rescheduling & Commission.
- [x] **Cập nhật Data Specification**: Loại bỏ Proficiency Level, đồng bộ cấu trúc Customer.
- [x] **Review Database Design**: Đảm bảo SQL script khớp với đặc tả mới.
- [x] **Cập nhật Implementation Plan**: Ghi nhận trạng thái hoàn thành.
- [x] **Hoàn tất báo cáo (REPORT)**.
