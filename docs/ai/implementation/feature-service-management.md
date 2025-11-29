---
title: Triển khai Quản lý Dịch vụ
status: Draft
---

# Triển khai: Quản lý Dịch vụ & Kỹ năng

*Tài liệu này sẽ được cập nhật trong quá trình viết code.*

## Ghi chú Kỹ thuật
-   **Smart Tagging:**
    -   Frontend: Normalize text (lowercase, trim) trước khi gửi.
    -   Backend: Kiểm tra `code` (slugified name) để tránh trùng lặp. Nếu chưa có -> Tạo mới.
-   **Soft Delete:**
    -   Thêm cột `is_active` cho `skills` và `services`.
    -   API `DELETE` chỉ update `is_active = false`.
    -   API `GET` mặc định chỉ lấy `is_active = true`.
-   **Buffer Time:** Logic tính slot: `End Time = Start Time + Duration + Buffer Time`.
-   **Skill Matrix:** Sử dụng Pagination cho danh sách nhân viên để tránh lag UI.
### Backend
-   `src/modules/services/`
-   `alembic/versions/`

### Frontend
-   `src/features/services/`
-   `src/features/staff/components/skill-matrix.tsx`
