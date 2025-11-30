---
title: Service Management Planning
status: Approved
related_design: docs/ai/design/feature-service-management.md
---

# Kế Hoạch Triển Khai: Quản lý Dịch vụ Spa

## Giai đoạn 1: Backend Implementation (FastAPI) - DONE

### Task 1.1: Setup Module & Models - DONE
- [x] Create Directory & Models (`Service`, `Skill`, `ServiceSkill`).
- [x] Migrations (Create tables & Cascade Delete).

### Task 1.2: Implement CRUD Logic - DONE
- [x] Schemas & Service Logic.
- [x] API Routers.

### Task 1.3: Refine for UX (Smart Tagging) - NEW
- [ ] **Update Schema**: `ServiceCreate` chấp nhận thêm `new_skills: list[str]`.
- [ ] **Update Service Logic**:
    - Trong `create_service` và `update_service`:
    - Xử lý danh sách `new_skills`:
        - Slugify tên để tạo `code`.
        - Kiểm tra DB: Nếu chưa có -> Tạo mới.
        - Gộp ID của skill mới vào danh sách `skill_ids` cần gán.

## Giai đoạn 2: Frontend Implementation (Next.js)

### Task 2.1: Setup Feature Structure
- [ ] Create `src/features/services`.
- [ ] Define Types & Server Actions.

### Task 2.2: Service Management UI (Priority)
- [ ] **Smart Service Form**:
    - Input Tên, Giá, Thời gian.
    - **Buffer Time Visualizer**: Thanh progress bar.
    - **Smart Tagging Input**: Combobox cho phép chọn skill cũ hoặc gõ mới (Enter để tạo).
- [ ] **Service Table**:
    - Hiển thị danh sách.
    - Action: Edit, **Duplicate (Clone)**, Delete.

### Task 2.3: Skill Matrix (Employee Module - Later)
- [ ] Dời sang feature `employee-management`.

## Giai đoạn 3: Integration & Testing
- [ ] Verify End-to-End Flow with Smart Tagging.
