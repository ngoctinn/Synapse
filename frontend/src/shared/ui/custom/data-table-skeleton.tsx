import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

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
              {searchable && <Skeleton className="h-9 w-64" />}
              {filterable && (
                <>
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </>
              )}
            </div>
            {showAction && <Skeleton className="h-9 w-32" />}
          </div>
        )}

        {/* Table Header Skeleton */}
        <div className="mb-4 flex items-center gap-4 border-b px-4 py-2">
          {Array.from({ length: columnCount }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>

        {/* Table Body Skeleton */}
        <div className="space-y-3">
          {Array.from({ length: rowCount }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[30%]" />
                <Skeleton className="h-4 w-[20%]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
