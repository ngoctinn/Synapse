# Báo Cáo Đánh Giá Layout: BookingDialog

## 1. Tổng Quan Component
- **Đường dẫn**: `frontend/src/features/customer-dashboard/components/booking-dialog.tsx`
- **Chức năng**: Dialog đặt lịch đa bước (Adaptive Wizard).
- **Dependencies**: React, Framer-motion, Shadcn UI (Dialog, Button, Calendar, ScrollArea, Avatar, Badge, RadioGroup), Lucide Icons.

## 2. Các Vấn Đề Phát Hiện

### Mức Độ Nghiêm Trọng Cao (Cần khắc phục ngay)
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|--------|--------|-------|-----------|
| **Bad UX Copy** | `Step: preference` | Cụm từ "Tối ưu (Khuyên dùng)" và mô tả "Hệ thống sẽ chọn... có nhiều khung giờ trống hơn" mang tính kỹ thuật và hướng về lợi ích của Spa thay vì khách hàng. | Đổi thành ngôn ngữ hướng khách hàng: "Linh hoạt (Nhanh nhất)" hoặc "Gợi ý cho bạn". Mô tả lợi ích trực tiếp: "Có nhiều lựa chọn giờ đẹp hơn". |
| **Logic Error** | `Render Logic` | Code kiểm tra `step !== "success"` ở cuối component để render footer buttons, nhưng TypeScript cảnh báo type không overlap nếu type narrowing quá chặt. | Kiểm tra lại type definition của `Step` và logic render có điều kiện. Ẩn toàn bộ footer khi `step === 'success'`. |

### Mức Độ Nghiêm Trọng Trung Bình
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|--------|--------|-------|-----------|
| **Hardcoded Colors** | `Step: time-select` | Sử dụng `bg-green-50`, `text-green-700` (Tailwind standard) thay vì Theme Tokens (`var(--alert-success)`, `var(--status-serving)`). | Chuyển sang dùng CSS variables trong `globals.css` để đảm bảo Dark Mode hoạt động đúng. Ví dụ: `bg-[var(--status-serving)]` hoặc `bg-primary/10`. |
| **Touch Target** | `Time Slot Button` | Button giờ hơi nhỏ (`h-9 text-xs`). Trên mobile có thể khó bấm. | Tăng lên `h-10 text-sm` trên mobile. |
| **Mobile Layout** | `DialogContent` | `sm:max-w-[425px]` là tốt cho Desktop, nhưng trên Mobile cần `w-full h-full` hoặc `max-h-[90vh]` để tránh overflow khi calendar mở rộng. | Thêm responsive styles cho `DialogContent`. |

### Mức Độ Thấp (Khuyến Nghị)
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|--------|--------|-------|-----------|
| **Animation** | `AnimatePresence` | Transition `x: 20` có thể hơi nhanh. | Tinh chỉnh `duration: 0.3` để mượt hơn. |
| **ScrollArea** | `staff-select` | Chiều cao cố định `300px` có thể bị cụt trên màn hình nhỏ. | Dùng `max-h-[50vh]` thay vì fixed height. |

## 3. Đề Xuất Cải Thiện Chi Tiết

### 3.1. Cải thiện UX Copy (High Priority)
```tsx
// Before
<span className="font-semibold block text-base">Tối ưu (Khuyên dùng)</span>
<span className="text-sm text-muted-foreground font-normal leading-snug block max-w-[200px] mx-auto">
  Hệ thống sẽ chọn chuyên gia phù hợp nhất và có nhiều khung giờ trống hơn.
</span>

// After
<span className="font-semibold block text-base">Linh hoạt (Được đề xuất)</span>
<span className="text-sm text-muted-foreground font-normal leading-snug block max-w-[200px] mx-auto">
  Dễ dàng chọn được khung giờ đẹp ưng ý mà không phải chờ đợi lâu.
</span>
```

### 3.2. Fix Colors & Dark Mode (Medium Priority)
Thay vì `bg-green-50 text-green-700`, sử dụng:
```tsx
className="... border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 ..."
```
Hoặc dùng token status đã định nghĩa:
```tsx
className="... border-[var(--status-serving-border)] bg-[var(--status-serving)] text-[var(--status-serving-foreground)] ..."
```

## 4. Checklist Sau Khi Sửa
- [ ] UX Copy đã thân thiện hơn với người dùng.
- [ ] Màu sắc sử dụng Theme Tokens (hỗ trợ Dark Mode).
- [ ] Touch targets dễ bấm trên Mobile.
- [ ] Footer ẩn đúng lúc ở màn hình Success.
