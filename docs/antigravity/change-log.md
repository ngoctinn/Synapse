# Nhãn ký Thay đổi (Change Log) - Synapse UX Refactor

## [2025-12-22] Slice 1: Core Layout & Navigation
### Core Changes:
- **Refactor**: Di chuyển `BREADCRUMB_MAP` thành hằng số dùng chung trong `features/admin/constants.ts`.
- **UI Enhancement**: Phân nhóm menu `SIDEBAR_GROUPS` trong `constants.ts` và cập nhật `AdminSidebar` để hiển thị tiêu đề nhóm.
- **UX Fix**: Thêm nút "Đặt lịch ngay" vào `ServiceCard` trên landing page, xóa bỏ điểm cụt điều hướng.

### Files Modified:
- `frontend/src/features/admin/constants.ts`
- `frontend/src/features/admin/components/header.tsx`
- `frontend/src/features/admin/components/sidebar.tsx`
- `frontend/src/features/landing-page/components/service-card.tsx`

### Verification Results:
- `pnpm lint`: Pass (0 errors, 0 warnings after fix).
- Visual check: Sidebar groups rendered correctly, Breadcrumbs mapped for all admin sub-routes.

## [2025-12-22] Slice 2: Receptionist Dashboard (Premium)
### Core Changes:
- **New Feature**: Triển khai `OperationalDashboard` hoàn chỉnh thay thế placeholder.
- **Components**:- Admin Sidebar: Nhóm navigation, thêm icons chuyên nghiệp.
- StatsCards, RecentAppointments, OperationalStatus: Dashboard lễ tân.
- BottomNav: Điều hướng mobile.
- Worker Workspace: Trang làm việc tập trung cho KTV.
- TreatmentSheet: Hỗ trợ chỉnh sửa ghi chú chuyên môn.
- 5-Step Booking Flow: Mở rộng luồng đặt lịch, thêm bước Summary.
- SummaryStep: Component tóm tắt đơn hàng/lịch hẹn.
- **UI Architecture**: Tổ chức kiến trúc component theo hướng module hóa tại `features/admin/components/dashboard`.

### Files Modified:
- `frontend/src/app/admin/dashboard/page.tsx`
- `frontend/src/features/admin/components/dashboard/stats-cards.tsx`
- `frontend/src/features/admin/components/dashboard/recent-appointments.tsx`
- `frontend/src/features/admin/components/dashboard/operational-status.tsx`

### Verification Results:
- `pnpm lint`: Pass (0 errors, 0 warnings after fix).

## [2025-12-22] Slice 3: Admin UI/UX & Data Sync Refactor
### Core Changes:
- **Architecture**: Triển khai `useNotificationStore` (Zustand) để quản lý thông báo tập trung, thay thế dữ liệu tĩnh.
- **Dynamic Routing**: Tự động hóa `BREADCRUMB_MAP` bằng hàm `getBreadcrumbTitle`, hỗ trợ suy luận từ slug cho các route mới.
- **UX Excellence**:
    - Thêm `Skeleton` loading trong `AdminHeader` cho thông tin người dùng.
    - Đồng bộ hóa path `customer-info` giúp Breadcrumb nhất quán với logic Booking Wizard.
- **Stability**: Sửa lỗi `react-hooks/set-state-in-effect` (cascading render) trong `treatment-sheet.tsx` bằng pattern **Adjusting state during rendering**.

### Files Modified:
- `frontend/src/features/admin/constants.ts`
- `frontend/src/features/admin/components/header.tsx`
- `frontend/src/features/notifications/hooks/use-notification-store.ts`
- `frontend/src/features/notifications/components/notification-popover.tsx`
- `frontend/src/features/treatments/components/treatment-sheet.tsx`
- `frontend/src/app/admin/layout.tsx`

### Verification Results:
- `pnpm lint`: ✅ Pass (Exit code 0).
- `pnpm build`: ✅ Ready.

## [2025-12-22] Slice 4: Auth UX Refactor
### Core Changes:
- **UX Fix**: Triển khai **Inline Errors** cho `LoginForm` và `RegisterForm`. Lỗi từ server (validation) giờ đây được đẩy ngược vào form state thông qua `setError`.
- **UX Enhancement**:
    - Thay đổi giao diện sau khi đăng ký thành công: hiển thị Success View hướng dẫn kiểm tra email thay vì redirect ngay lập tức.
    - Sửa lỗi typo thông báo thành công trong `LoginForm`.
- **System Stability**: Đảm bảo an toàn luồng xác thực email theo yêu cầu nghiệp vụ.

### Files Modified:
- `frontend/src/features/auth/components/register-form.tsx`
- `frontend/src/features/auth/components/login-form.tsx`

### Verification Results:
- `pnpm lint`: ✅ Pass (Exit code 0).
