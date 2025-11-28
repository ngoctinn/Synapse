"use client"

import { cn } from "@/shared/lib/utils"
import { useDroppable } from "@dnd-kit/core"
import { addDays, format, startOfWeek } from "date-fns"
import { vi } from "date-fns/locale"
import { MOCK_SHIFTS } from "../../data/mock-shifts"
import { Schedule, Staff } from "../../types"

interface ScheduleGridProps {
  staffList: Staff[]
  schedules: Schedule[]
  currentDate: Date
}

export function ScheduleGrid({ staffList, schedules, currentDate }: ScheduleGridProps) {
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i))

  return (
    <div className="border rounded-md overflow-hidden bg-white shadow-sm">
      {/* Header Row */}
      <div className="grid grid-cols-[200px_repeat(7,1fr)] bg-muted/50 border-b">
        <div className="p-3 font-medium text-sm border-r flex items-center">Nhân viên</div>
        {weekDays.map((day) => (
          <div key={day.toString()} className="p-3 text-center border-r last:border-r-0">
            <div className="text-xs text-muted-foreground capitalize">
              {format(day, "EEEE", { locale: vi })}
            </div>
            <div className="font-semibold text-sm">
              {format(day, "dd/MM")}
            </div>
          </div>
        ))}
      </div>

      {/* Staff Rows */}
      <div className="divide-y">
        {staffList.map((staff) => (
          <div key={staff.id} className="grid grid-cols-[200px_repeat(7,1fr)] group">
            {/* Staff Info */}
            <div className="p-3 border-r flex items-center gap-3 bg-card group-hover:bg-muted/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                 {/* Avatar placeholder */}
                 <img src={staff.avatarUrl} alt={staff.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{staff.name}</span>
                <span className="text-xs text-muted-foreground truncate">{staff.role}</span>
              </div>
            </div>

            {/* Days Cells */}
            {weekDays.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd")
              const cellId = `${staff.id}:${dateStr}`
              const schedule = schedules.find(
                (s) => s.staffId === staff.id && s.date === dateStr
              )
              const shift = schedule ? MOCK_SHIFTS.find((s) => s.id === schedule.shiftId) : null

              return (
                <DroppableCell key={cellId} id={cellId} shift={shift} />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

interface DroppableCellProps {
  id: string
  shift: any // Replace with Shift type
}

function DroppableCell({ id, shift }: DroppableCellProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-1 border-r last:border-r-0 min-h-[60px] relative transition-colors",
        isOver ? "bg-primary/10 ring-2 ring-inset ring-primary/50" : "bg-background hover:bg-muted/20"
      )}
    >
      {shift ? (
        <div
          className={cn(
            "h-full w-full rounded-md p-2 text-xs font-medium border flex flex-col justify-center gap-1",
            shift.type === "OFF" ? "bg-muted text-muted-foreground border-dashed" : "bg-card text-card-foreground shadow-sm"
          )}
          style={shift.type !== "OFF" ? { borderLeftColor: shift.color, borderLeftWidth: "4px" } : undefined}
        >
          <span className="truncate">{shift.name}</span>
          <span className="text-[10px] opacity-80">{shift.startTime} - {shift.endTime}</span>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center text-muted-foreground/20 text-xs">
          +
        </div>
      )}
    </div>
  )
}
