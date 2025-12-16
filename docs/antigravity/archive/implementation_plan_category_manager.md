# Kế hoạch Triển khai: Quản lý Danh mục Dịch vụ (Frontend UX/UI Mock)

## 1. Định nghĩa Vấn đề (Problem)
Hiện tại, hệ thống quản lý dịch vụ chưa có chức năng phân loại danh mục (Category).
- Danh sách dịch vụ lộn xộn, khó tìm kiếm.
- Thiếu khả năng nhóm dịch vụ để hiển thị khoa học trên Web/App đặt lịch.
- Admin không thể sắp xếp thứ tự ưu tiên hiển thị của danh mục.

## 2. Mục đích (Purpose)
Xây dựng giao diện (UX/UI) cho tính năng Quản lý Danh mục Dịch vụ, cho phép:
- Tạo/Sửa danh mục nhanh (Quick Add Modal).
- Sắp xếp danh mục bằng Kéo & Thả (Drag & Drop).
- Gán danh mục cho dịch vụ.
- Lọc dịch vụ theo danh mục.
- **Phạm vi**: Chỉ thực hiện Frontend và sử dụng Mock Data để kiểm duyệt UX trước khi đấu nối Backend.

## 3. Ràng buộc (Constraints)
- **Frontend Only**: Không sửa đổi Backend/Database ở giai đoạn này.
- **Mock Data**: Dữ liệu danh mục và liên kết phải được mock tại `frontend/src/features/services/data/mocks.ts`.
- **Drag & Drop**: Sử dụng thư viện dnd-kit (hoặc tương tự có sẵn trong dự án) cho trải nghiệm mượt mà.
- **UI Standard**: Tuân thủ hệ thống Design System hiện tại (Shadcn UI + Tailwind).

## 4. Chiến lược (Strategy)
### 4.1. Cấu trúc dữ liệu Mock
- Tạo type `ServiceCategory`: `id`, `name`, `sort_order`.
- Cập nhật type `Service`: thêm `category_id`.
- Tạo mock data cho Categories.

### 4.2. Thành phần UI mới
- `CategoryManagerDialog`: Modal quản lý danh sách danh mục (CRUD + Sort).
- `CategorySortableList`: List component hỗ trợ Drag & Drop.
- `CategorySelect`: Dropdown chọn danh mục trong Form dịch vụ (có nút "+" để mở Modal nhanh).

### 4.3. Tích hợp màn hình chính
- Thêm nút "Quản lý danh mục" vào trang danh sách dịch vụ.
- Thêm Filter danh mục vào `ServiceTable`.
- Hiển thị Badge danh mục trong `ServiceTable`.

## 5. Giải pháp Chi tiết (Solution)
1.  **Refactor Types**: Cập nhật `types.ts` trong features/services.
2.  **Mock Data**: Cập nhật `mocks.ts`.
3.  **UI Implementation**:
    - Tạo `components/category-manager/` chứa logic quản lý danh mục.
    - Cập nhật `components/service-form.tsx` để thêm field Category.
    - Cập nhật `components/service-list.tsx` (hoặc table) để hiển thị và lọc.

## 6. Kế hoạch từng bước (Step-by-step)
1.  **Setup**: Định nghĩa Type và Data.
2.  **Component - Manager**: Xây dựng Dialog quản lý và sắp xếp.
3.  **Component - Form**: Tích hợp vào form tạo dịch vụ.
4.  **Component - Table**: Hiển thị và lọc trên danh sách.
5.  **Verify**: Kiểm tra luồng đi và tương tác.
