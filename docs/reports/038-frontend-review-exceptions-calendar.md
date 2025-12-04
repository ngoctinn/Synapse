# Báo cáo Đánh giá Frontend: Exceptions Calendar

**Ngày:** 04/12/2025
**Người thực hiện:** Antigravity
**Mục tiêu:** Đánh giá và đề xuất cải tiến cho component `ExceptionsCalendar` và các thành phần liên quan trong module `operating-hours`.

## 1. Tổng Quan & Phạm Vi
- **File chính:** `frontend/src/features/settings/operating-hours/components/exceptions-calendar.tsx`
- **File phụ:** `frontend/src/features/settings/operating-hours/components/exception-item.tsx`
- **Module:** `frontend/src/features/settings/operating-hours`

## 2. Đánh Giá Kiến Trúc (FSD & Clean Code)

### ✅ Điểm Tốt
- **Cấu trúc thư mục:** Tuân thủ FSD. Các component được đặt trong `components/` và không được export ra ngoài module (Private API), đảm bảo tính đóng gói.
- **Dependencies:** Sử dụng `crypto.randomUUID()` thay vì `Math.random()`.
- **UI Libraries:** Tận dụng tốt `shadcn/ui` (Calendar, Dialog, Card) và `framer-motion` cho animation.

### ⚠️ Vấn đề Cần Khắc Phục
1.  **Thiếu Directive `"use client"`**:
    - `ExceptionsCalendar.tsx` sử dụng `useState`, `useMemo` nhưng thiếu dòng `"use client"` ở đầu file. Điều này sẽ gây lỗi khi Next.js render component này.
    - `ExceptionItem.tsx` sử dụng `framer-motion` và interactive elements, cũng nên có `"use client"` (hoặc được import bởi client component, nhưng tốt nhất là explicit).
2.  **Logic "Drag to Select" chưa có**:
    - Hiện tại `Calendar` chỉ hỗ trợ click từng ngày (`mode="multiple"`). Người dùng muốn "kéo thả" để chọn nhanh nhiều ngày liên tiếp hoặc bất kỳ.
3.  **Thiếu chức năng Chỉnh sửa (Edit)**:
    - Chỉ có nút "Xóa". Nếu người dùng nhập sai lý do hoặc muốn đổi loại sự kiện, họ phải xóa đi tạo lại.
4.  **Double Click**:
    - Code đã có `onDoubleClick` trong `DayButton` override, nhưng cần kiểm tra thực tế xem nó có hoạt động trơn tru với `react-day-picker` v9 không.

## 3. Đề Xuất Cải Tiến UX/UI (Premium & WOW Factor)

### 🎨 Giao diện & Tương tác
1.  **Drag Selection (Kéo để chọn)**:
    - **Giải pháp**: Implement logic "Paint Selection". Khi người dùng nhấn giữ chuột và di qua các ngày, các ngày đó sẽ được chọn/bỏ chọn.
    - **UX**: Giúp thao tác chọn kỳ nghỉ dài (Tết, nghỉ hè) cực nhanh thay vì click từng cái.
2.  **Edit Exception (Chỉnh sửa)**:
    - Thêm nút "Edit" (icon bút chì) vào `ExceptionItem`.
    - Khi bấm, mở Dialog với dữ liệu cũ được điền sẵn.
    - Cho phép cập nhật Lý do, Loại, Trạng thái đóng cửa.
3.  **Double Click Feedback**:
    - Thêm visual feedback hoặc tooltip hướng dẫn "Double click để thêm nhanh".
4.  **Micro-animations**:
    - Hiệu ứng khi chọn ngày: Scale nhẹ hoặc pulse.
    - Hiệu ứng khi mở Dialog: Smooth scale up.

## 4. Kế Hoạch Hành Động (Action Plan)

### Bước 1: Sửa lỗi & Clean Code
- [ ] Thêm `"use client"` vào `exceptions-calendar.tsx` và `exception-item.tsx`.
- [ ] Refactor `handleDayDoubleClick` để đảm bảo logic chọn ngày chính xác.

### Bước 2: Implement Tính Năng Mới
- [ ] **Drag Selection**: Sử dụng `onMouseEnter` kết hợp trạng thái `isDragging` để cho phép chọn nhiều ngày bằng cách lướt chuột.
- [ ] **Edit Mode**:
    - Thêm state `editingException` (lưu thông tin ngoại lệ đang sửa).
    - Cập nhật Dialog để hỗ trợ cả 2 chế độ: Thêm mới (theo `dates`) và Chỉnh sửa (theo `editingException`).
    - Thêm nút Edit vào `ExceptionItem`.

### Bước 3: Tối ưu UX
- [ ] Cải thiện Empty State (đã có nhưng có thể làm đẹp hơn).
- [ ] Thêm Tooltip hướng dẫn các thao tác ẩn (Drag, Double Click).

---
*Báo cáo này là cơ sở để thực hiện Refactor. Vui lòng chạy workflow `/frontend-refactor` hoặc phê duyệt Implementation Plan để tiến hành.*
