# Báo Cáo Đánh Giá Layout: Staff Feature (Permissions & Scheduling)

## 1. Tổng Quan Component
- **Đường dẫn**:
  - `frontend/src/features/staff/components/permissions/permission-matrix.tsx`
  - `frontend/src/features/staff/components/scheduling/staff-scheduler.tsx`
  - `frontend/src/features/staff/components/scheduling/schedule-grid.tsx`
- **Chức năng**: Quản lý phân quyền nhân viên và Lịch làm việc/Ca kíp.
- **Phạm vi**: Layout, Styling, UX, và Accessibility.

## 2. Các Vấn Đề Phát Hiện

### 🔴 Mức Độ Nghiêm Trọng Cao (High Severity)
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|--------|--------|-------|-----------|
| **Z-Index Inconsistency** | `PermissionMatrix`, `StaffScheduler`, `ScheduleGrid` | Sử dụng các giá trị z-index rời rạc (`z-10`, `z-20`, `z-30`, `z-40`) gHardcoded gây khó quản lý thứ tự xếp chồng. | Chuẩn hóa hệ thống Z-Index: <br> - Filter/Toolbar: `z-20` <br> - Table Header: `z-30` <br> - Sticky Columns: `z-30` <br> - Scroll Corner: `z-40` <br> - Dropdown/Modal: `z-50` |
| **Touch Target Size** | `StaffScheduler` (Toolbar) | Các nút điều hướng tuần (`h-8 w-8`) nhỏ hơn chuẩn tối thiểu 44px cho thiết bị cảm ứng. | Tăng size lên `h-9 w-9` hoặc `min-h-[44px] min-w-[44px]` touch target wrappers cho mobile. |
| **Manual Box Shadows** | `ScheduleGrid`, `PermissionMatrix` | Sử dụng shadow thủ công `shadow-[1px_0_0_0_rgba(0,0,0,0.05)]` thay vì token hệ thống. | Định nghĩa CSS Variable `--shadow-sticky` hoặc sử dụng class utility chuẩn nếu có. |

### 🟡 Mức Độ Nghiêm Trọng Trung Bình (Medium Severity)
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|--------|--------|-------|-----------|
| **Hardcoded Colors** | `ScheduleGrid` | Sử dụng màu hardcoded `bg-primary/5`, `bg-primary/[0.02]` thay vì CSS Variables. | Định nghĩa biến `--color-calendar-today`, `--color-calendar-weekend` để dễ thay đổi theme. |
| **Missing Aria Labels** | `PermissionMatrix` | Trạng thái Disabled (Lock icon) chưa có giải thích cho Screen Reader. | Thêm `title="Chức năng bị khóa"` và `aria-label` cho icon Lock. |
| **Sticky Header Variables** | `StaffScheduler` | Giá trị fallback cho biến CSS (`109px`, `57px`) đang hardcoded rải rác. | Đưa vào `globals.css` hoặc một constant config chung để đồng bộ. |

### 🟢 Mức Độ Thấp (Khuyến Nghị)
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|--------|--------|-------|-----------|
| **Clickable Area** | `PermissionMatrix` (Cells) | Vùng click của Checkbox chỉ giới hạn trong ô input `h-5 w-5`. | Mở rộng vùng click ra toàn bộ `TableCell` để thao tác dễ hơn. |
| **Consistent Spacing** | `StaffScheduler` | Padding và gap đôi khi không đồng nhất với hệ thống lưới 4px. | Review và chỉnh lại padding theo chuẩn `p-4`, `gap-4`. |

## 3. Đề Xuất Cải Thiện Chi Tiết

### 3.1. Z-Index & Sticky Standardization
```tsx
// Trong globals.css hoặc tailwind config
// z-sticky-toolbar: 20
// z-sticky-header: 30
// z-sticky-corner: 40
```

### 3.2. Improve Touch Targets (StaffScheduler)
```tsx
<Button
  variant="outline"
  size="icon"
  // Change h-8 w-8 -> h-9 w-9 or add min-h-[44px] for touch
  className="h-9 w-9 sm:h-8 sm:w-8"
  onClick={prevWeek}
>
  <ChevronLeft className="h-4 w-4" />
</Button>
```

### 3.3. Expand Checkbox Click Area (PermissionMatrix)
```tsx
<TableCell
  key={role.id}
  className="text-center p-0 cursor-pointer hover:bg-muted/10 transition-colors"
  onClick={() => handleToggle(module.id, role.id)} // Click cell to toggle
>
  <div className="flex justify-center items-center h-full w-full py-2 pointer-events-none">
    <Checkbox
      checked={...}
      className="pointer-events-auto"
    />
  </div>
</TableCell>
```

## 4. Checklist Thực Hiện
- [ ] Refactor Z-Index cho `PermissionMatrix`, `StaffScheduler`, `ScheduleGrid`.
- [ ] Thay thế manual shadows bằng CSS variables/utility.
- [ ] Tăng kích thước nút điều hướng trong `StaffScheduler`.
- [ ] Cải thiện vùng click cho `PermissionMatrix`.
- [ ] Extract hardcoded colors ra theme variables.
