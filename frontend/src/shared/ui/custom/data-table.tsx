"use client"

import { cn } from "@/shared/lib/utils"
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
}: DataTableProps<T>) {
  const containerClasses = cn(
    "relative bg-background",
    variant === "default" && "border rounded-xl shadow-sm",
    className
  )

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={columns.length}
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
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className={cn(
                    "bg-transparent h-14 font-medium text-muted-foreground",
                    index === 0 ? "pl-8" : "",
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
            {data.map((item, index) => (
              <AnimatedTableRow
                key={keyExtractor(item)}
                index={index}
                className="group hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0"
              >
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={cn(
                      "py-5",
                      colIndex === 0 ? "pl-8 font-medium" : "",
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
            ))}
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
