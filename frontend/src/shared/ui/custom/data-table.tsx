"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
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
import { ArrowDown, ArrowUp, ArrowUpDown, FileText } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;

  // Pagination
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  // If true, hide built-in pagination controls (e.g. if parent handles it or no pagination needed)
  hidePagination?: boolean;

  // Interaction
  onRowClick?: (row: TData) => void;

  // Selection
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (rowSelection: Record<string, boolean>) => void;
  getRowId?: (originalRow: TData, index: number, parent?: any) => string;

  className?: string;
  variant?: "default" | "flush";
  skeletonCount?: number;
  toolbar?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  emptyState,
  page = 1,
  totalPages = 1,
  onPageChange,
  hidePagination = false,
  onRowClick,
  rowSelection: externalRowSelection,
  onRowSelectionChange,
  getRowId,
  className,
  variant = "default",
  skeletonCount = 5,
  toolbar,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [internalRowSelection, setInternalRowSelection] = useState({});

  const rowSelection = externalRowSelection ?? internalRowSelection;
  const setRowSelection = onRowSelectionChange ?? setInternalRowSelection;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Client-side pagination if needed, but we mostly use server-side.
    // getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection as any,
    getRowId,
    state: {
      sorting,
      rowSelection,
    },
    manualPagination: true, // We handle pagination via props usually
    pageCount: totalPages,
  });

  const containerClasses = cn(
    "relative w-full overflow-hidden",
    isLoading && "pointer-events-none opacity-60 grayscale",
    variant === "default" && "border rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow duration-300",
    className
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="animate-in fade-in duration-200">
        <DataTableSkeleton
          columnCount={columns.length}
          rowCount={skeletonCount}
          searchable={false}
          filterable={false}
          showAction={variant !== "flush"}
          variant={variant}
        />
      </div>
    );
  }

  // Empty State
  if (data.length === 0) {
      if (emptyState) return <>{emptyState}</>;
      return (
        <div className={containerClasses}>
             <DataTableEmptyState
                icon={FileText}
                title="Không có dữ liệu"
                description="Chưa có dữ liệu nào để hiển thị."
             />
        </div>
      );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={containerClasses}>
        {toolbar}
        <div className="scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent w-full overflow-x-auto overflow-y-visible">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-20 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-border/50 hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    const isSortable = header.column.getCanSort();
                    return (
                      <TableHead key={header.id} className="h-11">
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              "flex items-center gap-2",
                              isSortable && "cursor-pointer select-none group",
                              // Center align or Right align based on column meta or simple convention could go here
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <span className="truncate font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                            </span>
                            {isSortable && (
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                                    {{
                                    asc: <ArrowUp className="text-primary h-3.5 w-3.5 transition-all duration-300" />,
                                    desc: <ArrowDown className="text-primary h-3.5 w-3.5 transition-all duration-300" />,
                                    }[header.column.getIsSorted() as string] ?? (
                                        <ArrowUpDown className="text-muted-foreground/40 h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                                    )}
                                </span>
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                        "group transition-colors",
                         // Match AnimatedTableRow behavior + selection styling
                        onRowClick && "cursor-pointer hover:bg-muted/50",
                        row.getIsSelected() && "bg-muted"
                    )}
                    onClick={() => onRowClick && onRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
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

// Re-export Column type for consumers
export type Column<T> = ColumnDef<T>;
