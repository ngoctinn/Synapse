---
description: Thu thập kiến thức có cấu trúc về một điểm nhập mã và lưu vào tài liệu kiến thức.
---
# Trợ lý Thu thập Kiến thức

Hướng dẫn tôi tạo ra một sự hiểu biết có cấu trúc về một điểm nhập mã và lưu nó vào tài liệu kiến thức.

## Bước 1: Thu thập Bối cảnh
- Điểm nhập (tệp, thư mục, hàm, API)
- Tại sao điểm nhập này quan trọng (tính năng, lỗi, điều tra)
- Tài liệu yêu cầu/thiết kế liên quan (nếu có)
- Độ sâu hoặc các lĩnh vực trọng tâm mong muốn (logic, phụ thuộc, luồng dữ liệu)

## Bước 2: Xác thực Điểm nhập
- Xác định loại điểm nhập và xác nhận nó tồn tại
- Làm rõ sự mơ hồ (nhiều kết quả khớp) và yêu cầu làm rõ
- Nếu không tìm thấy, đề xuất các lựa chọn thay thế hoặc sửa lỗi chính tả

## Bước 3: Thu thập Bối cảnh Nguồn
- Đọc tệp/mô-đun chính và tóm tắt mục đích, các xuất khẩu (exports), các mẫu chính
- Đối với thư mục: liệt kê cấu trúc, làm nổi bật các mô-đun chính
- Đối với hàm/API: nắm bắt chữ ký, tham số, giá trị trả về, xử lý lỗi
- Trích xuất các đoạn mã thiết yếu (tránh đưa ra quá nhiều)

## Bước 4: Phân tích Phụ thuộc
- Xây dựng chế độ xem phụ thuộc đến độ sâu 3
- Theo dõi các nút đã truy cập để tránh vòng lặp
- Phân loại các phụ thuộc (nhập khẩu, gọi hàm, dịch vụ, gói bên ngoài)
- Ghi chú các hệ thống bên ngoài quan trọng hoặc mã được tạo tự động nên bị loại trừ

## Bước 5: Tổng hợp Giải thích
- Soạn thảo tổng quan (mục đích, ngôn ngữ, hành vi cấp cao)
- Chi tiết logic cốt lõi, các thành phần chính, luồng thực thi, các mẫu
- Làm nổi bật xử lý lỗi, hiệu suất, các cân nhắc về bảo mật
- Xác định các cải tiến tiềm năng hoặc rủi ro được phát hiện trong quá trình phân tích

## Bước 6: Tạo Tài liệu
- Chuẩn hóa tên điểm nhập thành kebab-case (`calculateTotalPrice` → `calculate-total-price`)
- Tạo `docs/ai/implementation/knowledge-{name}.md` sử dụng các tiêu đề được ngụ ý trong Bước 5 (Tổng quan, Chi tiết Triển khai, Phụ thuộc, Biểu đồ Trực quan, Thông tin Bổ sung, Siêu dữ liệu, Các bước Tiếp theo)
- Điền vào các phần với các phát hiện, biểu đồ và siêu dữ liệu (ngày phân tích, độ sâu, các tệp đã chạm vào)
- Bao gồm các biểu đồ mermaid khi chúng làm rõ các luồng hoặc mối quan hệ

## Bước 7: Xem xét & Hành động Tiếp theo
- Tóm tắt các thông tin chính và các câu hỏi mở để theo dõi
- Đề xuất các lĩnh vực liên quan để tìm hiểu sâu hơn hoặc tái cấu trúc
- Xác nhận đường dẫn tệp kiến thức và nhắc nhở cam kết (commit) nó
- Khuyến khích chạy lại `/capture-knowledge` cho các điểm nhập liên quan nếu cần

Hãy cho tôi biết điểm nhập và mục tiêu khi bạn sẵn sàng bắt đầu thu thập kiến thức.
