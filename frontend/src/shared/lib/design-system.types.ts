/**
 * Design System Types - Shared Types và Enums cho UI Components
 *
 * File này chứa các type definitions dùng chung để đảm bảo
 * consistency giữa các components trong Design System.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Size Variants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Kích thước component chuẩn hóa
 * Sử dụng cho Button, Input, Select, và các form elements khác
 */
export type ComponentSize = "sm" | "default" | "lg" | "xl" | "icon"

// ─────────────────────────────────────────────────────────────────────────────
// Button Variants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Button variants - Export để các component khác (như CustomDialog) có thể validate
 */
export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "soft"
  | "ghost-destructive"

// ─────────────────────────────────────────────────────────────────────────────
// Input Variants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Input variants - Standardize styles for inputs
 */
export type InputVariant = "default" | "glass" | "flat"

// ─────────────────────────────────────────────────────────────────────────────
// DataTable Configs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Config cho row selection trong DataTable
 * Group các props liên quan đến selection thành một interface gọn gàng
 */
export interface SelectionConfig {
  /** Kiểm tra một row có đang được chọn hay không */
  isSelected: (id: string | number) => boolean
  /** Toggle chọn/bỏ chọn một row */
  onToggleOne: (id: string | number) => void
  /** Toggle chọn/bỏ chọn tất cả rows */
  onToggleAll: () => void
  /** Có phải tất cả rows đều được chọn */
  isAllSelected: boolean
  /** Có một số rows được chọn (không phải tất cả) */
  isPartiallySelected?: boolean
}

/**
 * Config cho sorting trong DataTable
 * Group các props liên quan đến sorting thành một interface gọn gàng
 */
export interface SortConfig {
  /** Column đang được sort */
  column: string
  /** Hướng sort */
  direction: "asc" | "desc"
  /** Handler khi click header để sort */
  onSort: (column: string) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Deprecation Helpers
// ─────────────────────────────────────────────────────────────────────────────

const warnedProps = new Set<string>()

/**
 * Helper để log deprecation warning một lần duy nhất
 * Chỉ log trong development mode
 */
export function warnDeprecated(
  component: string,
  oldProp: string,
  newProp: string
): void {
  if (process.env.NODE_ENV !== "development") return

  const key = `${component}:${oldProp}`
  if (warnedProps.has(key)) return

  warnedProps.add(key)
  console.warn(
    `[Design System] "${oldProp}" prop trong ${component} đã deprecated. ` +
      `Vui lòng sử dụng "${newProp}" thay thế.`
  )
}
