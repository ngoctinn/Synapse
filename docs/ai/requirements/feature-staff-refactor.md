---
title: Staff Feature Refactoring
status: Draft
priority: High
assignee: AI
---

# Staff Feature Refactoring

## 1. Problem Statement
The current Staff Management feature (`frontend/src/features/staff`) functions correctly but lacks the "Premium" aesthetic and refined User Experience (UX) required by the Synapse project. The UI components, while using Shadcn UI, need better composition, spacing, and visual hierarchy. The code structure is generally clean but can be improved for better maintainability and scalability.

## 2. Goals
- **Elevate UX/UI:** Transform the interface to match a "Premium" standard (modern, clean, spacious, polished).
- **Clean Code:** Ensure all components strictly adhere to the project's coding standards (Shadcn UI reuse, no hardcoded values, proper typing).
- **Maintainability:** Refactor complex components (like `ScheduleGrid`) into smaller, more manageable pieces.
- **Consistency:** Ensure the design is consistent with the rest of the Admin Dashboard.

## 3. User Stories
- **As an Admin**, I want a visually appealing and easy-to-scan list of staff members so I can quickly find who I'm looking for.
- **As an Admin**, I want to easily assign permissions without getting lost in a large grid of checkboxes.
- **As an Admin**, I want an intuitive way to view and manage staff schedules without visual clutter.
- **As a User**, I want smooth animations and clear feedback when interacting with the system (e.g., hovering, clicking, saving).

## 4. Success Criteria
- [ ] The Staff List view looks polished, with improved Badge styling and clear columns.
- [ ] The Schedule Grid is easy to read and interact with.
- [ ] The Permission Matrix is legible and intuitive.
- [ ] All "magic strings" and hardcoded configs are moved to constants/types.
- [ ] No raw HTML/Tailwind spaghetti code; proper component abstraction is used.

## 5. Constraints & Assumptions
- **Tech Stack:** Next.js 15, Tailwind CSS, Shadcn UI, Lucide React.
- **Language:** Vietnamese (vi-VN).
- **Design:** Must follow the "Premium" aesthetic (clean, whitespace, subtle shadows).

## 6. Open Questions
- Should we add a "Role" filter to the Staff List? (Assumption: Yes, it improves UX).
- Should the Schedule Grid support drag-and-drop? (Assumption: It already has `dnd-kit`, so yes, we should refine it).
