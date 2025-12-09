"use client"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
    Calendar,
    Clock,
    MoreHorizontal,
    Scissors
} from "lucide-react"
import { useMemo } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table"

import { cn } from "@/shared/lib/utils"
import { Appointment, AppointmentStatus, Resource } from "../types"

interface AppointmentTableProps {
  appointments: Appointment[]
  resources: Resource[]
  onEdit: (appointment: Appointment) => void
  onCancel: (appointment: Appointment) => void
}

const getStatusConfig = (status: AppointmentStatus) => {
  switch (status) {
    case 'pending':
      return { label: 'Chờ xác nhận', variant: 'outline' as const, className: "bg-status-pending text-status-pending-foreground border-status-pending-border" }
    case 'confirmed':
      return { label: 'Đã xác nhận', variant: 'outline' as const, className: "bg-status-confirmed text-status-confirmed-foreground border-status-confirmed-border" }
    case 'serving':
      return { label: 'Đang phục vụ', variant: 'outline' as const, className: "bg-status-serving text-status-serving-foreground border-status-serving-border animate-pulse" }
    case 'completed':
      return { label: 'Hoàn thành', variant: 'outline' as const, className: "bg-status-completed text-status-completed-foreground border-status-completed-border" }
    case 'cancelled':
      return { label: 'Đã hủy', variant: 'outline' as const, className: "bg-status-cancelled text-status-cancelled-foreground border-status-cancelled-border" }
    case 'no-show':
      return { label: 'Vắng mặt', variant: 'outline' as const, className: "bg-status-noshow text-status-noshow-foreground border-status-noshow-border" }
    default:
      return { label: status, variant: 'outline' as const, className: "" }
  }
}

export function AppointmentTable({
  appointments,
  resources,
  onEdit,
  onCancel
}: AppointmentTableProps) {


  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
  }, [appointments])

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10 border-dashed">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">Chưa có lịch hẹn nào</h3>
        <p className="text-muted-foreground mt-1 max-w-sm">
          Danh sách lịch hẹn trống. Hãy tạo lịch hẹn mới hoặc thay đổi bộ lọc.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-[250px]">Khách hàng</TableHead>
            <TableHead className="w-[200px]">Dịch vụ</TableHead>
            <TableHead className="w-[200px]">Kỹ thuật viên</TableHead>
            <TableHead className="w-[200px]">Thời gian</TableHead>
            <TableHead className="w-[150px]">Trạng thái</TableHead>
            <TableHead className="w-[50px] text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAppointments.map((appointment) => {
            const statusConfig = getStatusConfig(appointment.status)
            const resource = resources.find(r => r.id === appointment.resourceId)

            return (
              <TableRow key={appointment.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">

                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                        {appointment.customerName.split(' ').pop()?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-foreground">
                        {appointment.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-1">

                        KH-{(appointment.id).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-purple-50 text-purple-600 shrink-0">
                      <Scissors className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium line-clamp-1" title={appointment.serviceName}>
                      {appointment.serviceName}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                     {resource ? (
                        <>
                           <Avatar className="h-6 w-6">
                              <AvatarImage src={resource.avatar} />
                              <AvatarFallback className="text-[10px]">
                                {resource.name.charAt(0)}
                              </AvatarFallback>
                           </Avatar>
                           <span className="text-sm text-muted-foreground">{resource.name}</span>
                        </>
                     ) : (
                        <span className="text-sm text-muted-foreground/50 italic">Chưa chỉ định</span>
                     )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {format(appointment.startTime, "dd/MM/yyyy", { locale: vi })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {format(appointment.startTime, "HH:mm")} - {format(appointment.endTime, "HH:mm")}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={statusConfig.variant}
                    className={cn("whitespace-nowrap font-semibold", statusConfig.className)}
                  >
                    {statusConfig.label}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mở menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(appointment)}>
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onCancel(appointment)}
                      >
                        Hủy lịch hẹn
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
