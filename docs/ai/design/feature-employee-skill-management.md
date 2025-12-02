---
title: Employee Skill Management Design
status: draft
---

# Design: Employee Skill Management

## 1. Architecture Changes
- **Pattern**: Modular Monolith (Vertical Slice).
- **Module**: `users` module will now interact with `skills` (from `services` module) via a junction table.
- **Data Flow**:
    1.  Frontend sends `skill_ids` (UUIDs) in `InviteStaffRequest`.
    2.  Backend `UserService` validates IDs.
    3.  Backend creates `User` record -> creates `UserSkill` records in transaction.

## 2. Database Schema
### New Table: `user_skills`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | UUID | PK, FK(users.id) | ID nhân viên |
| `skill_id` | UUID | PK, FK(skills.id) | ID kỹ năng |

*Note: Composite Primary Key (user_id, skill_id).*

### Model Updates
- **User**: Add `skills: list["Skill"] = Relationship(...)`
- **Skill**: Add `users: list["User"] = Relationship(...)`

## 3. API Design

### `POST /api/v1/users/invite` (Updated)
- **Request Body**:
  ```json
  {
    "email": "staff@example.com",
    "role": "technician",
    "skill_ids": ["uuid-1", "uuid-2"] // Changed from int[] to uuid[]
  }
  ```

### `PUT /api/v1/users/{id}/skills` (New)
- **Purpose**: Update skills for an existing user.
- **Request Body**:
  ```json
  {
    "skill_ids": ["uuid-1", "uuid-3"]
  }
  ```
- **Behavior**: Replace all existing skills with the new list (Sync strategy).

## 4. UI Components

### `SkillSelector` (New Component)
- **Type**: Client Component.
- **Library**: `shadcn/ui` (Command, Popover, Badge).
- **Features**:
    - Searchable dropdown.
    - Multi-select with checkboxes.
    - Display selected tags.
- **Usage**: Embedded in `InviteStaffModal` and `StaffModal`.

### `StaffTable` (Update)
- **Column**: "Kỹ năng".
- **Display**: Show first 2 skills as Badges, others in "+X more" tooltip.
