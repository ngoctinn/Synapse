import { Badge } from "@/shared/ui/badge"
import { AppointmentStatus } from "../types"

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus
}

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  confirmed: {
    label: "Đã xác nhận",
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  pending: {
    label: "Chờ xác nhận",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
  },
  completed: {
    label: "Hoàn thành",
    className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
  },
}

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
