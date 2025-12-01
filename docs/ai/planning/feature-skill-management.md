# Implementation Plan - Skill Management Feature

## Goal Description
Implement a comprehensive Skill Management interface within the Admin Services section. This will allow administrators to view, create, update, and delete skills, which are essential for assigning capabilities to services and staff. The UI will be consistent with the existing Service Management interface, utilizing the same design patterns and components.

## User Review Required
> [!IMPORTANT]
> This feature requires adding new types and schemas to the frontend. Please review the proposed data structures.

## Proposed Changes

### Frontend - Features (`frontend/src/features/services`)

#### [MODIFY] [types.ts](file:///d:/Synapse/frontend/src/features/services/types.ts)
- Add `SkillCreateInput` and `SkillUpdateInput` interfaces.

#### [MODIFY] [schemas.ts](file:///d:/Synapse/frontend/src/features/services/schemas.ts)
- Add `skillSchema` using Zod for validation (name, code, description).

#### [MODIFY] [actions.ts](file:///d:/Synapse/frontend/src/features/services/actions.ts)
- Implement `createSkill`, `updateSkill`, and `deleteSkill` server actions.
- Ensure proper error handling and revalidation.

#### [NEW] [skill-table.tsx](file:///d:/Synapse/frontend/src/features/services/components/skill-table.tsx)
- Create a table component to list skills.
- Columns: Name, Code, Description, Actions (Edit, Delete).
- Use `framer-motion` for row animations.
- Use `Badge` for visual enhancements if applicable.

#### [NEW] [skill-form.tsx](file:///d:/Synapse/frontend/src/features/services/components/skill-form.tsx)
- Create a form component for creating and editing skills.
- Fields: Name, Code (auto-generated or manual), Description.
- Use `zod` schema for validation.

#### [NEW] [create-skill-dialog.tsx](file:///d:/Synapse/frontend/src/features/services/components/create-skill-dialog.tsx)
- Create a dialog wrapper for `SkillForm` to handle creation.

#### [NEW] [skill-actions.tsx](file:///d:/Synapse/frontend/src/features/services/components/skill-actions.tsx)
- Create a dropdown menu component for row actions (Edit, Delete).
- Handle delete confirmation.

### Frontend - Pages (`frontend/src/app/(admin)/admin/services`)

#### [MODIFY] [page.tsx](file:///d:/Synapse/frontend/src/app/(admin)/admin/services/page.tsx)
- Update `ServicesPage` to include a new Tab for "Danh sách kỹ năng".
- Fetch skills data (already being fetched, but might need optimization or separate fetching if pagination is needed for skills, though currently `getSkills` returns all).
- Render `SkillTable` and `CreateSkillDialog` within the new tab.

## Verification Plan

### Automated Tests
- None planned for this iteration.

### Manual Verification
1.  **Navigation**: Verify "Danh sách kỹ năng" tab appears in Admin > Services.
2.  **Listing**: Verify skills are listed correctly in the table.
3.  **Creation**:
    - Click "Thêm kỹ năng".
    - Fill form (valid/invalid data).
    - Verify success message and list update.
4.  **Update**:
    - Click "Sửa" on a skill.
    - Change data.
    - Verify updates.
5.  **Deletion**:
    - Click "Xóa" on a skill.
    - Confirm deletion.
    - Verify removal from list.
