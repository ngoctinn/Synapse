"use client"

import { addDays, format, startOfWeek } from "date-fns"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Schedule, Shift } from "../types"

interface UseStaffScheduleProps {
  initialSchedules: Schedule[]
}

import { batchUpdateSchedule } from "../actions"

export function useStaffSchedule({ initialSchedules }: UseStaffScheduleProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // State 1: Server Truth (Committed)
  const [serverSchedules, setServerSchedules] = useState<Schedule[]>(initialSchedules)

  // State 2: Local Draft (Creating/Deleting)
  // We track ALL schedules in 'schedules' for display (optimistic UI)
  // But we need to know WHICH ones are new or deleted to send Diff to server.
  // Actually simpler:
  // - localSchedules: The current full list being displayed
  // - On Save: Calc diff between serverSchedules and localSchedules

  const [localSchedules, setLocalSchedules] = useState<Schedule[]>(initialSchedules)
  const [isPending, startTransition] = useTransition()

  const nextWeek = () => setCurrentDate((d) => addDays(d, 7))
  const prevWeek = () => setCurrentDate((d) => addDays(d, -7))
  const resetToday = () => setCurrentDate(new Date())

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = addDays(weekStart, 6)

  // Computed: Is Dirty?
  // Naive check: stringify comparison (ok for small datasets like 1 week roster)
  // Better: check length different OR id sets different OR shift content different
  const isDirty = JSON.stringify(serverSchedules) !== JSON.stringify(localSchedules)

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

      // Calculate Diff
      const creates: Schedule[] = []
      const deletes: string[] = []

      // 1. Find items in local NOT in server (Creates)
      //    OR items in local that CHANGED from server (Updates - treated as create new for now since we overwrite slots)
      //    Actually simpler: For every slot on Local, if it differs from Server (or missing in Server), it's a Create/Update.
      //    For every slot on Server, if it's missing in Local, it's a Delete.

      // But we have IDs.
      // - If ID starts with "temp_", it's definitely a Create.
      // - If ID is real but missing in Local, it's a Delete.

      const localIds = new Set(localSchedules.map(s => s.id))

      // Deletes: Exists in Server but NOT in Local
      serverSchedules.forEach(s => {
          if (!localIds.has(s.id)) {
              deletes.push(s.id)
          }
      })

      // Creates: ID starts with "temp_" OR it's a real ID but we don't support partial updates yet, so we assume temp only for now.
      // Wait, if we overwrite a slot, we removed the old one (filtered out) and added a new one with Temp ID.
      // So logic holds: Temp ID = Create.

      localSchedules.forEach(s => {
          if (s.id.startsWith("temp_")) {
              creates.push(s)
          }
      })

      startTransition(async () => {
          const result = await batchUpdateSchedule(creates, deletes)

          if (result.success) {
              toast.success(result.message)
              // Commit changes: Local becomes new Server Truth
              // Note: In real app, we should reload from server to get real IDs.
              // For Mock, we just promote local to server (and keep temp ids? No, mock server doesn't return new IDs).
              // Let's just trust local state is now truth.
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
