# Kiến thức: Table Layout Shift (Dịch chuyển bố cục bảng)

## 1. Tổng quan
- **Vấn đề**: Các bảng (`ServiceTable`, `SkillTable`) bị dịch chuyển nhẹ sang trái hoặc mất căn chỉnh khi mới tải trang, sau đó trở lại bình thường.
- **Điểm nhập**:
  - `frontend/src/features/services/components/service-table.tsx`
  - `frontend/src/features/services/components/skill-table.tsx`
  - `frontend/src/features/staff/components/staff-list/staff-table.tsx`
- **Nguyên nhân chính**: Sử dụng `framer-motion` trực tiếp trên thẻ `tr` (`motion.tr`) với thuộc tính `transform` (`y: 10`).

## 2. Phân tích Chi tiết

### Logic hiện tại
```tsx
<motion.tr
  key={service.id}
  initial={{ opacity: 0, y: 10 }} // Gây ra vấn đề
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, delay: index * 0.05 }}
  className="..."
>
```

### Tại sao lỗi xảy ra?
1. **Cơ chế Render của Browser**: Thẻ `<tr>` (table-row) có hành vi hiển thị đặc biệt trong CSS. Nó không tuân theo mô hình hộp (box model) tiêu chuẩn như `block` hay `flex`.
2. **Xung đột Transform**: Khi `framer-motion` áp dụng `transform: translateY(10px)` lên `<tr>`, trình duyệt thường phải "nâng" (promote) row đó lên một layer riêng hoặc thay đổi `display` của nó để thực hiện animation.
3. **Mất ngữ cảnh Layout**: Trong quá trình animation (dù chỉ vài trăm ms), row có thể tạm thời mất liên kết chiều rộng với các cột (`<col>`) hoặc header của bảng, khiến nội dung bị co lại (thường là mất padding hoặc width), tạo ra hiệu ứng "dịch sang trái".

## 3. Giải pháp Đề xuất

### Cách 1: Chỉ animate Opacity (An toàn nhất)
Loại bỏ `y` khỏi animation, chỉ giữ lại `opacity`.
```tsx
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
```

### Cách 2: Animate nội dung bên trong (Phức tạp hơn)
Giữ `tr` bình thường, và animate các `div` bên trong `TableCell`.
```tsx
<TableRow>
  <TableCell>
    <motion.div initial={{ y: 10 }} animate={{ y: 0 }}>
      {content}
    </motion.div>
  </TableCell>
</TableRow>
```

### Cách 3: Sử dụng `layout` prop (Cần kiểm tra kỹ)
Thêm `layout` prop cho `motion.tr` có thể giúp Framer Motion tính toán lại, nhưng thường gây ra vấn đề hiệu năng trên bảng lớn.

## 4. Kết luận
Đây là một vấn đề kỹ thuật phổ biến khi kết hợp animation thư viện (như Framer Motion) với các phần tử bảng HTML thuần túy. Việc loại bỏ `transform` (y) trên `tr` là cách sửa lỗi nhanh và hiệu quả nhất.
