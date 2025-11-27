---
title: Yêu cầu Component UI Tùy chỉnh
status: Draft
priority: Medium
assignee: AI Assistant
---

# Yêu cầu Component UI Tùy chỉnh

## 1. Tuyên bố Vấn đề
Các component mặc định của Shadcn/UI (Sonner, Dialog, Input) chưa hoàn toàn phù hợp với yêu cầu thiết kế và thương hiệu cụ thể của dự án Synapse. Các ô nhập liệu hiện tại thiếu các dấu hiệu trực quan (icon), và cơ chế phản hồi (toast, dialog) cần được tùy chỉnh để nâng cao trải nghiệm người dùng và nhận diện thương hiệu.

## 2. Mục tiêu
- Tạo bộ component UI tùy chỉnh tuân thủ các thiết kế đã cung cấp.
- Cải thiện khả năng hiển thị phản hồi người dùng với thông báo Toast (Sonner) tùy chỉnh.
- Tăng cường hướng dẫn người dùng với Dialog Xác nhận tùy chỉnh.
- Cải thiện khả năng sử dụng form với Input có Icon và Input Mật khẩu (có nút hiện/ẩn).
- Tập trung các component tùy chỉnh này trong `shared/ui/custom/` để tái sử dụng.

## 3. Câu chuyện Người dùng (User Stories)
- **US 1**: Là người dùng, tôi muốn thấy thông báo thành công trực quan, đẹp mắt khi đăng nhập thành công, để tôi biết chắc chắn hành động của mình đã hoàn tất.
- **US 2**: Là người dùng, tôi muốn được hướng dẫn bởi một hộp thoại rõ ràng để kiểm tra email xác thực sau khi đăng nhập, để tôi biết bước tiếp theo trong quy trình thiết lập tài khoản.
- **US 3**: Là người dùng, tôi muốn thấy các biểu tượng trong ô nhập liệu (ví dụ: biểu tượng email), để tôi nhanh chóng nhận biết mục đích của ô đó.
- **US 4**: Là người dùng, tôi muốn có thể bật/tắt hiển thị mật khẩu của mình, để tôi đảm bảo mình đã nhập đúng.

## 4. Yêu cầu Chức năng

### 4.1. Custom Sonner (Toast)
- **Thiết kế**: Phải khớp với các mẫu thiết kế "Saved Successfully", "Did you know?", "Action Required", "Error Occurred".
- **Biến thể**: Thành công (Xanh lá), Thông tin (Xanh dương), Cảnh báo (Vàng), Lỗi (Đỏ).
- **Nội dung**: Tiêu đề, Mô tả, Icon, Nút đóng.
- **Hành vi**: Tự động tắt sau một khoảng thời gian, người dùng có thể tắt thủ công.

### 4.2. Custom Dialog
- **Thiết kế**: Phải khớp với thiết kế "Anatomy of a Confirmation Dialog".
- **Thành phần**:
    - Mẫu Nhấn mạnh Tín hiệu (Visual Cue/Icon).
    - Tiêu đề (Headline/Question).
    - Mô tả (Context/Consequence).
    - Cơ chế Ma sát (Input tùy chọn để xác nhận - chưa cần cho hướng dẫn email nhưng tốt để có cho tổng quát).
    - Nút Hành động Chính (ví dụ: "Xóa tài khoản", "Xác nhận").
    - Nút Hành động Phụ (ví dụ: "Giữ tài khoản", "Hủy").
- **Trường hợp sử dụng cụ thể**: Dialog "Kiểm tra Email" sau khi đăng nhập.

### 4.3. Custom Input
- **Tính năng**: Hỗ trợ hiển thị icon ở phía bên trái của văn bản nhập liệu.
- **Kiểu dáng**: Nhất quán với Shadcn/UI nhưng điều chỉnh padding để chứa icon.

### 4.4. Custom Password Input
- **Tính năng**: Kế thừa tính năng của Custom Input (hỗ trợ icon trái).
- **Tính năng**: Nút icon "Mắt" ở bên phải để bật/tắt hiển thị mật khẩu (ẩn/hiện).

## 5. Yêu cầu Phi chức năng
- **Hiệu năng**: Component phải nhẹ và không gây render lại không cần thiết.
- **Khả năng truy cập (Accessibility)**:
    - Input phải có nhãn ARIA phù hợp.
    - Nút toggle mật khẩu phải chỉ rõ trạng thái (Hiện/Ẩn).
    - Dialog phải giữ focus (focus trap).
- **Tái sử dụng**: Component phải đủ tổng quát để sử dụng trong toàn bộ ứng dụng.
- **Ngăn xếp công nghệ**: React, Tailwind CSS, Shadcn/UI (Radix UI primitives), Lucide React (icons).

## 6. Ràng buộc & Giả định
- **Ràng buộc**: Phải sử dụng thư viện `sonner` cho toast.
- **Ràng buộc**: Phải sử dụng `radix-ui/react-dialog` cho dialog.
- **Giả định**: Dialog "Kiểm tra Email" là luồng demo được kích hoạt ngay sau khi đăng nhập cho lần lặp này.

## 7. Câu hỏi Mở
- Không có ở giai đoạn này.
