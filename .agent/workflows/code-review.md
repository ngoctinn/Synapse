---
description: Thực hiện đánh giá mã nguồn cục bộ trước khi đẩy thay đổi, đảm bảo phù hợp với tài liệu thiết kế và các thực hành tốt nhất.
---
# Trợ lý Đánh giá Mã nguồn Cục bộ

Bạn đang giúp tôi thực hiện đánh giá mã nguồn cục bộ **trước khi** tôi đẩy thay đổi. Vui lòng tuân theo quy trình làm việc có cấu trúc này.

## Bước 1: Thu thập Bối cảnh
Hỏi tôi về:
- Mô tả ngắn gọn về tính năng/nhánh
- Danh sách các tệp đã sửa đổi (với tóm tắt tùy chọn)
- Tài liệu thiết kế liên quan (ví dụ: `docs/ai/design/feature-{name}.md` hoặc thiết kế cấp dự án)
- Bất kỳ ràng buộc hoặc khu vực rủi ro nào đã biết
- Bất kỳ lỗi mở hoặc TODO nào liên quan đến công việc này
- Những bài kiểm tra nào đã được chạy

Nếu có thể, yêu cầu diff mới nhất:
```bash
git status -sb
git diff --stat
```

## Bước 2: Hiểu sự Phù hợp với Thiết kế
Đối với mỗi tài liệu thiết kế được cung cấp:
- Tóm tắt ý định kiến trúc
- Ghi chú các yêu cầu quan trọng, các mẫu hoặc ràng buộc mà thiết kế bắt buộc

## Bước 3: Đánh giá Từng Tệp
Đối với mỗi tệp đã sửa đổi:
1. Làm nổi bật các sai lệch so với thiết kế hoặc yêu cầu đã tham chiếu
2. Phát hiện các vấn đề tiềm ẩn về logic hoặc luồng và các trường hợp biên
3. Xác định mã dư thừa hoặc trùng lặp
4. Đề xuất đơn giản hóa hoặc tái cấu trúc (ưu tiên sự rõ ràng hơn là sự khéo léo)
5. Cắm cờ các lo ngại về bảo mật (xác thực đầu vào, bí mật, xác thực, xử lý dữ liệu)
6. Kiểm tra các cạm bẫy hiệu suất hoặc rủi ro mở rộng
7. Đảm bảo xử lý lỗi, ghi nhật ký và khả năng quan sát là phù hợp
8. Ghi chú bất kỳ bình luận hoặc tài liệu nào còn thiếu
9. Cắm cờ các bài kiểm tra còn thiếu hoặc lỗi thời liên quan đến tệp này

## Bước 4: Các Mối quan tâm Xuyên suốt
- Xác minh tính nhất quán trong đặt tên và tuân thủ các quy ước của dự án
- Xác nhận tài liệu/bình luận được cập nhật ở nơi hành vi thay đổi
- Xác định các bài kiểm tra còn thiếu (đơn vị, tích hợp, E2E) cần thiết để bao phủ các thay đổi
- Đảm bảo các cập nhật cấu hình/di chuyển được nắm bắt nếu có

## Bước 5: Tóm tắt Các phát hiện
Cung cấp kết quả theo cấu trúc này:
```
### Tóm tắt
- Các vấn đề chặn (blocking): [số lượng]
- Các theo dõi quan trọng: [số lượng]
- Các cải tiến nên có (nice-to-have): [số lượng]

### Ghi chú Chi tiết
1. **[Tệp hoặc Thành phần]**
   - Vấn đề/Quan sát: ...
   - Tác động: (ví dụ: chặn / quan trọng / nên có)
   - Khuyến nghị: ...
   - Tham chiếu thiết kế: [...]

2. ... (lặp lại cho mỗi phát hiện)

### Các Bước Tiếp theo Được Đề xuất
- [ ] Giải quyết các vấn đề chặn
- [ ] Cập nhật tài liệu thiết kế/triển khai nếu cần
- [ ] Thêm/điều chỉnh các bài kiểm tra:
      - Đơn vị:
      - Tích hợp:
      - E2E:
- [ ] Chạy lại bộ kiểm tra cục bộ
- [ ] Chạy lại lệnh đánh giá mã sau khi sửa
```

## Bước 6: Danh sách Kiểm tra Cuối cùng
Xác nhận xem mỗi mục đã hoàn thành chưa (có/không/cần theo dõi):
- Triển khai khớp với thiết kế & yêu cầu
- Không còn lỗ hổng logic hoặc trường hợp biên rõ ràng nào
- Mã dư thừa đã bị xóa hoặc được biện minh
- Các cân nhắc về bảo mật đã được giải quyết
- Các bài kiểm tra bao phủ hành vi mới/thay đổi
- Ghi chú tài liệu/thiết kế đã được cập nhật

---
Hãy cho tôi biết khi bạn sẵn sàng bắt đầu đánh giá.
