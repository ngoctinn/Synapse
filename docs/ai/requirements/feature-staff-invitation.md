---
title: Mời Nhân Viên qua Email
status: Draft
priority: High
assignee: AI Assistant
---

# Mời Nhân Viên qua Email

## 1. Tuyên bố Vấn đề
Hiện tại, Admin phải tự đặt mật khẩu thủ công cho nhân viên mới. Việc này không bảo mật và thiếu chuyên nghiệp. Cần có một quy trình cho phép Admin gửi lời mời qua email, và nhân viên sẽ tự đặt mật khẩu của riêng họ.

## 2. Mục tiêu
- **Bảo mật:** Admin không biết mật khẩu của nhân viên.
- **Chuyên nghiệp:** Sử dụng email mời với "Magic Link".
- **Hiệu quả:** Gán vai trò và kỹ năng (cho Kỹ thuật viên) ngay trong quá trình mời để hỗ trợ việc xếp lịch tự động.

## 3. Câu chuyện Người dùng (User Stories)
- **Với tư cách là Admin**, tôi muốn mời một nhân viên mới bằng cách nhập email, tên và vai trò của họ, để họ có thể tham gia hệ thống.
- **Với tư cách là Admin**, tôi muốn gán kỹ năng cho Kỹ thuật viên ngay khi mời, để họ có thể được xếp lịch làm dịch vụ.
- **Với tư cách là Nhân viên**, tôi muốn nhận được email mời và tự đặt mật khẩu, để tôi có thể truy cập tài khoản của mình một cách an toàn.

## 4. Tiêu chí Thành công
- Admin có thể gửi email mời từ trang Quản lý Nhân viên.
- Nhân viên nhận được email chứa liên kết hợp lệ.
- Nhân viên có thể đặt mật khẩu và đăng nhập thành công.
- Bản ghi nhân viên được tạo trong `public.employees` với đúng Vai trò và Kỹ năng.
- Tính toàn vẹn giao dịch: Nếu việc chèn vào DB thất bại, User bên Auth sẽ bị xóa.

## 5. Ràng buộc & Giả định
- **Ràng buộc:** Phải sử dụng API `inviteUserByEmail` của Supabase Auth.
- **Ràng buộc:** Phải sử dụng Transaction để đảm bảo tính nhất quán giữa `auth.users` và `public.employees`.
- **Giả định:** Admin có đủ quyền hạn để mời người dùng.

## 6. Câu hỏi Mở
- Chúng ta có cần tùy chỉnh mẫu email trong Supabase không? (Giả định là Có, nhưng nằm ngoài phạm vi logic code này).
