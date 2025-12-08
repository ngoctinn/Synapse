# Phân Tích & Brainstorming: Đồng Bộ Logic Frontend & Database Design

## 1. Vấn đề Chính
Hiện tại, logic Frontend (đặc biệt là `schemas.ts` và `types.ts` trong module Staff) đang có sự "lệch pha" so với thiết kế Database (`database_design.md`). Điều này tiềm ẩn rủi ro khi tích hợp Backend thực tế, gây ra lỗi dữ liệu hoặc thiếu sót tính năng.

## 2. So Sánh Logic Frontend vs Database Design

### A. Điểm Tương Đồng
- **Cấu trúc cơ bản:** Cả hai đều tách biệt thông tin `User` (đăng nhập) và `StaffProfile` (nghiệp vụ).
- **Phân quyền:** Vai trò `admin`, `receptionist`, `technician` khớp nhau.
- **Kỹ năng:** Mối quan hệ nhiều-nhiều giữa Staff và Skill đều được hỗ trợ.

### B. Điểm Khác Biệt & Thiếu Sót (GAP Analysis)

| Database (Chuẩn) | Frontend hiện tại (Thiếu/Sai) | Mức độ nghiêm trọng |
| :--- | :--- | :--- |
| `commission_rate` (DECIMAL) | Chưa có trong `staffCreateSchema` / `staffUpdateSchema` | **Cao** (Tính lương sai) |
| `hired_at` (DATE) | Chưa có trong Form tạo/sửa nhân viên | **Trung bình** (Quản lý nhân sự) |
| `is_active` (BOOLEAN) | Chưa có cơ chế toggle status active/inactive trong `StudentForm` | **Trung bình** |
| `deleted_at` (Soft Delete) | Frontend chưa xử lý logic hiển thị/ẩn staff đã xóa mềm | **Trung bình** |
| Validation Rules | `phone_number` trong DB là UNIQUE, Frontend chưa check duplicate. | **Thấp** (Backend sẽ chặn) |

## 3. Ý Tưởng Brainstorming (Divergent Thinking)

### Option 1: "Strict Mirroring" (Sao chép 1-1)
*   **Ý tưởng:** Cập nhật Frontend Schemas và Forms để khớp 100% từng trường trong Database. Thêm tất cả các input fields: `commission_rate`, `hired_at`, `is_active` vào Form.
*   **Ưu điểm:** Đảm bảo toàn vẹn dữ liệu tuyệt đối. Không bị sót thông tin.
*   **Nhược điểm:** Form trở nên quá dài và phức tạp. UX xấu đi nếu nhồi nhét quá nhiều trường không thiết yếu lúc tạo mới.

### Option 2: "Progressive Profiling" (Thu thập dần)
*   **Ý tưởng:** Form tạo mới (`Invite`) giữ nguyên sự đơn giản (Email, Tên, Role). Các trường chi tiết (`commission`, `hired_at`, `bio`, `skills`) sẽ được cập nhật sau trong trang "Hồ sơ chi tiết".
*   **Ưu điểm:** UX tuyệt vời, tạo nhân viên nhanh.
*   **Nhược điểm:** Cần xây dựng thêm UI/Flow cho việc "Cập nhật hồ sơ" sau khi tạo.

### Option 3: "Smart Defaults & Admin Override" (Mặc định thông minh)
*   **Ý tưởng:** Giữ Form đơn giản, set giá trị mặc định cho Database (VD: `commission = 0`, `hired_at = TODAY`). Thêm tab "Cấu hình nâng cao" trong Form sửa đổi (`Update Sheet`) chỉ dành cho Admin.
*   **Ưu điểm:** Cân bằng giữa UX và Data Integrity.
*   **Nhược điểm:** Cần logic phân quyền trong Form (chỉ Admin mới thấy tab lương thưởng).

## 4. Phân Tích & Đề Xuất (Convergent Thinking)

Dựa trên mục tiêu **Premium UX** và **Modular Architecture**, tôi đề xuất **Option 3 biến thể**:

**Đề xuất chiến lược:**
1.  **Cập nhật Schema & Types:** Đồng bộ ngay `types.ts` và `schemas.ts` để `Staff` object chứa đủ các trường `commission_rate`, `hired_at`.
2.  **Refactor Form UX:**
    *   **Create Mode:** Giữ đơn giản (Thông tin cơ bản + Role). Các trường còn lại lấy Default.
    *   **Update Mode:** Sử dụng **Tabs Layout** trong `StaffSheet` để chia nhóm thông tin:
        *   Tab "Thông tin chung": Tên, SDT, Bio, Avatar.
        *   Tab "Nghiệp vụ": Role, Chức danh, Kỹ năng, Màu hiển thị.
        *   Tab "Nhân sự" (Mới): **Ngày tuyển dụng (`hired_at`)**, **Tỉ lệ hoa hồng (`commission_rate`)**, Trạng thái (`is_active`).

## 5. Kế Hoạch Triển Khai Tiếp Theo
1.  **Bước 1 (Schema Sync):** Cập nhật `frontend/src/features/staff/schemas.ts` thêm validation cho `commission_rate` (0-100%) và `hired_at`.
2.  **Bước 2 (Type Sync):** Cập nhật `frontend/src/features/staff/types.ts` để khớp hoàn toàn với `database_design.md`.
3.  **Bước 3 (UI Upgrade):** Nâng cấp `StaffForm` thành dạng **Tabs** để chứa các trường mới một cách gọn gàng.
