"use client"

import { cn } from "@/shared/lib/utils"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Eraser, Paintbrush, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/shared/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"
import { toast } from "sonner"
import { STAFF_HEADER_OFFSET_CLASS } from "../../constants"
import { MOCK_SHIFTS } from "../../data/shifts"
import { useStaffSchedule } from "../../hooks/use-staff-schedule"
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
  const {
      state: { currentDate, weekStart, weekEnd, schedules, isPending, isDirty },
      actions: { nextWeek, prevWeek, resetToday, addShift, removeSchedule, removeScheduleBySlot, saveChanges, cancelChanges }
  } = useStaffSchedule({ initialSchedules })


  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{ staffId: string, date: Date } | null>(null)

  const handleAddClick = (staffId: string, date: Date) => {
    setSelectedCell({ staffId, date })
    setIsAddDialogOpen(true)
  }

  const handleAddShift = async (shift: Shift) => {
    if (!selectedCell) return
    await addShift(selectedCell.staffId, selectedCell.date, shift)
  }

  const handleRemoveSchedule = async (scheduleId: string) => {
    await removeSchedule(scheduleId)
  }

  const handleCopyWeek = () => {
    // Tính năng sao chép tuần đang phát triển
    toast.info("Tính năng sao chép tuần đang phát triển")
  }

  const selectedStaffName = selectedCell
    ? (staffList.find(s => s.user_id === selectedCell.staffId)?.user.full_name ?? undefined)
    : undefined

  const selectedDateStr = selectedCell
    ? format(selectedCell.date, "dd/MM/yyyy")
    : undefined


  const [selectedTool, setSelectedTool] = useState<Shift | "eraser" | null>(null)
  const [isPaintOpen, setIsPaintOpen] = useState(false)

  const handlePaint = async (staffId: string, date: Date) => {
    if (!selectedTool) return

    const dateStr = format(date, "yyyy-MM-dd")

    if (selectedTool === "eraser") {
        await removeScheduleBySlot(staffId, dateStr)
        return
    }

    // Add or Update with selected shift
    await addShift(staffId, date, selectedTool)
  }

  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      <div className={cn("flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-4 py-3 border-b shrink-0 sticky z-50 bg-background", STAFF_HEADER_OFFSET_CLASS)}>
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


        <div className="flex items-center gap-2 ml-auto xl:ml-0">

          {/* Unsaved Changes Toolbar */}
          {isDirty && (
              <div className="flex items-center gap-2 mr-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <span className="text-xs text-muted-foreground hidden sm:inline-block">
                      Có thay đổi chưa lưu
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelChanges}
                    disabled={isPending}
                    className="h-8 text-xs hover:bg-destructive/10 hover:text-destructive"
                  >
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveChanges}
                    disabled={isPending}
                    className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 min-w-[80px]"
                  >
                    {isPending ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                  <div className="h-4 w-px bg-border mx-1" />
              </div>
          )}

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
                      : (typeof selectedTool === "object" && selectedTool !== null)
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

      {selectedTool && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-background border rounded-full shadow-lg p-1.5 pr-4 flex items-center gap-3 z-[60] animate-in fade-in slide-in-from-bottom-4 duration-200">
           <div
             className="w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground shadow-sm"
             style={{
               backgroundColor: typeof selectedTool === 'object' ? selectedTool.color : 'hsl(var(--destructive))'
             }}
           >
             {typeof selectedTool === 'object' ? <Paintbrush className="w-4 h-4" /> : <Eraser className="w-4 h-4" />}
           </div>
           <div className="flex flex-col">
             <span className="text-sm font-medium">
               {typeof selectedTool === 'object' ? `Đang tô: ${selectedTool.name}` : 'Chế độ Xóa'}
             </span>
             <span className="text-[10px] text-muted-foreground">
               Nhấp hoặc kéo thả để áp dụng
             </span>
           </div>
           <div className="h-4 w-px bg-border mx-1" />
           <Button
             variant="ghost"
             size="sm"
             onClick={() => setSelectedTool(null)}
             className="h-7 text-xs hover:bg-muted font-medium"
           >
             Xong
           </Button>
        </div>
      )}
    </div>
  )
}
