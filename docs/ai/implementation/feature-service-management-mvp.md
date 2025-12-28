---
phase: implementation
title: Hướng dẫn Triển khai Quản lý Dịch vụ
description: Các lưu ý kỹ thuật khi code module Services.
---

# Hướng dẫn Triển khai: Quản lý Dịch vụ

## Cấu trúc Mã
- **Backend:** `src/modules/services/`
- **Frontend Features:** `src/features/services/`

## Ghi chú Triển khai

### 1. Sync Resource Requirements
Sử dụng mô hình xóa và chèn lại trong một Transaction:
```python
# Ví dụ logic trong service.py
async def update_resource_requirements(service_id, requirements_in):
    await session.exec(delete(ServiceResourceRequirement).where(service_id=service_id))
    for req in requirements_in:
        session.add(ServiceResourceRequirement(service_id=service_id, **req))
```

### 2. Frontend Tabs trong Form
Sử dụng `Tabs` từ `shared/ui` để chia nhỏ form phức tạp:
- `GeneralTab`: Thông tin cơ bản + Package config.
- `ResourcesTab`: Quản lý Resource requirements.
- `SkillsTab`: Quản lý Skills (Smart Tagging).

## Xử lý Lỗi
- Ném ra `HTTPException(400)` nếu `is_package` là true nhưng `total_sessions` < 0.
- Đảm bảo `capacity` của Resource Group luôn > 0.

## Bảo mật
- Backend-for-Frontend (BFF): Sử dụng Server Actions để gọi API FastAPI, không gọi trực tiếp từ Client.
