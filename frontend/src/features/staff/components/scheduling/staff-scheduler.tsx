"use client"

import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { addDays, format, startOfWeek } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { MOCK_SCHEDULES } from "../../data/mock-schedules"
import { MOCK_SHIFTS } from "../../data/mock-shifts"
import { MOCK_STAFF } from "../../data/mock-staff"
import { Schedule, Shift } from "../../types"
import { CopyWeekButton } from "./copy-week-button"
import { DraggableShift } from "./draggable-shift"
import { ScheduleGrid } from "./schedule-grid"

export function StaffScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [schedules, setSchedules] = useState<Schedule[]>(MOCK_SCHEDULES)
  const [activeShift, setActiveShift] = useState<Shift | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "shift") {
      setActiveShift(event.active.data.current.shift as Shift)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveShift(null)

    if (!over) return

    const shift = active.data.current?.shift as Shift
    const cellId = over.id as string // Format: "staffId:date"
    const [staffId, dateStr] = cellId.split(":")

    if (shift && staffId && dateStr) {
      setSchedules((prev) => {
        // Remove existing schedule for this cell if any
        const filtered = prev.filter(
          (s) => !(s.staffId === staffId && s.date === dateStr)
        )

        // Add new schedule
        const newSchedule: Schedule = {
          id: Math.random().toString(36).substr(2, 9),
          staffId,
          date: dateStr,
          shiftId: shift.id,
          status: "DRAFT",
        }

        return [...filtered, newSchedule]
      })
    }
  }

  const handleCopyWeek = () => {
    // Mock logic: just duplicate existing schedules for demo
    console.log("Copying previous week...")
  }

  const nextWeek = () => setCurrentDate((d) => addDays(d, 7))
  const prevWeek = () => setCurrentDate((d) => addDays(d, -7))
  const resetToday = () => setCurrentDate(new Date())

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = addDays(weekStart, 6)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 h-full">
        {/* Sidebar: Shifts Source */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Ca làm việc mẫu</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {MOCK_SHIFTS.map((shift) => (
                <DraggableShift key={shift.id} shift={shift} />
              ))}
            </CardContent>
          </Card>

          <div className="p-4 bg-muted/30 rounded-lg text-xs text-muted-foreground">
            <p>Kéo thả các ca làm việc vào lưới bên phải để xếp lịch.</p>
          </div>
        </div>

        {/* Main: Schedule Grid */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium w-[200px] text-center">
                {format(weekStart, "dd/MM")} - {format(weekEnd, "dd/MM/yyyy")}
              </div>
              <Button variant="outline" size="icon" onClick={nextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={resetToday}>
                Hôm nay
              </Button>
            </div>
            <CopyWeekButton onCopy={handleCopyWeek} />
          </div>

          <ScheduleGrid
            staffList={MOCK_STAFF}
            schedules={schedules}
            currentDate={currentDate}
          />
        </div>
      </div>

      <DragOverlay>
        {activeShift ? (
          <div
            className="flex items-center justify-center p-3 rounded-md shadow-lg border text-sm font-medium bg-card text-card-foreground opacity-80 w-[200px]"
            style={{ borderLeftColor: activeShift.color, borderLeftWidth: "4px" }}
          >
            {activeShift.name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
