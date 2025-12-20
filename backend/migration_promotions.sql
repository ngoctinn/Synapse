-- Migration: Promotions Module
-- Date: 2025-12-20

-- 1. Create Discount Type Enum
DO $$ BEGIN
    CREATE TYPE discount_type AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Promotions Table
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type discount_type NOT NULL,
    discount_value DECIMAL(12, 2) NOT NULL,
    min_order_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
    max_uses INTEGER,
    current_uses INTEGER NOT NULL DEFAULT 0,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT positive_discount_value CHECK (discount_value > 0),
    CONSTRAINT positive_min_order CHECK (min_order_value >= 0),
    CONSTRAINT valid_date_range CHECK (valid_until >= valid_from)
);

-- 3. Enable RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Policy: Admin & Staff can manage all promotions
CREATE POLICY "Staff can manage promotions"
ON promotions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('ADMIN', 'STAFF')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('ADMIN', 'STAFF')
  )
);

-- Policy: Everyone can view active promotions
CREATE POLICY "Everyone can view active promotions"
ON promotions
FOR SELECT
TO public, authenticated
USING (
  is_active = true
  AND CURRENT_DATE BETWEEN valid_from AND valid_until
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_valid_dates ON promotions(valid_from, valid_until);
