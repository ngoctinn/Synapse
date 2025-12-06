---
description: Đánh giá layout hiện tại của một component, phân tích mã nguồn liên quan và đề xuất cải thiện dựa trên UX Guidelines.
---

# Quy Trình Đánh Giá Layout Component

## Bước 1: Thu Thập Thông Tin Component

1. Yêu cầu người dùng cung cấp đường dẫn component cần đánh giá (nếu chưa rõ).
2. Đọc nội dung component bằng `view_file`.
3. Xác định các dependencies và components con được sử dụng.

## Bước 2: Grep Mã Nguồn Liên Quan

1. **Tìm kiếm CSS/Styling liên quan:**
   ```bash
   grep -r "className" <component_path>
   ```
2. **Tìm parent components sử dụng component này:**
   ```bash
   grep -r "<ComponentName" src/
   ```
3. **Tìm các biến CSS/Theme token được sử dụng:**
   ```bash
   grep -rE "(var\(--[^)]+\)|bg-|text-|p-|m-|flex|grid)" <component_path>
   ```
4. Đọc file `globals.css` để hiểu design tokens hiện tại.

## Bước 3: Phân Tích Layout Theo UX Guidelines

Đánh giá component theo các tiêu chí từ `ux-guidelines.csv`:

### 3.1. Layout Issues (Rows 15-21)
- [ ] **Z-Index Management**: Có sử dụng z-index không? Có tuân thủ scale chuẩn (10, 20, 30, 50)?
- [ ] **Overflow Hidden**: Có content bị clip không mong muốn?
- [ ] **Fixed Positioning**: Có elements fixed chồng lấn lên nhau?
- [ ] **Content Jumping**: Có CLS (Cumulative Layout Shift) khi load content?
- [ ] **Container Width**: Text có quá rộng không? (max 65-75ch)

### 3.2. Touch & Interaction (Rows 22-35)
- [ ] **Touch Target Size**: Các button/link có đủ lớn không? (min 44x44px)
- [ ] **Touch Spacing**: Khoảng cách giữa các touchable elements? (min 8px)
- [ ] **Focus States**: Có focus ring cho keyboard navigation?
- [ ] **Hover States**: Có visual feedback khi hover?
- [ ] **Active States**: Có feedback khi press/click?
- [ ] **Disabled States**: Có phân biệt rõ disabled vs enabled?

### 3.3. Accessibility (Rows 36-45)
- [ ] **Color Contrast**: Text có đủ contrast ratio? (min 4.5:1)
- [ ] **ARIA Labels**: Icon buttons có aria-label?
- [ ] **Keyboard Navigation**: Tab order hợp lý?
- [ ] **Form Labels**: Inputs có labels đi kèm?

### 3.4. Responsive (Rows 64-71)
- [ ] **Mobile First**: Có sử dụng mobile-first breakpoints?
- [ ] **Readable Font Size**: Font size đủ lớn trên mobile? (min 16px)
- [ ] **Horizontal Scroll**: Content có overflow ngang?
- [ ] **Image Scaling**: Images có scale đúng với container?

### 3.5. Typography (Rows 72-77)
- [ ] **Line Height**: Body text có line-height 1.5-1.75?
- [ ] **Line Length**: Có giới hạn characters/line?
- [ ] **Heading Clarity**: Headings có phân biệt rõ với body?

### 3.6. Animation (Rows 7-14)
- [ ] **Excessive Motion**: Có quá nhiều animations?
- [ ] **Duration Timing**: Animation timing hợp lý? (150-300ms)
- [ ] **Reduced Motion**: Có check prefers-reduced-motion?

## Bước 4: Tổng Hợp Báo Cáo

Tạo báo cáo với format:

```markdown
# Báo Cáo Đánh Giá Layout: [Component Name]

## 1. Tổng Quan Component
- Đường dẫn: `path/to/component.tsx`
- Chức năng: [Mô tả ngắn]
- Dependencies: [Danh sách components con]

## 2. Các Vấn Đề Phát Hiện

### Mức Độ Nghiêm Trọng Cao
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|--------|--------|-------|-----------|

### Mức Độ Nghiêm Trọng Trung Bình
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|--------|--------|-------|-----------|

### Mức Độ Thấp (Khuyến Nghị)
| Vấn Đề | Vị Trí | Mô Tả | Giải Pháp |
|--------|--------|-------|-----------|

## 3. Đề Xuất Cải Thiện Chi Tiết
[Code snippets cụ thể cho từng vấn đề]

## 4. Checklist Sau Khi Sửa
- [ ] Item 1
- [ ] Item 2
```

## Bước 5: Xác Nhận Với Người Dùng

1. Trình bày báo cáo cho người dùng.
2. Hỏi người dùng muốn:
   - Áp dụng tất cả các sửa đổi?
   - Chọn lọc từng sửa đổi cụ thể?
   - Yêu cầu giải thích thêm về vấn đề nào?

## Bước 6: Thực Hiện Sửa Đổi (Nếu Được Phê Duyệt)

1. Thực hiện từng thay đổi theo thứ tự ưu tiên (High → Medium → Low).
2. Sau mỗi thay đổi, verify build không bị lỗi:
   ```bash
   // turbo
   pnpm run build --filter=frontend
   ```
3. Cập nhật báo cáo với trạng thái hoàn thành.

---

## Tham Chiếu Nhanh: UX Guidelines Severity

| Severity | Ưu Tiên | Hành Động |
|----------|---------|-----------|
| **High** | Bắt buộc sửa | Ảnh hưởng UX/A11y nghiêm trọng |
| **Medium** | Nên sửa | Cải thiện trải nghiệm đáng kể |
| **Low** | Tùy chọn | Polish/Enhancement |

## Files Tham Chiếu

- UX Guidelines: `.shared/ui-ux-pro-max/data/ux-guidelines.csv`
- Theme Tokens: `frontend/src/app/globals.css`
- Shadcn Components: `frontend/src/shared/ui/`
