# Báo Cáo Scout: Customer Dashboard Features

**Ngày:** 2025-12-08
**Đối tượng:** `frontend/src/features/customer-dashboard`
**Tập trung:** `booking-dialog.tsx` và các component liên quan.

---

## 1. Tóm Tắt Hiện Trạng

Sau khi rà soát (scout) phân hệ Dashboard, tôi đã hoàn thành refactor cho `profile-info.tsx` (Single Column Layout, Clean CSS) theo yêu cầu. Tuy nhiên, tôi phát hiện một "điểm nóng" kỹ thuật cần xử lý ngay:

**Component `BookingDialog` (`booking-dialog.tsx`)**:
- **Kích thước:** Quá lớn (~600 dòng code).
- **Vấn đề cấu trúc:** Đang trộn lẫn logic điều hướng (Wizard Steps), quản lý trạng thái (State Management) và giao diện UI phức tạp.
- **Khó bảo trì:** Việc định nghĩa toàn bộ nội dung các bước (`steps` object) ngay trong file chính khiến code khó đọc và khó tái sử dụng.
- **UI/UX:** Logic "Giờ vàng" và các hiệu ứng animation đang nằm rải rác.

## 2. Kế Hoạch "Chia Để Trị" (Refactor Plan)

Để đảm bảo khả năng mở rộng và tuân thủ FSD, tôi "ra quyết định" thực hiện tái cấu trúc `BookingDialog` như sau:

### 2.1. Kiến Trúc Mới
Tạo thư mục `components/booking/` để chứa các sub-components:

```
components/booking/
├── booking-step-preference.tsx  # Bước 1: Chọn kiểu đặt (Linh hoạt/Cụ thể)
├── booking-step-staff.tsx       # Bước 2a: Chọn nhân viên
├── booking-step-time.tsx        # Bước 2b: Chọn ngày giờ (Có logic Giờ vàng)
├── booking-step-confirm.tsx     # Bước 3: Xác nhận thông tin
└── booking-step-success.tsx     # Màn hình thành công
```

### 2.2. Tách Biệt Logic (Custom Hook)
Tạo `hooks/use-booking-flow.ts` để quản lý:
- State chuyển bước (next/back).
- Logic tính toán Progress %.
- Logic validate điều kiện (ví dụ: chỉ cho Next khi đã chọn giờ).

### 2.3. Lợi Ích
1.  **Code Sạch:** Mỗi file chỉ dài khoảng 100-150 dòng.
2.  **Dễ Test:** Có thể test riêng biệt từng bước (ví dụ: test logic chọn giờ mà không cần mock cả luồng).
3.  **Chuẩn FSD:** Tách biệt rõ ràng giữa Presentation (UI) và Logic.

## 3. Khuyến Nghị UI/UX (Pro Max)
Trong quá trình tách file, sẽ đồng thời nâng cấp UI:
- **Responsive:** Tối ưu Calendar và Time Slot grid cho mobile (hiện tại grid có thể hơi chật).
- **Token chuẩn:** Thay thế các màu hardcoded (`bg-primary/10`) bằng token ngữ nghĩa (nếu có) hoặc giữ nguyên sự nhất quán với `InputWithIcon`.

---

**Quyết định:** Đề xuất thực thi workflow Refactor cho `BookingDialog` ngay lập tức để hoàn thiện chất lượng code cho Dashboard.
