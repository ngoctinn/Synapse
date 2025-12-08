# Update: Resources Feature Refactor

## 1. UI/UX Consistency (Select Component)
- **Problem**: Component `Select` cũ không đồng bộ style với Staff Form (thiếu Icon, height/shadow không chuẩn).
- **Fix**: Thay thế bằng `SelectWithIcon` (Component chuẩn từ Staff Module).
  - Field **Loại**: Icon `Box` (LayoutGrid tương đương).
  - Field **Trạng thái**: Icon `Activity`.
- **Imports**: Đã cập nhật import `lucide-react` và `SelectWithIcon`, loại bỏ imports thừa.

## 2. Trạng Thái Hiện Tại
- [x] Layout Single Column.
- [x] Sheet Container.
- [x] Inputs & Selects styled uniformly (bg-background, icons).
- [x] Feature Resources Ready for Review.
