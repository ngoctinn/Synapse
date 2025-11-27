---
phase: monitoring
title: Giám sát & Khả năng quan sát
description: Xác định chiến lược giám sát, số liệu, cảnh báo và phản ứng sự cố
---

# Giám sát & Khả năng quan sát

## Số liệu Chính
**Chúng ta cần theo dõi những gì?**

### Số liệu Hiệu suất
- Thời gian phản hồi/độ trễ
- Thông lượng/yêu cầu mỗi giây
- Sử dụng tài nguyên (CPU, bộ nhớ, đĩa)

### Số liệu Kinh doanh
- Số liệu tương tác người dùng
- Tỷ lệ chuyển đổi/thành công
- Sử dụng tính năng

### Số liệu Lỗi
- Tỷ lệ lỗi theo loại
- Các yêu cầu thất bại
- Theo dõi ngoại lệ

## Công cụ Giám sát
**Chúng ta đang sử dụng công cụ gì?**

- Giám sát ứng dụng (APM)
- Giám sát cơ sở hạ tầng
- Tổng hợp nhật ký (Log aggregation)
- Phân tích người dùng

## Chiến lược Ghi nhật ký
**Chúng ta ghi lại cái gì và như thế nào?**

- Các cấp độ và danh mục nhật ký
- Định dạng nhật ký có cấu trúc
- Chính sách lưu giữ nhật ký
- Xử lý dữ liệu nhạy cảm

## Cảnh báo & Thông báo
**Khi nào và làm thế nào chúng ta được thông báo?**

### Cảnh báo Nghiêm trọng
- Cảnh báo 1: [Điều kiện] → [Hành động]
- Cảnh báo 2: [Điều kiện] → [Hành động]

### Cảnh báo Cảnh giác
- Cảnh báo 1: [Điều kiện] → [Hành động]
- Cảnh báo 2: [Điều kiện] → [Hành động]

## Bảng điều khiển (Dashboards)
**Chúng ta trực quan hóa cái gì?**

- Bảng điều khiển sức khỏe hệ thống
- Bảng điều khiển số liệu kinh doanh
- Chế độ xem tùy chỉnh theo nhóm/vai trò

## Phản ứng Sự cố
**Chúng ta xử lý vấn đề như thế nào?**

### Luân phiên Trực (On-Call)
- Lịch trình và liên hệ
- Đường dẫn leo thang

### Quy trình Sự cố
1. Phát hiện và phân loại
2. Điều tra và chẩn đoán
3. Giải quyết và giảm thiểu
4. Khám nghiệm tử thi và học hỏi

## Kiểm tra Sức khỏe
**Làm thế nào để xác minh sức khỏe hệ thống?**

- Kiểm tra sức khỏe điểm cuối (Endpoint health checks)
- Kiểm tra phụ thuộc
- Kiểm tra khói tự động (Automated smoke tests)
