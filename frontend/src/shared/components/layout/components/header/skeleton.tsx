import { Skeleton } from "@/shared/ui/skeleton"

export function HeaderAuthSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:block">
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      {/* Mobile skeleton if needed, but usually mobile menu handles its own state */}
    </div>
  )
}
