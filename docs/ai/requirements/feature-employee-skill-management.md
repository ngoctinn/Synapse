---
title: Employee Skill Management
status: draft
---

# Feature: Employee Skill Management

## 1. Problem Statement
Hiện tại, hệ thống đặt lịch cho phép gán bất kỳ nhân viên nào cho bất kỳ dịch vụ nào mà không cần kiểm tra xem nhân viên đó có kỹ năng thực hiện dịch vụ đó hay không. Điều này dẫn đến rủi ro vận hành cao (khách hàng đặt lịch nhưng nhân viên không biết làm), gây ảnh hưởng xấu đến trải nghiệm khách hàng và uy tín của Spa.

## 2. Goals & Non-Goals
### Goals
- Đảm bảo chỉ những nhân viên có kỹ năng phù hợp mới được gán cho dịch vụ.
- Cung cấp giao diện cho Quản lý để dễ dàng gán/gỡ kỹ năng cho nhân viên.
- Hiển thị thông tin kỹ năng của nhân viên rõ ràng cho Lễ tân.

### Non-Goals
- Chưa xử lý việc phân cấp độ kỹ năng (Junior/Senior) trong giai đoạn này (sẽ làm ở phase sau).
- Chưa áp dụng giá dịch vụ khác nhau dựa trên kỹ năng nhân viên.

## 3. User Stories
| Actor | Story | Priority |
|-------|-------|----------|
| **Quản lý** | Là Quản lý, tôi muốn gán các kỹ năng (VD: Massage Body, Facial) cho nhân viên khi tạo hoặc chỉnh sửa hồ sơ của họ để hệ thống biết họ làm được gì. | High |
| **Hệ thống** | Là Hệ thống, tôi muốn tự động lọc danh sách nhân viên khả dụng khi đặt lịch dựa trên kỹ năng yêu cầu của dịch vụ để tránh lỗi đặt nhầm. | High |
| **Lễ tân** | Là Lễ tân, tôi muốn nhìn thấy các kỹ năng (Badge) của nhân viên trong danh sách để dễ dàng tư vấn cho khách hàng. | Medium |

## 4. Success Criteria
- [ ] Backend: API `invite_staff` và `update_profile` lưu được danh sách `skill_ids`.
- [ ] Database: Bảng `user_skills` được tạo và chứa dữ liệu chính xác.
- [ ] Frontend: Form thêm/sửa nhân viên có Multi-select chọn kỹ năng.
- [ ] Frontend: Danh sách nhân viên hiển thị đúng các kỹ năng đã gán.

## 5. Constraints & Assumptions
- **Constraints**: Phải sử dụng bảng `user_skills` riêng biệt, không sửa đổi cấu trúc bảng `users` (Single Table Inheritance).
- **Assumptions**: Danh sách `Skills` đã được định nghĩa sẵn trong module Services.
