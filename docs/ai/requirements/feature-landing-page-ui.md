---
title: Requirements - Landing Page UI
status: Draft
---

# Landing Page UI Requirements

## 1. Problem Statement
Người dùng truy cập vào trang chủ (Landing Page) cần một giao diện điều hướng rõ ràng (Header) và thông tin bổ trợ (Footer) để tìm hiểu về sản phẩm và thực hiện các hành động chính như Đăng nhập hoặc Đăng ký. Hiện tại trang chủ chưa có các thành phần này.

## 2. Goals & Non-Goals
### Goals
- Xây dựng Header hiển thị Logo, Menu điều hướng, và các nút hành động (Đăng nhập/Đăng ký hoặc User Menu).
- Xây dựng Footer hiển thị thông tin bản quyền, liên kết chính sách, và mạng xã hội.
- Đảm bảo giao diện Responsive (tương thích mobile/desktop).
- Tích hợp trạng thái đăng nhập để thay đổi giao diện Header phù hợp.

### Non-Goals
- Không thiết kế nội dung chi tiết của phần thân trang (Body) trong phạm vi này (sẽ làm ở feature khác).
- Không bao gồm logic đăng nhập/đăng ký (đã có ở feature auth).

## 3. User Stories
- **US1**: Là khách vãng lai, tôi muốn thấy thanh điều hướng để biết các tính năng chính của ứng dụng.
- **US2**: Là khách vãng lai, tôi muốn thấy nút Đăng nhập và Đăng ký nổi bật để truy cập hệ thống.
- **US3**: Là người dùng đã đăng nhập, tôi muốn thấy Avatar và Menu cá nhân thay vì nút Đăng nhập/Đăng ký để truy cập Dashboard hoặc Đăng xuất.
- **US4**: Là người dùng, tôi muốn thấy Footer chứa thông tin liên hệ và chính sách để tin tưởng vào ứng dụng.

## 4. Success Criteria
- Header hiển thị đúng trạng thái (Guest vs Logged in).
- Footer hiển thị đầy đủ thông tin liên kết.
- Giao diện giống với tham chiếu (MoniApp) về phong cách (hiện đại, tối giản).
- Hoạt động tốt trên Mobile (Menu hamburger).

## 5. Constraints & Assumptions
- Sử dụng Shadcn/UI và Tailwind CSS.
- Logo tạm thời sử dụng Text hoặc Placeholder.
- Giả định đã có trạng thái Auth (hoặc mock) để kiểm tra chuyển đổi giao diện.

## 6. Open Questions
- (None)
