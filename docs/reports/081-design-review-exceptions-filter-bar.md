# Báo Cáo Đánh Giá Thiết Kế: Exceptions Filter Bar

**Ngày:** 06/12/2025
**Người thực hiện:** AI Assistant
**Phạm vi:** `frontend/src/features/settings/operating-hours/components/exceptions-filter-bar.tsx`

---

## 1. Phân Tích Hiện Trạng (Current State)

### 1.1. Cấu Trúc & Bố Cục (Layout & Structure)
- **Container**: Flexbox (`flex-col sm:flex-row`).
- **Phân bố**:
    - **Trái**: Search Input + Filter Button.
    - **Phải**: `endContent` (Nút thêm).
- **Vấn đề**:
    - **Unused Props**: Các prop `dateRange`, `setDateRange`, `filterUnit`, `setFilterUnit` được khai báo nhưng **không được sử dụng** trong JSX. Điều này gây nhiễu code và hiểu nhầm về trách nhiệm của component.
    - **Hidden Logic**: Bộ lọc "Loại thay đổi" (Type) và "Trạng thái" (Status) đều bị ẩn sau nút FilterButton. Người dùng phải mất 2 click để lọc theo "Ngày lễ" hoặc "Bảo trì" - những thao tác thường xuyên.

### 1.2. Chi Tiết Thành Phần (Component Details)
- **Search Input**: Tiêu chuẩn, chiếm diện tích tốt.
- **Filter Button**:
    - Sử dụng `FilterButton` từ `shared`.
    - Content bên trong: `Select` cho Status và `ToggleGroup` cho Type.
    - **Icons**: Sử dụng `PartyPopper`, `Settings2`, `Wrench`.
- **Aesthetics (Thẩm mỹ)**:
    - Giao diện sạch sẽ nhưng hơi "công nghiệp".
    - Thiếu tính "Friendly" (Thân thiện) do giấu hết các tùy chọn.

---

## 2. Đánh Giá Trải Nghiệm & Tính Đồng Bộ ("Friendly & Synchronous")

### 2.1. "Friendly" (Thân thiện)
- **Định nghĩa**: Dễ tiếp cận, giảm số lượng click, phản hồi trực quan.
- **Hiện tại**: Chưa thân thiện. Việc giấu `Type Filter` (Loại ngoại lệ) vào trong Popover làm giảm khả năng khám phá (discoverability) và tăng thao tác thừa.
- **Giải pháp**: Đưa các bộ lọc loại (Type) ra ngoài thanh công cụ chính dưới dạng **Toggle Group trực tiếp** hoặc **Segmented Control** giúp lọc nhanh 1 chạm.

### 2.2. "Synchronous" (Đồng bộ)
- **Định nghĩa**: Nhất quán với Design System và các Filter Bar khác trong hệ thống (Staff, Services).
- **Hiện tại**: Khá đồng bộ về style cơ bản nhưng thiếu các điểm nhấn "Premium" đã được đề xuất ở các báo cáo trước (ví dụ: Icon `SlidersHorizontal`, Active state glow).
- **Vấn đề mã nguồn**: Props thừa (`dateRange`) cho thấy sự thiếu đồng bộ giữa logic (`useExceptionViewLogic`) và hiển thị (`ExceptionsFilterBar`). Logic xử lý ngày tháng có vẻ đã được chuyển sang component hiển thị (Calendar/List) nhưng props vẫn còn rớt lại ở đây.

---

## 3. Đề Xuất Cải Tiến (Premium UI Proposal)

### 🎨 3.1. Layout Mới: "Hybrid Filter Bar"
Kết hợp giữa Quick Actions (bên ngoài) và Advanced Filters (bên trong Popover).

**Bố cục đề xuất:**
```
[Search Input] [ | ] [Holiday Icon] [Maintenance Icon] [Custom Icon] [ | ] [Filter Button (Status)] ....... [Add Button]
```

- **Nhóm 1 (Search)**: Giữ nguyên.
- **Nhóm 2 (Quick Types)**: Đưa `ToggleGroup` của Type ra ngoài.
    - Sử dụng `ToggleGroup` variant `outline` hoặc size `sm`.
    - Chỉ hiện Icon + Label ngắn gọn (hoặc Tooltip cho Icon).
    - Giúp người dùng nhanh chóng lọc "Chỉ xem ngày lễ" hay "Chỉ xem bảo trì".
- **Nhóm 3 (Filter Button)**: Chỉ chứa "Trạng thái" (Mở/Đóng) và các bộ lọc nâng cao khác (nếu có trong tương lai). Đổi icon thành `SlidersHorizontal`.

### ✨ 3.2. Visual Polish
- **Active States**: Khi một Type được chọn, button nên có background `primary/10` và border `primary` thay vì chỉ xám đậm.
- **Separators**: Thêm các đường phân cách (Vertical Divider) nhẹ giữa các nhóm Search, Type, và Filter Button để tạo nhịp điệu rõ ràng.
- **Badges**: Nếu giữ Filter Button, hiển thị Badge số lượng active filter đẹp hơn (ví dụ: chấm đỏ nhỏ hoặc số trong vòng tròn).

### 🛠 3.3. Refactor Code
- **Remove Unused Props**: Xóa `dateRange`, `filterUnit` khỏi interface Props để làm sạch code.
- **Move Logic**: Đưa JSX của `ToggleGroup` ra khỏi `FilterButton`.

---

## 4. Mockup Tham Chiếu

### Trước (Before)
```
[ Search... ] [ Filter (0) ▼ ] ------------------------ [ + Add ]
              | Type: Holiday, Custom... |
              | Status: Open/Closed      |
```

### Sau (After - Friendly Mode)
```
[ Search... ] | [ 🎉 ] [ 🛠️ ] [ ⚙️ ] | [ 🎚️ Status ▼ ] ------- [ + Add ]
```
*(Ghi chú: 🎉=Ngày lễ, 🛠️=Bảo trì, ⚙️=Tùy chỉnh, 🎚️=Filter Button)*

---

## 5. Kết Luận
Để đạt được mục tiêu "Thân thiện và Đồng bộ":
1.  **Friendly**: Phơi bày các tùy chọn lọc loại (Type) ra ngoài để thao tác nhanh.
2.  **Synchronous**: Dọn dẹp props thừa, đồng bộ style với hệ thống Premium, sử dụng icon chuẩn.

Báo cáo này là cơ sở để thực hiện Refactor trong bước tiếp theo.

---

## 6. Trạng Thái Thực Hiện (Implementation Status)
- [x] **Refactor ExceptionsFilterBar**: Đã xóa props thừa, cập nhật layout "Hybrid".
- [x] **Update ExceptionsViewManager**: Đã cập nhật props truyền vào.
- [x] **Visual Polish**: Đã thêm icon, separator, và style active state.
- [x] **Fix TypeScript & Components**:
    - Nâng cấp `FilterButton` (Shared) để hỗ trợ `label` và `icon` tùy chỉnh.
    - Sửa lỗi type không tương thích.
    - Tinh chỉnh logic hiển thị button "Start Over" (loại trừ Date Range).

**Trạng thái:** ✅ Đã hoàn thành (Completed)
