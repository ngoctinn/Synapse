import { cn } from "@/shared/lib/utils"
import { addDays, format, isSameDay, startOfWeek } from "date-fns"
import { vi } from "date-fns/locale"
import { Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { MOCK_SHIFTS } from "../../data/mock-shifts"
import { Schedule, Shift, Staff } from "../../types"

interface ScheduleGridProps {
  staffList: Staff[]
  schedules: Schedule[]
  currentDate: Date
  onAddClick: (staffId: string, date: Date) => void
  onRemoveClick: (scheduleId: string) => void
  selectedTool?: Shift | "eraser" | null
  onPaint?: (staffId: string, date: Date) => void
}

export function ScheduleGrid({
  staffList,
  schedules,
  currentDate,
  onAddClick,
  onRemoveClick,
  selectedTool,
  onPaint
}: ScheduleGridProps) {
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i))
  const today = new Date()

  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (staffId: string, date: Date) => {
    if (selectedTool && onPaint) {
      setIsDragging(true)
      onPaint(staffId, date)
    }
  }

  const handleMouseEnter = (staffId: string, date: Date) => {
    if (isDragging && selectedTool && onPaint) {
      onPaint(staffId, date)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Global mouse up to catch release outside cells
  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp)
    return () => window.removeEventListener("mouseup", handleMouseUp)
  }, [])

  return (
    <div className="flex flex-col select-none">
      <div className="">
        <div className="min-w-[1000px]">
          {/* Header Row */}
          <div className="grid grid-cols-[220px_repeat(7,1fr)] bg-background border-b sticky top-[var(--staff-grid-header-mobile,166px)] md:top-[var(--staff-grid-header,114px)] z-30">
            <div className="p-4 font-medium text-sm border-r flex items-center text-muted-foreground sticky left-0 bg-background z-40 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">Nhân viên</div>
            {weekDays.map((day) => {
              const isToday = isSameDay(day, today)
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "p-3 text-center border-r last:border-r-0 flex flex-col justify-center transition-colors",
                    isToday ? "bg-primary/5" : ""
                  )}
                >
                  <div className={cn("text-xs capitalize mb-1", isToday ? "text-primary font-medium" : "text-muted-foreground")}>
                    {format(day, "EEEE", { locale: vi })}
                  </div>
                  <div className={cn("font-semibold text-sm", isToday ? "text-primary" : "")}>
                    {format(day, "dd/MM")}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Staff Rows */}
          <div className="divide-y">
            {staffList.map((staff) => (
              <div key={staff.user_id} className="grid grid-cols-[220px_repeat(7,1fr)] group hover:bg-muted/5 transition-colors">
                {/* Staff Info */}
                <div className="p-3 border-r flex items-center gap-3 bg-background group-hover:bg-muted/5 transition-colors sticky left-0 z-10 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                  <div className="w-9 h-9 rounded-full bg-muted overflow-hidden border shrink-0">
                     <img src={staff.user.avatar_url || ''} alt={staff.user.full_name || ''} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col overflow-hidden min-w-0">
                    <span className="text-sm font-medium truncate">{staff.user.full_name}</span>
                    <span className="text-xs text-muted-foreground truncate">{staff.user.role}</span>
                  </div>
                </div>

                {/* Days Cells */}
                {weekDays.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd")
                  const schedule = schedules.find(
                    (s) => s.staffId === staff.user_id && s.date === dateStr
                  )

                  let shift = schedule ? MOCK_SHIFTS.find((s) => s.id === schedule.shiftId) : null
                  if (schedule && !shift) {
                      shift = (schedule as any).customShift
                  }

                  const isToday = isSameDay(day, today)

                  return (
                    <div
                      key={day.toString()}
                      onMouseDown={() => handleMouseDown(staff.user_id, day)}
                      onMouseEnter={() => handleMouseEnter(staff.user_id, day)}
                      className={cn(
                        "p-1.5 border-r last:border-r-0 min-h-[72px] relative transition-all duration-200",
                        !schedule && isToday ? "bg-primary/[0.02]" : "",
                        !schedule && !isToday ? "bg-background hover:bg-muted/20" : "",
                        selectedTool ? "cursor-crosshair" : "cursor-default"
                      )}
                    >
                      {shift ? (
                        <div
                          className={cn(
                            "h-full w-full rounded-lg p-2 text-xs font-medium border flex flex-col justify-center gap-1 shadow-sm transition-all hover:shadow-md group/shift relative",
                            shift.type === "OFF"
                              ? "bg-muted/50 text-muted-foreground border-dashed"
                              : "bg-card text-card-foreground border-l-4",
                             selectedTool === "eraser" && isDragging ? "opacity-50" : ""
                          )}
                          style={shift.type !== "OFF" ? { borderLeftColor: shift.color } : undefined}
                        >
                          <span className="truncate font-semibold">{shift.name}</span>
                          <span className="text-[10px] opacity-80 flex items-center gap-1">
                            {shift.startTime} - {shift.endTime}
                          </span>

                          {!selectedTool && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onRemoveClick(schedule!.id)
                              }}
                              className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover/shift:opacity-100 transition-opacity flex items-center justify-center shadow-sm z-10"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          {!selectedTool && (
                            <button
                              onClick={() => onAddClick(staff.user_id, day)}
                              className="h-8 w-8 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
