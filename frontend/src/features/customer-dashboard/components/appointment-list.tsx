"use client"

import { Appointment } from "@/features/customer-dashboard/types"
import { useReducedMotion } from "@/shared/hooks"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { motion, Variants } from "framer-motion"
import { Calendar, MapPin, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CancelBookingDialog } from "./booking/cancel-booking-dialog"

interface AppointmentListProps {
  appointments: Appointment[]
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  pending: { label: "Đang chờ", variant: "warning" },
  confirmed: { label: "Đã xác nhận", variant: "info" },
  completed: { label: "Hoàn thành", variant: "secondary" },
  cancelled: { label: "Đã hủy", variant: "destructive" },
  no_show: { label: "Vắng mặt", variant: "destructive" },
  // Uppercase fallback
  PENDING: { label: "Đang chờ", variant: "warning" },
  CONFIRMED: { label: "Đã xác nhận", variant: "info" },
  COMPLETED: { label: "Hoàn thành", variant: "secondary" },
  CANCELLED: { label: "Đã hủy", variant: "destructive" },
  NO_SHOW: { label: "Vắng mặt", variant: "destructive" },
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  const prefersReducedMotion = useReducedMotion()
  const router = useRouter()
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isCancelOpen, setIsCancelOpen] = useState(false)

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsCancelOpen(true)
  }

  const handleCancelSuccess = () => {
    router.refresh()
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
        <h3 className="mt-4 text-lg font-semibold">Chưa có lịch hẹn</h3>
        <p className="text-muted-foreground">Bạn chưa đặt lịch hẹn nào gần đây.</p>
      </div>
    )
  }

  // Conditional rendering based on motion preference
  const MotionContainer = prefersReducedMotion ? "div" : motion.div
  const MotionItem = prefersReducedMotion ? "div" : motion.div

  const containerProps = prefersReducedMotion
    ? {}
    : {
        variants: containerVariants,
        initial: "hidden" as const,
        animate: "show" as const,
      }

  const itemProps = prefersReducedMotion
    ? {}
    : {
        variants: itemVariants,
      }

  return (
    <>
      <MotionContainer
        {...containerProps}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
      >
        {appointments.map((appt) => (
          <MotionItem key={appt.id} {...itemProps}>
            <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/50 h-full focus-within:ring-2 focus-within:ring-primary">
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Badge variant={statusMap[appt.status]?.variant || "default"} className="mb-2">
                      {statusMap[appt.status]?.label || appt.status}
                    </Badge>
                    <CardTitle className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
                      {appt.serviceName}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 p-4 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                     <Calendar className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                     <span className="font-medium text-foreground">
                        {format(new Date(appt.startTime), "EEEE, dd/MM/yyyy", { locale: vi })}
                     </span>
                     <span className="text-xs">
                        {format(new Date(appt.startTime), "HH:mm")} ({appt.durationMinutes} phút)
                     </span>
                  </div>
                </div>

                {appt.location && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                       <MapPin className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span>{appt.location}</span>
                  </div>
                )}

                {appt.technicianName && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                       <User className="h-4 w-4" aria-hidden="true" />
                     </div>
                    <span>KTV: {appt.technicianName}</span>
                  </div>
                )}

                <div className="pt-2 mt-1 border-t flex gap-2 justify-end">
                  {(appt.status === "PENDING" || appt.status === "CONFIRMED" || appt.status === "pending" || appt.status === "confirmed") && (
                    <Button 
                       variant="ghost" 
                       size="sm" 
                       className="text-red-500 hover:text-red-600 hover:bg-red-50"
                       onClick={() => handleCancelClick(appt)}
                    >
                       Hủy
                    </Button>
                  )}
                   <Button variant="outline" size="sm" className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Xem chi tiết
                   </Button>
                </div>
              </CardContent>
            </Card>
          </MotionItem>
        ))}
      </MotionContainer>
      
      <CancelBookingDialog 
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        appointment={selectedAppointment}
        onSuccess={handleCancelSuccess}
      />
    </>
  )
}
