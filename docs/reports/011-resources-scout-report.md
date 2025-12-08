# Scout Report: Resources Feature

## 1. Tổng Quan
Module `frontend/src/features/resources` quản lý tài nguyên (Phòng, Thiết bị) và Lịch bảo trì.
Cấu trúc module tuân thủ FSD cơ bản.

## 2. Phân Tích Hiện Trạng & Gaps (So với Standard Staff Feature)

| Thành phần | Resources (Hiện tại) | Staff (Chuẩn mới) | Đánh giá Gap |
| :--- | :--- | :--- | :--- |
| **Container** | `ResourceDialog` (Dialog) | `StaffSheet` (Sheet/Drawer) | **High**: Cần chuyển sang Sheet để đồng nhất trải nghiệm Edit/Create. |
| **Form Layout** | `grid-cols-2` (2 cột) | `space-y-4` (1 cột) | **High**: Cần chuyển sang 1 cột để tối ưu scanning. |
| **Fields** | Thiếu Image UI | Có Avatar Placeholder | **Medium**: Cần thêm UI cho Image resource. |
| **Width** | `sm:max-w-[500px]` | `sm:max-w-md` (448px) | **Medium**: Cần tinh chỉnh width khi chuyển sang Sheet. |
| **State** | `useState` + `actions` trực tiếp | `useActionState` (React 19) | **High**: Staff dùng `useActionState`, Resources vẫn dùng pattern cũ. Cần nâng cấp. |

## 3. Kế Hoạch Refactor (Frontend Consistency)

1.  **Refactor `ResourceDialog` -> `ResourceSheet`**:
    - Chuyển `Dialog` -> `Sheet`.
    - Update `max-w` thành `sm:max-w-md`.
    - Update Header/Footer styling (bỏ `bg-muted/10` ở header để clean hơn giống Staff).

2.  **Refactor `ResourceForm`**:
    - Remove Grid 2 cột -> Single Column.
    - Add `ImagePlaceholder` (cho phép tương lai upload ảnh thiết bị/phòng).
    - Reorder fields: Image -> Basic Info -> Details.

3.  **Upgrade Actions Integration (Optional but recommended)**:
    - Nếu scope cho phép, nâng cấp lên `useActionState` cho `ResourceSheet` giống `StaffSheet`. (User yêu cầu "UI/UX" chủ yếu, nhưng logic cũng nên đồng nhất). *Update: User yêu cầu "refactor ... cho đồng nhất", nên làm cả logic action nếu có thể.*

## 4. Danh sách File Tác Động
- `src/features/resources/components/resource-dialog.tsx` (Rewrite to Sheet)
- `src/features/resources/components/resource-form.tsx` (Layout update)
- `src/features/resources/components/resource-table.tsx` (Update usage of Dialog -> Sheet)
- `src/features/resources/index.ts` (Export update checks)
