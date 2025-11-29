---
title: Kế hoạch Triển khai Quản lý Dịch vụ
status: Draft
---

# Kế hoạch: Quản lý Dịch vụ & Kỹ năng

## Giai đoạn 1: Backend Foundation (Database & API)
- [ ] **Migration:** Tạo bảng `services`, `skills`, `service_skills`, `employee_skills`.
- [ ] **Models:** Định nghĩa SQLModel classes.
- [ ] **Schemas:** Định nghĩa Pydantic Request/Response (bao gồm logic tạo skill ngầm).
- [ ] **Service Layer:**
    -   Logic CRUD Service.
    -   Logic xử lý Transaction khi tạo Service kèm Skill mới.
    -   Logic gán Skill cho nhân viên.
- [ ] **API Endpoints:** Router cho Services và Skills.

## Giai đoạn 2: Frontend - Service Management
- [ ] **API Client:** Định nghĩa các hàm fetch/mutate trong `features/services/actions.ts`.
- [ ] **UI Components:**
    -   `ServiceTable`: Hiển thị danh sách.
    -   `ServiceModal`: Form thêm/sửa.
    -   `TimeBufferVisualizer`: Component thanh thời gian.
    -   `SkillTagInput`: Component nhập kỹ năng thông minh.
- [ ] **Integration:** Kết nối API và xử lý state.

## Giai đoạn 3: Frontend - Employee Skill Matrix
- [ ] **UI Components:**
    -   `SkillMatrixTable`: Bảng ma trận nhân viên - kỹ năng.
- [ ] **Logic:** Xử lý cập nhật checkbox và gọi API update.

## Giai đoạn 4: Verification
- [ ] **Test:** Tạo dịch vụ với kỹ năng mới -> Kiểm tra DB.
- [ ] **Test:** Gán kỹ năng cho nhân viên -> Kiểm tra DB.
- [ ] **Test:** Duplicate dịch vụ -> Kiểm tra thông tin copy.
