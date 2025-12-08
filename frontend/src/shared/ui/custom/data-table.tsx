"use client"

import { cn } from "@/shared/lib/utils"
import { Checkbox } from "@/shared/ui/checkbox"
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row"
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"
import { PaginationControls } from "@/shared/ui/custom/pagination-controls"
import {
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
  accessorKey?: keyof T
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
  // Selection props
  /** Bật chế độ chọn row */
  selectable?: boolean
  /** Kiểm tra item có được chọn không */
  isSelected?: (id: string | number) => boolean
  /** Handler toggle selection một row */
  onToggleOne?: (id: string | number) => void
  /** Handler toggle select all */
  onToggleAll?: () => void
  /** Tất cả đang được chọn */
  isAllSelected?: boolean
  /** Một số đang được chọn (indeterminate) */
  isPartiallySelected?: boolean
  // Sorting & Interaction
  sortColumn?: string
  sortDirection?: "asc" | "desc"
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
  // Selection
  selectable = false,
  isSelected,
  onToggleOne,
  onToggleAll,
  isAllSelected = false,
  isPartiallySelected = false,
  // Sorting & Interaction
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
}: DataTableProps<T>) {
  const containerClasses = cn(
    "relative bg-background",
    variant === "default" && "border rounded-xl shadow-sm",
    className
  )

  // Thêm padding cho skeleton nếu có selection
  const effectiveColumnCount = selectable ? columns.length + 1 : columns.length

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
        <table className="w-full caption-bottom text-sm min-w-[800px]">
          <TableHeader className="sticky top-[var(--header-height-mobile,109px)] md:top-[var(--header-height,57px)] z-20 backdrop-blur-md bg-background/95 shadow-sm after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border/50">
            <TableRow className="hover:bg-transparent border-none">
              {/* Checkbox Header */}
              {selectable && (
                <TableHead className="w-12 pl-6 bg-transparent">
                  <Checkbox
                    checked={isAllSelected}
                    // @ts-expect-error - indeterminate is valid
                    indeterminate={isPartiallySelected ? "true" : undefined}
                    onCheckedChange={onToggleAll}
                    aria-label="Chọn tất cả"
                    className="translate-y-[2px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableHead>
              )}

              {columns.map((col, index) => {
                const isSorted = sortColumn === col.accessorKey?.toString()

                return (
                  <TableHead
                    key={index}
                    className={cn(
                      "bg-transparent h-14 font-medium text-muted-foreground transition-colors hover:text-foreground",
                      // Nếu có selectable thì không cần pl-8 cho cột đầu
                      index === 0 && !selectable ? "pl-8" : "",
                      index === columns.length - 1 ? "pr-8 text-right" : "",
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
                              <ArrowUp className="h-4 w-4 text-primary animate-in fade-in zoom-in duration-200" />
                            ) : (
                              <ArrowDown className="h-4 w-4 text-primary animate-in fade-in zoom-in duration-200" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-50 transition-opacity" />
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

              return (
                <AnimatedTableRow
                  key={itemId}
                  index={index}
                  className={cn(
                    "group transition-all duration-200 border-b border-border/40 last:border-0",
                    onRowClick ? "cursor-pointer hover:bg-muted/50 active:bg-muted/70" : "hover:bg-muted/30",
                    selected && "bg-primary/5 hover:bg-primary/10"
                  )}
                  onClick={(e) => {
                    // Prevent row click when clicking specific interactive elements if needed
                    // But generally good to just fire it
                    if (onRowClick) onRowClick(item)
                  }}
                >
                  {/* Checkbox Cell */}
                  {selectable && (
                    <TableCell className="w-12 pl-6" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => onToggleOne?.(itemId)}
                        aria-label="Chọn hàng"
                        className="translate-y-[2px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </TableCell>
                  )}

                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={cn(
                        "py-4", // Reduced slightly from 5 for tighter feel
                        colIndex === 0 && !selectable ? "pl-8 font-medium text-foreground" : "",
                        colIndex === 0 && selectable ? "font-medium text-foreground" : "",
                        colIndex === columns.length - 1 ? "pr-8 text-right" : "text-muted-foreground",
                        col.className
                      )}
                    >
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? (item[col.accessorKey] as ReactNode)
                        : null}
                    </TableCell>
                  ))}
                </AnimatedTableRow>
              )
            })}
          </TableBody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-1 py-2">
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => {})}
          />
        </div>
      )}
    </div>
  )
}

