---
title: Employee Skill Management Implementation
status: draft
---

# Implementation Notes

## Backend
- **File**: `backend/src/modules/users/models.py`
    - Use `link_model=UserSkill` for the relationship.
- **File**: `backend/src/modules/users/service.py`
    - Use `session.exec()` to fetch existing skills before updating.
    - Remember to `await session.commit()` after changes.

## Frontend
- **File**: `frontend/src/features/staff/components/skill-selector.tsx`
    - Use `cmdk` (Command) primitive from shadcn/ui.
    - Fetch skills using a server action or `useQuery` hook (if available), or pass as props.
    - *Decision*: Pass skills as props to the Modal to keep the component pure, or fetch inside if it's a server component wrapper. Given Modals are Client Components, fetching in the parent Page and passing down is better for data consistency.

## Error Handling
- If a `skill_id` is invalid (does not exist), the Backend should raise `400 Bad Request`.
- Frontend should validate that at least 1 skill is selected if the role is Technician (optional but recommended).
