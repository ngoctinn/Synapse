# Báo Cáo Đánh Giá Frontend: Filter Components

**Ngày:** 03/12/2025
**Người thực hiện:** AI Assistant
**Phạm vi:**
- `frontend/src/shared/ui/custom/filter-button.tsx`
- `frontend/src/features/staff/components/staff-filter.tsx`
- `frontend/src/features/services/components/service-filter.tsx`
- `frontend/src/features/appointments/components/appointment-filter.tsx`

---

## 1. Đánh Giá Kiến Trúc (FSD & Modular Monolith)

### ✅ Điểm Tốt
- **Cấu trúc thư mục chuẩn FSD**:
  - `FilterButton` nằm trong `shared/ui/custom` là chính xác (Component tái sử dụng, không chứa logic nghiệp vụ).
  - Các Filter cụ thể (`StaffFilter`, `ServiceFilter`, `AppointmentFilter`) nằm trong `features/*/components` là chính xác (Gắn liền với nghiệp vụ).
- **Không có Deep Imports**: Các import đều tuân thủ quy tắc (`@/shared/ui/...`, `@/features/...`).

### ⚠️ Vấn đề Cần Cải Thiện
- **Lặp Logic (Code Duplication)**:
  - Cả 3 file `*-filter.tsx` đều lặp lại logic xử lý `URLSearchParams` (`createQueryString`, `updateParam`, `handleClear`).
  - **Đề xuất**: Tách logic này ra thành một custom hook `useFilterParams` đặt tại `shared/lib/hooks` hoặc `shared/lib/search-params`.

---

## 2. Đánh Giá Code Quality & Next.js 16

### ✅ Điểm Tốt
- Sử dụng `useSearchParams`, `usePathname`, `useRouter` từ `next/navigation` (Chuẩn Next.js App Router).
- `FilterButton` có Type Hinting rõ ràng và Comment tiếng Việt đầy đủ.

### ⚠️ Vấn đề Cần Cải Thiện
- **Thiếu Comment Tiếng Việt trong Feature Components**:
  - Các file `staff-filter.tsx`, `service-filter.tsx`, `appointment-filter.tsx` hầu như không có comment giải thích nghiệp vụ (Why).
  - Ví dụ: Logic `activeCount` nên giải thích tại sao lại đếm như vậy.
- **Hardcoded Strings**:
  - Các key params (`role`, `is_active`, `min_price`, ...) đang hardcode rải rác. Nên định nghĩa constant hoặc enum nếu tái sử dụng nhiều.

---

## 3. Đề Xuất UX/UI "Premium" & "WOW Factor"

### 🎨 3.1. Thay Đổi Icon Filter
- **Hiện tại**: `ListFilter` (Lucide) - Trông hơi phổ thông và giống biểu tượng "Sắp xếp" hơn là "Bộ lọc nâng cao".
- **Đề xuất**: Sử dụng icon **`SlidersHorizontal`** (Lucide).
  - **Lý do**: Biểu tượng này gợi nhớ đến các thanh điều chỉnh (sliders/controls), phù hợp với việc tinh chỉnh nhiều thông số (giá, ngày, trạng thái). Nó mang cảm giác "Dashboard" và "Control Panel" chuyên nghiệp hơn.
  - **Alternative**: Nếu muốn nhấn mạnh việc "lọc bớt", có thể dùng `Filter` (hình phễu) nhưng `SlidersHorizontal` trông hiện đại và "tech" hơn cho Admin Dashboard.

### ✨ 3.2. Nâng Cấp Giao Diện FilterButton
- **Trạng thái Active (Đang lọc)**:
  - Hiện tại: `bg-accent text-accent-foreground border-primary/50`.
  - **Đề xuất Premium**:
    - Sử dụng **Gradient Border** hoặc **Glow Effect** nhẹ khi có active filters.
    - Ví dụ: `ring-2 ring-primary/20 bg-primary/5` để tạo cảm giác "đang hoạt động" mà không quá chói.


### 🚀 3.3. Micro-animations
- **Popover Transition**:
  - Thêm `collisionPadding` để tránh popover dính sát mép màn hình.
  - Animation mở Popover nên nhanh và mượt hơn (`duration-200` thay vì `duration-300` mặc định đôi khi hơi chậm).
- **Clear Button**:
  - Thêm hiệu ứng hover cho nút "Xóa lọc" (ví dụ: icon xoay nhẹ hoặc đổi màu đỏ dần).
  - Chỉ cần dấu x không cần chữ "Xóa lọc".

### 📱 3.4. Layout Form Lọc
- **Grid System**:
  - Các filter hiện tại đang dùng `grid gap-4`.
  - **Đề xuất**: Với `ServiceFilter` và `AppointmentFilter` có nhiều trường, nên nhóm các trường liên quan (ví dụ: Giá & Thời lượng) vào một `fieldset` hoặc có tiêu đề nhóm nhỏ (Sub-header) để dễ quét mắt.

### 🔍 3.5. Đánh Giá Chi Tiết Form Lọc (Deep Dive)

#### **A. StaffFilter (`features/staff`)**
- **Hiện tại**: 2 Select (Vai trò, Trạng thái) xếp chồng lên nhau.
- **Vấn đề**: Hơi đơn điệu.
- **Đề xuất Premium**:
  - Thêm **Icon** vào trong `SelectItem` để trực quan hơn.
    - Ví dụ: `UserCog` cho Quản lý, `Stethoscope` cho KTV.
    - `CheckCircle2` (Xanh) cho Hoạt động, `XCircle` (Xám) cho Ngừng hoạt động.

#### **B. ServiceFilter (`features/services`)**
- **Hiện tại**:
  - Giá: 2 ô input riêng biệt (Min/Max).
  - Thời lượng: Select đơn giản.
  - Kỹ năng: TagInput.
- **Vấn đề**:
  - Nhập khoảng giá bằng 2 ô input tốn diện tích và kém sang.
  - TagInput trong Popover hẹp (w-80) dễ bị vỡ layout nếu chọn nhiều tag.
- **Đề xuất Premium**:
  - **Giá**: Sử dụng **Dual Range Slider** kết hợp 2 ô input nhỏ bên dưới. Slider cho phép kéo nhanh khoảng giá phổ biến.
  - **Kỹ năng**: Chuyển sang **Multi-select Combobox** với Checkbox bên cạnh mỗi item, hiển thị số lượng đã chọn (ví dụ: "3 kỹ năng đã chọn") thay vì liệt kê hết tag ra gây tràn dòng.

#### **C. AppointmentFilter (`features/appointments`)**
- **Hiện tại**:
  - Ngày: 2 DatePicker riêng biệt (Từ ngày, Đến ngày).
  - Trạng thái & Nhân viên: Select thường.
- **Vấn đề**:
  - Chọn khoảng ngày bằng 2 lần click mở lịch là trải nghiệm tồi (UX friction).
- **Đề xuất Premium**:
  - **Ngày**: Bắt buộc chuyển sang **`DateRangePicker`** (Chọn khoảng ngày trong 1 lần mở lịch). Đây là tiêu chuẩn của các ứng dụng quản lý hiện đại.
  - **Trạng thái**: Sử dụng **Badge màu** trong SelectItem (ví dụ: Badge vàng cho "Chờ xác nhận", xanh cho "Hoàn thành") để đồng bộ với bảng danh sách.

---

## 4. Kế Hoạch Hành Động (Refactor Plan)

Để thực hiện các thay đổi trên, hãy chạy workflow `/frontend-refactor` với các bước sau:

1.  **Refactor Logic**:
    - Tạo hook `useFilterParams` trong `shared/lib/hooks/use-filter-params.ts`.
    - Refactor 3 file filter để sử dụng hook này.
2.  **Update UI `FilterButton`**:
    - Thay icon `ListFilter` thành `SlidersHorizontal`.
    - Cập nhật styling cho trạng thái `isActive` (Premium look).
    - Tinh chỉnh Badge và Animation.
    - Xóa chữ "Xóa lọc", chỉ giữ icon X.
3.  **Update UI Feature Filters**:
    - **Staff**: Thêm Icon cho Select Items.
    - **Service**: Implement Dual Range Slider cho giá (nếu thư viện hỗ trợ hoặc giữ input nhưng style lại gọn hơn như `InputGroup`), tối ưu TagInput.
    - **Appointment**: Thay thế 2 DatePicker bằng `DateRangePicker`.
    - Thêm comment tiếng Việt đầy đủ.

---
**Kết luận**: Các component hiện tại hoạt động tốt về mặt chức năng nhưng cần tinh chỉnh về UI và Code Structure để đạt chuẩn "Premium" và dễ bảo trì hơn.
