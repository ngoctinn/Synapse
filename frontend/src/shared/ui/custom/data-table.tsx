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
import { ReactNode } from "react"

export interface Column<T> {
  header: string | ReactNode
  accessorKey?: keyof T
  cell?: (item: T) => ReactNode
  className?: string
  headerClassName?: string
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
          <TableHeader className="sticky top-[var(--header-height-mobile,109px)] md:top-[var(--header-height,57px)] z-20 bg-background shadow-sm after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border/50">
            <TableRow className="hover:bg-transparent border-none">
              {/* Checkbox Header */}
              {selectable && (
                <TableHead className="w-12 pl-6 bg-transparent">
                  <Checkbox
                    checked={isAllSelected}
                    // @ts-expect-error - indeterminate is valid
                    indeterminate={isPartiallySelected}
                    onCheckedChange={onToggleAll}
                    aria-label="Chọn tất cả"
                    className="translate-y-[2px]"
                  />
                </TableHead>
              )}

              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className={cn(
                    "bg-transparent h-14 font-medium text-muted-foreground",
                    // Nếu có selectable thì không cần pl-8 cho cột đầu
                    index === 0 && !selectable ? "pl-8" : "",
                    index === columns.length - 1 ? "pr-8 text-right" : "",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
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
                    "group hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0",
                    selected && "bg-primary/5 hover:bg-primary/10"
                  )}
                >
                  {/* Checkbox Cell */}
                  {selectable && (
                    <TableCell className="w-12 pl-6">
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
                        "py-5",
                        colIndex === 0 && !selectable ? "pl-8 font-medium" : "",
                        colIndex === 0 && selectable ? "font-medium" : "",
                        colIndex === columns.length - 1 ? "pr-8 text-right" : "",
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
        <div className="px-1">
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
