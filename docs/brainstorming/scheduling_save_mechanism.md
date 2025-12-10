# Brainstorming: Cơ chế Lưu cho Xếp Lịch Nhân Viên (Auto-save vs Manual Save)

## 1. Xác định Vấn đề
Người dùng thắc mắc về sự vắng mặt của nút "Lưu" và băn khoăn phương án nào tối ưu hơn cho tính năng Xếp lịch (Scheduling).

- **Bối cảnh:**
    - Tính năng có chế độ "Tô lịch" (Paint Mode) cho phép chỉnh sửa hàng loạt ô nhanh chóng.
    - Dữ liệu lịch ảnh hưởng trực tiếp đến "Khả năng đặt hẹn" (Availability) của hệ thống.

## 2. Brainstorming Ý tưởng

| Tiêu chí | Phương án A: Lưu Tự Động (Hiện tại) | Phương án B: Lưu Thủ Công (Batch Save) |
| :--- | :--- | :--- |
| **Cơ chế** | Thao tác đến đâu, API gọi đến đó (1:1). | Thay đổi lưu tạm ở Client -> Bấm "Lưu" -> Gửi 1 gói dữ liệu (1:N). |
| **Trải nghiệm** | Nhanh, mượt, giống Google Calendar. Không lo quên lưu. | An toàn, cảm giác kiểm soát tốt hơn. Cần nhớ bấm nút. |
| **Hiệu năng** | **Thấp** khi dùng "Tô lịch". Ví dụ: Tô 1 tuần cho 1 NV = 7 request liên tục. | **Cao**. Gom 50 thay đổi vào 1 request duy nhất. |
| **Rủi ro** | "Sửa nhầm là dính ngay". Khách có thể thấy lịch trống trong khi Admin đang sửa. | Cho phép "Làm nháp", sai thì "Hủy" làm lại. Chỉ public khi đã chắc chắn. |

## 3. Phân tích & Đánh giá

### Tại sao Auto-save (Phương án A) KHÔNG hợp lý ở đây?
1.  **Xung đột với Paint Mode:** Chức năng "Tô" khuyến khích người dùng quẹt chuột nhanh qua nhiều ô. Auto-save sẽ tạo ra lượng request rác khổng lồ, gây lag hoặc lỗi đồng bộ.
2.  **Tâm lý người xếp lịch:** Việc xếp lịch thường là "Planning" (Lập kế hoạch). Người quản lý thường muốn xếp thử xem "Thứ 2 này ai làm?", xoá đi xếp lại cho cân đối, rồi mới muốn chốt. Auto-save tước đi quyền "thử nghiệm" này.
3.  **Safety:** Lỡ tay xóa nhầm một ca đã có khách đặt, nếu Auto-save kích hoạt ngay lập tức có thể gây lỗi hệ thống hoặc gửi thông báo sai cho khách.

## 4. Đề xuất
**Kết luận:** **Lưu Thủ Công (Phương án B) là HỢP LÝ HƠN** cho module này.

### Giải pháp đề xuất: "Batch Update Mode"
1.  **State Management:** Khi người dùng thay đổi (thêm/xóa/tô), chỉ cập nhật state cục bộ (`localSchedules`) và đánh dấu là `isDurty`.
2.  **UI Feedback:**
    - Hiển thị thanh Action Bar nổi lên khi có thay đổi: "Có 5 thay đổi chưa lưu".
    - Các ô bị thay đổi sẽ có viền màu hoặc đánh dấu visual (ví dụ: gạch chéo cho xóa, màu nhạt cho mới).
3.  **Buttons:**
    - [Lưu thay đổi]: Gửi toàn bộ thay đổi về Server (cần API `bulk_update` hoặc `sync`).
    - [Hủy]: Revert về trạng thái ban đầu.

### Kế hoạch chuyển đổi (Nếu được duyệt)
1.  Refactor `useStaffSchedule` để tách biệt `serverSchedules` và `draftSchedules`.
2.  Tạo Server Action `bulkUpdateSchedule(creates: [], deletes: [])`.
3.  Thêm thanh "Unsaved Changes Toolbar".
