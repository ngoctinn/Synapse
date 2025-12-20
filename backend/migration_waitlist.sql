-- Migration: Waitlist Module
-- Date: 2025-12-20

-- 1. Create Waitlist Status Enum
DO $$ BEGIN
    CREATE TYPE waitlist_status AS ENUM ('PENDING', 'NOTIFIED', 'BOOKED', 'EXPIRED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Waitlist Table
CREATE TABLE IF NOT EXISTS waitlist_entries (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,

    preferred_date DATE NOT NULL,
    preferred_time_range_start TIME,
    preferred_time_range_end TIME,

    notes TEXT,
    status waitlist_status NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT valid_time_range CHECK (
        (preferred_time_range_start IS NULL AND preferred_time_range_end IS NULL) OR
        (preferred_time_range_start < preferred_time_range_end)
    )
);

-- 3. Enable RLS
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Policy: Admin & Staff can manage all waitlist entries
CREATE POLICY "Staff can manage all waitlist entries"
ON waitlist_entries
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

-- Policy: Customers can view their own waitlist entries
CREATE POLICY "Customers can view own waitlist entries"
ON waitlist_entries
FOR SELECT
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

-- Policy: Customers can join waitlist (insert)
CREATE POLICY "Customers can join waitlist"
ON waitlist_entries
FOR INSERT
TO authenticated
WITH CHECK (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

-- Policy: Customers can update/cancel their own pending entries
CREATE POLICY "Customers can update own waitlist entries"
ON waitlist_entries
FOR UPDATE
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
  AND status = 'PENDING'
)
WITH CHECK (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_customer ON waitlist_entries(customer_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist_entries(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_preferred_date ON waitlist_entries(preferred_date);
