-- Migration: Add Treatment Notes Table
-- Created: 2025-12-20
-- Description: Thêm bảng treatment_notes cho ghi chú chuyên môn của KTV

-- 1. Create ENUM for note_type
CREATE TYPE note_type AS ENUM ('PROFESSIONAL', 'GENERAL');

-- 2. Create treatment_notes table
CREATE TABLE treatment_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) <= 1000),
    note_type note_type DEFAULT 'PROFESSIONAL' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Create indexes
CREATE INDEX idx_treatment_notes_booking ON treatment_notes(booking_id);
CREATE INDEX idx_treatment_notes_staff ON treatment_notes(staff_id);
CREATE INDEX idx_treatment_notes_created ON treatment_notes(created_at DESC);

-- 4. Enable RLS
ALTER TABLE treatment_notes ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Staff can view notes for bookings they worked on
CREATE POLICY "Staff can view their own notes"
ON treatment_notes FOR SELECT
USING (
    staff_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
);

-- Customers can view notes for their bookings
CREATE POLICY "Customers can view notes for their bookings"
ON treatment_notes FOR SELECT
USING (
    booking_id IN (
        SELECT id FROM bookings
        WHERE customer_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
    )
);

-- Staff can create notes (automatically using their own staff_id)
CREATE POLICY "Staff can create notes"
ON treatment_notes FOR INSERT
WITH CHECK (
    staff_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
);

-- Only the creator can update their own notes (optional - for edit functionality)
CREATE POLICY "Staff can update their own notes"
ON treatment_notes FOR UPDATE
USING (
    staff_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
);

-- Only the creator can delete their own notes (optional)
CREATE POLICY "Staff can delete their own notes"
ON treatment_notes FOR DELETE
USING (
    staff_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
);

-- 6. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON treatment_notes TO authenticated;
GRANT SELECT ON treatment_notes TO anon;  -- If needed for public viewing
