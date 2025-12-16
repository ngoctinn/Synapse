# Analysis Log - Refactor Service Categories

## 1. Analysis of Existing Codebase
- **Feature Directory**: `frontend/src/features/services`
- **Current State**:
    - `types.ts`: `Service` has `category?: string | null`. No `Category` entity.
    - `mocks.ts`: `MOCK_SERVICES` has hardcoded strings for categories like "Massage", "Facial".
    - `service-form.tsx`: Uses `useFormContext`. `ServiceBasicInfo` sub-component handles basic fields but MISSING category input.
    - `service-table.tsx`: Columns are Name, Duration, Price, Skills, Status. MISSING Category column/badge.
    - `services-page.tsx`: Likely orchestrates data fetching (using mocks currently?).

## 2. Impact Assessment
- **Breaking Changes**: Changing `category` from `string` to structured `Category` might break if not handled carefully, but since we are doing Mock Data refactor using a fresh component, we can transition smoothly.
- **Dependencies**: `dnk-kit` needs to be installed or available. I'll check `package.json` to see if dnd-kit is available, otherwise I might use standard HTML5 drag-and-drop or suggest adding it. The prompt assumes I can "Only do UXUI mock data", implying I should use available tools. If dnd-kit is missing, I'll use a simple array move logic + basic drag events or check if `lucide-react` icons are enough for visual "drag handle".
- **UI Libraries**: Project uses `shadcn/ui` (Radix UI).

## 3. Plan Refinement
- Create `Category` interface.
- Create `MOCK_CATEGORIES`.
- Implement `CategoryManagerDialog` using `shadcn/dialog` (or similar).
- Implement `CategorySortableList`. I'll check for `dnd-kit` existence.
- Update `ServiceForm` to use `Select` for Categories.
