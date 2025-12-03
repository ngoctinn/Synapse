"use client"

import { Appointment } from "../types"
import { cn } from "@/shared/lib/utils"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { AppointmentStatusBadge } from "./appointment-status-badge"
import { Clock, User, Scissors, Phone, MessageSquare, CheckCircle2, Circle } from "lucide-react"
import { format, differenceInMinutes } from "date-fns"
import { vi } from "date-fns/locale"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface AppointmentCardProps {
  appointment: Appointment
  style: React.CSSProperties
  staffColor: string
}

export function AppointmentCard({ appointment: apt, style, staffColor }: AppointmentCardProps) {
  const router = useRouter()
  const duration = differenceInMinutes(apt.endTime, apt.startTime)
  const isShort = duration < 30

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02, zIndex: 50 }}
          className={cn(
            "absolute left-1 right-1 rounded-xl overflow-hidden cursor-pointer z-10 shadow-sm transition-all duration-200",
            "hover:shadow-md hover:ring-2 hover:ring-offset-1 border-l-4",
            isShort ? "flex items-center px-2 py-0" : "flex flex-col justify-start px-3 py-2"
          )}
          style={style}
        >
          {/* Background and Border styling using staffColor class */}
          {/* Tăng opacity lên 15 để màu rõ hơn một chút nhưng vẫn giữ nét pastel */}
          <div className={cn("absolute inset-0 opacity-15", staffColor)} />
          <div className={cn("absolute left-0 top-0 bottom-0 w-1", staffColor)} />
          
          <div className="relative z-10 w-full">
            <div className="font-bold truncate text-xs text-slate-800 leading-tight">
              {apt.customerName}
            </div>
            
            {!isShort && (
              <div className="truncate text-[11px] text-slate-600 font-medium mt-0.5">{apt.serviceName}</div>
            )}
            
            {!isShort && duration >= 60 && (
              <div className="text-[10px] mt-1 text-slate-500 flex items-center gap-1 font-medium bg-white/50 w-fit px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                <Clock className="h-3 w-3" />
                {format(apt.startTime, "HH:mm")} - {format(apt.endTime, "HH:mm")}
              </div>
            )}
          </div>
        </motion.div>
      </HoverCardTrigger>
      
      {/* Enhanced Tooltip Content */}
      <HoverCardContent className="w-80 p-0 overflow-hidden shadow-xl border-slate-200 rounded-xl" align="start" side="right">
        {/* Header */}
        <div className="bg-slate-50/80 backdrop-blur-sm p-4 border-b flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
             <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-slate-100">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${apt.customerId}`} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">{apt.customerName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold text-base text-slate-900">{apt.customerName}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> 0987 654 321
              </div>
            </div>
          </div>
          <AppointmentStatusBadge status={apt.status} />
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 bg-white">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Dịch vụ</div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Scissors className="h-4 w-4 text-slate-400" />
                {apt.serviceName}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Bác sĩ</div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <User className="h-4 w-4 text-slate-400" />
                {apt.staffName}
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between border border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-700">
                  {format(apt.startTime, "HH:mm")} - {format(apt.endTime, "HH:mm")}
                </div>
                <div className="text-[10px] text-slate-500">
                  {format(apt.startTime, "EEEE, dd/MM/yyyy", { locale: vi })}
                </div>
              </div>
            </div>
            <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              {duration} phút
            </div>
          </div>

          {/* Mock Timeline */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Quy trình điều trị</div>
            <div className="relative pl-4 border-l-2 border-slate-100 space-y-3 ml-1">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                <div className="text-xs font-medium text-slate-700">Check-in</div>
                <div className="text-[10px] text-slate-400">09:00</div>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-100" />
                <div className="text-xs font-medium text-slate-900">Điều trị</div>
                <div className="text-[10px] text-blue-600 font-medium">Đang thực hiện</div>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-200 border-2 border-white" />
                <div className="text-xs text-slate-400">Thanh toán</div>
                <div className="text-[10px] text-slate-400">--:--</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="outline" size="sm" className="w-full text-xs h-8">
              <MessageSquare className="h-3 w-3 mr-2" />
              Nhắn tin
            </Button>
            <Button className="w-full text-xs h-8 bg-slate-900 hover:bg-slate-800" size="sm" onClick={() => router.push(`?action=view&id=${apt.id}`)}>
              Xem chi tiết
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
