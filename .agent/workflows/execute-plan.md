---
description: Thực hiện kế hoạch tính năng một cách tương tác, hướng dẫn tôi qua từng nhiệm vụ trong khi tham chiếu các tài liệu liên quan và cập nhật trạng thái.
---
# Trợ lý Thực hiện Kế hoạch Tính năng

Giúp tôi làm việc qua một kế hoạch tính năng từng nhiệm vụ một.

## Bước 1: Thu thập Bối cảnh
Hỏi tôi về:
- Tên tính năng (kebab-case, ví dụ: `user-authentication`)
- Mô tả ngắn gọn về tính năng/nhánh
- Đường dẫn tài liệu lập kế hoạch liên quan (mặc định `docs/ai/planning/feature-{name}.md`)
- Bất kỳ tài liệu thiết kế/triển khai hỗ trợ nào (thiết kế, yêu cầu, triển khai)
- Nhánh hiện tại và tóm tắt diff mới nhất (`git status -sb`, `git diff --stat`)

## Bước 2: Tải Kế hoạch
- Yêu cầu nội dung tài liệu lập kế hoạch hoặc cung cấp các lệnh như:
  ```bash
  cat docs/ai/planning/feature-<name>.md
  ```
- Phân tích các phần đại diện cho danh sách nhiệm vụ (tìm các tiêu đề + hộp kiểm `[ ]`, `[x]`).
- Xây dựng một hàng đợi nhiệm vụ được sắp xếp theo nhóm phần (ví dụ: Nền tảng, Tính năng Cốt lõi, Kiểm thử).

## Bước 3: Trình bày Hàng đợi Nhiệm vụ
Hiển thị tổng quan:
```
### Hàng đợi Nhiệm vụ: <Tên Tính năng>
1. [trạng thái] Phần • Tiêu đề nhiệm vụ
2. ...
```
Chú giải trạng thái: `todo` (cần làm), `in-progress` (đang làm), `done` (hoàn thành), `blocked` (bị chặn) (dựa trên hộp kiểm/ghi chú nếu có).

## Bước 4: Thực hiện Nhiệm vụ Tương tác
Đối với mỗi nhiệm vụ theo thứ tự:
1. Hiển thị phần/bối cảnh, văn bản đầy đủ của gạch đầu dòng, và bất kỳ ghi chú hiện có nào.
2. Đề xuất các tài liệu liên quan để tham chiếu (yêu cầu/thiết kế/triển khai).
3. Hỏi: "Kế hoạch cho nhiệm vụ này?" Đề nghị phác thảo các bước con sử dụng tài liệu thiết kế.
4. Nhắc đánh dấu trạng thái (`done`, `in-progress`, `blocked`, `skipped`) và nắm bắt các ghi chú ngắn/bước tiếp theo.
5. Khuyến khích chỉnh sửa mã/tài liệu bên trong Cursor; cung cấp các lệnh/đoạn mã khi hữu ích.
6. Nếu bị chặn, ghi lại thông tin chặn và di chuyển nhiệm vụ xuống cuối hoặc vào danh sách "Bị chặn".

## Bước 5: Cập nhật Tài liệu Lập kế hoạch
Sau mỗi thay đổi trạng thái, tạo một đoạn Markdown mà người dùng có thể dán lại vào tài liệu lập kế hoạch, ví dụ:
```
- [x] Nhiệm vụ: Triển khai dịch vụ xác thực (Ghi chú: đã xong POST /auth/login, đã thêm bài kiểm tra)
```
Nhắc nhở người dùng giữ tài liệu nguồn được cập nhật.

## Bước 6: Kiểm tra Công việc Mới được Phát hiện
Sau mỗi phần, hỏi xem có nhiệm vụ mới nào được phát hiện không. Nếu có, nắm bắt chúng trong danh sách "Công việc Mới" với trạng thái `todo` và đưa vào tóm tắt.

## Bước 7: Tóm tắt Phiên làm việc
Tạo bảng tóm tắt:
```
### Tóm tắt Thực hiện
- Hoàn thành: (danh sách)
- Đang thực hiện: (danh sách + người chịu trách nhiệm/bước tiếp theo)
- Bị chặn: (danh sách + yếu tố chặn)
- Bỏ qua / Hoãn lại: (danh sách + lý do)
- Nhiệm vụ Mới: (danh sách)
```

## Bước 8: Hành động Tiếp theo
Nhắc nhở người dùng:
- Cập nhật `docs/ai/planning/feature-{name}.md` với các trạng thái mới
- Đồng bộ các tài liệu liên quan (yêu cầu/thiết kế/triển khai/kiểm thử) nếu các quyết định thay đổi
- Chạy `/check-implementation` để xác thực các thay đổi so với tài liệu thiết kế
- Chạy `/writing-test` để tạo các bài kiểm tra đơn vị/tích hợp nhắm mục tiêu 100% độ bao phủ
- Chạy `/update-planning` để đối chiếu tài liệu lập kế hoạch với trạng thái mới nhất
- Chạy `/code-review` khi sẵn sàng cho đánh giá cuối cùng
- Chạy các bộ kiểm tra liên quan đến các nhiệm vụ đã hoàn thành

---
Hãy cho tôi biết khi bạn sẵn sàng bắt đầu thực hiện kế hoạch. Cung cấp tên tính năng và tài liệu lập kế hoạch trước.
