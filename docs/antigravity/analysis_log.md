# Nhật ký Phân tích Antigravity - Slice 1: Core Layout & Navigation

## Phân tích Tác động (Impact Analysis)
- **Hệ thống Breadcrumb**: Việc di chuyển `BREADCRUMB_MAP` từ `AdminHeader` sang một file hằng số dùng chung sẽ giúp dễ dàng bảo trì và mở rộng cho các phân hệ khác (như Worker Workspace).
- **AdminSidebar**: Thay đổi cấu trúc menu và icon sẽ cải thiện tính thẩm mỹ "Premium". Cần đảm bảo tính responsive khi co giãn (collapsible).
- **Landing CTA**: Thêm nút đặt lịch vào `ServiceCard` ảnh hưởng đến layout trang chủ. Cần đảm bảo nút nổi bật nhưng không làm hỏng tính cân đối của thẻ.

## Rủi ro & Giải pháp
- **Rủi ro**: Lỗi import khi di chuyển hằng số.
- **Giải pháp**: Kiểm tra kỹ các đường dẫn import sau khi di chuyển.
- **Rủi ro**: Nút "Đặt lịch" có thể bị tràn text trên mobile.
- **Giải pháp**: Sử dụng flex-col/row linh hoạt dựa trên screen size.

## Ghi chú Thực thi
- Di chuyển `BREADCRUMB_MAP` vào `frontend/src/features/admin/constants.ts`.
- Cập nhật `lucide-react` icons cho Sidebar để trông chuyên nghiệp hơn.
- Link nút "Đặt lịch" trực tiếp vào `/booking` router.

## [2025-12-22] Slice 2: Receptionist Dashboard (Premium)
### Phân tích Tác động
- **app/admin/dashboard/page.tsx**: Trang hiện tại là placeholder trống. Thay thế bằng một trung tâm điều hành thực thụ.
- **Dữ liệu Mock**: Cần cấu trúc dữ liệu mock phản ánh chính xác nghiệp vụ Spa (số giường, số kỹ thuật viên rảnh, doanh thu hôm nay).

### Rủi ro & Giải pháp
- **Rủi ro**: Grid layout bị vỡ trên màn hình nhỏ.
- **Giải pháp**: Sử dụng các cột linh hoạt (1/2/4 cột tùy screen size).
- **Rủi ro**: Dashboard quá nhiều thông tin gây nhiễu.
- **Giải pháp**: Nhóm thông tin vào các `Card` rõ ràng và sử dụng `Tabs` nếu cần.

## [2025-12-22] Slice 3: Worker Workspace (Mobile First)
### Phân tích Tác động
- **Route Mới (`/admin/workspace`)**: Tạo không gian làm việc tập trung cho KTV, tách biệt với dashboard quản lý của lễ tân.
- **Mobile Navigation**: Cần một thanh điều hướng dưới (Bottom Nav) cho thiết bị di động để tối ưu thao tác bằng một tay.
- **TreatmentSheet**: Nâng cấp từ "chỉ đọc" sang "có thể chỉnh sửa" ghi chú chuyên môn.

### Rủi ro & Giải pháp
- **Rủi ro**: Trùng lặp code với dashboard admin hiện tại.
- **Giải pháp**: Tái sử dụng các component dùng chung (Avatar, Badge, Calendar) nhưng tùy chỉnh layout.
- **Rủi ro**: Thao tác ghi chú trên mobile khó khăn nếu form quá phức tạp.
- **Giải pháp**: Sử dụng Drawer hoặc Full-screen Dialog với các phím tắt nhanh/gợi ý.
