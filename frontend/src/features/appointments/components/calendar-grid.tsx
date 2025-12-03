"use client"

import { cn } from "@/shared/lib/utils"
import { format, getHours, getMinutes, isToday } from "date-fns"
import { vi } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { ROW_HEIGHT, START_HOUR } from "../constants"
import { Appointment } from "../types"
import { AppointmentCard } from "./appointment-card"

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
    <div className="flex-1 overflow-auto relative scroll-smooth bg-white" ref={containerRef}>
      <div className="min-w-[800px] flex flex-col">
        {/* Days Header: Tiêu đề các ngày trong tuần */}
        <div className="grid grid-cols-[50px_1fr] sticky top-0 z-30 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b shadow-sm">
          {/* Time Column Header */}
          <div className="border-r p-1 flex items-end justify-center pb-1 text-[10px] font-medium text-slate-400">
            GMT+7
          </div>

          {/* Days Columns Header */}
          <div className="grid grid-cols-7">
            {days.map((day) => (
              <div
                key={day.toString()}
                className={cn(
                  "py-2 px-1 text-center border-r last:border-r-0 transition-colors relative group",
                  isToday(day) ? "bg-blue-50/40" : "hover:bg-slate-50/50"
                )}
              >
                <div className={cn(
                  "text-[10px] font-semibold uppercase mb-0.5 tracking-wide",
                  isToday(day) ? "text-blue-600" : "text-slate-500"
                )}>
                  {format(day, "EEE", { locale: vi })}
                </div>
                <div className={cn(
                  "text-base font-medium h-7 w-7 rounded-full flex items-center justify-center mx-auto transition-all duration-300",
                  isToday(day) ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105" : "text-slate-700 group-hover:bg-slate-200/50"
                )}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slots & Appointments: Các khung giờ và lịch hẹn */}
        <div className="grid grid-cols-[50px_1fr] relative">
          {/* Time Column: Cột hiển thị giờ bên trái */}
          <div className="border-r bg-slate-50/30">
            {hours.map((hour) => (
              <div
                key={hour}
                className="border-b border-slate-100 text-[10px] font-medium text-slate-400 relative"
                style={{ height: `${ROW_HEIGHT}px` }}
              >
                <span className="-top-2 left-0 right-0 absolute text-center w-full">{hour}:00</span>
              </div>
            ))}
          </div>

          {/* Days Columns: Các cột ngày chứa lịch hẹn */}
          <div className="grid grid-cols-7 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 grid grid-rows-[repeat(24,1fr)] pointer-events-none z-0">
               {hours.map((hour) => (
                 <div key={`line-${hour}`} className="border-b border-slate-100 w-full" style={{ height: `${ROW_HEIGHT}px` }} />
               ))}
            </div>

            {days.map((day) => {
              const dayKey = format(day, "yyyy-MM-dd")
              const dayAppointments = dailyAppointments[dayKey] || []

              return (
                <div key={day.toString()} className="border-r last:border-r-0 relative group bg-transparent z-10">
                  {/* Interactive Slots */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="absolute w-full border-b border-transparent hover:border-slate-200/50 transition-colors cursor-pointer hover:bg-blue-50/30 active:bg-blue-50/50 z-0"
                      style={{
                        height: `${ROW_HEIGHT}px`,
                        top: `${(hour - START_HOUR) * ROW_HEIGHT}px`
                      }}
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
                      className="absolute w-full border-t border-red-500 z-20 pointer-events-none shadow-[0_0_4px_rgba(239,68,68,0.4)]"
                      style={{
                        top: `${((getHours(new Date()) - START_HOUR) * 60 + getMinutes(new Date())) / 60 * ROW_HEIGHT}px`
                      }}
                    >
                      <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-red-500 shadow-sm ring-1 ring-white" />
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
