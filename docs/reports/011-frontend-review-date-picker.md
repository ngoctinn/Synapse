# Báo Cáo Đánh Giá Frontend: Date & Birthday Picker

**Ngày:** 30/11/2024
**Người thực hiện:** AI Assistant
**Phạm vi:** `frontend/src/shared/ui/custom/date-picker.tsx`, `frontend/src/shared/ui/custom/birthday-picker.tsx`

---

## 1. Tổng Quan & Phân Tích Hiện Trạng

### 1.1. `date-picker.tsx`
*   **Chức năng:** Chọn ngày chung (Booking, Lịch hẹn).
*   **Ưu điểm:**
    *   Sử dụng `Popover` và `Calendar` chuẩn của Shadcn UI.
    *   Có nút "Hôm nay" tiện lợi.
    *   Hỗ trợ Localization (Tiếng Việt).
*   **Nhược điểm UX/UI:**
    *   **Input thụ động:** Người dùng không thể gõ trực tiếp ngày (VD: `30/11/2024`) mà bắt buộc phải click chọn.
    *   **Thiếu hiệu ứng:** Popover xuất hiện đột ngột, thiếu transition "mượt mà" (Premium feel).

### 1.2. `birthday-picker.tsx`
*   **Chức năng:** Chọn ngày sinh.
*   **Vấn đề UX Nghiêm trọng:**
    *   **Thao tác rườm rà:** Để chọn năm sinh (VD: 1990), người dùng phải mở Calendar -> Click Dropdown Năm -> Cuộn tìm 1990. Đây là thao tác tốn nhiều clicks và gây mỏi tay (scroll fatigue), đặc biệt trên mobile.
    *   **Không tối ưu cho mental model:** Người dùng luôn nhớ chính xác ngày sinh của mình. Việc bắt họ "tìm kiếm" ngày sinh trên lịch là không cần thiết.
    *   **Giao diện:** Dropdown mặc định của trình duyệt (trong `captionLayout="dropdown"`) trông thiếu thẩm mỹ và không đồng bộ với thiết kế Premium.

---

## 2. Kết Quả Nghiên Cứu (Research Findings)

Dựa trên phân tích các Best Practices UX/UI hiện đại (2024) cho việc chọn ngày sinh:

1.  **Input > Calendar:** Đối với ngày sinh, **nhập liệu trực tiếp** (Typing) luôn nhanh và chính xác hơn chọn trên lịch.
2.  **Segmented Inputs:** Mô hình tối ưu nhất là 3 ô nhập liệu riêng biệt (Ngày | Tháng | Năm) hoặc một ô nhập liệu có **Masking** (Mặt nạ định dạng) tự động.
3.  **Mobile First:** Trên mobile, việc cuộn dropdown năm rất tệ. Bàn phím số (Numeric Keypad) là phương thức nhập liệu nhanh nhất.

---

## 3. Đề Xuất Cải Tiến (Action Plan)

Để đạt tiêu chuẩn "Premium" và "WOW factor", tôi đề xuất Refactor lại hoàn toàn 2 component này.

### 3.1. Refactor `BirthdayPicker` (Ưu tiên cao)
Chuyển đổi từ mô hình "Calendar Picker" sang mô hình **"Smart Segmented Input"**.

*   **Thiết kế mới:**
    *   Gồm 3 ô input nhỏ gọn: `DD` - `MM` - `YYYY`.
    *   **Auto-focus:** Tự động nhảy sang ô tiếp theo khi nhập đủ số (VD: Nhập 30 -> tự nhảy sang tháng).
    *   **Validation:** Kiểm tra tính hợp lệ ngay lập tức (VD: Không thể nhập ngày 32, không thể nhập năm tương lai).
    *   **Visual:** Thiết kế dạng "Grouped Input" với border mượt mà, focus ring đẹp mắt.
*   **Fallback:** Vẫn giữ một nút nhỏ icon Lịch để mở Calendar nếu người dùng *thực sự* muốn chọn (nhưng ẩn đi hoặc làm phụ).

### 3.2. Refactor `DatePicker`
Nâng cấp trải nghiệm chọn ngày chung.

*   **Smart Input:** Cho phép gõ ngày trực tiếp vào ô trigger (sử dụng Mask `DD/MM/YYYY`).
*   **Quick Select:** Thêm các preset thông minh trong Popover: "Hôm nay", "Ngày mai", "Đầu tuần sau".
*   **Micro-animations:** Sử dụng `framer-motion` để làm mượt hiệu ứng mở/đóng Popover và hiệu ứng hover ngày.

### 3.3. Kế hoạch thực hiện (Refactor Workflow)

1.  **Tạo `SegmentedDateInput` component:** Component nhập ngày chia 3 ô (Shared UI).
2.  **Cập nhật `BirthdayPicker`:** Sử dụng `SegmentedDateInput` làm giao diện chính.
3.  **Cập nhật `DatePicker`:** Tích hợp logic nhập tay (Masked Input).
4.  **Styling:** Áp dụng Shadcn theme, bo góc (radius), và animation.

---

**Kết luận:** Việc thay đổi `BirthdayPicker` sang dạng nhập liệu sẽ giải quyết triệt để vấn đề UX hiện tại và mang lại cảm giác chuyên nghiệp, hiện đại hơn rất nhiều so với việc dùng Dropdown Lịch cũ kỹ.
