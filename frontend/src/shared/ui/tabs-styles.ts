/**
 * Tabs Styling Constants
 *
 * Centralized styling cho TabsList và TabsTrigger để đảm bảo tính nhất quán
 * trên toàn bộ ứng dụng và tránh code duplication.
 */

// =============================================================================
// PAGE-LEVEL TABS (Dùng cho header của các trang chính)
// =============================================================================

/** TabsList cho page-level navigation (customers, staff, resources, services) */
export const PAGE_TABS_LIST_CLASS =
  "h-9 bg-muted/50 p-1 w-full md:w-auto justify-start"

/** TabsTrigger cho page-level navigation */
export const PAGE_TABS_TRIGGER_CLASS =
  "data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 min-w-[100px] transition-all duration-200 flex-1 md:flex-none"

// =============================================================================
// FORM TABS (Dùng bên trong Sheet/Dialog cho các form phức tạp)
// =============================================================================

/** TabsList cho form sections (customer-form, staff-form, resource-form) */
export const FORM_TABS_LIST_CLASS =
  "grid w-full bg-muted/60 rounded-lg p-1 mb-6 h-11"

/** TabsTrigger cho form sections */
export const FORM_TABS_TRIGGER_CLASS =
  "data-[state=active]:bg-background data-[state=active]:shadow-sm"

// =============================================================================
// SHEET TABS (Dùng bên trong Sheet để switch content views)
// =============================================================================

/** TabsList cho sheet content navigation */
export const SHEET_TABS_LIST_CLASS =
  "grid w-full mb-6 bg-muted/50 rounded-lg p-1 h-10"

/** TabsTrigger cho sheet content */
export const SHEET_TABS_TRIGGER_CLASS =
  "data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium transition-all duration-200"

// =============================================================================
// HELPER: Tạo grid-cols class dựa trên số lượng tabs
// =============================================================================

export function getFormTabsGridCols(count: 2 | 3 | 4 | 5): string {
  const gridMap: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  }
  return gridMap[count] || "grid-cols-2"
}
