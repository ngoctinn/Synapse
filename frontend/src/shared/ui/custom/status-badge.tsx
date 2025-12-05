import { cn } from "@/shared/lib/utils"

interface StatusBadgeProps {
  isActive: boolean
  activeText?: string
  inactiveText?: string
  className?: string
}

export function StatusBadge({
  isActive,
  activeText = "Hoạt động",
  inactiveText = "Ẩn",
  className
}: StatusBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300",
      isActive
        ? "bg-primary/5 text-primary border-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.1)]"
        : "bg-muted/50 text-muted-foreground border-border/50",
      className
    )}>
      {isActive ? (
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20 animate-pulse"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]"></span>
          </span>
          {activeText}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40"></span>
          {inactiveText}
        </span>
      )}
    </div>
  )
}
