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
