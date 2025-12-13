"use client"

import { differenceInMinutes, format, setHours, setMinutes } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock, MoreHorizontal, Plus } from "lucide-react"
import * as React from "react"

import { Appointment } from "@/features/customer-dashboard/types"
import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardHeader, CardTitle } from "@/shared/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"

interface TimelineConfig { startHour: number; endHour: number; step: number }

interface AppointmentTimelineProps {
  appointments: Appointment[]
  config?: Partial<TimelineConfig>
  onSlotClick?: (date: Date) => void
  onAppointmentClick?: (appointment: Appointment) => void
}

const DEFAULT_CONFIG: TimelineConfig = { startHour: 8, endHour: 20, step: 15 }

const roundToNearestStep = (date: Date, step: number) => {
  const minutes = date.getMinutes()
  const rounded = Math.round(minutes / step) * step
  return setMinutes(date, rounded)
}

const statusMap: Record<string, { label: string; className: string; bgClass: string; borderClass: string }> = {
  PENDING: { label: "Chờ xác nhận", className: "text-[var(--status-pending-foreground)]", bgClass: "bg-[var(--status-pending)]/20", borderClass: "border-[var(--status-pending-border)]" },
  CONFIRMED: { label: "Đã xác nhận", className: "text-[var(--status-confirmed-foreground)]", bgClass: "bg-[var(--status-confirmed)]/20", borderClass: "border-[var(--status-confirmed-border)]" },
  COMPLETED: { label: "Hoàn thành", className: "text-[var(--status-completed-foreground)]", bgClass: "bg-[var(--status-completed)]/20", borderClass: "border-[var(--status-completed-border)]" },
  CANCELLED: { label: "Đã hủy", className: "text-[var(--status-cancelled-foreground)]", bgClass: "bg-[var(--status-cancelled)]/20", borderClass: "border-[var(--status-cancelled-border)]" },
  NO_SHOW: { label: "Vắng mặt", className: "text-[var(--status-noshow-foreground)]", bgClass: "bg-[var(--status-noshow)]/20", borderClass: "border-[var(--status-noshow-border)]" }
}

interface LayoutItem extends Appointment {
  top: number
  height: number
  left: number
  width: number
  startMinutes: number
  endMinutes: number
}

const calculateLayout = (appointments: Appointment[], startHour: number, endHour: number): LayoutItem[] => {
  const totalMinutes = (endHour - startHour) * 60
  const sorted = [...appointments].sort((a, b) => {
    const diff = new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    if (diff !== 0) return diff
    return b.durationMinutes - a.durationMinutes
  })

  const items = sorted.map(app => {
    const date = new Date(app.startTime)
    const startOfDayTime = setMinutes(setHours(date, startHour), 0)
    const minutesFromStart = differenceInMinutes(date, startOfDayTime)
    const top = Math.max(0, (minutesFromStart / totalMinutes) * 100)
    const height = Math.min(100 - top, (app.durationMinutes / totalMinutes) * 100)
    return { ...app, top, height, left: 0, width: 100, startMinutes: minutesFromStart, endMinutes: minutesFromStart + app.durationMinutes }
  })

  const columns: LayoutItem[][] = []
  items.forEach(item => {
    let placed = false
    for (const column of columns) {
      const isOverlapping = column.some(existing => (item.startMinutes < existing.endMinutes) && (item.endMinutes > existing.startMinutes))
      if (!isOverlapping) { column.push(item); placed = true; break }
    }
    if (!placed) columns.push([item])
  })

  const result: LayoutItem[] = []
  columns.forEach((col, colIndex) => {
    col.forEach(item => {
        item.left = (colIndex / columns.length) * 100
        item.width = (1 / columns.length) * 100
        result.push(item)
    })
  })
  return result
}

export function AppointmentTimeline({ appointments, config = {}, onSlotClick, onAppointmentClick }: AppointmentTimelineProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const finalConfig = React.useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config])
  const [currentTime, setCurrentTime] = React.useState(new Date())
  const [hoverTime, setHoverTime] = React.useState<string | null>(null)

  React.useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const layoutItems = React.useMemo(() => calculateLayout(appointments, finalConfig.startHour, finalConfig.endHour), [appointments, finalConfig.startHour, finalConfig.endHour])

  const currentTimeStyle = React.useMemo(() => {
    const totalMinutes = (finalConfig.endHour - finalConfig.startHour) * 60
    const startOfDayTime = setMinutes(setHours(currentTime, finalConfig.startHour), 0)
    const minutesFromStart = differenceInMinutes(currentTime, startOfDayTime)
    if (minutesFromStart < 0 || minutesFromStart > totalMinutes) return null
    return { top: `${(minutesFromStart / totalMinutes) * 100}%` }
  }, [currentTime, finalConfig])

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !onSlotClick) return
    const rect = containerRef.current.getBoundingClientRect()
    const minutes = Math.round(((e.clientY - rect.top) / rect.height) * ((finalConfig.endHour - finalConfig.startHour) * 60))
    let clickTime = roundToNearestStep(setMinutes(setHours(new Date(), finalConfig.startHour), minutes), finalConfig.step)

    const startOfDay = setMinutes(setHours(new Date(), finalConfig.startHour), 0)
    const endOfDay = setMinutes(setHours(new Date(), finalConfig.endHour), 0)
    if (clickTime < startOfDay) clickTime = startOfDay
    if (clickTime > endOfDay) clickTime = endOfDay
    onSlotClick(clickTime)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const minutes = Math.round(((e.clientY - rect.top) / rect.height) * ((finalConfig.endHour - finalConfig.startHour) * 60))
      setHoverTime(format(roundToNearestStep(setMinutes(setHours(new Date(), finalConfig.startHour), minutes), finalConfig.step), "HH:mm"))
  }

  const hours = Array.from({ length: finalConfig.endHour - finalConfig.startHour + 1 }, (_, i) => finalConfig.startHour + i)

  return (
    <Card className="h-full border-none shadow-sm flex flex-col overflow-hidden bg-card/50">
      <CardHeader className="py-4 px-6 border-b shrink-0 bg-card z-10 sticky top-0">
         <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-serif">Lịch trình hôm nay</CardTitle>
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="hidden md:flex font-normal items-center gap-1">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {format(new Date(), "EEEE, dd/MM", { locale: vi })}
                </Badge>
                <Button size="sm" className="h-8" onClick={() => onSlotClick?.(new Date())}>
                    <Plus className="size-4 mr-1" /> Đặt mới
                </Button>
            </div>
         </div>
      </CardHeader>

      <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-background">
        <div className="flex min-h-[800px] h-full relative">
             <div className="w-16 shrink-0 flex flex-col border-r bg-muted/5 select-none z-20 bg-background" aria-hidden="true">
                {hours.map((hour) => (
                    <div key={hour} className="flex-1 border-b border-border/50 relative">
                        <span className="absolute -top-3 right-3 text-xs text-muted-foreground font-medium bg-background px-1">{hour}:00</span>
                    </div>
                ))}
            </div>

             <div
                ref={containerRef}
                className="flex-1 relative group cursor-pointer"
                onClick={handleGridClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverTime(null)}
                role="grid"
                tabIndex={0}
             >
                {hours.map((hour) => (
                    <div key={hour} className="absolute w-full border-b border-border/30 pointer-events-none" style={{ top: `${((hour - finalConfig.startHour) * 60 / ((finalConfig.endHour - finalConfig.startHour) * 60)) * 100}%` }} />
                ))}

                {hoverTime && (
                    <div className="absolute w-full border-t-2 border-dashed border-primary/40 z-0 pointer-events-none flex items-center" style={{ top: `${((parseInt(hoverTime.split(':')[0]) * 60 + parseInt(hoverTime.split(':')[1]) - finalConfig.startHour * 60) / ((finalConfig.endHour - finalConfig.startHour) * 60)) * 100}%` }}>
                        <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-r ml-0 font-medium shadow-sm animate-fade-in">{hoverTime}</span>
                    </div>
                )}

                {currentTimeStyle && (
                    <div className="absolute w-full border-t-2 border-red-500/80 z-20 pointer-events-none flex items-center transition-all duration-300" style={currentTimeStyle}>
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500 absolute -left-[5px] border-2 border-background animate-pulse" />
                    </div>
                )}

                {layoutItems.map((app) => {
                    const status = statusMap[app.status] || statusMap.PENDING
                    return (
                        <div
                            key={app.id}
                            className={cn("absolute rounded-md border p-2 text-xs md:text-sm shadow-sm transition-all hover:shadow-md hover:z-30 cursor-pointer overflow-hidden group/item focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none", status.bgClass, status.borderClass)}
                            style={{ top: `${app.top}%`, height: `${app.height}%`, left: `calc(${app.left}% + 4px)`, width: `calc(${app.width}% - 8px)` }}
                            onClick={(e) => { e.stopPropagation(); onAppointmentClick?.(app) }}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="flex items-start justify-between gap-1 h-full relative">
                                <div className={cn("absolute left-0 top-0 bottom-0 w-1", status.className.replace("text-", "bg-"))} />
                                <div className="flex flex-col h-full pl-2.5 w-full">
                                    <span className={cn("font-semibold line-clamp-1 leading-tight text-[11px] md:text-sm", status.className)}>{app.serviceName}</span>
                                    {app.height > 5 && (
                                        <div className="flex items-center gap-1.5 text-muted-foreground mt-1 text-[10px] md:text-xs">
                                            <Clock className="h-3 w-3" />
                                            <span className="truncate">{format(new Date(app.startTime), "HH:mm")} - {format(setMinutes(new Date(app.startTime), new Date(app.startTime).getMinutes() + app.durationMinutes), "HH:mm")}</span>
                                        </div>
                                    )}
                                    {app.technicianName && app.height > 10 && (
                                        <div className="hidden md:flex items-center gap-1.5 mt-auto pt-2">
                                            <Avatar className="size-4 border border-background">
                                                <AvatarFallback className="text-[8px] bg-primary/10 text-primary">{app.technicianName[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-muted-foreground truncate max-w-[120px] text-[11px]">{app.technicianName}</span>
                                        </div>
                                    )}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[32px] min-w-[32px] -mr-1 -mt-1 opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-black/5 focus:opacity-100">
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onAppointmentClick?.(app)}>Xem chi tiết</DropdownMenuItem>
                                        <DropdownMenuItem disabled={app.status === 'CANCELLED'}>Dời lịch</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Hủy hẹn</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )
                })}
             </div>
        </div>
      </div>
    </Card>
  )
}
