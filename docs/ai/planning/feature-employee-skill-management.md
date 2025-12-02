---
title: Employee Skill Management Planning
status: draft
---

# Planning: Employee Skill Management

## 1. Task Breakdown

### Phase 1: Backend Foundation (Estimated: 2 hours)
- [ ] **DB Migration**: Create `user_skills` table.
- [ ] **Model Update**: Update `User` and `Skill` SQLModel classes.
- [ ] **Schema Update**: Fix `InviteStaffRequest` types.
- [ ] **Service Logic**: Implement `update_skills` and fix `invite_staff`.
- [ ] **API Endpoint**: Expose `PUT /users/{id}/skills`.

### Phase 2: Frontend Components (Estimated: 2 hours)
- [ ] **Type Sync**: Update `Staff` interface in `types.ts`.
- [ ] **Component**: Build `SkillSelector` (Multi-select).
- [ ] **Integration**: Add `SkillSelector` to `InviteStaffModal`.
- [ ] **Integration**: Add `SkillSelector` to `StaffModal` (Edit mode).
- [ ] **Display**: Verify `StaffTable` rendering.

### Phase 3: Verification (Estimated: 0.5 hours)
- [ ] **E2E Test**: Create staff -> Assign Skills -> Verify in DB -> Verify in UI.
- [ ] **Regression Test**: Ensure existing staff without skills still load correctly.

## 2. Dependencies
- `services` module must have some skills created (Seed data required if empty).

## 3. Risks & Mitigation
- **Risk**: Circular dependency between `users` and `services` modules.
    - *Mitigation*: Use string forward references (`"Skill"`) in SQLModel relationships.
- **Risk**: Migration conflict.
    - *Mitigation*: Run `alembic revision --autogenerate` carefully and review output.
