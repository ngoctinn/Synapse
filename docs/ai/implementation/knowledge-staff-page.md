# Knowledge: Staff Page Implementation (`admin/staff/page.tsx`)

## Tổng quan
Trang Quản lý Nhân viên (`/admin/staff`) là giao diện chính để quản trị viên xem danh sách nhân viên, thêm mới (mời) nhân viên và quản lý kỹ năng. Trang này sử dụng mô hình **Server Components** kết hợp với **Suspense** để tối ưu hóa hiệu suất tải trang.

## Chi tiết Triển khai

### 1. Data Fetching Strategy (Chiến lược lấy dữ liệu)
Trang sử dụng chiến lược **Parallel Fetching** (Lấy dữ liệu song song) để tránh "waterfall" (đợi request này xong mới gọi request kia).

```typescript
export default async function Page() {
  // 1. Khởi tạo các Promise song song
  const skillsPromise = getSkills()
  const staffListPromise = getStaffList()

  // 2. Await dữ liệu cần thiết ngay lập tức cho UI chính (nếu có)
  // Ở đây 'skills' cần cho InviteStaffModal nằm ngoài Suspense boundary của bảng
  const skills = await skillsPromise

  return (
    // ...
    <InviteStaffModal skills={skills} />

    <Suspense fallback={<StaffTableSkeleton />}>
      {/* 3. Truyền Promise xuống component con để nó tự await */}
      <StaffListWrapper
        staffListPromise={staffListPromise}
        skills={skills}
      />
    </Suspense>
    // ...
  )
}
```

### 2. Component Structure (Cấu trúc Component)

- **`Page` (Server Component)**:
    - Chịu trách nhiệm khởi tạo các request dữ liệu (`getSkills`, `getStaffList`).
    - Render layout chính.
    - Truyền dữ liệu `skills` cho `InviteStaffModal`.
    - Truyền `staffListPromise` cho `StaffListWrapper`.

- **`StaffListWrapper` (Server Component)**:
    - Nhận `staffListPromise` và `skills`.
    - Thực hiện `await staffListPromise` để lấy dữ liệu nhân viên.
    - Render `StaffTable` với dữ liệu đã có.
    - Đóng vai trò là boundary cho `Suspense` (vì nó là nơi xảy ra việc `await` dữ liệu chậm).

- **`InviteStaffModal` (Client Component)**:
    - Nhận danh sách `skills` để hiển thị trong form mời nhân viên (khi chọn vai trò Kỹ thuật viên).
    - Sử dụng `useActionState` để xử lý form submission.

### 3. Dependencies
- **Actions**:
    - `getSkills()`: Lấy danh sách kỹ năng từ backend.
    - `getStaffList()`: Lấy danh sách nhân viên (có phân trang).
- **Components**:
    - `StaffTable`: Hiển thị bảng dữ liệu.
    - `StaffTableSkeleton`: Loading state.
    - `InviteStaffModal`: Modal thêm nhân viên.

## Lý do thay đổi gần đây
Trước đây, `InviteStaffModal` bị thiếu prop `skills` do `Page` không fetch dữ liệu này. Việc sửa đổi bao gồm:
1. Chuyển `Page` thành `async`.
2. Fetch `skills` tại `Page`.
3. Refactor `StaffListWrapper` để nhận `promise` thay vì tự fetch, giữ nguyên tính chất song song của các request.

## Metadata
- **File**: `frontend/src/app/(admin)/admin/staff/page.tsx`
- **Updated**: 2025-12-02
- **Type**: Server Component, Data Fetching
