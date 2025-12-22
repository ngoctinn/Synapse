# Analysis Log - Admin Feature UI/UX Audit

## Tài liệu Phân tích
- File liên quan: `frontend/src/features/admin/components/header.tsx`
- Layout: `frontend/src/app/admin/layout.tsx`
- Constants: `frontend/src/features/admin/constants.ts`

## Phát hiện chính

### 1. Breadcrumb Logic
- Hiện tại: `AdminHeader` cắt `pathname` và map qua `BREADCRUMB_MAP` (cấu trúc `Record<string, string>`).
- Vấn đề: `BREADCRUMB_MAP` đang được hardcode độc lập với `SIDEBAR_GROUPS`.
- Đề xuất: Tự động hóa việc tạo map này từ `SIDEBAR_GROUPS` để đảm bảo tính nhất quán.

### 2. Notification System
- Hiện tại: `NotificationBell` nhận `unreadCount={3}` (hardcoded).
- Vấn đề: Chưa có store hoặc realtime connection để lấy số lượng thông báo thực tế.
- Đề xuất: Tìm kiếm hoặc khởi tạo một `useNotifications` hook để fetch dữ liệu từ Supabase hoặc API.

### 3. User Header Profile
- Hiện tại: Dữ liệu được fetch tại `AdminLayout` (Server Component) và truyền xuống qua prop `user`.
- Vấn đề: Nếu fetch server chậm, toàn bộ layout sẽ bị chặn (vì await). Nếu không có Skeleton, UI sẽ bị giật khi hydration.
- Đề xuất: Thêm `Skeleton` loading state cho Avatar và Tên người dùng.

## Dependencies & Phụ thuộc
- `shared/ui`: Cần `Skeleton`, `Avatar`, `Breadcrumb`.
- `features/notifications`: Cần cập nhật logic fetch unread count.
- `features/auth`: Cung cấp thông tin `user`.
