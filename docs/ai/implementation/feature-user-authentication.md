---
title: User Authentication Implementation Notes
status: Draft
---

# Feature: User Authentication Implementation

## 1. Implementation Log

### Task: DB-01 (Database Setup)
- [ ] Create migration file using Alembic.
- [ ] Define `public.users` table.
- [ ] Add SQL for Trigger.

### Task: BE-01 (Backend Models)
- [ ] Update `backend/src/modules/users/models.py`.
- [ ] Ensure `User` model matches `public.users` schema.

### Task: FE-01 (Frontend Setup)
- [ ] Install `@supabase/ssr`.
- [ ] Create `frontend/src/shared/lib/supabase/server.ts`.
- [ ] Create `frontend/src/shared/lib/supabase/client.ts`.
- [ ] Create `frontend/src/shared/lib/supabase/middleware.ts`.

## 2. Technical Decisions
- **Supabase Client:** Sử dụng Singleton pattern cho Supabase Client ở phía browser.
- **Middleware:** Matcher sẽ loại trừ các file static (`_next`, `favicon`, images) để tối ưu hiệu năng.

## 3. Challenges & Solutions
- *Pending implementation...*
