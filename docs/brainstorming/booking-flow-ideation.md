# Brainstorming: Luồng Đặt Lịch Thông Minh (Smart Booking Flow)

## 1. Vấn đề cốt lõi
Theo `althorism.md`, hệ thống Synapse không chỉ là một công cụ ghi nhận lịch hẹn mà là một **Bộ giải bài toán tối ưu hóa đa mục tiêu (Multi-Objective Optimization Solver)**.
Giao diện người dùng (Booking Dialog) hiện tại chưa tồn tại, và nếu chỉ làm một form điền ngày/giờ thông thường, chúng ta sẽ thất bại trong việc thu thập các dữ liệu đầu vào quan trọng cho thuật toán:
*   $\alpha$ và $\beta$ (Trọng số giữa Thời gian chờ vs. Sở thích cá nhân).
*   Độ mềm dẻo của ràng buộc (Soft Constraints).

## 2. Brainstorming Ý Tưởng

### Phương án 1: The "Priority Wizard" (Trợ lý Ưu tiên)
*   **Mô hình**: Wizard đa bước (Step-by-step).
*   **Luồng đi**:
    1.  Khách chọn Dịch vụ.
    2.  Hệ thống hỏi ngay: **"Bạn ưu tiên điều gì?"**
        *   Option A: **Thời gian** (Tôi cần làm vào khung giờ cụ thể).
        *   Option B: **Chuyên gia** (Tôi muốn KTV cụ thể, giờ giấc linh hoạt hơn).
    3.  Dựa trên lựa chọn, giao diện bước tiếp theo sẽ thay đổi:
        *   Nếu chọn A: Hiển thị Lịch trước, sau đó lọc ra KTV rảnh.
        *   Nếu chọn B: Hiển thị Danh sách KTV (có rating/skill), sau đó hiển thị các slot rảnh của họ.
*   **Ưu điểm**: Map trực tiếp tư duy người dùng vào tham số thuật toán.
*   **Nhược điểm**: Có thể cảm thấy dài dòng nếu khách muốn đặt nhanh.

### Phương án 2: The "Smart Recommendation" (Đề xuất Thông minh/AI)
*   **Mô hình**: Nhập nhu cầu -> Nhận đề xuất (Input -> Output).
*   **Luồng đi**:
    1.  Khách chọn Dịch vụ + Ngày mong muốn (ví dụ: "Chiều Chủ Nhật").
    2.  Hệ thống chạy thuật toán và trả về 3 options (Cards):
        *   **"Sớm nhất"**: 14:00 với KTV Lan (Junior).
        *   **"Đánh giá cao nhất"**: 16:30 với KTV Mai (Senior) - *Wait time cao hơn nhưng CSAT cao hơn*.
        *   **"Tối ưu nhất"**: 15:00 với KTV Hùng.
*   **Ưu điểm**: Trải nghiệm rất "Premium" và "Smart". Giảm thiểu thao tác chọn từng slot.
*   **Nhược điểm**: Cần backend rất mạnh và logic xử lý phức tạp ngay từ đầu.

### Phương án 3: The "Reactive Calendar" (Lịch Phản Ứng)
*   **Mô hình**: Single Page Calendar với các bộ lọc động.
*   **Luồng đi**:
    *   Hiển thị lịch tuần.
    *   Có Toggle "Chuyên gia cụ thể/Bất kỳ ai".
    *   Khi Toggle "Bất kỳ ai" -> Số lượng slot trống tăng lên đột biến (Visual feedback cho thấy lợi ích của việc dễ tính).
    *   Các slot được gắn nhãn: "Giờ cao điểm" (High demand) hoặc "Khuyên dùng" (Recommended).
*   **Ưu điểm**: Nhanh, trực quan.

## 3. Thảo Luận: Có nên giới hạn khách mới chọn KTV?

**Câu hỏi:** *Nếu khách hàng muốn chọn KTV thì phải từng làm dịch vụ, có hợp lý không?*

### Phân tích
*   **Lợi ích (Về thuật toán):** Vô cùng có lợi. Khách mới (New Guests) là nguồn tài nguyên linh hoạt nhất để hệ thống lấp đầy các khoảng trống lịch (Gaps). Ràng buộc cứng ít hơn = Hiệu quả vận hành (RevPATH) cao hơn.
*   **Rủi ro (Về Business):** Ở Việt Nam, khách mới thường đến do "Lời giới thiệu" (Word of Mouth). Ví dụ: *"Đến Synapse gặp chị A làm tốt lắm"*. Nếu chặn họ chọn chị A, ta mất khách.

### Giải pháp Đề xuất: "Soft Blocking" (Rào cản Mềm)
Thay vì cấm hoàn toàn, ta sử dụng thiết kế UX để **định hướng hành vi**:

1.  **Với Khách Cũ (Returning Users)**:
    *   Hiển thị ngay nút **"Đặt lại với [Tên KTV cũ]"** nổi bật nhất.
    *   Lý do: Tăng tính cá nhân hóa và giữ chân khách.

2.  **Với Khách Mới (New Users)**:
    *   Mặc định chọn **"Bất kỳ chuyên gia nào"** (Recommended).
    *   Option chọn KTV sẽ nằm "khuất" hơn một chút (ví dụ: trong nút "Tùy chọn nâng cao" hoặc tab phụ).
    *   **Thêm tính năng "Tìm theo tên"**: Chỉ khi khách CỐ TÌNH tìm tên (do được giới thiệu), hệ thống mới cho chọn.

-> **Kết luận**: Không nên cấm cứng (Hard Block), nhưng nên làm cho việc chọn "Bất kỳ ai" trở thành lựa chọn dễ dàng và hấp dẫn nhất (ví dụ: được giảm giá nhẹ hoặc có nhiều slot giờ đẹp hơn).

## 4. Thiết kế chi tiết (Cập nhật Feedback) - Adaptive Wizard

1.  **Trigger**: Nút "Đặt lịch" trên Card Dịch vụ.
2.  **Dialog Step 1 (Preferences)**:
    *   Hệ thống kiểm tra user:
        *   **Nếu là khách cũ**: Hiển thị Card *"Làm típ với [KTV A]?"* (Top pick).
        *   **Nếu là khách mới**: Hiển thị *"Chúng tôi sẽ chọn chuyên gia phù hợp nhất cho bạn"*.
    *   Vẫn có nút nhỏ: *"Tôi muốn chỉ định chuyên gia khác"*.
3.  **Dialog Step 2 (Time Slot)**:
    *   Hiển thị Lịch.
    *   Các slot **"High Utilization"** (tốt cho Spa) sẽ được gắn tag *"Giờ vàng"* hoặc *"Khuyên dùng"*.
4.  **Dialog Step 3 (Confirmation)**:
    *   Xác nhận.

## 5. Hành động tiếp theo
Nếu bạn đồng ý với hướng **"Soft Blocking"** này, tôi sẽ tiến hành code giao diện `BookingDialog` với logic hiển thị phân nhánh dựa trên loại user (Mock user data).
