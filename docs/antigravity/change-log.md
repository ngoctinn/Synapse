# Change Log - Antigravity Workflow

## [2025-12-20] Phase 5: Warranty & Chat (Final)

### Cập Nhật Code
- Tạo module `warranty`:
  - `models.py`: `WarrantyTicket` (hỗ trợ images array).
  - `service.py`: CRUD Operations, Auto `resolved_at` logic.
  - `router.py`: API `/warranty-tickets`.
- Tạo module `chat`:
  - `models.py`: `ChatSession`, `ChatMessage` (Sender link to User).
  - `service.py`: `get_or_create_session`, `send_message`, `get_history`.
  - `router.py`: API `/chat/sessions`, `/chat/messages`, `/ws/chat/{session_id}` (placeholder).
- Đăng ký modules vào `src/modules/__init__.py` và `src/app/main.py`.

### Database Changes (Manual Action Required ⚠️)
Chưa có quyền DDL tự động, bạn vui lòng chạy script SQL sau:

```sql
-- 1. WARRANTY
DO $$ BEGIN
    CREATE TYPE warranty_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RESOLVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS warranty_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    images TEXT[],
    status warranty_status DEFAULT 'PENDING' NOT NULL,
    resolution_notes TEXT,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMPTZ
);

-- 2. CHAT
DO $$ BEGIN
    CREATE TYPE chat_session_status AS ENUM ('OPEN', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
    staff_id UUID REFERENCES staff_profiles(user_id) ON DELETE SET NULL,
    status chat_session_status DEFAULT 'OPEN' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    closed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id, created_at);

-- 3. RLS
ALTER TABLE warranty_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified)
CREATE POLICY warranty_read_own ON warranty_tickets FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
CREATE POLICY chat_read_own_session ON chat_sessions FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
CREATE POLICY chat_read_own_msg ON chat_messages FOR SELECT USING (session_id IN (SELECT id FROM chat_sessions WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())));
```

## [2025-12-20] Phase 4: Waitlist & Notifications
... (như cũ)
