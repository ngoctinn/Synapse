"use client"

import { useRef, useEffect } from "react"
import { format, isToday, getHours, getMinutes } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/shared/lib/utils"
import { Appointment } from "../types"
import { AppointmentCard } from "./appointment-card"
import { useRouter } from "next/navigation"
import { START_HOUR, ROW_HEIGHT } from "../constants"

interface CalendarGridProps {
  days: Date[]
  hours: number[]
  dailyAppointments: Record<string, Appointment[]>
  getAppointmentStyle: (apt: Appointment) => React.CSSProperties
  getAppointmentColor: (staffId: string) => string
}

export function CalendarGrid({ 
  days, 
  hours, 
  dailyAppointments, 
  getAppointmentStyle,
  getAppointmentColor
}: CalendarGridProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const timeIndicatorRef = useRef<HTMLDivElement>(null)

  // Cuộn đến thời gian hiện tại khi mount
  useEffect(() => {
    if (timeIndicatorRef.current) {
      timeIndicatorRef.current.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }, [])

  return (
    <div className="flex-1 overflow-auto relative scroll-smooth" ref={containerRef}>
      <div className="min-w-[800px]">
        {/* Days Header: Tiêu đề các ngày trong tuần */}
        <div className="grid grid-cols-8 border-b sticky top-0 z-20 shadow-sm bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
          <div className="p-4 border-r text-xs font-medium text-muted-foreground text-center pt-6">
            GMT+7
          </div> 
          {days.map((day) => (
            <div 
              key={day.toString()} 
              className={cn(
                "p-3 text-center border-r last:border-r-0 transition-colors",
                isToday(day) ? "bg-blue-50/30" : "bg-transparent"
              )}
            >
              <div className={cn(
                "text-xs font-medium uppercase mb-1",
                isToday(day) ? "text-blue-600" : "text-muted-foreground"
              )}>
                {format(day, "EEE", { locale: vi })}
              </div>
              <div className={cn(
                "text-xl font-normal h-10 w-10 rounded-full flex items-center justify-center mx-auto transition-all duration-300",
                isToday(day) ? "bg-blue-600 text-white shadow-md scale-110" : "text-slate-700"
              )}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Time Slots & Appointments: Các khung giờ và lịch hẹn */}
        <div className="relative">
          <div className="grid grid-cols-8">
            {/* Time Column: Cột hiển thị giờ bên trái */}
            <div className="border-r bg-slate-50/50">
              {hours.map((hour) => (
                <div 
                  key={hour} 
                  className="border-b border-slate-100 text-xs text-muted-foreground p-2 text-center relative"
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  <span className="-top-2.5 left-0 right-0 absolute font-medium">{hour}:00</span>
                </div>
              ))}
            </div>

            {/* Days Columns: Các cột ngày chứa lịch hẹn */}
            {days.map((day) => {
              const dayKey = format(day, "yyyy-MM-dd")
              const dayAppointments = dailyAppointments[dayKey] || []
              
              return (
                <div key={day.toString()} className="border-r last:border-r-0 relative group bg-white">
                  {/* Grid Lines: Đường kẻ ngang phân chia giờ */}
                  {hours.map((hour) => (
                    <div 
                      key={hour} 
                      className="border-b border-slate-100/60 group-hover:bg-slate-50/30 transition-colors cursor-pointer hover:bg-blue-50/20 active:bg-blue-50/40"
                      style={{ height: `${ROW_HEIGHT}px` }}
                      onClick={() => {
                        const dateStr = format(day, "yyyy-MM-dd")
                        const timeStr = `${hour.toString().padStart(2, '0')}:00`
                        router.push(`?action=create&date=${dateStr}&time=${timeStr}`)
                      }}
                      title={`Tạo lịch hẹn lúc ${hour}:00 ngày ${format(day, "dd/MM")}`}
                    />
                  ))}

                  {/* Current Time Indicator: Chỉ báo giờ hiện tại */}
                  {isToday(day) && (
                    <div 
                      ref={timeIndicatorRef}
                      className="absolute w-full border-t-2 border-blue-500 z-10 pointer-events-none shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                      style={{
                        top: `${((getHours(new Date()) - START_HOUR) * 60 + getMinutes(new Date())) / 60 * ROW_HEIGHT}px`
                      }}
                    >
                      <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.6)] animate-pulse ring-2 ring-white" />
                    </div>
                  )}

                  {/* Appointments: Hiển thị các lịch hẹn */}
                  {dayAppointments.map((apt) => (
                    <AppointmentCard 
                      key={apt.id}
                      appointment={apt}
                      style={getAppointmentStyle(apt)}
                      staffColor={getAppointmentColor(apt.staffId)}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
