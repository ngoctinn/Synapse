---
phase: requirements
title: Đồng bộ hóa & Kiểm tra toàn diện Module Services
description: Đảm bảo tính nhất quán, luồng người dùng mượt mà và chất lượng mã nguồn cho toàn bộ module Services (bao gồm Services, Packages, Categories, Skills).
---

# Yêu cầu & Hiểu biết Vấn đề

## Tuyên bố Vấn đề
**Chúng ta đang giải quyết vấn đề gì?**

- Hiện tại có sự không nhất quán nhẹ giữa các sub-modules (Services vs Packages) về cách xử lý dữ liệu, schema API và UI.
- Thiếu các bài test toàn diện cho các luồng người dùng quan trọng (tạo mới, cập nhật, xóa, lọc).
- Cần đảm bảo toàn bộ component tuân thủ các quy tắc dự án (Vietnamese localization, Shadcn/UI tokens, Server Actions logic).

## Mục tiêu & Mục đích
**Chúng ta muốn đạt được điều gì?**

- **Mục tiêu chính:** Đồng bộ hóa logic và giao diện giữa Services và Packages.
- **Mục tiêu chính:** Xây dựng bộ test suite (Unit/Integration) cho các tính năng cốt lõi.
- **Mục tiêu chính:** Đảm bảo 100% Vietnamese localization cho mọi thông báo và nhãn.
- **Phi mục tiêu:** Thêm tính năng mới không liên quan đến Services (vd: Thanh toán, Lịch hẹn).

## Câu chuyện Người dùng & Trường hợp Sử dụng
**Người dùng sẽ tương tác với giải pháp như thế nào?**

- Là một Quản trị viên, tôi muốn trải nghiệm tạo Dịch vụ đơn và Gói combo phải đồng nhất để dễ dàng làm quen với hệ thống.
- Là một nhà phát triển, tôi muốn có bộ test cover các luồng API để tự tin khi refactor mã nguồn.
- Luồng chính: Tạo Dịch vụ -> Gán Kỹ năng/Danh mục -> Tạo Gói combo từ các dịch vụ đó -> Kiểm tra hiển thị trên bảng dữ liệu.

## Tiêu chí Thành công
**Làm sao chúng ta biết khi nào chúng ta hoàn thành?**

- Không còn crash khi dữ liệu API thiếu hoặc sai định dạng (đã fix lỗi Schema cơ bản cho Packages).
- 100% UI component sử dụng project tokens (`shared/ui`).
- Tất cả các trường hợp biên (empty state, loading state, error state) được xử lý đồng bộ.
- Hiệu suất: Tốc độ tải bảng dữ liệu < 1s trên môi trường local, độ trễ search < 300ms.
- Khả năng truy cập: Đạt chuẩn ARIA cho toàn bộ các thành phần tương tác (Tabs, Sheets).
- Có ít nhất 5 bộ test tích hợp cho các luồng CRUD chính.

## Ràng buộc & Giả định
**Chúng ta cần làm việc trong những giới hạn nào?**

- Phải tuân thủ kiến trúc Feature-Sliced Design (FSD).
- Sử dụng Next.js 15+ Server Actions cho toàn bộ mutations.
- **Giả định:** Backend FastAPI yêu cầu rà soát và tinh chỉnh thêm Schema/DTO để khớp hoàn toàn với yêu cầu phân trang và kiểu dữ liệu của Frontend.

## Câu hỏi & Các mục Mở
**Chúng ta vẫn cần làm rõ điều gì?**

- Có cần gộp Packages vào hẳn module Services hay giữ tách biệt như hiện tại?
- Chính sách giá khi tạo Gói combo (tự động tính hay nhập thủ công)?
- Cần xác định rõ hành vi khi xóa một Service đang nằm trong một Package hoạt động.
