---
title: Employee Skill Management Testing
status: draft
---

# Testing Strategy

## 1. Unit Tests (Backend)
- **Test**: `test_create_user_with_skills`
    - Input: Valid user data + valid `skill_ids`.
    - Assert: User created, `user_skills` rows exist.
- **Test**: `test_update_user_skills`
    - Input: Existing user, new list of `skill_ids`.
    - Assert: Old skills removed, new skills added.

## 2. Manual Verification Checklist
- [ ] **Create Staff**:
    1. Open "Mời nhân viên".
    2. Fill info + Select "Massage Body", "Facial".
    3. Submit.
    4. Check Database: `SELECT * FROM user_skills WHERE user_id = ...` -> Should have 2 rows.
    5. Check UI: Staff list shows 2 badges.
- [ ] **Edit Staff**:
    1. Click "Edit" on staff.
    2. Remove "Massage Body".
    3. Save.
    4. Check UI: Only "Facial" remains.
- [ ] **Edge Cases**:
    1. Submit with empty skills list -> Should clear all skills.
    2. Submit with duplicate skill IDs -> Backend should handle gracefully (set logic).
