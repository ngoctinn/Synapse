# Báo cáo Đánh giá Feature: Resources (Tài nguyên)

## 1. Phân tích Giao diện & Style
- **Thành phần chính:** `ResourceTable`, `ResourceForm`, `MaintenanceTimeline`.
- **Icon:** Sử dụng `Bed` cho phòng (ROOM) và `Box` cho thiết bị (EQUIPMENT).
- **Bố cục:** Bảng dữ liệu với các Badge tùy chỉnh (`preset`).

## 2. Câu hỏi Phản biện
1. **Về Xử lý Xóa hàng loạt:**
   - Tại sao `ResourceTable` lại sử dụng vòng lặp `for...of` để gọi API xóa từng item, trong khi `PackageTable` dùng `Promise.allSettled`? Sự thiếu nhất quán trong cách xử lý bất đồng bộ này có thể dẫn đến các lỗi khó debug khi một request thất bại giữa chừng.
   - Tại sao không sử dụng `useBulkAction` (một custom hook đã xuất hiện trong `ServiceTable`) để chuẩn hóa logic này?

2. **Về UI/UX:**
   - Badge cho loại tài nguyên sử dụng `preset`. Các preset này (`resource-room`, `resource-equipment`) được định nghĩa ở đâu? Tại sao không dùng các variant chuẩn của `shadcn/ui`?
   - Cột "Tên & Mã" hiển thị mã tài nguyên (`row.code`) ngay dưới tên. Mã này có thực sự quan trọng với người dùng cuối không, hay chỉ là thông tin kỹ thuật?

---

# Báo cáo Đánh giá Feature: Reviews (Đánh giá)

## 1. Phân tích Giao diện & Style
- **Thành phần chính:** `ReviewCard`, `StarRating`, `ReviewForm`.
- **Avatar:** Sử dụng DiceBear API để tạo avatar ngẫu nhiên dựa trên tên khách hàng.
- **Bố cục:** Card đơn giản với nội dung đánh giá in nghiêng.

## 2. Câu hỏi Phản biện
1. **Về Quyền riêng tư & Dữ liệu:**
   - Tại sao lại gửi tên khách hàng lên một dịch vụ bên thứ ba (`api.dicebear.com`) để lấy avatar? Điều này có vi phạm chính sách bảo mật dữ liệu khách hàng của Spa không? Tại sao không sử dụng avatar đã có trong hồ sơ khách hàng?
   - Logic `getInitials` lấy 2 chữ cái đầu. Nếu tên khách hàng chỉ có 1 từ (ví dụ: "Lan"), logic này có hoạt động đúng không?

2. **Về UX:**
   - Tại sao nội dung đánh giá (`review.comment`) lại bị ép kiểu in nghiêng (`italic`)? Nếu khách hàng viết một đoạn văn dài, việc đọc chữ in nghiêng sẽ gây mỏi mắt.
   - Tại sao không có tính năng "Phản hồi của chủ Spa" ngay dưới mỗi đánh giá để tăng tính tương tác?

---

# Báo cáo Đánh giá Feature: Services (Dịch vụ)

## 1. Phân tích Giao diện & Style
- **Thành phần chính:** `ServiceTable`, `ServiceTimeVisualizer`, `CreateServiceWizard`.
- **Thẩm mỹ:** Tên dịch vụ sử dụng `font-serif` và `text-lg`, tạo cảm giác sang trọng.
- **Trực quan hóa:** `ServiceTimeVisualizer` sử dụng thanh tiến trình để phân biệt thời gian phục vụ và thời gian nghỉ.

## 2. Câu hỏi Phản biện
1. **Về Nhất quán Font chữ:**
   - Tại sao tên dịch vụ trong bảng lại dùng `font-serif`? Như đã đề cập ở phần Chat, việc pha trộn font Serif và Sans-serif trong cùng một ứng dụng cần có quy tắc rõ ràng. Tại sao các bảng khác (như `PackageTable`) lại không dùng font này?

2. **Về Clean Code & Hooks:**
   - `ServiceTable` sử dụng `useBulkAction`. Đây là một điểm cộng lớn về tính tái sử dụng. Tuy nhiên, tại sao `ResourceTable` và `PackageTable` lại không sử dụng hook này? Có phải dự án đang trong quá trình refactor dở dang không?
   - Tại sao `MOCK_CATEGORIES` lại được import trực tiếp vào component thay vì được truyền qua props từ Page?

3. **Về UI/UX:**
   - `ServiceTimeVisualizer` có hiệu ứng `animate-shimmer` khi hover vào phần thời gian phục vụ. Hiệu ứng này có mục đích gì ngoài việc làm đẹp? Nó có gây xao nhãng không?
   - Tại sao thời gian nghỉ (`bufferTime`) lại sử dụng `backgroundImage` với sọc chéo? Liệu nó có đảm bảo độ tương phản tốt trên các màn hình có độ phân giải thấp không?
   - Trong `ServiceTable`, tại sao tên dịch vụ lại có `group-hover:text-primary` nhưng không có hành động click rõ ràng (như mở link)?
   - Tại sao `ServiceTable` lại nhận vào rất nhiều props như `availableSkills`, `availableRoomTypes`, `availableEquipment` nhưng có vẻ không sử dụng hết trong 100 dòng đầu tiên? Việc truyền quá nhiều props (Prop Drilling) có đang xảy ra ở đây không?
