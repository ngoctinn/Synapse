---
description: Thêm các bài kiểm tra cho một tính năng mới
---
Xem xét `docs/ai/testing/feature-{name}.md` và đảm bảo nó phản ánh mẫu cơ sở trước khi viết các bài kiểm tra.

## Bước 1: Thu thập Bối cảnh
Hỏi tôi về:
- Tên tính năng và nhánh
- Tóm tắt những gì đã thay đổi (liên kết đến tài liệu thiết kế & yêu cầu)
- Môi trường mục tiêu (backend, frontend, full-stack)
- Các bộ kiểm tra tự động hiện có (đơn vị, tích hợp, E2E)
- Bất kỳ bài kiểm tra nào chập chờn hoặc chậm cần tránh

## Bước 2: Phân tích Mẫu Kiểm thử
- Xác định các phần bắt buộc từ `docs/ai/testing/feature-{name}.md` (đơn vị, tích hợp, xác minh thủ công, mục tiêu độ bao phủ)
- Xác nhận tiêu chí thành công và các trường hợp biên từ tài liệu yêu cầu & thiết kế
- Ghi chú bất kỳ mocks/stubs hoặc fixtures nào đã có sẵn

## Bước 3: Kiểm thử Đơn vị (Nhắm mục tiêu 100% độ bao phủ)
Đối với mỗi mô-đun/hàm:
1. Liệt kê các kịch bản hành vi (đường dẫn hạnh phúc, trường hợp biên, xử lý lỗi)
2. Tạo các trường hợp kiểm thử cụ thể với các khẳng định (assertions) và đầu vào
3. Tham chiếu các tiện ích/mocks hiện có để tăng tốc độ triển khai
4. Cung cấp mã giả hoặc đoạn mã kiểm thử thực tế
5. Làm nổi bật các nhánh bị thiếu tiềm năng ngăn cản độ bao phủ đầy đủ

## Bước 4: Kiểm thử Tích hợp
1. Xác định các luồng quan trọng trải dài qua nhiều thành phần/dịch vụ
2. Xác định các bước thiết lập/dọn dẹp (cơ sở dữ liệu, API, hàng đợi)
3. Phác thảo các trường hợp kiểm thử xác thực ranh giới tương tác, hợp đồng dữ liệu và các chế độ lỗi
4. Đề xuất thiết bị đo đạc/ghi nhật ký để gỡ lỗi các lỗi

## Bước 5: Chiến lược Độ bao phủ
- Khuyến nghị các lệnh công cụ (ví dụ: `npm run test -- --coverage`)
- Chỉ ra các tệp/hàm vẫn cần độ bao phủ và tại sao
- Đề xuất các bài kiểm tra bổ sung nếu độ bao phủ <100%

## Bước 6: Kiểm thử Thủ công & Khám phá
- Đề xuất danh sách kiểm tra thủ công bao gồm UX, khả năng truy cập và xử lý lỗi
- Xác định các kịch bản khám phá hoặc kiểm thử tiêm nhiễm lỗi/hỗn loạn nếu có liên quan

## Bước 7: Cập nhật Tài liệu & TODOs
- Tóm tắt những bài kiểm tra nào đã được thêm hoặc vẫn còn thiếu
- Cập nhật các phần `docs/ai/testing/feature-{name}.md` với các liên kết đến tệp kiểm thử và kết quả
- Cắm cờ các nhiệm vụ theo dõi cho các bài kiểm tra bị hoãn lại (với chủ sở hữu/ngày tháng)

Hãy cho tôi biết khi bạn có các thay đổi mã mới nhất sẵn sàng; chúng ta sẽ cùng nhau viết các bài kiểm tra cho đến khi đạt 100% độ bao phủ.
