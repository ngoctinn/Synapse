# Nghiên cứu Quy trình Xác nhận Lịch hẹn trong Hệ thống Spa CRM

**Ngày thực hiện:** 2025-12-20
**Người thực hiện:** Antigravity Agent
**Dự án:** Synapse (KLTN)

## 1. Vấn đề nghiên cứu
Xác định tính phù hợp của việc **Tự động Xác nhận (Auto-confirm)** so với **Xác nhận Thủ công (Manual confirm)** khi khách hàng đặt lịch hẹn qua ứng dụng.

## 2. Kết quả rà soát Tài liệu Thiết kế (`docs/design`)
Dựa trên `usecase.md`, quy trình hiện tại được thiết kế theo hướng **Tự động**:
- **UC A2.5 (Hoàn tất đặt lịch hẹn):** Bước 3 nêu rõ "Hệ thống lưu lịch hẹn và gửi thông báo xác nhận". Không có bước chờ Lễ tân duyệt.
- **UC A3.2 (Thanh toán):** Tiền điều kiện là lịch hẹn ở trạng thái `CONFIRMED`.

## 3. Nghiên cứu thực tế (Industry Best Practices)
Theo khảo sát các hệ thống lớn như Fresha, Mindbody, và Workee:

| Đặc điểm | Tự động Xác nhận (Khuyên dùng) | Xác nhận Thủ công |
| :--- | :--- | :--- |
| **Trải nghiệm KH** | Khách nhận được phản hồi ngay, tăng sự tin tưởng (70% khách thích đặt online). | Khách phải chờ đợi, có thể gây nản lòng hoặc khách tìm nơi khác. |
| **Vận hành** | Giảm gánh nặng hành chính cho Lễ tân, hoạt động 24/7. | Tốn nhân lực trực máy, dễ sai sót khi nhập liệu thủ công. |
| **Phòng chống No-show** | Tự động gửi nhắc hẹn (SMS/Email) hiệu quả hơn. | Phụ thuộc vào việc Lễ tân có nhớ gọi điện nhắc hay không. |
| **Độ chính xác** | Phụ thuộc hoàn toàn vào giải thuật kiểm tra trùng lịch (Conflict Checker). | Con người có thể linh hoạt xử lý các case đặc biệt nhưng chậm. |

## 4. Đề xuất cho dự án Synapse

Dựa trên mục tiêu của Khóa luận (Tối ưu hóa và Hiện đại hóa):

1.  **Chế độ Mặc định: Tự động (Auto-Confirm)**
    - Khi Khách hàng đặt: Nếu kiểm tra qua `ConflictChecker` thấy trống lịch -> Trạng thái `CONFIRMED` ngay.
    - Lý do: Đồng bộ với Use Case đã viết và mang lại cảm giác "Smart System".

2.  **Trường hợp Nhân viên tạo: Tự động Xác nhận**
    - Như đã implement: Lễ tân tạo hộ khách -> `CONFIRMED` ngay vì coi như đã chốt trực tiếp.

3.  **Mở rộng (Tương lai): Hybrid Model**
    - Chỉ những dịch vụ "Phức tạp" (VD: Liệu trình dài ngày, cần chuẩn bị tài nguyên đặc biệt) mới để trạng thái `PENDING_APPROVAL`.

## 5. Kết luận
Lựa chọn **Tự động Xác nhận** cho khách hàng là phương án tối ưu, phù hợp với xu hướng chuyển đổi số hiện nay. Logic này đã được tích hợp vào `BookingService.create` của hệ thống.

---
*Tài liệu được biên soạn bởi Antigravity Researcher.*
