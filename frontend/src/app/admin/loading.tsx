import { Loader2 } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center px-6">
      <div className="surface-card w-full max-w-2xl rounded-xl border bg-background/80 px-6 py-5 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Đang tải trang quản trị...</span>
        </div>
      </div>
    </div>
  )
}
