# Báo Cáo Đánh Giá Layout: AppointmentDetailDialog

## 1. Tổng Quan Component
- **Đường dẫn**: `src/features/appointments/components/appointment-detail-dialog.tsx`
- **Chức năng**: Hiển thị thông tin chi tiết về một cuộc hẹn, bao gồm trạng thái, thông tin khách hàng, thời gian, dịch vụ, và nhân viên thực hiện. Cung cấp các hành động như "Hủy hẹn" và "Chỉnh sửa".
- **Dependencies**:
    - `shadcn/ui`: `Dialog`, `Button`, `Badge`, `Avatar`.
    - `lucide-react`: `User`, `Calendar`, `Clock`, `Edit`, `FileText`.
    - `date-fns`: Định dạng ngày giờ.

## 2. Các Vấn Đề Phát Hiện

### Mức Độ Nghiêm Trọng Cao (High Severity)
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|---|---|---|---|
| **Mobile Responsiveness** | `DialogContent` | Trên mobile, dialog có thể bị kẹt hoặc khó thao tác nếu nội dung dài. | Thêm `max-h-[90vh] overflow-y-auto` vào `DialogContent` để đảm bảo có thể cuộn trên màn hình nhỏ. |
| **Touch Target Size** | `Button` (Edit/Cancel) | Các nút hành động có thể hơi nhỏ trên mobile. | Đảm bảo nút có chiều cao tối thiểu 44px hoặc padding đủ lớn trên mobile. Các nút hiện tại là mặc định `h-10` (40px) của shadcn, có thể chấp nhận được nhưng nên kiểm tra kỹ. |

### Mức Độ Nghiêm Trọng Trung Bình (Medium Severity)
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|---|---|---|---|
| **Hardcoded Colors** | `statusMap` | Các class màu sắc (`bg-amber-100`, `text-amber-800`, v.v.) được hardcode thay vì dùng biến theme (`--status-pending`, etc.) hoặc token ngữ nghĩa. | Thay thế bằng các biến CSS `var(--status-...)` đã định nghĩa trong `globals.css` để nhất quán với `AppointmentCard`. |
| **Icon Scalability** | `User`, `Calendar`, `FileText` Icons | Container của icon dùng fixed size (ví dụ: `p-2`), có thể không scale tốt nếu kích thước font hệ thống thay đổi. | Sử dụng các đơn vị `em` hoặc `rem` cho container và đảm bảo `flex-shrink-0` để tránh icon bị bóp méo. |

### Mức Độ Thấp (Low Severity) (Khuyến Nghị)
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|---|---|---|---|
| **Typography Hierarchy** | `DialogTitle` | Tiêu đề "Chi tiết lịch hẹn" và Badge trạng thái đang cùng hàng, có thể gây chật chội trên mobile. | Cân nhắc stack dọc trên mobile hoặc điều chỉnh layout flex. |
| **Empty States** | Resource/Notes | Xử lý hiển thị "Chưa phân công" là tốt. Tuy nhiên, nếu notes trống, section notes ẩn đi là hợp lý, nhưng cần đảm bảo layout không bị "nhảy" (layout shift) nếu dữ liệu load chậm (hiện tại load sync nên không sao). | Giữ nguyên logic hiện tại là tốt cho static mock data. |

## 3. Đề Xuất Cải Thiện Chi Tiết

### 3.1. Cập nhật `statusMap` sử dụng CSS Variables
Sử dụng lại các biến CSS đã định nghĩa trong `globals.css` cho `AppointmentCard` để đảm bảo đồng bộ màu sắc.

```tsx
// Thay vì hardcode Tailwind classes:
// bg-amber-100 text-amber-800 ...
// Sử dụng style inline hoặc cấu hình tailwind config (nếu có plugin) để map vào biến CSS.
// Cách tiếp cận clean nhất hiện tại với codebase này là dùng class tiện ích Tailwind trỏ vào biến CSS (nếu đã config) hoặc style prop.
// Tuy nhiên, globals.css đã define: --status-pending: oklch(...)
// Ta có thể dùng utility classes arbitrary values:
// bg-[var(--status-pending)] text-[var(--status-pending-foreground)] border-[var(--status-pending-border)]
```

### 3.2. Cải thiện Responsive cho DialogContent
```tsx
<DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
    {/* ... */}
</DialogContent>
```

### 3.3. Tăng cường ngữ nghĩa và cấu trúc
Đảm bảo các vùng thông tin được phân tách rõ ràng hơn về mặt thị giác, có thể thêm `Separator` mờ giữa các row nếu cần thiết, hoặc tăng khoảng cách `gap`.

## 4. Checklist Sau Khi Sửa
- [ ] Dialog hiển thị tốt trên mobile devices (iPhone SE/14 Pro).
- [ ] Màu sắc trạng thái khớp 100% với Appointment Card.
- [ ] Các nút bấm dễ dàng thao tác bằng ngón tay.
- [ ] Không có lỗi layout shift khi mở dialog.
