"use client"

import { format } from "date-fns"
import { useState } from "react"

import { useSchedulerTools } from "../../hooks/use-scheduler-tools"
import { useStaffSchedule } from "../../hooks/use-staff-schedule"
import { Schedule, Shift, Staff } from "../../model/types"
import { AddShiftSheet } from "./add-shift-sheet"
import { ScheduleGrid } from "./schedule-grid"
import { SchedulerToolbar } from "./scheduler-toolbar"

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

  const toolState = useSchedulerTools()
  const { selectedTool } = toolState

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

  // const handleCopyWeek = () => {
  //   // Tính năng sao chép tuần đang phát triển
  //   toast.info("Tính năng sao chép tuần đang phát triển")
  // }

  const selectedStaffName = selectedCell
    ? (staffList.find(s => s.user_id === selectedCell.staffId)?.user.full_name ?? undefined)
    : undefined

  const selectedDateStr = selectedCell
    ? format(selectedCell.date, "dd/MM/yyyy")
    : undefined

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
      <SchedulerToolbar
        weekStart={weekStart}
        weekEnd={weekEnd}
        isDirty={isDirty}
        isPending={isPending}
        onPrevWeek={prevWeek}
        onNextWeek={nextWeek}
        onResetToday={resetToday}
        onCancelChanges={cancelChanges}
        onSaveChanges={saveChanges}

        // onCopyWeek={handleCopyWeek}
        toolState={toolState}
      />

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

      <AddShiftSheet
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddShift={handleAddShift}
        staffName={selectedStaffName}
        dateStr={selectedDateStr}
      />
    </div>
  )
}
