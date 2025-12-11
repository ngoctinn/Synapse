# Kế hoạch Triển khai: Customer 360 & Tối ưu UX

## Goal Description
Nâng cấp module Khách hàng từ việc quản lý thông tin cơ bản sang mô hình "Customer 360". Cải thiện trải nghiệm Lễ tân bằng cách tổ chức lại `CustomerForm` thành các Tabs logic (Thông tin chung, Sức khỏe, Thành viên), thêm cảnh báo trực quan (Visual Alerts) cho các thông tin y tế quan trọng và bổ sung các trường dữ liệu thiếu sót.

## User Review Required
> [!NOTE]
> Giao diện sẽ thay đổi đáng kể từ dạng cuộn dọc sang dạng Tabs ngang.
> Một số trường mới (`loyalty_points`, `preferred_staff_id`) sẽ được thêm vào Schema nhưng có thể chưa có Backend logic tương ứng (Mocking).

## Proposed Changes

### Frontend - Shared UI
- **Kiểm tra/Bổ sung**: Đảm bảo `Tabs`, `Badge` components sẵn sàng (đã có trong `shared/ui`).

### Frontend - Features/Customers
#### [MODIFY] [schemas.ts](file:///e:/Synapse/frontend/src/features/customers/model/schemas.ts)
- Cập nhật Zod Schema để validate các trường mới: `preferred_staff_id`, `loyalty_points`.
- Đảm bảo `allergies` và `medical_notes` được xử lý đúng.

#### [MODIFY] [customer-form.tsx](file:///e:/Synapse/frontend/src/features/customers/components/customer-form.tsx)
- **Refactor Layout**: Chuyển đổi từ `div` space-y sang `Tabs` component.
- **Tab 1 (Hồ sơ)**: Tên, SĐT, Email, Giới tính, Ngày sinh, Địa chỉ.
- **Tab 2 (Sức khỏe)**: Dị ứng (Giao diện cảnh báo đỏ), Ghi chú y tế.
- **Tab 3 (Thành viên)**: Hạng thẻ, Điểm tích lũy, Nhân viên ưu thích.

#### [MODIFY] [customer-sheet.tsx](file:///e:/Synapse/frontend/src/features/customers/components/customer-sheet.tsx)
- Cập nhật Header để hiển thị "Badges" tóm tắt (Ví dụ: Badge "Dị ứng" nếu khách có tiền sử).

## Verification Plan

### Automated Tests
- Chạy `npm run lint` để đảm bảo không lỗi cú pháp.

### Manual Verification
1. Mở `CustomerSheet` (Create mode) -> Kiểm tra giao diện Tabs mặc định.
2. Nhập liệu đầy đủ các tab -> Submit -> Kiểm tra Toast success.
3. Mở `CustomerSheet` (Update mode) với khách có `allergies` -> Kiểm tra Badge cảnh báo đỏ trên Header và trong Tab Sức khỏe.
