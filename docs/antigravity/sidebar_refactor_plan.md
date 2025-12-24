# Implementation Plan: Sidebar Refactor & UX Cleanup

## Vấn đề
- Sidebar hiện tại chứa các nhãn quá dài và chi tiết thừa trong dấu ngoặc (Ví dụ: "Làm việc (KTV)").
- Cách phân nhóm và đặt tên chưa tối ưu cho trải nghiệm "Premium UI".
- Trạng thái Collapsed chưa thực sự gọn gàng và tinh tế.

## Mục đích
- Làm sạch (Clean up) toàn bộ nhãn hiển thị, chỉ giữ lại từ khóa cốt lõi.
- Tinh chỉnh bố cục và chuyển động của Sidebar để đạt chuẩn Premium.
- Đảm bảo tính nhất quán (Consistency) giữa Sidebar và Breadcrumbs.

## Ràng buộc
- Sử dụng Shadcn UI Sidebar component.
- Không làm hỏng tính năng phân quyền (Permissions) nếu có.
- Ngôn ngữ: Tiếng Việt chuẩn.

## Chiến lược
1. **Refactor Constants**: Cập nhật lại `SIDEBAR_GROUPS` trong `constants.ts` với nhãn ngắn gọn nhất.
2. **Refactor UI**: Điều chỉnh `sidebar.tsx` và `sidebar-item.tsx` để tối ưu hóa khoảng cách và hiệu ứng.
3. **Logic Sync**: Đảm bảo `BREADCRUMB_MAP` cũng được cập nhật tương ứng.

## Giải pháp chi tiết
- "Làm việc (KTV)" -> "Làm việc"
- "Báo cáo (Quản lý)" -> "Báo cáo"
- "Hóa đơn & Billing" -> "Hóa đơn"
- "Đội ngũ nhân viên" -> "Nhân sự"
- "Liệu trình dịch vụ" -> "Liệu trình"
- "Gói dịch vụ" -> "Gói dịch vụ" (Giữ nguyên hoặc rút gọn thành "Gói")
- "Dịch vụ & Menu" -> "Dịch vụ"
- "Gói tài nguyên" -> "Tài nguyên"
- "Cài đặt chung" -> "Cài đặt"

## Các bước thực hiện
1. **ANALYZE**: Kiểm tra các component đang dựa vào titles hiện tại.
2. **DIFF**: Dự thảo các thay đổi cho `constants.ts` và `sidebar.tsx`.
3. **APPLY**: Thực hiện thay đổi.
4. **VERIFY**: Chạy lint và build.
