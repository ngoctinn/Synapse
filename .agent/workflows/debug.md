---
description: Hướng dẫn tôi gỡ lỗi vấn đề mã bằng cách làm rõ các kỳ vọng, xác định các khoảng trống và thống nhất kế hoạch sửa lỗi trước khi thay đổi mã.
---
# Trợ lý Gỡ lỗi Cục bộ

Giúp tôi gỡ lỗi một vấn đề bằng cách làm rõ các kỳ vọng, xác định các khoảng trống và thống nhất kế hoạch sửa lỗi trước khi thay đổi mã.

## Bước 1: Thu thập Bối cảnh
Hỏi tôi về:
- Mô tả ngắn gọn về vấn đề (chuyện gì đang xảy ra?)
- Hành vi mong đợi hoặc tiêu chí chấp nhận (chuyện gì nên xảy ra?)
- Hành vi hiện tại và bất kỳ thông báo lỗi/nhật ký nào
- Các thay đổi hoặc triển khai gần đây có liên quan
- Phạm vi ảnh hưởng (người dùng, dịch vụ, môi trường)

## Bước 2: Làm rõ Thực tế vs Kỳ vọng
- Nêu lại hành vi quan sát được so với kết quả mong đợi
- Xác nhận các yêu cầu, vé (ticket), hoặc tài liệu liên quan xác định kỳ vọng
- Xác định tiêu chí chấp nhận cho việc sửa lỗi (làm sao chúng ta biết nó đã được giải quyết)

## Bước 3: Tái tạo & Cô lập
- Xác định khả năng tái tạo (luôn luôn, chập chờn, cụ thể theo môi trường)
- Nắm bắt các bước tái tạo hoặc lệnh
- Ghi chú bất kỳ bài kiểm tra nào có sẵn làm lộ lỗi
- Liệt kê các thành phần, dịch vụ hoặc mô-đun bị nghi ngờ

## Bước 4: Phân tích Nguyên nhân Tiềm năng
- Động não các nguyên nhân gốc rễ hợp lý (dữ liệu, cấu hình, hồi quy mã, phụ thuộc bên ngoài)
- Thu thập bằng chứng hỗ trợ (nhật ký, số liệu, dấu vết, ảnh chụp màn hình)
- Làm nổi bật các khoảng trống hoặc ẩn số cần điều tra

## Bước 5: Đưa ra Các Lựa chọn
- Trình bày các hướng giải quyết khả thi (sửa nhanh, tái cấu trúc sâu hơn, khôi phục, cờ tính năng, v.v.)
- Đối với mỗi lựa chọn, liệt kê ưu/nhược điểm, rủi ro và các bước xác minh
- Xem xét các phê duyệt hoặc phối hợp cần thiết

## Bước 6: Xác nhận Hướng đi
- Hỏi xem chúng ta nên theo đuổi lựa chọn nào
- Tóm tắt cách tiếp cận đã chọn, công việc chuẩn bị cần thiết và tiêu chí thành công
- Lên kế hoạch các bước xác thực (kiểm tra, giám sát, người dùng ký duyệt)

## Bước 7: Hành động Tiếp theo & Theo dõi
- Ghi lại các nhiệm vụ, người chịu trách nhiệm và mốc thời gian cho lựa chọn đã chọn
- Ghi chú các hành động tiếp theo sau khi triển khai (giám sát, thông tin liên lạc, khám nghiệm tử thi nếu cần)
- Khuyến khích cập nhật tài liệu/bài kiểm tra liên quan sau khi giải quyết

Hãy cho tôi biết khi bạn sẵn sàng đi qua quy trình gỡ lỗi.
