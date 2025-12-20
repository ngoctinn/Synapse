# Change Log - Antigravity Workflow

## [2025-12-20] Phase 3: Promotions Module

### Cập Nhật Code
- Tạo module mới: `backend/src/modules/promotions/`
  - `models.py`: Định nghĩa `Promotion` entity và `DiscountType` enum.
  - `schemas.py`: `PromotionCreate`, `PromotionUpdate`, `ValidatePromotionRequest`, `ValidatePromotionResponse`.
  - `service.py`: `PromotionService` với CRUD và logic `validate_code` (kiểm tra ngày, số lượt, min order).
  - `router.py`: API endpoints standard.
  - `exceptions.py`: Custom errors.
- Đăng ký module:
  - Import vào `backend/src/modules/__init__.py`.
  - Include router vào `backend/src/app/main.py`.

### Database Changes (Manual Action Required ⚠️)
Do lỗi `Permission Denied` khi Agent chạy migration, bạn vui lòng chạy SQL sau trên Supabase SQL Editor:
```sql
-- 1. Create Enum
DO $$ BEGIN
    CREATE TYPE discount_type AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Table
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type discount_type NOT NULL,
    discount_value DECIMAL(12, 2) NOT NULL,
    min_order_value DECIMAL(12, 2) DEFAULT 0,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_discount_value_positive CHECK (discount_value > 0),
    CONSTRAINT chk_valid_dates CHECK (valid_until >= valid_from),
    CONSTRAINT chk_uses CHECK (max_uses IS NULL OR current_uses <= max_uses)
);

-- 3. Index & RLS
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code) WHERE is_active = TRUE;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY promotions_read_public ON promotions FOR SELECT USING (is_active = TRUE);
```

## [2025-12-20] Phase 2: Scheduling Engine Expansion (Auto Reschedule)
... (như cũ)
