# Báo Cáo Review Frontend: Thêm Icon Filter & Tối Ưu UX Danh Sách

**Ngày:** 02/12/2025
**Người thực hiện:** Antigravity
**Mục tiêu:** Đánh giá hiện trạng các trang danh sách và đề xuất giải pháp thêm tính năng lọc (Filter) chuẩn UX cao cấp.

## 1. Tổng Quan & Phạm Vi
- **Các trang bị ảnh hưởng:**
  - `admin/staff` (Nhân viên)
  - `admin/services` (Dịch vụ)
  - `admin/appointments` (Lịch hẹn)
  - `admin/notifications` (Thông báo)
  - `admin/messages` (Tin nhắn)
- **Thành phần liên quan:**
  - `SearchInput` (`src/shared/ui/custom/search-input.tsx`)
  - Layout tiêu đề trang (Toolbar).

## 2. Đánh Giá Hiện Trạng (Architecture & Code)

### 2.1. Tuân thủ FSD & Clean Code
- **Cấu trúc:** Các trang (`page.tsx`) hiện tại đang tuân thủ tốt mô hình "Thin Pages". Logic data fetching được tách biệt (dù vẫn nằm trong file page nhưng đã gọn).
- **Next.js 16:** Việc xử lý `searchParams` (awaiting promise) đã đúng chuẩn Next.js 15/16.
- **Tái sử dụng:** Component `SearchInput` đang được tái sử dụng tốt. Tuy nhiên, phần bao quanh (container của SearchInput và Action Button) đang bị lặp lại code ở mỗi trang.

### 2.2. Vấn đề UX/UI
- **Thiếu tính năng lọc:** Hiện tại chỉ có tìm kiếm theo từ khóa (Search). Người dùng không thể lọc theo Trạng thái (Hoạt động/Ẩn), Vai trò (Staff), hay Khoảng giá (Services).
- **Không gian lãng phí:** Thanh toolbar còn nhiều khoảng trống, có thể tận dụng để đặt các công cụ lọc nhanh.

## 3. Đề Xuất Cải Tiến (Brainstorming & Solutions)

### 3.1. Thiết Kế "Filter Icon" (Premium UX)
Thay vì chỉ thêm một icon đơn điệu, chúng ta sẽ xây dựng một **Filter Trigger** thông minh:

- **Vị trí:** Đặt ngay bên phải thanh tìm kiếm (`SearchInput`).
- **Visual:**
  - Sử dụng icon `ListFilter` (từ Lucide React).
  - Style: `Button` variant `outline` hoặc `ghost`.
  - **Micro-interaction:**
    - Hover: Hiệu ứng nền nhẹ (bg-slate-100).
    - Active (Có filter đang áp dụng): Hiển thị **Badge** số lượng (ví dụ: `(2)`) hoặc chấm đỏ/xanh để báo hiệu.
    - Animation: Icon rung nhẹ hoặc đổi màu khi click.

### 3.2. Giải Pháp Kỹ Thuật (Component Hóa)
Tạo component mới `ListToolbar` hoặc `FilterPopover` để tái sử dụng logic lọc.

**Cấu trúc đề xuất:**
```tsx
<div className="flex items-center gap-2">
  <SearchInput />
  <FilterPopover>
     {/* Nội dung filter tùy chỉnh theo từng trang */}
  </FilterPopover>
</div>
```

### 3.3. Các Tiêu Chí Lọc Cụ Thể (Gợi ý)
- **Nhân viên:** Vai trò (Quản lý/KTV), Trạng thái.
- **Dịch vụ:** Khoảng giá, Thời lượng, Kỹ năng yêu cầu.
- **Lịch hẹn:** Trạng thái (Chờ/Đã xong/Hủy), Nhân viên thực hiện, Khoảng ngày.

### 3.4. Phân Tích Vị Trí Đặt Filter (Chi Tiết)

Để đảm bảo UX tốt nhất, chúng ta có 3 phương án đặt vị trí Filter:

**Phương Án A: Nút Riêng Biệt (Khuyên Dùng)**
- **Mô tả:** Nút Filter nằm tách biệt, ngay bên phải thanh Search.
- **Ưu điểm:** Rõ ràng, dễ nhận biết, không làm rối thanh Search. Dễ dàng mở rộng thành một bộ lọc phức tạp (Popover).
- **Nhược điểm:** Tốn thêm một chút không gian chiều ngang.

**Phương Án B: Tích Hợp Trong Search Input**
- **Mô tả:** Icon Filter nằm bên trong Search Input (phía bên phải).
- **Ưu điểm:** Tiết kiệm không gian tối đa. Gọn gàng.
- **Nhược điểm:** Dễ bị nhầm lẫn là một phần của chức năng tìm kiếm. Khó hiển thị trạng thái "đang lọc" (Active State) một cách rõ ràng mà không làm rối UI.

**Phương Án C: Toolbar Riêng Biệt**
- **Mô tả:** Một hàng riêng biệt chứa các Dropdown lọc (Ví dụ: Dropdown "Trạng thái", Dropdown "Vai trò").
- **Ưu điểm:** Lọc nhanh 1 click. Trực quan.
- **Nhược điểm:** Tốn diện tích chiều dọc. Chỉ phù hợp khi có quá nhiều bộ lọc quan trọng cần hiển thị luôn.

**=> Kết luận:** Chọn **Phương Án A** vì cân bằng tốt nhất giữa tính năng và thẩm mỹ cho giao diện Admin hiện tại.

## 4. Kế Hoạch Hành Động (Action Plan)

Để thực hiện thay đổi này, vui lòng chạy workflow `/frontend-refactor` với các bước sau:

1.  **Tạo Component `FilterButton`**:
    - Wrapper cho `PopoverTrigger`.
    - Nhận props: `isActive` (boolean), `count` (number).
2.  **Cập nhật các trang Admin**:
    - Thêm `FilterButton` vào cạnh `SearchInput`.
    - (Giai đoạn 1) Chỉ hiển thị UI icon để "giữ chỗ" và đảm bảo layout đẹp.
    - (Giai đoạn 2) Implement logic lọc chi tiết sau.
3.  **Refactor Layout**:
    - Gom nhóm `SearchInput` và `FilterButton` vào một `div` chung để dễ quản lý spacing trên mobile.

## 5. Kết Luận
Việc thêm Filter Icon là bước đi đúng đắn để nâng cao trải nghiệm quản lý. Giao diện sẽ trông chuyên nghiệp hơn và "đầy đặn" hơn.

---
*Báo cáo này được tạo tự động bởi Antigravity.*
