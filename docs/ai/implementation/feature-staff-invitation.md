---
title: Triển Khai Mời Nhân Viên
status: Draft
---

# Ghi Chú Triển Khai Mời Nhân Viên

## 1. Triển khai Backend
- **File:** `src/modules/users/router.py` (hoặc module `staff` mới?) -> User quyết định `users` module xử lý auth/profile, nhưng `staff` có thể tốt hơn cho logic nghiệp vụ. Tạm thời dùng `users` hoặc kiểm tra module `staff` hiện có.
- **Service:** `UserService.invite_staff`.

## 2. Triển khai Frontend
- **File:** `src/features/staff/components/invite-staff-modal.tsx`.
- **State:** Sử dụng `useActionState` hoặc `react-hook-form` với Server Action/API.

*(Sẽ được cập nhật trong quá trình thực thi)*
