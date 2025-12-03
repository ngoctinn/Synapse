"use client"

import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/ui/hover-card"
import { differenceInMinutes, format } from "date-fns"
import { vi } from "date-fns/locale"
import { motion } from "framer-motion"
import { Calendar, Clock, MessageSquare, Phone, Scissors, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Appointment } from "../types"
import { AppointmentStatusBadge } from "./appointment-status-badge"

interface AppointmentCardProps {
  appointment: Appointment
  style: React.CSSProperties
  staffColor: string
}

export function AppointmentCard({ appointment: apt, style, staffColor }: AppointmentCardProps) {
  const router = useRouter()
  // Safety check for appointment data
  if (!apt) return null

  const duration = differenceInMinutes(apt.endTime, apt.startTime)
  const isShort = duration < 45

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02, zIndex: 50 }}
          className={cn(
            "absolute left-0.5 right-0.5 rounded-md overflow-hidden cursor-pointer z-10 shadow-sm transition-all duration-200 border",
            "hover:shadow-md hover:ring-1 hover:ring-offset-0 hover:ring-blue-200",
            isShort ? "flex items-center px-1.5 py-0" : "flex flex-col justify-start px-1.5 py-1"
          )}
          style={style}
        >
          {/* Background and Border styling using staffColor class */}
          <div className={cn("absolute inset-0 opacity-20", staffColor)} />
          <div className={cn("absolute left-0 top-0 bottom-0 w-0.5", staffColor.replace("bg-", "bg-opacity-100 bg-"))} />

          <div className="relative z-10 w-full overflow-hidden">
            <div className="font-semibold truncate text-[10px] text-slate-800 leading-tight">
              {apt.customerName || "Khách hàng"}
            </div>

            {!isShort && (
              <>
                <div className="truncate text-[9px] text-slate-600 font-medium mt-0.5 opacity-90">
                  {apt.serviceName || "Dịch vụ"}
                </div>
                {duration >= 60 && (
                  <div className="text-[8px] mt-0.5 text-slate-500 flex items-center gap-0.5 font-medium bg-white/60 w-fit px-1 py-0 rounded-full backdrop-blur-sm">
                    <Clock className="h-2 w-2" />
                    {format(apt.startTime, "HH:mm")} - {format(apt.endTime, "HH:mm")}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </HoverCardTrigger>

      {/* Enhanced Tooltip Content */}
      <HoverCardContent className="w-72 p-0 overflow-hidden shadow-xl border-slate-200 rounded-lg z-50" align="start" side="right" sideOffset={5}>
        {/* Header */}
        <div className="bg-slate-50/80 backdrop-blur-sm p-3 border-b flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
             <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${apt.customerId}`} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xs">{(apt.customerName || "?")[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold text-sm text-slate-900">{apt.customerName}</div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Phone className="h-2.5 w-2.5" /> 0987 654 321
              </div>
            </div>
          </div>
          <AppointmentStatusBadge status={apt.status} />
        </div>

        {/* Body */}
        <div className="p-3 space-y-3 bg-white">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                <Scissors className="h-2.5 w-2.5" /> Dịch vụ
              </div>
              <div className="text-xs font-medium text-slate-700 truncate" title={apt.serviceName}>
                {apt.serviceName}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                <User className="h-2.5 w-2.5" /> Bác sĩ
              </div>
              <div className="text-xs font-medium text-slate-700 truncate" title={apt.staffName}>
                {apt.staffName}
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="bg-slate-50 rounded-md p-2 flex items-center justify-between border border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-700">
                  {format(apt.startTime, "HH:mm")} - {format(apt.endTime, "HH:mm")}
                </div>
                <div className="text-[9px] text-slate-500 capitalize">
                  {format(apt.startTime, "EEEE, dd/MM/yyyy", { locale: vi })}
                </div>
              </div>
            </div>
            <div className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
              {duration} phút
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button variant="outline" size="sm" className="w-full text-xs h-8">
              <MessageSquare className="h-3 w-3 mr-2" />
              Nhắn tin
            </Button>
            <Button className="w-full text-xs h-8 bg-slate-900 hover:bg-slate-800 shadow-sm" size="sm" onClick={() => router.push(`?action=view&id=${apt.id}`)}>
              Xem chi tiết
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
