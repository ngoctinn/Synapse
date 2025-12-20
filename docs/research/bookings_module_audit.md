# Báo Cáo Rà Soát Module Bookings - Antigravity Agent

**Ngày:** 2025-12-20
**Người thực hiện:** Antigravity Agent
**Mục tiêu:** Rà soát toàn bộ module `bookings` để phát hiện lỗi tiềm ẩn và code rác.

## 1. Phát Hiện Vấn Đề

Qua quá trình rà soát code (`models.py`, `service.py`, `item_manager.py`, `conflict_checker.py`, `schemas.py`), Agent đã phát hiện các vấn đề sau:

### 🔴 Nguy Cơ Cao (High Risk)

1.  **Mất dữ liệu Resource IDs trong API Response:**
    *   **Mô tả:** Schema `BookingItemRead` định nghĩa trường `resource_ids: list[uuid.UUID]`. Tuy nhiên, Model ORM `BookingItem` chỉ có relationship `resources: list[Resource]`. Pydantic (mode `from_attributes=True`) sẽ không tìm thấy attribute `resource_ids` trên ORM object và trả về giá trị mặc định `[]`.
    *   **Hậu quả:** Frontend sẽ không hiển thị được tài nguyên (giường/máy) đã đặt.
    *   **Giải pháp:** Thêm `@property resource_ids` vào Model `BookingItem`.

2.  **Logic `conflict_checker.py` Rối Rắm & Tiềm Ẩn Lỗi:**
    *   **Mô tả:** Trong hàm `check_resource_conflict`, biến `params` được định nghĩa 2 lần. Lần 2 (dòng 149) override lần 1 và **thiếu** key `statuses`. Dù dòng 185 có merge lại ("may mắn" chạy được), nhưng coding style này rất dễ gây lỗi crash nếu ai đó sửa dòng 185. Ngoài ra còn tồn tại khối code `query = text(...)` thừa thãi (dòng 121-130).
    *   **Giải pháp:** Refactor clean code, xóa code thừa, definie `params` một lần duy nhất đầy đủ.

### 🟡 Nguy Cơ Trung Bình (Medium Risk)

3.  **Type Mismatch (Đã Fix):**
    *   Vấn đề cộng `Decimal` và `float` trong `item_manager.py` (Đã được fix).
    *   Vấn đề conflict tên `notes` trong `models.py` (Đã được fix).

4.  **Schema Validation:**
    *   Cần kiểm tra kỹ các trường `list[uuid.UUID]` trong Schemas để đảm bảo Frontend gửi đúng format.

## 2. Kế Hoạch Khắc Phục

1.  **Refactor `BookingItem` Model:** Thêm property `resource_ids` để mapping tự động sang Schema.
2.  **Refactor `ConflictChecker`:** Clean dọn sạch code rác và chuẩn hóa logic binding params.
3.  **Refactor `ConflictChecker` (Staff):** Đảm bảo logic tương tự cũng được áp dụng chuẩn.

---
*Báo cáo được tự động tạo bởi Antigravity Agent.*
