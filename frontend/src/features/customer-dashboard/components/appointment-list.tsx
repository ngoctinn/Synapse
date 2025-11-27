"use client"

import { Appointment } from "@/features/customer-dashboard/types"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar, Clock, MapPin, User } from "lucide-react"

interface AppointmentListProps {
  appointments: Appointment[]
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Đang chờ", variant: "secondary" },
  CONFIRMED: { label: "Đã xác nhận", variant: "default" },
  COMPLETED: { label: "Hoàn thành", variant: "outline" },
  CANCELLED: { label: "Đã hủy", variant: "destructive" },
  NO_SHOW: { label: "Vắng mặt", variant: "destructive" },
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Chưa có lịch hẹn</h3>
        <p className="text-muted-foreground">Bạn chưa đặt lịch hẹn nào gần đây.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {appointments.map((appt) => (
        <Card key={appt.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold leading-none">
                  {appt.serviceName}
                </CardTitle>
                <CardDescription>
                  {format(new Date(appt.startTime), "EEEE, dd/MM/yyyy", { locale: vi })}
                </CardDescription>
              </div>
              <Badge variant={statusMap[appt.status].variant}>
                {statusMap[appt.status].label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {format(new Date(appt.startTime), "HH:mm")} ({appt.durationMinutes} phút)
              </span>
            </div>
            {appt.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{appt.location}</span>
              </div>
            )}
            {appt.technicianName && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>KTV: {appt.technicianName}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
