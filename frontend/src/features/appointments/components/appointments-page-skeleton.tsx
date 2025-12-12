// frontend/src/features/appointments/components/appointments-page-skeleton.tsx
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

export function AppointmentsPageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-64 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>

      {/* Calendar Area */}
      <div className={cn(
        "flex-1 rounded-xl border bg-card p-4 flex flex-col gap-4",
        "h-[calc(100vh-200px)]" // Adjust height as needed
      )}>
        {/* Days/Timeline Header */}
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-8 rounded-md" />
          ))}
        </div>
        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-7 gap-2">
          {[...Array(24)].map((_, timeIdx) => (
            <div key={timeIdx} className="col-span-7 grid grid-cols-7 gap-2">
              {[...Array(7)].map((_, dayIdx) => (
                <Skeleton key={`${timeIdx}-${dayIdx}`} className="h-12 rounded-md" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
