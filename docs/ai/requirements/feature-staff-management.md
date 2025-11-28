---
title: Quản Lý Nhân Sự (Staff Management)
description: Trung tâm điều phối vận hành Spa: Quản lý hồ sơ, Phân quyền và Lịch làm việc.
status: Draft
priority: High
author: AI Assistant
created_at: 2025-11-28
---

# Tính năng: Quản Lý Nhân Sự (Staff Management)

## 1. Vấn đề & Bối cảnh
**Bối cảnh**: Vận hành Spa phụ thuộc lớn vào nhân sự. Hiện tại chưa có giao diện tập trung để quản lý nhân viên, kỹ năng (để xếp lịch), phân quyền và lịch làm việc.
**Vấn đề**: Thiếu công cụ trực quan để Admin biết ai rảnh, ai làm được dịch vụ gì, dẫn đến xếp lịch sai hoặc chồng chéo.
**Mục tiêu**: Xây dựng giao diện Frontend "Quản Lý Nhân Sự" chuẩn UX/UI, tập trung vào trải nghiệm người dùng tiện lợi, đóng vai trò là trung tâm điều phối.

## 2. Mục tiêu & Phạm vi (Frontend Only)
### Mục tiêu
- **Giao diện Danh sách Nhân viên**: Hiển thị trực quan, dễ nhìn, đầy đủ thông tin (Avatar, Vai trò, Kỹ năng).
- **Trải nghiệm Thêm/Sửa**: Form Modal chia Tabs rõ ràng, dễ sử dụng.
- **Ma trận Phân quyền (RBAC Matrix)**: Giao diện bảng ma trận trực quan để bật/tắt quyền.
- **Lịch làm việc (Scheduling)**: Giao diện Lịch tuần (Weekly View) hỗ trợ kéo thả (Drag & Drop) để xếp ca.
- **Mock Data**: Sử dụng dữ liệu giả lập (Mock Data) để mô phỏng hành vi hệ thống mà không cần Backend thực tế ngay lúc này.

### Ngoài phạm vi (Non-Goals)
- Tích hợp API Backend thực tế (sẽ làm sau).
- Xử lý logic lương thưởng phức tạp.

## 3. User Stories (Câu chuyện người dùng)
| Vai trò | Câu chuyện | Tiêu chí chấp nhận (Frontend) |
|---|---|---|
| Admin | Tôi muốn xem danh sách nhân viên với bộ lọc rõ ràng. | Bảng hiển thị đẹp, có Badge vai trò, Tags kỹ năng. Filter hoạt động trên dữ liệu giả. |
| Admin | Tôi muốn thêm nhân viên mới qua một Form dễ hiểu. | Modal hiện ra, chia 2 Tabs (Tài khoản, Hồ sơ). Validate form ngay lập tức. |
| Admin | Tôi muốn phân quyền nhanh cho nhóm nhân viên. | Bảng ma trận cho phép tick chọn nhanh. Có hiệu ứng phản hồi khi tick. |
| Admin | Tôi muốn xếp lịch làm việc cho nhân viên bằng cách kéo thả. | Giao diện lịch hiển thị theo tuần. Có thể kéo "Ca Sáng" thả vào ô ngày của nhân viên. |

## 4. Yêu cầu UX/UI (Tiện dụng cao)
- **Visual Hierarchy**: Phân biệt rõ các vai trò bằng màu sắc (Admin: Đỏ, Lễ tân: Xanh, KTV: Tím).
- **Feedback**: Mọi hành động (Lưu, Xóa, Cập nhật) đều phải có Toast thông báo hoặc Dialog xác nhận.
- **Micro-interactions**:
    - Hover vào số lượng kỹ năng (+X) hiện **Tooltip** chi tiết.
    - **Bulk Save** (Phân quyền): Cho phép thay đổi nhiều quyền rồi mới Lưu để tránh sai sót.
    - **Copy Schedule**: Nút sao chép lịch làm việc từ tuần trước.
    - Cảnh báo xóa nhân viên: Gợi ý chuyển lịch hẹn sang người khác.
    - Bulk Actions: Chọn nhiều nhân viên để gán lịch cùng lúc.
- **Responsive**: Tương thích tốt trên Desktop và Tablet (iPad) để quản lý dễ dàng.

## 4. Tiêu chí Thành công
- **Giao diện**: Hoàn thành 3 Tabs chính (Danh sách, Phân quyền, Lịch) với thiết kế chuẩn UX/UI.
- **Tương tác**: Các thao tác Thêm, Sửa, Xóa, Kéo thả hoạt động mượt mà trên dữ liệu giả.
- **Responsive**: Hiển thị tốt trên Desktop và Tablet.
- **Chất lượng mã**: Tuân thủ Feature-Sliced Design, không có lỗi TypeScript.

## 5. Ràng buộc & Giả định
- **Ràng buộc kỹ thuật**: Sử dụng **Shadcn UI** và **Tailwind CSS**.
- **Giả định**: Dữ liệu được quản lý cục bộ (Local State hoặc Mock Store) để demo giao diện.
- **Ngôn ngữ**: Hiển thị hoàn toàn là **Tiếng Việt**.

## 6. Câu hỏi & Các mục Mở
- Có cần hỗ trợ giao diện Mobile cho phần Lịch làm việc (vốn rất phức tạp trên màn hình nhỏ) không? -> *Giả định: Tối ưu cho Tablet/Desktop trước.*
- Màu sắc cụ thể cho từng ca làm việc (Sáng/Chiều/Tối) là gì? -> *Đề xuất: Sáng (Vàng/Cam), Chiều (Xanh dương), Tối (Tím/Chàm).*
