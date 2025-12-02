# Báo Cáo Review Frontend: Loại bỏ H1 Title trong Admin Pages

**Ngày tạo:** 2025-12-02
**Người thực hiện:** Antigravity
**Mục tiêu:** Xác định các trang Admin đang sử dụng thẻ `<h1>` làm tiêu đề trang để loại bỏ (theo yêu cầu UI/UX mới).

## 1. Tổng Quan
Qua quá trình quét mã nguồn trong thư mục `src/app/(admin)/admin`, đã phát hiện **9** trang đang sử dụng thẻ `<h1>` để hiển thị tiêu đề. Việc này có thể gây dư thừa nếu Layout chính đã có tiêu đề hoặc Breadcrumb, hoặc để tối ưu không gian hiển thị.

## 2. Danh Sách Các Trang Cần Chỉnh Sửa
Dưới đây là danh sách các file và dòng code chứa thẻ `<h1>` cần được loại bỏ hoặc thay thế:

| STT | Đường dẫn File | Nội dung H1 hiện tại | Dòng |
|---|---|---|---|
| 1 | `src/app/(admin)/admin/appointments/page.tsx` | `Danh sách lịch hẹn` | 22 |
| 2 | `src/app/(admin)/admin/components/page.tsx` | `UI Components` | 23 |
| 3 | `src/app/(admin)/admin/messages/page.tsx` | `Tin nhắn` | 4 |
| 4 | `src/app/(admin)/admin/notifications/page.tsx` | `Thông báo` | 4 |
| 5 | `src/app/(admin)/admin/services/page.tsx` | `Danh sách dịch vụ` | 47 |
| 6 | `src/app/(admin)/admin/services/skills/page.tsx` | `Danh sách kỹ năng` | 34 |
| 7 | `src/app/(admin)/admin/staff/page.tsx` | `Danh sách nhân viên` | 49 |
| 8 | `src/app/(admin)/admin/staff/permissions/page.tsx` | `Phân quyền nhân sự` | 13 |
| 9 | `src/app/(admin)/admin/staff/schedule/page.tsx` | `Lịch làm việc` | 13 |

## 3. Đánh Giá & Đề Xuất
- **Vấn đề:** Các thẻ `<h1>` này chiếm diện tích và có thể không đồng bộ với thiết kế mới (nếu Header đã đảm nhiệm vai trò hiển thị tiêu đề).
- **Giải pháp:**
  - **Đối với các trang danh sách (List Pages):** Thay thế thẻ `<h1>` bằng thanh công cụ chứa ô tìm kiếm (Search) và bộ lọc (Filter) để tối ưu hóa trải nghiệm người dùng. Áp dụng cho: `appointments`, `services`, `skills`, `staff`, `schedule`, `messages`, `notifications`.
  - **Đối với các trang khác:** Xóa bỏ hoàn toàn thẻ `<h1>` nếu không cần thiết.
- **Lưu ý:** Kiểm tra xem việc xóa `<h1>` có ảnh hưởng đến cấu trúc Flexbox/Grid của trang không (ví dụ: nếu `<h1>` nằm trong `justify-between` thì cần xóa cả thẻ cha hoặc điều chỉnh lại).

## 4. Kế Hoạch Hành Động
Để thực hiện việc xóa bỏ này, vui lòng chạy workflow `/frontend-refactor` và cung cấp đường dẫn file báo cáo này:
`docs/reports/027-frontend-review-admin-h1.md`
