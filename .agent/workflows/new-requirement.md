---
description: Thêm tài liệu tính năng/yêu cầu mới và hướng dẫn tôi qua quy trình phát triển từ yêu cầu đến kiểm thử.
---
Tôi muốn thêm một tính năng/yêu cầu mới. Vui lòng hướng dẫn tôi qua quy trình phát triển hoàn chỉnh:

## Bước 1: Nắm bắt Yêu cầu
Đầu tiên, hỏi tôi:
- Tên tính năng là gì? (ví dụ: "user-authentication", "payment-integration")
- Nó giải quyết vấn đề gì?
- Ai sẽ sử dụng nó?
- Các câu chuyện người dùng (user stories) chính là gì?

## Bước 2: Tạo Cấu trúc Tài liệu Tính năng
Khi tôi cung cấp yêu cầu, hãy tạo các tệp sau (sao chép nội dung mẫu hiện có để các phần/frontmatter khớp chính xác):
- Bắt đầu từ `docs/ai/requirements/README.md` → lưu thành `docs/ai/requirements/feature-{name}.md`
- Bắt đầu từ `docs/ai/design/README.md` → lưu thành `docs/ai/design/feature-{name}.md`
- Bắt đầu từ `docs/ai/planning/README.md` → lưu thành `docs/ai/planning/feature-{name}.md`
- Bắt đầu từ `docs/ai/implementation/README.md` → lưu thành `docs/ai/implementation/feature-{name}.md`
- Bắt đầu từ `docs/ai/testing/README.md` → lưu thành `docs/ai/testing/feature-{name}.md`

Đảm bảo YAML frontmatter và các tiêu đề phần vẫn giống hệt với các mẫu trước khi điền nội dung cụ thể của tính năng.

## Bước 3: Giai đoạn Yêu cầu
Giúp tôi điền vào `docs/ai/requirements/feature-{name}.md`:
- Làm rõ tuyên bố vấn đề
- Xác định mục tiêu và phi mục tiêu
- Viết các câu chuyện người dùng chi tiết
- Thiết lập tiêu chí thành công
- Xác định các ràng buộc và giả định
- Liệt kê các câu hỏi mở

## Bước 4: Giai đoạn Thiết kế
Hướng dẫn tôi qua `docs/ai/design/feature-{name}.md`:
- Đề xuất các thay đổi kiến trúc hệ thống cần thiết
- Xác định các thay đổi mô hình dữ liệu/lược đồ (schema)
- Thiết kế các điểm cuối API hoặc giao diện
- Xác định các thành phần cần tạo/sửa đổi
- Ghi lại các quyết định thiết kế chính
- Ghi chú các cân nhắc về bảo mật và hiệu suất

## Bước 5: Giai đoạn Lập kế hoạch
Giúp tôi chia nhỏ công việc trong `docs/ai/planning/feature-{name}.md`:
- Tạo phân rã nhiệm vụ với các nhiệm vụ con
- Xác định các phụ thuộc (vào các tính năng khác, API, v.v.)
- Ước tính nỗ lực cho mỗi nhiệm vụ
- Đề xuất thứ tự thực hiện
- Xác định rủi ro và chiến lược giảm thiểu

## Bước 6: Xem xét Tài liệu (Các lệnh Chuỗi)
Khi các tài liệu trên được soạn thảo, hãy chạy các lệnh sau để thắt chặt chúng:
- `/review-requirements` để xác thực tài liệu yêu cầu về tính đầy đủ và rõ ràng
- `/review-design` để đảm bảo tài liệu thiết kế phù hợp với yêu cầu và làm nổi bật các quyết định chính

(Nếu bạn đang sử dụng Claude Code, hãy tham chiếu các lệnh `review-requirements` và `review-design` thay thế.)

## Bước 7: Giai đoạn Triển khai (Hoãn lại)
Lệnh này chỉ tập trung vào tài liệu. Việc triển khai thực tế diễn ra sau đó thông qua `/execute-plan`.
Đối với mỗi nhiệm vụ trong kế hoạch:
1. Xem xét các yêu cầu và thiết kế của nhiệm vụ
2. Yêu cầu tôi xác nhận tôi đang bắt đầu nhiệm vụ này
3. Hướng dẫn triển khai với tham chiếu đến tài liệu thiết kế
4. Đề xuất cấu trúc mã và các mẫu
5. Giúp xử lý lỗi và các trường hợp biên
6. Cập nhật `docs/ai/implementation/feature-{name}.md` với các ghi chú

## Bước 8: Giai đoạn Kiểm thử
Hướng dẫn kiểm thử trong `docs/ai/testing/feature-{name}.md`:
- Soạn thảo các trường hợp kiểm thử đơn vị với `/writing-test`
- Soạn thảo các kịch bản kiểm thử tích hợp với `/writing-test`
- Đề xuất các bước kiểm thử thủ công
- Giúp viết mã kiểm thử
- Xác minh tất cả các tiêu chí thành công đều có thể kiểm thử được

## Bước 9: Kiểm thử & Xác minh Cục bộ
Hướng dẫn tôi qua:
1. Chạy tất cả các bài kiểm thử cục bộ
2. Danh sách kiểm tra kiểm thử thủ công
3. Xem xét so với yêu cầu
4. Kiểm tra tuân thủ thiết kế
5. Chuẩn bị cho đánh giá mã (tóm tắt diff, danh sách tệp, tham chiếu thiết kế)

## Bước 10: Đánh giá Mã Cục bộ (Tùy chọn nhưng được khuyến nghị)
Trước khi đẩy, hãy yêu cầu tôi chạy `/code-review` với danh sách tệp đã sửa đổi và các tài liệu liên quan.

## Bước 11: Nhắc nhở Thực hiện Triển khai
Khi sẵn sàng triển khai, hãy chạy `/execute-plan` để làm việc qua các nhiệm vụ tài liệu lập kế hoạch một cách tương tác. Lệnh đó sẽ điều phối việc triển khai, kiểm thử và tài liệu theo dõi.

## Bước 12: Tạo Yêu cầu Hợp nhất/Kéo (Merge/Pull Request)
Cung cấp mô tả MR/PR:
```markdown
## Tính năng: [Tên Tính năng]

### Tóm tắt
[Mô tả ngắn gọn về những gì tính năng này làm]

### Yêu cầu
- Được ghi lại trong: `docs/ai/requirements/feature-{name}.md`
- Liên quan đến: [số vấn đề/vé nếu có]

### Thay đổi
- [Liệt kê các thay đổi chính]
- [Liệt kê các tệp/thành phần mới]
- [Liệt kê các tệp đã sửa đổi]

### Thiết kế
- Kiến trúc: [Liên kết đến phần tài liệu thiết kế]
- Các quyết định chính: [Tóm tắt ngắn gọn]

### Kiểm thử
- Kiểm thử đơn vị: [độ bao phủ/trạng thái]
- Kiểm thử tích hợp: [trạng thái]
- Kiểm thử thủ công: Hoàn thành
- Tài liệu kiểm thử: `docs/ai/testing/feature-{name}.md`

### Danh sách kiểm tra
- [ ] Mã tuân thủ các tiêu chuẩn dự án
- [ ] Tất cả các bài kiểm thử đều thông qua
- [ ] Tài liệu đã được cập nhật
- [ ] Không có thay đổi phá vỡ (hoặc đã được ghi lại nếu có)
- [ ] Sẵn sàng để xem xét
```

Sau đó cung cấp lệnh thích hợp:
- **GitHub**: `gh pr create --title "feat: [feature-name]" --body-file pr-description.md`
- **GitLab**: `glab mr create --title "feat: [feature-name]" --description "$(cat mr-description.md)"`

---

**Hãy bắt đầu! Hãy cho tôi biết về tính năng bạn muốn xây dựng.**
