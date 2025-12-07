---
description: Quy trình kiểm tra này giúp đảm bảo giao diện không chỉ đẹp và responsive mà còn dễ truy cập, xử lý lỗi tốt và mang lại trải nghiệm người dùng trọn vẹn.
---

1. Kiểm tra Tính thẩm mỹ & Sự đồng bộ ("Aesthetic & Consistency")
[ ] Bảng màu & Theme:

Sử dụng biến CSS/Tailwind config (text-primary, bg-muted) thay vì mã hex cứng.

Dark Mode: Kiểm tra giao diện khi chuyển sang chế độ tối (đặc biệt là màu viền border và độ tương phản của nền).

[ ] Typography: Xác minh phân cấp (H1 -> H6, p, small). Đảm bảo độ tương phản màu chữ đạt chuẩn dễ đọc.

[ ] Component Consistency: Sử dụng lại các component trong @/shared/ui/*, hạn chế tạo mới nếu không cần thiết.

[ ] Cảm giác "Premium":

Hiệu ứng chuyển đổi mượt mà (transition-all duration-200).

Icon có ý nghĩa (Lucide React), kích thước đồng bộ.

Khoảng trắng (Spacing) rộng rãi, tuân thủ hệ thống lưới (4px/8px rule - p-4, gap-4).

2. Kiểm tra Độ tương thích ("Responsive & Thân thiện")
[ ] Mobile First:

Bố cục xếp chồng (stack) đúng trên màn hình < 640px.

Touch Targets: Các nút bấm/liên kết tối thiểu 44x44px.

Font Size: Input text size tối thiểu 16px (tránh lỗi auto-zoom trên iOS).

[ ] Tablet/Desktop:

Layout mở rộng hợp lý, không bị kéo giãn quá mức (dùng max-w-* cho container).

[ ] Xử lý tràn (Overflow):

Không có thanh cuộn ngang (horizontal scroll) ngoài ý muốn.

Nội dung dài (tên dài, bảng dữ liệu) được xử lý bằng truncate hoặc overflow-auto.

3. Kiểm tra Tính toàn vẹn & Trạng thái hệ thống ("System States")
[ ] An toàn dữ liệu:

Tránh dùng hidden cho dữ liệu quan trọng trên mobile (dùng thiết kế thay thế).

Các hành động hủy/xóa phải có Confirm Dialog.

[ ] Các trạng thái UI (UI States):

Loading: Hiển thị Skeleton hoặc Spinner khi đang tải dữ liệu.

Empty State: Giao diện thân thiện khi danh sách trống (kèm nút kêu gọi hành động nếu cần).

Error State: Hiển thị thông báo lỗi rõ ràng khi API thất bại (kèm nút "Thử lại/Retry").

[ ] Phản hồi người dùng (Feedback):

Hiển thị thông báo (Toast notification) khi thao tác thành công hoặc thất bại.

4. Kiểm tra Khả năng truy cập ("Accessibility - a11y")
[ ] Điều hướng bàn phím: Có thể dùng phím Tab để di chuyển qua các input/button theo thứ tự logic không?

[ ] Focus Indicator: Có hiển thị vòng sáng (ring) rõ ràng khi đang focus vào một phần tử không?

[ ] Form Label: Mọi ô input đều có nhãn (label) hoặc aria-label rõ ràng.

5. Quy trình thực hiện (Workflow Review)
Analyze: Tìm các style bị hardcode, kích thước cố định (w-[500px]), hoặc thiếu trạng thái loading/error.

Refactor: Chuyển sang Tailwind classes responsive (sm:, lg:), thêm xử lý dark mode (dark:bg-slate-900).

Verify:

Giả lập mobile viewport.

Test tab order (bàn phím).

Test tắt mạng/API lỗi để xem Error State.

Polish: Thêm hover, focus ring, transition và animation nhẹ nhàng.