"use client"

import { addDays, format, startOfWeek } from "date-fns"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { deleteSchedule, updateSchedule } from "../actions"
import { Schedule, Shift } from "../types"

interface UseStaffScheduleProps {
  initialSchedules: Schedule[]
}

export function useStaffSchedule({ initialSchedules }: UseStaffScheduleProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules)
  const [isPending, startTransition] = useTransition()

  // Week Navigation
  const nextWeek = () => setCurrentDate((d) => addDays(d, 7))
  const prevWeek = () => setCurrentDate((d) => addDays(d, -7))
  const resetToday = () => setCurrentDate(new Date())

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = addDays(weekStart, 6)

  // Actions
  const addShift = async (staffId: string, date: Date, shift: Shift) => {
    const dateStr = format(date, "yyyy-MM-dd")

    // Check if schedule already exists to update or create new
    const existingSchedule = schedules.find(
      (s) => s.staffId === staffId && s.date === dateStr
    )

    const newSchedule: Schedule = {
      id: existingSchedule ? existingSchedule.id : Math.random().toString(36).substr(2, 9),
      staffId: staffId,
      date: dateStr,
      shiftId: shift.id,
      status: "DRAFT",
      shift: shift // Using the properly typed optional property
    }

    // Optimistic Update
    setSchedules((prev) => {
      const filtered = prev.filter(
        (s) => !(s.staffId === staffId && s.date === dateStr)
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

  const removeSchedule = async (scheduleId: string) => {
    // Optimistic Update
    setSchedules((prev) => prev.filter((s) => s.id !== scheduleId))

    // Server Action
    startTransition(async () => {
      const result = await deleteSchedule(scheduleId)
      if (result.success) {
        toast.success("Đã xóa lịch làm việc")
      } else {
        toast.error(result.error)
        // Revert optimistic update on error?
        // For now, we just show error.
      }
    })
  }

  const removeScheduleBySlot = async (staffId: string, dateStr: string) => {
      const existingSchedule = schedules.find(
          (s) => s.staffId === staffId && s.date === dateStr
      )

      if (existingSchedule) {
          await removeSchedule(existingSchedule.id)
      }
  }

  return {
    state: {
      currentDate,
      weekStart,
      weekEnd,
      schedules,
      isPending
    },
    actions: {
        nextWeek,
        prevWeek,
        resetToday,
        addShift,
        removeSchedule,
        removeScheduleBySlot
    }
  }
}
