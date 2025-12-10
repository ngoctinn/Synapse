# Staff Scheduling UX/UI Research Report

## 1. Executive Summary
The Staff Scheduling feature (`StaffScheduler`) is a critical component for operational efficiency. The current implementation uses a custom Grid view, which is standard for shift planning (roster) but differs from appointment booking (timeline).
The current UX is functionally sound but lacks "Premium" feel in terms of feedback, visual hierarchy, and mobile optimization.

## 2. Codebase Analysis (`frontend/src/features/staff/components/scheduling`)

### 2.1. Component Architecture
- **`StaffScheduler`**: Main container, handles state (`useStaffSchedule`) and layout.
- **`ScheduleGrid`**: The core interactive grid.
    - *Interaction*: Supports "Add Shift" (Click), "Remove" (Hover + Click), "Paint Mode" (Drag).
    - *Visuals*: Custom grid implementation using Tailwind.
- **`AddShiftDialog`**: Modal for adding shifts.
    - *Features*: Tabs for "Templates" vs "Custom". Good separation of concerns.

### 2.2. UX/UI Gaps identified
- **Visual Hierarchy**: The grid lines and background colors for days/today could be more distinct.
- **Shift Contrast**: As noted in previous steps, shift colors needed better contrast (Fixed).
- **Empty State**: The grid used to look broken when no staff existed (Fixed).
- **Feedback**: "Paint Mode" is a power feature but lacks visual cues (cursor change is subtle). Users might not know they are in paint mode.
- **Mobile Experience**: The sticky header and columns are handled via CSS, but complex grids are notoriously difficult on mobile. The current `min-w-[1000px]` approach forces horizontal scroll, which is acceptable for admins but not ideal.

## 3. External Research: Best Practices
*(Synthesized from search results)*

### 3.1. Visual Clarity
- **Color Coding**: Essential for differentiating shift types (Morning, Afternoon, Off).
- **Grid Systems**: 8-point grid systems are recommended for consistent spacing.
- **Indicators**: Visual cues for conflicts or special notes within the shift block.

### 3.2. Interaction Patterns
- **Drag & Drop**: The gold standard for rescheduling. Current "Paint Mode" is a variation of this but optimized for *assigning* rather than *moving*.
- **Templates**: Pre-defined shifts save massive amounts of time (Implemented in `AddShiftDialog`).
- **Quick Actions**: Right-click context menus or hover actions for quick deletions/edits.

## 4. Brainstorming Improvements

### Idea 1: Enhanced "Paint Mode" Experience
- **Problem**: Users might forget they are in paint mode.
- **Solution**:
    - Change cursor to a distinct "Brush" or "Eraser" icon.
    - Add a floating toolbar or fixed notification/banner: "Painting Mode Active - Click or Drag to apply".
    - Highlight target cells more aggressively on hover.

### Idea 2: Quick Actions Menu
- **Problem**: Deleting requires finding the small "X" button.
- **Solution**: Implement a Context Menu (Right-click) on shift blocks: "Edit", "Duplicate", "Delete".

### Idea 3: Mobile Card View
- **Problem**: Horizontal scroll on mobile is clunky.
- **Solution**: Reactively switch `ScheduleGrid` to render a vertical list of cards (one card per staff member per day OR one card per day with staff listed) on `< md` screens.

## 5. Mobile Optimization Strategy
Current: `min-w-[1000px]` scroll.
Proposed:
- **Tablet**: Keep scroll.
- **Phone**: Switch to "Day View" by default, or "Staff List" with expanded details.
- **Alternative**: Stacked view where each staff row collapses into a card showing their weekly schedule summary.

## 6. Conclusion & Recommendations
1.  **Immediate**: Polish "Paint Mode" visual feedback (Cursor/Floating Badge).
2.  **Short-term**: Implement Context Menu for shifts.
3.  **Long-term**: Refactor for Mobile-specific view (e.g., vertical list) if usage data shows high mobile admin traffic.
