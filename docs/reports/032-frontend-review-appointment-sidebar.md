# Báo Cáo Đánh Giá Frontend: Appointment Sidebar

**Ngày:** 03/12/2025
**Người thực hiện:** Antigravity
**Đối tượng:** `frontend/src/features/appointments/components/appointment-sidebar.tsx`

---

## 1. Tổng Quan
Component `AppointmentSidebar` đóng vai trò quan trọng trong việc lọc và điều hướng lịch hẹn. Hiện tại, component đã hoạt động đúng chức năng cơ bản nhưng cần cải thiện về kiến trúc FSD, chuẩn hóa code (Tiếng Việt) và nâng cấp UX/UI để đạt chuẩn "Premium".

## 2. Vi Phạm Kiến Trúc (FSD) & Code Smell

### 2.1. Cross-Feature Imports (Vi phạm FSD)
- **Vấn đề:** Component đang import trực tiếp types từ các feature khác:
  - `import { Staff } from "@/features/staff/types"`
  - `import { Service } from "@/features/services/types"`
- **Giải thích:** Trong FSD, các feature ngang hàng không nên phụ thuộc trực tiếp lẫn nhau.
- **Đề xuất:**
  - Di chuyển các Type chung (`Staff`, `Service`) xuống tầng `entities` (ví dụ: `entities/staff`, `entities/service`) hoặc `shared/types` nếu chúng là các thực thể cốt lõi được sử dụng rộng rãi.

### 2.2. Duplication (Lặp code)
- **Vấn đề:** Mảng `STAFF_COLORS` được định nghĩa lại trong `appointment-sidebar.tsx`, trong khi nó cũng tồn tại trong `appointment-calendar.tsx`.
- **Đề xuất:** Tách `STAFF_COLORS` ra một file constant chung, ví dụ: `features/appointments/constants.ts` hoặc `shared/config/colors.ts` để tái sử dụng.

### 2.3. Ngôn Ngữ & Comments
- **Vấn đề:** Toàn bộ comments đang viết bằng Tiếng Anh.
  - `// Predefined colors for staff members...`
  - `// Date State`
  - `// Staff Filter State`
- **Đề xuất:** Chuyển toàn bộ comments sang Tiếng Việt giải thích nghiệp vụ (Why).

## 3. Đánh Giá & Đề Xuất UX/UI (Premium & WOW Factor)

### 3.1. Visual Hierarchy & Thẩm Mỹ
- **Hiện tại:** Sidebar sử dụng nền trắng, border phải, và shadow cơ bản.
- **Đề xuất nâng cấp:**
  - **Glassmorphism (Optional):** Nếu phù hợp với theme tổng thể, có thể thêm chút độ trong suốt và blur cho background.
  - **Refined Shadows:** Sử dụng shadow mềm mại hơn cho các element được chọn (selected state).
  - **Avatar Group:** Nếu một nhân viên có nhiều lịch, có thể hiển thị indicator đặc biệt.

### 3.2. Micro-animations (Tương tác)
- **Hover Effects:** Item nhân viên/dịch vụ nên có hiệu ứng hover mượt mà hơn (ví dụ: `translate-x-1` nhẹ khi hover).
- **Selection Animation:** Khi chọn một nhân viên, checkbox và background nên có transition mượt (đã có `transition-all` nhưng có thể thêm `scale` nhẹ cho avatar).
- **Reset Button:** Nút "Đặt lại bộ lọc" hiện ra đột ngột. Nên dùng `AnimatePresence` (framer-motion) để nó xuất hiện mượt mà (fade in + slide down).

### 3.3. Trải Nghiệm Người Dùng (UX)
- **Empty States:** Cần xử lý trường hợp `staffList` hoặc `serviceList` rỗng (hiện tại sẽ map mảng rỗng và không hiển thị gì, có thể gây khó hiểu).
- **Loading Skeleton:** Nếu dữ liệu đang tải (dù props được truyền vào, nhưng nếu parent đang fetch), nên có Skeleton loader cho sidebar để tránh layout shift.
- **Sticky/Scroll:** `ScrollArea` đã được dùng, đảm bảo chiều cao sidebar luôn full height màn hình trừ đi header.

### 3.4. Đánh Giá Qua Hình Ảnh (Visual Review)
- **Overflow Issue:** Nội dung trong sidebar (đặc biệt là Calendar) đang bị tràn ra ngoài hoặc quá sát mép, gây mất thẩm mỹ và khó thao tác. Cần kiểm soát lại `width` hoặc `padding`.
- **Calendar Layout:** Calendar đang chiếm diện tích khá lớn phía trên, có thể làm giảm không gian hiển thị danh sách nhân viên trên màn hình nhỏ. Cần cân nhắc padding hoặc size chữ nhỏ hơn cho Calendar trong Sidebar.
- **Spacing:** Khoảng cách giữa các phần tử (Calendar, Filter Reset, List) cần được tinh chỉnh để tạo cảm giác "thoáng" nhưng vẫn liên kết.
- **Avatar Alignment:** Đảm bảo Avatar và tên nhân viên căn giữa theo trục dọc (vertical alignment) chuẩn xác.
- **Active State:** Trạng thái "đang chọn" (checked) của nhân viên cần nổi bật hơn nữa (ví dụ: border trái màu đậm hoặc nền màu brand nhạt) để người dùng dễ nhận biết nhanh.

## 4. Kế Hoạch Hành Động (Refactor Plan)

Để thực hiện các thay đổi trên, hãy chạy workflow `/frontend-refactor` với các bước sau:

1.  **Refactor Constants:**
    - Tạo `features/appointments/constants.ts` và di chuyển `STAFF_COLORS` vào đó.
    - Update cả `appointment-sidebar.tsx` và `appointment-calendar.tsx` để dùng constant này.

2.  **Fix Imports (FSD):**
    - (Tạm thời chấp nhận import types nếu chưa refactor `entities`, nhưng cần note lại TODO). Hoặc chuyển types sang `shared/types` nếu đơn giản.

3.  **Update UI/UX:**
    - Thêm `framer-motion` cho các list items và nút Reset.
    - Cập nhật styling cho trạng thái Selected (thêm border màu primary nhẹ, shadow nổi hơn).
    - Thêm hiệu ứng hover `translate-x`.

4.  **Vietnamese Comments:**
    - Dịch và bổ sung comments giải thích nghiệp vụ.

5.  **Clean Code:**
    - Review lại logic `useEffect` sync date, đảm bảo không gây infinite loop (hiện tại ổn nhưng cần cẩn thận).

---
*Báo cáo này được tạo tự động bởi Antigravity.*
