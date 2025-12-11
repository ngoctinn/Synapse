"use client"

import {
  type SelectionConfig,
  type SortConfig,
} from "@/shared/lib/design-system.types"
import { getNestedValue } from "@/shared/lib/object-utils"
import { cn } from "@/shared/lib/utils"
import { Checkbox } from "@/shared/ui/checkbox"
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row"
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"
import { PaginationControls } from "@/shared/ui/custom/pagination-controls"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { ReactNode } from "react"

export interface Column<T> {
  header: string | ReactNode
  accessorKey?: keyof T | string // Allow string for nested keys
  id?: string // For sorting/identifying when accessorKey is nested
  cell?: (item: T) => ReactNode
  className?: string
  headerClassName?: string
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string | number
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  emptyState?: ReactNode
  className?: string
  variant?: "default" | "flush"
  isLoading?: boolean
  skeletonCount?: number
  disabled?: boolean

  // ─────────────────────────────────────────────────────────────────────────
  // Selection - Grouped config (recommended)
  // ─────────────────────────────────────────────────────────────────────────
  /** Grouped selection config - sử dụng thay vì flat props */
  selection?: SelectionConfig

  // ─────────────────────────────────────────────────────────────────────────
  // Selection - Flat props (backward compat, deprecated)
  // ─────────────────────────────────────────────────────────────────────────
  selectable?: boolean
  /** @deprecated Sử dụng selection.isSelected thay thế */
  isSelected?: (id: string | number) => boolean
  /** @deprecated Sử dụng selection.onToggleOne thay thế */
  onToggleOne?: (id: string | number) => void
  /** @deprecated Sử dụng selection.onToggleAll thay thế */
  onToggleAll?: () => void
  /** @deprecated Sử dụng selection.isAllSelected thay thế */
  isAllSelected?: boolean
  /** @deprecated Sử dụng selection.isPartiallySelected thay thế */
  isPartiallySelected?: boolean

  // ─────────────────────────────────────────────────────────────────────────
  // Sorting - Grouped config (recommended)
  // ─────────────────────────────────────────────────────────────────────────
  /** Grouped sort config - sử dụng thay vì flat props */
  sort?: SortConfig

  // ─────────────────────────────────────────────────────────────────────────
  // Sorting - Flat props (backward compat, deprecated)
  // ─────────────────────────────────────────────────────────────────────────
  /** @deprecated Sử dụng sort.column thay thế */
  sortColumn?: string
  /** @deprecated Sử dụng sort.direction thay thế */
  sortDirection?: "asc" | "desc"
  /** @deprecated Sử dụng sort.onSort thay thế */
  onSort?: (column: string) => void

  onRowClick?: (item: T) => void
}


export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  page = 1,
  totalPages = 1,
  onPageChange,
  emptyState,
  className,
  variant = "default",
  isLoading = false,
  skeletonCount = 5,
  disabled = false,

  // Grouped configs (recommended)
  selection,
  sort,

  // Flat props (backward compat)
  selectable = false,
  isSelected: isSelectedProp,
  onToggleOne: onToggleOneProp,
  onToggleAll: onToggleAllProp,
  isAllSelected: isAllSelectedProp,
  isPartiallySelected: isPartiallySelectedProp,
  sortColumn: sortColumnProp,
  sortDirection: sortDirectionProp,
  onSort: onSortProp,

  onRowClick,
}: DataTableProps<T>) {
  // Merge selection config: grouped takes priority, fallback to flat props
  const isSelected = selection?.isSelected ?? isSelectedProp ?? (() => false)
  const onToggleOne = selection?.onToggleOne ?? onToggleOneProp
  const onToggleAll = selection?.onToggleAll ?? onToggleAllProp
  const isAllSelected = selection?.isAllSelected ?? isAllSelectedProp ?? false
  const isPartiallySelected = selection?.isPartiallySelected ?? isPartiallySelectedProp ?? false
  const isSelectable = !!selection || selectable

  // Merge sort config: grouped takes priority, fallback to flat props
  const sortColumn = sort?.column ?? sortColumnProp
  const sortDirection = sort?.direction ?? sortDirectionProp
  const onSort = sort?.onSort ?? onSortProp


  // ─────────────────────────────────────────────────────────────────────────
  const containerClasses = cn(
    "relative w-full overflow-hidden",
    "relative w-full overflow-hidden",
    disabled && "pointer-events-none opacity-60 grayscale",
    variant === "default" && "border rounded-xl shadow-sm bg-background",
    className
  )

  const effectiveColumnCount = isSelectable ? columns.length + 1 : columns.length

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={effectiveColumnCount}
        rowCount={skeletonCount}
        searchable={false}
        filterable={false}
      />
    )
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={containerClasses}>
        <div className="w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/60">
                {isSelectable && (
                  <TableHead className="w-12 pl-6">
                    <Checkbox
                      checked={isAllSelected}
                      // @ts-expect-error - indeterminate is valid
                      indeterminate={isPartiallySelected ? "true" : undefined}
                      onCheckedChange={onToggleAll}
                      aria-label="Chọn tất cả"
                      className="translate-y-[2px]"
                    />
                  </TableHead>
                )}

                {columns.map((col, index) => {
                  const isSorted = sortColumn === col.accessorKey?.toString()
                  return (
                    <TableHead
                      key={index}
                      className={cn(
                        "h-12 font-medium text-muted-foreground transition-colors hover:text-foreground/80",
                        index === 0 && !selectable ? "pl-6" : "",
                        index === columns.length - 1 ? "pr-6 text-right" : "",
                        col.sortable ? "cursor-pointer select-none" : "",
                        col.headerClassName
                      )}
                      onClick={() => {
                        if (col.sortable && onSort && col.accessorKey) {
                          onSort(col.accessorKey.toString())
                        }
                      }}
                    >
                      <div className={cn(
                        "flex items-center gap-2",
                        index === columns.length - 1 && "justify-end"
                      )}>
                        {col.header}
                        {col.sortable && (
                          <span className="flex flex-col items-center justify-center w-4 h-4">
                            {isSorted ? (
                              sortDirection === "asc" ? (
                                <ArrowUp className="h-3.5 w-3.5 text-primary animate-in fade-in zoom-in duration-200" />
                              ) : (
                                <ArrowDown className="h-3.5 w-3.5 text-primary animate-in fade-in zoom-in duration-200" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3 w-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => {
                const itemId = keyExtractor(item)
                const selected = isSelected?.(itemId) ?? false
                const isClickable = !!onRowClick

                return (
                  <AnimatedTableRow
                    key={itemId}
                    index={index}
                    className={cn(
                      "group border-b border-border/40 last:border-0 transition-colors",
                      isClickable && "cursor-pointer hover:bg-muted/50",
                      selected && "bg-primary/5 hover:bg-primary/10"
                    )}
                    onClick={(e) => {
                      if (onRowClick) onRowClick(item)
                    }}
                  >
                    {/* Checkbox Cell */}
                    {isSelectable && (
                      <TableCell className="w-12 pl-6" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selected}
                          onCheckedChange={() => onToggleOne?.(itemId)}
                          aria-label="Chọn hàng"
                          className="translate-y-[2px]"
                        />
                      </TableCell>
                    )}

                    {columns.map((col, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={cn(
                          "py-4",
                          colIndex === 0 && !isSelectable ? "pl-6 font-medium text-foreground" : "",
                          colIndex === 0 && isSelectable ? "font-medium text-foreground" : "",
                          colIndex === columns.length - 1 ? "pr-6 text-right" : "text-muted-foreground",
                          col.className
                        )}
                      >
                        {col.cell
                          ? col.cell(item)
                          : col.accessorKey
                          ? (getNestedValue(item, col.accessorKey) as ReactNode)
                          : null}
                      </TableCell>
                    ))}
                  </AnimatedTableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      {totalPages > 1 && onPageChange && (
        <div className="py-2">
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

