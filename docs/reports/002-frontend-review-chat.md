# Frontend Review: Chat Feature

**Date:** 2025-12-05
**Scope:** `frontend/src/features/chat`

## 1. Compliance Check (FSD & Next.js)

### Feature-Sliced Design (FSD)
-   **Structure:** The internal structure (`components`, `data`, `types.ts`) is good.
-   **Violation (Medium):** Missing Public API. `frontend/src/app/(admin)/admin/chat/page.tsx` imports deeply from inner components:
    ```typescript
    import { ChatLayout } from '@/features/chat/components/chat-layout'; // Violation
    ```
    **Fix:** Create `frontend/src/features/chat/index.ts` and export the necessary components. Ideally, export a composite `ChatContainer` so the page doesn't need to assemble `Layout` + `Sidebar` + `Window` manually.

### Next.js 16 & React Clean Code
-   **Client Components:** Correctly uses `"use client"` in `page.tsx`.
-   **Hooks:** `useEffect` and `useRef` usage in `chat-window.tsx` for scrolling is correct.
-   **State:** Uses `useState` for local state. **Note:** This will need to be replaced or augmented with Server Actions/SWR when integrating backend.
-   **Data Fetching:** Currently using `MOCK_DATA`. No waterfall issues *yet*.

## 2. UI/UX "Premium Spa" Review

### Typography & Aesthetics
-   **Fonts:** Uses `font-serif` for headings (e.g., "Tin nhắn", "Chào mừng..."), which aligns well with the Premium Spa theme.
-   **Glassmorphism:** Uses `bg-white/50`, `backdrop-blur-md`, `glass-card`. This creates a modern, airy feel.
-   **Colors:** Uses `text-primary` (Teal/Ocean) and `bg-secondary` (Sage/Mist) effectively.
-   **Spacing:** `p-4`, `gap-3` usage is consistent.

### Interactions & Animations
-   **Hover Effects:** Sidebar items have good hover states (`hover:bg-accent/50`).
-   **Animations:** Uses `animate-scale-in` for unread badges and `animate-bounce-subtle` for empty states. This adds a nice "alive" feeling.
-   **ScrollArea:** Uses custom `ScrollArea` component, ensuring consistent scrollbars.

### Improvement Opportunities (Brainstorming)
1.  **Mobile Responsiveness:** The `ChatLayout` currently has a fixed generic layout. On mobile, the Sidebar should likely overlay or be a separate view from the ChatWindow (Master-Detail pattern). Currently, `w-80` for sidebar might break on small screens.
2.  **Empty State Illustration:** The SVG in `ChatWindow` empty state is a generic path. Consider using a custom premium illustration or a more refined icon.
3.  **Input Area Polish:** The `MessageInput` is decent but could use a "focus-within" ring effect on the whole container to make it feel like one solid interactive unit.

## 3. Action Plan (for Refactor)

1.  **Create Public API:**
    -   Create `frontend/src/features/chat/index.ts`.
    -   Export `ChatFeature` (refactored main component).
2.  **Refactor Page:**
    -   Update `page.tsx` to clear deep imports and use the new Public API.
3.  **Enhance Mobile:**
    -   Add responsive classes to `ChatLayout` (e.g., `hidden md:flex`) or implement a drawer for mobile sidebar.

## 4. Conclusion
The frontend implementation is high-quality and aligns well with the design system. The main technical debt is the **Deep Import violation** and the **Lack of Mobile Responsiveness** logic.
