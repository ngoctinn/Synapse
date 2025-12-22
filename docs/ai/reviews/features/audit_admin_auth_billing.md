# UI/UX Audit Report: Admin, Auth & Billing

## 1. Admin Feature
**Files audited:** `admin/components/header.tsx`, `admin/components/sidebar.tsx`

### Observations:
- **Breadcrumb Logic:** The `AdminHeader` manually splits the pathname and maps it using `BREADCRUMB_MAP`.
- **Notification Integration:** Uses `NotificationPopover` directly in the header.
- **Layout:** Uses `SidebarTrigger` and `Separator` for a standard dashboard feel.

### Critical Questions:
- **Vì sao** logic Breadcrumb lại được hardcode trong `BREADCRUMB_MAP` thay vì lấy từ cấu hình route tập trung? Nếu thêm route mới mà quên update map này thì UI sẽ hiển thị slug thô (ví dụ: "user-management" thay vì "Quản lý người dùng").
- **Vì sao** `unreadCount` trong `NotificationBell` lại được hardcode là `3`? Đây là dữ liệu tĩnh hay chưa được kết nối với API thực tế?
- **Vì sao** không có trạng thái "Loading" cho thông tin User trong Header? Nếu API chậm, Avatar và Tên sẽ bị trống hoặc hiển thị fallback "Admin" gây nhầm lẫn.

---

## 2. Auth Feature
**Files audited:** `auth/components/login-form.tsx`, `auth/components/register-form.tsx`

### Observations:
- **UX Flow:** Sử dụng `useActionState` để quản lý form state và `showToast` để thông báo kết quả.
- **Visuals:** Có hiệu ứng `animate-fade-in` khi mount form.
- **Security UX:** Có tính năng toggle ẩn/hiện mật khẩu.

### Critical Questions:
- **Vì sao** trong `RegisterForm`, khi đăng ký thành công lại redirect về `/login?registered=true` thay vì tự động đăng nhập luôn? Việc bắt người dùng nhập lại thông tin vừa đăng ký là một bước cản (friction) trong UX.
- **Vì sao** không có tính năng "Social Login" (Google, Facebook)? Đối với một hệ thống hiện đại, việc chỉ có email/password có thể làm giảm tỷ lệ chuyển đổi người dùng mới.
- **Vì sao** thông báo lỗi từ `registerAction` lại được hiển thị qua Toast thay vì hiển thị trực tiếp dưới field tương ứng (inline error) nếu đó là lỗi validation từ server?

---

## 3. Billing Feature
**Files audited:** `billing/components/billing-page.tsx`, `billing/components/invoice-table.tsx`

### Observations:
- **Data Fetching:** Sử dụng `useTransition` và `useEffect` để load dữ liệu thủ công thay vì dùng React Query hoặc SWR.
- **Layout:** Sử dụng `grid-cols-4` cho metrics cards, có thể bị quá chật trên màn hình tablet hoặc laptop nhỏ.

### Critical Questions:
- **Vì sao** logic load dữ liệu lại lặp lại trong `loadData` và `handleUpdate`? Việc gọi `getInvoices` và `getBillingMetrics` ở nhiều nơi mà không có cơ chế cache sẽ gây thừa thãi request.
- **Vì sao** số tiền (currency) được format trực tiếp trong component bằng `Intl.NumberFormat` thay vì dùng một shared utility? Nếu sau này muốn đổi sang đơn vị tiền tệ khác hoặc đổi format, bạn sẽ phải sửa ở rất nhiều file.
- **Vì sao** `InvoiceTable` không có tính năng lọc (filter) theo trạng thái (Paid, Pending, Overdue)? Khi số lượng hóa đơn lớn, việc tìm kiếm sẽ rất khó khăn.
