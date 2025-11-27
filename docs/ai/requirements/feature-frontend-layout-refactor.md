---
phase: requirements
title: Yêu cầu & Hiểu biết Vấn đề - Refactor Frontend Layout
description: Refactor cấu trúc thư mục frontend, đưa header và footer vào feature layout
---

# Yêu cầu & Hiểu biết Vấn đề

## Tuyên bố Vấn đề
**Chúng ta đang giải quyết vấn đề gì?**

- Cấu trúc thư mục hiện tại của frontend không tuân thủ quy tắc Feature-Sliced Design / Vertical Slice Architecture.
- `Header` và `Footer` hiện đang nằm trong `shared/ui/custom`, trong khi chúng chứa logic nghiệp vụ và nên được coi là một tính năng (feature) thuộc về `layout`.
- Việc tổ chức này gây khó khăn cho việc bảo trì và mở rộng, đồng thời vi phạm quy chuẩn dự án.

## Mục tiêu & Mục đích
**Chúng ta muốn đạt được điều gì?**

- **Mục tiêu chính**:
    - Di chuyển `Header` và `Footer` (và các thành phần liên quan) vào `features/layout`.
    - Đảm bảo cấu trúc thư mục tuân thủ quy tắc dự án.
    - Cập nhật tất cả các import liên quan.
- **Mục tiêu phụ**:
    - Kiểm tra và refactor các thành phần layout khác nếu cần.
- **Phi mục tiêu**:
    - Thay đổi giao diện hoặc logic nghiệp vụ của Header/Footer (chỉ refactor cấu trúc).

## Câu chuyện Người dùng & Trường hợp Sử dụng
**Người dùng sẽ tương tác với giải pháp như thế nào?**

- Là một **Developer**, tôi muốn cấu trúc dự án rõ ràng và tuân thủ quy tắc để dễ dàng tìm kiếm và bảo trì mã nguồn.
- Là một **Developer**, tôi muốn các thành phần layout (Header, Footer) được gom nhóm hợp lý vào `features/layout` thay vì nằm rải rác trong `shared`.

## Tiêu chí Thành công
**Làm sao chúng ta biết khi nào chúng ta hoàn thành?**

- Thư mục `features/layout` được tạo và chứa `Header`, `Footer`.
- Không còn `Header`, `Footer` trong `shared/ui/custom` (trừ khi chúng là UI thuần túy không có logic, nhưng theo yêu cầu thì nên chuyển).
- Ứng dụng hoạt động bình thường, không có lỗi import.
- Cấu trúc thư mục phản ánh đúng tư duy "Layout là một tính năng".

## Ràng buộc & Giả định
**Chúng ta cần làm việc trong những giới hạn nào?**

- **Ràng buộc kỹ thuật**: Next.js 15, FSD/Vertical Slice.
- **Giả định**: Header và Footer hiện tại có thể chứa logic (auth, navigation) nên thuộc về feature.

## Câu hỏi & Các mục Mở
**Chúng ta vẫn cần làm rõ điều gì?**

- Có thành phần nào khác trong `shared/ui/custom` nên được di chuyển không? (Sẽ kiểm tra trong quá trình thực hiện).
