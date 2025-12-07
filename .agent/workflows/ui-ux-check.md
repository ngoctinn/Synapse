---
description: Ensure UI/UX quality, responsiveness, and data safety across all screens
---

# UI/UX Standardization & Responsive Check

This workflow is designed to ensure that user interfaces are aesthetic, consistent, friendly, responsive, and prevent information loss.

## 1. Aesthetic & Consistency Audit ("Tính thẩm mỹ & Đồng bộ")
- [ ] **Color Palette**: Ensure all colors use the project's CSS variables (e.g., `text-primary`, `bg-muted`). Avoid hardcoded hex values.
- [ ] **Typography**: Verify font hierarchy (H1 -> H6, p, small). Ensure readability (contrast ratios).
- [ ] **Component Consistency**: Use shared UI components (`@/shared/ui/*`) instead of building from scratch.
- [ ] **Visual "Premium" Feel**: 
    - Add subtle transitions (`transition-all duration-200`).
    - Use meaningful icons (Lucide React).
    - Ensure whitespace is generous and consistent (using Tailwind padding/margin classes like `p-4`, `gap-4`).

## 2. Responsiveness Check ("Responsive & Thân thiện")
- [ ] **Mobile First**:
    - Does the layout stack correctly on screens < 640px?
    - Are touch targets at least 44x44px where possible (or comfortable to tap)?
    - Is the text size legible on mobile (min 14px usually, 16px for inputs to verify zoom)?
- [ ] **Tablet/Desktop**:
    - Does the layout expand gracefully?
    - Are strict widths used only when necessary (`max-w-md` instead of `w-[500px]`)?
- [ ] **Overflow Handling**:
    - Check for unintended horizontal scrolling.
    - Ensure extensive content (long text, large tables) has scroll containers (`overflow-auto`) or text truncation (`truncate`).

## 3. Information Integrity Check ("Thông tin không bị mất")
- [ ] **Data Visibility**:
    - Are *all* critical fields visible on mobile? If not, is there an expand/collapse mechanism?
    - Avoid `hidden` on critical data unless there is an alternative view (e.g., specific mobile list item).
- [ ] **Form Safety**:
    - Are destructive actions protected (confirm dialogs)?
    - Does the UI handle "Empty States" gracefully?
    - Are loading states visible to prevent user confusion?

## 4. Work Flow Implementation (Review Process)
1.  **Analyze**: Open the component files and identifying hardcoded styles or fixed dimensions that might break responsiveness.
2.  **Refactor**: Apply Tailwind responsive prefixes (`sm:`, `lg:`) to layout containers.
3.  **Verify**: Simulate mobile viewport (or reason through the logic) to ensure content stacking.
4.  **Polish**: Add hover effects, focusing rings, and transitions.

## Usage
Run this checklist whenever creating or modifying UI components, especially complex views like Grids, Tables, or Forms.
