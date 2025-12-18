import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"
import { cn } from "@/shared/lib/utils"

interface DataTableEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function DataTableEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: DataTableEmptyStateProps) {
  return (
    <div className={cn("empty-state-container", className)}>
      <div className="p-4 rounded-full bg-primary/10 mb-4 animate-in zoom-in duration-500">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
        {description}
      </p>
      {action}
    </div>
  )
}
