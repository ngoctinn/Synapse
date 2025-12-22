/**
 * Design Tokens - Layout Sizes
 *
 * Tập trung các giá trị kích thước cố định thường dùng.
 * Thay vì hardcode w-[Xpx] hoặc h-[Xpx], import từ đây để dễ maintain.
 *
 * @example
 * import { LAYOUT_SIZES } from "@/shared/lib/design-tokens";
 *
 * <div className={LAYOUT_SIZES.dialog.md}>...</div>
 */

// Popover/Dropdown widths
export const POPOVER_WIDTHS = {
  sm: "w-[180px]",
  md: "w-[250px]",
  lg: "w-[320px]",
  xl: "w-[400px]",
} as const;

// Dialog sizes
export const DIALOG_WIDTHS = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-[500px]",
  lg: "sm:max-w-[600px]",
  xl: "sm:max-w-[800px]",
  "2xl": "sm:max-w-3xl",
} as const;

// Fixed heights for scroll areas
export const SCROLL_HEIGHTS = {
  xs: "h-[200px]",
  sm: "h-[280px]",
  md: "h-[400px]",
  lg: "h-[500px]",
} as const;

// Min widths for buttons and inputs
export const MIN_WIDTHS = {
  button: "min-w-[100px]",
  "button-lg": "min-w-[140px]",
  input: "min-w-[180px]",
  select: "min-w-[120px]",
  "select-lg": "min-w-[160px]",
} as const;

// Calendar/Timeline minimum widths
export const TIMELINE_WIDTHS = {
  day: "min-w-[80px]",
  week: "min-w-[800px]",
  month: "min-w-[600px]",
} as const;

// Cell heights
export const CELL_HEIGHTS = {
  sm: "min-h-[60px]",
  md: "min-h-[80px]",
  lg: "min-h-[100px]",
} as const;

// Icon sizes (when not using size-X)
export const ICON_SIZES = {
  xs: "h-[14px] w-[14px]",
  sm: "h-[18px] w-[18px]",
  md: "h-[24px] w-[24px]",
  lg: "h-[32px] w-[32px]",
} as const;

// Textarea heights
export const TEXTAREA_HEIGHTS = {
  sm: "min-h-[80px]",
  md: "min-h-[100px]",
  lg: "min-h-[120px]",
  xl: "min-h-[200px]",
} as const;

// Table column widths
export const TABLE_COLUMN_WIDTHS = {
  sm: "w-[100px]",
  md: "w-[140px]",
  lg: "w-[200px]",
  xl: "w-[250px]",
} as const;

// Sidebar widths
export const SIDEBAR_WIDTHS = {
  collapsed: "w-[60px]",
  default: "w-[280px]",
  wide: "w-[320px]",
} as const;

// Header heights
export const HEADER_HEIGHTS = {
  sm: "h-[48px]",
  md: "h-[64px]",
  lg: "h-[72px]",
} as const;

// Mobile nav
export const MOBILE_NAV = {
  height: "h-[66px]",
  itemHeight: "min-h-[44px]",
} as const;

// Decorative elements (blur backgrounds, etc.)
export const DECORATIVE_SIZES = {
  blob: {
    sm: "w-[300px] h-[300px]",
    md: "w-[500px] h-[500px]",
    lg: "w-[700px] h-[700px]",
  },
  blur: {
    sm: "blur-[50px]",
    md: "blur-[100px]",
    lg: "blur-[150px]",
  },
} as const;

// Consolidated export
export const LAYOUT_SIZES = {
  popover: POPOVER_WIDTHS,
  dialog: DIALOG_WIDTHS,
  scroll: SCROLL_HEIGHTS,
  minWidth: MIN_WIDTHS,
  timeline: TIMELINE_WIDTHS,
  cell: CELL_HEIGHTS,
  icon: ICON_SIZES,
  textarea: TEXTAREA_HEIGHTS,
  tableColumn: TABLE_COLUMN_WIDTHS,
  sidebar: SIDEBAR_WIDTHS,
  header: HEADER_HEIGHTS,
  mobileNav: MOBILE_NAV,
  decorative: DECORATIVE_SIZES,
} as const;
