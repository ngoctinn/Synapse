
# Báo cáo Đánh giá Thiết kế: Year View Dimming & Filter Synchronization

**Ngày**: 2025-12-06
**Người thực hiện**: Antigravity (AI Assistant)
**Mục tiêu**: Đánh giá và tinh chỉnh hiệu ứng làm mờ (dimming) trên Lưới Năm (Year View) để đảm bảo tính đồng bộ thẩm mỹ, thân thiện và phản hồi chính xác với các bộ lọc trong `ExceptionsFilterBar`.

---

## 1. Phân tích Hiện trạng

### Bối cảnh
Người dùng mong muốn một trải nghiệm trực quan khi sử dụng bộ lọc:
- Các ngày **thỏa mãn** bộ lọc (Exceptions) phải nổi bật.
- Các ngày **không thỏa mãn** (Exceptions bị lọc ỏ) phải bị làm mờ đi nhưng vẫn giữ ngữ cảnh (người dùng biết đó là ngoại lệ nhưng không thuộc tiêu chí đang tìm).

### Triển khai Hiện tại (`YearViewGrid`)
- Component đã có logic `matchedDateKeys` để phân biệt.
- **Styling hiện tại**:
  ```tsx
  bgClass = `${styles.bg} ${styles.text} opacity-20 grayscale scale-90 hover:opacity-100 hover:grayscale-0 hover:scale-100 transition-all duration-300`;
  ```
- **Vấn đề tiềm ẩn**:
  - `opacity-20`: Độ mờ 20% có thể là quá thấp (80% trong suốt), khiến các khối màu nhạt (như `bg-red-500/10`) gần như biến mất trên nền trắng. Điều này làm giảm khả năng nhận diện "đây là một ngoại lệ bị ẩn".
  - `grayscale`: Chuyển sang thang xám là hợp lý để loại bỏ ý nghĩa ngữ nghĩa (màu đỏ = đóng, màu xanh = mở) khi không active.
  - `scale-90`: Tạo chiều sâu tốt.
  - **Cảm giác**: Có thể hơi "rời rạc" nếu độ tương phản giữa Active và Inactive quá lớn (một bên rực rỡ, một bên gần như vô hình).

---

## 2. Đề xuất Cải tiến (Premium UI)

Để đạt được sự "thân thiện" và "đồng bộ thẩm mỹ":

### 2.1. Tinh chỉnh Visual States
Thay vì làm biến mất (low opacity), ta sẽ biến chúng thành các yếu tố "nền" (background elements).

- **Opacity**: Tăng lên `opacity-50` hoặc `opacity-40`. Đủ để thấy màu sắc mờ nhạt nhưng không tranh chấp sự chú ý.
- **Saturation**: Sử dụng `grayscale` (hoặc `saturate-0`) để "tắt" màu sắc của chúng.
- **Background**: Có thể cân nhắc chuyển `bg` sang `bg-muted` (xám) để đồng nhất tất cả các loại ngoại lệ bị lọc, hoặc giữ màu gốc nhưng desature. Giữ màu gốc desaturated (xám hóa) tốt hơn vì nó giữ được độ đậm nhạt tương đối.

### 2.2. Hiệu ứng Tương tác (Micro-interactions)
- **Hover**: Khi hover vào một ngày bị dim, nó nên "sống lại" (full color, normal scale) để người dùng có thể inspect nhanh mà không cần bỏ lọc.
- **Transition**: `duration-300` là hơi chậm cho hover, có thể gây cảm giác lag. Đề xuất `duration-200` hoặc `ease-out`.

### 2.3. Logic Đồng bộ Filters
Đảm bảo rằng **TẤT CẢ** các bộ lọc từ `ExceptionsFilterBar` đều tác động:
- **Search**: Tìm kiếm theo tên/lý do -> Chỉ highlight ngày có lý do khớp.
- **Status**: Mở/Đóng -> Chỉ highlight trạng thái khớp.
- **Type**: Lễ/Bảo trì/Tùy chỉnh -> Chỉ highlight loại khớp.
- **Date Range**: Chỉ highlight trong khoảng ngày chọn (các ngày ngoài khoảng nhưng trong năm sẽ bị dim).

*(Logic này đã được verify là đúng trong `ExceptionsViewManager` -> `matchedDateKeys`)*

---

## 3. Implementation Plan

Refactor lại class string trong `YearViewGrid`:

**Cũ:**
`opacity-20 grayscale scale-90`

**Mới (Đề xuất):**
- Base: `opacity-30 grayscale saturate-0 scale-75` (Thu nhỏ hơn chút nữa để tạo khoảng cách rõ rệt).
- Hover: `hover:opacity-100 hover:grayscale-0 hover:saturate-100 hover:scale-100 hover:shadow-sm hover:z-10`.
- Thêm `transition-[transform,opacity,filter]` mượt mà.

Sử dụng `cn` (classnames) để merge sạch sẽ hơn.

---

## 4. Kết luận
Việc điều chỉnh này sẽ tạo ra một giao diện "Year View" sống động, nơi người dùng có cảm giác như đang "soi đèn" vào các dữ liệu quan tâm, trong khi các dữ liệu khác lùi về sau làm nền chứ không biến mất hoàn toàn.

---

## 5. Trạng thái Refactor

- [x] Tăng Opacity lên 40%.
- [x] Áp dụng Grayscale & Saturate-0.
- [x] Giảm Scale xuống 75%.
- [x] Thêm hiệu ứng Hover "Pop" (Shadow, Z-index, Scale 1, Full Color).
- [x] Clean code `YearViewGrid` (Type safety, remove unused props).
- [x] Xác nhận Logic Filters đồng bộ.

**Hoàn tất ngày 2025-12-06.**
