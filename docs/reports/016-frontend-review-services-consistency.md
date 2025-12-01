# Báo Cáo Đánh Giá Frontend: Tính Năng Dịch Vụ (Services)

**Ngày:** 02/12/2025
**Người thực hiện:** Antigravity
**Phạm vi:** `frontend/src/features/services`

## 1. Tổng Quan
Báo cáo này tập trung vào việc đánh giá tính nhất quán giữa giao diện Tạo mới và Chỉnh sửa Dịch vụ, cũng như xác nhận vấn đề thiếu chức năng tải ảnh.

## 2. Phân Tích Chi Tiết

### 2.1. Kiến Trúc & Code Quality (FSD)
- **Tuân thủ FSD:** Tốt. Module `services` có `index.ts` export đúng các thành phần public (`ServiceTable`, `CreateServiceDialog`, `actions`).
- **Clean Code:** Code rõ ràng, sử dụng `useTransition` cho Server Actions, `react-hook-form` và `zod` cho validation.
- **Ngôn ngữ:** Comment và label đều sử dụng Tiếng Việt chuẩn.

### 2.2. Vấn Đề UX/UI & Tính Nhất Quán

#### 🔴 Thiếu Chức Năng Quản Lý Ảnh
- **Hiện trạng:**
  - `ServiceForm` hoàn toàn không có trường upload ảnh.
  - `serviceSchema` trong `schemas.ts` thiếu trường `image_url`, mặc dù `Service` type và Database có hỗ trợ.
- **Tác động:** Người dùng không thể thêm hình ảnh minh họa cho dịch vụ, làm giảm tính thẩm mỹ và trải nghiệm khách hàng trên trang đặt lịch.

#### 🔴 Không Nhất Quán Giữa Create & Edit Dialog
- **Kích thước Dialog:**
  - **Create Dialog (`create-service-dialog.tsx`):** Sử dụng `sm:max-w-5xl` (Rộng).
  - **Edit Dialog (`service-actions.tsx`):** Sử dụng `sm:max-w-2xl` (Hẹp).
- **Layout Form:**
  - `ServiceForm` được thiết kế với layout 2 cột (`md:grid-cols-12` chia 7/5).
  - Với `max-w-2xl` của Edit Dialog, layout 2 cột này sẽ trở nên rất chật chội hoặc bị vỡ trên một số màn hình, trong khi Create Dialog hiển thị thoáng và đẹp hơn.
- **Trải nghiệm:** Sự thay đổi kích thước đột ngột giữa hai thao tác tương tự nhau gây cảm giác thiếu chuyên nghiệp.

### 2.3. Đánh Giá "Premium" Feel
- **Điểm cộng:**
  - Component "Trực quan hóa thời gian" (Time Visualization) rất sáng tạo và hữu ích.
  - Sử dụng `Badge` và màu sắc trạng thái tốt.
- **Điểm trừ:**
  - Thiếu hình ảnh làm giao diện danh sách và form hơi đơn điệu.
  - Các dialog chưa có transition mượt mà đồng nhất (Create dialog có `duration-300` nhưng Edit thì không rõ ràng).

### 2.4. Đánh Giá Chi Tiết Bố Cục (Layout) - ServiceForm
- **Cấu trúc Grid (7/5):**
  - Layout chia cột 7/5 (`md:grid-cols-12`) là hợp lý cho màn hình rộng (Create Dialog), giúp cân bằng giữa các trường nhập liệu chính và phần bổ trợ (Visualization/Skills).
  - Tuy nhiên, tỷ lệ này gây chật chội khi tái sử dụng trong Edit Dialog (`max-w-2xl`), dẫn đến các input bị co hẹp quá mức.
- **Nhóm trường thông tin (Grouping):**
  - **Hợp lý:** Nhóm `Duration` (Thời lượng) và `Buffer Time` (Thời gian nghỉ) đi cùng nhau rất logic về mặt nghiệp vụ.
  - **Chưa hợp lý:** Nhóm `Price` (Giá) và `Status` (Trạng thái) đặt cạnh nhau có phần gượng ép. `Status` là một meta-data quản trị, trong khi `Price` là thông tin chính. Việc custom UI của `Status` (khung border riêng) cũng làm mất cân đối so với input `Price` bên cạnh.
- **Visual Hierarchy (Phân cấp thị giác):**
  - Phần "Trực quan hóa thời gian" (Time Visualization) nổi bật và hữu ích, tạo điểm nhấn tốt cho UX.
  - Footer (Nút Submit) được tách biệt rõ ràng bằng border-top, giúp định hướng hành động tốt.
- **Khoảng cách (Spacing):**
  - Sử dụng `space-y-6` tạo cảm giác thoáng đãng, dễ nhìn.

## 3. Đề Xuất Cải Tiến (Action Plan)

### 3.1. Nâng Cấp Schema & Type
- [x] Cập nhật `serviceSchema` trong `schemas.ts`: Thêm `image_url: z.string().optional()`.

### 3.2. Bổ Sung Image Upload (Giao Diện)
- [x] Tạo UI component `ImageUpload` trong `ServiceForm` (Khu vực kéo thả/chọn ảnh).
- [x] Hiển thị preview ảnh sau khi chọn (Client-side preview).
- [x] **Lưu ý:** Chưa tích hợp upload lên Supabase Storage (Backend xử lý sau).

### 3.3. Đồng Bộ Hóa Dialog
- [x] **Thống nhất kích thước:** Chuyển cả Create và Edit Dialog về cùng kích thước `sm:max-w-5xl` để tối ưu layout 2 cột.
- [x] **Refactor Edit Dialog:** Tách Edit Dialog ra khỏi `service-actions.tsx` thành component riêng `EditServiceDialog` (tương tự `CreateServiceDialog`) để dễ quản lý và tái sử dụng style.

### 3.4. Micro-animations & Polish
- [x] Thêm animation khi mở Dialog (Zoom in/Fade in).
- [ ] Cải thiện Empty State của Table (đã có nhưng có thể đẹp hơn với hình minh họa).

## 4. Kết Luận
Cần ưu tiên sửa đổi Schema và Form để hỗ trợ hình ảnh, đồng thời refactor Edit Dialog để đảm bảo tính nhất quán về UI/UX.

---
*Để thực hiện các thay đổi này, hãy chạy workflow `/frontend-refactor` với input là file báo cáo này.*
