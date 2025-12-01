import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface DataTableEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function DataTableEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: DataTableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-white/50 backdrop-blur-sm border-dashed border-slate-300">
      <div className="p-4 rounded-full bg-blue-50 mb-4 animate-in zoom-in duration-500">
        <Icon className="w-10 h-10 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-2 mb-6">
        {description}
      </p>
      {action}
    </div>
  )
}
