# Analysis Log - Customer Treatments Implementation

**Date:** 2025-12-19
**Scope:** Backend Phase 2 (Treatments)

## 1. Integration Points

### A. Services Module (`src/modules/services`)
- **Model:** `Service` (Existing)
- **Relation:** `CustomerTreatment` has optional `service_id` FK.
- **Goal:** Link a treatment package to a specific service definition (e.g., "10 sessions of Basic Facial").

### B. Bookings Module (`src/modules/bookings`)
- **Service (`service.py`):**
    - **`create` / `add_item`**: Needs validation.
        - Iterate through `booking_items`.
        - If `treatment_id` exists:
            - Query `CustomerTreatment`.
            - Check `customer_id` match.
            - Check `expiry_date >= today`.
            - Check `used_sessions < total_sessions`.
            - *Concurrency:* Need to be careful with double spending if 2 bookings happen simultaneously.
    - **`complete`**: Needs "Punch" logic.
        - Iterate items.
        - `used_sessions += 1`.
        - Check `used_sessions <= total_sessions`.
        - Update Reference: `CustomerTreatment`.

## 2. Decision Log

- **State Machine:**
    - `Punch` happens strictly at `complete()` (Status: IN_PROGRESS -> COMPLETED).
    - `Refund` is NOT required for standard flow because `cancel()` is currently blocked for COMPLETED bookings.
    - *Future Proofing:* Logic `refund_session` will be implemented in `CustomerTreatmentService` but might not be called by `BookingService` yet until we allow "Undo Complete".

- **Dependency Injection:**
    - `BookingService` will import `CustomerTreatment` model directly and use the shared `session` to execute updates within the same transaction. This ensures atomicity.

## 4. Rà soát Mã nguồn hiện tại (Current Code Audit - 20251219)

### A. Mô đun Customers & Customer Treatments
- **Trạng thái:** Đã triển khai Models, Services, Routers và Migrations.
- **Đánh giá:** Code viết sạch, tuân thủ `SQLModel` và `Async`. Tuy nhiên, logic xử lý lỗi (Exceptions) đang nằm rải rác.
- **Lỗ hổng:** Chưa có logic tự động chuyển trạng thái `EXPIRED` cho liệu trình bằng background task.

### B. Mô đun Bookings
- **Vấn đề:** Đang có sự phụ thuộc trực tiếp vào Models của module khác (`CustomerTreatment`) thay vì thông qua Service API.
- **Vấn đề:** Hàm `complete()` đang tự gán logic trừ buổi (Punch) thay vì gọi Service của `customer_treatments`.
- **Thiếu sót:** `cancel()` và `no_show()` chưa có logic hoàn lại buổi hoặc xử lý kỷ luật liệu trình.

### C. Cơ sở dữ liệu (Database)
- Các bảng `customers` và `customer_treatments` đã được tạo thành công trong DB (đã kiểm tra migrations).
- Tuy nhiên, bảng `bookings` vẫn đang dùng `customer_id` trỏ sang `users.id` trong một số logic cũ (cần chuẩn hóa sang trỏ tới bảng `customers`).

## 5. Đề xuất hành động
1. **Dọn nợ kỹ thuật (Refactoring)**: Chuẩn hóa `BookingService` để biến nó thành một "Orchestrator" gọi các service khác thay vì tự xử lý logic của module khác.
2. **Triển khai Billing**: Đây là mảnh ghép còn thiếu để hoàn tất luồng nghiệp vụ "Money Flow".
