---
title: User Authentication Requirements
status: Draft
---

# Feature: User Authentication

## 1. Problem Statement
Hệ thống Synapse cần một cơ chế xác thực an toàn để quản lý quyền truy cập của người dùng (Khách hàng, Nhân viên, Quản trị viên). Hiện tại chưa có chức năng đăng nhập/đăng ký, khiến hệ thống không thể định danh người dùng và phân quyền.

## 2. Goals & Non-Goals
### Goals
- Cho phép người dùng đăng ký tài khoản mới.
- Cho phép người dùng đăng nhập và duy trì phiên làm việc.
- Cho phép người dùng khôi phục mật khẩu khi quên.
- Đồng bộ thông tin người dùng cơ bản từ Supabase Auth sang cơ sở dữ liệu chính để Backend quản lý.

### Non-Goals
- Chưa hỗ trợ đăng nhập qua Mạng xã hội (Google, Facebook) trong giai đoạn này (sẽ làm sau).
- Chưa bao gồm chức năng Quản lý người dùng nâng cao (Admin Dashboard) - đây là tính năng riêng.

## 3. User Stories
| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| AUTH-01 | Guest | Tôi muốn đăng ký tài khoản bằng email/password | - Form đăng ký hợp lệ (email đúng định dạng, pass tối thiểu 8 ký tự).<br>- Nhận email xác thực (nếu cấu hình).<br>- Tài khoản được tạo trong cả Auth và bảng Users. |
| AUTH-02 | User | Tôi muốn đăng nhập vào hệ thống | - Đăng nhập thành công chuyển hướng vào Dashboard.<br>- Sai thông tin báo lỗi rõ ràng. |
| AUTH-03 | User | Tôi muốn đăng xuất khỏi hệ thống | - Xóa session/cookie.<br>- Chuyển hướng về trang chủ/login. |
| AUTH-04 | User | Tôi muốn lấy lại mật khẩu khi quên | - Gửi link reset qua email.<br>- Link chỉ có hiệu lực trong thời gian ngắn. |
| AUTH-05 | User | Tôi muốn đặt lại mật khẩu mới | - Cập nhật mật khẩu thành công từ link reset. |

## 4. Success Criteria
- Người dùng có thể thực hiện trọn vẹn luồng Đăng ký -> Đăng nhập -> Đăng xuất.
- Thông tin người dùng (Email, Tên) được đồng bộ tự động sang bảng `public.users`.
- Backend FastAPI nhận diện được User ID thông qua Token gửi từ Frontend.

## 5. Constraints & Assumptions
- Sử dụng **Supabase Auth** làm Provider.
- Frontend (Next.js) xử lý UI và gọi Supabase Auth.
- Backend (FastAPI) không lưu password, chỉ lưu thông tin profile mở rộng.
- Giao diện phải hỗ trợ Tiếng Việt hoàn toàn.
