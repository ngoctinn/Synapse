# Strategic Review: Chat Feature

**Date:** 2025-12-05
**Scope:** `frontend/src/features/chat` & `frontend/src/app/(admin)/admin/chat/page.tsx`

## 1. Logic & Data Flow Analysis

### Current State
- **Prototype Status:** The current implementation is a high-fidelity UI prototype using hardcoded mock data (`mock-data.ts`) and local React state (`useState`).
- **Data Flow:**
    - `ChatPage` acts as the controller, managing `messages` and `selectedId` state.
    - Data is passed down via props to `ChatSidebar` (list) and `ChatWindow` (detail).
    - Message sending updates local state but does not persist.
- **Missing Logic:**
    - No backend integration (Supabase).
    - No real-time subscription (Supabase Realtime).
    - No authentication context usage (currently uses a mock `me` user).
    - No handling of file attachments (UI exists, logic missing).

### Architecture Alignment
- The feature is reasonably self-contained in `features/chat`.
- **FSD Note:** The `page.tsx` directly imports internal components (`ChatLayout`, `ChatSidebar`, `ChatWindow`). In a strict FSD or Modular Monolith approach, these should ideally be exposed via a public API (`features/chat/index.ts`) or a main Container component to decouple the page from the feature's internal structure.

## 2. Code Review

### Standards & Naming
- **Naming:** Consistent and descriptive (`ChatSidebar`, `MessageBubble`, `ChatUser`).
- **Typing:** TypeScript interfaces in `types.ts` are well-defined (`Message`, `Conversation`).
- **Styling:** Uses Tailwind CSS and `cn` utility correctly. File structure uses kebab-case components.

### Security
- **XSS:** Message content is rendered safely using standard React `{message.content}`, preventing XSS attacks.
- **Authorization:** Currently no checks. When implementing backend, strict RLS (Row Level Security) policies on the `messages` and `conversations` tables will be critical.

### Performance
- **Rendering:** `ScrollArea` is used. For a production chat with thousands of messages, virtualization (e.g., `tanstack-virtual`) might be needed, but for "Consultation Chat" volume, standard rendering is likely acceptable.
- **Re-renders:** `MessageInput` controls state on every keystroke. This is standard but can be optimized if lag occurs.

### 3. Strategic Recommendations

### High Priority: Backend Integration Strategy
1.  **Supabase Realtime:** Transition from local state to Supabase Realtime subscriptions.
    -   Listen for `INSERT` on `messages` table.
    -   Listen for `UPDATE` on `conversations` table (unread counts, last message).
2.  **Optimistic Updates:** Implement optimistic UI updates so the user sees their message immediately while it sends in the background. React's `useOptimistic` (Next.js 15) is a good candidate.
3.  **Database Schema:** Ensure the Postgres schema matches `types.ts` (or update types to match schema). Need tables: `conversations`, `participants`, `messages`, `attachments`.

### Medium Priority: Architecture Refinement
-   **Encapsulation:** Create `features/chat/index.ts` to export a main `<ChatFeature />` or `<ChatContainer />` component. This makes the `app/page.tsx` cleaner and strictly a route handler.

### Low Priority: Advanced Features
-   **Typing Indicators:** Use Supabase Presence to show "User is typing...".
-   **Online Status:** Use Supabase Presence for real-time online/offline status.

## 4. Conclusion
The current codebase is a solid visual foundation. The strategic focus must now shift to **Backend Integration** and **State Management** to turn this prototype into a functional product. The UI code is clean and reusable.
