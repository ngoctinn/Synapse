---
phase: planning
title: Lập kế hoạch Quản lý Dịch vụ (MVP)
description: Chia nhỏ nhiệm vụ triển khai cho module Services.
---

# Lập kế hoạch: Quản lý Dịch vụ (MVP)

## Các Mốc quan trọng
- [ ] Mốc 1: Hoàn thiện Backend Schema & Service Layer (Resource Requirements)
- [ ] Mốc 2: Cập nhật Frontend Form & Server Actions
- [ ] Mốc 3: Kiểm thử tích hợp & Xử lý Gói liệu trình (Treatments)

## Phân rã Nhiệm vụ

### Giai đoạn 1: Backend (Core Logic)
- [ ] Task 1.1: Xây dựng module `packages` mới (Models, Service, Router).
- [ ] Task 1.2: Implement logic `Atomic Sync` cho Skills và Resource Requirements trong `ServiceManagementService`.
- [ ] Task 1.3: Cập nhật Pydantic Schemas (`ServiceCreate`, `ServiceUpdate`, `ServiceReadDetailed`) để hỗ trợ Manual Skill Mapping.

### Giai đoạn 2: Frontend (UI/UX)
- [ ] Task 2.1: Cập nhật `ServiceForm` Schema (Zod) cho gán Kỹ năng và Tài nguyên thủ công.
- [ ] Task 2.2: Xây dựng tab **Resources** và cập nhật `PackageForm` để chọn nhiều dịch vụ.
- [ ] Task 2.3: Cập nhật `actions.ts` của cả Services và Packages để đồng bộ dữ liệu.

### Giai đoạn 3: Tích hợp & Kiểm thử
- [ ] Task 3.1: Viết Unit Test cho logic gán tài nguyên ở Backend.
- [ ] Task 3.2: Kiểm thử Manual luồng tạo dịch vụ -> gán tài nguyên -> kiểm tra DB.

## Các Phụ thuộc
- Cần có dữ liệu mẫu của `ResourceGroups` trong DB để test UI.

## Rủi ro & Giảm thiểu
- **Rủi ro:** Logic gán tài nguyên phức tạp ảnh hưởng đến hiệu năng Scheduling.
- **Giảm thiểu:** Giữ schema đơn giản (chỉ gán Group thay vì gán trực tiếp ID máy).
