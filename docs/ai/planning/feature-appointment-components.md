---
title: Appointment Components Planning
status: draft
---

# Planning: Appointment Components

## 1. Task Breakdown

### Phase 1: Setup & Dependencies
-   [ ] Install `date-fns` locale (vi) if not present.

### Phase 2: Implementation
-   [ ] Implement `DatePicker` with Vietnamese localization.
-   [ ] Implement `TimePicker` (24h format).
-   [ ] Implement `DateTimePicker` (Combo).

### Phase 3: Showcase
-   [ ] Update `/admin/components/page.tsx` to include new components.
-   [ ] Add examples with state management.

## 2. Dependencies
-   `shadcn/ui` Calendar component (already installed).
-   `date-fns`.

## 3. Risks
-   TimePicker UX can be tricky on mobile. Need to ensure touch targets are large enough.
