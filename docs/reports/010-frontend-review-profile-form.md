# Báo Cáo Đánh Giá Frontend: Profile Form

**Ngày:** 30/11/2025
**Người thực hiện:** AI Assistant
**Mục tiêu:** Đánh giá `frontend/src/features/customer-dashboard/components/profile-form.tsx` theo tiêu chuẩn FSD, Clean Code và UX/UI Premium.

---

## 1. Tổng Quan
Module `profile-form` là thành phần quan trọng cho phép khách hàng cập nhật thông tin cá nhân. Hiện tại, code hoạt động ổn định nhưng chưa đạt chuẩn "Premium" về UX/UI và còn thiếu sót về quy chuẩn Clean Code (đặc biệt là ngôn ngữ comment).

## 2. Đánh Giá Kiến Trúc & Code (FSD & Clean Code)

### ✅ Điểm Tốt
*   **Cấu trúc FSD:** Module nằm đúng vị trí `features/customer-dashboard`. Có file `index.ts` export Public API rõ ràng.
*   **Next.js 16:** Sử dụng đúng `useActionState` cho form handling và `"use client"`.
*   **Type Safety:** Sử dụng `UserProfile` type và validation schema (thông qua `actions.ts`).

### ❌ Vi phạm & Cần Cải Thiện
1.  **Ngôn ngữ Comment (Nghiêm trọng):**
    *   File `profile-form.tsx` gần như không có comment giải thích nghiệp vụ.
    *   File `actions.ts` và `api.ts` chứa nhiều comment và TODO bằng **Tiếng Anh** (Ví dụ: `// TODO: Implement real avatar upload`, `// Simulate network delay`).
    *   **Quy tắc:** Bắt buộc 100% comment phải là **Tiếng Việt**.

2.  **Hardcoded Strings:**
    *   Các chuỗi thông báo "Thành công", "Lỗi", "Cập nhật hồ sơ thành công!" đang hardcode trong code. Nên tách ra constants hoặc file config để dễ quản lý (dù chưa cần i18n ngay, nhưng nên tập trung).

3.  **Xử lý Case Conversion:**
    *   Việc sử dụng `toCamelCase` và `toSnakeCase` thủ công trong `api.ts` là cần thiết do sự khác biệt giữa Frontend (camelCase) và Backend (snake_case), nhưng cần đảm bảo utility này hoạt động đệ quy và hiệu quả.

4.  **Imports:**
    *   Import nội bộ `@/features/customer-dashboard/actions` trong `profile-form.tsx` là chấp nhận được, nhưng nên cân nhắc dùng relative import `../../actions` để rõ ràng hơn về dependency nội bộ của feature.

## 3. Đánh Giá UX/UI (Premium & WOW Factor)

### 😐 Hiện Tại
*   Giao diện sử dụng `Card` và `Grid` cơ bản.
*   Avatar upload có nút camera nhưng chưa có hiệu ứng tương tác rõ ràng.
*   Loading state chỉ là spinner trong nút "Lưu thay đổi".
*   Thiếu các micro-animations làm cho form cảm giác "tĩnh".
*   **Feedback từ User:**
    *   Bố cục form hơi rời rạc, thiếu sự liên kết.
    *   Trường Email disabled nhìn chưa trực quan (khó phân biệt hoặc trông như bị lỗi).

### 💡 Đề Xuất Cải Tiến (Brainstorming)
Để đạt chuẩn **Premium**, cần thực hiện các thay đổi sau:

1.  **Cải Thiện Bố Cục (Layout Refinement):**
    *   **Gom nhóm thông tin:** Thay vì dàn trải grid 2 cột đều nhau, hãy nhóm các trường liên quan:
        *   *Thông tin định danh:* Họ tên, Ngày sinh.
        *   *Thông tin liên hệ:* Số điện thoại, Email, Địa chỉ.
    *   **Visual Hierarchy:** Sử dụng `Fieldset` hoặc tiêu đề phụ nhỏ (sub-headers) để phân cách các nhóm thông tin, giúp mắt người dùng dễ quét hơn.
    *   **Spacing:** Điều chỉnh khoảng cách (gap) giữa các input và label để tạo cảm giác "đặc" và liên kết hơn, tránh cảm giác "rời rạc".

2.  **Trải Nghiệm Trường Disabled (Email):**
    *   **Visual Cue:** Thay đổi background sang màu xám rõ rệt hơn (`bg-gray-100` hoặc `bg-muted/80`).
    *   **Icon:** Thay icon `Mail` bằng icon `Lock` (Ổ khóa) để biểu thị rõ ràng trạng thái "Không thể chỉnh sửa" vì lý do bảo mật/định danh.
    *   **Tooltip:** Thêm tooltip khi hover vào trường Email: "Email đăng ký không thể thay đổi".

3.  **Micro-animations (Framer Motion):**
    *   **Entry Animation:** Form nên trượt nhẹ lên (Fade In Up) khi trang load.
    *   **Input Focus:** Khi focus vào input, label có thể đổi màu nổi bật hơn hoặc có hiệu ứng glow nhẹ cho border.
    *   **Avatar Hover:** Khi rê chuột vào avatar, ảnh nên zoom nhẹ (scale 1.05) và overlay icon camera hiện rõ hơn với backdrop blur.

2.  **Avatar Upload Experience:**
    *   Hiện tại chỉ là `input type="file"` ẩn. Nên có preview ngay lập tức với hiệu ứng loading khi ảnh đang được xử lý (giả lập hoặc thật).
    *   Thêm tính năng Drag & Drop cho khu vực Avatar nếu có thể.

3.  **Feedback Visuals:**
    *   Khi lưu thành công, thay vì chỉ Toast, nút Save có thể biến thành dấu tích xanh (Morphing Button) trong 2s rồi trở lại bình thường.
    *   Toast notification nên dùng style "Glassmorphism" để sang trọng hơn.

4.  **Layout & Spacing:**
    *   Tăng padding cho `Card` để tạo cảm giác thoáng đãng (White space).
    *   Sử dụng background gradient rất nhẹ hoặc pattern mờ phía sau để không bị đơn điệu.

## 4. Kế Hoạch Hành Động (Refactor Plan)

Để thực hiện các cải tiến trên, vui lòng chạy workflow `/frontend-refactor` với các task sau:

1.  **Refactor Code & Comments:**
    *   Chuyển toàn bộ comment sang Tiếng Việt.
    *   Review lại các hardcoded strings.

2.  **Nâng cấp UX/UI:**
    *   Cài đặt `framer-motion` (nếu chưa có).
    *   Wrap `Card` trong `motion.div` để tạo hiệu ứng xuất hiện.
    *   Cải thiện component `AvatarSelector` với hover effects.
    *   Thêm hiệu ứng cho nút Submit.

3.  **Logic:**
    *   Đảm bảo `useActionState` xử lý lỗi và hiển thị validation error ngay dưới từng field (nếu có) thay vì chỉ Toast chung chung.

---
*Báo cáo này được tạo tự động bởi AI Assistant theo quy trình /frontend-review.*
