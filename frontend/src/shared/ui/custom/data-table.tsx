"use client";

import {
  type SelectionConfig,
  type SortConfig,
} from "@/shared/lib/design-system.types";
import { getNestedValue } from "@/shared/lib/object-utils";
import { cn } from "@/shared/lib/utils";
import { Checkbox } from "@/shared/ui/checkbox";
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { PaginationControls } from "@/shared/ui/custom/pagination-controls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { ReactNode } from "react";

export interface Column<T> {
  header: string | ReactNode;
  accessorKey?: keyof T | string; // Allow string for nested keys
  id?: string; // For sorting/identifying when accessorKey is nested
  cell?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  emptyState?: ReactNode;
  className?: string;
  variant?: "default" | "flush";
  isLoading?: boolean;
  skeletonCount?: number;
  disabled?: boolean;

  // ─────────────────────────────────────────────────────────────────────────
  // Selection - Grouped config (recommended)
  // ─────────────────────────────────────────────────────────────────────────
  /** Grouped selection config */
  selection?: SelectionConfig;

  // ─────────────────────────────────────────────────────────────────────────
  // Sorting - Grouped config (recommended)
  // ─────────────────────────────────────────────────────────────────────────
  /** Grouped sort config */
  sort?: SortConfig;

  onRowClick?: (item: T) => void;
  hidePagination?: boolean;
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
  hidePagination = false,

  // Grouped configs
  selection,
  sort,

  onRowClick,
}: DataTableProps<T>) {
  const isSelectable = !!selection;

  // ─────────────────────────────────────────────────────────────────────────
  const containerClasses = cn(
    "relative w-full overflow-hidden",
    disabled && "pointer-events-none opacity-60 grayscale",
    variant === "default" && "border rounded-lg shadow-premium-sm bg-background",
    className
  );

  const effectiveColumnCount = isSelectable
    ? columns.length + 1
    : columns.length;

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={effectiveColumnCount}
        rowCount={skeletonCount}
        searchable={false}
        filterable={false}
        showAction={variant !== "flush"}
        variant={variant}
      />
    );
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={containerClasses}>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-background sticky top-0 z-10">
              <TableRow className="border-border/60 border-b hover:bg-transparent">
                {selection && (
                  <TableHead className="w-12 pl-6">
                    <Checkbox
                      checked={selection.isAllSelected}
                      // @ts-expect-error - indeterminate is valid
                      indeterminate={
                        selection.isPartiallySelected ? "true" : undefined
                      }
                      onCheckedChange={selection.onToggleAll}
                      aria-label="Chọn tất cả"
                      className="translate-y-[2px]"
                    />
                  </TableHead>
                )}

                {columns.map((col, index) => {
                  const isSorted = sort?.column === col.accessorKey?.toString();
                  return (
                    <TableHead
                      key={index}
                      className={cn(
                        "text-muted-foreground hover:text-foreground/80 h-12 font-medium transition-colors",
                        index === 0 && !selection
                          ? "table-first-cell-padding"
                          : "",
                        index === columns.length - 1
                          ? "table-last-cell-padding"
                          : "",
                        col.sortable ? "cursor-pointer select-none" : "",
                        col.headerClassName
                      )}
                      onClick={() => {
                        if (col.sortable && sort?.onSort && col.accessorKey) {
                          sort.onSort(col.accessorKey.toString());
                        }
                      }}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          index === columns.length - 1 && "justify-end"
                        )}
                      >
                        {col.header}
                        {col.sortable && (
                          <span className="flex h-4 w-4 flex-col items-center justify-center">
                            {isSorted ? (
                              sort?.direction === "asc" ? (
                                <ArrowUp className="text-primary animate-fade-zoom h-3.5 w-3.5" />
                              ) : (
                                <ArrowDown className="text-primary animate-fade-zoom h-3.5 w-3.5" />
                              )
                            ) : (
                              <ArrowUpDown className="text-muted-foreground/30 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => {
                const itemId = keyExtractor(item);
                const selected = selection?.isSelected(itemId) ?? false;
                const isClickable = !!onRowClick;

                return (
                  <AnimatedTableRow
                    key={itemId}
                    index={index}
                    className={cn(
                      "border-border/40 group border-b transition-colors last:border-0",
                      isClickable && "hover:bg-muted/50 cursor-pointer",
                      selected && "bg-primary/5 hover:bg-primary/10"
                    )}
                    onClick={() => {
                      if (onRowClick) onRowClick(item);
                    }}
                  >
                    {/* Checkbox Cell */}
                    {selection && (
                      <TableCell
                        className="w-12 pl-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selected}
                          onCheckedChange={() => selection.onToggleOne(itemId)}
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
                          colIndex === 0 && !selection
                            ? "table-first-cell-padding text-foreground font-medium"
                            : "",
                          colIndex === 0 && selection
                            ? "text-foreground font-medium"
                            : "",
                          colIndex === columns.length - 1
                            ? "table-last-cell-padding"
                            : "text-muted-foreground",
                          col.className
                        )}
                      >
                        {col.cell
                          ? col.cell(item)
                          : col.accessorKey
                            ? (getNestedValue(
                                item,
                                col.accessorKey
                              ) as ReactNode)
                            : null}
                      </TableCell>
                    ))}
                  </AnimatedTableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      {!hidePagination && totalPages > 1 && onPageChange && (
        <div className="py-2">
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
