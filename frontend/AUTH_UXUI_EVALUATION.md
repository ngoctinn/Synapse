# Đánh giá Chi tiết UX/UI Trang Xác thực (Authentication)

Dưới đây là đánh giá chi tiết về trải nghiệm người dùng (UX) và giao diện người dùng (UI) cho các trang xác thực: Đăng nhập (`/login`), Đăng ký (`/register`), và Quên mật khẩu (`/forgot-password`).

## 1. Vấn đề Chung (Toàn bộ các trang Auth)
- **Hiệu ứng chuyển trang (Page Transition):** Chưa có hiệu ứng mượt mà khi chuyển giữa các trang Đăng nhập / Đăng ký. Việc chuyển trang diễn ra tức thì, tạo cảm giác hơi cứng.
- **Phản hồi người dùng (Feedback):**
    - Các trường nhập liệu (Input fields) chưa có trạng thái `focus` rõ ràng (ví dụ: đổi màu viền, đổ bóng) để người dùng biết mình đang nhập vào đâu.
    - Thiếu thông báo lỗi trực quan (Validation errors) ngay khi người dùng nhập sai định dạng (ví dụ: email không hợp lệ) mà phải đợi bấm nút Submit.

## 2. Trang Đăng nhập (`/login`)
- **Bố cục (Layout):**
    - Khoảng cách giữa các thành phần (Spacing) hơi chật chội, đặc biệt là giữa nút "Đăng nhập" và liên kết "Đăng ký ngay".
- **Semantic HTML & Accessibility:**
    - Biểu tượng "Hiện mật khẩu" (Eye icon) đang sử dụng thẻ `<img>` trực tiếp bên trong `<button>` mà thiếu thuộc tính `alt` mô tả, gây khó khăn cho trình đọc màn hình.
    - Placeholder của trường Email là "name@example.com" - hơi chung chung, nên gợi ý cụ thể hơn hoặc bỏ placeholder để giao diện sạch hơn nếu đã có label.

## 3. Trang Đăng ký (`/register`)
- **Trải nghiệm nhập liệu (Input UX):**
    - Thiếu chỉ báo độ mạnh mật khẩu (Password Strength Meter). Người dùng không biết mật khẩu của mình có đủ mạnh hay không cho đến khi gửi form.
    - Trường "Xác nhận mật khẩu" là thừa trong UX hiện đại nếu có nút "Hiện mật khẩu". Tuy nhiên, nếu giữ lại, cần có thông báo tức thì nếu hai mật khẩu không khớp.
- **Nội dung (Copywriting):**
    - Nút CTA là "Đăng ký" hơi khô khan. Có thể dùng "Tạo tài khoản" hoặc "Bắt đầu miễn phí" để đồng bộ với trang chủ.

## 4. Trang Quên mật khẩu (`/forgot-password`)
- **Quy trình (Workflow):**
    - Sau khi bấm "Gửi yêu cầu", chưa rõ hệ thống sẽ phản hồi như thế nào (hiện thông báo tại chỗ hay chuyển trang). Cần có một trang thông báo "Kiểm tra email" rõ ràng thay vì chỉ hiện text nhỏ.
    - Nút "Quay lại đăng nhập" (hoặc liên kết) cần được làm nổi bật hơn để người dùng dễ dàng quay lại nếu lỡ bấm nhầm.

## 5. Mobile Responsiveness (Dự đoán)
- Dựa trên ảnh chụp Desktop, các form đang nằm căn giữa khá tốt. Tuy nhiên, cần kiểm tra kỹ trên Mobile để đảm bảo các input không bị quá nhỏ và nút bấm đủ lớn (tối thiểu 44px chiều cao) cho thao tác chạm.

## 6. Tính nhất quán (Consistency)
- Màu sắc nút bấm (Primary action) đang sử dụng màu đen/tối. Cần đối chiếu xem đã đúng với màu thương hiệu (Brand Color) của Synapse chưa, hay nên dùng màu nổi bật hơn (ví dụ: xanh hoặc tím gradient như các yếu tố khác trên trang chủ).

## 7. Ghi chú Kỹ thuật (Technical Notes)
- **Fast Refresh Logs:** Console hiện nhiều log về Fast Refresh building/rebuilding, cho thấy có thể component đang bị render lại nhiều lần không cần thiết hoặc file được lưu liên tục. Dù đây là môi trường Dev, nhưng cần lưu ý tối ưu.
- **Hydration Error:** Có một lỗi Hydration (mismatch attributes) xuất hiện ở trang Login (Step 25). Cần kiểm tra lại sự khác biệt giữa Server-side và Client-side rendering (thường do extensions hoặc sai lệch HTML tag nesting).
