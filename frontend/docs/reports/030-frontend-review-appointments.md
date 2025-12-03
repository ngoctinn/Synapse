# Báo Cáo Frontend Review: Module Appointments

**Ngày:** 03/12/2025
**Người thực hiện:** Antigravity (AI Assistant)
**Phạm vi:** `frontend/src/app/(admin)/admin/appointments` & `frontend/src/features/appointments`

## 1. Tuân Thủ Kiến Trúc (FSD & Modular Monolith)

### ✅ Điểm Tốt
- **Cấu trúc thư mục rõ ràng**: Module `appointments` được tổ chức tốt trong `features/`, tách biệt `components`, `types`, `actions`.
- **Public API**: File `index.ts` export đầy đủ các component cần thiết cho `app/` sử dụng.
- **Thin Page**: `page.tsx` chủ yếu làm nhiệm vụ Data Fetching và Layout composition, không chứa logic nghiệp vụ phức tạp.

### ⚠️ Vấn Đề Cần Khắc Phục
- **Cross-feature Imports**:
  - Tại `appointment-sidebar.tsx`:
    ```typescript
    import { Staff } from "@/features/staff/types" // Nên import từ @/features/staff hoặc shared
    import { Service } from "@/features/services/types" // Tương tự
    ```
  - **Khuyến nghị**: Đảm bảo các feature khác export type qua `index.ts` của chúng, hoặc di chuyển các type chung (như `Staff`, `Service` cơ bản) vào `shared/types` hoặc `entities` nếu chúng được dùng ở nhiều nơi.

## 2. Code Quality & Next.js 16 Patterns

### ✅ Điểm Tốt
- **Async/Await**: Sử dụng đúng chuẩn cho `searchParams` trong `page.tsx` (Next.js 15+).
- **Data Fetching**: Sử dụng `Promise.all` để fetch dữ liệu song song -> Tối ưu thời gian tải trang.
- **Client Components**: Sử dụng `"use client"` hợp lý cho các component tương tác (`Sidebar`, `Calendar`, `Card`).
- **Hooks**: Sử dụng `useFilterParams` custom hook giúp quản lý URL state sạch sẽ.

### ⚠️ Vấn Đề Cần Khắc Phục
- **Comments**: Vẫn còn một số comment tiếng Anh (VD: `// Fetch data in parallel`, `// TODO: Move to shared...`).
  - **Hành động**: Chuyển toàn bộ sang Tiếng Việt.
- **Magic Numbers**:
  - Trong `appointment-calendar.tsx`: `const minutesFrom8AM = (startHour - 8) * 60 + startMin`. Số `8` (giờ bắt đầu) nên được đưa vào `constants.ts` (VD: `START_HOUR`).

## 3. Hiệu Năng (Performance)

### ✅ Điểm Tốt
- **Memoization**: Sử dụng `useMemo` trong `AppointmentCalendar` để group lịch hẹn và map màu sắc -> Tránh tính toán lại không cần thiết khi render.
- **Suspense**: Sử dụng `Suspense` bao quanh các khu vực dynamic data.

### ⚠️ Đề Xuất Tối Ưu
- **Virtualization**: Nếu số lượng lịch hẹn trong tuần rất lớn, `CalendarGrid` có thể bị chậm. Cân nhắc dùng `react-window` hoặc chỉ render những gì trong viewport (tuy nhiên với lịch hẹn nha khoa thì số lượng thường không quá lớn nên chưa cấp thiết).

## 4. Kế Hoạch Hành Động (Refactor Plan)

1.  **Refactor Imports**: Sửa lại các đường dẫn import trong `appointment-sidebar.tsx` để tuân thủ FSD nghiêm ngặt hơn.
2.  **Localization**: Dịch toàn bộ comment sang Tiếng Việt.
3.  **Constants**: Đưa các hằng số (giờ bắt đầu/kết thúc, chiều cao row) vào `constants.ts`.
4.  **Type Safety**: Kiểm tra kỹ các type `any` (nếu có) và thay thế bằng type cụ thể.

---
*Để thực hiện sửa đổi, hãy chạy workflow `/frontend-refactor` và cung cấp đường dẫn file báo cáo này.*
