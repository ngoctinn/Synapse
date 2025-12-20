-- Migration: Warranty Module (Treatment-based)
-- Date: 2025-12-20

-- 1. Create Warranty Status Enum
DO $$ BEGIN
    CREATE TYPE warranty_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RESOLVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Warranty Table
CREATE TABLE IF NOT EXISTS warranty_tickets (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    treatment_id UUID REFERENCES customer_treatments(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,

    description TEXT NOT NULL,
    images TEXT[], -- Array of image URLs

    status warranty_status NOT NULL DEFAULT 'PENDING',
    resolution_notes TEXT,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT description_length CHECK (char_length(description) >= 10)
);

-- 3. Enable RLS
ALTER TABLE warranty_tickets ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Policy: Admin & Staff can manage all tickets
CREATE POLICY "Staff can manage all warranty tickets"
ON warranty_tickets
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

-- Policy: Customers can view their own tickets
CREATE POLICY "Customers can view own warranty tickets"
ON warranty_tickets
FOR SELECT
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

-- Policy: Customers can create warranty tickets
CREATE POLICY "Customers can create warranty tickets"
ON warranty_tickets
FOR INSERT
TO authenticated
WITH CHECK (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_warranty_customer ON warranty_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_warranty_treatment ON warranty_tickets(treatment_id);
CREATE INDEX IF NOT EXISTS idx_warranty_status ON warranty_tickets(status);
