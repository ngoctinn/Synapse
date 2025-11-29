---
title: Thiết kế Quản lý Dịch vụ & Kỹ năng
status: Draft
---

# Thiết kế: Quản lý Dịch vụ & Kỹ năng

## 1. Kiến trúc Hệ thống
-   **Module:** `modules/services` (Mới).
-   **Mô hình:** Skill-based Service Model.
-   **Logic:** Tách biệt `Service` (Sản phẩm bán) và `Skill` (Năng lực thực hiện).

## 2. Mô hình Dữ liệu (Database Schema)

### `public.services`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | PK |
| `name` | Varchar | Tên dịch vụ |
| `price` | Decimal | Giá tiền |
| `duration` | Integer | Thời gian thực hiện (phút) |
| `buffer_time` | Integer | Thời gian nghỉ/dọn dẹp (phút) |
| `image_url` | Text | URL hình ảnh (Optional) |
| `is_active` | Boolean | Trạng thái kinh doanh |
| `created_at` | Timestamptz | |
| `updated_at` | Timestamptz | |

### `public.skills`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | PK |
| `name` | Varchar | Tên kỹ năng (VD: Massage Body) |
| `code` | Varchar | Mã chuẩn hóa (Unique, Lowercase, Trim) |
| `is_active` | Boolean | Soft Delete (Default: true) |

### `public.service_skills` (Many-to-Many)
| Column | Type | Description |
| :--- | :--- | :--- |
| `service_id` | UUID | FK -> services.id |
| `skill_id` | UUID | FK -> skills.id |

### `public.employee_skills` (Many-to-Many)
| Column | Type | Description |
| :--- | :--- | :--- |
| `user_id` | UUID | FK -> users.id (KTV) |
| `skill_id` | UUID | FK -> skills.id |

## 3. API Design

### Services
-   `GET /services`: Lấy danh sách (có filter, pagination).
-   `POST /services`: Tạo dịch vụ mới. Logic: Normalize skill tags -> Find or Create Skill -> Assign.
-   `PUT /services/{id}`: Cập nhật. Lưu ý: Không ảnh hưởng bookings cũ (Bookings lưu snapshot).
-   `DELETE /services/{id}`: Soft delete (`is_active=false`).

### Skills
-   `GET /skills`: Lấy danh sách kỹ năng active.
-   `DELETE /skills/{id}`: Soft delete (`is_active=false`).

### Employee Skills
-   `GET /users/skills`: Lấy ma trận kỹ năng (Pagination/Filter theo Role).
-   `PUT /users/{id}/skills`: Cập nhật kỹ năng cho 1 nhân viên.

## 4. UI/UX Design (Frontend)

### 4.1. Service Management Page
-   **Table View:** Hiển thị danh sách dịch vụ.
-   **Columns:** Tên, Giá, Tổng thời gian (Duration + Buffer), Tags Kỹ năng, Trạng thái.
-   **Actions:** Edit, Duplicate, Delete (Soft).

### 4.2. Service Modal (Create/Edit)
-   **Inputs:** Tên, Giá, Hình ảnh.
-   **Time Visualization:** Thanh Progress Bar kép (Duration [Xanh] + Buffer [Xám]). Buffer là Post-service.
-   **Skill Input (Smart Tagging):**
    -   Component: `CreatableSelect`.
    -   Logic: Auto-lowercase & Trim khi so sánh để tránh trùng lặp (VD: "Massage" == "massage").

### 4.3. Employee Skill Matrix Page
-   **Grid View:**
    -   Rows: Nhân viên (Có Pagination/Filter theo Tên/Role).
    -   Cols: Kỹ năng.
    -   Cells: Checkbox.
-   **Bulk Action:** Tích chọn nhanh.

## 5. Bảo mật
-   Chỉ `Manager` mới có quyền Thêm/Sửa/Xóa Dịch vụ và Kỹ năng.
-   `Receptionist` có thể xem để tư vấn.
