"use client";

import {
  type SelectionConfig,
  type SortConfig,
} from "@/shared/lib/design-system.types";
import { getNestedValue } from "@/shared/lib/object-utils";
import { cn } from "@/shared/lib/utils";
import { Checkbox } from "@/shared/ui/checkbox";
import { Badge } from "@/shared/ui/badge";
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
import { useTableKeyboard } from "@/shared/lib/table-utils";
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

// Fix Issue #12: Error State
interface ErrorState {
  title: string;
  message: string;
  retry?: () => void;
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

  // Fix Issue #12: Error handling
  error?: ErrorState;

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
  error, // Fix lint: add error to destructuring

  // Grouped configs
  selection,
  sort,

  onRowClick,
}: DataTableProps<T>) {
  const isSelectable = !!selection;

  // Fix Issue #5: Keyboard navigation
  const { handleKeyDown } = useTableKeyboard({
    rowCount: data.length,
    onEnter: (index: number) => {
      if (selection && index >= 0 && index < data.length) {
        const item = data[index];
        const id = keyExtractor(item);
        selection.onToggleOne(id);
      }
    },
    onEscape: () => {
      if (selection?.onToggleAll && selection.isAllSelected) {
        selection.onToggleAll();
      }
    },
    disabled: disabled || isLoading,
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Fix Issue #10: Sticky header - remove overflow-hidden from container
  const containerClasses = cn(
    "relative w-full",
    disabled && "pointer-events-none opacity-60 grayscale",
    variant === "default" && "border rounded-lg shadow-sm bg-background",
    className
  );

  const effectiveColumnCount = isSelectable
    ? columns.length + 1
    : columns.length;

  // Fix Issue #12: Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-destructive mb-2 text-lg font-semibold">{error.title}</div>
        <p className="text-muted-foreground mb-4 text-center text-sm">{error.message}</p>
        {error.retry && (
          <button
            onClick={error.retry}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  // Fix Issue #3: Loading transitions - add fade animation
  if (isLoading) {
    return (
      <div className="animate-in fade-in duration-200">
        <DataTableSkeleton
          columnCount={effectiveColumnCount}
          rowCount={skeletonCount}
          searchable={false}
          filterable={false}
          showAction={variant !== "flush"}
          variant={variant}
        />
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={containerClasses}>
        {/* Fix Issue #10: Overflow-x-auto moved here for sticky header to work */}
        <div className="w-full overflow-x-auto overflow-y-visible">
          <Table>
            {/* Fix Issue #10: Sticky header with proper z-index */}
            <TableHeader className="bg-background sticky top-0 z-20 shadow-sm">
              <TableRow className="border-border/50 border-b hover:bg-transparent">
                {selection && (
                  <TableHead className="w-12 pl-6">
                    <div className="flex items-center gap-2">
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
                      {/* Fix Issue #6: Selection count indicator */}
                      {selection.isPartiallySelected && (
                        <Badge
                          variant="secondary"
                          className="h-5 px-1.5 text-[10px] font-medium"
                        >
                          {/* Get count from selectedIds if available */}
                          {(selection as any).selectedCount || 0}
                        </Badge>
                      )}
                    </div>
                  </TableHead>
                )}

                {columns.map((col, index) => {
                  const isSorted = sort?.column === col.accessorKey?.toString();
                  return (
                    <TableHead
                      key={index}
                      className={cn(
                        "text-muted-foreground hover:text-foreground transition-colors duration-200 h-12 font-medium",
                        index === 0 && !selection
                          ? "table-first-cell-padding"
                          : "",
                        index === columns.length - 1
                          ? "table-last-cell-padding"
                          : "",
                        col.sortable ? "cursor-pointer select-none" : "",
                        // Fix Issue #36: Highlight sorted column
                        isSorted && "text-foreground font-semibold",
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
                          <span className="flex h-4 w-4 items-center justify-center">
                            {/* Fix Issue #8: Smooth sort icon transitions */}
                            {isSorted ? (
                              sort?.direction === "asc" ? (
                                <ArrowUp className="text-primary h-3.5 w-3.5 transition-all duration-200" />
                              ) : (
                                <ArrowDown className="text-primary h-3.5 w-3.5 transition-all duration-200" />
                              )
                            ) : (
                              <ArrowUpDown className="text-muted-foreground/40 h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
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
                      "border-border/30 group border-b transition-all duration-200 last:border-0",
                      isClickable && "hover:bg-muted/40 cursor-pointer",
                      // Fix Issue #18: Increase selected row contrast
                      selected && "bg-primary/8 hover:bg-primary/12"
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
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
