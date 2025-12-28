---
phase: testing
title: Chiến lược Kiểm thử Quản lý Dịch vụ
description: Các trường hợp kiểm thử cho module Services.
---

# Chiến lược Kiểm thử: Quản lý Dịch vụ

## Kiểm thử Đơn vị (Unit Tests)

### Backend
- [ ] `test_create_service_with_resources`: Tạo dịch vụ kèm yêu cầu tài nguyên thành công.
- [ ] `test_update_service_is_package`: Chuyển đổi dịch vụ thường thành gói liệu trình.
- [ ] `test_smart_tagging_logic`: Kiểm tra logic regex gán kỹ năng tự động.

### Frontend
- [ ] `test_service_form_validation`: Validate các trường bắt buộc.
- [ ] `test_resource_tab_rendering`: Hiển thị đúng danh sách nhóm tài nguyên.

## Kiểm thử Tích hợp (Integration Tests)
- [ ] `create_service_e2e_flow`: Admin tạo dịch vụ trên UI -> Kiểm tra DB xem `services` và `service_resource_requirements` đã được ghi đúng chưa.

## Kiểm thử Thủ công (Manual Checks)
- [ ] Kiểm tra hiển thị tiền tệ (VND) trên bảng dịch vụ.
- [ ] Kiểm tra trạng thái "Đang hoạt động" / "Ngừng hoạt động".
