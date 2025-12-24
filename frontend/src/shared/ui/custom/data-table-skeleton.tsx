import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

interface DataTableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
  showAction?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  className?: string;
  variant?: "default" | "flush";
}

export function DataTableSkeleton({
  columnCount = 5,
  rowCount = 5,
  showAction = true,
  searchable = true,
  filterable = false,
  className,
  variant = "default",
}: DataTableSkeletonProps) {
  const showToolbar = showAction || searchable || filterable;

  return (
    <div
      className={cn(
        "overflow-hidden",
        variant === "default" && "bg-background rounded-md border shadow-sm",
        variant === "flush" &&
          "rounded-none border-none bg-transparent shadow-none",
        className
      )}
    >
      <div className="p-4">
        {/* Toolbar Skeleton */}
        {showToolbar && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              {searchable && <Skeleton className="h-10 w-64" />}
              {filterable && (
                <>
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </>
              )}
            </div>
            {showAction && <Skeleton className="h-10 w-32" />}
          </div>
        )}

        {/* Fix Issue #14: Table structure matches DataTable */}
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead key={i} className={cn(i === 0 && "pl-6")}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {Array.from({ length: columnCount }).map((_, colIdx) => (
                  <TableCell key={colIdx} className={cn(colIdx === 0 && "pl-6")}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
