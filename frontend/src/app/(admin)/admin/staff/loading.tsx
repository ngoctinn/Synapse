import { Skeleton } from "@/shared/ui/skeleton"

export default function Loading() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex-1 bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
