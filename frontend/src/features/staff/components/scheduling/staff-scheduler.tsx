"use client"

import { addDays, format, startOfWeek } from "date-fns"
import { ChevronLeft, ChevronRight, Eraser, Paintbrush, X } from "lucide-react"
import { useState, useTransition } from "react"

import { Button } from "@/shared/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover"
import { toast } from "sonner"
import { deleteSchedule, updateSchedule } from "../../actions"
import { MOCK_SHIFTS } from "../../data/mock-shifts"
import { Schedule, Shift, Staff } from "../../types"
import { AddShiftDialog } from "./add-shift-dialog"
import { CopyWeekButton } from "./copy-week-button"
import { ScheduleGrid } from "./schedule-grid"

interface StaffSchedulerProps {
  initialSchedules: Schedule[]
  staffList: Staff[]
  className?: string
}

export function StaffScheduler({ initialSchedules, staffList, className }: StaffSchedulerProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules)
  const [isPending, startTransition] = useTransition()

  // Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{ staffId: string, date: Date } | null>(null)

  const handleAddClick = (staffId: string, date: Date) => {
    setSelectedCell({ staffId, date })
    setIsAddDialogOpen(true)
  }

  const handleAddShift = async (shift: Shift) => {
    if (!selectedCell) return

    const dateStr = format(selectedCell.date, "yyyy-MM-dd")

    // Check if schedule already exists to update or create new
    const existingSchedule = schedules.find(
      (s) => s.staffId === selectedCell.staffId && s.date === dateStr
    )

    const newSchedule: Schedule = {
      id: existingSchedule ? existingSchedule.id : Math.random().toString(36).substr(2, 9),
      staffId: selectedCell.staffId,
      date: dateStr,
      shiftId: shift.id,
      status: "DRAFT",
      customShift: shift
    } as any

    // Optimistic Update
    setSchedules((prev) => {
      const filtered = prev.filter(
        (s) => !(s.staffId === selectedCell.staffId && s.date === dateStr)
      )
      return [...filtered, newSchedule]
    })

    // Server Action
    startTransition(async () => {
      const result = await updateSchedule(newSchedule)
      if (result.success) {
        toast.success("Đã cập nhật lịch làm việc")
      } else {
        toast.error(result.error)
        // Revert optimistic update on error
        setSchedules((prev) => prev.filter((s) => s.id !== newSchedule.id))
      }
    })
  }

  const handleRemoveSchedule = async (scheduleId: string) => {
    // Optimistic Update
    setSchedules((prev) => prev.filter((s) => s.id !== scheduleId))

    // Server Action
    startTransition(async () => {
      const result = await deleteSchedule(scheduleId)
      if (result.success) {
        toast.success("Đã xóa lịch làm việc")
      } else {
        toast.error(result.error)
        // Revert optimistic update on error? (Complex to revert delete without storing deleted item)
        // For now, we just show error. In a real app, we might fetch fresh data.
      }
    })
  }

  const handleCopyWeek = () => {
    // Tính năng sao chép tuần đang phát triển
    toast.info("Tính năng sao chép tuần đang phát triển")
  }

  const nextWeek = () => setCurrentDate((d) => addDays(d, 7))
  const prevWeek = () => setCurrentDate((d) => addDays(d, -7))
  const resetToday = () => setCurrentDate(new Date())

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = addDays(weekStart, 6)

  const selectedStaffName = selectedCell
    ? (staffList.find(s => s.user_id === selectedCell.staffId)?.user.full_name ?? undefined)
    : undefined

  const selectedDateStr = selectedCell
    ? format(selectedCell.date, "dd/MM/yyyy")
    : undefined

  // Paint Mode State
  const [selectedTool, setSelectedTool] = useState<Shift | "eraser" | null>(null)
  const [isPaintOpen, setIsPaintOpen] = useState(false)

  const handlePaint = async (staffId: string, date: Date) => {
    if (!selectedTool) return

    const dateStr = format(date, "yyyy-MM-dd")
    const existingSchedule = schedules.find(
        (s) => s.staffId === staffId && s.date === dateStr
    )

    if (selectedTool === "eraser") {
        if (existingSchedule) {
            // Optimistic Delete
            setSchedules((prev) => prev.filter((s) => s.id !== existingSchedule.id))
            // Server Delete
            startTransition(async () => {
                const result = await deleteSchedule(existingSchedule.id)
                if (!result.success) toast.error(result.error)
            })
        }
        return
    }

    // Add or Update
    const newSchedule: Schedule = {
        id: existingSchedule ? existingSchedule.id : Math.random().toString(36).substr(2, 9),
        staffId: staffId,
        date: dateStr,
        shiftId: selectedTool.id,
        status: "DRAFT",
        customShift: selectedTool
    } as any

    // Optimistic Update
    setSchedules((prev) => {
        const filtered = prev.filter(
            (s) => !(s.staffId === staffId && s.date === dateStr)
        )
        return [...filtered, newSchedule]
    })

    // Server Update
    startTransition(async () => {
        const result = await updateSchedule(newSchedule)
        if (!result.success) {
            toast.error(result.error)
            // Revert optimistic update
            setSchedules((prev) => prev.filter((s) => s.id !== newSchedule.id))
        }
    })
  }

  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-4 py-3 border-b shrink-0 sticky top-[var(--staff-header-height-mobile,109px)] md:top-[var(--staff-header-height,57px)] z-20 bg-background">
        {/* Left: Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek} className="h-8 w-8 active:scale-95 transition-transform" aria-label="Tuần trước">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium w-[180px] text-center">
            {format(weekStart, "dd/MM")} - {format(weekEnd, "dd/MM/yyyy")}
          </div>
          <Button variant="outline" size="icon" onClick={nextWeek} className="h-8 w-8 active:scale-95 transition-transform" aria-label="Tuần sau">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={resetToday} className="h-8 text-xs active:scale-95 transition-transform">
            Hôm nay
          </Button>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-2 ml-auto xl:ml-0">
          {/* Paint Tools */}
          <Popover open={isPaintOpen} onOpenChange={setIsPaintOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`
                  h-8 gap-2 min-w-[140px] justify-between text-xs
                  ${selectedTool ? "border-primary/50 bg-primary/5 text-primary" : "text-muted-foreground"}
                `}
              >
                <div className="flex items-center gap-2">
                  <Paintbrush className="h-3.5 w-3.5" />
                  <span className="font-medium">
                    {selectedTool === "eraser"
                      ? "Đang xóa"
                      : selectedTool
                        ? selectedTool.name
                        : "Chế độ tô"}
                  </span>
                </div>
                {selectedTool && selectedTool !== "eraser" && (
                  <span
                    className="w-2 h-2 rounded-full ring-1 ring-offset-1"
                    style={{ backgroundColor: selectedTool.color, borderColor: selectedTool.color }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Chọn công cụ để tô
                </div>
                {MOCK_SHIFTS.map(shift => (
                  <button
                    key={shift.id}
                    onClick={() => {
                      setSelectedTool(current => current === shift ? null : shift)
                      setIsPaintOpen(false)
                    }}
                    className={`
                      w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer
                      focus:ring-2 focus:ring-primary/50 focus:outline-none
                      ${selectedTool === shift
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted text-foreground"}
                    `}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: shift.color }}
                    />
                    {shift.name}
                  </button>
                ))}
                <div className="h-px bg-border my-1" />
                <button
                  onClick={() => {
                    setSelectedTool(current => current === "eraser" ? null : "eraser")
                    setIsPaintOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer
                    focus:ring-2 focus:ring-destructive/50 focus:outline-none
                    ${selectedTool === "eraser"
                      ? "bg-destructive/10 text-destructive font-medium"
                      : "hover:bg-muted text-foreground"}
                  `}
                >
                  <Eraser className="h-4 w-4" />
                  Xóa lịch
                </button>
                {selectedTool && (
                  <>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => {
                        setSelectedTool(null)
                        setIsPaintOpen(false)
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      Tắt chế độ tô
                    </button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {selectedTool && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
              onClick={() => setSelectedTool(null)}
              aria-label="Tắt chế độ tô"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <div className="w-px h-4 bg-border mx-1" />

          <CopyWeekButton onCopy={handleCopyWeek} />
        </div>
      </div>
      <div className="flex-1 min-w-0 px-4">
        <ScheduleGrid
          staffList={staffList}
          schedules={schedules}
          currentDate={currentDate}
          onAddClick={handleAddClick}
          onRemoveClick={handleRemoveSchedule}
          selectedTool={selectedTool}
          onPaint={handlePaint}
        />
      </div>

      <AddShiftDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddShift={handleAddShift}
        staffName={selectedStaffName}
        dateStr={selectedDateStr}
      />
    </div>
  )
}
