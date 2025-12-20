# Analysis Log - Phase 3: Promotions Module

## Ngày: 2025-12-20

### 1. Database Schema Analysis

**Table `promotions`**:
- `id`: UUID (PK)
- `code`: VARCHAR(50) (Unique) - Mã giảm giá
- `name`: VARCHAR(255)
- `discount_type`: Enum ('PERCENTAGE', 'FIXED_AMOUNT')
- `discount_value`: DECIMAL - Giá trị giảm
- `valid_from`: DATE
- `valid_until`: DATE
- `min_order_value`: DECIMAL
- `max_uses`: INTEGER (Optional)
- `current_uses`: INTEGER
- `is_active`: BOOLEAN

**Constraints**:
- `valid_until >= valid_from`
- `discount_value > 0`
- `current_uses <= max_uses`

### 2. Business Logic Analysis

**Validate Promotion (`validate_promotion`)**:
1. Check `is_active = True`.
2. Check `code` tồn tại.
3. Check `today` trong khoảng [`valid_from`, `valid_until`].
4. Check `current_uses < max_uses` (nếu có limit).
5. Check `order_total >= min_order_value`.
6. Trả về: Giá trị giảm giá + Final Price.

**Apply Promotion**:
- Khi Booking thành công (hoặc Invoice payment), tăng `current_uses`.

### 3. API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/promotions` | List (Admin view) |
| POST | `/promotions` | Create |
| GET | `/promotions/{id}` | Detail |
| PUT | `/promotions/{id}` | Update |
| POST | `/promotions/validate` | Validate code & Calculate discount |
| PATCH | `/promotions/{id}/toggle` | Activate/Deactivate |

### 4. Dependencies
- Module `billing` sẽ gọi `promotions` để tính giá.
- Module `bookings` cũng có thể cần hiển thị giá tạm tính.
- Service `PromotionService` sẽ được inject vào `BillingService` (Future).
