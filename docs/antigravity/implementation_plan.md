# Kế Hoạch Triển Khai Backend - Giai Đoạn 3: Billing & Refactoring

**Mã phiên:** `BACKEND-P3-BILLING-20251219`
**Ngày tạo:** 2025-12-19
**Trạng thái:** THINK (Chờ phê duyệt)

---

## 1. Vấn đề (Problem Statement)

Sau khi rà soát mã nguồn Backend, tôi nhận thấy các vấn đề sau cần giải quyết:
1.  **Sự lặp lại logic (DRY Violation)**: `BookingService` đang tự triển khai logic `_validate_treatment` và `_punch_treatment` thay vì gọi qua `CustomerTreatmentService`. Điều này gây khó khăn cho việc bảo trì.
2.  **Thiếu module Billing**: Hệ thống chưa có khả năng tạo hóa đơn (`Invoice`) và ghi nhận thanh toán (`Payment`).
3.  **Hổng logic hoàn buổi**: Khi một Booking đã hoàn thành (`COMPLETED`) bị hủy hoặc chuyển trạng thái, số buổi liệu trình chưa được hoàn lại (`refund`) vào thẻ của khách.

---

## 2. Mục đích (Goals)

1.  **Refactor Integration**: Chuyển logic xử lý Liệu trình trong `BookingService` sang sử dụng `CustomerTreatmentService`.
2.  **Triển khai Module Billing**:
    *   Tạo bảng `invoices` để lưu trữ thông tin hóa đơn.
    *   Tạo bảng `payments` để ghi nhận các giao dịch thanh toán.
3.  **Tự động hóa luồng tài chính**:
    *   Tự động tạo bản nháp hóa đơn khi Booking chuyển sang `COMPLETED`.
    *   Tự động cập nhật trạng thái hóa đơn khi có thanh toán đủ.

---

## 3. Ràng buộc (Constraints)

- **Kiến trúc**: Tuân thủ Vertical Slice Architecture. Module `bookings` sẽ phụ thuộc vào `customer_treatments` và `billing`.
- **Dữ liệu**: Hóa đơn phải lưu trữ snapshot của giá dịch vụ tại thời điểm thanh toán.
- **Tính nguyên tử**: Các thao tác liên module (Booking -> Treatment, Booking -> Billing) phải chạy trong cùng một Database Transaction.

---

## 4. Chiến lược (Strategy)

### Bước 1: Refactor Bookings & Treatments (Verify Phase 2)
- Inject `CustomerTreatmentService` vào `BookingService`.
- Thay thế các helper private bằng service calls.
- Bổ sung logic `refund_session` trong `BookingService.cancel`.

### Bước 2: Tạo Module Billing
- Folder: `src/modules/billing/`
- Models: `Invoice`, `Payment`.
- Trạng thái hóa đơn: `DRAFT`, `UNPAID`, `PARTIALLY_PAID`, `PAID`, `VOID`.
- Phương thức thanh toán: `CASH`, `BANK_TRANSFER`, `CREDIT_CARD`, `E_WALLET`.

### Bước 3: Tích hợp Booking -> Billing
- Khi `BookingService.complete` được gọi:
    - Ngoài việc punch treatment, sẽ gọi `BillingService.create_invoice_from_booking`.

---

## 5. Giải pháp Chi tiết (Solution)

### 5.1 Models (billing/models.py)
- **Invoice**: `id`, `booking_id`, `customer_id`, `total_amount`, `discount_amount`, `final_amount`, `status`, `notes`.
- **Payment**: `id`, `invoice_id`, `amount`, `payment_method`, `transaction_reference`, `payment_date`.

### 5.2 Service Logic (billing/service.py)
- `create_invoice_from_booking(booking_id)`: Tổng hợp các `BookingItem` để tính tiền.
- `process_payment(invoice_id, amount, method)`: Ghi nhận thanh toán và check xem đã trả đủ chưa để update status Invoice.

---

## 6. Danh sách Task Chi Tiết (SPLIT)

### 3.1 Refactoring (Dọn dẹp nợ kỹ thuật)
- [ ] **3.1.1** Inject `CustomerTreatmentService` vào `BookingService`.
- [ ] **3.1.2** Thay thế `_validate_treatment` và `_punch_treatment` bằng service calls.
- [ ] **3.1.3** Thêm logic `refund_session` vào `BookingService.cancel` (nếu trạng thái cũ là COMPLETED).

### 3.2 Module Billing (Mới)
- [ ] **3.2.1** Khởi tạo folder `src/modules/billing/`.
- [ ] **3.2.2** Định nghĩa Models & Enums.
- [ ] **3.2.3** Định nghĩa Schemas (InvoiceRead, PaymentCreate, v.v.).
- [ ] **3.2.4** Triển khai `BillingService` (CRUD Invoices, CRUD Payments).
- [ ] **3.2.5** Triển khai `BillingRouter`.

### 3.3 Integration & Migrations
- [ ] **3.3.1** Tạo Database Migration cho Billing.
- [ ] **3.3.2** Tích hợp tự động tạo hóa đơn vào `BookingService.complete`.

---

## 7. Kiểm tra Thành công (VERIFY)

- [ ] Booking hoàn thành -> `used_sessions` tăng (qua service).
- [ ] Booking hoàn thành -> Một bản ghi `Invoice` ở trạng thái `UNPAID` được tạo tự động.
- [ ] Thanh toán hóa đơn -> Trạng thái Invoice chuyển sang `PAID`.
- [ ] Hủy Booking đã hoàn thành -> `used_sessions` được hoàn lại (qua service).

---

**⏸️ TRẠNG THÁI: Chờ phê duyệt (THINK stage complete).**
