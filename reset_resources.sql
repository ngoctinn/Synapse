# CHANGE LOG UPDATE - RESOURCE MODEL REFACTOR - RESET SCRIPT

## [CRITICAL] DATABASE RESET & MIGRATION SCRIPT

⚠️ **WARNING: This script will DROP relevant tables and recreate them. DATA WILL BE LOST.**

Please run the following SQL block in your Supabase SQL Editor:

```sql
-- 1. Enable Hash Extensions
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2. Drop Dependent Tables (Cascade)
DROP TABLE IF EXISTS service_resource_requirements CASCADE;
DROP TABLE IF EXISTS booking_item_resources CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS resource_groups CASCADE;

-- 3. Update/Recreate Enums
-- Recreate resource_type strictly to avoid conflict if already exists
DROP TYPE IF EXISTS resource_type CASCADE;
CREATE TYPE resource_type AS ENUM ('BED', 'EQUIPMENT');

-- Ensure resource_status exists
DO $$ BEGIN
    CREATE TYPE resource_status AS ENUM ('ACTIVE', 'MAINTENANCE', 'INACTIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. Recreate Resource Tables
CREATE TABLE resource_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type resource_type NOT NULL,
    description TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES resource_groups(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE,
    status resource_status DEFAULT 'ACTIVE',
    setup_time_minutes INTEGER DEFAULT 0,
    description TEXT,
    image_url TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE service_resource_requirements (
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    group_id UUID REFERENCES resource_groups(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (service_id, group_id)
);

-- 5. Booking Item Update (Alter Table or Recreate Junction)
-- If booking_items table exists, we drop the old column.
-- NOTE: If you want a FULL RESET of everything, run Truncate.
-- Assuming we keep booking_items but modify structure:
ALTER TABLE booking_items DROP COLUMN IF EXISTS resource_id;

-- Create Junction Table
CREATE TABLE booking_item_resources (
    booking_item_id UUID REFERENCES booking_items(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    PRIMARY KEY (booking_item_id, resource_id)
);

-- 6. Verify Indexes
CREATE INDEX IF NOT EXISTS idx_booking_item_resources_resource_id ON booking_item_resources(resource_id);

```
