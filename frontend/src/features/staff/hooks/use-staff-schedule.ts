"use client"

import { addDays, format, startOfWeek } from "date-fns"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Schedule, Shift } from "../model/types"

interface UseStaffScheduleProps {
  initialSchedules: Schedule[]
}

import { batchUpdateSchedule } from "../actions"
import { useScheduleCalculation } from "./use-schedule-calculation"

export function useStaffSchedule({ initialSchedules }: UseStaffScheduleProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // State 1: Server Truth (Committed)
  const [serverSchedules, setServerSchedules] = useState<Schedule[]>(initialSchedules)

  // State 2: Local Draft (Creating/Deleting)
  const [localSchedules, setLocalSchedules] = useState<Schedule[]>(initialSchedules)
  const [isPending, startTransition] = useTransition()

  const { isDirty, calculateDiff } = useScheduleCalculation(serverSchedules, localSchedules)

  const nextWeek = () => setCurrentDate((d) => addDays(d, 7))
  const prevWeek = () => setCurrentDate((d) => addDays(d, -7))
  const resetToday = () => setCurrentDate(new Date())

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = addDays(weekStart, 6)

  const addShift = async (staffId: string, date: Date, shift: Shift) => {
    const dateStr = format(date, "yyyy-MM-dd")

    setLocalSchedules((prev) => {
      // Remove any existing schedule for this slot first (overwrite)
      const filtered = prev.filter(
        (s) => !(s.staffId === staffId && s.date === dateStr)
      )

      const newSchedule: Schedule = {
        id: "temp_" + Math.random().toString(36).substr(2, 9), // Temp ID
        staffId: staffId,
        date: dateStr,
        shiftId: shift.id,
        status: "DRAFT",
        customShift: shift.id.startsWith("custom_") ? shift : undefined,
        shift: shift // Store full shift object for display
      }
      return [...filtered, newSchedule]
    })
  }

  const removeSchedule = async (scheduleId: string) => {
    setLocalSchedules((prev) => prev.filter((s) => s.id !== scheduleId))
  }

  const removeScheduleBySlot = async (staffId: string, dateStr: string) => {
     setLocalSchedules((prev) => prev.filter(
        (s) => !(s.staffId === staffId && s.date === dateStr)
     ))
  }

  const saveChanges = () => {
      if (!isDirty) return

      const { creates, deletes } = calculateDiff()

      startTransition(async () => {
          const result = await batchUpdateSchedule(creates, deletes)

          if (result.success) {
              toast.success(result.message)
              // Commit changes: Local becomes new Server Truth
              setServerSchedules(localSchedules)
          } else {
              toast.error(result.error)
          }
      })
  }

  const cancelChanges = () => {
      setLocalSchedules(serverSchedules)
      toast.info("Đã hủy bỏ các thay đổi chưa lưu")
  }

  return {
    state: {
      currentDate,
      weekStart,
      weekEnd,
      schedules: localSchedules, // Display local drafts
      isPending,
      isDirty
    },
    actions: {
        nextWeek,
        prevWeek,
        resetToday,
        addShift,
        removeSchedule,
        removeScheduleBySlot,
        saveChanges,
        cancelChanges
    }
  }
}
