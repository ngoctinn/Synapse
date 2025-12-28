---
phase: testing
title: Chiến lược Kiểm thử - Services Module Standardization
description: Các kịch bản kiểm thử đảm bảo tính đúng đắn của module Services.
---

# Chiến lược Kiểm thử

## Mục tiêu Độ bao phủ Kiểm thử
**Chúng ta nhắm đến mức độ kiểm thử nào?**

- 100% các hàm CRUD trong `actions.ts` được test.
- Các luồng người dùng chính trên UI được kiểm tra qua Integration tests hoặc thủ công.

## Kiểm thử Đơn vị
**Các thành phần riêng lẻ nào cần kiểm thử?**

### Services Logic
- [ ] Test hàm tạo Slug cho Service Name.
- [ ] Test tính toán giá trị hợp lệ trong Zod schema.

## Kiểm thử Tích hợp
**Chúng ta kiểm thử tương tác thành phần như thế nào?**

- [ ] Tạo một Service mới -> Kiểm tra nó xuất hiện trong bảng.
- [ ] Tạo một Package chứa 2 Service -> Kiểm tra tổng giá và số lượng buổi.
- [ ] Xóa một Service đã nằm trong Package -> Kiểm tra phản hồi lỗi hoặc xử lý mồ côi (orphaned).

## Kiểm thử Đầu cuối (End-to-End)
**Luồng người dùng nào cần xác thực?**

- [ ] Luồng: "Đăng nhập Manager -> Vào Danh mục sản phẩm -> Chuyển tab Gói combo -> Tạo combo mới -> Sửa thông tin combo -> Xóa combo".

## Kiểm thử Thủ công
**Cái gì yêu cầu xác thực của con người?**

- [ ] Kiểm tra hiển thị responsive trên Mobile (Bảng dữ liệu có bị tràn không?).
- [ ] Kiểm tra cảm giác animation khi chuyển tab và mở Sheet.
- [ ] Rà soát ngữ pháp và thuật ngữ spa trong toàn bộ UI.
