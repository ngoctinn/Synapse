# Change Log - Antigravity Workflow

## [2025-12-20] Phase 4: Waitlist & Notifications (Email Only)

### Cập Nhật Code
- Tạo module `waitlist`:
  - `models.py`: `WaitlistEntry`, `WaitlistStatus`.
  - `service.py`: CRUD Operations.
  - `router.py`: API `/waitlist`.
- Tạo module `notifications`:
  - `models.py`: `NotificationTemplate` (Email templates).
  - `service.py`: `send_email` (Mock implementation), Template CRUD.
  - `router.py`: API `/notifications/send-email` (Test), `/notifications/templates` (Config).
- Đăng ký modules vào `src/modules/__init__.py` và `src/app/main.py`.

### Database Changes (Manual Action Required ⚠️)
Chưa có quyền DDL tự động, bạn vui lòng chạy script SQL sau:

```sql
-- 1. WAITLIST
DO $$ BEGIN
    CREATE TYPE waitlist_status AS ENUM ('PENDING', 'NOTIFIED', 'BOOKED', 'EXPIRED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS waitlist_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    preferred_date DATE NOT NULL,
    preferred_time_range_start TIME,
    preferred_time_range_end TIME,
    notes TEXT,
    status waitlist_status DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. NOTIFICATIONS (TEMPLATES)
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    subject_template VARCHAR(255) NOT NULL,
    body_template TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. RLS
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for dev)
CREATE POLICY waitlist_customer_insert ON waitlist_entries FOR INSERT WITH CHECK (true);
CREATE POLICY waitlist_read_own ON waitlist_entries FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
CREATE POLICY waitlist_admin_all ON waitlist_entries FOR ALL USING (auth.role() = 'service_role'); -- OR admin check result

CREATE POLICY templates_read_all ON notification_templates FOR SELECT USING (true);
```

## [2025-12-20] Phase 3: Promotions Module
... (như cũ)
