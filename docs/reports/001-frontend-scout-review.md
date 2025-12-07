# Báo cáo Đánh giá Frontend & Scout (Lần 1)

**Ngày thực hiện:** 07/12/2025
**Người thực hiện:** Antigravity (AI)
**Mục tiêu:** Đánh giá tổng thể Codebase Frontend, phát hiện Spaghetti Code và Code Bloat.

---

## 1. Tổng quan & Phạm vi
Tôi đã thực hiện quy trình `scout` và `frontend-review` (Step 1-3) trên thư mục `frontend/src`.
- **Cấu trúc thư mục**: Tuân thủ tốt chuẩn Modular Monolith / FSD.
- **Modules**: Các features (`appointments`, `staff`, `services`,...) được phân tách rõ ràng.
- **Shared Kernel**: `shared/ui` và `shared/ui/custom` chứa các component tái sử dụng chất lượng cao.

---

## 2. Đánh giá Kiến trúc (FSD & Clean Code)

### ✅ Điểm tốt (Pros)
1.  **Thin Pages Pattern**: Các file `page.tsx` trong `app/(admin)` (ví dụ: `admin/appointments/page.tsx`) rất gọn (~20 dòng), chỉ đóng vai trò Entry Point và Lazy Load các Feature Components.
2.  **Public API**: Các module đều có `index.ts` để export component. Việc kiểm tra Deep Imports chưa phát hiện vi phạm nghiêm trọng (không import trực tiếp từ `components` nội bộ của feature khác).
3.  **Component Granularity**: Thư mục `shared/ui/custom` cho thấy nỗ lực tốt trong việc tách nhỏ các UI phức tạp (`data-table`, `tag-input`, `calendar`).

### ⚠️ Điểm cần cải thiện (Cons & Findings)

#### A. Code Bloat & Mixing Concerns
Một số component bắt đầu có dấu hiệu "phình to" do ôm quá nhiều logic xử lý (State + UI + Data Fetching + Optimistic Updates).

*   **File:** `features/staff/components/scheduling/staff-scheduler.tsx`
    *   **Vấn đề:** ~320 dòng code. Component này đang làm quá nhiều việc:
        *   Quản lý state UI (Dialog, Popover, Paint Mode).
        *   Quản lý logic nghiệp vụ (Add/Remove/Update Schedule).
        *   Xử lý Optimistic UI (Cập nhật `schedules` state trước khi gọi Server Action).
        *   Gọi trực tiếp Server Actions.
    *   **Nguy cơ:** Khó test, khó bảo trì, dễ gây lỗi khi logic phức tạp hơn.

#### B. Type Safety Violations
*   **File:** `features/staff/components/scheduling/staff-scheduler.tsx`
    *   **Vấn đề:** Sử dụng `as any` tại dòng 58 và 151 để bypass Type Checker khi tạo object `Schedule`.
    *   **Nguy cơ:** Dễ gây lỗi runtime nếu cấu trúc dữ liệu thay đổi, mất lợi ích của TypeScript.

#### C. User Experience (UX) & Premium Standards
*   **File:** `features/appointments/components/appointment-page.tsx`
    *   **Vấn đề:** Sử dụng `alert()` và `confirm()` của trình duyệt (Browser Native) cho các hành động Edit/Cancel.
    *   **Đánh giá:** Không đạt chuẩn "Premium Designs" và làm gián đoạn trải nghiệm người dùng.

---

## 3. Kết luận về "Spaghetti Code"
Hiện tại, **Codebase KHÔNG bị Spaghetti Code nghiêm trọng**. Cấu trúc module và luồng dữ liệu khá mạch lạc.
Tuy nhiên, có dấu hiệu **Code Bloat** cục bộ tại các màn hình phức tạp (`StaffScheduler`). Nếu không refactor sớm (tách hook), nó sẽ biến thành Spaghetti trong tương lai gần.

---

## 4. Kế hoạch hành động (Recommendations)

Để xử lý các vấn đề trên, tôi đề xuất thực hiện workflow `/frontend-refactor` với các task sau:

1.  **Refactor `StaffScheduler`**:
    *   Tách logic nghiệp vụ và Optimistic Updates ra `features/staff/hooks/use-staff-schedule.ts`.
    *   Sửa lỗi `as any`: Định nghĩa đúng kiểu dữ liệu hoặc dùng `Partial<Schedule>` nếu cần, nhưng phải đảm bảo type safety.

2.  **Nâng cấp UX `AppointmentPage`**:
    *   Thay thế `window.confirm` bằng `AlertDialog` (Shadcn UI).
    *   Thay thế `window.alert` bằng `toast` (Sonner) hoặc Dialog thông báo.

3.  **Kiểm soát kích thước file**:
    *   Đặt ngưỡng cảnh báo (ví dụ: > 300 dòng) để cân nhắc tách file/hook.
