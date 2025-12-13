import { Card, CardContent, CardHeader } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="size-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <div className="p-4 space-y-4">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
